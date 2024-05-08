"use client";
import { Canvas } from "@react-three/fiber";
import ParticleAnimImage from "./particle-anim-image";
import { OrbitControls } from "@react-three/drei";

const CanvasWrap = () => {
  return (
    <Canvas camera={{ position: [0, 0, 4] }} shadows>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} decay={0} />
      <OrbitControls />
      <ParticleAnimImage />
    </Canvas>
  );
};

export default CanvasWrap;
