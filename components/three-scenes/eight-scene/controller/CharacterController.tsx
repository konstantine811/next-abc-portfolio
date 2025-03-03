"use client";

import { useState } from "react";
import CharacterLoaderAnimation from "../../utils/CharacterLoaderAnimation";
import { CharacterAnimation } from "../../seventh-scene/config";
import CharacterJoystickControls from "./CharacterJoystickControl";
import Controller from "./Controller";
import { useControls } from "leva";

interface CharacterControllerProps {
  modelPath: string;
}

const CharacterController = ({ modelPath }: CharacterControllerProps) => {
  const [characterAnimation, setCharacterAnimation] =
    useState<CharacterAnimation>(CharacterAnimation.Idle);
  const { disableControl, disableFollowCam } = useControls("World Settings", {
    physics: false,
    disableControl: false,
    disableFollowCam: false,
  });
  return (
    <Controller
      debug
      animated
      followLight
      springK={2}
      dampingC={0.2}
      autoBalanceSpringK={1.2}
      autoBalanceDampingC={0.04}
      autoBalanceSpringOnY={0.7}
      //   autoBalanceDampingOnY={0.05}
      disableControl={disableControl}
      disableFollowCam={disableFollowCam}
    >
      <CharacterLoaderAnimation
        model={modelPath}
        animation={characterAnimation}
      />
    </Controller>
  );
};

export default CharacterController;
