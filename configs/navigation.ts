import { useTranslations } from "next-intl";

export interface INaviagationConfig {
  title: string;
  href: string;
  children?: INaviagationConfig[];
}

export enum PATH_ROUTE_NAME {
  home = "/",
  blog = "/blog",
  threeTrain = "/three-train",
  firstScene = "/first-scene",
  secondScene = "/second-scene",
  thirdScene = "/third-scene",
  fourthScene = "/fourth-scene",
  maps = "/maps",
  leko = "/leko",
}

const NavigationConfig = (): INaviagationConfig[] => {
  const t = useTranslations();
  return [
    {
      title: t("nav.home"),
      href: PATH_ROUTE_NAME.home,
    },
    {
      title: t("nav.blog"),
      href: PATH_ROUTE_NAME.blog,
    },
    {
      title: t("nav.three-train.title"),
      href: PATH_ROUTE_NAME.threeTrain,
      children: [
        {
          title: t("nav.three-train.first-scene"),
          href: PATH_ROUTE_NAME.firstScene,
        },
        {
          title: t("nav.three-train.second-scene"),
          href: PATH_ROUTE_NAME.secondScene,
        },
        {
          title: t("nav.three-train.third-scene"),
          href: PATH_ROUTE_NAME.thirdScene,
        },
        {
          title: t("nav.three-train.fourth-scene"),
          href: PATH_ROUTE_NAME.fourthScene,
        },
      ],
    },
    {
      title: t("nav.maps.title"),
      href: PATH_ROUTE_NAME.maps,
      children: [
        {
          title: t("nav.maps.leko"),
          href: PATH_ROUTE_NAME.leko,
        },
      ],
    },
  ];
};

export default NavigationConfig;
