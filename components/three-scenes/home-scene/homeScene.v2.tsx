"use client";
import { TextScramble } from "@/components/ui/text-scramble";
import useWindowSize from "@rooks/use-window-size";
import Image from "next/image";
import ParticleImage, {
  forces,
  ParticleForce,
  ParticleOptions,
  Vector,
} from "react-particle-image";

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    // Make a particle for this pixel if blue > 50 (range 0-255)
    return pixel.b > 50;
  },
  color: ({ x, y, image }) => "#666",
  radius: () => Math.random() * 1.5 + 0.5,
  mass: () => 300,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  },
};

const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5.5);
};

const HomeScene = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  return (
    <TextScramble
      className="font-mono text-sm"
      duration={1.2}
      characterSet=". "
    >
      Завантаження системи...
    </TextScramble>
    // <ParticleImage
    //   className="relative z-10"
    //   src={"/assets/images/main.png"}
    //   width={Number(innerWidth)}
    //   height={Number(innerHeight)}
    //   scale={1.15}
    //   entropy={20}
    //   maxParticles={90000}
    //   particleOptions={particleOptions}
    //   mouseMoveForce={motionForce}
    //   touchMoveForce={motionForce}
    //   backgroundColor="transparent"
    // />
  );
};

export default HomeScene;
