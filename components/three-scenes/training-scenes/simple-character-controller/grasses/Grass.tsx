import React, { useRef, useMemo, useEffect, RefObject } from "react";
import { createNoise2D } from "simplex-noise";

import { useFrame } from "@react-three/fiber";

import {
  Color,
  DoubleSide,
  Group,
  InstancedBufferAttribute,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import { useTexture } from "@react-three/drei";
import { RigidBody } from "@dimforge/rapier3d-compat";
// shaders
const vertex = require("@/shaders/grass-shaders/vertex.vert").default;
const fragment = require("@/shaders/grass-shaders/fragment.frag").default;

const noise2D = createNoise2D(Math.random);

interface GrassProps {
  characterRef: RefObject<Group>;
  options?: {
    bW: number;
    bH: number;
    joints: number;
  };
  width?: number;
  instances?: number;
}

export default function Grass({
  options = { bW: 0.1, bH: 1, joints: 2 },
  width = 10,
  instances = 5000,
  characterRef,
}: GrassProps) {
  const { bW, bH, joints } = options;
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const [texture, alphaMap] = useTexture([
    "/textures/grass/blade_diffuse.png",
    "/textures/grass/blade_alpha.png",
  ]);

  const attributeData = useMemo(
    () => getAttributeData(instances, width),
    [instances, width]
  );

  const baseGeom = useMemo(() => {
    const geom = new PlaneGeometry(bW, bH, 1, joints);
    geom.translate(0, bH / 2, 0);
    return geom;
  }, [bW, bH, joints]);

  const groundGeo = useMemo(() => {
    const geo = new PlaneGeometry(width, width, 32, 32);
    const positions = geo.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] = getYPosition(positions[i], positions[i + 2]);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime / 4;

      materialRef.current.uniforms.uCapsulePos.value.copy(
        characterRef.current.getPosition()
      );
    }
  });

  useEffect(() => {
    console.log(characterRef.current);
    if (meshRef.current) {
      const geom = meshRef.current.geometry;

      geom.setAttribute(
        "offset",
        new InstancedBufferAttribute(new Float32Array(attributeData.offsets), 3)
      );
      geom.setAttribute(
        "orientation",
        new InstancedBufferAttribute(
          new Float32Array(attributeData.orientations),
          4
        )
      );
      geom.setAttribute(
        "stretch",
        new InstancedBufferAttribute(
          new Float32Array(attributeData.stretches),
          1
        )
      );
      geom.setAttribute(
        "halfRootAngleSin",
        new InstancedBufferAttribute(
          new Float32Array(attributeData.halfRootAngleSin),
          1
        )
      );
      geom.setAttribute(
        "halfRootAngleCos",
        new InstancedBufferAttribute(
          new Float32Array(attributeData.halfRootAngleCos),
          1
        )
      );
      geom.computeVertexNormals();
    }
  }, [attributeData]);

  return (
    <group position={[0, -2, 0]}>
      <instancedMesh ref={meshRef} args={[baseGeom, undefined, instances]}>
        <shaderMaterial
          uniforms={{
            bladeHeight: { value: 0.5 },
            map: { value: null },

            alphaMap: { value: alphaMap },
            time: { value: 0 },
            tipColor: { value: new Color(0.0, 0.6, 0.0).convertSRGBToLinear() },
            bottomColor: {
              value: new Color(0.0, 0.1, 0.0).convertSRGBToLinear(),
            },
            uCapsulePos: { value: new Vector3(0, 0, 0) },
            uStepRadius: { value: 3 },
            uMouseMove: { value: new Vector2() },
          }}
          side={DoubleSide}
          fragmentShader={fragment}
          vertexShader={vertex}
          ref={materialRef}
          toneMapped={false}
        />
      </instancedMesh>
      <mesh geometry={groundGeo} position={[0, 0, 0]}>
        <meshStandardMaterial color="#000f00" />
      </mesh>
    </group>
  );
}

function getAttributeData(instances: number, width: number) {
  const offsets = [];
  const orientations = [];
  const stretches = [];
  const halfRootAngleSin = [];
  const halfRootAngleCos = [];

  let quaternion_0 = new Vector4();
  let quaternion_1 = new Vector4();

  //The min and max angle for the growth direction (in radians)
  const min = -0.25;
  const max = 0.25;

  //For each instance of the grass blade
  for (let i = 0; i < instances; i++) {
    //Offset of the roots
    const offsetX = Math.random() * width - width / 2;
    const offsetZ = Math.random() * width - width / 2;
    const offsetY = getYPosition(offsetX, offsetZ);
    offsets.push(offsetX, offsetY, offsetZ);

    //Define random growth directions
    //Rotate around Y
    let angle = Math.PI - Math.random() * (2 * Math.PI);
    halfRootAngleSin.push(Math.sin(0.5 * angle));
    halfRootAngleCos.push(Math.cos(0.5 * angle));

    let RotationAxis = new Vector3(0, 1, 0);
    let x = RotationAxis.x * Math.sin(angle / 2.0);
    let y = RotationAxis.y * Math.sin(angle / 2.0);
    let z = RotationAxis.z * Math.sin(angle / 2.0);
    let w = Math.cos(angle / 2.0);
    quaternion_0.set(x, y, z, w).normalize();

    //Rotate around X
    angle = Math.random() * (max - min) + min;
    RotationAxis = new Vector3(1, 0, 0);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    //Rotate around Z
    angle = Math.random() * (max - min) + min;
    RotationAxis = new Vector3(0, 0, 1);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    orientations.push(
      quaternion_0.x,
      quaternion_0.y,
      quaternion_0.z,
      quaternion_0.w
    );

    //Define variety in height
    if (i < instances / 3) {
      stretches.push(Math.random() * 0.000008);
    } else {
      stretches.push(Math.random());
    }
  }

  return {
    offsets,
    orientations,
    stretches,
    halfRootAngleCos,
    halfRootAngleSin,
  };
}

function multiplyQuaternions(q1: Vector4, q2: Vector4) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
  return new Vector4(x, y, z, w);
}

function getYPosition(x: number, z: number) {
  var y = 2 * noise2D(x / 50, z / 50);
  y += 4 * noise2D(x / 100, z / 100);
  y += 0.2 * noise2D(x / 10, z / 10);
  return y;
}
