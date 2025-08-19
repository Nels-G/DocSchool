import React, { useState } from 'react';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    resetStudentId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    } else if (!/^ETD[0-9]{6}$/.test(formData.resetStudentId)) {
      newErrors.resetStudentId = 'Format incorrect (ETD123456)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setShowInfoModal(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    // Navigate back to login page
    window.location.href = '/login';
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    // Redirect to login page after showing success message
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
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
          Entrez votre identifiant étudiant pour recevoir les instructions de réinitialisation
        </p>

        <div>
          <div className={`ResetPasswordForm-form-group ${errors.resetStudentId ? 'ResetPasswordForm-error' : ''}`}>
            <label htmlFor="resetStudentId" className="ResetPasswordForm-form-label">Identifiant étudiant *</label>
            <input 
              type="text" 
              id="resetStudentId" 
              name="resetStudentId" 
              className="ResetPasswordForm-form-input"
              placeholder="Ex: ETD123456" 
              value={formData.resetStudentId}
              onChange={handleInputChange}
              required 
            />
            {errors.resetStudentId && <div className="ResetPasswordForm-error-message">{errors.resetStudentId}</div>}
          </div>

          <button 
            type="button"
            className="ResetPasswordForm-btn ResetPasswordForm-btn-primary" 
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer les instructions'}
          </button>
        </div>
      </div>

      {/* Info Modal for Password Reset */}
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
              Les instructions de réinitialisation ont été envoyées à l'adresse email associée à votre compte
              étudiant.
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
    </>
  );
};

export default ResetPasswordForm;