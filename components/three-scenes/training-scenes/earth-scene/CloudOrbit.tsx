import { Cloud } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

const NUM_CLOUDS = 600; // Кількість хмар
const EARTH_RADIUS = 10.2; // Трохи більше за радіус планети

export default function CloudOrbit() {
  const cloudsRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.1; // Обертання навколо осі Y
    }
  });

  return (
    <group ref={cloudsRef}>
      {Array.from({ length: NUM_CLOUDS }).map((_, i) => {
        // Генеруємо випадкові сферичні координати
        const theta = Math.random() * Math.PI * 2; // Кут у горизонтальній площині
        const phi = Math.acos(2 * Math.random() - 1); // Вертикальний кут

        // Перетворюємо сферичні координати у декартові
        const x = EARTH_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = EARTH_RADIUS * Math.cos(phi);
        const scale = Math.random() * 0.001 + 0.05; // Випадковий масштаб
        return (
          <Cloud
            key={i}
            position={[x, y, z]}
            speed={0.01}
            segments={10}
            opacity={1}
            scale={[scale, scale, scale]}
          />
        );
      })}
    </group>
  );
}
