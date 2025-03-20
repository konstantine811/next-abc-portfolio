import { RootState } from "@/lib/store/store";
import { useTrailTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Texture, Vector2 } from "three";

const TrailCapsule = ({
  isDebug = true,
  onTextureUpdate,
}: {
  isDebug?: boolean;
  onTextureUpdate?: (texture: Texture) => void;
}) => {
  const { currentPosition, onGround } = useSelector(
    (state: RootState) => state.gameStateReducer
  );

  const size = 100; // Розмір площини
  const halfSize = size / 2; // Центруємо координати
  const [texture, addPoint] = useTrailTexture({
    size: 1024,
    radius: 0.003, // 🔹 **Менший слід**
    maxAge: 19000, // ⏳ **Довший слід (5 секунд)**
    intensity: 1.7, // 🔥 Більша видимість
    blend: "lighter", // Спробуй "lighter", "multiply", "screen"
    smoothing: 0.9,
    minForce: 2.9,
  });

  useFrame(() => {
    if (currentPosition && onGround) {
      // Перетворення координат у UV для малювання

      const uv = new Vector2(
        (currentPosition.x + halfSize) / size,
        1 - (currentPosition.z + halfSize) / size // Інвертуємо Z
      );
      addPoint({ uv });
      if (onTextureUpdate) {
        onTextureUpdate(texture);
      }
    }
  });
  return (
    <>
      {isDebug && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>
      )}
    </>
  );
};

export default TrailCapsule;
