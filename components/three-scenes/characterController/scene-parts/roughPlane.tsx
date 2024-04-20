"use client";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const RoughPlane = () => {
  const roughPlane = useGLTF(
    "/assets/3dModels/characterController/roughPlane.glb"
  );
  useEffect(() => {
    roughPlane.scene.traverse((child) => {
      if (
        child instanceof Mesh &&
        (child as any).materiral instanceof MeshStandardMaterial
      ) {
        child.receiveShadow = true;
      }
    });
  }, [roughPlane.scene]);
  return (
    <RigidBody type="fixed" colliders="trimesh" position={[10, -1.2, 10]}>
      <primitive object={roughPlane.scene} />
    </RigidBody>
  );
};

export default RoughPlane;
