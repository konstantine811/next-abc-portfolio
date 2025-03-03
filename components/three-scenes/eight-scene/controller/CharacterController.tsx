"use client";

import { useState } from "react";
import CharacterLoaderAnimation from "../../utils/CharacterLoaderAnimation";
import { CharacterAnimation } from "../../seventh-scene/config";
import CharacterJoystickControls from "./CharacterJoystickControl";
import Controller from "./Controller";

interface CharacterControllerProps {
  modelPath: string;
}

const CharacterController = ({ modelPath }: CharacterControllerProps) => {
  const [characterAnimation, setCharacterAnimation] =
    useState<CharacterAnimation>(CharacterAnimation.Idle);
  return (
    <Controller>
      <CharacterLoaderAnimation
        model={modelPath}
        animation={characterAnimation}
      />
    </Controller>
  );
};

export default CharacterController;
