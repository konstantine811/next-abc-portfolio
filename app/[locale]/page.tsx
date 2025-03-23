import MainWrapper from "@/components/wrapper/main-wrapper";
import { Suspense } from "react";
import Loading from "./loading";
import SceneInit from "@/components/three-scenes/training-scenes/hacker-game/SceneInit";

type Props = {
  params: { locale: string };
};

export default function Home() {
  return (
    <MainWrapper>
      <Suspense fallback={<Loading />}>
        <SceneInit />
      </Suspense>
    </MainWrapper>
  );
}
