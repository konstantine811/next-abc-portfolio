"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

const ThemeProvider = ({
  children,
  props,
}: Readonly<{
  children: React.ReactNode;
  props?: ThemeProviderProps;
}>) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
