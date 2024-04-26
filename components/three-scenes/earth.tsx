"use client";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import EarthGlobe from "./earthGlobe";

interface Props {
  isScrolled?: boolean;
}

const Earch = ({ isScrolled = true }: Props) => {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  return (
    <Canvas ref={sceneRef}>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={3.5} position={[1, 0, 0.25]} />
      <EarthGlobe isScrolled={isScrolled} canvasRef={sceneRef} />
    </Canvas>
  );
};

export default Earch;
