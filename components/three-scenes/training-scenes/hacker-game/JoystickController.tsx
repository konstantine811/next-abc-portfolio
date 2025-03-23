// JoystickControlsProvider.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const initialInput = {
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  jump: false,
  run: false,
};

export default function JoystickControlsProvider({}: {}) {
  const [input, setInput] = useState(initialInput);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const jumpPressed = useRef(false);
  const runPressed = useRef(false);
  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") jumpPressed.current = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight")
        runPressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") jumpPressed.current = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight")
        runPressed.current = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleJoystickMove = (angle: number | null, distance: number) => {
    if (angle === null || distance < 10) {
      setInput((prev) => ({
        ...prev,
        forward: false,
        backward: false,
        leftward: false,
        rightward: false,
      }));
      setStickPos({ x: 0, y: 0 });
      return;
    }
    const deg = (angle * 180) / Math.PI;

    const forward = deg >= 315 || deg <= 45;
    const rightward = deg > 45 && deg < 135;
    const backward = deg >= 135 && deg <= 225;
    const leftward = deg > 225 && deg < 315;

    setInput({
      forward,
      backward,
      leftward,
      rightward,
      jump: jumpPressed.current,
      run: runPressed.current,
    });

    // Відображення положення стіку
    const maxDist = 40;
    const x = Math.cos(angle) * Math.min(distance, maxDist);
    const y = -Math.sin(angle) * Math.min(distance, maxDist);
    setStickPos({ x, y });
  };

  return (
    <div
      ref={baseRef}
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.05)",
        touchAction: "none",
      }}
      className="z-[10000]"
      onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => {
        if (e.touches.length > 0 && baseRef.current) {
          const rect = baseRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const touch = e.touches[0];
          const dx = touch.clientX - centerX;
          const dy = centerY - touch.clientY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
          handleJoystickMove(angle, distance);
        }
      }}
      onTouchEnd={() => {
        setInput((prev) => ({
          ...prev,
          forward: false,
          backward: false,
          leftward: false,
          rightward: false,
        }));
        setStickPos({ x: 0, y: 0 });
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.3)",
          transform: `translate(${40 + stickPos.x}px, ${40 + stickPos.y}px)`,
          transition:
            stickPos.x === 0 && stickPos.y === 0 ? "transform 0.2s" : "none",
        }}
      />
    </div>
  );
}
