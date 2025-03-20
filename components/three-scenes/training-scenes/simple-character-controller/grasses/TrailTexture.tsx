import { RootState } from "@/lib/store/store";
import { useFrame } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderTarget,
} from "three";

const TrailTexture = ({
  trailRT,
  fadeTime = 3, // Час, за який слід повністю зникне (секунди)
  fadeSpeed = 1, // Швидкість затирання (чим менше значення - тим повільніше)
  jumpThreshold = 0.01, // Висота, на якій вважаємо, що персонаж стрибає
}: {
  trailRT: RefObject<WebGLRenderTarget | null>;
  fadeTime?: number;
  fadeSpeed?: number;
  jumpThreshold?: number;
}) => {
  const { currentPosition, onGround } = useSelector(
    (state: RootState) => state.gameStateReducer
  );

  const trailScene = useRef(new Scene());
  const trailCamera = useRef(new OrthographicCamera(-5, 5, 5, -5, 0.1, 1000));

  const trailGeometry = useRef(new CircleGeometry(0.3, 10));

  // ✅ Масив слідів з таймерами та прозорістю
  const trails = useRef<
    { mesh: Mesh; createdAt: number; material: MeshBasicMaterial }[]
  >([]);

  useEffect(() => {
    if (!trailRT.current) return; // ✅ Запобігаємо `null` при першому рендері

    // Коригуємо камеру
    trailCamera.current.position.set(0, 10, 0);
    trailCamera.current.lookAt(0, 0, 0);
  }, []);

  useFrame(({ gl, clock }) => {
    if (!currentPosition || !trailRT.current) return;

    const currentTime = clock.getElapsedTime();

    // ✅ Видаляємо старі сліди через fadeTime
    trails.current.forEach(({ mesh, createdAt, material }) => {
      const age = currentTime - createdAt;
      const fadeFactor = fadeSpeed - age / fadeTime; // Від 1 → 0

      if (fadeFactor <= 0) {
        trailScene.current.remove(mesh); // Видаляємо, якщо повністю зникло
      } else {
        material.opacity = Math.max(0, fadeFactor); // Плавне згасання
      }
    });

    if (!onGround) return; // ✅ Не малюємо сліди, якщо персонаж стрибає
    // ✅ Додаємо новий слід
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
    });

    const trailMesh = new Mesh(trailGeometry.current, material);
    trailMesh.position.set(currentPosition.x, 0, currentPosition.z);
    trailMesh.rotation.x = -Math.PI / 2;

    trailScene.current.add(trailMesh);
    trails.current.push({ mesh: trailMesh, createdAt: currentTime, material });

    // ✅ **Гарантуємо, що текстура оновлюється**
    trailRT.current.texture.needsUpdate = true;

    // ✅ **Рендеримо сцену у текстуру**
    gl.setRenderTarget(trailRT.current);
    gl.render(trailScene.current, trailCamera.current);
    gl.setRenderTarget(null);

    // ✅ Видаляємо старі сліди, якщо вони повністю прозорі
    trails.current = trails.current.filter(
      ({ material }) => material.opacity > 0
    );
  });

  return null;
};

export default TrailTexture;
