"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import Map from "./partials/Map";
import CharacterController from "./CharacterController";
import CharacterLoaderAnimation from "../../utils/CharacterLoaderAnimation";

export enum CharacterAnimation {
  Idle = "Idle",
  Run = "Running",
  Walk = "Walking",
  Jump = "Jumping",
}

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const SceneInit = () => {
  const [characterAnimation, setCharacterAnimation] =
    useState<CharacterAnimation>(CharacterAnimation.Idle);
  return (
    <Canvas shadows camera={{ position: [0, 5, 10] }}>
      <Suspense fallback={null}>
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
            <CharacterController
              capsuleHalfHeight={0.6}
              capsuleRadius={0.3}
              maxVelLimit={3}
            >
              <CharacterLoaderAnimation
                model={"/3d-models/character-controller/character.glb"}
                animation={characterAnimation}
                props={{
                  position: [0, -0.9, 0],
                }}
              />
            </CharacterController>
          </KeyboardControls>
          <Map />
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default SceneInit;
