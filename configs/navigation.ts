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
      ],
    },
  ];
};

export default NavigationConfig;
