import {
  setAll,
  setJump,
  setRun,
} from "@/lib/store/features/character-contoller/control-state.slice";
import { useState, useRef, TouchEvent } from "react";
import { useDispatch } from "react-redux";

const getDirectionFromAngle = (degree: number) => {
  const normalized = (degree + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) return "right";
  if (normalized >= 22.5 && normalized < 67.5) return "down-right";
  if (normalized >= 67.5 && normalized < 112.5) return "down";
  if (normalized >= 112.5 && normalized < 157.5) return "down-left";
  if (normalized >= 157.5 && normalized < 202.5) return "left";
  if (normalized >= 202.5 && normalized < 247.5) return "up-left";
  if (normalized >= 247.5 && normalized < 292.5) return "up";
  if (normalized >= 292.5 && normalized < 337.5) return "up-right";

  return "right";
};

const JoystickController = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const joystickAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const rect = joystickAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setPosition({ x: 0, y: 0 });
      setActive(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angleRad = Math.atan2(dy, dx);
    const deg = (angleRad * 180) / Math.PI;

    if (distance < 8) {
      dispatch(
        setAll({
          forward: false,
          backward: false,
          leftward: false,
          rightward: false,
        })
      );
      setPosition({ x: 0, y: 0 });
      return;
    }

    const maxDistance = 40;
    const limitedX = Math.cos(angleRad) * Math.min(distance, maxDistance);
    const limitedY = Math.sin(angleRad) * Math.min(distance, maxDistance);

    setPosition({ x: limitedX, y: limitedY });

    const dir = getDirectionFromAngle(deg);

    dispatch(
      setAll({
        forward: dir.includes("up"),
        backward: dir.includes("down"),
        leftward: dir.includes("left"),
        rightward: dir.includes("right"),
      })
    );
  };

  const handleTouchEnd = () => {
    setPosition({ x: 0, y: 0 });
    setActive(false);
    dispatch(
      setAll({
        forward: false,
        backward: false,
        leftward: false,
        rightward: false,
      })
    );
  };

  return (
    <>
      {/* Joystick (left) */}
      <div
        className="fixed bottom-6 left-6 w-[100px] h-[100px] z-[10000] touch-none"
        ref={joystickAreaRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full rounded-full border border-black/30 bg-white/10">
          <div
            className="absolute w-[50px] h-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            }}
          />
        </div>
      </div>

      {/* Action Buttons (right) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[10000] touch-none">
        {/* Jump Button */}
        <button
          className="w-[60px] h-[60px] rounded-full bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
          onTouchStart={() => dispatch(setJump(true))}
          onTouchEnd={() => dispatch(setJump(false))}
        >
          Jump
        </button>

        {/* Run Button */}
        <button
          className="w-[60px] h-[60px] rounded-full bg-green-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
          onTouchStart={() => dispatch(setRun(true))}
          onTouchEnd={() => dispatch(setRun(false))}
        >
          Run
        </button>
      </div>
    </>
  );
};

export default JoystickController;
