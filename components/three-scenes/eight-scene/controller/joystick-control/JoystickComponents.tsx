import {
  RefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useSpring, animated } from "@react-spring/three";
import {
  CylinderGeometry,
  MeshNormalMaterial,
  SphereGeometry,
  Vector2,
} from "three";
import {
  resetJoystick,
  setJoystick,
} from "@/lib/store/features/character-contoller/joystick-controlls-state";

interface JoystickProps {
  joystickRunSensitivity?: number;
  wrapRef: RefObject<HTMLDivElement>;
}

export const JoystickComponents = ({
  joystickRunSensitivity,
  wrapRef,
}: JoystickProps) => {
  /**
   * Preset values/components
   */
  const joystickCenterX = useRef(0);
  const joystickCenterY = useRef(0);
  const joystickHalfWidth = useRef(0);
  const joystickHalfHeight = useRef(0);
  const joystickMaxDis = useRef(0);
  const joystickDis = useRef(0);
  const joystickAng = useRef(0);
  const touch1MovementVec2 = useMemo(() => new Vector2(), []);
  const joystickMovementVec2 = useMemo(() => new Vector2(), []);

  /**
   * Animation preset
   */
  const [springs, api] = useSpring(() => ({
    topRotationX: 0,
    topRotationY: 0,
    basePositionX: 0,
    basePositionY: 0,
    config: {
      tension: 600,
    },
  }));

  /**
   * Joystick component geometries
   */
  const joystickBaseGeo = useMemo(
    () => new CylinderGeometry(2.3, 2.1, 0.3, 16),
    []
  );
  const joystickStickGeo = useMemo(
    () => new CylinderGeometry(0.3, 0.3, 3, 6),
    []
  );
  const joystickHandleGeo = useMemo(() => new SphereGeometry(1.4, 8, 8), []);

  /**
   * Joystick component materials
   */
  const joystickBaseMaterial = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.3 }),
    []
  );
  const joystickStickMaterial = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.3 }),
    []
  );
  const joystickHandleMaterial = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.7 }),
    []
  );
  // Touch move function
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const touch1 = e.targetTouches[0];

      const touch1MovementX = touch1.pageX - joystickCenterX.current;
      const touch1MovementY = -(touch1.pageY - joystickCenterY.current);
      touch1MovementVec2.set(touch1MovementX, touch1MovementY);

      joystickDis.current = Math.min(
        Math.sqrt(Math.pow(touch1MovementX, 2) + Math.pow(touch1MovementY, 2)),
        joystickMaxDis.current
      );
      joystickAng.current = touch1MovementVec2.angle();
      joystickMovementVec2.set(
        joystickDis.current * Math.cos(joystickAng.current),
        joystickDis.current * Math.sin(joystickAng.current)
      );
      const runState =
        joystickDis.current >
        joystickMaxDis.current * (joystickRunSensitivity ?? 0.9);

      // Apply animations
      api.start({
        topRotationX: -joystickMovementVec2.y / joystickHalfHeight.current,
        topRotationY: joystickMovementVec2.x / joystickHalfWidth.current,
        basePositionX: joystickMovementVec2.x * 0.002,
        basePositionY: joystickMovementVec2.y * 0.002,
      });

      // Pass valus to joystick store
      setJoystick({
        joystickDis: joystickDis.current,
        joystickAng: joystickAng.current,
        runState,
      });
    },
    [api, joystickMovementVec2, joystickRunSensitivity, touch1MovementVec2]
  );
  // Touch end function
  const onTouchEnd = (e: TouchEvent) => {
    // Reset animations
    api.start({
      topRotationX: 0,
      topRotationY: 0,
      basePositionX: 0,
      basePositionY: 0,
    });

    // Reset joystick store values
    resetJoystick();
  };

  useEffect(() => {
    if (!wrapRef.current) return;
    const joystickDiv = wrapRef.current;
    const joystickPositionX = joystickDiv.getBoundingClientRect().x;
    const joystickPositionY = joystickDiv.getBoundingClientRect().y;
    joystickHalfWidth.current = joystickDiv.getBoundingClientRect().width / 2;
    joystickHalfHeight.current = joystickDiv.getBoundingClientRect().height / 2;

    joystickMaxDis.current = joystickHalfWidth.current * 0.65;

    joystickCenterX.current = joystickPositionX + joystickHalfWidth.current;
    joystickCenterY.current = joystickPositionY + joystickHalfHeight.current;

    joystickDiv.addEventListener("touchmove", onTouchMove, { passive: false });
    joystickDiv.addEventListener("touchend", onTouchEnd);

    return () => {
      joystickDiv.removeEventListener("touchmove", onTouchMove);
      joystickDiv.removeEventListener("touchend", onTouchEnd);
    };
  });
  return (
    <Suspense fallback="null">
      <animated.group
        position-x={springs.basePositionX}
        position-y={springs.basePositionY}
      >
        <mesh
          geometry={joystickBaseGeo}
          material={joystickBaseMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </animated.group>
      <animated.group
        rotation-x={springs.topRotationX}
        rotation-y={springs.topRotationY}
      >
        <mesh
          geometry={joystickStickGeo}
          material={joystickStickMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 1.5]}
        />
        <mesh
          geometry={joystickHandleGeo}
          material={joystickHandleMaterial}
          position={[0, 0, 4]}
        />
      </animated.group>
    </Suspense>
  );
};
