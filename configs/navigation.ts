import { useTranslations } from "next-intl";

export interface INaviagationConfig {
  title: string;
  href: string;
  children?: INaviagationConfig[];
  isDev?: boolean;
}

export enum PATH_ROUTE_NAME {
  home = "/",
  blog = "/blog",
  threeTrain = "/three-train",
  firstScene = "/first-scene",
  secondScene = "/second-scene",
  thirdScene = "/third-scene",
  fourthScene = "/fourth-scene",
  fifthScene = "/fifth-scene",
  sixthScene = "/sixth-scene",
  simCityGame = "/sim-city-game",
  seventhScene = "/seventh-scene",
  eightScene = "/eight-scene",
  traineScene = "/traine-scene",
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
          title: t("nav.three-train.third-scene"),
          href: PATH_ROUTE_NAME.thirdScene,
        },
        {
          title: t("nav.three-train.fourth-scene"),
          href: PATH_ROUTE_NAME.fourthScene,
        },
        {
          title: t("nav.three-train.fifth-scene"),
          href: PATH_ROUTE_NAME.fifthScene,
        },
        {
          title: t("nav.three-train.sixth-scene"),
          href: PATH_ROUTE_NAME.sixthScene,
        },
        {
          title: t("nav.three-train.sim-city-game"),
          href: PATH_ROUTE_NAME.simCityGame,
        },
        {
          title: t("nav.three-train.traine-scene"),
          href: PATH_ROUTE_NAME.traineScene,
        },
      ],
    },
    {
      title: t("nav.maps.title"),
      href: PATH_ROUTE_NAME.maps,
      isDev: true,
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
