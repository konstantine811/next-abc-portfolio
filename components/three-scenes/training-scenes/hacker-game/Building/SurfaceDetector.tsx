import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo } from "react";

export const SurfaceDetector = ({
  position,
  onSurfaceDetected,
}: {
  position: [number, number, number];
  onSurfaceDetected: (surface: THREE.Intersection) => void;
}) => {
  const { scene, camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    const down = new THREE.Vector3(0, -1, 0); // Напрямок вниз
    const origin = new THREE.Vector3(...position);

    raycaster.set(origin, down);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const first = intersects[0];
      onSurfaceDetected(first);
    }
  }, [position, raycaster, scene.children, onSurfaceDetected]);

  return null;
};

export default SurfaceDetector;
