import { JSX, useRef } from "react";
import { Colors } from "./config-scene";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const AirPlane = ({ props }: { props?: JSX.IntrinsicElements["group"] }) => {
  const propellerRef = useRef<Group>(null!);

  useFrame(() => {
    if (propellerRef.current) {
      propellerRef.current.rotation.x += 0.3;
    }
  });
  return (
    <group {...props}>
      {/* Create the cabin */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[60, 50, 50, 1, 1, 1]} />
        <meshPhongMaterial color={Colors.red} flatShading />
      </mesh>
      {/* Create the engine */}
      <mesh position={[40, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 50, 50, 1, 1, 1]} />
        <meshPhongMaterial color={Colors.white} flatShading />
      </mesh>
      {/* Create the tail */}
      <mesh position={[-35, 25, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 20, 5, 1, 1, 1]} />
        <meshPhongMaterial color={Colors.red} flatShading />
      </mesh>
      {/* Create the wing */}
      <mesh>
        <boxGeometry args={[40, 8, 150, 1, 1, 1]} />
        <meshPhongMaterial color={Colors.red} flatShading />
      </mesh>
      <group ref={propellerRef} position={[50, 0, 0]}>
        {/* propeller */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 10, 10, 1, 1, 1]} />
          <meshPhongMaterial color={Colors.brown} flatShading />
        </mesh>
        {/* blades */}
        <mesh position={[8, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 100, 20, 1, 1, 1]} />
          <meshPhongMaterial color={Colors.brownDark} flatShading />
        </mesh>
      </group>
    </group>
  );
};

export default AirPlane;
