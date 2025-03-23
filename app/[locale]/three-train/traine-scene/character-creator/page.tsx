"use client";

import { AvatarCreator } from "@readyplayerme/react-avatar-creator";

const CharacterCreator = () => {
  return (
    <AvatarCreator
      subdomain="demo"
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
};

export default CharacterCreator;
