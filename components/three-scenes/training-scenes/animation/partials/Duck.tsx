import { useGLTF } from "@react-three/drei";
import { JSX } from "react";
import { SkinnedMesh } from "three";

interface DuckProps {
  props?: JSX.IntrinsicElements["group"];
}
const Duck = ({ props }: DuckProps) => {
  const { nodes, materials } = useGLTF("/3d-models/animation-scene/Duck.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={(nodes.character_duck as SkinnedMesh).geometry}
        material={materials["White.026"]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={(nodes.character_duckArmLeft as SkinnedMesh).geometry}
          material={materials["White.026"]}
          position={[0.204, 0, -0.634]}
        />
        <mesh
          geometry={(nodes.character_duckArmRight as SkinnedMesh).geometry}
          material={materials["White.026"]}
          position={[-0.204, 0, -0.634]}
        />
        <group position={[0, 0, -0.704]}>
          <mesh
            geometry={(nodes.Cube1338 as SkinnedMesh).geometry}
            material={materials["White.026"]}
          />
          <mesh
            geometry={(nodes.Cube1338_1 as SkinnedMesh).geometry}
            material={materials["Yellow.043"]}
          />
          <mesh
            geometry={(nodes.Cube1338_2 as SkinnedMesh).geometry}
            material={materials["Black.027"]}
          />
        </group>
      </mesh>
    </group>
  );
};
useGLTF.preload("/3d-models/animation-scene/Duck.gltf");

export default Duck;
