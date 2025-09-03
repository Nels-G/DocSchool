import React, { useState } from 'react';
import './SignupPage.css';
import SignupForm from '../../features/auth/components/SignupForm';

const SignupPage = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSuccess = (formData) => {
    setStudentEmail(formData.email);
    setShowSuccessModal(true);
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(studentEmail).then(() => {
      console.log('Email copié:', studentEmail);
    });
  };

  return (
    <div className="signupPage-container">
      <div className="signupPage-left-section">
        <div className="signupPage-floating-shapes">
          <div className="signupPage-shape"></div>
          <div className="signupPage-shape"></div>
          <div className="signupPage-shape"></div>
        </div>
        <div className="signupPage-hero-content">
          <h1 className="signupPage-hero-title">DocSchool</h1>
          <p className="signupPage-hero-subtitle">Rejoignez notre communauté étudiante</p>
          <p className="signupPage-hero-tagline">Créez votre compte en quelques clics</p>
        </div>
      </div>

      <div className="signupPage-right-section">
        <div className="signupPage-register-card">
          <a href="/" className="signupPage-back-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Retour à l'accueil
          </a>
          <h2 className="signupPage-register-title">Inscription</h2>
          <p className="signupPage-register-subtitle">
            Complétez les informations ci-dessous pour créer votre compte étudiant
          </p>

          <SignupForm onSuccess={handleSuccess} onError={handleError} />

          <div className="signupPage-login-link">
            <p>Déjà inscrit ? <a href="/login">Connectez-vous ici</a></p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="signupPage-modal signupPage-modal-show">
          <div className="signupPage-modal-content">
            <div className="signupPage-modal-icon signupPage-modal-success">
              <svg viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
            </div>
            <h3 className="signupPage-modal-title">Inscription réussie !</h3>
            <p className="signupPage-modal-message">
              Félicitations ! Votre compte a été créé avec succès.<br />
              <strong>Votre identifiant étudiant a été envoyé à :</strong>
            </p>
            <div className="signupPage-student-email">{studentEmail}</div>
            <p className="signupPage-modal-message">
              <strong>Important :</strong> Vérifiez votre boîte mail (et vos spams) pour retrouver 
              votre identifiant étudiant. Vous en aurez besoin pour vous connecter à votre compte.
            </p>
            <div className="signupPage-modal-buttons">
              <button className="signupPage-btn-close" onClick={handleCloseModals}>
                Compris
              </button>
              <button className="signupPage-btn-copy" onClick={handleCopyEmail}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copier l'email
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="signupPage-modal signupPage-modal-show">
          <div className="signupPage-modal-content">
            <div className="signupPage-modal-icon signupPage-modal-error">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </div>
            <h3 className="signupPage-modal-title">Erreur d'inscription</h3>
            <p className="signupPage-modal-message">
              {errorMessage || "Une erreur est survenue lors de l'inscription. Veuillez vérifier vos informations et réessayer."}
            </p>
            <div className="signupPage-modal-buttons">
              <button className="signupPage-btn-close" onClick={handleCloseModals}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;