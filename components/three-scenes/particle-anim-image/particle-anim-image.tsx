import { Color, ShaderMaterial, TextureLoader, Uniform, Vector2 } from "three";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
// shaders
const vertex =
  require("@/shaders/particle-anim-image/particle-vertex.vert").default;
const fragment =
  require("@/shaders/particle-anim-image/particle-fragment.frag").default;

const ParticleAnimImage = () => {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const [image] = useLoader(TextureLoader, ["/assets/images/profilePhoto.png"]);

  const count = 100;
  const sep = 3;

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        positions.push((x / sep) * 2, (y / sep) * 2, 0);
      }
    }

    return new Float32Array(positions);
  }, []);
  return (
    <points position={[-10, -35, -40]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
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
