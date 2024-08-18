import { EASING_ANIMATION } from "@/configs/animations";
import { motion, Transition } from "framer-motion";
import { forwardRef } from "react";

interface Props {
  onOpen: (status: boolean) => void;
  isOpen: boolean;
  props?: React.HTMLProps<HTMLDivElement>;
}

const BurgerMenu = forwardRef<HTMLDivElement, Props>(
  ({ onOpen, isOpen, ...props }, ref) => {
    const duration: Transition = {
      duration: 0.2,
      ease: EASING_ANIMATION.easeOutExpo,
    };

    const toggleMenu = () => {
      onOpen(isOpen);
    };
    return (
      <div
        ref={ref}
        {...props}
        onClick={toggleMenu}
        className="relative w-8 h-5 cursor-pointer flex flex-col"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 9 : 0 }}
          className="block w-full h-px bg-foreground mb-2"
          transition={duration}
        />
        <motion.span
          animate={{ opacity: isOpen ? 0 : 1 }}
          className="block w-1/2 h-px bg-foreground mb-2 align-self-end"
          transition={duration}
        />
        <motion.span
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -9 : 0 }}
          className="block w-full h-px bg-foreground"
          transition={duration}
        />
      </div>
    );
  }
);

BurgerMenu.displayName = "BurgerMenu";

export default BurgerMenu;
