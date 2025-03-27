import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface Props {
  onLoad: (object: THREE.Object3D) => void;
}

const AddInputModel = ({ onLoad }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoad = () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;

      const loader = new GLTFLoader();
      loader.parse(arrayBuffer, "", (gltf) => {
        const model = gltf.scene;
        onLoad(model); // передаємо у сцену
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="absolute z-[10000] left-10 top-10">
      <input
        type="file"
        ref={inputRef}
        accept=".glb,.gltf"
        onChange={handleLoad}
      />
    </div>
  );
};

export default AddInputModel;
