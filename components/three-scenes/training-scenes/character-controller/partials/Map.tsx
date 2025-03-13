import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Mesh } from "three";

const Map = () => {
  const { scene } = useGLTF(
    "/3d-models/character-controller/sky_land/scene.gltf"
  );
  // Додаємо castShadow для всіх мешів у моделі
  scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return (
    <RigidBody
      userData={{ isGround: true }}
      name="ground"
      type="fixed"
      colliders="trimesh"
    >
      <primitive object={scene} scale={5} position={[0, -50, 0]} />
    </RigidBody>
  );
};
useGLTF.preload("/3d-models/character-controller/sky_land/scene.gltf");
export default Map;
