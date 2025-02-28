"use client";

import { useState } from "react";
import CharacterLoaderAnimation from "../../utils/CharacterLoaderAnimation";
import { CharacterAnimation } from "../../seventh-scene/config";

interface CharacterControllerProps {
  modelPath: string;
}

const CharacterController = ({ modelPath }: CharacterControllerProps) => {
  const [characterAnimation, setCharacterAnimation] =
    useState<CharacterAnimation>(CharacterAnimation.Idle);
  return (
    <CharacterLoaderAnimation
      model={modelPath}
      animation={characterAnimation}
    />
  );
};

export default CharacterController;
