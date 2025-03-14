import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";
import { ActionName } from "../character-controller/CharacterController";
import { lerpAngle } from "@/services/three-js/game.utils";
import CharacterModel from "../character-controller/CharacterModel";

const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls({
    WALK_SPEED: { value: 2.2, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 6.4, min: 0.2, max: 12, step: 0.2 },
    ROTATION_SPEED: {
      value: degToRad(3),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    JUMP_FORCE: { value: 6, min: 1, max: 20, step: 0.1 },
  });
  const [animation, setAnimation] = useState(ActionName.Idle);
  const rb = useRef<RapierRigidBody>(null!);
  const inTheAir = useRef<boolean>(false);
  const container = useRef<Group>(null!);
  const character = useRef<Group>(null!);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<Group>(null!);
  const cameraPosition = useRef<Group>(null!);
  const cameraWorldPosition = useRef<Vector3>(new Vector3());
  const cameraLookAtWorldPosition = useRef<Vector3>(new Vector3());
  const cameraLookAt = useRef<Vector3>(new Vector3());
  const [, get] = useKeyboardControls();
  useFrame(({ camera }) => {
    const vel = { x: 0, z: 0, y: 0 };

    if (rb.current) {
      const curVel = rb.current.linvel(); // Поточна швидкість

      // Дозволити рух лише на землі
      if (get().forward) {
        vel.z = 1;
      }
      if (get().backward) vel.z = -1;
      if (get().leftward) vel.x = 1;
      if (get().rightward) vel.x = -1;
      if (get().jump && !inTheAir.current) {
        setAnimation(ActionName.JumpIdle);
        vel.y += JUMP_FORCE;
        inTheAir.current = true;
      } else {
        vel.y = curVel.y;
      }
      const speed = get().run ? RUN_SPEED : WALK_SPEED;
      if (vel.x !== 0) {
        rotationTarget.current += vel.x * ROTATION_SPEED;
      }
      if (vel.x !== 0 || vel.z !== 0) {
        if (!inTheAir.current) {
          if (speed === RUN_SPEED) {
            setAnimation(ActionName.Run);
          } else if (speed === WALK_SPEED) {
            setAnimation(ActionName.Walk);
          }
        }
        characterRotationTarget.current = Math.atan2(vel.x, vel.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
      } else {
        if (!inTheAir.current) {
          setAnimation(ActionName.Idle);
        }
        vel.x = 0;
        vel.z = 0;
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.3
      );
      rb.current.setLinvel(vel, true); // Оновити швидкість
    }
    // camera controls
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);

    camera.position.lerp(cameraWorldPosition.current, 0.1);
    cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
    cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <>
      <RigidBody
        userData={{ isGround: true }}
        colliders={false}
        position={[0, 3, 0]}
        lockRotations
        ref={rb}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.userData?.isGround) {
            inTheAir.current = false;
          }
        }}
      >
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
          <group ref={character}>
            <CharacterModel
              path={"/3d-models/character-controller/character.glb"}
              position={[0, -0.9, 0]}
              animation={animation}
              scale={1}
            />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.4]} />
      </RigidBody>
    </>
  );
};

export default CharacterController;
