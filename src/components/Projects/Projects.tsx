import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SplicingVariation_Preview from '../../projects/SplicingVariation/assets/SplicingVariation_Preview.png';
import ChimViz_Preview from '../../projects/ChimViz/assets/ChimViz_Preview.png';
import HIVAtlas_Preview from '../../projects/HIV_Atlas/assets/HIV_Atlas_Preview.png';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 'chimViz',
      title: 'HIV-Host Chimeric Transcription Visualization',
      description: 'Visualizing diversity of transcritptional linkages between host and retroviral genomes.',
      image: ChimViz_Preview,
      link: '/projects/ChimViz',
    },
    {
      id: 'splicingVariation',
      title: 'Splicing Variation Visualization',
      description: 'Visualizing transcriptional diversity of complexly-spliced retroviral genomes',
      image: SplicingVariation_Preview,
      link: '/projects/splicingVariation',
    },
    {
      id: 'hivAtlas',
      title: 'HIV-1 Variation Atlas',
      description: 'Visualizing the genetic diversity of HIV-1 genomes',
      image: HIVAtlas_Preview,
      link: 'https://alevar.github.io/HIV_Atlas_WEB',
    },
  ];

  return (
    <Container className="my-5">
      <Row>
        {projects.map((project) => (
          <Col key={project.id} md={6} lg={4} className="mb-4">
            <Link to={project.link} className="text-decoration-none">
              <Card>
                <Card.Img variant="top" src={project.image} alt={`${project.title} Image`} />
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Projects;
