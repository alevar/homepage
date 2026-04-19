import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import jhu_logo from '../../assets/university.shield.blue.svg';
import som_logo from '../../assets/medicine.shield.blue.svg';
import sph_logo from '../../assets/bloomberg.shield.blue.svg';

const Footer: React.FC = () => {
    return (
        <div className="bg-light border-top">
            <footer className="footer mt-auto py-3">
                <Container>
                    <Row className="align-items-center">
                        <Col md={2} className="d-flex justify-content-start">
                            <Nav.Link href="https://engineering.jhu.edu/">
                                <img src={jhu_logo} alt="JHU Logo" style={{ height: '40px' }} />
                            </Nav.Link>
                        </Col>

                        <Col md={2}>
                            <span className="text-muted">CCB &copy; {new Date().getFullYear()}</span>
                        </Col>

                        <Col md={4} className="d-flex justify-content-center">
                            <ul className="nav">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link px-2 text-body-secondary">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/contact" className="nav-link px-2 text-body-secondary">Contact Us</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/about" className="nav-link px-2 text-body-secondary">About</Link>
                                </li>
                            </ul>
                        </Col>

                        <Col md={2} className="d-flex justify-content-end">
                            <Nav.Link href="https://www.hopkinsmedicine.org/som/">
                                <img src={som_logo} alt="SOM Logo" style={{ height: '40px' }} />
                            </Nav.Link>
                        </Col>

                        <Col md={2} className="d-flex justify-content-end">
                            <Nav.Link href="https://publichealth.jhu.edu/">
                                <img src={sph_logo} alt="SPH Logo" style={{ height: '40px' }} />
                            </Nav.Link>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default Footer;
