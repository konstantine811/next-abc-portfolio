"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Color } from "three";
import Earth from "./Earth";
import Clouds from "./Clouds";
import CloudOrbit from "./CloudOrbit";

const SceneInit = () => {
  const { intensity: sunIntensity, speed } = useControls("Sun Intensity", {
    intensity: {
      value: 5.8,
      min: 0.1,
      max: 15.0,
    },
    speed: { value: 10, min: 0, max: 100 },
  });
  return (
    <Canvas camera={{ position: [0, 0, 30] }}>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[-50, 0, 30]}
        color={new Color(0xffffff)}
        intensity={sunIntensity}
      />
      <Earth speed={speed / 1000} />
      {/* <CloudOrbit /> */}
      <OrbitControls />
    </Canvas>
  );
};

export default SceneInit;
