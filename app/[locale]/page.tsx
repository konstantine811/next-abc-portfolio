import HomeScene from "@/components/three-scenes/home-scene/homeScene.v2";

import MainWrapper from "@/components/wrapper/main-wrapper";
import { Suspense } from "react";
import Loading from "./loading";

type Props = {
  params: { locale: string };
};

export default function Home() {
  return (
    <MainWrapper>
      <Suspense fallback={<Loading />}>
        <HomeScene />
      </Suspense>
    </MainWrapper>
  );
}
