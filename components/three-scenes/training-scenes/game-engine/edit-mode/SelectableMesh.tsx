import { JSX } from "react";

const SelectableMesh = ({
  id,
  geometry,
  position,
  isSelected = false,
  onSelect,
  material,
}: {
  id: number;
  geometry: JSX.Element;
  position: [number, number, number];
  material: JSX.Element;
  color?: string;
  isSelected?: boolean;
  onSelect?: (id: number, event: PointerEvent) => void;
}) => {
  return (
    <group
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation(); // щоб не тригерився onPointerMissed
        onSelect?.(id, e.nativeEvent); // важливо! nativeEvent — для shiftKey
      }}
    >
      <mesh>
        {geometry}
        {material}
      </mesh>
      {isSelected && (
        <mesh scale={1.001}>
          {geometry}
          <meshBasicMaterial wireframeLinewidth={10} color="yellow" wireframe />
        </mesh>
      )}
    </group>
  );
};

export default SelectableMesh;
