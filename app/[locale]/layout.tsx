import { Quicksand } from "next/font/google";
// components
import Header from "@/components/header";
// theme providers
import ThemeProvider from "@/components/theme/themeProvider";
import { THEME_TYPES } from "@/@types/theme";
import { cn } from "@/lib/utils";
import { LOCALES } from "@/configs/locale";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import NavigationConfig from "@/configs/navigation";
import ReduxProvider from "@/lib/store/StoreProvider";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Toaster } from "@/components/ui/toaster";

import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const fontSans = Quicksand({
  subsets: ["latin"], // You can specify which subsets to include
  weight: ["400", "500", "600", "700"], // Specify the weights you need
  display: "swap", // Optional, helps with loading performance
  variable: "--font-sans",
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    icons: {
      icon: "/icon/logoLeko.svg",
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // Enable static rendering
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <ThemeProvider
              props={{ defaultTheme: THEME_TYPES.dark, attribute: "class" }}
            >
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
