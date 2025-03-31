import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  PlaneGeometry,
  Points,
  ShaderMaterial,
} from "three";
import vertex from "./shaders/sphere/vertex.glsl";
import fragment from "./shaders/sphere/fragment.glsl";
import { useFrame } from "@react-three/fiber";

const SphereParticle = () => {
  const particleRef = useRef<Points>(null!);
  const shaderRef = useRef<ShaderMaterial>(null!);
  const count = 1000;

  useFrame((state, delta) => {
    if (shaderRef.current) {
      //   shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      //   shaderRef.current.needsUpdate = true;
    }
  });
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(1, 1, 32, 32);
    const pindex = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pindex[i] = i;
    }
    geo.setAttribute("pindex", new BufferAttribute(pindex, 1));
    return geo;
  }, []);
  return (
    <points geometry={geometry} ref={particleRef}>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTime: {
            value: 0,
          },
          uRadius: {
            value: 0.05,
          },
          uParticleCount: {
            value: count,
          },
        }}
      ></shaderMaterial>
    </points>
  );
};

export default SphereParticle;
