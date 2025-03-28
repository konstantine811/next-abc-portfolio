import { JSX, useRef } from "react";
import { BufferGeometry, Group } from "three";

type SelectableMeshProps = {
  id: number;
  position: [number, number, number];
  model: JSX.Element;
  outlineGeometry?: BufferGeometry;
  isSelected?: boolean;
  onSelect?: (id: number, event: PointerEvent) => void;
};

const SelectableMesh = ({
  id,
  position,
  model,
  outlineGeometry,
  isSelected = false,
  onSelect,
}: SelectableMeshProps) => {
  const groupRef = useRef<Group>(null!);
  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect?.(id, e.nativeEvent);
      }}
    >
      {/* 🔷 GLTF / mesh / primitive — будь-що */}
      {model}

      {/* 🔶 Outline */}
      {isSelected && outlineGeometry && (
        <>
          <mesh geometry={outlineGeometry} scale={1.01}>
            <meshBasicMaterial wireframe color="yellow" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default SelectableMesh;
