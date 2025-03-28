import { GizmoHelper, GizmoViewcube, GizmoViewport } from "@react-three/drei";

const EditGizmoHelper = () => {
  return (
    <>
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        {/* <GizmoViewcube /> */}
        <GizmoViewport
          axisColors={["#ff3653", "#8dfc8d", "#3f7eff"]}
          labelColor="black"
        />
      </GizmoHelper>
    </>
  );
};

export default EditGizmoHelper;
