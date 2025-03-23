import { RootState } from "@/lib/store/store";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RefObject, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BufferAttribute,
  DoubleSide,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  ShaderMaterial,
  Texture,
  Vector3,
  WebGLRenderTarget,
} from "three";

import useTextureTrail from "./useTextureTrail";
// shaders
const vertex =
  require("@/shaders/grass-shaders/grass-blade/vertex.vert").default;
const fragment =
  require("@/shaders/grass-shaders/grass-blade/fragment.frag").default;

interface GrassBladeProps {
  currentPositionTextureRef: RefObject<Texture>;
}

const GrassBlade = ({ currentPositionTextureRef }: GrassBladeProps) => {
  const INSTANCES = 1000000;
  const WIDTH = 50;
  const DIATMETER = 50;
  const HEIGHT = 0;
  const ref = useRef<InstancedMesh>(null!);

  const refMaterial = useRef<ShaderMaterial>(null!);

  const [grassDiffuse, grass] = useTexture([
    "/textures/grass/new-grass/grass_diffuse.jpg",
    "/textures/grass/new-grass/grass.jpg",
  ]);

  const geometry = useMemo(() => {
    const positions = [];
    const indexs = [];
    const uvs = [];
    const terrPosis = [];
    const angles = [];

    positions.push(0.5, -0.5, 0);
    positions.push(-0.5, -0.5, 0);
    positions.push(-0.5, 0.5, 0);
    positions.push(0.5, 0.5, 0);

    indexs.push(0);
    indexs.push(1);
    indexs.push(2);
    indexs.push(2);
    indexs.push(3);
    indexs.push(0);

    uvs.push(1.0, 0.0);
    uvs.push(0.0, 0.0);
    uvs.push(0.0, 1.0);
    uvs.push(1.0, 1.0);

    for (let i = 0; i < INSTANCES; i++) {
      let posX = Math.random() * WIDTH - WIDTH / 2;
      let posY = HEIGHT;
      let posZ = Math.random() * DIATMETER - DIATMETER / 2;
      //   posX = posY = posZ = 0;
      terrPosis.push(posX, posY, posZ);
      let angle = Math.random() * 360;
      angles.push(angle);
    }
    const grassGeo = new InstancedBufferGeometry();
    grassGeo.instanceCount = INSTANCES;
    grassGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    grassGeo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    grassGeo.setAttribute(
      "terrPos",
      new InstancedBufferAttribute(new Float32Array(terrPosis), 3)
    );
    grassGeo.setAttribute(
      "angle",
      new InstancedBufferAttribute(new Float32Array(angles), 1)
    );
    grassGeo.setIndex(new BufferAttribute(new Uint16Array(indexs), 1));
    return grassGeo;
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.computeBoundingBox();
      ref.current.frustumCulled = false;
    }
  });
  useFrame(({ clock, gl }) => {
    if (refMaterial.current) {
      refMaterial.current.uniforms.time.value = clock.elapsedTime;
    }
  });
  return (
    <>
      <instancedMesh
        ref={ref}
        position={[0, -3.5, 0]}
        args={[geometry, undefined, INSTANCES]}
      >
        <shaderMaterial
          attach="material"
          ref={refMaterial}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={{
            grassMaskTexture: { value: grass },
            grassDiffuseTexture: { value: grassDiffuse },
            footprintTexture: {
              value: currentPositionTextureRef.current,
            },
            time: { value: 0 },
            characterPos: { value: new Vector3(0, 0, 0) },
            influenceRadius: { value: 0.5 },
            recoverySpeed: { value: 0.5 },
          }}
          side={DoubleSide}
        />
      </instancedMesh>
    </>
  );
};

export default GrassBlade;
