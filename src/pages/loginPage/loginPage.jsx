import React, { useEffect } from 'react';
import './loginPage.css';
import LoginForm from '../../features/auth/components/LoginForm';

const LoginPage = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll('.loginPage-shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        const xPos = x * speed * 5;
        const yPos = y * speed * 5;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="loginPage-container loginPage-show" id="loginPage">
      <div className="loginPage-left-section">
        <div className="loginPage-floating-shapes">
          <div className="loginPage-shape"></div>
          <div className="loginPage-shape"></div>
          <div className="loginPage-shape"></div>
        </div>
        <div className="loginPage-hero-content">
          <h1 className="loginPage-hero-title">DocSchool</h1>
          <p className="loginPage-hero-subtitle">Bienvenue dans votre espace étudiant</p>
          <p className="loginPage-hero-tagline">Connectez-vous pour accéder à vos ressources</p>
        </div>
      </div>

      <div className="loginPage-right-section">
        <div className="loginPage-login-card">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;