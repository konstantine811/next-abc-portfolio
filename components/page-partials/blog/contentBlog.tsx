"use client";

import { ReactNode, memo, useEffect, useState } from "react";
// storage
import { useDispatch } from "react-redux";
// components
import MainContent from "@/components/page-partials/common/main-content";
import AsidePanel from "@/components/page-partials/aside-panel";
import CategoryTabWrap from "@/components/page-partials/blog/categoryTabWrap";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
// storage
import { onFilteredBlogPost } from "@/lib/store/features/blog-post-state.slice";

interface Props {
  data: BlogPostEntity;
  children: ReactNode;
}
const ContentBlog = ({ data, children }: Props) => {
  const [selectedPost, setSelectedPost] = useState<BlogPostEntity>({});
  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedPost(data);
    dispatch(onFilteredBlogPost(data));
  }, [data, dispatch]);
  return (
    <>
      <AsidePanel data={selectedPost} className="col-span-2" />
      <div className="col-span-8">
        <CategoryTabWrap
          selectedPost={(data) => {
            setSelectedPost(data);
            dispatch(onFilteredBlogPost(data));
          }}
          data={data}
        />
        <MainContent className="flex gap-3">{children}</MainContent>
      </div>
    </>
  );
};

export default memo(ContentBlog);
