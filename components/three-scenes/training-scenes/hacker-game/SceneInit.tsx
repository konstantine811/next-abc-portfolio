"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import CharacterController from "./CharacterController";
import Boxes from "./Boxes";
import CameraControlsProvider from "./CameraControls";
import CameraControls from "camera-controls";
import { useControls } from "leva";
import JoystickController from "./JoystickController";
import KeyboardController from "./KeyboardController";
import { Key } from "lucide-react";
import { KeyboardControls, TransformControls } from "@react-three/drei";
import Room from "./Building/Room";
import AddInputModel from "./UI/AddInputModel";
import { Object3D } from "three";
import InstancedGrid from "./Building/InstancedGrid";
import TouchTerrain from "./Building/Terrain";
import VoxelPainter from "./Building/VoxelPainter";
import { RoomScene } from "./Building/RoomScene";

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

  const [models, setModels] = useState<Object3D[]>([]);

  const addModel = (object: Object3D) => {
    // Копіюємо позицію трохи випадково, щоб вони не накладались
    object.position.set(Math.random() * 2, 0, Math.random() * 2);
    setModels((prev) => [...prev, object]);
  };

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const { isDebugPhysics } = useControls({
    isDebugPhysics: { value: true, label: "Debug Physics" },
  });

  return (
    <>
      <AddInputModel onLoad={addModel} />
      {isTouch ? <JoystickController /> : <KeyboardController />}
      <Canvas shadows camera={{ position: [0, 5, 10] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <CameraControlsProvider onCameraControls={setCameraControl} />

          {/* <CameraController config={MODELS} /> */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={10}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* <CameraOrbitControls /> */}
          {/* <TouchTerrain />
          <VoxelPainter /> */}
          <Physics debug={isDebugPhysics}>
            <Boxes />
            <RoomScene />
            <CharacterController
              cameraControl={cameraControl}
              isWalkSide={false}
            />
            <Room cameraControl={cameraControl} />
            {models.map((model, i) => (
              <TransformControls key={i} object={model}>
                <primitive object={model} />
              </TransformControls>
            ))}
            {/* Groud */}
            {/* <RigidBody
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
            </RigidBody> */}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default SceneInit;
