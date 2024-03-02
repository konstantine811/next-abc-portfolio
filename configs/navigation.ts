import { useTranslations } from "next-intl";

export interface INaviagationConfig {
  title: string;
  href: string;
  children?: INaviagationConfig[];
}

const NavigationConfig = (): INaviagationConfig[] => {
  const t = useTranslations();
  return [
    {
      title: t("nav.home"),
      href: "/",
    },
    {
      title: t("nav.blog"),
      href: "/blog",
    },
    {
      title: t("nav.three-train.title"),
      href: "/three-train",
      children: [
        {
          title: t("nav.three-train.first-scene"),
          href: "/first-scene",
        },
        {
          title: t("nav.three-train.second-scene"),
          href: "/second-scene",
        },
      ],
    },
  ];
};

export default NavigationConfig;
