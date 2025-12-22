// src/components/Footer.js
import React from 'react';
import logo from './logo.png';
import './Footer.css'; // External CSS for styling

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-column">
          <a href="/" className="footer-logo-link">
            <img src={logo} alt="Fraha Logo" className="footer-logo" />
          </a>
          <p className="footer-tagline">Empowering health through knowledge</p>
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

        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/checker">fraha</a></li>
            <li><a href="/drugs">Drug Database</a></li>
            <li><a href="/interactions">Interactions</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Resources</h3>
          <ul className="footer-links">
            <li><a href="/guides">User Guides</a></li>
            <li><a href="/articles">Articles</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/updates">Updates</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contact Us</h3>
          <address className="footer-address">
            <p><i className="fas fa-map-marker-alt"></i> 456 Pharmacy Lane, Health City</p>
            <p><i className="fas fa-phone"></i> +1 800 555 1234</p>
            <p><i className="fas fa-envelope"></i> <a href="mailto:support@drugchecker.com">support@drugchecker.com</a></p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 fraha. All rights reserved.</p>
        <ul className="footer-policies">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/accessibility">Accessibility</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;