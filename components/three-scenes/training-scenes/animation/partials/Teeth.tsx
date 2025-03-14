import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Material, Mesh, MeshStandardMaterial } from "three";

const Teeth = () => {
  const [opened, setOpened] = useState(false);
  const meshRefs = [
    useRef<Mesh>(null!),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setOpened((prev) => !prev);
      meshRefs.forEach((ref, i) => {
        if (ref.current) {
          gsap.to(ref.current.position, {
            y: opened ? (i % 2 !== 0 ? -1 : 1) : 0,
            duration: 0.5,
            ease: "power2.inOut",
          });

          gsap.to(ref.current.rotation, {
            y: opened ? 0 : Math.PI / 2,
            duration: 0.5,
            ease: "power2.inOut",
          });

          gsap.to(ref.current.scale, {
            x: opened ? 1 : 1.1 + i * 0.05,
            y: opened ? 1 : 1.1 + i * 0.05,
            z: opened ? 1 : 1.1 + i * 0.05,
            duration: 0.5,
            ease: "power2.inOut",
          });

          gsap.to((ref.current.material as MeshStandardMaterial).color, {
            r: opened ? 1 : 0.49,
            g: opened ? 1 : 0.36,
            b: opened ? 1 : 0.81,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [opened]);

  return (
    <group>
      {meshRefs.map((ref, i) => (
        <mesh
          ref={ref}
          key={i}
          position={[i - 1, i - 1, 0]}
          rotation-x={i % 2 ? 0 : Math.PI}
        >
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
};

export default Teeth;
