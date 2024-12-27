"use client";

import { useEffect, useState } from "react";
import Joystick from "./mainControll/joystick";

const JoystickControl = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
  }, []);

  return <>{isTouchScreen && <Joystick />}</>;
};

export default JoystickControl;
