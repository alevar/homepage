// src/utils/contentLoader.ts
import { Post, PostMetadata, PostExtendedMetadata } from '../types/Post';

// Predefined content types with their static glob patterns
export const CONTENT_TYPES = {
  BLOG: {
    contentGlob: '../pages/blog/**/README.md',
    assetGlob: '../pages/blog/**/assets/*'
  },
  COOKING: {
    contentGlob: '../pages/recipes/**/README.md',
    assetGlob: '../pages/recipes/**/assets/*'
  }
} as const;

type ContentType = keyof typeof CONTENT_TYPES;

interface ContentLoaderConfig {
  type: ContentType;
}

// Internal FrontMatter type that maps to our Post interfaces
type FrontMatter = PostMetadata & PostExtendedMetadata;

class ContentLoader {
  private contentFiles: Record<string, string>;
  private assetFiles: Record<string, any>;
  private config: ContentLoaderConfig;

  constructor(config: ContentLoaderConfig) {
    this.config = config;

    // Use static glob patterns directly
    if (this.config.type === 'BLOG') {
      this.contentFiles = import.meta.glob('../pages/blog/**/README.md', {
        eager: true,
        as: 'raw'
      });

      this.assetFiles = import.meta.glob('../pages/blog/**/assets/*', {
        eager: true
      });
    } else if (this.config.type === 'COOKING') {
      this.contentFiles = import.meta.glob('../pages/recipes/**/README.md', {
        eager: true,
        as: 'raw'
      });

      this.assetFiles = import.meta.glob('../pages/recipes/**/assets/*', {
        eager: true
      });
    } else {
      throw new Error(`Unsupported content type: ${this.config.type}`);
    }
  }

  // Remaining methods unchanged
  private parseFrontMatter(content: string): { frontMatter: FrontMatter; content: string } {
    const frontMatterRegex = /---\s*([\s\S]*?)\s*---\s*([\s\S]*)/;
    const matches = content.match(frontMatterRegex);
    
    if (!matches) {
      throw new Error('Invalid front matter format');
    }

    const [, frontMatterYaml, markdown] = matches;
    const frontMatter: Partial<FrontMatter> = {};

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
          (frontMatter as any)[key.trim()] = value;
        }
      }
    });

    // Validate required fields
    if (!frontMatter.title || !frontMatter.date || !frontMatter.summary) {
      throw new Error('Missing required front matter fields');
    }

    return {
      frontMatter: frontMatter as FrontMatter,
      content: markdown.trim()
    };
  }

  private getIdFromPath(filepath: string): string {
    const pathSegments = filepath.split('/');
    return pathSegments[pathSegments.length - 2];
  }

  private getAssetsForContent(contentId: string): Record<string, string> {
    const assets: Record<string, string> = {};
    
    for (const [filepath, module] of Object.entries(this.assetFiles)) {
      if (filepath.includes(`/${contentId}/`)) {
        const filename = filepath.split('/').pop() || '';
        // @ts-ignore: module has default export
        assets[filename] = module.default;
      }
    }

    return assets;
  }

  private processContent(rawContent: string, assets: Record<string, string>): string {
    let processedContent = rawContent;
    Object.entries(assets).forEach(([filename, url]) => {
      processedContent = processedContent
        .replace(`./assets/${filename}`, url)
        .replace(`assets/${filename}`, url);
    });
    return processedContent;
  }

  public getAllContent(): Post[] {
    const items: Post[] = [];

    for (const [filepath, content] of Object.entries(this.contentFiles)) {
      try {
        const { frontMatter, content: rawContent } = this.parseFrontMatter(content);
        const contentId = this.getIdFromPath(filepath);
        const assets = this.getAssetsForContent(contentId);

        items.push({
          ...frontMatter,
          id: contentId,
          content: this.processContent(rawContent, assets)
        });
      } catch (error) {
        console.error(`Error parsing content ${filepath}:`, error);
      }
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getContentById(id: string): Post | undefined {
    return this.getAllContent().find(item => item.id === id);
  }

  public getContentByTag(tag: string): Post[] {
    return this.getAllContent().filter(post => post.tags?.includes(tag));
  }

  public getPublishedContent(): Post[] {
    const now = new Date();
    return this.getAllContent().filter(post => 
      !post.draft && new Date(post.date) <= now
    );
  }

  public getContentByAuthor(author: string): Post[] {
    return this.getAllContent().filter(post => post.author === author);
  }
}

// Factory functions for creating specific loaders
export const createBlogLoader = () => new ContentLoader({
  type: 'BLOG'
});

export const createCookingBlogLoader = () => new ContentLoader({
  type: 'COOKING'
});

export type { ContentLoaderConfig, ContentType };
export { ContentLoader };
