// RoomScene.tsx
import { useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
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
      <RigidBody
        type="fixed"
        position={[-20, 0, 0]}
        angularDamping={2}
        linearDamping={1}
        userData={{ isGround: true }}
        gravityScale={3}
      >
        <mesh>
          <boxGeometry args={[10, 0.4, 10]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[20, 0, 0]}
        angularDamping={2}
        linearDamping={1}
        userData={{ isGround: true }}
        gravityScale={3}
      >
        <mesh>
          <boxGeometry args={[10, 0.4, 10]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[0, 0, -20]}
        angularDamping={2}
        linearDamping={1}
        userData={{ isGround: true }}
        gravityScale={3}
      >
        <mesh>
          <boxGeometry args={[10, 0.4, 10]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[0, 0, 20]}
        angularDamping={2}
        linearDamping={1}
        userData={{ isGround: true }}
        gravityScale={3}
      >
        <mesh>
          <boxGeometry args={[10, 0.4, 10]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[0, 0, 0]}
        angularDamping={2}
        linearDamping={1}
        colliders={false}
        userData={{ isGround: true }}
        gravityScale={3}
      >
        <CuboidCollider args={[5, 0.2, 5]} />
        <mesh>
          <boxGeometry args={[10, 0.4, 10]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
    </>
  );
};
