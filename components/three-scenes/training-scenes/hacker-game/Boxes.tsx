import { RigidBody } from "@react-three/rapier";

const Boxes = () => {
  return (
    <>
      {Array.from({ length: 100 }, (_, i) => {
        return (
          <RigidBody
            type="dynamic"
            key={i}
            colliders="cuboid"
            userData={{ isGround: true }}
            position={[(i - 50) * Math.random(), 1, (i - 50) * Math.random()]}
            mass={100.1}
            friction={10}
            restitution={0} // прибрати стрибки
            linearDamping={20} // сильно зменшити ковзання
            angularDamping={3} // зменшити обертання
            gravityScale={3}
          >
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
};

export default Boxes;
