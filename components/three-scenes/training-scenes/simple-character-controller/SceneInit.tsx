"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import Map from "../character-controller/partials/Map";
import CharacterController from "./CharacterController";
import { Vector3 } from "three";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const SceneInit = () => {
  const characterRef = useRef<{
    getPosition: () => Vector3;
  }>(null!);

  return (
    <Canvas shadows camera={{ position: [0, 5, 10] }}>
      <Suspense fallback={null}>
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <ambientLight intensity={0.5} />
        {/* <CameraOrbitControls /> */}
        <Physics debug>
          <ambientLight intensity={1} />
          {/* <CameraController config={MODELS} /> */}
          <directionalLight
            position={[0, 30, 0]}
            intensity={5}
            castShadow
            shadow-mapSize-width={1024 * 2}
            shadow-mapSize-height={1024 * 2}
            shadow-camera-far={500}
            shadow-camera-left={-200}
            shadow-camera-right={200}
            shadow-camera-top={200}
            shadow-camera-bottom={-200}
          />
          <KeyboardControls map={keyboardMap}>
            {/* Character Control */}
            <CharacterController ref={characterRef} />
          </KeyboardControls>
          <Map />
          {/* <Grass characterRef={characterRef} /> */}
          {/* <GrassBlade /> */}
          {/* <GrassBladeV2 /> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default SceneInit;
