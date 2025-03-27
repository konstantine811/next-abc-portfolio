import { useFrame } from "@react-three/fiber";
import { useTouchTexture } from "./useTouchTextre";

const TouchTerrain = () => {
  const { texture, update, addTouch } = useTouchTexture({
    size: 256,
    persist: false,
  });

  useFrame((_, delta) => {
    update(delta);
  });

  const handleMove = (e: any) => {
    if (e.uv) {
      addTouch({ x: e.uv.x, y: e.uv.y });
    }
  };

  return (
    <>
      {/* Terrain */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleMove}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[10, 10, 128, 128]} />
        <meshStandardMaterial
          color="red"
          displacementMap={texture}
          displacementScale={1}
          wireframe={false}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Texture visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, 0]} scale={2}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};

export default TouchTerrain;
