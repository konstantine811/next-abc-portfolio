import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { Mesh } from "three";

const Floor = () => {
  const { scene } = useGLTF("/3d-models/first_world/floor.glb");
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return (
    <RigidBody userData={{ isGround: true }} type="fixed">
      <primitive object={scene} />
    </RigidBody>
  );
};

useGLTF.preload("/3d-models/first_world/floor.glb");

export default Floor;
