"use client";

import { Environment, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import InteractiveGeoPoints from "./EarthParticle";
import ParticlePractic from "./ParticlePractic";
import SphereParticle from "./SphereParticle";
import EarthPracticV2 from "./EarthPractic_v2";
import ParticleImage from "./ParticleImage";

const SceneInit = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3] }} style={{ background: "#000" }}>
      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 0, 3]} color={0xffffff} intensity={10} />
      {/* <Environment
        preset="night"
        background
        blur={0.1}
        backgroundIntensity={0.2}
      /> */}
      <ParticlePractic />
      {/* <ParticleImage /> */}
      {/* <SphereParticle /> */}
      {/* <EarthPracticV2 /> */}
      {/* <InteractiveGeoPoints /> */}

      <OrbitControls />
    </Canvas>
  );
};

export default SceneInit;
