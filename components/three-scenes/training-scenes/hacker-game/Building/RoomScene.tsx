// RoomScene.tsx
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { BackSide, Plane, Vector3 } from "three";

export const RoomScene = () => {
  const { camera, gl } = useThree();

  // Площина для відсікання — наприклад, перед камерою
  const clippingPlane = useMemo(() => {
    const normal = new Vector3(0, 0, -1); // напрямок у камеру
    const constant = -1; // наскільки близько до камери
    return new Plane(normal, constant);
  }, []);

  // Встановити глобальне відсікання
  gl.localClippingEnabled = true;

  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[0, 0, -5]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[100, 100, 1]} />
          <meshStandardMaterial
            color="lightblue"
            side={BackSide}
            // clippingPlanes={[clippingPlane]}
            clipShadows
          />
        </mesh>
      </RigidBody>
    </>
  );
};
