import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/BlogPost';
import { getAllPosts } from '../../utils/blogLoader';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load all posts
    const loadedPosts = getAllPosts();
    setPosts(loadedPosts);
  }, []);

  // Filter posts based on search term and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Container className="my-5">
      <h1 className="mb-4">Blog</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {filteredPosts.map((post) => (
          <Col key={post.id} md={6} lg={4} className="mb-4">
            <Link to={`/blog/${post.id}`} className="text-decoration-none">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(post.date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>{post.summary}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogList;