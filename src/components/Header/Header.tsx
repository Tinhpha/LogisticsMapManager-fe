import React from 'react';
import './Header.css';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src={logo} alt="Smartlog Logo" className="logo-image" />
          <span className="logo-text">Smartlog</span>
        </div>
      </div>

      <div className="header-right">
        <nav className="navigation">
          <a href="/about" className="nav-item">About</a>
          <div className="nav-item services-dropdown">
            <span>Services</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          <a href="/contact" className="nav-item">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
