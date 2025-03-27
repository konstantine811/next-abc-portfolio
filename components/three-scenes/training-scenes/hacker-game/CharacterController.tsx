import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import CameraControls from "camera-controls";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import CharacterModel from "../character-controller/CharacterModel";
import { ActionName } from "../character-controller/CharacterController";
import { lerpAngle } from "@/services/three-js/game.utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Collider } from "@dimforge/rapier3d-compat";

const CharacterController = ({
  cameraControl,
}: {
  cameraControl: CameraControls | null;
}) => {
  const rigidBody = useRef<RapierRigidBody>(null!);
  const { isCameraFlow } = useSelector(
    (state: RootState) => state.controlGameState
  );
  const cameraTarget = useRef<Group>(null!);
  const container = useRef<Group>(null!);
  const character = useRef<Group>(null!);
  const cameraPosition = useRef<Group>(null!);
  const testRef = useRef<Mesh>(null!);
  const characterPosition = useRef(new Vector3());
  const inTheAir = useRef(false);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const bobbingTimeRef = useRef(0);
  const lastCharacterRotation = useRef(0);
  const canJump = useRef(true);
  const [colliderArgs, setColliderArgs] = useState<[number, number]>([
    0.7, 0.3,
  ]);
  const { backward, forward, jump, leftward, rightward, run } = useSelector(
    (state: RootState) => state.controlGameState
  );
  const { JUMP_FORCE, RUN_SPEED, WALK_SPEED, isShakingCamera, GRAVITY_SCALE } =
    useControls({
      JUMP_FORCE: { value: 7, min: 1, max: 20, step: 0.1 },
      WALK_SPEED: { value: 2.9, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 6.4, min: 0.2, max: 12, step: 0.2 },
      GRAVITY_SCALE: { value: 1.5, min: 0, max: 10, step: 0.1 },
      isShakingCamera: { value: false },
    });

  const [animation, setAnimation] = useState(ActionName.Idle);

  useEffect(() => {
    if (cameraControl && rigidBody.current) {
      const pos = rigidBody.current.translation();
      // Наприклад: камера позаду і трохи вище гравця
      cameraControl.setLookAt(
        pos.x, // camera x
        pos.y + 3, // camera y
        pos.z - 2, // camera z
        pos.x, // target x
        pos.y + 1, // target y
        pos.z // target z
      );
    }
  }, [cameraControl]);

  useFrame(({ camera, clock }) => {
    const delta = clock.getDelta();

    if (!rigidBody.current) return;

    const curVel = rigidBody.current.linvel();
    const pos = rigidBody.current.translation();
    characterPosition.current.set(pos.x, pos.y, pos.z);

    const cameraDir = new Vector3();
    camera.getWorldDirection(cameraDir);
    cameraDir.y = 0;
    cameraDir.normalize();

    const cameraRight = new Vector3();
    cameraRight.crossVectors(cameraDir, camera.up).normalize();

    const airDamping = 0.97; // як швидко згасає інерція
    const airControl = 0.03;
    const adjustedAirControl = airControl * (JUMP_FORCE / 6);
    const moveDir = new Vector3();

    if (forward) {
      moveDir.add(cameraDir);
    }
    if (backward) {
      moveDir.sub(cameraDir);
    }
    if (leftward) {
      moveDir.sub(cameraRight);
    }
    if (rightward) {
      moveDir.add(cameraRight);
    }
    const inputDir = moveDir.clone();
    const isMoving = moveDir.lengthSq() > 0;
    const speed = run ? RUN_SPEED : WALK_SPEED;
    moveDir.normalize().multiplyScalar(speed);
    // Head bobbing
    const movingSpeedBob = isMoving ? (run ? 253 : 117) : 0;
    let bobAmount = isMoving ? (run ? 0.41 : 0.09) : 0;
    const vel = {
      x: moveDir.x,
      y: jump && canJump.current && !inTheAir.current ? JUMP_FORCE : curVel.y,
      z: moveDir.z,
    };

    characterRotationTarget.current = Math.atan2(vel.x, vel.z);
    vel.x =
      Math.sin(rotationTarget.current + characterRotationTarget.current) *
      speed;
    vel.z =
      Math.cos(rotationTarget.current + characterRotationTarget.current) *
      speed;

    if (!inTheAir.current) {
      setColliderArgs([0.7, 0.3]);
      if (jump) {
        setAnimation(ActionName.JumpIdle);
        inTheAir.current = true;
      } else if (isMoving) {
        setAnimation(run ? ActionName.Run : ActionName.Walk);
      } else {
        setAnimation(ActionName.Idle);
        vel.x = 0;
        vel.z = 0;
      }
    } else {
      setColliderArgs([0.3, 0.5]);
      vel.x = curVel.x * airDamping + inputDir.x * speed * adjustedAirControl;
      vel.z = curVel.z * airDamping + inputDir.z * speed * airControl;
      bobAmount = 0;
    }

    // Обертання персонажа
    character.current.rotation.y = lerpAngle(
      character.current.rotation.y,
      lastCharacterRotation.current,
      inTheAir.current ? 0.03 : 0.27
    );

    if (isMoving) {
      lastCharacterRotation.current = Math.atan2(vel.x, vel.z);
      bobbingTimeRef.current += delta * movingSpeedBob;
    } else {
      bobbingTimeRef.current = 0;
    }
    let bobY = 0;
    let bobX = 0;
    if (isShakingCamera) {
      bobY = Math.sin(bobbingTimeRef.current) * bobAmount;
      bobX = Math.cos(bobbingTimeRef.current) * bobAmount;
    }

    // Фізика
    rigidBody.current.setLinvel(vel, true);

    // Камера з покачуванням
    if (cameraControl && isCameraFlow) {
      cameraControl.moveTo(pos.x + bobX / 13, pos.y + bobY, pos.z, true);
      cameraControl.update(delta);
    }

    // debug mesh (можна видалити)
    testRef.current.position.set(pos.x, pos.y, pos.z + 3);
  });

  return (
    <>
      <mesh ref={testRef} position={[0, 1, 3]} visible={false}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial wireframe color="blue" />
      </mesh>

      <RigidBody
        lockRotations
        ref={rigidBody}
        colliders={false}
        position={[0, 5, 0]}
        friction={0}
        gravityScale={GRAVITY_SCALE}
        mass={60}
        linearDamping={0.1}
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
              position={[0, -1.0, 0]}
              animation={animation}
              scale={1.13}
            />
          </group>
        </group>
        <CapsuleCollider key={colliderArgs.join("-")} args={colliderArgs} />
      </RigidBody>
    </>
  );
};

export default CharacterController;
