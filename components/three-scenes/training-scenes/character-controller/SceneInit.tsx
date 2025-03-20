"use client";

import { KeyboardControls, useTrailTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef, useState } from "react";
import Map from "./partials/Map";
import CharacterController from "./CharacterController";
import CharacterLoaderAnimation from "../../utils/CharacterLoaderAnimation";
import GrassBladeV2 from "../simple-character-controller/grasses/GrassBlade_v2";
import FootprintTexture from "../simple-character-controller/grasses/FootPrint";
import {
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  Texture,
  Vector2,
  WebGLRenderTarget,
} from "three";
import FootprintTextureDebug from "../simple-character-controller/grasses/FootPrintDebug";
import TrailTexture from "../simple-character-controller/grasses/TrailTexture";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import TrailCapsule from "../simple-character-controller/grasses/TrailCapsule";

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
  const currentPositionTextureRef = useRef<Texture>(null!);

  return (
    <Canvas shadows camera={{ position: [0, 5, 10] }}>
      <TrailCapsule
        isDebug
        onTextureUpdate={(texture) => {
          currentPositionTextureRef.current = texture;
        }}
      />
      {/* <FootprintTextureDebug /> */}
      {/* Площина з текстурою сліду */}
      {/* Компонент, що малює текстуру */}
      {/* <TrailTexture fadeSpeed={3} trailRT={footprintRT} /> */}

      {/* Відображення сліду на землі */}
      {/* <mesh position={[0, -2.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          map={footprintRT.current?.texture || null}
          color={"white"}
        />
      </mesh> */}
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
          <GrassBladeV2 currentPositionTextureRef={currentPositionTextureRef} />
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default SceneInit;
