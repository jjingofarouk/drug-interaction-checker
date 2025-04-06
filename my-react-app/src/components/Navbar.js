import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { pharmacyTheme } from './theme'; // Import theme from your existing code
import 'bootstrap/dist/css/bootstrap.min.css';

// Placeholder logo (replace with your actual logo path if available)
import logo from './pharmacy-logo.png'; // Assuming a placeholder logo

const Navbars = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);

  const styles = {
    navbar: {
      backgroundColor: pharmacyTheme.primary, // Blue from your theme
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'top 0.3s ease-in-out',
      position: 'sticky',
      top: visible ? '0' : '-100px',
      left: 0,
      width: '100%',
      zIndex: 1000,
    },
    navLink: { color: pharmacyTheme.cardBackground }, // White text
    actionButton: {
      backgroundColor: pharmacyTheme.secondary, // Green for health/safety
      borderColor: pharmacyTheme.secondary,
      color: '#ffffff',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
    },
    brandText: {
      color: pharmacyTheme.cardBackground,
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '1px',
      marginLeft: '0.5rem',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
  };

  // Scroll effect to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setVisible(false); // Hide on scroll down
      } else if (currentScrollY < prevScrollY) {
        setVisible(true); // Show on scroll up
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Close navbar on outside click or Escape key
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
      <Container className="d-flex align-items-center">
        <Navbar.Brand as={NavLink} to="/" style={styles.navLink}>
          <img
            src={logo} // Replace with your actual logo path
            alt="Pharmacy Checker Logo"
            height="25"
            width="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Brand Name - Visible on mobile only */}
        <div className="brand-name d-flex d-lg-none flex-grow-1 justify-content-center">
          <span style={styles.brandText}>Drug Interaction Checker</span>
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
              Drug List
            </Nav.Link>
            <Nav.Link as={NavLink} to="/interactions" style={styles.navLink} className="nav-link-custom">
              Interactions
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" style={styles.navLink} className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/resources" style={styles.navLink} className="nav-link-custom">
              Resources
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" style={styles.navLink} className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Button
              as={NavLink}
              to="/save"
              style={styles.actionButton}
              className="action-button-custom ms-2"
            >
              Save Results
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link-custom:hover {
          color: ${pharmacyTheme.info} !important; // Teal for hover
          transition: color 0.2s ease;
        }
        .nav-link-custom.active {
          color: ${pharmacyTheme.cardBackground} !important;
          fontWeight: 600;
        }
        .action-button-custom {
          background-color: ${pharmacyTheme.secondary} !important;
          border-color: ${pharmacyTheme.secondary} !important;
        }
        .action-button-custom:hover {
          background-color: #218838 !important; // Darker green on hover
          border-color: #218838 !important;
          transform: scale(1.05);
        }
        .brand-name span:hover {
          color: ${pharmacyTheme.info} !important;
          transition: color 0.2s ease;
        }
      `}</style>
    </Navbar>
  );
};

export default Navbars;