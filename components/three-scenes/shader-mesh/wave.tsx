import { Color, ShaderMaterial, Vector2 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
// shaders
const vertex = require("@/shaders/vertex.vert").default;
const fragment = require("@/shaders/fragment.frag").default;

const Wave = () => {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const [image] = useTexture(["/assets/images/profilePhoto.png"]);
  useFrame(({ clock }) => {
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh
      onPointerMove={(e) => {
        if (shaderRef.current) {
          const { pageX, pageY } = e.nativeEvent;
          shaderRef.current.uniforms.uMouseMove.value.x = pageX / 100;
          shaderRef.current.uniforms.uMouseMove.value.y = pageY / 100;
        }
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
