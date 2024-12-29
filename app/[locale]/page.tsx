import HomeScene from "@/components/three-scenes/home-scene/homeScene.v2";

import MainWrapper from "@/components/wrapper/main-wrapper";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
// components

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const t = useTranslations("Home");
  return <MainWrapper>{<HomeScene />}</MainWrapper>;
}
