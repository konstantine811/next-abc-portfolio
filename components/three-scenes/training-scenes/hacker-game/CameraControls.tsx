import { createContext, useContext, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import CameraControlsImpl from "camera-controls";
import * as THREE from "three";

CameraControlsImpl.install({ THREE });

const CameraControlsContext = createContext<CameraControlsImpl | null>(null);

export const useCameraControls = () => {
  const ctx = useContext(CameraControlsContext);
  if (!ctx)
    throw new Error(
      "useCameraControls must be used inside CameraControlsProvider"
    );
  return ctx;
};

export const CameraControlsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<CameraControlsImpl | null>(null);

  useEffect(() => {
    const controls = new CameraControlsImpl(camera, gl.domElement);
    controlsRef.current = controls;

    // можна встановити параметри за замовчуванням
    controls.minDistance = 6;
    controls.maxDistance = 20;

    return () => controls.dispose();
  }, [camera, gl]);

  useFrame((_, delta) => {
    controlsRef.current?.update(delta);
  });

  return (
    <CameraControlsContext.Provider value={controlsRef.current}>
      {children}
    </CameraControlsContext.Provider>
  );
};
