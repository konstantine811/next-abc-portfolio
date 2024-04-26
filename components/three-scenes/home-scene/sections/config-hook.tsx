import { useTranslations } from "next-intl";

export interface ISkillsConfig {
  title: string;
  children: {
    title: string;
    progressCount: number;
    icon?: string;
  }[];
}

const ConfigHook = () => {
  const t = useTranslations("Portfolio");
  const skillsConfig: ISkillsConfig[] = [
    {
      title: t("skills.develop.title"),
      children: [
        {
          title: t("skills.develop.js"),
          progressCount: 85,
        },
        {
          title: t("skills.develop.styles"),
          progressCount: 85,
        },
        {
          title: t("skills.develop.angular"),
          progressCount: 82,
        },
        {
          title: t("skills.develop.maps"),
          progressCount: 75,
        },
        {
          title: t("skills.develop.react"),
          progressCount: 70,
        },
        {
          title: t("skills.develop.tools"),
          progressCount: 70,
        },
        {
          title: t("skills.develop.webGl"),
          progressCount: 70,
        },
        {
          title: t("skills.develop.canvas"),
          progressCount: 70,
        },
        {
          title: t("skills.develop.animation"),
          progressCount: 66,
        },
        {
          title: t("skills.develop.design"),
          progressCount: 60,
        },
        {
          title: t("skills.develop.vue"),
          progressCount: 50,
        },

        {
          title: t("skills.develop.backend"),
          progressCount: 50,
        },
        {
          title: t("skills.develop.database"),
          progressCount: 50,
        },
        {
          title: t("skills.develop.3d"),
          progressCount: 40,
        },
      ],
    },
    {
      title: t("skills.languages.title"),
      children: [
        {
          title: t("skills.languages.en"),
          progressCount: 55,
          icon: "🇺🇸",
        },
        {
          title: t("skills.languages.uk"),
          progressCount: 95,
          icon: "🇺🇦",
        },
      ],
    },
  ];

  return { skillsConfig };
};

export default ConfigHook;
