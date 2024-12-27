import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Group, Mesh } from "three";

interface Props {
  scale: number;
  position: [number, number, number];
  model: string;
}

const Map = ({ model, position, scale }: Props) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef<Group>();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh" name="ground">
        <primitive
          object={scene}
          ref={group}
          scale={scale}
          position={position}
        />
      </RigidBody>
    </group>
  );
};

export default Map;
