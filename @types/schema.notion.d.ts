export type Tag = {
  color: string;
  id: string;
  name: string;
};

export type BlogPost = {
  id: number;
  cover: string;
  title: string;
  category: Tag;
};
