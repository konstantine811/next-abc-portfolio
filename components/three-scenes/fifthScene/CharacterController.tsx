import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import Character from "./Character";

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) {
    angle -= Math.PI * 2;
  }
  while (angle < -Math.PI) {
    angle += Math.PI * 2;
  }
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += Math.PI * 2;
    } else {
      end += Math.PI * 2;
    }
  }
  return normalizeAngle(start + (end - start) * t);
};

interface Props {}

const CharacterController = ({}: Props) => {
  const { RUN_SPEED, WALK_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.6, min: 0.1, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(1),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 5, min: 1, max: 20, step: 0.1 },
    }
  );
  const [animation, setAnimation] = useState("idle");
  const inTheAir = useRef(false);
  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<Group | null>(null);
  const character = useRef<Group | null>(null);
  const characterRotationTarget = useRef<number>(0);
  const rotationTarget = useRef<number>(0);
  const cameraTarget = useRef<Group | null>(null);
  const cameraPosition = useRef<Group | null>(null);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = () => {
      isClicking.current = true;
    };
    const onMouseUp = () => {
      isClicking.current = false;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  useFrame(({ camera, pointer }) => {
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;
      if (isClicking.current) {
        if (Math.abs(pointer.x) > 0.1) {
          movement.x = -pointer.x;
        }
        movement.z = pointer.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }
      if (movement.x !== 0) {
        rotationTarget.current += movement.x * ROTATION_SPEED;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;

        if (speed === RUN_SPEED) {
          setAnimation("run");
        } else {
          setAnimation("walk");
        }
      } else {
        setAnimation("idle");
        vel.x = 0;
        vel.z = 0;
      }

      // Handle Jumping
      if (get().jump && !inTheAir.current) {
        vel.y = JUMP_FORCE;
        inTheAir.current = true;
        setAnimation("jump");
      }

      const characterEl = character.current;
      if (characterEl) {
        characterEl.rotation.y = lerpAngle(
          characterEl.rotation.y,
          characterRotationTarget.current,
          0.1
        );
      }
      rb.current.setLinvel(vel, true);
    }
    // CAMERA
    const containerEl = container.current;
    if (containerEl) {
      containerEl.rotation.y = lerpAngle(
        containerEl.rotation.y,
        rotationTarget.current,
        0.1
      );
    }
    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });
  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "ground") {
          inTheAir.current = false;
        }
      }}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <Character scale={0.18} positionY={-0.25} animation={animation} />
          {/* <CharacterS model="/3d-models/character.glb" animation={animation} /> */}
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};

export default CharacterController;
