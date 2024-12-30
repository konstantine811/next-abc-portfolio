import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  headerHeight: number;
  screenWidth: number;
  screenHeight: number;
  isSfxEnabled: boolean;
}

const initialState: InitialState = {
  headerHeight: 0,
  screenWidth: 0,
  screenHeight: 0,
  isSfxEnabled: true,
};

export const uiState = createSlice({
  name: "ui-state",
  initialState,
  reducers: {
    onHeaderHeight: (state, action: PayloadAction<number>) => {
      state.headerHeight = action.payload;
    },
    onScreenSize(
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) {
      state.screenWidth = action.payload.width;
      state.screenHeight = action.payload.height;
    },
    onSfxEnabled(state, action: PayloadAction<boolean>) {
      state.isSfxEnabled = action.payload;
    },
  },
});

export const { onHeaderHeight, onScreenSize, onSfxEnabled } = uiState.actions;
export default uiState.reducer;
