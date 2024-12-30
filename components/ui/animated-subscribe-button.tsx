"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedSubscribeButtonProps {
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  onChange: (status: boolean) => void;
}

export const AnimatedSubscribeButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({ subscribeStatus, changeText, initialText, onChange }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  useEffect(() => {
    onChange(isSubscribed);
  });
  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className="relative flex p-2 border items-center justify-center overflow-hidden rounded-md  outline outline-1 outline-black"
          onClick={() => setIsSubscribed(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="action"
            className="relative flex h-full w-full items-center justify-center font-semibold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            {changeText}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className="relative flex p-2 border cursor-pointer items-center justify-center rounded-md "
          onClick={() => setIsSubscribed(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="reaction"
            className="relative flex items-center justify-center font-semibold"
            initial={{ x: 0 }}
            exit={{ x: 5, transition: { duration: 0.1 } }}
          >
            {initialText}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
