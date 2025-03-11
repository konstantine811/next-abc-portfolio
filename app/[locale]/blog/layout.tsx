import { BlogPostEntity } from "@/@types/schema.notion";
import ContentBlog from "@/components/page-partials/blog/contentBlog";
import MainContainer from "@/components/page-partials/common/container";
import { LocaleType } from "@/configs/locale";
import NotionService from "@/services/notion-service";
import { ReactNode, Suspense } from "react";
import Loading from "../loading";

interface Props {
  children: ReactNode;
  params: { locale: string };
}

const BlogLayout = async ({ children, params }: Props) => {
  // Enable static rendering
  const { locale } = await params;
  let categoryPosts: BlogPostEntity = {};
  try {
    const notionService = new NotionService();
    categoryPosts = await notionService.getPublishedBlogPosts(
      locale as LocaleType
    );
  } catch (e) {
    console.error(e);
  }
  return (
    <div className="grid grid-cols-12 gap-6 justify-center">
      <ContentBlog data={categoryPosts}>{children}</ContentBlog>
    </div>
  );
};

export default BlogLayout;
