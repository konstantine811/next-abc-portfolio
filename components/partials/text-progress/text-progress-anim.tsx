"use client";

import { Progress } from "@/components/ui/progress";
import { animate, useInView, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TextInViewAnim from "./text-in-view-anim";

interface Props {
  title: string;
  progressCount: number;
  delay: number;
  className?: string;
  icon?: string;
}

const TextProgressAnim = ({
  title,
  progressCount,
  delay,
  icon,
  className,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const container = useRef(null!);
  const isInView = useInView(container, { margin: "0px 0px -100px 0px" });
  useEffect(() => {
    if (isInView) {
      animate(0, progressCount, {
        duration: 1,
        delay,
        ease: "circInOut",
        onUpdate: (latest) => setProgress(latest),
      });
    } else {
      setProgress(0);
    }
  }, [isInView, progressCount, delay]);
  return (
    <div className={className} ref={container}>
      <TextInViewAnim>
        <h4 className="text-xl">
          {icon ? <span className="mr-1">{icon}</span> : ""}
          {title}
        </h4>
      </TextInViewAnim>
      <div className="inline-flex flex-col justify-center items-center">
        <Progress value={progress} className="w-96 h-2" />
        {/* <span className="text-sm">{progress.toFixed()}</span> */}
      </div>
    </div>
  );
};

export default TextProgressAnim;
