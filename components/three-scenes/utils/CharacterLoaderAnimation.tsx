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
    if (actions && actions[animation]) {
      const currentAction = actions[animation];
      currentAction?.reset()?.fadeIn(0.24)?.play();

      return () => {
        currentAction?.fadeOut(0.24);
      };
    }
  }, [actions, animation]);

  return <primitive object={scene} />;
};

export default CharacterLoaderAnimation;
