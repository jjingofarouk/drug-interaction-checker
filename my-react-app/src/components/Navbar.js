import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './pharmacy-logo.png';

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
          <img
            src={logo}
            alt="Drug Interaction Checker Logo"
            style={{ height: '25px', width: '50px' }}
          />
          <span style={{
            color: '#f8f7f5',
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: '1px',
            marginLeft: '0.5rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            display: window.innerWidth > 991 ? 'inline' : 'none'
          }}>
            Drug Checker
          </span>
        </NavLink>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: window.innerWidth > 991 ? 'none' : 'block',
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#f8f7f5',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>

        <div
          style={{
            display: expanded || window.innerWidth > 991 ? 'flex' : 'none',
            flexDirection: window.innerWidth > 991 ? 'row' : 'column',
            alignItems: 'center',
            marginLeft: 'auto',
            backgroundColor: window.innerWidth <= 991 && expanded ? '#2d3a3a' : 'transparent',
            position: window.innerWidth <= 991 && expanded ? 'absolute' : 'static',
            top: window.innerWidth <= 991 && expanded ? '60px' : 'auto',
            left: 0,
            right: 0,
            zIndex: 999,
            padding: window.innerWidth <= 991 && expanded ? '1rem' : '0',
          }}
        >
          {[
            { to: '/', text: 'Home' },
            { to: '/checker', text: 'Drug Checker' },
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
              style={{
                color: '#f8f7f5',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
              }}
              className={({ isActive }) => 
                `${isActive ? 'active' : ''} nav-link`
              }
              onClick={() => window.innerWidth <= 991 && setExpanded(false)}
            >
              {link.text}
            </NavLink>
          ))}
          
          <NavLink
            to="/donate"
            style={{
              backgroundColor: '#d68c45',
              color: '#ffffff',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: window.innerWidth <= 991 ? '0.5rem 0' : '0 0 0 0.5rem',
            }}
            className="donate-button"
            onClick={() => window.innerWidth <= 991 && setExpanded(false)}
          >
            Donate Now
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
        .donate-button:hover {
          background-color: #b87339;
          transform: scale(1.05);
          transition: all 0.2s ease;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;