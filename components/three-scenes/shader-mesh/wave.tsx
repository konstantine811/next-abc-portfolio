import { Color, ShaderMaterial, Texture, TextureLoader } from "three";
import { useRef } from "react";
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
    <mesh>
      <planeGeometry args={[1.4, 1, 116, 116]} />
      <shaderMaterial
        wireframe
        uniforms={{
          uColor: { value: new Color(0.0, 1.0, 0.0) },
          uTime: { value: 0 },
          uTexture: { value: image },
        }}
        fragmentShader={fragment}
        vertexShader={vertex}
        ref={shaderRef}
      />
    </mesh>
  );
};

export default Wave;
