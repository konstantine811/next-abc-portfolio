import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";

interface FootprintTextureProps {
  footprintRT: RefObject<THREE.WebGLRenderTarget | null>;
}

const FootprintTexture = ({ footprintRT }: FootprintTextureProps) => {
  // Створюємо текстуру для слідів
  useEffect(() => {
    if (!footprintRT.current) {
      footprintRT.current = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      });
    }
  }, []);

  return null; // Цей компонент не рендерить нічого в сцені
};

export default FootprintTexture;
