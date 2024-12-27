import { Grid, OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import CharacterController from "./CharacterController";
import CharacterLoaderAnimation from "../utils/CharacterLoaderAnimation";
import { CharacterAnimation } from "./config";
import { useState } from "react";

const Experience = () => {
  const [characterAnimation, setCharacterAnimation] =
    useState<CharacterAnimation>(null!);
  return (
    <>
      <OrbitControls />
      <directionalLight
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        position={[-50, 50, 5]}
        intensity={0.4}
        castShadow
      ></directionalLight>
      <OrbitControls
        enableDamping={false}
        minDistance={3}
        maxDistance={10}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
      />
      <RigidBody name="ground" type="fixed">
        <mesh position-y={-0.251} receiveShadow>
          <boxGeometry args={[200, 0.5, 200]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody>
      <RigidBody name="box-ground">
        <mesh position={[0, 0, 10]} receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody>
      <RigidBody name="box-ground-2">
        <mesh position={[0, 2, 2]} receiveShadow>
          <boxGeometry args={[0.3, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      <CharacterController
        onAnimate={setCharacterAnimation}
        capsuleSize={[0.28, 0.2]}
        characterYOffset={-0.48}
      >
        <CharacterLoaderAnimation
          model="/3d-models/character.glb"
          animation={characterAnimation}
        />
      </CharacterController>
      <directionalLight position={[10, 10, 5]} intensity={0.2} />
      <ambientLight intensity={0.5} />
      <Grid
        sectionSize={3}
        sectionColor={"white"}
        sectionThickness={1}
        cellSize={1}
        cellColor={"#ececec"}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={100}
        fadeStrength={5}
      />
    </>
  );
};

export default Experience;
