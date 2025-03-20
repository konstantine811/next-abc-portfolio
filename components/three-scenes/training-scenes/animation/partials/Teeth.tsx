import { useRef } from "react";
import { Mesh } from "three";

const Teeth = () => {
  // ✅ Створюємо рефи на верхньому рівні без `useMemo`
  const meshRefs = [
    useRef<Mesh>(null!),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];

  return (
    <group>
      {meshRefs.map((ref, i) => (
        <mesh
          ref={ref}
          key={i}
          position={[i - 1, i % 2 ? -1 : 1, 0]}
          rotation-x={i % 2 ? 0 : Math.PI}
        >
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
};

export default Teeth;
