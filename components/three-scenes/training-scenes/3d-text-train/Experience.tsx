"use client";
import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import TextScene from "./TextScene";

const Experience = () => {
  return (
    <Canvas camera={{ position: [0, 2, 12], fov: 42 }}>
      <group position-y={-1.5}>
        <TextScene />
      </group>
      <OrbitControls />
      <Environment preset="sunset" />
      <Sky />
    </Canvas>
  );
};

export default Experience;
