"use client";
import { useEffect, useRef } from "react";
// utils
import { cn } from "@/lib/utils";
// compontns
import ThemeToggler from "./theme/themeToggler";
import Logo from "./own-brand/logo";
import LocaleSwitcherSelect from "./locale-swither/localeSwitcherSelect";
import { NavigationHeaderMenu } from "./navigation-menu/navMenu";
import NavigationConfig, { INaviagationConfig } from "@/configs/navigation";
// storeage
import {
  onHeaderHeight,
  onScreenSize,
} from "@/lib/store/features/ui-state.slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { DEVICE_SIZES } from "@/configs/responsive";
import MobileMenu from "./navigation-menu/mobileMenu";
import { Link } from "@/i18n/routing";

const Header = () => {
  const refHeader = useRef<HTMLDivElement>(null);
  const navConfig = NavigationConfig();
  const dispatch = useDispatch();
  const { screenWidth } = useAppSelector(
    (state: RootState) => state.uiStateReducer
  );
  useEffect(() => {
    const headerHeight = refHeader.current?.getBoundingClientRect().height;
    dispatch(onHeaderHeight(headerHeight ? headerHeight : 0));
  });

  useEffect(() => {
    const handleReisize = () => {
      dispatch(
        onScreenSize({ width: window.innerWidth, height: window.innerHeight })
      );
    };
    handleReisize();
    window.addEventListener("resize", handleReisize);
    return () => {
      window.removeEventListener("resize", handleReisize);
    };
  });
  return (
    <header
      ref={refHeader}
      id="header"
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
        {screenWidth >= DEVICE_SIZES.TABLET && (
          <nav className={cn("flex items-center")}>
            <NavigationHeaderMenu navConfig={navConfig} />
          </nav>
        )}
        <div
          className={cn(
            "flex items-center justify-between space-x-2 md:justify-end gap-2"
          )}
        >
          <ThemeToggler />
          <LocaleSwitcherSelect />
          {screenWidth < DEVICE_SIZES.TABLET && (
            <MobileMenu navConfig={navConfig} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
