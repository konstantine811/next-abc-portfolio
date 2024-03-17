"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const Logo = () => {
  const t = useTranslations("LocaleLayout");
  return (
    <div className={cn("flex items-center")}>
      <SvgLogo />
      <h3 className="text-sm font-sans uppercase">{t("title")}</h3>
    </div>
  );
};

const SvgLogo = () => {
  return (
    <div className={cn("flex items-center")}>
      <svg
        width="22"
        height="22"
        viewBox="-10 -50  333 333"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="111"
          cy="111"
          r="110"
          className="stroke-foreground"
          strokeWidth="20"
        />
        <path
          d="M19.0876 170.774C19.0876 164.15 20.1388 158.535 22.4197 152.164C25.5878 143.316 29.055 134.259 33.4328 125.931C39.1918 114.975 46.4219 104.851 53.1716 94.5012C64.481 77.1602 77.2284 62.0432 94.5411 50.5902C106.118 42.9318 118.67 38.5673 131.647 34.0141C135.675 32.6007 139.337 30.2017 143.337 28.7617C145.354 28.0359 147.636 28.6855 149.719 28.3382C154.451 27.5496 159.54 25.9096 164.347 25.9096C166.011 25.9096 177.12 24.9881 176.659 25.9096"
          className="stroke-foreground"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M46.5355 22.3516C52.0915 22.3516 57.0693 22.6704 62.3491 24.7519C75.1309 29.7908 87.5842 36.2014 99.6805 42.6834C110.058 48.2442 121.006 53.273 130.574 60.1913C136.87 64.7438 142.687 70.0566 148.59 75.1013C154.523 80.1726 160.433 85.4382 165.702 91.1973C170.081 95.9835 173.635 101.183 177.676 106.22C183.957 114.051 191.033 121.865 196.454 130.336C200.157 136.122 204.369 141.882 207.157 148.155C207.908 149.844 209.078 151.155 209.952 152.729C210.45 153.624 212.748 157.075 212.748 157.05"
          className="stroke-foreground"
          strokeWidth="20"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
