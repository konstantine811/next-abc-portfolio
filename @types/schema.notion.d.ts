export interface Tag {
  color: string;
  id: string;
  name: string;
}

export interface BlogPost {
  id: number;
  cover: string;
  title: string;
  category: Tag;
  langId: string;
}

export interface PostPage {
  post: BlogPost;
  markdown: string;
}

export interface BlogPostEntity {
  [key: string]: BlogPost[];
}

export interface BLogPostPage {
  post: BlockObjectResponse[];
  page: BlogPost;
}
