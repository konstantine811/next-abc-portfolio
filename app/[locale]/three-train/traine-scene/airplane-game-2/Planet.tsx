// Planet.tsx
import { RigidBody } from "@react-three/rapier";

export default function Planet({
  position = [0, 0, 0],
}: {
  position: [number, number, number];
}) {
  return (
    <RigidBody type="fixed" position={position} colliders="ball">
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}
