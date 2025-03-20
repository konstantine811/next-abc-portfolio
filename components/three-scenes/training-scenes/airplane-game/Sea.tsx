import { useRef } from "react";
import { Colors } from "./config-scene";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const Sea = ({
  radius = 600,
  length = 800,
}: {
  radius?: number;
  length?: number;
}) => {
  const ref = useRef<Group>(null!);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={-600} receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 40, 10]} />
      <meshPhongMaterial
        color={Colors.blue}
        transparent
        opacity={0.6}
        flatShading
      />
    </mesh>
  );
};

export default Sea;
