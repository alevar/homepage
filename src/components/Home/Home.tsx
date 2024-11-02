import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

import av_photo from '../../assets/av.photo.jpg';
import av_cv from '../../assets/CV.AlesVarabyou.2024.pdf';

const Home: React.FC = () => {
  return (
    <Container>
      <Row className="my-5 justify-content-center text-center">
        <Col md="auto">
          <Image src={av_photo} roundedCircle fluid style={{ width: '150px' }} alt="AlesPhoto" />
        </Col>
        <Col md="auto" className="d-flex flex-column justify-content-center">
          <h1 className="mt-3">Ales Varabyou</h1>
          <div className="d-flex justify-content-center mt-3">
            <a href="https://www.linkedin.com/in/ales-varabyou-24221886/" target="_blank" rel="noopener noreferrer" className="mx-2">
              <FaLinkedin size={30} />
            </a>
            <a href="https://github.com/alevar" target="_blank" rel="noopener noreferrer" className="mx-2">
              <FaGithub size={30} />
            </a>
            <a href="mailto:ales.varabyou@jhu.edu" className="mx-2">
              <FaEnvelope size={30} />
            </a>
          </div>
        </Col>
      </Row>
      <Row className="my-4 text-center">
        <Col>
          <p className="px-5">
            I’m a researcher specializing in human gene cataloguing and the development of open-source software to handle massive datasets efficiently. My work involves building tools in Rust, C++, and Python to support scalable and innovative analysis, with a focus on creating unique, interactive visualizations that bring complex data to life. I’m passionate about uncovering new insights into human pathogens, particularly HIV and SARS-CoV-2, using large-scale genomic data to deepen our understanding and drive impactful discoveries in the field.
          </p>
        </Col>
      </Row>
      <Row className="my-4 justify-content-center">
        <Col md="auto">
          <a href={av_cv} download className="btn btn-primary">
            Download My CV
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
