import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JoystickState {
  curJoystickDis: number;
  curJoystickAng: number;
  curRunState: boolean;
  curButton1Pressed: boolean;
  curButton2Pressed: boolean;
  curButton3Pressed: boolean;
  curButton4Pressed: boolean;
  curButton5Pressed: boolean;
}

const initialState: JoystickState = {
  curJoystickDis: 0,
  curJoystickAng: 0,
  curRunState: false,
  curButton1Pressed: false,
  curButton2Pressed: false,
  curButton3Pressed: false,
  curButton4Pressed: false,
  curButton5Pressed: false,
};

export const joystickSlice = createSlice({
  name: "joystick",
  initialState,
  reducers: {
    setJoystick: (
      state,
      action: PayloadAction<{
        joystickDis: number;
        joystickAng: number;
        runState: boolean;
      }>
    ) => {
      state.curJoystickDis = action.payload.joystickDis;
      state.curJoystickAng = action.payload.joystickAng;
      state.curRunState = action.payload.runState;
    },
    resetJoystick: (state) => {
      if (state.curJoystickDis !== 0 || state.curJoystickAng !== 0) {
        state.curJoystickDis = 0;
        state.curJoystickAng = 0;
        state.curRunState = false;
      }
    },
    pressButton1: (state) => {
      if (!state.curButton1Pressed) {
        state.curButton1Pressed = true;
      }
    },
    pressButton2: (state) => {
      if (!state.curButton2Pressed) {
        state.curButton2Pressed = true;
      }
    },
    pressButton3: (state) => {
      if (!state.curButton3Pressed) {
        state.curButton3Pressed = true;
      }
    },
    pressButton4: (state) => {
      if (!state.curButton4Pressed) {
        state.curButton4Pressed = true;
      }
    },
    pressButton5: (state) => {
      if (!state.curButton5Pressed) {
        state.curButton5Pressed = true;
      }
    },
    releaseAllButtons: (state) => {
      state.curButton1Pressed = false;
      state.curButton2Pressed = false;
      state.curButton3Pressed = false;
      state.curButton4Pressed = false;
      state.curButton5Pressed = false;
    },
  },
});

export const {
  setJoystick,
  resetJoystick,
  pressButton1,
  pressButton2,
  pressButton3,
  pressButton4,
  pressButton5,
  releaseAllButtons,
} = joystickSlice.actions;

export default joystickSlice.reducer;
