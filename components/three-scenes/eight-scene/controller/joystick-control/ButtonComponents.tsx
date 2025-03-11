import { Suspense, useRef } from "react";
import { CylinderGeometry, Group, MeshNormalMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { useDispatch } from "react-redux";
import {
  pressButton1,
  pressButton2,
  pressButton3,
  pressButton4,
  pressButton5,
  releaseAllButtons,
} from "@/lib/store/features/character-contoller/joystick-controlls-state";

interface ButtonComponentsProps {
  buttonNumber?: number;
}

const ButtonComponents = ({ buttonNumber = 1 }: ButtonComponentsProps) => {
  const dispatch = useDispatch();

  // Масив рефів для кнопок
  const buttonRefs = useRef<Record<number, Group>>({});

  // Масив станів натискання кнопок
  const buttonState = useRef<{
    [key: number]: { scaleY: number; targetScaleY: number };
  }>({
    1: { scaleY: 1, targetScaleY: 1 },
    2: { scaleY: 1, targetScaleY: 1 },
    3: { scaleY: 1, targetScaleY: 1 },
    4: { scaleY: 1, targetScaleY: 1 },
    5: { scaleY: 1, targetScaleY: 1 },
  });

  useFrame(() => {
    Object.keys(buttonRefs.current).forEach((key) => {
      const num = Number(key);
      const btn = buttonRefs.current[num];
      if (btn) {
        const state = buttonState.current[num];
        state.scaleY += (state.targetScaleY - state.scaleY) * 0.1; // Згладжена анімація
        btn.scale.y = state.scaleY;
      }
    });
  });

  // Функція натискання кнопки
  const onPointerDown = (number: number) => {
    dispatch(getPressAction(number));
    buttonState.current[number].targetScaleY = 0.5; // Зменшуємо висоту
  };

  // Функція відпускання кнопки
  const onPointerUp = () => {
    dispatch(releaseAllButtons());
    Object.keys(buttonState.current).forEach((key) => {
      buttonState.current[Number(key)].targetScaleY = 1; // Повертаємо висоту
    });
  };

  return (
    <Suspense fallback={null}>
      {[1, 2, 3, 4, 5].map((num) => {
        if (num > buttonNumber) return null;
        return (
          <group
            key={num}
            ref={(el) => {
              if (el) buttonRefs.current[num] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={getButtonPosition(num)}
            onPointerUp={onPointerUp}
          >
            <mesh
              geometry={
                new CylinderGeometry(
                  num > 2 ? 0.7 : 0.9,
                  num > 2 ? 0.7 : 0.9,
                  0.5,
                  16
                )
              }
              material={
                new MeshNormalMaterial({ transparent: true, opacity: 0.5 })
              }
              onPointerDown={() => onPointerDown(num)}
            />
          </group>
        );
      })}
    </Suspense>
  );
};

// Функція отримання Redux action
const getPressAction = (number: number) => {
  switch (number) {
    case 1:
      return pressButton1();
    case 2:
      return pressButton2();
    case 3:
      return pressButton3();
    case 4:
      return pressButton4();
    case 5:
      return pressButton5();
    default:
      return releaseAllButtons();
  }
};

// Функція позиціонування кнопок
const positions: Record<number, [number, number, number]> = {
  1: [0, 0, 0],
  2: [0.5, -1.3, 0],
  3: [-1, 1, 0],
  4: [-2, -1.3, 0],
  5: [0.4, 2.9, 0],
};

const getButtonPosition = (num: number): [number, number, number] => {
  return positions[num] || [0, 0, 0];
};

export default ButtonComponents;
