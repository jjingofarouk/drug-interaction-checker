import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './pharmacy-logo.png';
import './Navbar.css';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
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
    <nav
      ref={navbarRef}
      className={`navbar ${visible ? 'visible' : 'hidden'}`}
    >
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
          <span className="brand-text">MediQ</span>
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          ☰
        </button>

        <div className={`navbar-links ${expanded ? 'expanded' : ''}`}>
          {[
            { to: '/', text: 'Home' },
            { to: '/checker', text: 'MediQ' },
            { to: '/drugs', text: 'Drug Database' },
            { to: '/interactions', text: 'Interactions' },
            { to: '/resources', text: 'Resources' },
            { to: '/faq', text: 'FAQ' },
            { to: '/about', text: 'About' },
            { to: '/contact', text: 'Contact' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              {link.text}
            </NavLink>
          ))}

          <NavLink
            to="/donate"
            className="donate-button"
            onClick={() => setExpanded(false)}
          >
            Donate Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;