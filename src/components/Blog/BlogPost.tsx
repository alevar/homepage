import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { Post } from '../../types/Post';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
          className="img-fluid rounded shadow my-4"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      );
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      
      return isInline ? (
        <code className="px-1 py-1 bg-light rounded small" {...props}>
          {children}
        </code>
      ) : (
        <div className="my-4 rounded overflow-hidden">
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
      return <h2 className="h2 mt-5 mb-3">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="h3 mt-4 mb-2">{children}</h3>;
    },
    p({ children }) {
      return <p className="mb-3">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-unstyled mb-3">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="mb-3">{children}</ol>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-start border-3 ps-3 py-2 my-3 fst-italic">
          {children}
        </blockquote>
      );
    },
    table({ children }) {
      return (
        <div className="table-responsive my-4">
          <table className="table table-striped table-bordered">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="table-light">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody>{children}</tbody>;
    },
    tr({ children }) {
      return <tr>{children}</tr>;
    },
    th({ children }) {
      return <th className="px-3 py-2">{children}</th>;
    },
    td({ children }) {
      return <td className="px-3 py-2">{children}</td>;
    },
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="text-center">
              <h2 className="h2 text-dark mb-2">Post Not Found</h2>
              <p className="text-muted mb-4">The post you're looking for doesn't exist or has been removed.</p>
              <Link 
                to="/blog" 
                className="text-primary text-decoration-none fw-medium"
              >
                ← Back to Blog
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Link 
            to="/blog" 
            className="text-primary text-decoration-none fw-medium mb-4 d-inline-block"
          >
            ← Back to Blog
          </Link>

          <article>
            <header className="mb-5">
              <h1 className="display-4 fw-bold mb-3">{post.title}</h1>
              
              <div className="text-muted small mb-3">
                <time>{formatDate(post.date)}</time>
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-3">
                  {post.tags.map(tag => (
                    <Badge 
                      key={tag}
                      bg="secondary"
                      className="me-2"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <div className="blog-content">
              <ReactMarkdown 
                components={components}
                remarkPlugins={[remarkGfm]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPost;