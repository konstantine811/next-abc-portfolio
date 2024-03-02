import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: UIState;
};

type UIState = {
  headerHeight: number;
};

const initialState = {
  value: {
    headerHeight: 0,
  } as UIState,
} as InitialState;

export const uiState = createSlice({
  name: "ui-state",
  initialState,
  reducers: {
    onHeaderHeight: (state, action: PayloadAction<number>) => {
      state.value.headerHeight = action.payload;
    },
  },
});

export const { onHeaderHeight } = uiState.actions;
export default uiState.reducer;
