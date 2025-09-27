import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footerComponent-container">
      <div className="footerComponent-content">
        <div className="footerComponent-brand">
          <h2 className="footerComponent-logo">DcoSchool</h2>
        </div>
        
        <div className="footerComponent-center">
          <p className="footerComponent-text">
            © 2025 DcoSchool - Tous droits réservés
          </p>
        </div>
        
        <div className="footerComponent-support">
          <a 
            href="https://nelsongalley.vercel.app/" 
            className="footerComponent-support-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Signaler un problème
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;