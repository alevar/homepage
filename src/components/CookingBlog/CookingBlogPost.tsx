import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { Post } from '../../types/Post';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { diffLines } from 'diff';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import { createCookingBlogLoader } from '../../utils/contentLoader';
import { fetchRecipeCommits, fetchRecipeContentAtSha, GitCommit } from '../../utils/githubApi';

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import './CookingBlog.css';

// Utterances Comments Component
const Comments = ({ recipeId }: { recipeId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'alevar/homepage');
    script.setAttribute('issue-term', `Recipe: ${recipeId}`);
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    containerRef.current.appendChild(script);
  }, [recipeId]);

  return <div ref={containerRef} className="utterances-container" />;
};

const CookingBlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | undefined>();
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [selectedCommitIdx, setSelectedCommitIdx] = useState<number>(0);
  const [diffMarkdown, setDiffMarkdown] = useState<string>('');
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isDiffLoading, setIsDiffLoading] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    if (postId) {
      const loader = createCookingBlogLoader();
      const p = loader.getContentById(postId);
      setPost(p);
      if (p) {
        setDiffMarkdown(p.content);
        fetchRecipeCommits(postId).then(data => {
          setCommits(data);
        });
      }
      setIsLoadingMain(false);
    }
  }, [postId]);

  useEffect(() => {
    const handleCommitSwitch = async () => {
      if (!post || commits.length === 0) return;
      setIsDiffLoading(true);

      try {
        const currentSha = commits[selectedCommitIdx].sha;
        const currentContentRaw = await fetchRecipeContentAtSha(post.id, currentSha);
        
        let oldContentRaw = currentContentRaw || '';
        
        // Target diff against previous commit for highlights if we are looking historic or current
        if (selectedCommitIdx < commits.length - 1) {
          const prevSha = commits[selectedCommitIdx + 1].sha;
          const prevContent = await fetchRecipeContentAtSha(post.id, prevSha);
          if (prevContent) oldContentRaw = prevContent;
        }

        const safeCurrentContent = currentContentRaw || post.content;
        
        // Diff Lines
        const differences = diffLines(oldContentRaw, safeCurrentContent);
        
        if (differences.length === 1 && !differences[0].added && !differences[0].removed) {
          setDiffMarkdown(safeCurrentContent);
        } else {
          // If viewing HEAD and it matches previous exactly (or no historic logic needed), just render safe string.
          // Otherwise build highlighted Markdown:
          const highlightedMd = differences.map(part => {
             if (part.added) return `<ins class="diff-ins">${part.value}</ins>`;
             if (part.removed) return `<del class="diff-del">${part.value}</del>`;
             return part.value;
          }).join('');
          
          setDiffMarkdown(highlightedMd);
        }
      } catch (err) {
        console.error(err);
        setDiffMarkdown(post.content);
      } finally {
        setIsDiffLoading(false);
      }
    };

    if (commits.length > 0) {
      handleCommitSwitch();
    }
  }, [selectedCommitIdx, commits, post]);


  const openLightbox = (src: string) => {
    // Dynamically grab all images at the exact moment of click to guarantee DOM state
    const imgElements = document.querySelectorAll('.recipe-content img.recipe-img');
    const newImages = Array.from(imgElements).map((img) => ({
      src: (img as HTMLImageElement).getAttribute('src') || (img as HTMLImageElement).src,
      alt: (img as HTMLImageElement).alt || 'Recipe Image'
    }));
    
    setImages(newImages);
    
    // Find index using endsWith to bypass absolute URL / locahost path comparisons
    const safeSrcMatch = src.split('/').pop() || src;
    const idx = newImages.findIndex((img) => img.src.includes(safeSrcMatch));
    
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    } else if (newImages.length > 0) {
      // Fallback
      setLightboxIndex(0);
      setLightboxOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const components: Components = {
    img({ src, alt, ...props }) {
      // Fix assets resolution locally if they are relative dynamically mapped by ContentLoader
      let finalSrc = src;
      if (post && src && src.includes('assets/')) {
        const urlParts = src.split('/');
        const filename = urlParts[urlParts.length - 1];
        if ((post as any).previewImage?.includes(filename)) {
           finalSrc = (post as any).previewImage;
        }
      }

      return (
        <div className="my-5 text-center">
          <img 
            src={finalSrc} 
            alt={alt} 
            {...props} 
            className="img-fluid recipe-img mx-auto"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
            onClick={() => finalSrc && openLightbox(finalSrc)}
          />
          {alt && <p className="mt-3 text-center small text-muted fst-italic">{alt}</p>}
        </div>
      );
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return isInline ? (
        <code className="px-2 py-1 bg-light text-dark rounded small" {...props}>
          {children}
        </code>
      ) : (
        <div className="my-4 rounded shadow-lg overflow-hidden">
          <SyntaxHighlighter style={vscDarkPlus} language={match![1]} customStyle={{ margin: 0, padding: '1.5rem' }}>
            {String(children).trim()}
          </SyntaxHighlighter>
        </div>
      );
    },
    table({ children }) {
      return (
        <div className="table-responsive my-4 shadow-sm rounded">
          <table className="table table-bordered mb-0">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-light text-uppercase" style={{ fontSize: '0.85rem' }}>{children}</thead>;
    }
  };

  if (isLoadingMain) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5 text-center">
        <h2>Recipe Not Found</h2>
        <Link to="/cooking" className="btn btn-warning mt-3">← Back to Recipes</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* Main Content Area */}
        <Col lg={8}>
          <Link to="/cooking" className="text-warning text-decoration-none fw-medium mb-4 d-inline-block">
            ← Back to Recipes
          </Link>

          <article>
            <header className="recipe-header">
              <h1 className="display-4 recipe-title">{post.title}</h1>
              <div className="recipe-meta mt-3">
                <span className="text-muted"><time>{formatDate(post.date)}</time></span>
                {post.author && <span className="ms-3 fw-bold text-dark">{post.author}</span>}
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3">
                  {post.tags.map(tag => (
                    <Badge key={tag} bg="light" text="dark" className="me-2 px-3 py-2 rounded-pill border">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <div className="recipe-content position-relative">
              {isDiffLoading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center pt-5" style={{ zIndex: 10 }}>
                   <Spinner animation="border" variant="warning" />
                </div>
              )}
              <ReactMarkdown 
                components={components}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {diffMarkdown}
              </ReactMarkdown>
            </div>
          </article>

          {/* GitHub Utterances Integration */}
          {postId && <Comments recipeId={postId} />}

        </Col>

        {/* Sidebar History */}
        <Col lg={3} className="d-none d-lg-block offset-lg-1">
          <div className="sticky-top" style={{ top: '2rem' }}>
            <h5 className="mb-4 text-uppercase fw-bold" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Version History</h5>
            {commits.length === 0 ? (
              <p className="text-muted small">No versions tracked or API limited.</p>
            ) : (
              <div className="commit-timeline shadow-sm">
                {commits.map((commit, idx) => (
                  <div 
                    key={commit.sha} 
                    className={`commit-item ${selectedCommitIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedCommitIdx(idx)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold" style={{ fontSize: '0.85rem' }}>{commit.sha.substring(0, 7)}</span>
                      <span className="text-muted small">{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-muted small text-truncate">
                      {commit.commit.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {commits.length > 0 && (
              <div className="alert alert-light border small text-muted">
                <i className="bi bi-info-circle me-2"></i>
                Select an older commit to compute diffs automatically against its prior iteration. Highlights show added and deleted ingredients!
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        plugins={[Captions, Zoom]}
        captions={{ showToggle: true, descriptionTextAlign: 'center' }}
      />
    </Container>
  );
};

export default CookingBlogPost;