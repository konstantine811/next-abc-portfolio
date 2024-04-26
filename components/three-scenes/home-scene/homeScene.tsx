"use client";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// storage
import { useAppSelector } from "@/lib/store/hooks";
// configs
import ConfigHook from "./sections/config-hook";
// components
import Sections from "./sections/sections";
import Experience from "./experience";

const HomeScene = () => {
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.value.headerHeight
  );
  const { skillsConfig } = ConfigHook();
  return (
    <Canvas shadows camera={{ position: [0, 0, 1] }}>
      <ScrollControls pages={4} damping={0.1}>
        <Experience />
        <Scroll style={{ width: "100%" }} html>
          <Sections skillsConfig={skillsConfig} headerHeight={headerHeight} />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};

export default HomeScene;
