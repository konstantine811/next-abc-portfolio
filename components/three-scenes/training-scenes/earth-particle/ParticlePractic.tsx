import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  DoubleSide,
  IcosahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import fragment from "./shaders/particle-practic/fragment.glsl";
import vertex from "./shaders/particle-practic/vertex.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import useTouchTexture from "../hooks/useTouchTexture";

const ParticlePractic = () => {
  const { size, gl } = useThree();
  const { onPointerMove, texture: touchTexture } = useTouchTexture({
    size: 512,
    isTest: true,
    radius: 0.3,
    maxAge: 100.5,
    persist: false,
  });
  const geoRef = useRef<PlaneGeometry>(null!);
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { width, height } = size;
  const pixelRatio = gl.getPixelRatio();
  const meshResolution = 380;
  const { map, earthMap } = useTexture({
    map: "/assets/images/main_2.png",
    earthMap: "/textures/earth/Albedo.jpg",
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new Vector2(width * pixelRatio, height * pixelRatio),
      },
      uPictureTexture: { value: map },
      uDisplacementTexture: { value: touchTexture },
    }),
    [width, height, pixelRatio, map, touchTexture]
  );

  useEffect(() => {
    if (geoRef.current) {
      const intensityArray = new Float32Array(
        geoRef.current.attributes.position.count
      );
      const anglesArray = new Float32Array(
        geoRef.current.attributes.position.count
      );
      for (let i = 0; i < intensityArray.length; i++) {
        intensityArray[i] = Math.random();
        anglesArray[i] = (Math.random() * Math.PI) / 2;
      }
      geoRef.current.setAttribute(
        "aIntensity",
        new BufferAttribute(intensityArray, 1)
      );
      geoRef.current.setAttribute(
        "aAngle",
        new BufferAttribute(anglesArray, 1)
      );
      geoRef.current.setIndex(null);
      geoRef.current.deleteAttribute("normal");
    }
  }, []);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      <points>
        {/* <icosahedronGeometry args={[3, 80]} /> */}
        <planeGeometry
          ref={geoRef}
          args={[10, 10, meshResolution, meshResolution]}
        />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          ref={shaderRef}
          // blending={AdditiveBlending}
          // depthTest={false}
          uniforms={uniforms}
        ></shaderMaterial>
      </points>
      <mesh
        onPointerMove={(e) => {
          onPointerMove(e);
        }}
        visible={false}
      >
        {/* <icosahedronGeometry args={[3, 80]} /> */}
        <planeGeometry args={[10, 10, 10, 10]} />
        <meshStandardMaterial side={DoubleSide} />
      </mesh>
    </>
  );
};

export default ParticlePractic;
