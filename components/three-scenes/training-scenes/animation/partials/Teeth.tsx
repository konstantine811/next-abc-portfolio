import { MotionConfig } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useEffect, useState } from "react";

const Teeth = () => {
  const [variant, setVariant] = useState("closed");

  useEffect(() => {
    const interval = setInterval(() => {
      setVariant((prev) => (prev === "closed" ? "opened" : "closed"));
    }, 1500);

    return () => clearInterval(interval);
  }, []);
  return (
    <MotionConfig
      transition={{
        type: "spring",
        mass: 5,
        stiffness: 500,
        damping: 42,
      }}
    >
      <motion.group animate={variant}>
        <motion.mesh
          variants={{
            closed: {
              y: -1,
              rotateY: 0,
            },
            opened: {
              y: 0,
              rotateY: Math.PI / 2,
              scale: 1.1,
            },
          }}
          position-x={-1}
          position-y={-1}
        >
          <coneGeometry args={[0.5, 1, 4]} />
          <motion.meshStandardMaterial
            variants={{
              opened: {
                color: "#7564a4",
              },
              closed: {
                color: "#ffffff",
              },
            }}
            color="#ffffff"
          />
        </motion.mesh>
        <motion.mesh
          variants={{
            closed: {
              y: 1,
              rotateY: 0,
            },
            opened: {
              scale: 1.2,
              y: 0,
              rotateY: Math.PI / 2,
            },
          }}
          position-x={0}
          position-y={1}
          rotation-x={Math.PI}
        >
          <coneGeometry args={[0.5, 1, 4]} />
          <motion.meshStandardMaterial
            variants={{
              closed: {
                color: "#ffffff",
              },
              opened: {
                color: "#7c5ecf",
              },
            }}
            color="#ffffff"
          />
        </motion.mesh>
        <motion.mesh
          variants={{
            closed: {
              y: -1,
              rotateY: 0,
            },
            opened: {
              scale: 1.1,
              y: 0,
              rotateY: Math.PI / 2,
            },
          }}
          position-x={1}
          position-y={-1}
        >
          <coneGeometry args={[0.5, 1, 4]} />
          <motion.meshStandardMaterial
            variants={{
              closed: {
                color: "#ffffff",
              },
              opened: {
                color: "#7c5ecf",
              },
            }}
            color="#ffffff"
          />
        </motion.mesh>
      </motion.group>
    </MotionConfig>
  );
};

export default Teeth;
