import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as THREE from "three";

export type AnimationSet = {
  idle?: string;
  walk?: string;
  run?: string;
  jump?: string;
  jumpIdle?: string;
  jumpLand?: string;
  fall?: string;
  action1?: string;
  action2?: string;
  action3?: string;
  action4?: string;
};

interface GameState {
  moveToPoint: THREE.Vector3 | null;
  curAnimation: string | null;
  animationSet: AnimationSet;
}

const initialState: GameState = {
  moveToPoint: null,
  curAnimation: null,
  animationSet: {},
};

// Функція для перевірки, чи можна змінити анімацію
const canChangeAnimation = (state: GameState, allowed: string[]) =>
  allowed.includes(state.curAnimation || "");

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeAnimationSet: (state, action: PayloadAction<AnimationSet>) => {
      if (Object.keys(state.animationSet).length === 0) {
        state.animationSet = action.payload;
      }
    },
    resetAnimation: (state) => {
      state.curAnimation = state.animationSet.idle || null;
    },
    idle: (state) => {
      if (canChangeAnimation(state, [state.animationSet.jumpIdle!])) {
        state.curAnimation = state.animationSet.jumpLand || null;
      } else if (
        !canChangeAnimation(state, [
          state.animationSet.action1!,
          state.animationSet.action2!,
          state.animationSet.action3!,
          state.animationSet.action4!,
        ])
      ) {
        state.curAnimation = state.animationSet.idle || null;
      }
    },
    walk: (state) => {
      if (
        state.animationSet.walk &&
        state.curAnimation !== state.animationSet.action4
      ) {
        state.curAnimation = state.animationSet.walk;
      }
    },
    run: (state) => {
      if (
        state.animationSet.run &&
        state.curAnimation !== state.animationSet.action4
      ) {
        state.curAnimation = state.animationSet.run;
      }
    },
    jump: (state) => {
      if (state.animationSet.jump) state.curAnimation = state.animationSet.jump;
    },
    jumpIdle: (state) => {
      if (
        state.animationSet.jumpIdle &&
        state.curAnimation === state.animationSet.jump
      ) {
        state.curAnimation = state.animationSet.jumpIdle;
      }
    },
    jumpLand: (state) => {
      if (
        state.animationSet.jumpLand &&
        state.curAnimation === state.animationSet.jumpIdle
      ) {
        state.curAnimation = state.animationSet.jumpLand;
      }
    },
    fall: (state) => {
      if (state.animationSet.fall) state.curAnimation = state.animationSet.fall;
    },
    action1: (state) => {
      if (
        state.animationSet.action1 &&
        state.curAnimation === state.animationSet.idle
      ) {
        state.curAnimation = state.animationSet.action1;
      }
    },
    action2: (state) => {
      if (
        state.animationSet.action2 &&
        state.curAnimation === state.animationSet.idle
      ) {
        state.curAnimation = state.animationSet.action2;
      }
    },
    action3: (state) => {
      if (
        state.animationSet.action3 &&
        state.curAnimation === state.animationSet.idle
      ) {
        state.curAnimation = state.animationSet.action3;
      }
    },
    action4: (state) => {
      if (
        state.animationSet.action4 &&
        canChangeAnimation(state, [
          state.animationSet.idle!,
          state.animationSet.walk!,
          state.animationSet.run!,
        ])
      ) {
        state.curAnimation = state.animationSet.action4;
      }
    },
    setMoveToPoint: (state, action: PayloadAction<THREE.Vector3 | null>) => {
      state.moveToPoint = action.payload;
    },
  },
});

export const {
  initializeAnimationSet,
  resetAnimation,
  idle,
  walk,
  run,
  jump,
  jumpIdle,
  jumpLand,
  fall,
  action1,
  action2,
  action3,
  action4,
  setMoveToPoint,
} = gameSlice.actions;

export default gameSlice.reducer;
