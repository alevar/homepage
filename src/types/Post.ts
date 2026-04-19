export interface Post {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  author?: string;
  tags?: string[];
  draft?: boolean;
  previewImage?: string;
}

export type PostPreview = Omit<Post, 'content'>;