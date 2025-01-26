// src/types/Post.ts

// Base interface for common post metadata
export interface PostMetadata {
  id: string;
  title: string;
  date: string;
  summary: string;
}

// Optional post properties
export interface PostExtendedMetadata {
  author?: string;
  tags?: string[];
  slug?: string;
  draft?: boolean;
  featuredImage?: string;
}

// Complete post interface including content
export interface Post extends PostMetadata, PostExtendedMetadata {
  content: string;
}

// Type for post without content (for list views)
export type PostPreview = Omit<Post, 'content'>;

// Type guard to check if a post has tags
export function hasTag(post: Post, tag: string): boolean {
  return post.tags?.includes(tag) ?? false;
}

// Type guard to check if post is published
export function isPublished(post: Post): boolean {
  return !post.draft && new Date(post.date) <= new Date();
}