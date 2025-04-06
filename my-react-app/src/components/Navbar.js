import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './pharmacy-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbars = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);

  const styles = {
    navbar: {
      backgroundColor: '#2d3a3a',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'top 0.3s ease-in-out',
      position: 'sticky',
      top: visible ? '0' : '-100px',
      left: 0,
      width: '100%',
      zIndex: 1000,
      minHeight: '60px',
      maxHeight: '80px',
    },
    navLink: { 
      color: '#f8f7f5',
      padding: '0.5rem 1rem',
    },
    donateButton: {
      backgroundColor: '#d68c45',
      borderColor: '#d68c45',
      color: '#ffffff',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
    },
    brandText: {
      color: '#f8f7f5',
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '1px',
      marginLeft: '0.5rem',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setVisible(false);
      } else if (currentScrollY < prevScrollY) {
        setVisible(true);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && expanded) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [expanded]);

  return (
    <Navbar
      expand="lg"
      style={styles.navbar}
      variant="dark"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      ref={navbarRef}
    >
      <Container className="d-flex align-items-center py-2">
        <Navbar.Brand as={NavLink} to="/" style={styles.navLink}>
          <img
            src={logo}
            alt="Drug Interaction Checker Logo"
            height="25"
            width="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <div className="brand-name d-flex d-lg-none flex-grow-1 justify-content-center">
          <span style={styles.brandText}>Drug Checker</span>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" style={styles.navLink} className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/checker" style={styles.navLink} className="nav-link-custom">
              Drug Checker
            </Nav.Link>
            <Nav.Link as={NavLink} to="/drugs" style={styles.navLink} className="nav-link-custom">
              Drug Database
            </Nav.Link>
            <Nav.Link as={NavLink} to="/interactions" style={styles.navLink} className="nav-link-custom">
              Interactions
            </Nav.Link>
            <Nav.Link as={NavLink} to="/resources" style={styles.navLink} className="nav-link-custom">
              Resources
            </Nav.Link>
            <Nav.Link as={NavLink} to="/faq" style={styles.navLink} className="nav-link-custom">
              FAQ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" style={styles.navLink} className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" style={styles.navLink} className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Button
              as={NavLink}
              to="/donate"
              style={styles.donateButton}
              className="donate-button-custom ms-2"
            >
              Donate Now
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link-custom:hover {
          color: #8cc5bf !important;
          transition: color 0.2s ease;
        }
        .nav-link-custom.active {
          color: #ffffff !important;
          fontWeight: 600;
        }
        .donate-button-custom {
          background-color: #d68c45 !important;
          border-color: #d68c45 !important;
        }
        .donate-button-custom:hover {
          background-color: #b87339 !important;
          border-color: #b87339 !important;
          transform: scale(1.05);
        }
        .brand-name span:hover {
          color: #8cc5bf !important;
          transition: color 0.2s ease;
        }
        @media (max-width: 991px) {
          .navbar-collapse {
            background-color: #2d3a3a;
            position: relative;
            z-index: 999;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default Navbars;