import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ControlState {
  forward: boolean;
  backward: boolean;
  leftward: boolean;
  rightward: boolean;
  jump: boolean;
  run: boolean;
}

const initialState: ControlState = {
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  jump: false,
  run: false,
};

export const controlSlice = createSlice({
  name: "control-game",
  initialState,
  reducers: {
    setForward: (state, action: PayloadAction<boolean>) => {
      state.forward = action.payload;
    },
    setBackward: (state, action: PayloadAction<boolean>) => {
      state.backward = action.payload;
    },
    setLeftward: (state, action: PayloadAction<boolean>) => {
      state.leftward = action.payload;
    },
    setRightward: (state, action: PayloadAction<boolean>) => {
      state.rightward = action.payload;
    },
    setJump: (state, action: PayloadAction<boolean>) => {
      state.jump = action.payload;
    },
    setRun: (state, action: PayloadAction<boolean>) => {
      state.run = action.payload;
    },
    setAll: (state, action: PayloadAction<Partial<ControlState>>) => {
      Object.assign(state, action.payload);
    },
    resetControls: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setForward,
  setBackward,
  setLeftward,
  setRightward,
  setJump,
  setRun,
  setAll,
  resetControls,
} = controlSlice.actions;

export default controlSlice.reducer;
