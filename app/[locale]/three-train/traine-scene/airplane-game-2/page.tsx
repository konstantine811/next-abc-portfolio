"use client";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React from "react";
import SpacePlane from "./SpacePlane";
import Planet from "./Planet";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const Page = () => {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={1} />
      <OrbitControls />

      <Physics gravity={[0, 0, 0]}>
        <KeyboardControls map={keyboardMap}>
          <SpacePlane />
          <Planet position={[-15, 5, 5]} />
          <Planet position={[0, -10, 10]} />
        </KeyboardControls>
      </Physics>
    </Canvas>
  );
};

export default Page;
