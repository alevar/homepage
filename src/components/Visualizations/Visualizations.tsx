import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SplicingVariation_Preview from '../../projects/DataVisualizationSuite/SplicingVariation/assets/SplicingVariation_Preview.png';
import SplicingConservation_Preview from '../../projects/DataVisualizationSuite/SplicingConservation/assets/SplicingConservation_Preview.png';
import ChimViz_Preview from '../../projects/DataVisualizationSuite/ChimViz/assets/ChimViz_Preview.png';
import GenomeViewer_Preview from '../../projects/DataVisualizationSuite/GenomeViewer/assets/GenomeViewer_Preview.png';
import Upset_Preview from '../../projects/DataVisualizationSuite/Upset/assets/Upset_Preview.png';
import SpliceGraph from '../../projects/DataVisualizationSuite/SpliceGraph/assets/SpliceGraph_Preview.png';
import CigarView_Preview from '../../projects/DataVisualizationSuite/CigarView/assets/CigarView_Preview.png';

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

const Visualizations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const tools = [
    {
      id: 'cigarView',
      title: 'CigarView Visualization Tool',
      description: 'Interactive tool visualizing read sequences alongside CIGAR strings in a shared coordinate space for improved genomic alignment analysis.',
      image: CigarView_Preview,
      link: 'https://alevar.github.io/cigarview',
      tags: ['CIGAR Strings', 'DNA Sequence', 'Genomic Alignment', 'Visualization', 'Bioinformatics'],
      category: 'Data Visualization'
    },
    {
      id: 'chimViz',
      title: 'HIV-Host Chimeric Transcription Visualization',
      description: 'Interactive visualization tool for analyzing diversity of transcriptional linkages between host and retroviral genomes.',
      image: ChimViz_Preview,
      link: 'https://alevar.github.io/ChimViz',
      tags: ['HIV Research', 'Data Visualization', 'D3.js', 'Genomics', 'Bioinformatics'],
      category: 'Data Visualization'
    },
    {
      id: 'splicingVariation',
      title: 'Splicing Variation Visualization',
      description: 'Visualization platform for analyzing conservation of donor and acceptor sites in spliced retroviral genomes.',
      image: SplicingVariation_Preview,
      link: 'https://alevar.github.io/SplicingVariationPlot',
      tags: ['Splicing Analysis', 'Retroviral Genomics', 'Interactive Visualization', 'Statistical Analysis'],
      category: 'Data Visualization'
    },
    {
      id: 'splicingConservation',
      title: 'Splicing Conservation Visualization',
      description: 'Visualizing transcriptional diversity of complexly-spliced retroviral genomes.',
      image: SplicingConservation_Preview,
      link: 'https://alevar.github.io/SplicingConservationPlot',
      tags: ['Splicing Conservation', 'Retroviral Genomics', 'Transcriptional Analysis', 'Bioinformatics'],
      category: 'Data Visualization'
    },
    {
      id: 'genomeViewer',
      title: 'Genome Viewer',
      description: 'Interactive genome viewer for generating high-quality images of genome and transcriptome segments.',
      image: GenomeViewer_Preview,
      link: 'https://alevar.github.io/GenomeViewer',
      tags: ['Genome Viewer', 'Transcriptome', 'Visualization', 'Bioinformatics'],
      category: 'Data Visualization'
    },
    {
      id: 'upset',
      title: 'UpSet Plot Visualization',
      description: 'Interactive visualization tool for analyzing intersections of sets using D3.js. Ideal for complex set analysis in genomics and other scientific domains.',
      image: Upset_Preview,
      link: 'https://alevar.github.io/UpsetPlot',
      tags: ['Set Analysis', 'D3.js', 'Interactive Visualization', 'Data Science'],
      category: 'Data Visualization'
    },
    {
      id: 'spliceGraph',
      title: 'Splice Graph Visualization',
      description: 'Visualizing splicing events in RNA-Seq data with interactive graph representations and statistical analysis.',
      image: SpliceGraph,
      link: 'https://alevar.github.io/SpliceGraph',
      tags: ['RNA-Seq', 'Splicing Events', 'Graph Visualization', 'Bioinformatics'],
      category: 'Data Visualization'
    }
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <Link to="/projects" className="btn btn-link text-decoration-none mb-3 px-0 d-flex align-items-center gap-2" style={{ width: 'fit-content' }}>
            <ArrowLeft size={18} /> Back to Projects
          </Link>
          <h1 className="mb-3">Data Visualization Suite</h1>
          <p className="text-muted lead">
            A comprehensive collection of interactive visualization tools designed for genomic and bioinformatics data analysis.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Group controlId="searchBar">
            <Form.Control
              type="text"
              placeholder="Search visualization tools by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {filteredTools.map((tool) => (
          <Col key={tool.id} md={6} lg={4} className="mb-4 d-flex">
            <ProjectLink to={tool.link}>
              <Card className="flex-fill h-100 shadow-sm">
                <Card.Img variant="top" src={tool.image} alt={`${tool.title} Preview`} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h5">{tool.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{tool.description}</Card.Text>
                  <div className="mt-auto">
                    <Badge bg="info" className="me-2 mb-2">{tool.category}</Badge>
                    <div className="d-flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="small">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 3 && (
                        <Badge bg="light" text="dark" className="small">
                          +{tool.tags.length - 3} more
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

      {filteredTools.length === 0 && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <h3>No tools found</h3>
              <p className="text-muted">Try adjusting your search terms.</p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Visualizations;
