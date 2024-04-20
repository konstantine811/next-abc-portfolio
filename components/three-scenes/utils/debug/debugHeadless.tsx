import { usePerf } from "r3f-perf";

const DebugHeadless = () => {
  /* @ts-ignore */
  const [log, getReport] = usePerf((s) => [s.log, s.getReport]);
  return (
    <div className="absolute left-4 z-50 flex gap-8 bg-black/50 rounded-md p-4">
      <div>
        <b>LOG Realtime:</b>
        <div>
          {log &&
            Object.entries(log).map(([key, val]) => (
              <div key={key}>
                {key}: {parseFloat(val as string).toFixed(3)}
              </div>
            ))}
        </div>
      </div>
      <div>
        <b>
          REPORT: Data gathered for{" "}
          {parseFloat(getReport().sessionTime).toFixed(2)}s
        </b>
        <br />
        <div>
          average:
          {Object.entries(getReport().log).map(([key, val]) => (
            <div key={key}>
              {key}: {parseFloat(val as string).toFixed(3)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugHeadless;
