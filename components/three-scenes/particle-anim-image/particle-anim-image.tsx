"use client";

import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  ShaderMaterial,
  TextureLoader,
  Uniform,
  Vector2,
} from "three";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
// shaders
const vertex =
  require("@/shaders/particle-anim-image/particle-vertex.vert").default;
const fragment =
  require("@/shaders/particle-anim-image/particle-fragment.frag").default;

const ParticleAnimImage = () => {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const [image] = useLoader(TextureLoader, ["/assets/images/picture-1.png"]);

  const size = 1000;
  const divisions = 500;

  // Generate our positions attributes array
  const points = useMemo(() => {
    const vertices = [];
    for (let y = 0; y <= divisions; y++) {
      for (let x = 0; x <= divisions; x++) {
        vertices.push(x, y, 0);
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return geometry;
  }, []);

  return (
    <points>
      <bufferGeometry attach="geometry" {...points} />
      {/* <pointsMaterial
        attach="material"
        size={5}
        sizeAttenuation
        color="white"
        map={image}
      /> */}
      <shaderMaterial
        uniforms={{
          uResolution: new Uniform(
            new Vector2(
              window.innerWidth * window.devicePixelRatio,
              window.innerHeight * window.devicePixelRatio
            )
          ),
          uPicutreTexture: { value: image },
        }}
        fragmentShader={fragment}
        vertexShader={vertex}
        ref={shaderRef}
      />
    </points>
  );
};

export default ParticleAnimImage;
