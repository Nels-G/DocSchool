import React from 'react';
import './DocFavorisPage.css';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import DocFavorisComponent from '../../components/DocFavoris/DocFavorisComponent';

const DocFavorisPage = () => {
  return (
    <div className="doc-favoris-page">
      <div className="header-container">
        <Header/>
      </div>
      <div className="main-content">
        <DocFavorisComponent/>
      </div>
      <div className="footer-container">
        <Footer/>
      </div>
    </div>
  );
};

export default DocFavorisPage;