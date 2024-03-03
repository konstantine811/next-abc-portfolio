const BlogPostIdPage = ({ params }: { params: { slug: string } }) => {
  return <div>blog post {params.slug}</div>;
};

export default BlogPostIdPage;
