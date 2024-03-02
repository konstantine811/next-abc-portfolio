import NotionService from "@/services/notion-service";
import { unstable_setRequestLocale } from "next-intl/server";
// models
import { BlogPost } from "@/@types/schema.notion";

type Props = {
  params: { locale: string };
};

const BlogPage = async ({ params: { locale } }: Props) => {
  // Enable static rendering
  let posts: BlogPost[] = [];
  unstable_setRequestLocale(locale);
  try {
    const notionService = new NotionService();
    posts = await notionService.getPublishedBlogPosts();
    // console.log("posts", posts);
  } catch (e) {
    console.log(e);
  }
  return (
    <>
      {posts.map((post: BlogPost) => {
        return (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.category.name}</p>
          </div>
        );
      })}
    </>
  );
};

export default BlogPage;
