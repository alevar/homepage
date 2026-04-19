import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HIVAtlas_Preview from '../../projects/HIV_Atlas/assets/HIV_Atlas_Preview.png';
import ORFanage_Preview from '../../projects/ORFanage/assets/ORFanage_Preview.png';
import CHESS3 from '../../projects/CHESS3/assets/CHESS3_Preview.png';
import CHESS3_WEB from '../../projects/CHESS3_WEB/assets/CHESS3_WEB_Preview.png';
import TranslocAccountability from '../../projects/TranslocAccountability/assets/TranslocAccountability_Preview.gif';
import DataVisualizationSuite_Preview from '../../projects/DataVisualizationSuite/assets/DataVisualizationSuite_Preview.png';

// Helper component to handle both internal and external links
const ProjectLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const isExternal = to.startsWith('http') || to.startsWith('https') || (to.startsWith('/') && !to.startsWith('/projects') && !to.startsWith('/visualizations'));

  if (isExternal) {
    return (
      <a href={to} className="text-decoration-none w-100">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className="text-decoration-none w-100">
      {children}
    </Link>
  );
};

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    {
      id: 'hivAtlas',
      title: 'HIV-1 Variation Atlas',
      description: 'Comprehensive reference-grade annotation of coding and non-coding regions, alternative splicing and mutational differences in thousands of HIV-1 and SIV genomes.',
      image: HIVAtlas_Preview,
      link: 'https://ccb.jhu.edu/HIV_Atlas',
      tags: ['HIV-1', 'Genetic Variation', 'Atlas', 'Genomics', 'CCB'],
      category: 'Research Tools'
    },
    {
      id: 'dataVisualizationSuite',
      title: 'Data Visualization Suite',
      description: 'A comprehensive collection of interactive visualization tools designed for genomic and bioinformatics data analysis.',
      image: DataVisualizationSuite_Preview,
      link: '/visualizations',
      tags: ['Visualization', 'Data Science', 'D3.js', 'Interactive', 'Bioinformatics'],
      category: 'Visualization Tools'
    },
    {
      id: 'ORFanage',
      title: 'ORFanage - ORF Annotation Tool',
      description: 'Ultra efficient by-reference protein annotation and analysis suite for RNA-seq datasets.',
      image: ORFanage_Preview,
      link: 'https://orfanage.readthedocs.io/en/latest/',
      tags: ['ORF Annotation', 'Genomics', 'Documentation', 'Bioinformatics'],
      category: 'Software Tools'
    },
    {
      id: 'chess3_web',
      title: 'CHESS3 Web Interface',
      description: 'Web-based interface for CHESS3 providing easy access to human transcriptome data.',
      image: CHESS3_WEB,
      link: 'https://alevar.github.io/CHESS3_WEB',
      tags: ['CHESS3', 'Web Interface', 'Transcriptome', 'Human Genomics'],
      category: 'Web Applications'
    },
    {
      id: 'translocAccountability',
      title: 'Transloc Accountability System',
      description: 'Real-time bus tracking system that monitors schedule compliance and automatically notifies transportation teams via Slack when buses miss their schedules.',
      image: TranslocAccountability,
      link: 'https://github.com/alevar/translacc',
      tags: ['Transportation', 'Real-time Tracking', 'Slack Integration', 'Automation'],
      category: 'Automation Tools'
    },
    {
      id: 'chess3',
      title: 'CHESS3 - Comprehensive Human Expressed Sequence Tag Search',
      description: 'First-of-a-kind reference-grade and most comprehensive evidence-based human gene catalogue.',
      image: CHESS3,
      link: 'https://alevar.github.io/CHESS3',
      tags: ['CHESS', 'Human Genomics', 'Genome Anotation'],
      category: 'Research Tools'
    },
  ];

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(projects.map(project => project.category))];

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3">Research Projects & Software Tools</h1>
          <p className="text-center text-muted lead">
            A collection of bioinformatics tools, research projects, and software applications I've developed for genomic data analysis and visualization.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Group controlId="searchBar">
            <Form.Control
              type="text"
              placeholder="Search projects by title, description, tags, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
          
          {/* Category Filter */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            <Badge 
              bg={searchTerm === '' ? 'primary' : 'secondary'} 
              className="px-3 py-2 cursor-pointer"
              onClick={() => setSearchTerm('')}
              style={{ cursor: 'pointer' }}
            >
              All Projects
            </Badge>
            {categories.map(category => (
              <Badge 
                key={category}
                bg={searchTerm.toLowerCase() === category.toLowerCase() ? 'primary' : 'secondary'} 
                className="px-3 py-2 cursor-pointer"
                onClick={() => setSearchTerm(category)}
                style={{ cursor: 'pointer' }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        {filteredProjects.map((project) => (
          <Col key={project.id} md={6} lg={4} className="mb-4 d-flex">
            <ProjectLink to={project.link}>
              <Card className="flex-fill h-100 shadow-sm">
                <Card.Img variant="top" src={project.image} alt={`${project.title} Preview`} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h5">{project.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{project.description}</Card.Text>
                  <div className="mt-auto">
                    <Badge bg="info" className="me-2 mb-2">{project.category}</Badge>
                    <div className="d-flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="small">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge bg="light" text="dark" className="small">
                          +{project.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </ProjectLink>
          </Col>
        ))}
      </Row>

      {filteredProjects.length === 0 && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <h3>No projects found</h3>
              <p className="text-muted">Try adjusting your search terms or browse all projects.</p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Projects;