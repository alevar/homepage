import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../../types/Post';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import { createBlogLoader } from '../../utils/contentLoader';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      const blogLoader = createBlogLoader();
      const foundPost = blogLoader.getContentById(postId);
      setPost(foundPost);
      setIsLoading(false);
    }
  }, [postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Define markdown components with proper typing
  const components: Components = {
    img({ src, alt, ...props }) {
      return (
        <img 
          src={src} 
          alt={alt} 
          {...props} 
          className="max-w-full h-auto rounded-lg shadow-md my-4"
        />
      );
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      
      return isInline ? (
        <code className="px-1 py-0.5 bg-gray-100 rounded text-sm" {...props}>
          {children}
        </code>
      ) : (
        <div className="my-4 rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            style={vscDarkPlus} 
            language={match![1]}
            customStyle={{ margin: 0 }}
          >
            {String(children).trim()}
          </SyntaxHighlighter>
        </div>
      );
    },
    h2({ children }) {
      return <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>;
    },
    p({ children }) {
      return <p className="mb-4 leading-relaxed">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-gray-200 pl-4 py-2 my-4 italic">
          {children}
        </blockquote>
      );
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blog" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        to="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8"
      >
        ← Back to Blog
      </Link>

      <article className="prose lg:prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <time>{formatDate(post.date)}</time>
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <ReactMarkdown components={components}>
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default BlogPost;