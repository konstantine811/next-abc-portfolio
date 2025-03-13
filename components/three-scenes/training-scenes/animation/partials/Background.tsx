import { useEffect, useRef } from "react";
import { BackSide, MeshBasicMaterial } from "three";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

const Background = () => {
  const skyMaterial = useRef<MeshBasicMaterial>(null!);
  const tl = useRef<gsap.core.Timeline>(null!);
  const skyData = useRef({
    color: "#313131",
  });
  const scrollData = useScroll();
  useEffect(() => {
    tl.current = gsap.timeline();
    tl.current.to(skyData.current, {
      duration: 1,
      color: "#ffc544",
    });
    tl.current.to(skyMaterial.current.color, {
      duration: 1,
      color: "#7c4e9f",
    });
    tl.current.pause();
  }, []);

  useFrame(() => {
    if (!tl.current) {
      return;
    }
    tl.current.progress(scrollData.offset);
    skyMaterial.current.color.set(skyData.current.color);
  });
  return (
    <mesh rotation-x={Math.PI / 4}>
      <sphereGeometry args={[16, 32, 32]} />
      <meshBasicMaterial side={BackSide} color={"#313131"} ref={skyMaterial} />
    </mesh>
  );
};

export default Background;
