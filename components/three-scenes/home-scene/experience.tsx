import Wave from "../shader-mesh/wave";

const Experience = () => {
  return (
    <>
      <Wave />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={3.5} position={[1, 0, 0.25]} />
    </>
  );
};

export default Experience;
