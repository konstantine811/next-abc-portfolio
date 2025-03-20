import { useAnimations, useGLTF } from "@react-three/drei";
import { JSX, useEffect, useRef } from "react";
import { SkinnedMesh } from "three";

interface SpacesuitProps {
  groupProps: JSX.IntrinsicElements["group"];
}

const Spacesuit = ({ groupProps }: SpacesuitProps) => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/preloader-scene/Spacesuit.gltf"
  );
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["Gun_Shoot"]?.fadeIn(0.5).play();
  }, [actions]);
  return (
    <group ref={group} {...groupProps} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="SpaceSuit_Body">
            <skinnedMesh
              name="Cube002"
              geometry={(nodes.Cube002 as SkinnedMesh).geometry}
              material={materials.SciFi_Light}
              skeleton={(nodes.Cube002 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube002_1"
              geometry={(nodes.Cube002_1 as SkinnedMesh).geometry}
              material={materials.SciFi_Light_Accent}
              skeleton={(nodes.Cube002_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube002_2"
              geometry={(nodes.Cube002_2 as SkinnedMesh).geometry}
              material={materials.SciFi_Main}
              skeleton={(nodes.Cube002_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube002_3"
              geometry={(nodes.Cube002_3 as SkinnedMesh).geometry}
              material={materials.SciFi_MainDark}
              skeleton={(nodes.Cube002_3 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="SpaceSuit_Feet">
            <skinnedMesh
              name="Cube047"
              geometry={(nodes.Cube047 as SkinnedMesh).geometry}
              material={materials.SciFi_Light_Accent}
              skeleton={(nodes.Cube047 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube047_1"
              geometry={(nodes.Cube047_1 as SkinnedMesh).geometry}
              material={materials.SciFi_Light}
              skeleton={(nodes.Cube047_1 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="SpaceSuit_Head">
            <skinnedMesh
              name="Cube049"
              geometry={(nodes.Cube049 as SkinnedMesh).geometry}
              material={materials.SciFi_Light}
              skeleton={(nodes.Cube049 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube049_1"
              geometry={(nodes.Cube049_1 as SkinnedMesh).geometry}
              material={materials.SciFi_Light_Accent}
              skeleton={(nodes.Cube049_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube049_2"
              geometry={(nodes.Cube049_2 as SkinnedMesh).geometry}
              material={materials.Grey}
              skeleton={(nodes.Cube049_2 as SkinnedMesh).skeleton}
            />
          </group>
          <group name="SpaceSuit_Legs">
            <skinnedMesh
              name="Cube046"
              geometry={(nodes.Cube046 as SkinnedMesh).geometry}
              material={materials.SciFi_Main}
              skeleton={(nodes.Cube046 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube046_1"
              geometry={(nodes.Cube046_1 as SkinnedMesh).geometry}
              material={materials.SciFi_Light}
              skeleton={(nodes.Cube046_1 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube046_2"
              geometry={(nodes.Cube046_2 as SkinnedMesh).geometry}
              material={materials.SciFi_Light_Accent}
              skeleton={(nodes.Cube046_2 as SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Cube046_3"
              geometry={(nodes.Cube046_3 as SkinnedMesh).geometry}
              material={materials.SciFi_MainDark}
              skeleton={(nodes.Cube046_3 as SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/3d-models/preloader-scene/Spacesuit.gltf");

export default Spacesuit;
