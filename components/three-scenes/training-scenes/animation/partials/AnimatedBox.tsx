import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { JSX, useRef } from "react";
import { MathUtils, Mesh, Vector3 } from "three";

interface AnimatedBoxProps {
  props?: JSX.IntrinsicElements["group"];
  boxPositions: { x: number; y: number; z: number }[];
}

const AnimatedBox = ({ props, boxPositions }: AnimatedBoxProps) => {
  const box = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    const seconds = clock.getElapsedTime();
    const targetPosition =
      boxPositions[Math.floor(seconds % boxPositions.length)];
    box.current.position.lerp(targetPosition, 0.05);
  });
  return (
    <group {...props}>
      <RoundedBox
        scale={0.5}
        position-x={boxPositions[0].x}
        position-y={boxPositions[0].y}
        position-z={boxPositions[0].z}
        ref={box}
      >
        <meshStandardMaterial color="white" />
      </RoundedBox>
    </group>
  );
};

export default AnimatedBox;
