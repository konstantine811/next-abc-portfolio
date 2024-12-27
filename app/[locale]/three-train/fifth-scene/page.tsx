"use client";
import Experience from "@/components/three-scenes/fifthScene/Experience";
import MainWrapper from "@/components/wrapper/main-wrapper";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const FifthScenePage = () => {
  return (
    <MainWrapper>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </KeyboardControls>
    </MainWrapper>
  );
};

export default FifthScenePage;
