import React, { useState, useEffect } from 'react';
import './LoadingPage.css';
import LoadingComponent from '../../components/loading/loadingComponent';

const LoadingPage = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setTimeout(() => {
      setShowOnboarding(true);
      document.body.style.overflow = 'auto';
    }, 800);
  };

  const handleButtonClick = (buttonType, event) => {
    event.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      event.target.style.transform = 'translateY(-3px)';
      if (buttonType === 'login') {
        console.log('Redirection vers la page de connexion');
        // la logique de redirection
      } else if (buttonType === 'register') {
        console.log('Redirection vers la page d\'inscription');
        // la logique de redirection
      }
    }, 150);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll('.shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        const xPos = x * speed * 5;
        const yPos = y * speed * 5;
        shape.style.transform += ` translate(${xPos}px, ${yPos}px)`;
      });
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const shapes = document.querySelectorAll('.shape');
      const x = touch.clientX / window.innerWidth;
      const y = touch.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.15;
        const xPos = x * speed * 3;
        const yPos = y * speed * 3;
        shape.style.transform += ` translate(${xPos}px, ${yPos}px)`;
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    if (showOnboarding) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchstart', handleTouchStart);
      document.documentElement.style.scrollBehavior = 'smooth';
      
      document.querySelectorAll('.feature-item, .stat-item').forEach(el => {
        observer.observe(el);
      });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      observer.disconnect();
    };
  }, [showOnboarding]);

  return (
    <>
      {showLoading && (
        <LoadingComponent
          onComplete={handleLoadingComplete}
          duration={3000}
        />
      )}

      {showOnboarding && (
        <div className="onboarding-container show">
          <div className="left-section">
            <div className="floating-shapes">
              <div className="shape"></div>
              <div className="shape"></div>
              <div className="shape"></div>
            </div>
            <div className="hero-content">
              <h1 className="hero-title">StudyHub</h1>
              <p className="hero-subtitle">Votre plateforme de partage collaborative</p>
              <p className="hero-tagline">L'excellence académique à portée de clic</p>
              
              <div className="features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <div className="feature-text">Documents<br/>par filière</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                  </div>
                  <div className="feature-text">Projets de<br/>mémoire</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-1c-.83 0-1.5.67-1.5 1.5v6h-2v-6c0-.83-.67-1.5-1.5-1.5h-1c-.83 0-1.5.67-1.5 1.5v6H8v-6c0-.83-.67-1.5-1.5-1.5h-1C4.67 7.5 4 8.17 4 9v6H1.5L4.04 22.37c.15.44.56.63 1.01.63H18.5c.83 0 1.5-.67 1.5-1.5zm-8-12c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/>
                    </svg>
                  </div>
                  <div className="feature-text">Partage<br/>collaboratif</div>
                </div>
              </div>

              <div className="stats-section">
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Documents</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Étudiants</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Filières</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="right-section">
            <div className="welcome-card">
              <h2 className="welcome-title">Bienvenue !</h2>
              <p className="welcome-description">
                Accédez à des milliers de documents classés par filière, partagez vos projets de mémoire et collaborez avec d'autres étudiants de votre université.
              </p>
              <div className="action-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={(e) => handleButtonClick('login', e)}
                >
                  Se connecter
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={(e) => handleButtonClick('register', e)}
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingPage;