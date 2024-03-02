"use client";

import { Canvas } from "@react-three/fiber";
import Wave from "./shader-mesh/wave";

const ShaderTrain = () => {
  return (
    <Canvas camera={{ fov: 16, position: [0, 0, 5] }} shadows>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} decay={0} />
      <Wave />
    </Canvas>
  );
};

export default ShaderTrain;
