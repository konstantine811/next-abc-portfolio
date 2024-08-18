"use client";

import { ReactNode, memo } from "react";
// components
import MainContent from "@/components/page-partials/common/main-content";
import AsidePanel from "@/components/page-partials/aside-panel";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface Props {
  data: BlogPostEntity;
  children: ReactNode;
}
const ContentBlog = ({ data, children }: Props) => {
  const { headerHeight } = useSelector(
    (state: RootState) => state.uiStateReducer
  );
  return (
    <>
      <AsidePanel
        data={data}
        className="col-span-2 fixed"
        style={{ top: `${headerHeight}px` }}
      />
      <div className="xl:col-span-8 col-span-12 xl:col-start-3 col-start-0 mt-8">
        <MainContent className="flex flex-col gap-2">{children}</MainContent>
      </div>
    </>
  );
};

export default memo(ContentBlog);
