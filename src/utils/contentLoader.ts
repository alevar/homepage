import { Post } from '../types/Post';

const CONTENT_GLOBS = {
  BLOG: {
    content: import.meta.glob('../pages/blog/**/README.md', { eager: true, as: 'raw' }),
    assets: import.meta.glob('../pages/blog/**/assets/*', { eager: true })
  },
  COOKING: {
    content: import.meta.glob('../pages/recipes/**/README.md', { eager: true, as: 'raw' }),
    assets: import.meta.glob('../pages/recipes/**/assets/*', { eager: true })
  }
} as const;

type ContentType = keyof typeof CONTENT_GLOBS;

class ContentLoader {
  private contentFiles: Record<string, string>;
  private assetFiles: Record<string, any>;

  constructor(type: ContentType) {
    this.contentFiles = CONTENT_GLOBS[type].content;
    this.assetFiles = CONTENT_GLOBS[type].assets;
  }

  private parseFrontMatter(content: string) {
    const match = content.match(/---\s*([\s\S]*?)\s*---\s*([\s\S]*)/);
    if (!match) throw new Error('Invalid front matter format');

    const [, yaml, markdown] = match;
    const frontMatter: Record<string, any> = {};

    yaml.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (!key || !valueParts.length) return;

      const value = valueParts.join(':').trim();
      const trimmedKey = key.trim();

      if (trimmedKey === 'tags') {
        frontMatter.tags = value
          .replace(/[\[\]]/g, '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t);
      } else if (trimmedKey === 'draft') {
        // Parse draft as boolean
        frontMatter.draft = value.toLowerCase() === 'true';
      } else {
        frontMatter[trimmedKey] = value;
      }
    });

    if (!frontMatter.title || !frontMatter.date || !frontMatter.summary) {
      throw new Error('Missing required fields: title, date, or summary');
    }

    return { frontMatter, content: markdown.trim() };
  }

  private getIdFromPath(path: string): string {
    const segments = path.split('/');
    return segments[segments.length - 2];
  }

  private getAssets(contentId: string): Record<string, string> {
    const assets: Record<string, string> = {};
    
    for (const [path, module] of Object.entries(this.assetFiles)) {
      if (path.includes(`/${contentId}/`)) {
        const filename = path.split('/').pop() || '';
        assets[filename] = (module as any).default;
      }
    }

    return assets;
  }

  private getPreviewImage(assets: Record<string, string>): string | undefined {
    // Look for preview.png first, then preview.svg, then any file starting with preview
    const previewFiles = ['preview.png', 'preview.jpg', 'preview.svg'];
    
    for (const filename of previewFiles) {
      if (assets[filename]) {
        return assets[filename];
      }
    }
    
    // Look for any file starting with "preview"
    const previewKey = Object.keys(assets).find(key => key.toLowerCase().startsWith('preview'));
    return previewKey ? assets[previewKey] : undefined;
  }

  private processContent(content: string, assets: Record<string, string>): string {
    let processed = content;
    Object.entries(assets).forEach(([filename, url]) => {
      processed = processed
        .replace(`./assets/${filename}`, url)
        .replace(`assets/${filename}`, url);
    });
    return processed;
  }

  public getAllContent(): Post[] {
    const posts: Post[] = [];

    for (const [path, content] of Object.entries(this.contentFiles)) {
      try {
        const { frontMatter, content: rawContent } = this.parseFrontMatter(content);
        const id = this.getIdFromPath(path);
        const assets = this.getAssets(id);
        const previewImage = this.getPreviewImage(assets);

        posts.push({
          ...frontMatter,
          id,
          content: this.processContent(rawContent, assets),
          previewImage
        } as Post);
      } catch (error) {
        console.error(`Error parsing ${path}:`, error);
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getContentById(id: string): Post | undefined {
    return this.getAllContent().find(post => post.id === id);
  }

  public getPublishedContent(): Post[] {
    const now = new Date();
    return this.getAllContent().filter(post => 
      !post.draft && new Date(post.date) <= now
    );
  }
}

export const createBlogLoader = () => new ContentLoader('BLOG');
export const createCookingBlogLoader = () => new ContentLoader('COOKING');