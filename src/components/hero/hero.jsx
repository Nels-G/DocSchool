import React from 'react';
import './hero.css';

const Hero = () => {
  const scrollToBookSection = () => {
    const bookSection = document.querySelector('.bookSectionComponent');
    if (bookSection) {
      bookSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

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
          <div className="heroComponent-buttonContainer">
            <button 
              className="heroComponent-discoverButton"
              onClick={scrollToBookSection}
            >
              <span>Découvrir</span>
              <svg 
                className="heroComponent-buttonIcon" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 4L12 20M12 20L18 14M12 20L6 14" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
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