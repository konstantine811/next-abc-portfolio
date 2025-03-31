// EarthParticles.tsx - адаптований під InstancedBufferGeometry, displacement та touch

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";

const EarthParticles = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/earth/Ocean.png");
  // const { texture: touchTexture } = useTouchTexture({
  //   size: 256,
  //   radius: 0.005,
  //   persist: true,
  // });

  const width = 256 * 2;
  const height = 128 * 4;
  const numPoints = width * height;

  const geometry = useMemo(() => {
    const baseGeometry = new THREE.InstancedBufferGeometry();

    const positions = new Float32Array([
      -0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0,
    ]);
    baseGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    baseGeometry.setIndex([0, 2, 1, 2, 3, 1]);

    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    baseGeometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    const offsets = new Float32Array(numPoints * 3);
    const angles = new Float32Array(numPoints);
    const indices = new Uint16Array(numPoints);

    let i = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        indices[i] = index;
        angles[i] = Math.random() * Math.PI * 2;

        const lon = (x / width) * 360 - 180;
        const lat = 90 - (y / height) * 180;
        const vec = latLngToSphere(lat, lon, 1);

        offsets[i * 3 + 0] = vec.x;
        offsets[i * 3 + 1] = vec.y;
        offsets[i * 3 + 2] = vec.z;
        i++;
      }
    }

    baseGeometry.setAttribute(
      "pindex",
      new THREE.InstancedBufferAttribute(indices, 1)
    );
    baseGeometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(offsets, 3)
    );
    baseGeometry.setAttribute(
      "angle",
      new THREE.InstancedBufferAttribute(angles, 1)
    );

    return baseGeometry;
  }, [height, numPoints, width]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      // materialRef.current.uniforms.uTouch.value = touchTexture;
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.needsUpdate = true;
    }
  });

  const vertexShader = `
    precision highp float;
    attribute float pindex;
    attribute vec3 offset;
    attribute float angle;

    uniform float uTime;
    uniform float uSize;
    uniform float uDepth;
    uniform float uRandom;
    uniform sampler2D uTouch;
    uniform sampler2D uTexture;

    varying vec2 vPUv;

    void main() {
        vec3 pos = offset;

        // vec2 puv = vec2((offset.x + 1.0) * 0.5, (offset.y + 1.0) * 0.5);
        // vPUv = puv;

        // float base = texture2D(uTexture, puv).r;
        // float t = texture2D(uTouch, puv).r;
        // float disp = (t + base) * 2.0;

        // float wave = sin(uTime * 2.0 + offset.x * 100.0 + offset.y * 100.0) * 0.1;
        // pos.z += wave;

        // pos += normalize(pos) * disp;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
     precision mediump float;
    varying vec2 vPUv;
    uniform sampler2D uTexture;

    void main() {
      float grey = texture2D(uTexture, vPUv).r;
      gl_FragColor = vec4(vec3(grey), 1.0);
    }
  `;

  return (
    <group scale={1}>
      <points ref={meshRef} scale={3} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uRandom: { value: 1.0 },
            uSize: { value: 1.0 },
            uDepth: { value: 2.0 },
            // uTouch: { value: touchTexture },
            uTexture: { value: texture },
          }}
          transparent
          depthWrite={false}
        />
      </points>
      {/* Texture visualization */}
      <mesh rotation={[0, 0, 0]} position={[0, 0.01, 0]} scale={2}>
        <planeGeometry args={[2, 2]} />
        {/* <meshBasicMaterial map={touchTexture} /> */}
      </mesh>
    </group>
  );
};

function latLngToSphere(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default EarthParticles;
