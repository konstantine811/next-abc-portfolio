import {
  RefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
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
  joystickRunSensitivity = 0.9,
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

  // Стан анімації
  const joystickState = useRef({
    topRotationX: 0,
    topRotationY: 0,
    basePositionX: 0,
    basePositionY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    targetPositionX: 0,
    targetPositionY: 0,
  });

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

  /**
   * Оновлення стану анімації у кожному кадрі
   */
  useFrame(() => {
    const state = joystickState.current;
    state.topRotationX += (state.targetRotationX - state.topRotationX) * 0.1;
    state.topRotationY += (state.targetRotationY - state.topRotationY) * 0.1;
    state.basePositionX += (state.targetPositionX - state.basePositionX) * 0.1;
    state.basePositionY += (state.targetPositionY - state.basePositionY) * 0.1;
  });

  /**
   * Touch move function
   */
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
        joystickDis.current > joystickMaxDis.current * joystickRunSensitivity;

      // Оновлення цільових значень анімації
      joystickState.current.targetRotationX =
        -joystickMovementVec2.y / joystickHalfHeight.current;
      joystickState.current.targetRotationY =
        joystickMovementVec2.x / joystickHalfWidth.current;
      joystickState.current.targetPositionX = joystickMovementVec2.x * 0.002;
      joystickState.current.targetPositionY = joystickMovementVec2.y * 0.002;

      // Оновлення стану джойстика у Redux
      setJoystick({
        joystickDis: joystickDis.current,
        joystickAng: joystickAng.current,
        runState,
      });
    },
    [joystickRunSensitivity, touch1MovementVec2, joystickMovementVec2]
  );

  /**
   * Touch end function
   */
  const onTouchEnd = useCallback(() => {
    joystickState.current.targetRotationX = 0;
    joystickState.current.targetRotationY = 0;
    joystickState.current.targetPositionX = 0;
    joystickState.current.targetPositionY = 0;

    // Скидання стану джойстика
    resetJoystick();
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const joystickDiv = wrapRef.current;
    const rect = joystickDiv.getBoundingClientRect();

    joystickHalfWidth.current = rect.width / 2;
    joystickHalfHeight.current = rect.height / 2;
    joystickMaxDis.current = joystickHalfWidth.current * 0.65;

    joystickCenterX.current = rect.x + joystickHalfWidth.current;
    joystickCenterY.current = rect.y + joystickHalfHeight.current;

    joystickDiv.addEventListener("touchmove", onTouchMove, { passive: false });
    joystickDiv.addEventListener("touchend", onTouchEnd);

    return () => {
      joystickDiv.removeEventListener("touchmove", onTouchMove);
      joystickDiv.removeEventListener("touchend", onTouchEnd);
    };
  }, [wrapRef, onTouchMove, onTouchEnd]);

  return (
    <Suspense fallback={null}>
      <group
        position={[
          joystickState.current.basePositionX,
          joystickState.current.basePositionY,
          0,
        ]}
      >
        <mesh
          geometry={joystickBaseGeo}
          material={joystickBaseMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
      <group
        rotation={[
          joystickState.current.topRotationX,
          joystickState.current.topRotationY,
          0,
        ]}
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
      </group>
    </Suspense>
  );
};
