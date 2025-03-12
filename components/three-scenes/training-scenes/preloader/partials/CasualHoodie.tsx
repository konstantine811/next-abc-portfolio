import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { SkinnedMesh } from "three";
import { JSX } from "react";

interface CasualHoodieProps {
  groupProps: JSX.IntrinsicElements["group"];
}
const CasualHoodie = ({ groupProps }: CasualHoodieProps) => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/preloader-scene/Casual_Hoodie.gltf"
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Run_Back"]?.fadeIn(0.5).play();
  }, []);
  return (
    <group ref={group} {...groupProps} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="Casual_Body">
            <skinnedMesh
              name="Cube008"
              geometry={(nodes.Cube008 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube008 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube008_1"
              geometry={(nodes.Cube008_1 as SkinnedMesh).geometry}
              material={materials.Purple}
              skeleton={(nodes.Cube008_1 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Casual_Feet">
            <skinnedMesh
              name="Cube000"
              geometry={(nodes.Cube000 as SkinnedMesh).geometry}
              material={materials.Purple}
              skeleton={(nodes.Cube000 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube000_1"
              geometry={(nodes.Cube000_1 as SkinnedMesh).geometry}
              material={materials.White}
              skeleton={(nodes.Cube000_1 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Casual_Head">
            <skinnedMesh
              name="Cube014"
              geometry={(nodes.Cube014 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube014 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube014_1"
              geometry={(nodes.Cube014_1 as SkinnedMesh).geometry}
              material={materials.Eyebrows}
              skeleton={(nodes.Cube014_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube014_2"
              geometry={(nodes.Cube014_2 as SkinnedMesh).geometry}
              material={materials.Eye}
              skeleton={(nodes.Cube014_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube014_3"
              geometry={(nodes.Cube014_3 as SkinnedMesh).geometry}
              material={materials.Hair}
              skeleton={(nodes.Cube014_3 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="Casual_Legs">
            <skinnedMesh
              name="Cube005"
              geometry={(nodes.Cube005 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube005 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube005_1"
              geometry={(nodes.Cube005_1 as SkinnedMesh).geometry}
              material={materials.LightBlue}
              skeleton={(nodes.Cube005_1 as SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
};
useGLTF.preload("/3d-models/preloader-scene/Casual_Hoodie.gltf");

export default CasualHoodie;
