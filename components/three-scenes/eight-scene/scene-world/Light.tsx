import { useRef } from "react";

const Lights = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  return (
    <>
      <directionalLight
        castShadow
        shadow-normalBias={0.06}
        position={[20, 30, 10]}
        intensity={5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={50}
        shadow-camera-right={50}
        shadow-camera-bottom={-50}
        shadow-camera-left={-50}
        name="followLight"
        ref={directionalLightRef}
      />
      <ambientLight intensity={2} />
    </>
  );
};

export default Lights;
