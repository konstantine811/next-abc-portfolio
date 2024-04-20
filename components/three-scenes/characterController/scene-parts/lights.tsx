"use client";

import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLight, DirectionalLightHelper } from "three";

const Lights = () => {
  const directionalLightRef = useRef<DirectionalLight>(null!);
  useHelper(directionalLightRef, DirectionalLightHelper, 1);
  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        castShadow
        shadow-normalBias={0.06}
        position={[20, 30, 10]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={50}
        shadow-camera-right={50}
        shadow-camera-bottom={50}
        shadow-camera-left={-50}
        name="followLight"
      />
      <ambientLight intensity={0.5} />
    </>
  );
};

export default Lights;
