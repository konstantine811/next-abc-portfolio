import { useCallback, useState } from "react";
import SelectableMesh from "./SelectableMesh";
import { BoxGeometry } from "three";

const SelectableMeshWrap = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // ✅ Вибір / розвибір
  const handleSelect = useCallback((id: number, event: PointerEvent) => {
    const isShift = event.shiftKey;

    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);

      if (isShift) {
        // Мультивибір: додаємо або прибираємо
        if (isSelected) return prev.filter((i) => i !== id);
        else return [...prev, id];
      } else {
        // Звичайний вибір: якщо вибрано той самий — скасовуємо
        // if (isSelected && prev.length === 1) return [];
        return [id];
      }
    });
  }, []);
  return (
    <group onPointerMissed={() => setSelectedIds([])}>
      {[0, 1, 2].map((id) => (
        <SelectableMesh
          id={id}
          key={id}
          position={[id * 2, 0, 0]}
          isSelected={selectedIds.includes(id)}
          onSelect={handleSelect}
          model={
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="orange" />
            </mesh>
          }
          outlineGeometry={new BoxGeometry(1, 1, 1)}
        />
      ))}
    </group>
  );
};

export default SelectableMeshWrap;
