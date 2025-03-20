import { JSX } from "react";
import { Colors } from "./config-scene";

interface CloudProps {
  props?: JSX.IntrinsicElements["group"];
}

const Cloud = ({ props }: CloudProps) => {
  const nBlocks = 3 + Math.floor(Math.random() * 3);
  return (
    <group {...props}>
      {Array.from({ length: nBlocks }).map((_, i) => {
        const x = i * 15;
        const y = Math.random() * 10;
        const z = Math.random() * 10;
        const rz = Math.random() * Math.PI * 2;
        const ry = Math.random() * Math.PI * 2;
        const size = 0.1 + Math.random() * 0.9;
        return (
          <mesh
            key={i}
            scale={[size, size, size]}
            position={[x, y, z]}
            rotation={[0, ry, rz]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[20, 20, 20]} />
            <meshLambertMaterial color={Colors.white} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Cloud;
