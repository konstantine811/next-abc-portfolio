import { Pathnames } from "next-intl/routing";

export enum LocaleType {
  en = "en",
  uk = "uk",
}

export const LOCALES = [LocaleType.en, LocaleType.uk] as const;

export const pathnames = {
  "/": { en: "/", uk: "/" },
  "/blog": { en: "/blog", uk: "/blog" },
} satisfies Pathnames<typeof LOCALES>;
