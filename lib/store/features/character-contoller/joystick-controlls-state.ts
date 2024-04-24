import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type JoystickControllsState = {
  curJoystickDis: number;
  curJoystickAngle: number;
  curRunState: boolean;
  curButton1Pressed: boolean;
  curButton2Pressed: boolean;
  curButton3Pressed: boolean;
  curButton4Pressed: boolean;
  curButton5Pressed: boolean;
};

const initialState: JoystickControllsState = {
  curJoystickDis: 0,
  curJoystickAngle: 0,
  curRunState: false,
  curButton1Pressed: false,
  curButton2Pressed: false,
  curButton3Pressed: false,
  curButton4Pressed: false,
  curButton5Pressed: false,
};

export const JoystickControllsState = createSlice({
  name: "joystick-controlls-state",
  initialState,
  reducers: {
    onJoystick(
      state,
      action: PayloadAction<{ dis: number; angle: number; isRun: boolean }>
    ) {
      state.curJoystickDis = action.payload.dis;
      state.curJoystickAngle = action.payload.angle;
      state.curRunState = action.payload.isRun;
    },
    resetJoystick(state) {
      if (state.curJoystickDis !== 0 || state.curJoystickAngle !== 0) {
        state.curJoystickDis = 0;
        state.curJoystickAngle = 0;
        state.curRunState = false;
      }
    },
    pressButton1(state) {
      state.curButton1Pressed = true;
    },
    pressButton2(state) {
      state.curButton2Pressed = true;
    },
    pressButton3(state) {
      state.curButton3Pressed = true;
    },
    pressButton4(state) {
      state.curButton4Pressed = true;
    },
    pressButton5(state) {
      state.curButton5Pressed = true;
    },
    resetAllButtons(state) {
      state.curButton1Pressed = false;
      state.curButton2Pressed = false;
      state.curButton3Pressed = false;
      state.curButton4Pressed = false;
      state.curButton5Pressed = false;
    },
  },
});

export const {
  onJoystick,
  pressButton1,
  pressButton2,
  pressButton3,
  pressButton4,
  pressButton5,
  resetAllButtons,
  resetJoystick,
} = JoystickControllsState.actions;
export default JoystickControllsState.reducer;
