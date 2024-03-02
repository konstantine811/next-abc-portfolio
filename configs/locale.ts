import { Pathnames } from "next-intl/navigation";

export const LOCALES = ["en", "uk"] as const;

export const pathnames = {
  "/": "/",
  "/blog": "/blog",
} satisfies Pathnames<typeof LOCALES>;
