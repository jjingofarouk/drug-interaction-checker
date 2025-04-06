// src/components/Footer.js
import React from 'react';
import { pharmacyTheme } from './theme'; // Import your existing theme
import logo from './pharmacy-logo.png'; // Adjust path to your logo
import './Footer.css'; // Assuming you’ll create this CSS file

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: pharmacyTheme.primary, // Blue background
      color: pharmacyTheme.cardBackground, // White text
      padding: '2rem 0',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: '0 1rem',
    },
    column: {
      flex: '1',
      minWidth: '200px',
      margin: '1rem 0',
    },
    logo: {
      height: '40px',
      width: '80px',
    },
    tagline: {
      color: pharmacyTheme.cardBackground,
      fontSize: '1rem',
      margin: '0.5rem 0',
    },
    heading: {
      color: pharmacyTheme.cardBackground,
      fontSize: '1.2rem',
      marginBottom: '1rem',
    },
    link: {
      color: pharmacyTheme.cardBackground,
      textDecoration: 'none',
      display: 'block',
      margin: '0.5rem 0',
    },
    bottom: {
      borderTop: `1px solid ${pharmacyTheme.secondary}`, // Green border
      marginTop: '2rem',
      paddingTop: '1rem',
      textAlign: 'center',
    },
    copyright: {
      color: pharmacyTheme.cardBackground,
      fontSize: '0.9rem',
    },
  };

  return (
    <footer style={styles.footer} role="contentinfo">
      <div style={styles.container}>
        <div style={styles.column}>
          <a href="/" style={styles.link}>
            <img src={logo} alt="Drug Interaction Checker Logo" style={styles.logo} />
          </a>
          <p style={styles.tagline}>Empowering health through knowledge</p>
          <div className="social-links">
            <a href="https://facebook.com/drugchecker" aria-label="Facebook" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/drugchecker" aria-label="Twitter" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/drugchecker" aria-label="Instagram" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/company/drugchecker" aria-label="LinkedIn" className="social-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://youtube.com/drugchecker" aria-label="YouTube" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/about" style={styles.link}>About Us</a></li>
            <li><a href="/checker" style={styles.link}>Drug Checker</a></li>
            <li><a href="/drugs" style={styles.link}>Drug Database</a></li>
            <li><a href="/interactions" style={styles.link}>Interactions</a></li>
            <li><a href="/resources" style={styles.link}>Resources</a></li>
            <li><a href="/contact" style={styles.link}>Contact</a></li>
          </ul>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Resources</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/guides" style={styles.link}>User Guides</a></li>
            <li><a href="/articles" style={styles.link}>Articles</a></li>
            <li><a href="/faq" style={styles.link}>FAQs</a></li>
            <li><a href="/updates" style={styles.link}>Updates</a></li>
            <li><a href="/support" style={styles.link}>Support</a></li>
          </ul>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Contact Us</h3>
          <address style={{ color: pharmacyTheme.cardBackground, fontStyle: 'normal' }}>
            <p><i className="fas fa-map-marker-alt"></i> 456 Pharmacy Lane, Health City</p>
            <p><i className="fas fa-phone"></i> +1 800 555 1234</p>
            <p>
              <i className="fas fa-envelope"></i>{' '}
              <a href="mailto:support@drugchecker.com" style={styles.link}>support@drugchecker.com</a>
            </p>
          </address>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={styles.copyright}>© 2025 Drug Interaction Checker. All rights reserved.</p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <li><a href="/privacy" style={styles.link}>Privacy Policy</a></li>
          <li><a href="/terms" style={styles.link}>Terms of Service</a></li>
          <li><a href="/accessibility" style={styles.link}>Accessibility</a></li>
        </ul>
      </div>

      <style jsx>{`
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .social-link {
          color: ${pharmacyTheme.cardBackground};
          font-size: 1.2rem;
          transition: color 0.2s ease;
        }
        .social-link:hover {
          color: ${pharmacyTheme.info};
        }
      `}</style>
    </footer>
  );
};

export default Footer;