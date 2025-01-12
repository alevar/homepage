// src/utils/blogLoader.ts
import { BlogPost } from '../types/BlogPost';

// Use Vite's import.meta.glob to load all README.md files from post directories
const postFiles = import.meta.glob('../pages/blog/posts/*/README.md', { 
  eager: true,
  as: 'raw'
});

// Load all assets
const assetFiles = import.meta.glob('../pages/blog/posts/*/assets/*', {
  eager: true,
});

interface FrontMatter {
  id: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
}

const parseFrontMatter = (content: string): { frontMatter: FrontMatter; markdown: string } => {
  const frontMatterRegex = /---\s*([\s\S]*?)\s*---\s*([\s\S]*)/;
  const matches = content.match(frontMatterRegex);

  if (!matches) {
    throw new Error('Invalid front matter format');
  }

  const [, frontMatterYaml, markdown] = matches;
  const frontMatter: any = {};
  
  frontMatterYaml.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      if (key.trim() === 'tags') {
        frontMatter.tags = value
          .replace(/[\[\]]/g, '')
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      } else {
        frontMatter[key.trim()] = value;
      }
    }
  });

  return {
    frontMatter: frontMatter as FrontMatter,
    markdown: markdown.trim()
  };
};

// Function to get post ID from file path
const getPostIdFromPath = (filepath: string): string => {
  // Extract the directory name from the path
  const matches = filepath.match(/\/posts\/([^/]+)\/README\.md$/);
  return matches ? matches[1] : '';
};

// Function to get assets for a post
const getPostAssets = (postId: string): Record<string, string> => {
  const assets: Record<string, string> = {};
  
  for (const [filepath, module] of Object.entries(assetFiles)) {
    if (filepath.includes(`/posts/${postId}/assets/`)) {
      const filename = filepath.split('/').pop() || '';
      // @ts-ignore: module has default export
      assets[filename] = module.default;
    }
  }
  
  return assets;
};

export const getAllPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];

  for (const [filepath, content] of Object.entries(postFiles)) {
    try {
      const { frontMatter, markdown } = parseFrontMatter(content);
      const postId = getPostIdFromPath(filepath);
      const assets = getPostAssets(postId);
      
      // Replace asset references in markdown
      let processedMarkdown = markdown;
      Object.entries(assets).forEach(([filename, url]) => {
        // Replace both ./assets/ and assets/ references
        processedMarkdown = processedMarkdown
          .replace(`./assets/${filename}`, url)
          .replace(`assets/${filename}`, url);
      });

      posts.push({
        id: postId,
        title: frontMatter.title,
        date: frontMatter.date,
        summary: frontMatter.summary,
        content: processedMarkdown
      });
    } catch (error) {
      console.error(`Error parsing post ${filepath}:`, error);
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getAllPosts();
  return posts.find(post => post.id === id);
};