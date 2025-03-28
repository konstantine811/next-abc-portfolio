import { setCameraState } from "@/lib/store/features/game-engine/game-engine-state.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
// 2️⃣ Це клас з ACTION
import CameraControlsImpl from "camera-controls";
import { isMacTouchpad } from "@/utils/device";

console.log("isMacTouchpad", isMacTouchpad());
const CameraSaver = () => {
  const { camera } = useThree();
  const cameraControlRef = useRef<CameraControls | null>(null!);
  const [initialized, setInitialized] = useState(false);
  const { cameraState } = useAppSelector(
    (state: RootState) => state.gameEngineState.gameEngineData
  );
  const cameraPosition = useMemo(() => new Vector3(), []);
  const cameraTarget = useMemo(() => new Vector3(), []);
  const dispatch = useAppDispatch();
  // ✅ Встановити положення камери лише при першій ініціалізації
  useEffect(() => {
    if (!initialized && cameraControlRef.current) {
      if (isMacTouchpad()) {
        cameraControlRef.current.mouseButtons.left =
          CameraControlsImpl.ACTION.NONE;
        cameraControlRef.current.mouseButtons.middle =
          CameraControlsImpl.ACTION.DOLLY;
        cameraControlRef.current.mouseButtons.right =
          CameraControlsImpl.ACTION.NONE;
        cameraControlRef.current.mouseButtons.wheel =
          CameraControlsImpl.ACTION.ROTATE;
      } else {
        cameraControlRef.current.mouseButtons.left =
          CameraControlsImpl.ACTION.ROTATE;
        cameraControlRef.current.mouseButtons.middle =
          CameraControlsImpl.ACTION.DOLLY;
        cameraControlRef.current.mouseButtons.right =
          CameraControlsImpl.ACTION.TRUCK;
        cameraControlRef.current.mouseButtons.wheel =
          CameraControlsImpl.ACTION.DOLLY;
      }
      cameraControlRef.current.setPosition(...cameraState.position);
      cameraControlRef.current.setTarget(...cameraState.target);

      setInitialized(true);
    }
  }, [cameraState.position, cameraState.target, initialized]);

  useEffect(() => {
    const controls = cameraControlRef.current;
    if (!controls) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta") {
        controls.mouseButtons.wheel = CameraControlsImpl.ACTION.DOLLY;
      }
      if (e.key === "Shift") {
        controls.mouseButtons.wheel = CameraControlsImpl.ACTION.TRUCK;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Shift") {
        controls.mouseButtons.wheel = CameraControlsImpl.ACTION.ROTATE;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handle = useCallback(() => {
    if (cameraControlRef.current) {
      const position = cameraControlRef.current
        .getPosition(cameraPosition)
        .toArray();
      const target = cameraControlRef.current.getTarget(cameraTarget).toArray();

      // 🔍 Отримуємо поточний cameraState
      const current = cameraState;

      // 🛡 Перевірка: чи дійсно змінилось положення
      const positionChanged = !position.every(
        (v, i) => v === current.position[i]
      );
      const targetChanged = !target.every((v, i) => v === current.target[i]);
      if (positionChanged || targetChanged) {
        dispatch(setCameraState({ position, target }));
      }
    }
  }, [cameraState, dispatch]);

  return (
    <CameraControls
      ref={cameraControlRef}
      makeDefault
      onChange={handle}
      azimuthRotateSpeed={3}
      polarRotateSpeed={3}
      truckSpeed={5}
    />
  );
};

export default CameraSaver;
