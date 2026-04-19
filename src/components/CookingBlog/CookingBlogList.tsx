import { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Post } from '../../types/Post';
import { createCookingBlogLoader } from '../../utils/contentLoader';
import ContentCard from '../Common/ContentCard';
import NoResultsCard from '../Common/NoResultsCard';

const CookingBlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loader = createCookingBlogLoader();
    setPosts(loader.getPublishedContent());
  }, []);

  const filteredPosts = posts.filter(post => {
    const search = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.summary.toLowerCase().includes(search) ||
      post.tags?.some(tag => tag.toLowerCase().includes(search)) ||
      post.author?.toLowerCase().includes(search)
    );
  });

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3">Delicious Recipes</h1>
          <p className="text-center text-muted lead">
            A collection of tested recipes and cooking experiments.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredPosts.map((post) => (
            <ContentCard
              key={post.id}
              post={post}
              linkPath="/cooking"
              linkText="Read recipe →"
            />
          ))}
          {filteredPosts.length === 0 && (
            <NoResultsCard
              title="No recipes found"
              message="Try adjusting your search terms"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CookingBlogList;