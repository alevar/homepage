import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../../types/Post';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import { createCookingBlogLoader } from '../../utils/contentLoader';

// CookingBlogPost Component
const CookingBlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      const cookingBlogLoader = createCookingBlogLoader();
      const foundPost = cookingBlogLoader.getContentById(postId);
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

  const components: Components = {
    img({ src, alt, ...props }) {
      return (
        <div className="my-8">
          <img 
            src={src} 
            alt={alt} 
            {...props} 
            className="w-full max-w-3xl h-auto rounded-xl shadow-lg mx-auto
                     object-cover object-center"
            style={{ maxHeight: '600px' }}
          />
          {alt && (
            <p className="mt-2 text-center text-sm text-gray-500">{alt}</p>
          )}
        </div>
      );
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      
      return isInline ? (
        <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      ) : (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg">
          <SyntaxHighlighter 
            style={vscDarkPlus} 
            language={match![1]}
            customStyle={{ margin: 0, padding: '1.5rem' }}
          >
            {String(children).trim()}
          </SyntaxHighlighter>
        </div>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          {children}
        </h3>
      );
    },
    p({ children }) {
      return (
        <p className="text-gray-700 leading-relaxed mb-6">
          {children}
        </p>
      );
    },
    ul({ children }) {
      return (
        <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-gray-700">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-gray-700">
          {children}
        </ol>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-orange-500 pl-6 py-4 my-8 
                              bg-orange-50 rounded-r-lg italic text-gray-700">
          {children}
        </blockquote>
      );
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center bg-white rounded-2xl shadow-sm p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
            <p className="text-gray-600 mb-8">
              The recipe you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/cooking" 
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white 
                       rounded-xl hover:bg-orange-700 transition duration-200"
            >
              ← Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/cooking" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 
                   font-medium mb-8 transition duration-200"
        >
          ← Back to Recipes
        </Link>

        <article className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
          <header className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
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
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-sm bg-orange-50 text-orange-700 
                             rounded-full border border-orange-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={components}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CookingBlogPost;