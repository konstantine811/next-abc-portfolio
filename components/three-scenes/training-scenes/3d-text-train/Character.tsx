import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { SkinnedMesh } from "three";

const Character = () => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/text-scene/Character Animated.glb"
  );
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["Attacking_Idle"]?.play();
  }, []);

  return (
    <group ref={group} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group
            name="Rogue"
            position={[0, 0, 0.166]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="Rogue_1"
              geometry={(nodes.Rogue_1 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Rogue_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Rogue_2"
              geometry={(nodes.Rogue_2 as SkinnedMesh).geometry}
              material={materials.UnderShirt}
              skeleton={(nodes.Rogue_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Rogue_3"
              geometry={(nodes.Rogue_3 as SkinnedMesh).geometry}
              material={materials.Pants}
              skeleton={(nodes.Rogue_3 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Rogue_4"
              geometry={(nodes.Rogue_4 as SkinnedMesh).geometry}
              material={materials.Shirt}
              skeleton={(nodes.Rogue_4 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Rogue_5"
              geometry={(nodes.Rogue_5 as SkinnedMesh).geometry}
              material={materials.Detail}
              skeleton={(nodes.Rogue_5 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Rogue_6"
              geometry={(nodes.Rogue_6 as SkinnedMesh).geometry}
              material={materials.Boots}
              skeleton={(nodes.Rogue_6 as SkinnedMesh).skeleton}
            />
          </group>
          <skinnedMesh
            name="Rogue001"
            geometry={(nodes.Rogue001 as SkinnedMesh).geometry}
            material={materials["Material.006"]}
            skeleton={(nodes.Rogue001 as SkinnedMesh).skeleton}
            position={[0, 0, 0.166]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </group>
  );
};

export default Character;
