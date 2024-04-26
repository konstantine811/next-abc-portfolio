import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
// components
import MainContainer from "@/components/page-partials/common/container";
import InitMap from "@/components/map/init";

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const t = useTranslations("Home");
  return <InitMap />;
}
