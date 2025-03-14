"use client";
import Mapbox from "@/components/map/Mapbox";
import { TextScramble } from "@/components/ui/text-scramble";
import useWindowSize from "@rooks/use-window-size";

const HomeScene = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  return (
    <>
      <Mapbox />
    </>
  );
};

export default HomeScene;
