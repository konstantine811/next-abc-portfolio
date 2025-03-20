import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const size = 1280; // Розмір текстури
const fadeSpeed = 0.98; // Як швидко зникає ефект

const useTrailTexture = ({
  grassMaterial,
}: {
  grassMaterial: THREE.ShaderMaterial;
}) => {
  const { currentPosition, onGround } = useSelector(
    (state: RootState) => state.gameStateReducer
  );
  const textureRef = useRef<THREE.Texture | null>(null);

  const { gl } = useThree();
  const data = useRef(new Uint8Array(size * size * 4));
  const texture = useRef(
    new THREE.DataTexture(data.current, size, size, THREE.RGBAFormat)
  );

  useEffect(() => {
    // Ініціалізуємо чорну текстуру
    for (let i = 0; i < data.current.length; i += 4) {
      data.current[i] = 0; // R
      data.current[i + 1] = 0; // G
      data.current[i + 2] = 0; // B
      data.current[i + 3] = 255; // A (Прозорість)
    }
    texture.current.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!onGround) return;

    // ✅ Конвертуємо координати персонажа у UV
    const uvX = Math.floor(((currentPosition.x + 5) / 10) * size);
    const uvY = Math.floor(((currentPosition.z + 5) / 10) * size);

    if (uvX < 0 || uvX >= size || uvY < 0 || uvY >= size) return;

    // ✅ Додаємо слід у текстуру (Red канал)
    const index = (uvY * size + uvX) * 4;
    data.current[index] = 255; // R (Максимальна деформація)

    // ✅ Поступове згасання ефекту (імітація відновлення трави)
    for (let i = 0; i < data.current.length; i += 4) {
      data.current[i] = Math.max(0, data.current[i] * fadeSpeed);
    }

    texture.current.needsUpdate = true;
    if (grassMaterial) {
      grassMaterial.uniforms.footprintTexture.value = texture.current;
    }
  });

  return null;
};

export default useTrailTexture;
