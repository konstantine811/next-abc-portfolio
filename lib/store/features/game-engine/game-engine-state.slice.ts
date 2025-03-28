import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameEngineMode } from "@/models/three-scene/game-engine/game-engine-state.model";
import { Vector3Tuple } from "three";
interface InitialState {
  mode: GameEngineMode;
  gameEngineData: {
    cameraState: {
      position: Vector3Tuple;
      target: Vector3Tuple;
    };
  };
}

const initialState: InitialState = {
  mode: GameEngineMode.edit,
  gameEngineData: {
    cameraState: {
      position: [0, 20, 20],
      target: [0, 0, 0],
    },
  },
};

export const gameEngineState = createSlice({
  name: "game-engine-state",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<GameEngineMode>) => {
      state.mode = action.payload;
    },
    setCameraState: (
      state,
      action: PayloadAction<{ position: Vector3Tuple; target: Vector3Tuple }>
    ) => {
      state.gameEngineData.cameraState = action.payload;
    },
  },
});

export const { setMode, setCameraState } = gameEngineState.actions;
export default gameEngineState.reducer;
