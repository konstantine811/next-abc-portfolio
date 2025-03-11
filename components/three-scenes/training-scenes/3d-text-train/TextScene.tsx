import {
  Billboard,
  ContactShadows,
  Text,
  Text3D,
  useGLTF,
} from "@react-three/drei";
import { MathUtils } from "three";
import Character from "./Character";

const TextScene = () => {
  const woodenSign = useGLTF("/3d-models/text-scene/Wooden Sign.glb");
  return (
    <>
      <Text3D
        font="/fonts/Roboto/Roboto Condensed Black_Italic.json"
        rotation-y={MathUtils.degToRad(30)}
        size={4}
        position={[-8, 0, -4]}
        bevelEnabled
        bevelThickness={0.5}
        bevelSize={0.1}
        bevelSegments={10}
      >
        Zelda
        <meshStandardMaterial color="#a1bb6f" />
      </Text3D>
      <group position-x={-1.5} rotation-y={MathUtils.degToRad(15)}>
        <primitive object={woodenSign.scene} />
        <Text
          fontSize={0.3}
          position={[0, 1.2, 0.01]}
          maxWidth={1}
          textAlign="center"
          font="/fonts/MedievalSharp/MedievalSharp-Regular.ttf"
        >
          Hyrule Castle
          <meshStandardMaterial color="#803d1c" />
        </Text>
      </group>
      <group position={[1.5, 0, 0]} rotation-y={-Math.PI / 4}>
        <Billboard position-y={3}>
          <Text fontSize={0.2} position-y={0.2} anchorY={"bottom"} maxWidth={1}>
            Link
            <meshStandardMaterial color="black" />
          </Text>
          <Text fontSize={0.2}>
            Zelda personal hero
            <meshStandardMaterial color="grey" />
          </Text>
        </Billboard>
        <Character />
      </group>
      <ContactShadows opacity={0.42} scale={42} far={42} />
    </>
  );
};

export default TextScene;
