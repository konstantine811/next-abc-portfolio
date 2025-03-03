import { RefObject, Suspense, useEffect, useMemo } from "react";
import { CylinderGeometry, MeshNormalMaterial } from "three";
import { useSpring, animated } from "@react-spring/three";
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
  /**
   * Button component geometries
   */
  const buttonLargeBaseGeo = useMemo(
    () => new CylinderGeometry(1.1, 1, 0.3, 16),
    []
  );
  const buttonSmallBaseGeo = useMemo(
    () => new CylinderGeometry(0.9, 0.8, 0.3, 16),
    []
  );
  const buttonTop1Geo = useMemo(
    () => new CylinderGeometry(0.9, 0.9, 0.5, 16),
    []
  );
  const buttonTop2Geo = useMemo(
    () => new CylinderGeometry(0.9, 0.9, 0.5, 16),
    []
  );
  const buttonTop3Geo = useMemo(
    () => new CylinderGeometry(0.7, 0.7, 0.5, 16),
    []
  );
  const buttonTop4Geo = useMemo(
    () => new CylinderGeometry(0.7, 0.7, 0.5, 16),
    []
  );
  const buttonTop5Geo = useMemo(
    () => new CylinderGeometry(0.7, 0.7, 0.5, 16),
    []
  );

  /**
   * Button component materials
   */
  const buttonBaseMaterial = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.3 }),
    []
  );
  const buttonTop1Material = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.5 }),
    []
  );
  const buttonTop2Material = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.5 }),
    []
  );
  const buttonTop3Material = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.5 }),
    []
  );
  const buttonTop4Material = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.5 }),
    []
  );
  const buttonTop5Material = useMemo(
    () => new MeshNormalMaterial({ transparent: true, opacity: 0.5 }),
    []
  );

  /**
   * Animation preset
   */
  const [springs, api] = useSpring(() => ({
    buttonTop1BaseScaleY: 1,
    buttonTop1BaseScaleXAndZ: 1,
    buttonTop2BaseScaleY: 1,
    buttonTop2BaseScaleXAndZ: 1,
    buttonTop3BaseScaleY: 1,
    buttonTop3BaseScaleXAndZ: 1,
    buttonTop4BaseScaleY: 1,
    buttonTop4BaseScaleXAndZ: 1,
    buttonTop5BaseScaleY: 1,
    buttonTop5BaseScaleXAndZ: 1,
    config: {
      tension: 600,
    },
  }));

  // Pointer down function
  const onPointerDown = (number: number) => {
    switch (number) {
      case 1:
        dispatch(pressButton1());
        api.start({
          buttonTop1BaseScaleY: 0.5,
          buttonTop1BaseScaleXAndZ: 1.15,
        });
        break;
      case 2:
        dispatch(pressButton2());
        api.start({
          buttonTop2BaseScaleY: 0.5,
          buttonTop2BaseScaleXAndZ: 1.15,
        });
        break;
      case 3:
        dispatch(pressButton3());
        api.start({
          buttonTop3BaseScaleY: 0.5,
          buttonTop3BaseScaleXAndZ: 1.15,
        });
        break;
      case 4:
        dispatch(pressButton4());
        api.start({
          buttonTop4BaseScaleY: 0.5,
          buttonTop4BaseScaleXAndZ: 1.15,
        });
        break;
      case 5:
        dispatch(pressButton5());
        api.start({
          buttonTop5BaseScaleY: 0.5,
          buttonTop5BaseScaleXAndZ: 1.15,
        });
        break;
      default:
        break;
    }
  };

  // Pointer up function
  const onPointerUp = () => {
    dispatch(releaseAllButtons());
    api.start({
      buttonTop1BaseScaleY: 1,
      buttonTop1BaseScaleXAndZ: 1,
      buttonTop2BaseScaleY: 1,
      buttonTop2BaseScaleXAndZ: 1,
      buttonTop3BaseScaleY: 1,
      buttonTop3BaseScaleXAndZ: 1,
      buttonTop4BaseScaleY: 1,
      buttonTop4BaseScaleXAndZ: 1,
      buttonTop5BaseScaleY: 1,
      buttonTop5BaseScaleXAndZ: 1,
    });
  };

  return (
    <Suspense fallback="null">
      {/* Button 1 */}
      {buttonNumber > 0 && (
        <animated.group
          scale-x={springs.buttonTop1BaseScaleXAndZ}
          scale-y={springs.buttonTop1BaseScaleY}
          scale-z={springs.buttonTop1BaseScaleXAndZ}
          rotation={[-Math.PI / 2, 0, 0]}
          position={buttonNumber === 1 ? [0, 0, 0] : [2, 1, 0]}
          onPointerUp={onPointerUp}
        >
          <mesh
            geometry={buttonLargeBaseGeo}
            material={buttonBaseMaterial}
            onPointerDown={() => onPointerDown(1)}
          />
          <mesh
            geometry={buttonTop1Geo}
            material={buttonTop1Material}
            position={[0, -0.3, 0]}
          />
        </animated.group>
      )}
      {/* Button 2 */}
      {buttonNumber > 1 && (
        <animated.group
          scale-x={springs.buttonTop2BaseScaleXAndZ}
          scale-y={springs.buttonTop2BaseScaleY}
          scale-z={springs.buttonTop2BaseScaleXAndZ}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.5, -1.3, 0]}
          onPointerUp={onPointerUp}
        >
          <mesh
            geometry={buttonLargeBaseGeo}
            material={buttonBaseMaterial}
            onPointerDown={() => onPointerDown(2)}
          />
          <mesh
            geometry={buttonTop2Geo}
            material={buttonTop2Material}
            position={[0, -0.3, 0]}
          />
        </animated.group>
      )}
      {/* Button 3 */}{" "}
      {buttonNumber > 2 && (
        <animated.group
          scale-x={springs.buttonTop3BaseScaleXAndZ}
          scale-y={springs.buttonTop3BaseScaleY}
          scale-z={springs.buttonTop3BaseScaleXAndZ}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-1, 1, 0]}
          onPointerUp={onPointerUp}
        >
          <mesh
            geometry={buttonSmallBaseGeo}
            material={buttonBaseMaterial}
            onPointerDown={() => onPointerDown(3)}
          />
          <mesh
            geometry={buttonTop3Geo}
            material={buttonTop3Material}
            position={[0, -0.3, 0]}
          />
        </animated.group>
      )}
      {/* Button 4 */}
      {buttonNumber > 3 && (
        <animated.group
          scale-x={springs.buttonTop4BaseScaleXAndZ}
          scale-y={springs.buttonTop4BaseScaleY}
          scale-z={springs.buttonTop4BaseScaleXAndZ}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-2, -1.3, 0]}
          onPointerUp={onPointerUp}
        >
          <mesh
            geometry={buttonSmallBaseGeo}
            material={buttonBaseMaterial}
            onPointerDown={() => onPointerDown(4)}
          />
          <mesh
            geometry={buttonTop4Geo}
            material={buttonTop4Material}
            position={[0, -0.3, 0]}
          />
        </animated.group>
      )}
      {/* Button 5 */}
      {buttonNumber > 4 && (
        <animated.group
          scale-x={springs.buttonTop5BaseScaleXAndZ}
          scale-y={springs.buttonTop5BaseScaleY}
          scale-z={springs.buttonTop5BaseScaleXAndZ}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.4, 2.9, 0]}
          onPointerUp={onPointerUp}
        >
          <mesh
            geometry={buttonSmallBaseGeo}
            material={buttonBaseMaterial}
            onPointerDown={() => onPointerDown(5)}
          />
          <mesh
            geometry={buttonTop5Geo}
            material={buttonTop5Material}
            position={[0, -0.3, 0]}
          />
        </animated.group>
      )}
    </Suspense>
  );
};

export default ButtonComponents;
