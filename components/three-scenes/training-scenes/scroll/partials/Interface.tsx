import { useScroll } from "@react-three/drei";
import { foodItems } from "../SceneInit";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Interface = () => {
  const introductionRef = useRef<HTMLElement>(null!);
  const scrollData = useScroll();
  useFrame(() => {
    introductionRef.current.style.opacity = `${1 - scrollData.range(0, 0.1)}`;
  });

  return (
    <>
      <section
        ref={introductionRef}
        className="w-screen h-screen grid place-items-center"
      >
        <div className="pt-5">
          <p className="text-2xl text-center">
            Welcome to Panda Sushi, scroll down to discover our delicious
            dishes!
            <br />
            👇
          </p>
        </div>
      </section>
      {foodItems.map((item, index) => (
        <section
          className="w-screen h-screen grid place-items-center "
          key={index}
        >
          <div className="bg-white/25 backdrop-blur-md rounded-sm p-3 w-[460px] max-w-full">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </div>
        </section>
      ))}
    </>
  );
};

export default Interface;
