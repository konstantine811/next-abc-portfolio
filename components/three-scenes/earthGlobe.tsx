import { useTexture } from "@react-three/drei";
import { useScroll, useSpring } from "framer-motion";
import { RefObject, useRef } from "react";
import { Mesh } from "three";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>;
  isScrolled?: boolean;
}

const EarthGlobe = ({ canvasRef }: Props) => {
  const texturePath = (name: string) => `/assets/textures/earth/${name}`;
  const earthRef = useRef<Mesh>(null);
  const { color, normal, aoMap } = useTexture({
    color: texturePath("color.jpg"),
    normal: texturePath("normal.png"),
    aoMap: texturePath("occlusion.jpg"),
  });

  const { scrollYProgress } = useScroll({
    target: canvasRef,
    offset: ["start end", "end start"],
  });
  const smoothRotation = useSpring(scrollYProgress, { damping: 20 });
  return (
    <mesh ref={earthRef} scale={3.0}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
    </mesh>
  );
};

export default EarthGlobe;
