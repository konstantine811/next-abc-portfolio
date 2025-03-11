"use client";
import { TextScramble } from "@/components/ui/text-scramble";
import useWindowSize from "@rooks/use-window-size";

const HomeScene = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  return (
    <TextScramble
      className="font-mono text-sm"
      duration={1.2}
      characterSet=". "
    >
      Завантаження системи...
    </TextScramble>
  );
};

export default HomeScene;
