import { Dodecahedron } from "@react-three/drei";

const AnimatedDodecahedron = () => {
  return (
    <group position-x={-1} position-y={1}>
      <Dodecahedron>
        <meshStandardMaterial color="red" transparent opacity={0.6} />
      </Dodecahedron>
    </group>
  );
};

export default AnimatedDodecahedron;
