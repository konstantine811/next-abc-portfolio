"use client";
import { useControls } from "leva";
import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// scene-world
import Lights from "./scene-world/Light";
import { Physics } from "@react-three/rapier";
import Floor from "./scene-world/Floor";
// controller
import CharacterController from "./controller/CharacterController";

const Experience = () => {
  const { physics } = useControls("World Settings", {
    physics: false,
  });

  return (
    <Canvas shadows camera={{ fov: 60 }}>
      <Grid
        args={[300, 300]}
        sectionColor={"lightgray"}
        cellColor={"gray"}
        position={[0, -0.99, 0]}
        userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
      />
      <OrbitControls />
      <Lights />
      <Physics debug={physics}>
        <Floor />
        <CharacterController modelPath="/3d-models/character.glb" />
      </Physics>
    </Canvas>
  );
};

export default Experience;
