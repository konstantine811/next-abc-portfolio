import { useAnimations, useGLTF } from "@react-three/drei";
import { JSX, useEffect, useRef } from "react";
import { SkinnedMesh } from "three";

interface AdventurerProps {
  groupProps: JSX.IntrinsicElements["group"];
}

const Adventurer = ({ groupProps }: AdventurerProps) => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/preloader-scene/Adventurer.gltf"
  );
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["Wave"]?.fadeIn(0.5).play();
  }, []);
  return (
    <group ref={group} {...groupProps} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="Adventurer_Body">
            <skinnedMesh
              name="Cube063"
              geometry={(nodes.Cube063 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube063 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube063_1"
              geometry={(nodes.Cube063_1 as SkinnedMesh).geometry}
              material={materials.Green}
              skeleton={(nodes.Cube063_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube063_2"
              geometry={(nodes.Cube063_2 as SkinnedMesh).geometry}
              material={materials.LightGreen}
              skeleton={(nodes.Cube063_2 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Adventurer_Feet">
            <skinnedMesh
              name="Cube052"
              geometry={(nodes.Cube052 as SkinnedMesh).geometry}
              material={materials.Grey}
              skeleton={(nodes.Cube052 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube052_1"
              geometry={(nodes.Cube052_1 as SkinnedMesh).geometry}
              material={materials.Black}
              skeleton={(nodes.Cube052_1 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Adventurer_Head">
            <skinnedMesh
              name="Cube039"
              geometry={(nodes.Cube039 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube039 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube039_1"
              geometry={(nodes.Cube039_1 as SkinnedMesh).geometry}
              material={materials.Eyebrows}
              skeleton={(nodes.Cube039_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube039_2"
              geometry={(nodes.Cube039_2 as SkinnedMesh).geometry}
              material={materials.Hair}
              skeleton={(nodes.Cube039_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube039_3"
              geometry={(nodes.Cube039_3 as SkinnedMesh).geometry}
              material={materials.Eye}
              skeleton={(nodes.Cube039_3 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Adventurer_Legs">
            <skinnedMesh
              name="Cube020"
              geometry={(nodes.Cube020 as SkinnedMesh).geometry}
              material={materials.Brown}
              skeleton={(nodes.Cube020 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube020_1"
              geometry={(nodes.Cube020_1 as SkinnedMesh).geometry}
              material={materials.Brown2}
              skeleton={(nodes.Cube020_1 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Backpack">
            <skinnedMesh
              name="Plane"
              geometry={(nodes.Plane as SkinnedMesh).geometry}
              material={materials.Brown}
              skeleton={(nodes.Plane as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane_1"
              geometry={(nodes.Plane_1 as SkinnedMesh).geometry}
              material={materials.LightGreen}
              skeleton={(nodes.Plane_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane_2"
              geometry={(nodes.Plane_2 as SkinnedMesh).geometry}
              material={materials.Gold}
              skeleton={(nodes.Plane_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane_3"
              geometry={(nodes.Plane_3 as SkinnedMesh).geometry}
              material={materials.Green}
              skeleton={(nodes.Plane_3 as SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/3d-models/preloader-scene/Adventurer.gltf");

export default Adventurer;
