import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import Clouds from "./Clouds";

const Earth = ({ speed }: { speed: number }) => {
  const texture = useTexture({
    map: "/textures/earth/Albedo.jpg",
    bumpMap: "/textures/earth/Bump.jpg",
  });
  const cloudsMap = useTexture("/textures/earth/Clouds.png");
  cloudsMap.wrapS = cloudsMap.wrapT = THREE.RepeatWrapping;

  texture.map.colorSpace = THREE.SRGBColorSpace;

  const earthRef = useRef<THREE.Mesh>(null);
  const earthMaterial = useRef<THREE.MeshStandardMaterial>(null!);

  const initialOffset = 0; // Початковий зсув тіней

  useEffect(() => {
    if (!earthRef.current) return;
    if (!earthMaterial.current) return;

    earthMaterial.current.onBeforeCompile = (shader) => {
      shader.uniforms.tClouds = { value: cloudsMap };
      shader.uniforms.uv_xOffset = { value: initialOffset }; // Встановлюємо початковий зсув

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform sampler2D tClouds;
        uniform float uv_xOffset;
      `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        #include <emissivemap_fragment>
        float cloudsMapValue = texture2D(tClouds, vec2(vMapUv.x - uv_xOffset, vMapUv.y)).r;
        diffuseColor.rgb *= max(1.0 - cloudsMapValue, 0.2);
      `
      );

      earthMaterial.current.userData.shader = shader;
    };

    earthMaterial.current.needsUpdate = true; // Оновлюємо шейдер
  }, [cloudsMap]);

  const { bumpScale } = useControls("Earth", {
    bumpScale: { value: 251, min: 0, max: 5000 },
  });

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += speed * 0.005;
    }
    if (earthMaterial.current) {
      const shader = earthMaterial.current.userData.shader;
      if (shader) {
        let offset = (speed * 0.005) / (2 * Math.PI);
        shader.uniforms.uv_xOffset.value =
          (shader.uniforms.uv_xOffset.value + offset) % 1;
      }
    }
  });

  return (
    <group rotation={[0, 0, (23.5 / 360) * Math.PI * 2]}>
      <Clouds speed={speed} />
      <mesh ref={earthRef}>
        <sphereGeometry args={[10, 640, 640]} />
        <meshStandardMaterial
          ref={earthMaterial}
          {...texture}
          bumpScale={bumpScale}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};

export default Earth;
