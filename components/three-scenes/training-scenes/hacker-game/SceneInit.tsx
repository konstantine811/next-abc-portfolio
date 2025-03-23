"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useState } from "react";
import CharacterController from "./CharacterController";
import Boxes from "./Boxes";
import CameraControlsProvider from "./CameraControls";
import CameraControls from "camera-controls";
import { useControls } from "leva";
import JoystickControlsProvider from "./JoystickController";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const SceneInit = () => {
  const [cameraControl, setCameraControl] = useState<CameraControls | null>(
    null
  );

  const { isDebugPhysics } = useControls({
    isDebugPhysics: { value: true, label: "Debug Physics" },
  });

  return (
    <>
      <JoystickControlsProvider />
      <Canvas shadows camera={{ position: [0, 5, 10] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <CameraControlsProvider onCameraControls={setCameraControl} />
          {/* <CameraController config={MODELS} /> */}
          <directionalLight position={[0, 30, 0]} intensity={5} castShadow />
          {/* <CameraOrbitControls /> */}
          <Physics debug={isDebugPhysics}>
            <Boxes />
            <KeyboardControls map={keyboardMap}>
              <CharacterController cameraControl={cameraControl} />
            </KeyboardControls>
            {/* Groud */}
            <RigidBody
              type="fixed"
              colliders="cuboid"
              rotation-x={-Math.PI / 2}
              userData={{ isGround: true }}
              name="ground"
            >
              <mesh>
                <planeGeometry args={[100, 100, 1]} />
                <meshStandardMaterial color="blue" />
              </mesh>
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default SceneInit;
