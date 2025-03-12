import { useAnimations, useGLTF } from "@react-three/drei";
import { JSX, useEffect, useRef, useState } from "react";
import { SkinnedMesh } from "three";

interface PandaProps {
  props: JSX.IntrinsicElements["group"];
}
const Panda = ({ props }: PandaProps) => {
  const group = useRef(null!);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/scroll-scene/Panda.gltf"
  );
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Chop_Loop");
  useEffect(() => {
    actions[animation]?.fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <skinnedMesh
            name="Headband"
            geometry={(nodes.Headband as SkinnedMesh).geometry}
            material={materials.Atlas}
            skeleton={(nodes.Headband as SkinnedMesh).skeleton}
          />
          <skinnedMesh
            name="Knife"
            geometry={(nodes.Knife as SkinnedMesh).geometry}
            material={materials.Atlas}
            skeleton={(nodes.Knife as SkinnedMesh).skeleton}
          />
          {/* <skinnedMesh
          name="Pan"
          geometry={nodes.Pan.geometry}
          material={materials.Atlas}
          skeleton={nodes.Pan.skeleton}
        /> */}
          <skinnedMesh
            name="Panda"
            geometry={(nodes.Panda as SkinnedMesh).geometry}
            material={materials.Atlas}
            skeleton={(nodes.Panda as SkinnedMesh).skeleton}
          />
        </group>
      </group>
    </group>
  );
};

export default Panda;
