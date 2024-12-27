import {
  Gltf,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  useHelper,
} from "@react-three/drei";
import Player from "./Player";
import { Playground } from "./Playground";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import CharacterController from "../fifthScene/CharacterController";
import { useRef } from "react";
import {
  CameraHelper,
  Object3D,
  PerspectiveCamera as PerspectiveCameraType,
} from "three";

const Experience = () => {
  const shadowCamera = useRef<PerspectiveCameraType>(null);
  useHelper(shadowCamera as React.MutableRefObject<Object3D>, CameraHelper);
  return (
    <>
      <OrbitControls />
      <directionalLight
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        position={[-50, 50, 5]}
        intensity={0.4}
        castShadow
      >
        <PerspectiveCamera
          ref={shadowCamera}
          attach={"shadow-camera"}
          near={55}
          far={86}
          fov={80}
        />
      </directionalLight>
      <directionalLight position={[10, 10, 5]} intensity={0.2} />
      <ambientLight intensity={0.5} />
      {/* <RigidBody type="fixed" friction={5} name="ground">
        <mesh position-y={-0.251} receiveShadow>
          <boxGeometry args={[200, 0.5, 200]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody> */}
      {/* {Array.from({ length: 10 }, (_, i) => i++).map((number) =>
        Array.from({ length: 10 }, (_, i) => i++).map((number2) => (
          <RigidBody key={number + number2} mass={10}>
            <mesh
              position-x={number2 * 1}
              position-y={number * 1 + 0.5}
              position-z={-3}
              receiveShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </RigidBody>
        ))
      )} */}

      {/* <RigidBody
        friction={3}
        colliders={false}
        position-x={3}
        position-y={3}
        gravityScale={0.2}
        restitution={1.2}
      >
        <Gltf src="/3d-models/sixth-scene-models/ball.glb" castShadow />
        <BallCollider args={[1]} />
      </RigidBody> */}
      <RigidBody
        type="fixed"
        colliders={false}
        sensor
        name="space"
        position-y={-5}
      >
        <CuboidCollider args={[50, 0.5, 50]} />
      </RigidBody>
      <Playground />
      <Player />
      {/* <CharacterController /> */}
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
