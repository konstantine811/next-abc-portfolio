"use client";

import { Canvas } from "@react-three/fiber";
import Light from "./Light";
import Sea from "./Sea";
import Sky from "./Sky";
import AirPlane from "./AirPlane";
import { OrbitControls } from "@react-three/drei";

const seaRadius = 600;
const seaLength = 800;

const SceneInit = () => {
  const fogColor = "#f7d9aa";
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 100, 200],
        fov: 60,
        near: 1,
        far: 10000,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <fog attach="fog" args={[fogColor, 100, 950]} />
      <OrbitControls />
      <Light />
      <Sea radius={seaRadius} length={seaLength} />
      <Sky nClouds={20} seaRadius={seaRadius} />
      <AirPlane
        props={{
          scale: [0.25, 0.25, 0.25],
          position: [0, 100, 0],
        }}
      />
    </Canvas>
  );
};

export default SceneInit;
