import { usePerf } from "r3f-perf";

const DebugHeadless = () => {
  /* @ts-ignore */
  const [log, getReport, gl] = usePerf((s) => [s.log, s.getReport, s.gl]);
  return (
    <div className="absolute left-4 bottom-3 z-50 flex flex-col gap-3 bg-black/50 backdrop-blur-sm rounded-md p-4">
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
      <div>
        <b>REPORT: WEB GL Data</b>
        <br />
        <div>
          {Object.entries(getReport().gl).map(([key, val]) => (
            <div key={key}>
              {key}: {parseFloat(val as string).toFixed(0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugHeadless;
