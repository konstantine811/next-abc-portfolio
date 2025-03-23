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
            mass={100}
            restitution={0} // прибрати стрибки
            linearDamping={2} // сильно зменшити ковзання
            angularDamping={1} // зменшити обертання
            gravityScale={2} // сильніше "тисне" на землю
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
