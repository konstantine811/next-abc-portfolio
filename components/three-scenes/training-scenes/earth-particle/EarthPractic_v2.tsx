import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  Group,
  IcosahedronGeometry,
  Object3D,
  Raycaster,
  SphereGeometry,
  Vector2,
} from "three";
// shaders
import vertex from "./shaders/particle-earth/vertex.glsl";
import fragment from "./shaders/particle-earth/fragment.glsl";

const EarthPracticV2 = () => {
  const groupRef = useRef<Group>(null);
  const globeRef = useRef<Object3D>(null);
  const detail = 100;
  const texturePath = (name: string) => `/textures/earth/${name}`;
  const { gl, size, raycaster, camera } = useThree();
  const {
    width: canvasWidth,
    height: canvasHeight,
    left: canvasLeft,
    top: canvasTop,
  } = size;
  const texturePath2 = (name: string) => `/textures/earth_v2/${name}`;
  const pointerPos = useMemo(() => new Vector2(), []);
  const globeUV = useMemo(() => new Vector2(), []);
  const { colorMap, elevTexture, alphaTexture } = useTexture({
    colorMap: texturePath("Albedo.jpg"),
    elevTexture: texturePath("Bump.jpg"),
    alphaTexture: texturePath("Ocean.png"),
  });
  const uniforms = {
    size: { value: 5.0 },
    colorTexture: { value: colorMap },
    elevTexture: { value: elevTexture },
    alphaTexture: { value: alphaTexture },
    mouseUV: { value: globeUV },
    time: { value: 0.0 },
  };
  const geo = useMemo(() => {
    const geometry = new IcosahedronGeometry(1, detail);
    return geometry;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = ((e.clientX - canvasLeft) / canvasWidth) * 2 - 1;
    const y = -((e.clientY - canvasTop) / canvasHeight) * 2 + 1;
    pointerPos.set(x, y);
  }, []);

  const handleRaycaster = (globe: Object3D) => {
    raycaster.setFromCamera(pointerPos, camera);
    const intersects = raycaster.intersectObjects([globe], false);
    if (intersects.length) {
      const uv = intersects[0].uv;
      if (uv) {
        globeUV.copy(uv);
        uniforms.mouseUV.value.copy(globeUV);
      }
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove, gl.domElement]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const globe = groupRef.current;
      if (globeRef.current) {
        handleRaycaster(globeRef.current);
      }
      globe.rotation.y += 0.002;
      uniforms.time.value = delta;
    }
  });
  return (
    <group ref={groupRef}>
      <points scale={1.0} geometry={geo}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </points>
      <mesh ref={globeRef}>
        <icosahedronGeometry args={[1, 10]} />
        <meshStandardMaterial color="blue" visible={false} />
      </mesh>
    </group>
  );
};

export default EarthPracticV2;
