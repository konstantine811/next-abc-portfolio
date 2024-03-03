import { BlogPostEntity } from "@/@types/schema.notion";
import ContentBlog from "@/components/page-partials/blog/contentBlog";
import MainContainer from "@/components/page-partials/common/container";
import NotionService from "@/services/notion-service";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const BlogLayout = async ({ children }: Props) => {
  // Enable static rendering
  let categoryPosts: BlogPostEntity = {};
  try {
    const notionService = new NotionService();
    categoryPosts = await notionService.getPublishedBlogPosts();
  } catch (e) {
    console.error(e);
  }
  return (
    <MainContainer className="grid grid-cols-12 gap-6">
      <ContentBlog data={categoryPosts}>{children}</ContentBlog>
    </MainContainer>
  );
};

export default BlogLayout;
