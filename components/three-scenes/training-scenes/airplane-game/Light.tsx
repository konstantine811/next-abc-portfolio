const Light = () => {
  return (
    <>
      {/* Hemisphere Light */}
      <hemisphereLight args={[0xaaaaaa, 0x000000, 0.9]} />
      {/* Directional Light with Shadows */}
      <directionalLight
        args={[0xffffff, 0.9]}
        position={[150, 350, 350]}
        castShadow
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
        shadow-camera-near={1}
        shadow-camera-far={1000}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

export default Light;
