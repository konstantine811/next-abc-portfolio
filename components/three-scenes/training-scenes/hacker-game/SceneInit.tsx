"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import CharacterController from "./CharacterController";
import Boxes from "./Boxes";
import { useControls } from "leva";
import JoystickController from "./JoystickController";
import KeyboardController from "./KeyboardController";
import Room from "./Building/Room";
import AddInputModel from "./UI/AddInputModel";
import { Object3D } from "three";
import { RoomScene } from "./Building/RoomScene";
import ShapeCreator from "./Building/ShapeCreator";
import { CameraControlsProvider } from "./CameraControls";
import TransformGltfControl from "./Building/TransformGltfModel";
import { Environment } from "@react-three/drei";

const SceneInit = () => {
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
      <AddInputModel onLoad={addModel} />
      {isTouch ? <JoystickController /> : <KeyboardController />}
      <Canvas shadows camera={{ position: [0, 5, 10] }}>
        <CameraControlsProvider>
          <Suspense fallback={null}>
            <Environment preset="night" background />
            <fog attach="fog" args={["#ffffff", 10, 50]} />
            <ambientLight intensity={0.5} />
            {/* <CameraController config={MODELS} /> */}
            <directionalLight
              position={[5, 5, 5]}
              intensity={3}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            {/* <CameraOrbitControls /> */}
            {/* <TouchTerrain />
          <VoxelPainter /> */}
            <ShapeCreator />
            <Physics debug={isDebugPhysics}>
              <Boxes />
              <RoomScene />
              <CharacterController />
              <Room />
              <TransformGltfControl models={models} />
            </Physics>
          </Suspense>
        </CameraControlsProvider>
      </Canvas>
    </>
  );
};

export default SceneInit;
