import { useEffect, useState } from "react";
import Joystick from "./joystick-control/Joystick";

const CharacterJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
  }, []);
  return <>{isTouchScreen && <Joystick buttonNumber={5} />}</>;
};

export default CharacterJoystickControls;
