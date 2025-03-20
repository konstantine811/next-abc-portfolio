import {
  WebGLRenderTarget,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";
import { RefObject } from "react";
import { useThree } from "@react-three/fiber";

interface FootprintTextureProps {
  characterPos: { x: number; y: number; z: number };
  footprintRT: RefObject<WebGLRenderTarget | null>;
  gl: WebGLRenderer;
}

const updateFootprintTexture = ({
  characterPos,
  footprintRT,
  gl,
}: FootprintTextureProps) => {
  if (!footprintRT || !footprintRT.current) return;

  const footprintScene = new Scene();
  // Точка деформації (слід персонажа)
  const plane = new Mesh(
    new PlaneGeometry(0.5, 0.5),
    new MeshBasicMaterial({ color: 0xffffff })
  );
  plane.position.set(characterPos.x, 0, characterPos.z); // Y = 0, оскільки текстура плоска
  footprintScene.add(plane);

  const footprintCamera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 10);
  footprintCamera.position.set(0, 10, 0);
  footprintCamera.lookAt(0, 0, 0);

  // Оновлюємо текстуру маски
  gl.setRenderTarget(footprintRT.current);
  gl.render(footprintScene, footprintCamera);
  gl.setRenderTarget(null);
};

export default updateFootprintTexture;
