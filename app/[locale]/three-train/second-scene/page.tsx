"use client";

import MainWrapper from "@/components/wrapper/main-wrapper";
import dynamic from "next/dynamic";

const CharacterController = dynamic(
  () =>
    import("@/components/three-scenes/characterController/characterController"),
  {
    ssr: false,
  }
);

const SecondScenePage = () => {
  return (
    <MainWrapper>
      <CharacterController />
    </MainWrapper>
  );
};

export default SecondScenePage;
