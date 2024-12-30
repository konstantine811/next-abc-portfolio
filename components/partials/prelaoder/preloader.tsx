"use client";

import { useAppSelector } from "@/lib/store/hooks";

import { motion } from "framer-motion";

import Ripple from "@/components/ui/ripple";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const Preloader = () => {
  const t = useTranslations("Common");
  const [play, { stop, sound }] = useSound("/sounds/pulse.wav", {
    volume: 0.4,
    loop: true,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );

  const stopWithFade = () => {
    if (sound) {
      let currentVolume = sound.volume();
      const fadeOutInterval = setInterval(() => {
        if (currentVolume > 0.05) {
          currentVolume -= 0.05;
          sound.volume(currentVolume); // Зменшуємо гучність
        } else {
          clearInterval(fadeOutInterval);
          stop(); // Зупиняємо звук
          setIsPlaying(false);
        }
      }, 100); // Затримка для плавності (100 мс)
    }
  };

  useEffect(() => {
    play();
    return () => stopWithFade();
  }, [play, stopWithFade]);

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
      className="fixed pointer-events-none flex w-full backdrop-blur-sm  left-0 flex-col items-center justify-center overflow-hidden"
    >
      <p className="z-10 whitespace-pre-wrap text-center text-md font-medium tracking-tighter text-white">
        {t("loading")}
      </p>
      <Ripple />
    </motion.div>
  );
};

export default Preloader;
