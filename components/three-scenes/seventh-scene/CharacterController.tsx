import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { CharacterAnimation } from "./config";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { degToRad } from "three/src/math/MathUtils.js";
import { on } from "events";

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

const directionOffset = (
  forward: boolean,
  backward: boolean,
  left: boolean,
  right: boolean
) => {
  let directionOffset = 0; // w
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; // w + a
    } else if (right) {
      directionOffset = -Math.PI / 4; // w + d
    }
  } else if (backward) {
    if (left) {
      directionOffset = (Math.PI * 3) / 4; // s + a
    } else if (right) {
      directionOffset = (-Math.PI * 3) / 4; // s + d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (left) {
    directionOffset = Math.PI / 2; // a
  } else if (right) {
    directionOffset = -Math.PI / 2; // d
  }
  return directionOffset;
};

interface Props {
  children: React.ReactNode;
  capsuleSize: [number, number];
  characterYOffset: number;
  onAnimate: (animation: CharacterAnimation) => void;
}

const CharacterController = ({
  children,
  capsuleSize,
  characterYOffset,
  onAnimate,
}: Props) => {
  // ui controls
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
  // rigid body
  const rb = useRef<RapierRigidBody>(null!);
  const inTheAir = useRef(false);
  const container = useRef<Group | null>(null);
  const character = useRef<Group | null>(null);
  const cameraTarget = useRef<Group | null>(null);
  const cameraPosition = useRef<Group | null>(null);
  const characterWorldPosition = useRef(new Vector3());
  // rotation
  const cameraWorldPosition = useRef(new Vector3());
  const rotationTarget = useRef<number>(0);
  const characterRotationTarget = useRef<number>(0);
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  // character control
  const rotationQuaternion = useRef<Quaternion>(new Quaternion());
  const rotateAngle = useRef<Vector3>(new Vector3(0, 1, 0));
  const walkDirection = useRef<Vector3>(new Vector3());
  // keyboard controls
  const [, get] = useKeyboardControls();
  // swithers
  const isClicking = useRef(false);

  useEffect(() => {
    onAnimate(CharacterAnimation.Idle);
  }, [onAnimate]);

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

      if (get().forward && !inTheAir.current) {
        movement.z = 1;
      }
      if (get().backward && !inTheAir.current) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;
      if (isClicking.current && !inTheAir.current) {
        if (Math.abs(pointer.x) > 0.1) {
          movement.x = -pointer.x;
        }
        movement.z = pointer.y + 0.4;
        if (
          (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) &&
          !inTheAir.current
        ) {
          speed = RUN_SPEED;
        }
      }

      if (get().left && !inTheAir.current) {
        movement.x = 1;
      }
      if (get().right && !inTheAir.current) {
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
          onAnimate(CharacterAnimation.Run);
        } else {
          onAnimate(CharacterAnimation.Walk);
        }
      } else if (!inTheAir.current) {
        onAnimate(CharacterAnimation.Idle);
        vel.x = 0;
        vel.z = 0;
      }
      // Handle Jumpingw
      if (get().jump && !inTheAir.current) {
        setTimeout(() => {
          vel.y = JUMP_FORCE;
          rb.current.setLinvel(vel, true);
        }, 500);
        inTheAir.current = true;
        onAnimate(CharacterAnimation.Jump);
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
        if (other.rigidBodyObject?.name.includes("ground")) {
          onAnimate(CharacterAnimation.Idle);
          inTheAir.current = false;
        }
      }}
      position={[0, 3, 0]}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group position-y={characterYOffset} ref={character}>
          {children}
        </group>
      </group>
      <CapsuleCollider args={capsuleSize} />
    </RigidBody>
  );
};

export default CharacterController;
