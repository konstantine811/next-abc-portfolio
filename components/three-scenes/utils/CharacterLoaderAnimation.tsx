import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

interface Props {
  model: string;
  animation: string;
}

const CharacterLoaderAnimation = ({ model, animation }: Props) => {
  const { animations, scene } = useGLTF(model);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && animations.length && actions[animation]) {
      actions[animation].reset().fadeIn(0.24).play();
      return () => {
        actions[animation]?.fadeOut(0.24);
      };
    }
  }, [actions, animations, animation]);

  return <primitive object={scene} />;
};

export default CharacterLoaderAnimation;
