import { Quicksand } from "next/font/google";
// components
import Header from "@/components/header";

import { cn } from "@/lib/utils";
import { LOCALES } from "@/configs/locale";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import ThemeProvider from "@/components/theme/themeProvider";
import { THEME_TYPES } from "@/@types/theme";

import ReduxProvider from "@/lib/store/StoreProvider";

import { Toaster } from "@/components/ui/toaster";

import { Suspense } from "react";
import Loading from "./loading";

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
        <ReduxProvider>
          <ThemeProvider
            props={{ defaultTheme: THEME_TYPES.dark, attribute: "class" }}
          >
            {" "}
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
