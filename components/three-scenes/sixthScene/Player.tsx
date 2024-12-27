import { Controls } from "@/configs/three-scenes/controls";
import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  euler,
  quat,
  RapierRigidBody,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { useCallback, useMemo, useRef } from "react";
import { PerspectiveCamera as PerspectiveCameraType, Vector3 } from "three";

const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 2;
const JUMP_FORCE = 8;

const Player = () => {
  const rb = useRef<RapierRigidBody>(null);
  const camera = useRef<PerspectiveCameraType>(null);
  const { scene } = useThree();
  const cameraTarget = useRef<Vector3>(new Vector3(0, 0, 0));
  const [, get] = useKeyboardControls();
  const vel = useMemo(() => vec3(), []);
  const inTheAir = useRef(false);
  const punched = useRef(false);
  useFrame(() => {
    vel.x = 0;
    vel.y = 0;
    vel.z = 0;
    const rotVel = {
      x: 0,
      y: 0,
      z: 0,
    };
    if (!rb.current) return;
    cameraTarget.current.lerp(vec3(rb.current.translation()), 0.5);
    if (!camera.current) return;
    camera.current.lookAt(cameraTarget.current);
    const curVel = rb.current.linvel();
    if (get()[Controls.forward]) {
      vel.z -= MOVEMENT_SPEED;
    }
    if (get()[Controls.backward]) {
      vel.z += MOVEMENT_SPEED;
    }
    if (get()[Controls.left]) {
      rotVel.y += ROTATION_SPEED;
    }
    if (get()[Controls.right]) {
      rotVel.y -= ROTATION_SPEED;
    }
    rb.current.setAngvel(rotVel, true);
    const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
    vel.applyEuler(eulerRot);
    if (get()[Controls.jump] && !inTheAir.current) {
      vel.y += JUMP_FORCE;
      inTheAir.current = true;
    } else {
      vel.y = curVel.y;
    }

    if (!punched.current) {
      rb.current.setLinvel(vel, true);
    }
  });

  const respawn = useCallback(() => {
    const rbC = rb.current;
    if (!rbC) return;
    rbC.setTranslation(
      {
        x: 0,
        y: 5,
        z: 0,
      },
      true
    );
    const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
    vel.applyEuler(eulerRot);
  }, [rb, vel]);

  const teleport = useCallback(() => {
    const getOut = scene.getObjectByName("gateLargeWide_teamYellow");
    if (rb.current && getOut) {
      rb.current.setTranslation(getOut.position, true);
    }
  }, [scene]);

  return (
    <RigidBody
      ref={rb}
      onCollisionEnter={({ other }) => {
        const { rigidBodyObject } = other;
        if (rigidBodyObject) {
          const { name } = rigidBodyObject;
          if (name === "ground") {
            inTheAir.current = false;
          }
          if (name === "swiper") {
            punched.current = true;
            setTimeout(() => {
              punched.current = false;
            }, 200);
          }
        }
      }}
      onIntersectionEnter={({ other }) => {
        const { rigidBodyObject } = other;
        if (rigidBodyObject) {
          const { name } = rigidBodyObject;
          if (name === "space") {
            respawn();
          }
          if (name === "gateIn") {
            teleport();
          }
        }
      }}
      mass={1000}
      gravityScale={2.5}
    >
      <mesh position-y={5.5} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <PerspectiveCamera makeDefault position={[0, 15, 8]} ref={camera} />
    </RigidBody>
  );
};

export default Player;
