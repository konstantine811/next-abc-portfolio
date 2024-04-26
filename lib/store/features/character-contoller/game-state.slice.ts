import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vector3 } from "three";
// models
import { AnimationSet } from "@/components/three-scenes/characterController/controllers/models";

type GameState = {
  moveToPoint: { x: number; y: number; z: number };
  isCameraBased: boolean;
  curAnimation: string | null;
  animationSet: AnimationSet;
};

const initialState: GameState = {
  moveToPoint: { x: 0, y: 0, z: 0 },
  isCameraBased: false,
  curAnimation: null,
  animationSet: {},
};

export const GameState = createSlice({
  name: "game-state",
  initialState,
  reducers: {
    initialAnimationSet: (state, action: PayloadAction<AnimationSet>) => {
      if (Object.keys(state.animationSet).length === 0) {
        state.animationSet = action.payload;
      }
      state.animationSet = {};
    },
    reset: (state, action: PayloadAction<string>) => {
      state.curAnimation = action.payload;
    },
    idle: (state, action: PayloadAction<string>) => {
      if (state.curAnimation === state.animationSet.jumpIdle) {
        state.curAnimation = state.animationSet.jumpLand
          ? state.animationSet.jumpLand
          : null;
      } else if (
        state.curAnimation !== state.animationSet.action1 &&
        state.curAnimation !== state.animationSet.action2 &&
        state.curAnimation !== state.animationSet.action3 &&
        state.curAnimation !== state.animationSet.action4
      ) {
        state.curAnimation = action.payload;
      }
    },
    walk: (state, action: PayloadAction<string>) => {
      if (state.curAnimation !== state.animationSet.action4) {
        state.curAnimation = action.payload;
      }
    },
    run: (state, action: PayloadAction<string>) => {
      if (state.curAnimation !== state.animationSet.action4) {
        state.curAnimation = action.payload;
      }
    },
    jump: (state, action: PayloadAction<string>) => {
      state.curAnimation = action.payload;
    },
    jumpIdle: (state, action: PayloadAction<string>) => {
      if (state.curAnimation === state.animationSet.jump) {
        state.curAnimation = action.payload;
      }
    },
    jumpLand: (state, action: PayloadAction<string>) => {
      if (state.curAnimation === state.animationSet.jumpIdle) {
        state.curAnimation = action.payload;
      }
    },
    fall: (state, action: PayloadAction<string>) => {
      state.curAnimation = action.payload;
    },
    action: (state, action: PayloadAction<string>) => {
      if (state.curAnimation === state.animationSet.idle) {
        state.curAnimation = action.payload;
      }
    },
    action4: (state, action: PayloadAction<string>) => {
      if (
        state.curAnimation === state.animationSet.idle ||
        state.curAnimation === state.animationSet.walk ||
        state.curAnimation === state.animationSet.run
      ) {
        state.curAnimation = action.payload;
      }
    },
    onMovePoint: (state, action: PayloadAction<Vector3>) => {
      state.moveToPoint = action.payload;
    },
    onCameraBased: (state, action: PayloadAction<boolean>) => {
      state.isCameraBased = action.payload;
    },
  },
});

export const {
  initialAnimationSet,
  reset,
  idle,
  walk,
  run,
  jump,
  jumpIdle,
  fall,
  jumpLand,
  onCameraBased,
  onMovePoint,
  action,
  action4,
} = GameState.actions;
export default GameState.reducer;
