import { Color, ShaderMaterial, TextureLoader, Vector2 } from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
// shaders
const vertex = require("@/shaders/vertex.vert").default;
const fragment = require("@/shaders/fragment.frag").default;

const Wave = () => {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const [image] = useLoader(TextureLoader, ["/assets/images/profilePhoto.png"]);
  useFrame(({ clock }) => {
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh
      onPointerMove={(e) => {
        shaderRef.current.uniforms.uMouseMove.value.x = e.pageX / 200;
        shaderRef.current.uniforms.uMouseMove.value.y = e.pageY / 200;
      }}
      position={[0.5, 0, 0]}
    >
      <planeGeometry args={[1.5, 1.0, 116, 116]} />
      <shaderMaterial
        uniforms={{
          uColor: { value: new Color(0.0, 1.0, 0.0) },
          uTime: { value: 0 },
          uTexture: { value: image },
          uMouseMove: { value: new Vector2() },
        }}
        fragmentShader={fragment}
        vertexShader={vertex}
        ref={shaderRef}
      />
    </mesh>
  );
};

export default Wave;
