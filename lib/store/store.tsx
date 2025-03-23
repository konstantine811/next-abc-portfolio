import { configureStore } from "@reduxjs/toolkit";
// slices
import uiStateReducer from "@/lib/store/features/ui-state.slice";
import blogPostStateReducer from "@/lib/store/features/blog-post-state.slice";
import gameStateReducer from "@/lib/store/features/character-contoller/game-state.slice";
import joystickControllsReducer from "@/lib/store/features/character-contoller/joystick-controlls-state";
import controlGameState from "@/lib/store/features/character-contoller/control-state.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      uiStateReducer,
      blogPostStateReducer,
      gameStateReducer,
      joystickControllsReducer,
      controlGameState,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
