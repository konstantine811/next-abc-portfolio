import { Environment, OrbitControls, Text3D, useGLTF } from "@react-three/drei";
import { foodItems } from "./SceneInit";
import Panda from "./partials/Panda";

const FoodItem = ({ model, page }: { model: string; page: number }) => {
  const gltf = useGLTF(model);

  return (
    <group>
      <primitive object={gltf.scene} position={[0, -page, 0]} />
    </group>
  );
};

const Experience = () => {
  return (
    <>
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        enableZoom={false}
      />
      <Environment preset="sunset" />
      <group position-y={-1}>
        <Text3D
          font="/fonts/Inter/Inter_Bold.json"
          size={0.8}
          position={[-3.5, 2, -3]}
          bevelEnabled
          bevelThickness={0.2}
        >
          PANDA
          <meshStandardMaterial color="#333344" />
        </Text3D>
        <Text3D
          font="/fonts/Inter/Inter_Bold.json"
          size={1.8}
          position={[-3.5, 0, -3]}
          bevelEnabled
          bevelThickness={0.2}
        >
          SUSHI
          <meshStandardMaterial color="white" />
        </Text3D>
        <Panda
          props={{ position: [2.5, 0, -5], rotation: [0, -Math.PI / 6, 0] }}
        />
      </group>
      {foodItems.map((foodItem, idx) => (
        <FoodItem key={idx} {...foodItem} />
      ))}
    </>
  );
};

export default Experience;
