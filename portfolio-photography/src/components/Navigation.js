import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-5"
      style={{
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="flex justify-between items-center ph4 ph5-l pv3 mw9 center">
        <div 
          className="f3 fw6 white tracked pointer"
          onClick={() => scrollToSection('home')}
        >
          光影·艺术
        </div>

        <div className="dn flex-ns gap-4">
          {['home', 'gallery', 'about', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="nav-link white f5 bg-transparent bn pointer hover-gray"
            >
              {section === 'home' && '首页'}
              {section === 'gallery' && '作品'}
              {section === 'about' && '关于'}
              {section === 'contact' && '联系'}
            </button>
          ))}
        </div>

        <button
          className="dn-l flex items-center justify-center white bg-transparent bn pointer pa2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w1 h1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w1 h1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="dn-l bg-black-90" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
          {['home', 'gallery', 'about', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="db w-100 tl ph4 pv3 white f5 bg-transparent bn pointer hover-bg-white-10"
            >
              {section === 'home' && '首页'}
              {section === 'gallery' && '作品'}
              {section === 'about' && '关于'}
              {section === 'contact' && '联系'}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
