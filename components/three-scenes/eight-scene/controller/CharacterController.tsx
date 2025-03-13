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
      dampingC={0.4}
      autoBalanceSpringK={1.6}
      autoBalanceDampingC={0.04}
      autoBalanceSpringOnY={0.7}
      // autoBalanceDampingOnY={0.5}
      disableControl={disableControl}
      disableFollowCam={disableFollowCam}
      capsuleHalfHeight={0.25}
      capsuleRadius={0.3}
      floatHeight={0}
    >
      <CharacterLoaderAnimation
        model={modelPath}
        animation={characterAnimation}
        props={{
          position: [0, -0.5, 0],
        }}
      />
    </Controller>
  );
};

export default CharacterController;
