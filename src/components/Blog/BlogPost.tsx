import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { BlogPost as BlogPostType } from '../../types/BlogPost';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import { getPostById } from '../../utils/blogLoader';

const BlogPost: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<BlogPostType | undefined>();
    
    useEffect(() => {
      if (postId) {
        setPost(getPostById(postId));
      }
    }, [postId]);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Define the components prop with proper typing
  const components: Components = {
    img({ src, alt, ...props }) {
        return <img src={src} alt={alt} {...props} style={{ maxWidth: '100%' }} />;
      },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      
      return isInline ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter style={vscDarkPlus} language={match![1]}>
          {String(children).trim()}
        </SyntaxHighlighter>
      );
    }
  };

  return (
    <Container className="my-5">
      <Link to="/blog" className="text-decoration-none mb-4 d-inline-block">
        ← Back to Blog
      </Link>
      
      <article>
        <header className="mb-4">
          <h1>{post.title}</h1>
          <div className="text-muted mb-2">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </header>

        <ReactMarkdown components={components}>
          {post.content}
        </ReactMarkdown>
      </article>
    </Container>
  );
};

export default BlogPost;