import { Pathnames } from "next-intl/navigation";

export enum LocaleType {
  en = "en",
  uk = "uk",
}

export const LOCALES = [LocaleType.en, LocaleType.uk] as const;

export const pathnames = {
  "/": "/",
  "/blog": "/blog",
} satisfies Pathnames<typeof LOCALES>;
