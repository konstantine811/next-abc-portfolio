import { TransformControls } from "@react-three/drei";
import { Object3D } from "three";
import { useCameraControls } from "../CameraControls";
import { useControls } from "leva";

const TransformGltfControl = ({ models }: { models: Object3D[] }) => {
  const cameraControl = useCameraControls();
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
