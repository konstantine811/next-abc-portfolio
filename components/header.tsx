"use client";
import { useEffect, useRef } from "react";
// utils
import { cn } from "@/lib/utils";
// compontns
import ThemeToggler from "./theme/themeToggler";
import Logo from "./own-brand/logo";
import Link from "next/link";
import LocaleSwitcherSelect from "./locale-swither/localeSwitcherSelect";
import { NavigationHeaderMenu } from "./navigation-menu/navMenu";
import { INaviagationConfig } from "@/configs/navigation";
// storeage
import { onHeaderHeight } from "@/lib/store/features/ui-state.slice";
import { useDispatch } from "react-redux";

const Header = ({ navConfig }: { navConfig: INaviagationConfig[] }) => {
  const refHeader = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const headerHeight = refHeader.current?.getBoundingClientRect().height;
    dispatch(onHeaderHeight(headerHeight ? headerHeight : 0));
  });
  return (
    <header
      ref={refHeader}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div
        className={cn(
          "container flex h-14 max-w-screen-2xl items-center justify-between"
        )}
      >
        <Link className={cn("select-none")} href="/">
          <Logo />
        </Link>
        <nav className={cn("hidden md:flex  md:items-center")}>
          <NavigationHeaderMenu navConfig={navConfig} />
        </nav>
        <div
          className={cn(
            "flex items-center justify-between space-x-2 md:justify-end gap-2"
          )}
        >
          <ThemeToggler />
          <LocaleSwitcherSelect />
        </div>
      </div>
    </header>
  );
};

export default Header;
