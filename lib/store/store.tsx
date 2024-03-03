import { configureStore } from "@reduxjs/toolkit";
// slices
import uiStateReducer from "@/lib/store/features/ui-state.slice";
import blogPostStateReducer from "@/lib/store/features/blog-post-state.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      uiStateReducer,
      blogPostStateReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
