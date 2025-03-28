import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

const PlaySceneInit = () => {
  return (
    <Canvas camera={{ position: [0, 20, 20] }}>
      <Environment preset="sunset" background blur={0.4} />
      <group position={[0, -10, 0]}>
        <Suspense fallback={<span>Loading ...</span>}>
          <mesh>
            <boxGeometry args={[10, 10, 10]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </Suspense>
      </group>
    </Canvas>
  );
};

export default PlaySceneInit;
