import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
// config
import { LOCALES, pathnames } from "@/configs/locale";
// Use the default: `always`
export const localePrefix = undefined;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales: LOCALES,
    pathnames,
    localePrefix,
  });
