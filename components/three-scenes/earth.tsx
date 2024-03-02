"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { motion } from "framer-motion-3d";

const Earch = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const texturePath = (name: string) => `/assets/textures/earth/${name}`;
  const [color, normal, aoMap] = useLoader(TextureLoader, [
    texturePath("color.jpg"),
    texturePath("normal.png"),
    texturePath("occlusion.jpg"),
  ]);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const smoothRotation = useSpring(scrollYProgress, { damping: 20 });
  return (
    <Canvas ref={sceneRef}>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={3.5} position={[1, 0, 0.25]} />
      <motion.mesh scale={2.5} rotation-y={smoothRotation}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
      </motion.mesh>
    </Canvas>
  );
};

export default Earch;
