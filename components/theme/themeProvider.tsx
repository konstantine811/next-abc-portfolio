"use client";
import {
  ThemeProvider as NextThemeProvider,
  ThemeProviderProps,
} from "next-themes";

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
