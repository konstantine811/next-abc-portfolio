"use client";

import { ReactNode, memo, useEffect } from "react";
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
        className="col-span-2 z-[1000000]"
        style={{ top: `${headerHeight}px` }}
      />
      <div className="xl:col-span-7 col-span-12 xl:col-start-4 col-start-0">
        <MainContent className="flex flex-col gap-2">{children}</MainContent>
      </div>
    </>
  );
};

export default memo(ContentBlog);
