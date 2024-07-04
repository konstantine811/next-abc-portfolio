"use client";

import { memo, useEffect, useState } from "react";
// utils
import { cn } from "@/lib/utils";
// models
import { BlogPost, BlogPostEntity } from "@/@types/schema.notion";
// components
import { Separator } from "@/components/ui/separator";
import BlogCard from "./cardBlog";
import { useAppSelector } from "@/lib/store/hooks";

interface Prop {}

const CategoryBlockBlog = ({}: Prop) => {
  const [mounted, setMounted] = useState(false);
  const data = useAppSelector(
    (state) => state.blogPostStateReducer.value.filteredBlogPost
  );
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;
  return (
    <div className={cn("w-full flex flex-col gap-10")}>
      {Object.entries(data).map(([key, posts]) => {
        return (
          <div className={cn("w-full flex flex-col gap-3")} key={key}>
            <h3 className={cn("text-3xl")}>{key}</h3>
            <Separator />
            <div className={cn("grid grid-cols-3 gap-4")}>
              {posts.map((post: BlogPost, i) => {
                return <BlogCard key={i} data={post} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(CategoryBlockBlog);
