"use client";

import MainWrapper from "@/components/wrapper/main-wrapper";
import { Canvas } from "@react-three/fiber";

const SimCityGamePage = () => {
  return (
    <MainWrapper>
      <Canvas shadows camera={{ position: [0, 6, 6], fov: 60 }}>
        <ambientLight intensity={1} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </Canvas>
    </MainWrapper>
  );
};

export default SimCityGamePage;
