"use client";
import { useControls } from "leva";
import { Grid, KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// scene-world
import Lights from "./scene-world/Light";
import { Physics } from "@react-three/rapier";
import Floor from "./scene-world/Floor";
// controller
import CharacterController from "./controller/CharacterController";
import CharacterJoystickControls from "./controller/CharacterJoystickControl";

/**
 * Keyboard control preset
 */
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

const Experience = () => {
  const { physics } = useControls("World Settings", {
    physics: false,
  });

  return (
    <>
      <CharacterJoystickControls />
      <Canvas shadows camera={{ fov: 60 }}>
        <Grid
          args={[300, 300]}
          sectionColor={"lightgray"}
          cellColor={"gray"}
          position={[0, -0.99, 0]}
          userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
        />
        <Lights />
        <Physics debug={physics}>
          <KeyboardControls map={keyboardMap}>
            {/* Character Control */}
            <CharacterController modelPath="/3d-models/character.glb" />
          </KeyboardControls>
          <Floor />
        </Physics>
      </Canvas>
    </>
  );
};

export default Experience;
