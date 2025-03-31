import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

const Boxes = () => {
  const count = 100; // кількість кубів
  const radius = 100;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        return (
          <RigidBody
            type="dynamic"
            key={i}
            colliders="cuboid"
            userData={{ isGround: true }}
            position={[i * 3 + 18, 10, -50]}
            mass={100.1}
            friction={0}
            restitution={0} // прибрати стрибки
            linearDamping={20} // сильно зменшити ковзання
            angularDamping={30} // зменшити обертання
            gravityScale={-0.1}
          >
            <mesh>
              <boxGeometry args={[2, 0.1, 2]} />
              <meshStandardMaterial color="#aaffff" />
            </mesh>
          </RigidBody>
        );
      })}
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2; // рівномірно по колу
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = 0; // висота
        return (
          <RigidBody
            type="dynamic"
            key={i}
            colliders="cuboid"
            userData={{ isGround: true }}
            position={[x, i + 1, z]}
            mass={1.1}
            friction={0}
            restitution={0} // прибрати стрибки
            linearDamping={2} // сильно зменшити ковзання
            angularDamping={3} // зменшити обертання
            gravityScale={0}
          >
            <mesh>
              <boxGeometry args={[5, 0.2, 5]} />
              <meshStandardMaterial color="#aaffff" />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
};

export default Boxes;
