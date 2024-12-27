import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeAnimationSet: (state, action: PayloadAction<AnimationSet>) => {
      if (Object.keys(state.animationSet).length === 0) {
        state.animationSet = action.payload;
      }
    },
    reset: (state) => {
      state.curAnimation = state.animationSet.idle || null;
    },
    idle: (state) => {
      if (state.curAnimation === state.animationSet.jumpIdle) {
        state.curAnimation = state.animationSet.jumpLand || null;
      } else if (
        state.curAnimation !== state.animationSet.action1 &&
        state.curAnimation !== state.animationSet.action2 &&
        state.curAnimation !== state.animationSet.action3 &&
        state.curAnimation !== state.animationSet.action4
      ) {
        state.curAnimation = state.animationSet.idle || null;
      }
    },
    walk: (state) => {
      if (state.curAnimation !== state.animationSet.action4) {
        state.curAnimation = state.animationSet.walk || null;
      }
    },
    run: (state) => {
      if (state.curAnimation !== state.animationSet.action4) {
        state.curAnimation = state.animationSet.run || null;
      }
    },
    jump: (state) => {
      state.curAnimation = state.animationSet.jump || null;
    },
    jumpIdle: (state) => {
      if (state.curAnimation === state.animationSet.jump) {
        state.curAnimation = state.animationSet.jumpIdle || null;
      }
    },
    jumpLand: (state) => {
      if (state.curAnimation === state.animationSet.jumpIdle) {
        state.curAnimation = state.animationSet.jumpLand || null;
      }
    },
    fall: (state) => {
      state.curAnimation = state.animationSet.fall || null;
    },
    action1: (state) => {
      if (state.curAnimation === state.animationSet.idle) {
        state.curAnimation = state.animationSet.action1 || null;
      }
    },
    action2: (state) => {
      if (state.curAnimation === state.animationSet.idle) {
        state.curAnimation = state.animationSet.action2 || null;
      }
    },
    action3: (state) => {
      if (state.curAnimation === state.animationSet.idle) {
        state.curAnimation = state.animationSet.action3 || null;
      }
    },
    action4: (state) => {
      if (
        state.curAnimation === state.animationSet.idle ||
        state.curAnimation === state.animationSet.walk ||
        state.curAnimation === state.animationSet.run
      ) {
        state.curAnimation = state.animationSet.action4 || null;
      }
    },
    setMoveToPoint: (state, action: PayloadAction<THREE.Vector3 | null>) => {
      state.moveToPoint = action.payload;
    },
  },
});

export const {
  initializeAnimationSet,
  reset,
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
