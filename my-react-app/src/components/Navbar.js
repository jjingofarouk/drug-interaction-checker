import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/checker', label: 'Drug Checker' },
    { path: '/drugs', label: 'Drug Database' },
    { path: '/interactions', label: 'Interactions' },
    { path: '/resources', label: 'Resources' },
    { path: '/faq', label: 'FAQ' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

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
      className={`sticky top-0 z-50 bg-[#2d3a3a] shadow-md transition-all duration-300 w-full min-h-[60px] max-h-[80px] ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and brand section */}
        <div className="flex items-center">
          <a href="/" className="flex items-center text-[#f8f7f5] hover:text-[#8cc5bf] transition-colors duration-200">
            {/* Placeholder for logo - round icon */}
            <div className="w-[50px] h-[25px] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#8cc5bf] flex items-center justify-center">
                <span className="text-xs font-bold text-[#2d3a3a]">Rx</span>
              </div>
            </div>
          </a>
        </div>

        {/* Mobile brand name */}
        <div className="flex lg:hidden justify-center flex-grow">
          <span className="text-[#f8f7f5] text-lg font-bold tracking-wider shadow-sm hover:text-[#8cc5bf] transition-colors duration-200">
            Drug Checker
          </span>
        </div>

        {/* Hamburger button for mobile */}
        <button 
          className="lg:hidden flex items-center text-[#f8f7f5] focus:outline-none" 
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation links and donate button - desktop */}
        <div className={`lg:flex flex-grow items-center ${expanded ? 'absolute top-full left-0 right-0 bg-[#2d3a3a] shadow-md' : 'hidden'}`}>
          <div className="lg:flex-grow">
            <ul className={`lg:flex ${expanded ? 'flex flex-col' : 'hidden'}`}>
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.path} 
                    className="block py-2 px-4 text-[#f8f7f5] hover:text-[#8cc5bf] transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:flex items-center justify-end py-2 lg:py-0">
            <a 
              href="/donate" 
              className="inline-block px-4 py-2 bg-[#d68c45] text-white font-semibold rounded hover:bg-[#b87339] hover:scale-105 transition-all duration-200"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;