"use client";

import { useAppSelector } from "@/lib/store/hooks";

import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0.59, y: -10, filter: "blur(3.3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0.59, y: -10, filter: "blur(3.3px)" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
    >
      <p className="z-10 whitespace-pre-wrap text-center text-md font-medium tracking-tighter text-white">
        {t("loading")}
      </p>
      <Ripple />
    </motion.div>
  );
};

export default Preloader;
