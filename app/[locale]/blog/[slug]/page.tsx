import PostBlog from "@/components/page-partials/blog/postBlog";
import NotionService from "@/services/notion-service";

const BlogPostIdPage = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  let data: any = {};
  try {
    const notionService = new NotionService();
    data = await notionService.getSingleBlogPost(slug);
  } catch (e) {
    console.error(e);
  }

  return <PostBlog data={data} />;
};

export default BlogPostIdPage;
