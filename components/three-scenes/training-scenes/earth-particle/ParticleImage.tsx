import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Vector2,
} from "three";
import useTouchTexture from "../hooks/useTouchTexture";
import fragment from "./shaders/particle-image/fragment.glsl";
import vertex from "./shaders/particle-image/vertex.glsl";

const ParticleImage = () => {
  const { size } = useThree();
  const { map, earthMap } = useTexture({
    map: "/assets/images/main_2.png",
    earthMap: "/textures/earth/Albedo.jpg",
  });
  const { onPointerMove, texture: touchTexture } = useTouchTexture({
    size: 512,
    isTest: true,
    radius: 0.3,
    maxAge: 100.5,
    persist: false,
  });
  const numVisible = 0;
  const threshold = 34;
  const numPoints = size.width * size.height;
  const geo = useMemo(() => {
    const geometry = new InstancedBufferGeometry();

    // positions
    const positions = new BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute("position", positions);

    // uvs
    const uvs = new BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0, 0.0);
    uvs.setXYZ(3, 1.0, 1.0, 0.0);
    geometry.setAttribute("uv", uvs);

    // index
    geometry.setIndex(
      new BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const indices = new Uint16Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let i = 0, j = 0; i < numPoints; i++) {
      offsets[j * 3 + 0] = i % size.width;
      offsets[j * 3 + 1] = Math.floor(i / size.width);

      indices[j] = i;

      angles[j] = Math.random() * Math.PI;

      j++;
    }

    geometry.setAttribute(
      "pindex",
      new InstancedBufferAttribute(indices, 1, false)
    );
    geometry.setAttribute(
      "offset",
      new InstancedBufferAttribute(offsets, 3, false)
    );
    geometry.setAttribute(
      "angle",
      new InstancedBufferAttribute(angles, 1, false)
    );
    return geometry;
  }, [numPoints, size.width]);
  return (
    <>
      <points geometry={geo}>
        <shaderMaterial
          uniforms={{
            uTime: { value: 0 },
            uRandom: { value: 1.0 },
            uDepth: { value: 2.0 },
            uSize: { value: 0.0 },
            uTextureSize: { value: new Vector2(size.width, size.height) },
            uTexture: { value: map },
            uTouch: { value: touchTexture },
          }}
          vertexShader={vertex}
          fragmentShader={fragment}
        ></shaderMaterial>
      </points>
      <mesh onPointerMove={onPointerMove} visible={false}>
        <planeGeometry args={[10, 10, 10, 10]} />
      </mesh>
    </>
  );
};

export default ParticleImage;
