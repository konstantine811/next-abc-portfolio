import { useThree } from "@react-three/fiber";
import { use, useEffect, useMemo, useState } from "react";
import { Mesh, Object3D, Raycaster, Vector3 } from "three";

export interface UseFollowCamProps {
  disableFollowCam?: boolean;
  disableFollowCamPos?: { x: number; y: number; z: number };
  disableFollowCamTarget?: { x: number; y: number; z: number };
  camInitDis?: number;
  camMaxDis?: number;
  camMinDis?: number;
  camInitDir?: { x: number; y: number };
  camMovedSpeed?: number;
  camZoomSpeed?: number;
  camCollisionOffset?: number;
}

const useFollowCam = ({
  disableFollowCam = false,
  disableFollowCamPos = { x: 0, y: 0, z: 0 },
  disableFollowCamTarget = { x: 0, y: 0, z: 0 },
  camCollisionOffset = 0,
  camInitDir = { x: 0, y: 0 },
  camInitDis = 0,
  camMaxDis = 0,
  camMinDis = 0,
  camMovedSpeed = 0,
  camZoomSpeed = 0,
}: UseFollowCamProps) => {
  const { scene, camera, gl } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);
  let previousTouch1: Touch | null = null;
  let previousTouch2: Touch | null = null;
  const pivot = useMemo(() => new Object3D(), []);
  const followCam = useMemo(() => {
    const origin = new Object3D();
    origin.position.set(0, 0, camInitDis);
    return origin;
  }, [camInitDis]);

  // Camera collision detect setups
  let smallestDistance = null;
  let cameraDistance = null;
  let intersects = null;
  let intersectObjects: Object3D[] = [];
  const cameraRayDir = useMemo(() => new Vector3(), []);
  const cameraRayOrigin = useMemo(() => new Vector3(), []);
  const cameraPosition = useMemo(() => new Vector3(), []);
  const cameraLerpPoint = useMemo(() => new Vector3(), []);
  const camRayCast = new Raycaster(
    cameraRayOrigin,
    cameraRayDir,
    0,
    -camMaxDis
  );

  // Rappier ray setup (optional)
  // const rayCast = new rapier.Ray(cameraRayOrigin, cameraRayDir)
  //let rayLength = null;
  // let rayHit = null;

  // Mouse move event
  const onDocumentMouseMove = (event: MouseEvent) => {
    if (document.pointerLockElement || isMouseDown) {
      pivot.rotation.y -= event.movementX * 0.002 * camMovedSpeed;
      const vy = followCam.rotation.x + event.movementY * 0.002 * camMovedSpeed;

      cameraDistance = followCam.position.length();
      if (vy >= -0.5 && vy <= 1.5) {
        followCam.rotation.x = vy;
        followCam.position.y = -cameraDistance * Math.sin(-vy);
        followCam.position.z = -cameraDistance * Math.cos(-vy);
      }
    }
    return false;
  };

  // Mouse scroll event
  const onDocumentMouseWheel = (event: WheelEvent) => {
    const vz = camInitDis - event.deltaY * 0.002 * camZoomSpeed;
    const vy = followCam.rotation.x;
    if (vz >= camMaxDis && vz <= camMinDis) {
      camInitDis = vz;
      followCam.position.z = camInitDis * Math.cos(-vy);
      followCam.position.y = camInitDis * Math.sin(-vy);
    }
    return false;
  };

  // Touch end event
  const onTouchEnd = (e: TouchEvent) => {
    previousTouch1 = null;
    previousTouch2 = null;
  };
  // Touch move event
  const onTouchMove = (e: TouchEvent) => {
    // prevent swipe to navigate gesture
    e.preventDefault();
    e.stopImmediatePropagation();
    const touch1 = e.targetTouches[0];
    const touch2 = e.targetTouches[1];
    // One finger touch to rotate camera
    if (previousTouch1 && !previousTouch2) {
      const touch1MovementX = touch1.pageX - previousTouch1.pageX;
      const touch1MovementY = touch1.pageY - previousTouch1.pageY;
      pivot.rotation.y -= touch1MovementX * 0.005 * camMovedSpeed;
      const vy = followCam.rotation.x + touch1MovementY * 0.005 * camMovedSpeed;
      cameraDistance = followCam.position.length();
      if (vy >= -0.5 && vy <= 1.5) {
        followCam.rotation.x = vy;
        followCam.position.y = -cameraDistance * Math.sin(-vy);
        followCam.position.z = -cameraDistance * Math.cos(-vy);
      }
    }
    // Two fingers touch to zoom in/out camera
    if (previousTouch2 && previousTouch1) {
      const prePinchDis = Math.hypot(
        previousTouch1.pageX - previousTouch2.pageX,
        previousTouch1.pageY - previousTouch2.pageY
      );
      const pinchDis = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const vz = camInitDis - (prePinchDis - pinchDis) * 0.01 * camZoomSpeed;
      const vy = followCam.rotation.x;
      if (vz >= camMaxDis && vz <= camMinDis) {
        camInitDis = vz;
        followCam.position.z = camInitDis * Math.cos(-vy);
        followCam.position.y = camInitDis * Math.sin(-vy);
      }
    }
    previousTouch1 = touch1;
    previousTouch2 = touch2;
  };

  // Gamepad second joystick event
  const joystickCamMove = (movementX: number, movementY: number) => {
    pivot.rotation.y -= movementX * 0.005 * camMovedSpeed * 3;
    const vy = followCam.rotation.x + movementY * 0.005 * camMovedSpeed * 3;
    cameraDistance = followCam.position.length();

    if (vy >= -0.5 && vy <= 1.5) {
      followCam.rotation.x = vy;
      followCam.position.y = -cameraDistance * Math.sin(-vy);
      followCam.position.z = -cameraDistance * Math.cos(-vy);
    }
  };

  // Custom traverse function
  // Prepare intersect objects for camera collision detection
  function customTraverse(obj: Object3D) {
    if (obj.userData && obj.userData.camExculdeCollusion) {
      return;
    }
    // Check if object is a Mesh, and not Text ("InstanceBufferGeometry")
    if (
      (obj as Mesh).isMesh &&
      (obj as Mesh).geometry.type !== "InstanceBufferGeometry"
    ) {
      intersectObjects.push(obj);
    }
    // Recursively traverse children
    obj.children.forEach((child) => customTraverse(child));
  }

  // Camera collision detect function
  const cameraCollisionDetect = (delta: number) => {
    // Update collision detect ray origin and pointing direction
    // Which is from pivot point to camera position
    cameraRayOrigin.copy(pivot.position);
    camera.getWorldPosition(cameraPosition);
    cameraRayDir.subVectors(cameraPosition, pivot.position);
    // rayLength = cameraRayDir.length();
    // casting ray hit, if object in between character and camera,
    // change the smallestDistance to the ray hit toi
    // otherwise the smallestDistance is same as camera origin position (camInitDis)
    intersects = camRayCast.intersectObjects(intersectObjects);
    if (intersects.length && intersects[0].distance <= -camInitDis) {
      smallestDistance =
        -intersects[0].distance * camCollisionOffset < -0.7
          ? -intersects[0].distance * camCollisionOffset
          : -0.7;
    } else {
      smallestDistance = camInitDis;
    }

    // Rappier ray hit setup (optional)
    // rayHIt = world.castRay(rayCast, rayLength + 1, true, null, null, character);
    // if (rayHit && rayHit.toi && rayHit.toi > camInitDis) {
    //   smallestDistance = -rayHit.toi + 0.5;
    // } else if (rayHit === null) {
    //      smallestDistance = camInitDis;
    // }

    // Update camera next lerping position, and lerp the camera
    cameraLerpPoint.set(
      followCam.position.x,
      smallestDistance * Math.sin(-followCam.rotation.x),
      smallestDistance * Math.cos(-followCam.rotation.x)
    );

    followCam.position.lerp(cameraLerpPoint, delta * 4); // delta * 2 for rapier ray setup
  };

  // Initialize camera facing direction
  useEffect(() => {
    pivot.rotation.y = camInitDir.y;
    followCam.rotation.x = camInitDir.x;
  }, [camInitDir, followCam.rotation, pivot.rotation]);

  // Set camera position to (0, 0, 0), if followCam is disabled set to disableFollowCamPos (default 0, 0, -5)
  useEffect(() => {
    if (disableFollowCam) {
      camera.position.set(
        disableFollowCamPos.x,
        disableFollowCamPos.y,
        disableFollowCamPos.z
      );
      camera.lookAt(
        new Vector3(
          disableFollowCamTarget.x,
          disableFollowCamTarget.y,
          disableFollowCamTarget.z
        )
      );
    } else {
      camera.position.set(0, 0, 0);
    }
  }, [disableFollowCam, disableFollowCamPos, disableFollowCamTarget, camera]);

  useEffect(() => {
    // Prepare for camera ray intersect objects
    scene.children.forEach((child) => customTraverse(child));
    // Prepare for followCam and pivot point
    disableFollowCam ? followCam.remove(camera) : followCam.add(camera);
    pivot.add(followCam);

    gl.domElement.addEventListener("mousedown", () => {
      setIsMouseDown(true);
    });
    gl.domElement.addEventListener("mouseup", () => {
      setIsMouseDown(false);
    });
    gl.domElement.addEventListener("mousemove", onDocumentMouseMove);
    gl.domElement.addEventListener("wheel", onDocumentMouseWheel);
    // Touch event
    gl.domElement.addEventListener("touchend", onTouchEnd);
    gl.domElement.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    return () => {
      gl.domElement.removeEventListener("mousedown", () => {
        setIsMouseDown(true);
      });
      gl.domElement.removeEventListener("mouseup", () => {
        setIsMouseDown(false);
      });
      gl.domElement.removeEventListener("mousemove", onDocumentMouseMove);
      gl.domElement.removeEventListener("wheel", onDocumentMouseWheel);
      // Touch event
      gl.domElement.removeEventListener("touchend", onTouchEnd);
      gl.domElement.removeEventListener("touchmove", onTouchMove);
      // Remove camera from followCam
      followCam.remove(camera);
    };
  });

  return { pivot, followCam, cameraCollisionDetect, joystickCamMove };
};

export default useFollowCam;
