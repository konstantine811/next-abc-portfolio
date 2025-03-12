import {
  ContactShadows,
  Environment,
  OrbitControls,
  Text3D,
} from "@react-three/drei";
import King from "./partials/King";
import Adventurer from "./partials/Adventurer";
import Spacesuit from "./partials/Spacesuit";
import CasualHoodie from "./partials/CasualHoodie";
import { useEffect, useState } from "react";

const Experience = () => {
  const [kingVisisble, setKingVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setKingVisible(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        minDistance={8}
        maxDistance={20}
      />
      <Environment preset="sunset" />

      <Text3D
        font="/fonts/Roboto/Roboto Condensed Black_Italic.json"
        size={0.8}
        position={[-3.5, 2, -3]}
        bevelEnabled
        bevelThickness={0.2}
      >
        OUR
        <meshStandardMaterial color="white" />
      </Text3D>
      <Text3D
        font="/fonts/Roboto/Roboto Condensed Black_Italic.json"
        size={1.8}
        position={[-3.5, 0, -3]}
        bevelEnabled
        bevelThickness={0.2}
      >
        TEAM
        <meshStandardMaterial color="white" />
      </Text3D>
      {kingVisisble && (
        <King
          groupProps={{ position: [-3, 0, 0], rotation: [0, -Math.PI / 4, 0] }}
        />
      )}
      <Adventurer groupProps={{ position: [-1, 0, 0] }} />
      <Spacesuit groupProps={{ position: [1, 0, 0] }} />
      <CasualHoodie
        groupProps={{ position: [3, 0, 0], rotation: [0, Math.PI / 4, 0] }}
      />
      <ContactShadows opacity={0.42} blur={2} />
    </>
  );
};

export default Experience;
