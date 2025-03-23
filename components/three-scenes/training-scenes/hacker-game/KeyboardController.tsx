import {
  setBackward,
  setForward,
  setJump,
  setLeftward,
  setRightward,
  setRun,
} from "@/lib/store/features/character-contoller/control-state.slice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
];

const keyToActionMap: Record<string, (value: boolean) => any> = {
  forward: setForward,
  backward: setBackward,
  leftward: setLeftward,
  rightward: setRightward,
  jump: setJump,
  run: setRun,
};

const KeyboardController = () => {
  const dispatch = useDispatch();
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const keyMap: Record<string, string> = {};
    keyboardMap.forEach(({ name, keys }) => {
      keys.forEach((key) => {
        keyMap[key] = name;
      });
    });

    const updateActions = () => {
      const activeActions = new Set<string>();
      pressedKeysRef.current.forEach((code) => {
        const actionName = keyMap[code];
        if (actionName) {
          activeActions.add(actionName);
        }
      });

      // Оновити всі дії
      Object.keys(keyToActionMap).forEach((action) => {
        dispatch(keyToActionMap[action](activeActions.has(action)));
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pressedKeysRef.current.has(e.code)) {
        pressedKeysRef.current.add(e.code);
        updateActions();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (pressedKeysRef.current.has(e.code)) {
        pressedKeysRef.current.delete(e.code);
        updateActions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return null;
};

export default KeyboardController;
