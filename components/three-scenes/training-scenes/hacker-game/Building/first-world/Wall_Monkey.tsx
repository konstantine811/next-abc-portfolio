import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { Mesh } from "three";

const WallMonkey = () => {
  const { scene } = useGLTF("/3d-models/first_world/wall_monkey.glb");
  useEffect(() => {
    scene.traverse((child) => {
      console.log("child", child);
    });
  }, [scene]);
  return (
    <RigidBody
      scale={3}
      userData={{ isGround: true }}
      type="fixed"
      colliders="trimesh"
    >
      <primitive object={scene} />
    </RigidBody>
  );
};

useGLTF.preload("/3d-models/first_world/wall_monkey.glb");

export default WallMonkey;
