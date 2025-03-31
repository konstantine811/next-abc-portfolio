import { useFrame } from "@react-three/fiber";
import useTouchTexture from "../../hooks/useTouchTexture";

const TouchTerrain = () => {
  const { texture: touchTexture, onPointerMove } = useTouchTexture({
    size: 256,
    persist: false,
  });

  return (
    <>
      {/* Terrain */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
        onPointerMove={onPointerMove}
      >
        <planeGeometry args={[10, 10, 128, 128]} />
        <meshStandardMaterial
          color="red"
          displacementMap={touchTexture}
          displacementScale={1}
          wireframe={true}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Texture visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, 0]} scale={2}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={touchTexture} />
      </mesh>
    </>
  );
};

export default TouchTerrain;
