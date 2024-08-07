import { BlogPostEntity } from "@/@types/schema.notion";
import ContentBlog from "@/components/page-partials/blog/contentBlog";
import MainContainer from "@/components/page-partials/common/container";
import { LocaleType } from "@/configs/locale";
import NotionService from "@/services/notion-service";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: { locale: string };
}

const BlogLayout = async ({ children, params: { locale } }: Props) => {
  // Enable static rendering
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
    <MainContainer className="grid grid-cols-12 gap-6 justify-center">
      <ContentBlog data={categoryPosts}>{children}</ContentBlog>
    </MainContainer>
  );
};

export default BlogLayout;
