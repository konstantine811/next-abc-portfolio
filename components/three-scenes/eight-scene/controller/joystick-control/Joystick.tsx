import { Canvas } from "@react-three/fiber";
import { JoystickComponents } from "./JoystickComponents";
import { useRef } from "react";
import ButtonComponents from "./ButtonComponents";

interface JoysticProps {
  buttonNumber: number;
}

const Joystic = ({ buttonNumber }: JoysticProps) => {
  const ref = useRef<HTMLDivElement>(null!);
  return (
    <div>
      <div
        ref={ref}
        className="select-none touch-none pointer-events-none overscroll-none fixed z-[999999] h-[200px] w-[200px] left-0 bottom-0"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Canvas
          shadows
          orthographic
          camera={{
            zoom: 26,
            position: [0, 0, 50],
          }}
        >
          <JoystickComponents wrapRef={ref} />
        </Canvas>
      </div>
      {buttonNumber !== 0 && (
        <div
          id="ecctrl-button"
          className="select-none touch-none pointer-events-none overscroll-none fixed z-[999999] h-[200px] w-[200px] right-0 bottom-0"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Canvas
            shadows
            orthographic
            camera={{
              zoom: 26,
              position: [0, 0, 50],
            }}
          >
            <ButtonComponents buttonNumber={5} />
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default Joystic;
