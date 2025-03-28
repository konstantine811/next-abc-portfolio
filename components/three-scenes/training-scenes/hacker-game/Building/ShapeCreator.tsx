import { TransformControls } from "@react-three/drei";
import { useControls, button } from "leva";
import { useState } from "react";

const shapeOptions = ["box", "sphere", "torus"];

const ShapeCreator = () => {
  const [objects, setObjects] = useState<
    { id: number; type: string; position: [number, number, number] }[]
  >([]);

  const { shape } = useControls({
    shape: {
      value: "box",
      options: shapeOptions,
    },
    add: button(() => {
      setObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: shape,
          position: [Math.random() * 4 - 2, 1, Math.random() * 4 - 2],
        },
      ]);
    }),
  });

  return (
    <>
      {objects.map(({ id, type, position }) => (
        <Shape key={id} type={type} position={position} />
      ))}
    </>
  );
};

const Shape = ({
  type,
  position,
}: {
  type: string;
  position: [number, number, number];
}) => {
  return (
    <TransformControls position={position}>
      <mesh>
        {type === "box" && <boxGeometry args={[1, 1, 1]} />}
        {type === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
        {type === "torus" && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
        <meshStandardMaterial color="red" />
      </mesh>
    </TransformControls>
  );
};

export default ShapeCreator;
