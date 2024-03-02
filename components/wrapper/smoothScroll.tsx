"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const SmoothScroll = ({ children }: Props) => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);
  return children;
};

export default SmoothScroll;
