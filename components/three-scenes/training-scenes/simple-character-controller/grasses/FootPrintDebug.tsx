import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const FootprintTextureDebug = () => {
  const { currentPosition } = useSelector(
    (state: RootState) => state.gameStateReducer
  );
  const trailInstanceRef = useRef<THREE.InstancedMesh>(null!);
  const trailPositions = useRef<THREE.Vector3[]>([]);
  const previousPosition = useRef(new THREE.Vector3()); // Запам'ятовуємо попередню позицію
  const trailCount = 50;

  function updateTrail(position: THREE.Vector3) {
    // Обчислюємо відстань між поточною та попередньою позицією
    const distance = previousPosition.current.distanceTo(position);

    if (distance < 0.2) return; // Додаємо слід тільки якщо персонаж пройшов мінімальну відстань

    // Оновлюємо попередню позицію
    previousPosition.current.copy(position);

    // Додаємо новий слід
    trailPositions.current.unshift(position.clone());
    if (trailPositions.current.length > trailCount) {
      trailPositions.current.pop();
    }

    for (let i = 0; i < trailPositions.current.length; i++) {
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();

      // Повертаємо площину вниз (-90 градусів по X)
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      matrix.compose(
        trailPositions.current[i],
        quaternion,
        new THREE.Vector3(1, 1, 1)
      );

      trailInstanceRef.current.setMatrixAt(i, matrix);
    }
    trailInstanceRef.current.instanceMatrix.needsUpdate = true;
  }

  useFrame(() => {
    updateTrail(
      new THREE.Vector3(currentPosition.x, currentPosition.y, currentPosition.z)
    );
  });

  useEffect(() => {
    trailInstanceRef.current.frustumCulled = false;
  }, []);

  return (
    <instancedMesh
      ref={trailInstanceRef}
      args={[undefined, undefined, trailCount]}
    >
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial color="red" side={THREE.DoubleSide} wireframe={true} />
    </instancedMesh>
  );
};

export default FootprintTextureDebug;
