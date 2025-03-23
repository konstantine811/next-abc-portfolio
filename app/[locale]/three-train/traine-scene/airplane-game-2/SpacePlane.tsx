// SpacePlane.tsx
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Matrix4 } from "three";

export interface CustomControllerRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCameraX?: number;
  rotateCameraY?: number;
}

export default function SpacePlane() {
  const ref = useRef<CustomControllerRigidBody>(null!);
  const [_, getKeys] = useKeyboardControls();

  useFrame(() => {
    //    const matrix  = new Matrix4().multiply(new Matrix4().makeTranslation())
  });

  return (
    <RigidBody
      ref={ref}
      colliders="cuboid"
      angularDamping={1}
      linearDamping={0.5}
    >
      <mesh>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </RigidBody>
  );
}
