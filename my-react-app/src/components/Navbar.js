import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './pharmacy-logo.png';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const navbarRef = useRef(null);

  // Handle resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handling with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > prevScrollY && currentScrollY > 50) {
          setVisible(false);
        } else if (currentScrollY < prevScrollY) {
          setVisible(true);
        }
        setPrevScrollY(currentScrollY);
      }, 100); // Debounce delay
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Click outside and keyboard handling
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

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/checker', text: 'Drug Checker' },
    { to: '/drugs', text: 'Drug Database' },
    { to: '/interactions', text: 'Interactions' },
    { to: '/resources', text: 'Resources' },
    { to: '/support', text: 'Support' },
    { to: '/about', text: 'About' },
    { to: '/contact', text: 'Contact' },
  ];

  return (
    <nav
      ref={navbarRef}
      style={{
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
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
      }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logo} alt="Drug Interaction Checker Logo" style={{ height: '25px', width: '50px' }} />
          <span style={{
            color: '#f8f7f5',
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: '1px',
            marginLeft: '0.5rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            display: isMobile ? 'none' : 'inline',
          }}>
            Drug Checker
          </span>
        </NavLink>

        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="nav-menu"
          style={{
            display: isMobile ? 'block' : 'none',
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#f8f7f5',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ☰
        </button>

        <div
          id="nav-menu"
          style={{
            display: expanded || !isMobile ? 'flex' : 'none',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            marginLeft: 'auto',
            backgroundColor: isMobile && expanded ? '#2d3a3a' : 'transparent',
            position: isMobile && expanded ? 'absolute' : 'static',
            top: isMobile && expanded ? '60px' : 'auto',
            left: 0,
            right: 0,
            zIndex: 999,
            padding: isMobile && expanded ? '1rem' : '0',
            transition: isMobile ? 'opacity 0.3s ease' : 'none',
            opacity: isMobile && expanded ? 1 : 0,
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={{
                color: '#f8f7f5',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
              }}
              className={({ isActive }) => `${isActive ? 'active' : ''} nav-link`}
              onClick={() => isMobile && setExpanded(false)}
            >
              {link.text}
            </NavLink>
          ))}
          <NavLink
            to="/emergency"
            style={{
              backgroundColor: '#d9534f',
              color: '#ffffff',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: isMobile ? '0.5rem 0' : '0 0 0 0.5rem',
            }}
            className="emergency-button"
            onClick={() => isMobile && setExpanded(false)}
          >
            Emergency
          </NavLink>
        </div>
      </div>

      <style jsx>{`
        .nav-link:hover {
          color: #8cc5bf;
          transition: color 0.2s ease;
        }
        .nav-link.active {
          color: #ffffff;
          fontWeight: 600;
        }
        .nav-link:focus {
          outline: 2px solid #8cc5bf;
          outline-offset: 2px;
        }
        .emergency-button:hover {
          background-color: #c9302c;
          transform: scale(1.05);
          transition: all 0.2s ease;
        }
        button:focus {
          outline: 2px solid #8cc5bf;
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;