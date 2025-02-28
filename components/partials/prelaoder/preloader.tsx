"use client";

import { useAppSelector } from "@/lib/store/hooks";

import { motion } from "framer-motion";

import Ripple from "@/components/ui/ripple";
import useSound from "use-sound";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { TextScramble } from "@/components/ui/text-scramble";

const Preloader = () => {
  const t = useTranslations("Common");
  const { isSfxEnabled } = useSelector(
    (state: RootState) => state.uiStateReducer
  );
  const [play, { stop, sound }] = useSound("/sounds/pulse.wav", {
    volume: 0.4,
    loop: true,
  });
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );

  const stopWithFade = useCallback(() => {
    if (sound) {
      let currentVolume = sound.volume();
      const fadeOutInterval = setInterval(() => {
        if (currentVolume > 0.05) {
          currentVolume -= 0.05;
          sound.volume(currentVolume); // Зменшуємо гучність
        } else {
          clearInterval(fadeOutInterval);
          stop(); // Зупиняємо звук
        }
      }, 100); // Затримка для плавності (100 мс)
    }
  }, [sound, stop]);

  useEffect(() => {
    if (isSfxEnabled) {
      play();
    }
    return () => stopWithFade();
  }, [play, stopWithFade, isSfxEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(3.3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(3.3px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        height: `calc(100vh - ${headerHeight}px)`,
        top: `${headerHeight}px`,
      }}
      className="absolute z-[1000] pointer-events-none flex w-full backdrop-blur-sm  left-0 flex-col items-center justify-center overflow-auto"
    >
      <TextScramble
        className="z-10 opacity-25 whitespace-pre-wrap text-center text-md font-medium tracking-tighter text-foreground"
        duration={1.2}
        characterSet=". "
      >
        {t("loading")}
      </TextScramble>

      <Ripple />
    </motion.div>
  );
};

export default Preloader;
