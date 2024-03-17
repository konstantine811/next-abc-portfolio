"use client";

import { ReactNode, memo } from "react";
// components
import MainContent from "@/components/page-partials/common/main-content";
import AsidePanel from "@/components/page-partials/aside-panel";
// models
import { BlogPostEntity } from "@/@types/schema.notion";

interface Props {
  data: BlogPostEntity;
  children: ReactNode;
}
const ContentBlog = ({ data, children }: Props) => {
  return (
    <>
      <AsidePanel data={data} className="col-span-2" />
      <div className="col-span-8 mt-8">
        <MainContent className="flex flex-col gap-2">{children}</MainContent>
      </div>
    </>
  );
};

export default memo(ContentBlog);
