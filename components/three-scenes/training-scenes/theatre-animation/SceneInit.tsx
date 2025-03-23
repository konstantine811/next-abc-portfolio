"use client";

import { SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { UI } from "./UI";
import { Experience } from "./Experience";

import { getProject } from "@theatre/core";
import { SheetProvider } from "@theatre/r3f";

import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

studio.initialize();
studio.extend(extension);

const project = getProject("MedievalTownVideo");
const mainSheet = project.sheet("Main");

const SceneInit = () => {
  const [currentScreen, setCurrentScreen] = useState("Intro");
  const [targetScreen, setTargetScreen] = useState("Home");

  return (
    <>
      <UI
        currentScreen={currentScreen}
        onScreenChange={setTargetScreen}
        isAnimating={currentScreen !== targetScreen}
      />
      <Canvas camera={{ position: [5, 5, 10], fov: 30, near: 1 }} shadows>
        <SoftShadows />
        <SheetProvider sheet={mainSheet}>
          <Experience />
        </SheetProvider>
      </Canvas>
    </>
  );
};

export default SceneInit;
