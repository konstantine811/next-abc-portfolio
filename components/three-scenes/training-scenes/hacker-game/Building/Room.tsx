import { setIsCameraFlow } from "@/lib/store/features/character-contoller/control-state.slice";
import { TransformControls, useCamera, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Mesh } from "three";

const Room = () => {
  const { scene } = useGLTF("/3d-models/hacker-game/BuilingKit/wall-half.glb");
  const state = useThree();
  const cameraControl = state.controls as CameraControls;
  const meshRef = useRef<Mesh>(null!);
  const dispatch = useDispatch();
  return (
    <TransformControls
      object={meshRef.current}
      onObjectChange={() => {
        if (meshRef.current) {
          const { position, rotation, scale } = meshRef.current;
        }
      }}
      onMouseDown={() => {
        dispatch(setIsCameraFlow(false));
        if (cameraControl) {
          cameraControl.enabled = false;
        }
      }}
      onMouseUp={() => {
        dispatch(setIsCameraFlow(true));
        if (cameraControl) {
          cameraControl.enabled = true;
        }
      }}
    >
      <primitive position={[-0.4, 4.4, 17.17]} ref={meshRef} object={scene} />
    </TransformControls>
  );
};

export default Room;
