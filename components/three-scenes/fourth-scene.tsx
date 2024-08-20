"use client";

import { useEffect, useRef } from "react";
// three utils
import Experience from "@/services/three-js/three-instance/Experience";
import World from "@/services/three-js/three-scenes/house-scene/world/World";
// configs
import { sourceHouseScene } from "@/configs/three-scenes/house-source";

const FourthScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const experience = new Experience(
        canvasRef.current,
        World,
        sourceHouseScene
      );
    }
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default FourthScene;
