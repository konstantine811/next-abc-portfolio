import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, SkinnedMesh } from "three";

interface Props {
  scale: number;
  positionY: number;
  animation: string;
}

const Character = ({ scale, positionY, animation }: Props) => {
  const group = useRef<Group | null>(null);
  const { nodes, materials, animations } = useGLTF(
    "/3d-models/fifth-scene-models/character.glb"
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions[animation]) {
      const currentAction = actions[animation];
      currentAction?.reset()?.fadeIn(0.24)?.play();

      return () => {
        currentAction?.fadeOut(0.24);
      };
    }
  }, [actions, animation]);

  const getSkinnedMesh = (prop: string) => {
    return nodes[prop] as SkinnedMesh;
  };
  return (
    <group ref={group} dispose={null} scale={scale} position-y={positionY}>
      <group name="Scene">
        <group name="fall_guys">
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name="body"
            geometry={getSkinnedMesh("body").geometry}
            material={materials.Material}
            skeleton={getSkinnedMesh("body").skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="eye"
            geometry={getSkinnedMesh("eye").geometry}
            material={materials.Material}
            skeleton={getSkinnedMesh("eye").skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="hand-"
            geometry={getSkinnedMesh("hand-").geometry}
            material={materials.Material}
            skeleton={getSkinnedMesh("hand-").skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="leg"
            geometry={getSkinnedMesh("leg").geometry}
            material={materials.Material}
            skeleton={getSkinnedMesh("leg").skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
};

export default Character;
