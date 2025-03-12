"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Suspense } from "react";
import { useProgress } from "@react-three/drei";

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  return (
    <div
      className={`${
        active ? "visisble" : "hidden"
      } transition-all duration-300 fixed top-0 left-0 p-4 w-screen h-screen z-10 grid place-items-center bg-gray-400 bg-gradient-to-r from-[#b8c6db] to-[#f5f7fa]`}
    >
      <div>
        <h1 className="text-3xl font-bold uppercase text-[#1a202c] m-0">
          3D Web Agency
        </h1>
        <div className="w-full h-2 bg-gray-300 relative overflow-hidden rounded-md">
          <div
            className="w-0 h-full bg-black transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const SceneInit = () => {
  return (
    <>
      <LoadingScreen />
      <Canvas camera={{ position: [-4, 4, 12], fov: 30 }}>
        <group position-y={-1}>
          <Experience />
        </group>
      </Canvas>
    </>
  );
};

export default SceneInit;
