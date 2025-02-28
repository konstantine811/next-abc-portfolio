"use client";

import CustomOrbitControls from "@/components/three-scenes/customOrbitControls";
import MainWrapper from "@/components/wrapper/main-wrapper";
import { Canvas } from "@react-three/fiber";

const SimCityGamePage = () => {
  return (
    <MainWrapper>
      <Canvas shadows camera={{ fov: 60 }}>
        <CustomOrbitControls />
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
