import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Line2 } from "three/examples/jsm/Addons.js";

const VoxelPainter = () => {
  const [objects, setObjects] = useState([]);
  const isShiftDown = useRef(false);
  const rollOverMesh = useRef<THREE.Mesh>(null!);
  const cubeGeo = useRef(new THREE.BoxGeometry(50, 50, 50));
  const cubeMat = useRef(new THREE.MeshLambertMaterial({ color: 0xfeb74c }));
  const [rayData, setRayData] = useState<THREE.Vector3[] | null>(null);
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const { gl, size } = useThree();
  const {
    width: canvasWidth,
    height: canvasHeight,
    left: canvasLeft,
    top: canvasTop,
  } = size;
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const planeRef = useRef<THREE.PlaneGeometry>(null!);
  const lineRef = useRef<Line2>(null!);
  useEffect(() => {
    const element = gl.domElement;
    element.addEventListener("mousemove", onMouseMove);
    return () => {
      element.removeEventListener("mousemove", onMouseMove);
    };
  }, [camera, lineRef.current]);
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouse.x = ((e.clientX - canvasLeft) / canvasWidth) * 2 - 1;
      mouse.y = -((e.clientY - canvasTop) / canvasHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      setRayData([
        raycaster.ray.origin.clone(),
        raycaster.ray.origin
          .clone()
          .add(raycaster.ray.direction.multiplyScalar(1000)),
      ]);
    },
    [raycaster, camera]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        [planeRef.current as any],
        false
      );

      if (intersects.length > 0) {
        const intersect = intersects[0];
        rollOverMesh.current.position.copy(intersect.point);

        rollOverMesh.current.position
          .copy(intersect.point)
          .divideScalar(2)
          .floor()
          .multiplyScalar(2)
          .addScalar(1);
      }
    },
    [camera]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(
        [planeRef.current, ...objects],
        false
      );
      console.log("intersects", intersects);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (isShiftDown.current) {
          if (intersect.object !== planeRef.current) {
            scene.remove(intersect.object);
            setObjects((prev) =>
              prev.filter((obj) => obj !== intersect.object)
            );
          }
        } else {
          const voxel = new THREE.Mesh(cubeGeo.current, cubeMat.current);
          voxel.position.copy(intersect.point).add(intersect.face.normal);
          voxel.position.divideScalar(1).floor().multiplyScalar(1).addScalar(1);
          scene.add(voxel);
          setObjects((prev) => [...prev, voxel]);
        }
      }
    },
    [camera, objects, scene]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") isShiftDown.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") isShiftDown.current = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <mesh ref={rollOverMesh}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0xff0000} opacity={0.5} transparent />
      </mesh>
      <ambientLight intensity={3} />
      <gridHelper visible args={[1000, 20]} />
      <directionalLight position={[1, 0.75, 0.5]} intensity={3} />
      <mesh
        ref={planeRef}
        onPointerMove={onPointerMove}
        onClick={onPointerDown}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-10, 0.5, 10]}
      >
        <planeGeometry args={[10, 10, 1]} />
        <meshBasicMaterial wireframe={true} />
      </mesh>
      {rayData && (
        <Line ref={lineRef} points={rayData} color={"#ff00ff"} lineWidth={10} />
      )}
    </>
  );
};

export default VoxelPainter;
