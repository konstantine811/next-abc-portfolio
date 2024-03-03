import { BlogPostEntity } from "@/@types/schema.notion";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: BlogPostState;
};

type BlogPostState = {
  filteredBlogPost: BlogPostEntity;
};

const initialState = {
  value: {
    filteredBlogPost: {},
  } as BlogPostState,
} as InitialState;

export const blogPostState = createSlice({
  name: "blog-post-state",
  initialState,
  reducers: {
    onFilteredBlogPost: (state, action: PayloadAction<BlogPostEntity>) => {
      state.value.filteredBlogPost = action.payload;
    },
  },
});

export const { onFilteredBlogPost } = blogPostState.actions;
export default blogPostState.reducer;
