"use client";
import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Experience = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} shadows>
      <OrbitControls />
      <directionalLight
        castShadow
        shadow-normalBias={0.06}
        position={[20, 30, 10]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={50}
        shadow-camera-right={50}
        shadow-camera-bottom={50}
        shadow-camera-left={-50}
        name="followLight"
      />
      <ambientLight intensity={0.5} />
      <Grid
        args={[300, 300]}
        sectionColor={"#222222"}
        cellColor={"gray"}
        position={[0, -0.99, 0]}
        userData={{ camExcludeCollision: true }}
      />
      <mesh>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" color={"#222222"} />
      </mesh>
    </Canvas>
  );
};

export default Experience;
