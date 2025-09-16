import React, { useState } from 'react';
import './ResetPasswordForm.css';
import axios from 'axios';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    resetStudentId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase() // Convertir en majuscules pour le format ETD
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.resetStudentId) {
      newErrors.resetStudentId = 'Identifiant étudiant requis (format: ETD123456)';
    } else if (!/^ETD[0-9]{5}$/.test(formData.resetStudentId)) {
      newErrors.resetStudentId = 'Format incorrect (ETD123456)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/request-password-reset/', {
        matricule: formData.resetStudentId
      });

      if (response.data.success) {
        setShowInfoModal(true);
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      
      let errorMsg = 'Une erreur est survenue. Veuillez réessayer.';
      
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.status === 404) {
        errorMsg = 'Identifiant étudiant non trouvé.';
      } else if (error.response?.status >= 500) {
        errorMsg = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    // Redirect to login page after showing success message
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <>
      <div className="ResetPasswordForm-form ResetPasswordForm-show">
        <div className="ResetPasswordForm-back-btn" onClick={handleBackToLogin}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Retour à la connexion
        </div>

        <h2 className="ResetPasswordForm-login-title">Réinitialiser le mot de passe</h2>
        <p className="ResetPasswordForm-login-subtitle">
          Entrez votre identifiant étudiant pour recevoir les instructions de réinitialisation par email
        </p>

        <form onSubmit={handleSubmit}>
          <div className={`ResetPasswordForm-form-group ${errors.resetStudentId ? 'ResetPasswordForm-error' : ''}`}>
            <label htmlFor="resetStudentId" className="ResetPasswordForm-form-label">
              Identifiant étudiant *
            </label>
            <input 
              type="text" 
              id="resetStudentId" 
              name="resetStudentId" 
              className="ResetPasswordForm-form-input"
              placeholder="Ex: ETD123456" 
              value={formData.resetStudentId}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength={9}
              required 
            />
            {errors.resetStudentId && (
              <div className="ResetPasswordForm-error-message">
                {errors.resetStudentId}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="ResetPasswordForm-btn ResetPasswordForm-btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer les instructions'}
          </button>
        </form>

        <div className="ResetPasswordForm-help-text">
          <p>
            <strong>Note :</strong> Si votre identifiant est correct, vous recevrez un email 
            avec un lien pour réinitialiser votre mot de passe. Vérifiez vos spams si nécessaire.
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showInfoModal && (
        <div className="ResetPasswordForm-modal ResetPasswordForm-show">
          <div className="ResetPasswordForm-modal-content">
            <div className="ResetPasswordForm-modal-icon ResetPasswordForm-info">
              <svg viewBox="0 0 24 24">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </div>
            <h3 className="ResetPasswordForm-modal-title">Instructions envoyées</h3>
            <p className="ResetPasswordForm-modal-message">
              Les instructions de réinitialisation ont été envoyées à l'adresse email 
              associée à votre compte étudiant.
            </p>
            <p className="ResetPasswordForm-modal-message">
              <strong>Vérifiez votre boîte de réception et vos spams.</strong> 
              Le lien expire dans 24 heures.
            </p>
            <div className="ResetPasswordForm-modal-buttons">
              <button 
                className="ResetPasswordForm-btn-close" 
                onClick={handleCloseInfoModal}
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="ResetPasswordForm-modal ResetPasswordForm-show">
          <div className="ResetPasswordForm-modal-content">
            <div className="ResetPasswordForm-modal-icon ResetPasswordForm-error">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
            <h3 className="ResetPasswordForm-modal-title">Erreur</h3>
            <p className="ResetPasswordForm-modal-message">
              {errorMessage}
            </p>
            <div className="ResetPasswordForm-modal-buttons">
              <button 
                className="ResetPasswordForm-btn-close" 
                onClick={handleCloseErrorModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </> // Added the missing closing fragment tag
  );
};

export default ResetPasswordForm;