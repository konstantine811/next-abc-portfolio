import { CylinderCollider, RigidBody } from "@react-three/rapier";
import Floor from "./Floor";
import WallMonkey from "./Wall_Monkey";

const World = () => {
  return (
    <>
      {/* <Floor /> */}
      <WallMonkey />
      {/* <RigidBody userData={{ isGround: true }} type="fixed">
        <mesh>
          <cylinderGeometry args={[1, 1, 10]} />
          <meshStandardMaterial color="0x151515" />
        </mesh>
      </RigidBody> */}
    </>
  );
};

export default World;
