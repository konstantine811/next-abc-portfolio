import { Dodecahedron } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import gsap from "gsap";

const AnimatedDodecahedron = () => {
  const ref = useRef<Group>(null!);
  useEffect(() => {
    gsap.to(ref.current.position, {
      x: 1,
      y: 1,
      repeat: Infinity,
      yoyo: true,
      duration: 1,
      ease: "power2.inOut",
      repeatDelay: 0.05,
    });
    gsap.from(ref.current.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 1,
      repeat: Infinity,
      yoyo: true,
      repeatDelay: 0.05,
      ease: "power2.inOut",
    });
  }, []);
  return (
    <group ref={ref} position-x={-1} position-y={1}>
      <Dodecahedron>
        <meshStandardMaterial color="red" transparent opacity={0.6} />
      </Dodecahedron>
    </group>
  );
};

export default AnimatedDodecahedron;
