import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import logo from '../logo.svg';
import MenuButton from './MenuButton';

function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <MenuButton isOpen={isOpen} onClick={toggleMenu} />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="sidebar-logo" />
              <span className="logo-text">gropoiu</span>
            </div>
            <select 
              className="language-select"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ro">Română</option>
            </select>
          </div>
          
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-button ${location.pathname === '/' ? 'primary' : 'secondary'}`}
            >
              {t.reportPothole}
            </Link>
            <Link 
              to="/view" 
              className={`nav-button ${location.pathname === '/view' ? 'primary' : 'secondary'}`}
            >
              {t.viewReports}
            </Link>
          </div>
        </div>
      </nav>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default Navbar; 