import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, RepeatWrapping } from "three";

const Clouds = ({ speed }: { speed: number }) => {
  const texture = useTexture({
    alphaMap: "/textures/earth/Clouds.png",
  });
  texture.alphaMap.wrapS = texture.alphaMap.wrapT = RepeatWrapping;
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed * 0.01;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[10.15, 64, 64]} />
      <meshStandardMaterial transparent {...texture} opacity={0.5} />
    </mesh>
  );
};

export default Clouds;
