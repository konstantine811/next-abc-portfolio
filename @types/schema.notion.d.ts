import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

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

export interface BlockObjectChild {
  children: BlockObjectChildResponse[];
}

export type BlockObjectChildResponse = BlockObjectResponse & BlockObjectChild;

export interface BLogPostPage {
  post: BlockObjectChildResponse[];
  page: BlogPost;
}
