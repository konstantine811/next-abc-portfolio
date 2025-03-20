import { useAnimations, useGLTF } from "@react-three/drei";
import { MathProps } from "@react-three/fiber";
import { JSX, useEffect, useRef } from "react";
import { SkinnedMesh } from "three";

interface KingProps {
  groupProps: JSX.IntrinsicElements["group"];
}

const King = ({ groupProps }: KingProps) => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/preloader-scene/King.gltf"
  );
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["Sword_Slash"]?.fadeIn(0.5).play();
  }, [actions]);
  return (
    <group ref={group} {...groupProps} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="King_Body">
            <skinnedMesh
              name="Cube043"
              geometry={(nodes.Cube043 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube043 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube043_1"
              geometry={(nodes.Cube043_1 as SkinnedMesh).geometry}
              material={materials.Blue}
              skeleton={(nodes.Cube043_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube043_2"
              geometry={(nodes.Cube043_2 as SkinnedMesh).geometry}
              material={materials.Metal}
              skeleton={(nodes.Cube043_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube043_3"
              geometry={(nodes.Cube043_3 as SkinnedMesh).geometry}
              material={materials.Beige}
              skeleton={(nodes.Cube043_3 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube043_4"
              geometry={(nodes.Cube043_4 as SkinnedMesh).geometry}
              material={materials.Metal_Dark}
              skeleton={(nodes.Cube043_4 as SkinnedMesh).skeleton}
            />
          </group>
          <skinnedMesh
            name="King_Feet"
            geometry={(nodes.King_Feet as SkinnedMesh).geometry}
            material={materials.Metal}
            skeleton={(nodes.King_Feet as SkinnedMesh).skeleton}
          />
          <group name="King_Head">
            <skinnedMesh
              name="Cube025"
              geometry={(nodes.Cube025 as SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Cube025 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube025_1"
              geometry={(nodes.Cube025_1 as SkinnedMesh).geometry}
              material={materials.Hair_White}
              skeleton={(nodes.Cube025_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube025_2"
              geometry={(nodes.Cube025_2 as SkinnedMesh).geometry}
              material={materials.Gold}
              skeleton={(nodes.Cube025_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube025_3"
              geometry={(nodes.Cube025_3 as SkinnedMesh).geometry}
              material={materials.Eye}
              skeleton={(nodes.Cube025_3 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="King_Legs">
            <skinnedMesh
              name="Cube051"
              geometry={(nodes.Cube051 as SkinnedMesh).geometry}
              material={materials.DarkBrown}
              skeleton={(nodes.Cube051 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube051_1"
              geometry={(nodes.Cube051_1 as SkinnedMesh).geometry}
              material={materials.Metal}
              skeleton={(nodes.Cube051_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube051_2"
              geometry={(nodes.Cube051_2 as SkinnedMesh).geometry}
              material={materials.Metal_Dark}
              skeleton={(nodes.Cube051_2 as SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

export default King;

useGLTF.preload("/3d-models/preloader-scene/King.gltf");
