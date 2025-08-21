import React, { useEffect } from 'react';
import './resetPasswordPage.css';
import ResetPasswordForm from '../../features/auth/components/ResetPasswordForm';

const ResetPasswordPage = () => {
  useEffect(() => {
    // Enhanced mouse movement effect
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll('.resetPasswordPage-shape');
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
    <div className="resetPasswordPage-container resetPasswordPage-show" id="resetPasswordPage">
      <div className="resetPasswordPage-left-section">
        <div className="resetPasswordPage-floating-shapes">
          <div className="resetPasswordPage-shape"></div>
          <div className="resetPasswordPage-shape"></div>
          <div className="resetPasswordPage-shape"></div>
        </div>
        <div className="resetPasswordPage-hero-content">
          <h1 className="resetPasswordPage-hero-title">DocSchool</h1>
          <p className="resetPasswordPage-hero-subtitle">Réinitialisez votre mot de passe</p>
          <p className="resetPasswordPage-hero-tagline">Récupérez l'accès à votre compte étudiant</p>
        </div>
      </div>

      <div className="resetPasswordPage-right-section">
        <div className="resetPasswordPage-reset-card">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;