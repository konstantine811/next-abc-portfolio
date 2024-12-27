import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { OrthographicCamera as OrthographicCameraType } from "three";
import Map from "./Map";
import Character from "./Character";
import { Physics } from "@react-three/rapier";
import CharacterController from "./CharacterController";

interface EntityMapsConfig {
  [key: string]: MapsConfig;
}

interface MapsConfig {
  scale: number;
  position: [number, number, number];
}

const maps: EntityMapsConfig = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -7, 0],
  },
  animal_crossing_map: {
    scale: 20,
    position: [-15, -1, 10],
  },
  city_scene_tokyo: {
    scale: 0.72,
    position: [0, -1, -3.5],
  },
  de_dust_2_with_real_light: {
    scale: 0.3,
    position: [-5, -3, 13],
  },
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, 0, -6],
  },
};

enum CharacterAnimation {
  Idle = "Idle",
  Run = "Running",
  Walk = "Walking",
  Jump = "Jumping",
}

const Experience = () => {
  const shadowCameraRef = useRef<OrthographicCameraType | null>(null);
  const { map, characterAnimation } = useControls("Map", {
    map: {
      value: "castle_on_hills",
      options: Object.keys(maps),
    },
    characterAnimation: {
      value: CharacterAnimation.Idle,
      options: Object.values(CharacterAnimation),
    },
  });

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics debug key={map}>
        <Map
          scale={maps[map].scale}
          position={maps[map].position}
          model={`/3d-models/fifth-scene-models/${map}.glb`}
        />
        <CharacterController></CharacterController>
        {/* <CharacterController>
          <CharacterS
            model="/3d-models/character.glb"
            animation={characterAnimation}
          />
        </CharacterController> */}
      </Physics>
    </>
  );
};

export default Experience;
