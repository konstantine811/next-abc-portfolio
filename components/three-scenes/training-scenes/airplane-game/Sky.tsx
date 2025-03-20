import { Group } from "three";
import Cloud from "./Cloud";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Sky = ({
  nClouds = 20,
  seaRadius = 800,
}: {
  nClouds?: number;
  seaRadius?: number;
}) => {
  const ref = useRef<Group>(null!);
  // To distribute the clouds consistently,
  // we need to place them according to a uniform angle
  const stepAngle = (Math.PI * 2) / nClouds;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.01;
    }
  });
  return (
    <group position={[0, -seaRadius, 0]} ref={ref}>
      {Array.from({ length: nClouds }).map((_, i) => {
        // set the rotation and the position of each cloud;
        // for that we use a bit of trigonometry
        const a = stepAngle * i; // this is the final angle of the cloud
        const h = seaRadius + 350 + Math.random() * 200; // this is the distance between the center of the axis and the cloud itself
        // Trigonometry!!! I hope you remember what you've learned in Math :)
        // in case you don't:
        // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
        return (
          <Cloud
            key={i}
            props={{
              position: [
                Math.cos(a) * h,
                Math.sin(a) * h,
                -400 - Math.random() * 400,
              ],
              rotation: [0, 0, a + Math.PI / 2],
              scale: [
                1 + Math.random() * 2,
                1 + Math.random() * 2,
                1 + Math.random() * 2,
              ],
            }}
          />
        );
      })}
    </group>
  );
};

export default Sky;
