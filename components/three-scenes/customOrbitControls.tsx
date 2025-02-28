"use client";

import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";

enum MouseButtons {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

const CustomOrbitControls = () => {
  const { gl, camera } = useThree();

  const MIN_CAMERA_RADIUS = 2;
  const MAX_CAMERA_RADIUS = 10;
  const Y_AXIS = useRef(new Vector3(0, 1, 0));
  const cameraOrigin = useRef(new Vector3(0, 0, 0));
  const cameraRadius = useRef(4);
  const cameraAzimuth = useRef(0);
  const DEG2RAD = Math.PI / 180;
  const cameraElevation = useRef(0);
  const isLeftMouseDown = useRef(false);
  const isRightMouseDown = useRef(false);
  const isMiddleMouseDown = useRef(false);
  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);

  const updateCameraPosition = useCallback(() => {
    camera.zoom = cameraRadius.current;
    camera.position.x =
      cameraRadius.current *
      Math.sin(cameraAzimuth.current * DEG2RAD) *
      Math.cos(cameraElevation.current * DEG2RAD);
    camera.position.y =
      cameraRadius.current * Math.sin(cameraElevation.current * DEG2RAD);
    camera.position.z =
      cameraRadius.current *
      Math.cos(cameraAzimuth.current * DEG2RAD) *
      Math.cos(cameraElevation.current * DEG2RAD);
    camera.position.add(cameraOrigin.current);
    camera.lookAt(cameraOrigin.current);
    camera.updateMatrix();
  }, [camera, DEG2RAD, cameraOrigin]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === MouseButtons.LEFT) {
      isLeftMouseDown.current = true;
    }
    if (event.button === MouseButtons.RIGHT) {
      isRightMouseDown.current = true;
    }
    if (event.button === MouseButtons.MIDDLE) {
      isMiddleMouseDown.current = true;
    }
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (event.button === MouseButtons.LEFT) {
      isLeftMouseDown.current = false;
    }
    if (event.button === MouseButtons.RIGHT) {
      isRightMouseDown.current = false;
    }
    if (event.button === MouseButtons.MIDDLE) {
      isMiddleMouseDown.current = false;
    }
  }, []);

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      // handle the rotation of the camera
      const deltaX = ev.clientX - prevMouseX.current;
      const deltaY = ev.clientY - prevMouseY.current;
      if (isLeftMouseDown.current && !ev.shiftKey) {
        cameraAzimuth.current += -deltaX * 0.5;
        cameraElevation.current += deltaY * 0.5;
        cameraElevation.current = Math.min(
          180,
          Math.max(0, cameraElevation.current)
        );
        updateCameraPosition();
      }

      // handle the panning of the camera
      if (isLeftMouseDown.current && ev.shiftKey) {
        const forward = new Vector3(0, 0, 1).applyAxisAngle(
          Y_AXIS.current,
          cameraAzimuth.current * DEG2RAD
        );
        const left = new Vector3(1, 0, 0).applyAxisAngle(
          Y_AXIS.current,
          cameraAzimuth.current * DEG2RAD
        );
        cameraOrigin.current.add(forward.multiplyScalar(-deltaY * 0.01));
        cameraOrigin.current.add(left.multiplyScalar(-deltaX * 0.01));
        updateCameraPosition();
      }

      // handle the zooming of the camera
      if (isRightMouseDown.current) {
        // cameraRadius.current += deltaY * 0.02;
        // cameraRadius.current = Math.min(
        //   MAX_CAMERA_RADIUS,
        //   Math.max(MIN_CAMERA_RADIUS, cameraRadius.current)
        // );
        // updateCameraPosition();
      }

      prevMouseX.current = ev.clientX;
      prevMouseY.current = ev.clientY;
    },
    [
      cameraAzimuth,
      cameraElevation,
      updateCameraPosition,
      cameraOrigin,
      DEG2RAD,
      Y_AXIS,
    ]
  );

  const handleWheel = useCallback(
    (ev: MouseEvent) => {
      // handle the zooming of the camera
      const deltaY = ev.clientY - prevMouseY.current;
      cameraRadius.current *= 1 + deltaY * 0.02;
      cameraRadius.current = Math.min(
        MAX_CAMERA_RADIUS,
        Math.max(MIN_CAMERA_RADIUS, cameraRadius.current)
      );
      updateCameraPosition();
    },
    [updateCameraPosition]
  );
  useEffect(() => {
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("mouseup", handleMouseUp);
    gl.domElement.addEventListener("wheel", handleWheel);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  });
  return null;
};

export default CustomOrbitControls;
