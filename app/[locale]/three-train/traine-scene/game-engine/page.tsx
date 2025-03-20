"use client";

import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BackSide, BoxGeometry, Color } from "three";

const GameEngine = () => {
  return (
    <div className="w-full h-full bg-gray-600/45">
      <Canvas camera={{ position: [0, 20, 20] }}>
        <Grid
          sectionSize={10}
          sectionColor={"white"}
          sectionThickness={0.5}
          cellSize={5}
          cellColor={"#ececec"}
          cellThickness={0.5}
          infiniteGrid
          fadeFrom={3}
          fadeDistance={100}
          fadeStrength={1}
          position={[0, -10, 0]}
        />
        <Environment preset="sunset" />

        <group position={[0, -10, 0]}>
          <Suspense fallback={<span>Loading ...</span>}>
            <mesh>
              <boxGeometry args={[10, 10, 10]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </Suspense>
        </group>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GameEngine;
