import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaEnvelope, FaOrcid } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';

import av_photo from '../../assets/av.photo.jpg';
import av_cv from '../../assets/CV.AlesVarabyou.2025.pdf';
import av_resume from '../../assets/Resume.AlesVarabyou.2025.pdf';

const Home: React.FC = () => {
  return (
    <Container>
      {/* Hero Section */}
      <Row className="my-5 justify-content-center text-center">
        <Col md="auto">
          <Image src={av_photo} roundedCircle fluid style={{ width: '150px' }} alt="Ales Varabyou - Genomics Scientist and Engineer; Cooking and Calisthenics Enthusiast" />
        </Col>
        <Col md="auto" className="d-flex flex-column justify-content-center">
          <h1 className="mt-3">Ales Varabyou</h1>
          <h2 className="h4 text-muted mb-3">Genomics Scientist and Engineer; Cooking and Calisthenics Enthusiast</h2>
          <div className="d-flex justify-content-center mt-3 flex-wrap">
            <a
              href="https://www.linkedin.com/in/ales-varabyou-24221886/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 mb-2"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={30} />
            </a>
            <a
              href="https://github.com/alevar"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 mb-2"
              aria-label="GitHub Profile"
            >
              <FaGithub size={30} />
            </a>
            <a
              href="https://scholar.google.com/citations?user=XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 mb-2"
              aria-label="Google Scholar Profile"
            >
              <SiGooglescholar size={30} />
            </a>
            <a
              href="https://orcid.org/0000-0003-1060-7212"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 mb-2"
              aria-label="ORCID Profile"
            >
              <FaOrcid size={30} />
            </a>
            <a href="mailto:ales.varabyou@jhu.edu" className="mx-2 mb-2" aria-label="Email">
              <FaEnvelope size={30} />
            </a>
          </div>
        </Col>
      </Row>

      {/* Main Description */}
      <Row className="my-4 text-center">
        <Col>
          <p className="px-5 lead">
            I'm a scientist specializing in human gene cataloguing and the development of <strong>open-source software</strong> to handle massive datasets efficiently. My work involves building tools in <strong>Rust</strong>, <strong>C++</strong>, <strong>SQL</strong> and <strong>Python</strong> to scale analysis from single samples to tens and hundreds of thousands of samples.
          </p>
          <p className="px-5">
            My research focuses on developing <strong>free and open-source methods</strong> for large-scale comparative genomic analysis, with particular emphasis on leveraging RNA-sequencing data to enhance gene catalogues across species. I've led the development of <strong>TieBrush</strong> for efficient multi-sample RNA-seq processing, <strong>ORFanage</strong> for efficient searching for proteins in RNA-seq datasets and distinguishing functional isoforms from noisy data, and <strong>CHESS 3</strong> - a comprehensive catalogue of human genes and isoforms that identified numerous novel tissue-specific transcripts while improving existing transcript models.
          </p>
          <p className="px-5">
            Beyond human genomics, I've contributed to viral research through <strong>pangenomic analysis of HIV-1</strong> for understanding viral persistence and developed <strong>BoloTie</strong> - the first method capable of detecting recombinant lineages of SARS-CoV-2 genomes from mass sequencing data.
          </p>
        </Col>
      </Row>

      {/* Current Work Section */}
      <Row className="my-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-3">Current Research</h3>
              <p className="mb-3">
                At <strong>Johns Hopkins University</strong>, I work on developing computational tools and methodologies for analyzing large-scale genomic datasets. My research focuses on:
              </p>
              <ul className="mb-3">
                <li>Developing efficient algorithms for processing massive genomic datasets</li>
                <li>Creating interactive visualization tools for complex biological data</li>
                <li>Building open-source software solutions for the bioinformatics community</li>
                <li>Investigating viral evolution and host-pathogen interactions</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="my-4 justify-content-center">
        <Col md="auto">
          <a href={av_cv} download className="btn btn-primary btn-lg me-3">
            Download My CV
          </a>
        </Col>
        <Col md="auto">
          <a href={av_resume} download className="btn btn-primary btn-lg me-3">
            Download My Resume
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
