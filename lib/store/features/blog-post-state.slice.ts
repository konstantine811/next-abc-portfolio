import { BlogPostEntity } from "@/@types/schema.notion";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  filteredBlogPost: BlogPostEntity;
}

const initialState: InitialState = {
  filteredBlogPost: {},
};

export const blogPostState = createSlice({
  name: "blog-post-state",
  initialState,
  reducers: {
    onFilteredBlogPost: (state, action: PayloadAction<BlogPostEntity>) => {
      state.filteredBlogPost = action.payload;
    },
  },
});

export const { onFilteredBlogPost } = blogPostState.actions;
export default blogPostState.reducer;
