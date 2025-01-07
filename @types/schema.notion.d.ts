import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export interface Tag {
  color: string;
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  cover: string;
  title: string;
  category: Tag;
  lang: string;
  langLink: string;
  order: number;
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

export type NotionTextColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";
