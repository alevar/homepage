import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '../../types/Post';

interface ContentCardProps {
  post: Post;
  linkPath: string;
  linkText: string;
}

const ContentCard = ({ post, linkPath, linkText }: ContentCardProps) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const imagePath = post.previewImage;

  return (
    <Card className="mb-4 shadow-sm overflow-hidden">
      <Card.Body className="p-0">
        <Row className="g-0">
          <Col md={imagePath ? 8 : 12} className="p-4" style={{ 
            position: 'relative',
            background: 'white'
          }}>
            <Card.Title as="h2" className="h4">
              <Link to={`${linkPath}/${post.id}`} className="text-decoration-none text-dark">
                {post.title}
              </Link>
            </Card.Title>
            
            <div className="text-muted small mb-3">
              <time>{formatDate(post.date)}</time>
              {post.author && <span className="ms-2">• {post.author}</span>}
            </div>

            <Card.Text className="text-muted">{post.summary}</Card.Text>

            {post.tags && post.tags.length > 0 && (
              <div className="mb-3">
                {post.tags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Link to={`${linkPath}/${post.id}`} className="text-primary text-decoration-none">
              {linkText}
            </Link>
          </Col>
          
          {imagePath && (
            <Col md={4} className="d-none d-md-block p-0">
              <div style={{ textAlign: 'right' }}>
                <img 
                  src={imagePath} 
                  alt={`${post.title} preview`}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    maxWidth: '100%'
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContentCard;