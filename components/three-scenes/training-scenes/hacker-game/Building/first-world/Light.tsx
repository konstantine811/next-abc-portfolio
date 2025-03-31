import { useRef } from "react";
import { DirectionalLight } from "three";
import { SceneObjectName } from "../../config/scene.config";

const Light = () => {
  const dirLight = useRef<DirectionalLight>(null!);
  //   useHelper(dirLight, DirectionalLightHelper, 1, "red");
  const lightMapSize = 2048;
  return (
    <directionalLight
      ref={dirLight}
      position={[0, 0, 0]}
      intensity={1}
      name={SceneObjectName.characterLight}
      castShadow
      shadow-mapSize-width={lightMapSize}
      shadow-mapSize-height={lightMapSize}
    />
  );
};

export default Light;
