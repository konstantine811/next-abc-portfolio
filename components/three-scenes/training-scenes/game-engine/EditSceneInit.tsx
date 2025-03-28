import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CameraSaver from "./edit-mode/CameraSaver";

import SelectableMeshWrap from "./edit-mode/select-mode/SelecatbleMeshWrap";
import GizmoHelper from "./edit-mode/GizmoHelper";

const SceneInit = () => {
  return (
    <Canvas shadows>
      <Grid
        sectionSize={10}
        sectionColor={"white"}
        sectionThickness={0.5}
        cellSize={5}
        cellColor={"#ececec"}
        cellThickness={0.5}
        infiniteGrid
        fadeFrom={3}
        fadeDistance={1000}
        fadeStrength={0}
        position={[0, -10, 0]}
      />
      <Environment preset="sunset" background blur={0.4} />
      <SelectableMeshWrap />
      <GizmoHelper />
      <CameraSaver />
    </Canvas>
  );
};

export default SceneInit;
