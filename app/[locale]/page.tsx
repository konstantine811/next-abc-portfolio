import HomeScene from "@/components/three-scenes/home-scene/homeScene.v2";

import MainWrapper from "@/components/wrapper/main-wrapper";

type Props = {
  params: { locale: string };
};

export default function Home() {
  return (
    <MainWrapper>
      <HomeScene />
    </MainWrapper>
  );
}
