"use client";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";
import Expirience from "@/components/three-scenes/characterController/Expirience";
import JoystickControl from "@/components/three-scenes/characterController/joystickControll";
import DebugHeadless from "../utils/debug/debugHeadless";
import Debug from "../utils/debug/debug";

const CharacterController = () => {
  return (
    <>
      <Leva />
      <DebugHeadless />
      {/* Jostic Control */}
      <JoystickControl />
      <Canvas
        shadows
        camera={{ fov: 65, near: 0.1, far: 1000 }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
            (e.target as HTMLCanvasElement).requestPointerLock();
          }
        }}
      >
        <Suspense fallback={null}>
          <Expirience />
          <Debug />
        </Suspense>
      </Canvas>
    </>
  );
};

export default CharacterController;
