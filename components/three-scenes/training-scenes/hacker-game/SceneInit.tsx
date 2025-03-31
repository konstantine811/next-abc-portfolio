"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import CharacterController from "./CharacterController";
import Boxes from "./Boxes";
import { useControls } from "leva";
import JoystickController from "./JoystickController";
import KeyboardController from "./KeyboardController";
import Room from "./Building/Room";
import AddInputModel from "./UI/AddInputModel";
import { DirectionalLight, Object3D } from "three";
import { RoomScene } from "./Building/RoomScene";
import ShapeCreator from "./Building/ShapeCreator";
import TransformGltfControl from "./Building/TransformGltfModel";
import { CameraControls, Environment } from "@react-three/drei";
import TouchTerrain from "./Building/Terrain";
import VoxelPainter from "./Building/VoxelPainter";
import World from "./Building/first-world/World";
import Light from "./Building/first-world/Light";

const SceneInit = () => {
  const dirLight = useRef<DirectionalLight>(null!);
  const [models, setModels] = useState<Object3D[]>([]);
  const addModel = (object: Object3D) => {
    // Копіюємо позицію трохи випадково, щоб вони не накладались
    object.position.set(0, 0, 0);
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
      {/* <AddInputModel onLoad={addModel} /> */}
      {isTouch ? <JoystickController /> : <KeyboardController />}
      <Canvas shadows camera={{ position: [0, 5, 10] }}>
        <Suspense fallback={null}>
          <Environment preset="night" background />
          {/* <fog attach="fog" args={["#ffffff", 10, 50]} /> */}
          {/* <ambientLight intensity={0.5} /> */}
          {/* <CameraController config={MODELS} /> */}
          <Light />
          {/* <CameraOrbitControls /> */}
          {/* <TouchTerrain />
          <VoxelPainter />
          <ShapeCreator /> */}
          <Physics debug={isDebugPhysics}>
            <Boxes />
            {/* <RoomScene /> */}
            <CharacterController />
            <World />
            {/* <Room /> */}
            {/* <TransformGltfControl models={models} /> */}
          </Physics>
          <CameraControls
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default SceneInit;
