"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
// components
import Projects from "@/components/portfolio-content/projects";
import ShaderTrain from "@/components/three-scenes/shader-train";
import MainWrapper from "@/components/wrapper/main-wrapper";
import SmoothScroll from "@/components/wrapper/smoothScroll";

const EarthScene = dynamic(() => import("@/components/three-scenes/earth"), {
  ssr: false,
  loading: () => (
    <Image
      className="object-contain"
      fill
      alt="earth"
      src="/assets/textures/earth/placeholder.png"
    />
  ),
});

const FirstScenePage = () => {
  return (
    <div className="min-h-[300vh]">
      <SmoothScroll>
        <MainWrapper>
          <ShaderTrain />
        </MainWrapper>
        <MainWrapper className="relative flex items-center justify-center">
          <EarthScene />
          <Projects />
        </MainWrapper>
      </SmoothScroll>
    </div>
  );
};

export default FirstScenePage;
