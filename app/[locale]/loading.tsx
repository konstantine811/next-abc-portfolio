"use client";

import { motion } from "framer-motion";

import Preloader from "@/components/partials/prelaoder/preloader";

const Loading = () => {
  const animationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Preloader />
    </motion.div>
  );
};

export default Loading;
