import React, { useRef, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 50; // 50 x 50 = 2500 instances
const CELL_SIZE = 1;

const InstancedGrid = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { size, camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Position matrix for each instance
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    if (meshRef.current) {
      let id = 0;
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          dummy.position.set(x * CELL_SIZE, y * CELL_SIZE, 0);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(id++, dummy.matrix);
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      // Per-instance color attribute
      const colors = [];
      const color = new THREE.Color();
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        color.set("lightgray");
        colors.push(color.r, color.g, color.b);
      }
      meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(colors),
        3
      );
    }
  }, [meshRef, dummy]);

  const handlePointerDown = (event: any) => {
    console.log("event", event);
    const { x, y } = event.pointer;
    mouse.x = (event.clientX / size.width) * 2 - 1;
    mouse.y = -(event.clientY / size.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId!;
      setSelectedId(instanceId);

      const colorAttr = meshRef.current.instanceColor!;
      const selectedColor = new THREE.Color("orange");
      const defaultColor = new THREE.Color("lightgray");

      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const color = i === instanceId ? selectedColor : defaultColor;
        colorAttr.setXYZ(i, color.r, color.g, color.b);
      }
      colorAttr.needsUpdate = true;
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}
      onPointerDown={handlePointerDown}
      position={[GRID_SIZE / 2, GRID_SIZE / 2, 0]}
    >
      <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
};

export default InstancedGrid;
