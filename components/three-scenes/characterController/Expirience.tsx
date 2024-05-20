"use client";

import { Grid, KeyboardControls, OrbitControls } from "@react-three/drei";
import Lights from "./scene-parts/lights";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import RoughPlane from "./scene-parts/roughPlane";
import Controllers from "./controllers/controllers";
import CharacterModel from "./scene-parts/characterModel";
import Floor from "./scene-parts/floor";

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
        <KeyboardControls map={keyboardMap}>
          <Controllers
            debug
            animated
            followLight
            springK={2}
            dampingC={0.2}
            maxVelLimit={5}
            autoBalanceSpringK={1.2}
            autoBalanceDampingC={0.04}
            autoBalanceSpringOnY={0.7}
            autoBalanceDampingOnY={0.05}
            disableFollowCam={disableFollowCam}
          >
            <CharacterModel />
          </Controllers>
        </KeyboardControls>
        <RoughPlane />
        <Floor />
      </Physics>
      <OrbitControls />
    </>
  );
};

export default Expirience;
