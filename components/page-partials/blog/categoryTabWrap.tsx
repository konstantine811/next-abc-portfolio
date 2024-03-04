"use client";

import { BlogPostEntity } from "@/@types/schema.notion";
import CategoryTabs from "./categoryTabs";
import { useTranslations } from "next-intl";
import { memo } from "react";

interface Prop {
  data: BlogPostEntity;
  selectedPost: (data: BlogPostEntity) => void;
}
const CategoryTabWrap = ({ data, selectedPost }: Prop) => {
  const t = useTranslations("Blog");
  const selectedAll = t("categories.all");
  const categories = [selectedAll, ...Object.keys(data).map((i) => i)];
  function filterCategory(value: string) {
    if (value === selectedAll || !value) {
      selectedPost(data);
    } else {
      selectedPost({ [value]: data[value] });
    }
  }
  return (
    <CategoryTabs
      categories={categories}
      onValueChange={(value) => filterCategory(value)}
    />
  );
};

export default memo(CategoryTabWrap);
