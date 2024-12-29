import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useScroll, useSpring } from "framer-motion";
import { RefObject, useRef } from "react";
import { TextureLoader } from "three";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>;
  isScrolled?: boolean;
}

const EarthGlobe = ({ canvasRef }: Props) => {
  const texturePath = (name: string) => `/assets/textures/earth/${name}`;
  const earthRef = useRef<MeshProps>(null);
  const [color, normal, aoMap] = useLoader(TextureLoader, [
    texturePath("color.jpg"),
    texturePath("normal.png"),
    texturePath("occlusion.jpg"),
  ]);

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
