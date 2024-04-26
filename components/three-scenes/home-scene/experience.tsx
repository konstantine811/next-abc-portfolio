import { motion } from "framer-motion-3d";
import ParticleAnimImage from "../particle-anim-image/particle-anim-image";
import Wave from "../shader-mesh/wave";

const Experience = () => {
  return (
    <>
      <motion.group>
        <Wave />
        {/* <ParticleAnimImage /> */}
      </motion.group>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={3.5} position={[1, 0, 0.25]} />
    </>
  );
};

export default Experience;
