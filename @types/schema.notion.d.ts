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
}

export interface BlogPostEntity {
  [key: string]: BlogPost[];
}
