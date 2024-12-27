"use client";
import Experience from "@/components/three-scenes/sixthScene/Experience";
import MainWrapper from "@/components/wrapper/main-wrapper";
import { Controls } from "@/configs/three-scenes/controls";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

const keyboardMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.jump, keys: ["Space"] },
  { name: Controls.run, keys: ["Shift"] },
];

const SixthScenePage = () => {
  return (
    <MainWrapper>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 6, 6], fov: 60 }}>
          <color attach="background" args={["#171720"]} />
          <Physics debug>
            <Experience />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </MainWrapper>
  );
};

export default SixthScenePage;
