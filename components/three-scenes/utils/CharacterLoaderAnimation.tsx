import {
  AnimationSet,
  initializeAnimationSet,
  resetAnimation,
} from "@/lib/store/features/character-contoller/game-state.slice";
import { RootState } from "@/lib/store/store";
import { useAnimations, useGLTF } from "@react-three/drei";
import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoopOnce } from "three";

interface Props {
  model: string;
  animation: string;
  props?: JSX.IntrinsicElements["group"];
}

const CharacterLoaderAnimation = ({ model, animation, props }: Props) => {
  const { animations, scene } = useGLTF(model);
  const { actions } = useAnimations(animations, scene);
  const { curAnimation, animationSet } = useSelector(
    (state: RootState) => state.gameStateReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const animSet: AnimationSet = {
      idle: "Idle",
      walk: "Walking",
      run: "Run",
      jump: "Jump",
      jumpLand: "JumpLand",
      jumpIdle: "JumpIdle",
    };
    dispatch(initializeAnimationSet(animSet));
  }, [dispatch]);
  useEffect(() => {
    // Play animation
    const action = actions[curAnimation ? curAnimation : "Idle"];
    if (!action) return;
    // for jump and jump lund animation, only play once and clump when finish
    if (
      curAnimation === animationSet.jump ||
      animationSet === animationSet.jumpLand ||
      curAnimation === animationSet.action1 ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3 ||
      curAnimation === animationSet.action4
    ) {
      action.reset().fadeIn(0.2).setLoop(LoopOnce, 1).play();
      action.clampWhenFinished = true;
    } else {
      action.reset().fadeIn(0.2).play();
    }
    // When any action is clamp and finished reset animation
    (action as any)._mixer.addEventListener("finished", () =>
      dispatch(resetAnimation())
    );

    return () => {
      // Fade out previous action
      action.fadeOut(0.2);

      // Clean up mixer listener, and empty the _listeners array
      (action as any)._mixer.removeEventListener("finished", () =>
        dispatch(resetAnimation())
      );
      (action as any)._mixer._listeners = [];
    };
  }, [curAnimation, dispatch, actions, animationSet]);

  return <primitive object={scene} {...props} />;
};

export default CharacterLoaderAnimation;
