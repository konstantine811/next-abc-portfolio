import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { ComponentPropsWithoutRef } from "react";

interface AnimatedButtonProps
  extends ComponentPropsWithoutRef<typeof motion.button> {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

const AnimatedButton = ({
  className,
  title,
  children,
  ...props
}: AnimatedButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99, rotate: -3.5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(className)}
      {...props}
    >
      {title}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
