"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Transition, Variants } from "framer-motion";

const customVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 40,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
  },
};

const customTransition: Transition = {
  type: "spring",
  bounce: 0.3,
  duration: 0.45,
};

const ResizableImage = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="h-full flex justify-center items-center"
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>
      <Dialog
        variants={customVariants}
        transition={customTransition}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent className="h-[calc(70vh)] bg-white p-6 dark:bg-zinc-900">
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResizableImage;
