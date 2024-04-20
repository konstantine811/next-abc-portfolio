import { useThree } from "@react-three/fiber";
import { PerfHeadless } from "r3f-perf";

const Debug = () => {
  const { width } = useThree((s) => s.size);
  return (
    /* This is it -> */
    <PerfHeadless minimal={width < 712} />
  );
};

export default Debug;
