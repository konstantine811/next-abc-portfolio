"use client";

import { useAppSelector } from "@/lib/store/hooks";

import Ripple from "@/components/ui/ripple";
import useSound from "use-sound";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const Preloader = () => {
  const t = useTranslations("Common");
  const [play, { stop }] = useSound("/sounds/pulse.wav", {
    volume: 0.3,
    loop: true,
  });
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );

  useEffect(() => {
    play();
    return () => stop();
  }, [play, stop]);

  return (
    <div
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
    >
      <p className="z-10 whitespace-pre-wrap text-center text-md font-medium tracking-tighter text-white">
        {t("loading")}
      </p>
      <Ripple />
    </div>
  );
};

export default Preloader;
