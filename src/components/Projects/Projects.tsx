import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SplicingVariation_Preview from '../../projects/SplicingVariation/assets/SplicingVariation_Preview.png';
import ChimViz_Preview from '../../projects/ChimViz/assets/ChimViz_Preview.png';
import HIVAtlas_Preview from '../../projects/HIV_Atlas/assets/HIV_Atlas_Preview.png';
import ORFanage_Preview from '../../projects/ORFanage/assets/ORFanage_Preview.png';
import Upset_Preview from '../../projects/UpSet/assets/UpSet_Preview.png';
import CHESS3 from '../../projects/CHESS3/assets/CHESS3_Preview.png';
import CHESS3_WEB from '../../projects/CHESS3_WEB/assets/CHESS3_WEB_Preview.png';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
      link: 'https://alevar.github.io/SplicingVariationPlot',
    },
    {
      id: 'hivAtlas',
      title: 'HIV-1 Variation Atlas',
      description: 'Visualizing the genetic diversity of HIV-1 genomes',
      image: HIVAtlas_Preview,
      link: 'https://ccb.jhu.edu/HIV_Atlas',
    },
    {
      id: 'ORFanage',
      title: 'ORFanage',
      description: 'By-Reference ORF Annotation',
      image: ORFanage_Preview,
      link: 'https://orfanage.readthedocs.io/en/latest/',
    },
    {
      id: 'upset',
      title: 'UpSet Plot',
      description: 'Interactive Intersections of Sets in D3 ',
      image: Upset_Preview,
      link: 'https://alevar.github.io/UpSetPlot',
    },
    {
      id: 'chess3_web',
      title: 'CHESS3 Web',
      description: 'Web Interface for CHESS3',
      image: CHESS3_WEB,
      link: 'https://alevar.github.io/CHESS3_WEB',
    },
    {
      id: 'chess3',
      title: 'CHESS3',
      description: 'Comprehensive Human Expressed Sequence Tag Search',
      image: CHESS3,
      link: 'https://alevar.github.io/CHESS3',
    },
  ];

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="my-5">
      <Form className="mb-4">
        <Form.Group controlId="searchBar">
          <Form.Control
            type="text"
            placeholder="Search Projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Row>
        {filteredProjects.map((project) => (
          <Col key={project.id} md={6} lg={4} className="mb-4 d-flex">
            <Link to={project.link} className="text-decoration-none w-100">
              <Card className="flex-fill">
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