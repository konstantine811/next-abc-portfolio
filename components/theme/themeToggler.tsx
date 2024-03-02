"use client";
import { useTheme } from "next-themes";
// utils
import { cn } from "@/lib/utils";
// lib components
import { MoonIcon, SunIcon } from "lucide-react";
// project components
import { Switch } from "@/components/ui/switch";
// types
import { THEME_TYPES } from "@/@types/theme";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className={cn("items-center select-none relative flex")}>
      <SunIcon
        className={cn(
          "h-4 pointer-events-none absolute z-10 transition-all scale-100 origin-center  rotate-0 dark:-rotate-90 dark:scale-0 right-0 top-1"
        )}
      />
      <MoonIcon
        className={cn(
          "h-4 pointer-events-none absolute z-10 transition-all rotate-90 origin-center  scale-0 dark:rotate-0 dark:scale-100 top-1"
        )}
      />
      <Switch
        checked={THEME_TYPES.light === theme}
        onClick={() => {
          setTheme(
            theme === THEME_TYPES.dark ? THEME_TYPES.light : THEME_TYPES.dark
          );
        }}
      ></Switch>
    </div>
  );
};

export default ThemeToggler;
