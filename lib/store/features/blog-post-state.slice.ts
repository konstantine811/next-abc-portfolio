import { BlogPostEntity } from "@/@types/schema.notion";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  filteredBlogPost: BlogPostEntity;
  copiedId: string | null;
}

const initialState: InitialState = {
  filteredBlogPost: {},
  copiedId: null,
};

export const blogPostState = createSlice({
  name: "blog-post-state",
  initialState,
  reducers: {
    onFilteredBlogPost: (state, action: PayloadAction<BlogPostEntity>) => {
      state.filteredBlogPost = action.payload;
    },
    onCopiedId: (state, action: PayloadAction<string>) => {
      state.copiedId = action.payload;
    },
  },
});

export const { onFilteredBlogPost, onCopiedId } = blogPostState.actions;
export default blogPostState.reducer;
