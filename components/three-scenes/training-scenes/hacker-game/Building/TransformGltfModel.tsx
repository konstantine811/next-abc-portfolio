import { CameraControls, TransformControls } from "@react-three/drei";
import { Object3D } from "three";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";

const TransformGltfControl = ({ models }: { models: Object3D[] }) => {
  const cameraControl = useThree().controls as CameraControls;
  const { mode } = useControls("Transform", {
    mode: {
      options: ["translate", "rotate", "scale"],
      value: "translate",
    },
  });

  return (
    <>
      {models.map((model, i) => (
        <TransformControls
          key={i}
          mode={mode as any}
          object={model}
          onMouseDown={() => {
            console.log("disable");
            cameraControl.enabled = false;
          }}
          onMouseUp={() => {
            console.log("enable");
            cameraControl.enabled = true;
          }}
        >
          <primitive position={model.position} object={model} />
        </TransformControls>
      ))}
    </>
  );
};

export default TransformGltfControl;
