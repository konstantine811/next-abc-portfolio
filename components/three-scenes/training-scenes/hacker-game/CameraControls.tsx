import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as THREE from "three";

CameraControls.install({ THREE });

const CameraControlsProvider = ({
  onCameraControls,
}: {
  onCameraControls: (camera: CameraControls) => void;
}) => {
  const { camera, gl } = useThree();
  const dispatch = useDispatch();
  const controlRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    const controls = new CameraControls(camera, gl.domElement);
    controls.maxDistance = 6;
    controls.minDistance = 3;
    controlRef.current = controls;
    onCameraControls(controls);
    return () => controls.dispose();
  }, [camera, gl, dispatch]);

  useFrame((_, delta) => {
    if (controlRef.current) controlRef.current.update(delta);
  });

  return null;
};

export default CameraControlsProvider;
