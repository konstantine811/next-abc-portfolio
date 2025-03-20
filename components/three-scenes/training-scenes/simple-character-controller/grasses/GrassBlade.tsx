import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import {
  DoubleSide,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Vector3,
} from "three";

const GRASS_BLADES = 1024; // Кількість травинок
const FIELD_SIZE = 10; // Розмір площі, на якій росте трава

export default function GrassBlade() {
  const ref = useRef<InstancedMesh>(null!);

  useEffect(() => {
    if (!ref.current) return;

    const mesh = ref.current;
    const dummyMatrix = new Matrix4();

    for (let i = 0; i < GRASS_BLADES; i++) {
      // Рівномірний розподіл по площині
      const x = (Math.random() - 0.5) * FIELD_SIZE; // Випадкове розташування по X
      const z = (Math.random() - 0.5) * FIELD_SIZE; // Випадкове розташування по Z

      const pos = new Vector3(x, 0, z);

      dummyMatrix.setPosition(pos);
      mesh.setMatrixAt(i, dummyMatrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      position={[0, -2, 0]} // Опускаємо траву трохи вниз
      args={[undefined, undefined, GRASS_BLADES]}
    >
      <planeGeometry args={[0.07, 0.7]} />
      <meshStandardMaterial color="green" side={DoubleSide} />
    </instancedMesh>
  );
}
