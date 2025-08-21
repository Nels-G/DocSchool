import React from 'react';
import './hero.css';

const Hero = () => {
  return (
    <section className="heroComponent-container">
      <div className="heroComponent-content">
        <div className="heroComponent-textSection">
          <h1 className="heroComponent-title">
            Explore ta <span className="heroComponent-highlight">filière</span> en un clic
          </h1>
          <p className="heroComponent-description">
            Bienvenue ! Accède à des milliers de documents classés par filière,
            partage tes projets de mémoire et collabore avec les autres
            étudiants de ton université.
          </p>
          <div className="heroComponent-searchContainer">
            <input 
              type="text" 
              placeholder="Rechercher un document, une filière ou un projet..." 
              className="heroComponent-searchInput"
            />
            <button className="heroComponent-searchButton">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="heroComponent-imageSection">
          <div className="heroComponent-imageContainer">
            <img 
              src="/person.png" 
              alt="Étudiante avec ordinateur portable et livres" 
              className="heroComponent-image"
            />
            <div className="heroComponent-backgroundElements">
              <div className="heroComponent-circle heroComponent-circle1"></div>
              <div className="heroComponent-circle heroComponent-circle2"></div>
              <div className="heroComponent-gradient heroComponent-gradient1"></div>
              <div className="heroComponent-gradient heroComponent-gradient2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;