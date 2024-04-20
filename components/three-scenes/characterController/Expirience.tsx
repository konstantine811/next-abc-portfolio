"use client";

import { Grid, KeyboardControls } from "@react-three/drei";
import Lights from "./scene-parts/lights";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import RoughPlane from "./scene-parts/roughPlane";

const Expirience = () => {
  const [pausedPhysics, setPausedPhysics] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPausedPhysics(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const { physics, disableFollowCam } = useControls("World Settings", {
    physics: false,
    disableFollowCam: false,
  });

  const keyboardMap = [
    {
      name: "forward",
      keys: ["KeyW", "ArrowUp"],
    },
    {
      name: "backward",
      keys: ["KeyS", "ArrowDown"],
    },
    {
      name: "leftward",
      keys: ["KeyA", "ArrowLeft"],
    },
    {
      name: "rightward",
      keys: ["KeyD", "ArrowRight"],
    },
    {
      name: "jump",
      keys: ["Space"],
    },
    {
      name: "crouch",
      keys: ["Shift"],
    },
    {
      name: "action1",
      keys: ["1"],
    },
    {
      name: "action2",
      keys: ["2"],
    },
    {
      name: "action3",
      keys: ["3"],
    },
    {
      name: "action4",
      keys: ["KeyF"],
    },
  ];
  return (
    <>
      <Grid
        args={[300, 300]}
        sectionColor={"lightgray"}
        cellColor={"gray"}
        position={[0, -0.99, 0]}
        userData={{ camExculdeCollusion: true }} // this won't be collide by camera ray
      />
      <Lights />
      <Physics debug={physics} timeStep="vary" paused={pausedPhysics}>
        {/* Keyboard preset */}
        {/* <KeyboardControls map={keyboardMap}>

        </KeyboardControls> */}
        <RoughPlane />
      </Physics>
    </>
  );
};

export default Expirience;
