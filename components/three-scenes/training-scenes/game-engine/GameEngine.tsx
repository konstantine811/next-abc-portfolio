import EditSceneInit from "./EditSceneInit";
import InitModeSwitch from "./UI/InitModeSwitch";
import { RootState } from "@/lib/store/store";
import { GameEngineMode } from "@/models/three-scene/game-engine/game-engine-state.model";
import PlaySceneInit from "./PlaySceneInit";
import { useAppSelector } from "@/lib/store/hooks";

const GameEngine = () => {
  const { mode } = useAppSelector((state: RootState) => state.gameEngineState);
  return (
    <div className="relative w-full h-full bg-gray-600/45">
      <InitModeSwitch />
      {mode === GameEngineMode.edit ? <EditSceneInit /> : <PlaySceneInit />}
    </div>
  );
};

export default GameEngine;
