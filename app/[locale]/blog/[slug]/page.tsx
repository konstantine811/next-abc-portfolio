import PostBlog from "@/components/page-partials/blog/postBlog";
import NotionService from "@/services/notion-service";

const BlogPostIdPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  let data: any = {};
  try {
    const notionService = new NotionService();
    data = await notionService.getSingleBlogPost(slug);
  } catch (e) {
    console.error(e);
  }

  return data ? <PostBlog data={data} /> : "";
};

export default BlogPostIdPage;
