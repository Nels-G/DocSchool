import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Identifiant étudiant requis (format: ETD12345)';
    } else if (!/^ETD[0-9]{5}$/.test(formData.studentId)) {
      newErrors.studentId = 'Format incorrect (ETD12345)';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        matricule: formData.studentId,
        password: formData.password
      });

      if (response.data.success) {
        setUserInfo(response.data.user);
        setShowSuccessModal(true);
        
        // Stocker les infos utilisateur (optionnel)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirection après 2 secondes
        setTimeout(() => {
          window.location.href = '/accueil';
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        const errorData = error.response.data;
        setErrorMessage(errorData.error || 'Erreur de connexion');
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        setErrorMessage('Impossible de contacter le serveur');
      } else {
        // Erreur lors de la configuration de la requête
        setErrorMessage('Erreur inattendue');
      }
      
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/reset-password';
  };

  const handleRegister = () => {
    window.location.href = '/signup';
  };

  const closeModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <>
      <div className="LoginForm-form" id="LoginForm">
        <h2 className="LoginForm-login-title">Connexion</h2>
        <p className="LoginForm-login-subtitle">
          Connectez-vous avec votre identifiant étudiant et votre mot de passe
        </p>

        <form onSubmit={handleSubmit}>
          <div className={`LoginForm-form-group ${errors.studentId ? 'LoginForm-error' : ''}`}>
            <label htmlFor="studentId" className="LoginForm-form-label">Identifiant étudiant *</label>
            <input 
              type="text" 
              id="studentId" 
              name="studentId" 
              className="LoginForm-form-input"
              placeholder="Ex: ETD12345" 
              value={formData.studentId}
              onChange={handleInputChange}
              disabled={isLoading}
              required 
            />
            {errors.studentId && <div className="LoginForm-error-message">{errors.studentId}</div>}
          </div>

          <div className={`LoginForm-form-group ${errors.password ? 'LoginForm-error' : ''}`}>
            <label htmlFor="password" className="LoginForm-form-label">Mot de passe *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password" 
                className="LoginForm-form-input"
                placeholder="Votre mot de passe" 
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required 
              />
              <button 
                type="button" 
                className="LoginForm-password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <div className="LoginForm-error-message">{errors.password}</div>}
          </div>

          <button 
            type="submit"
            className="LoginForm-btn LoginForm-btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          <button 
            type="button"
            className="LoginForm-forgot-password" 
            onClick={handleForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        </form>

        <div className="LoginForm-register-link">
          Pas encore de compte ?
          <button onClick={handleRegister}>Créer un compte</button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="LoginForm-modal LoginForm-show">
          <div className="LoginForm-modal-content">
            <div className="LoginForm-modal-icon LoginForm-success">
              <svg viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
            </div>
            <h3 className="LoginForm-modal-title">Connexion réussie !</h3>
            <p className="LoginForm-modal-message">
              Bienvenue {userInfo?.first_name} {userInfo?.last_name} !<br />
              Vous allez être redirigé vers la page d'acceuil.
            </p>
            <div className="LoginForm-modal-buttons">
              <button 
                className="LoginForm-btn-close" 
                onClick={closeModals}
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="LoginForm-modal LoginForm-show">
          <div className="LoginForm-modal-content">
            <div className="LoginForm-modal-icon LoginForm-error">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
            <h3 className="LoginForm-modal-title">Erreur de connexion</h3>
            <p className="LoginForm-modal-message">
              {errorMessage || 'Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer.'}
            </p>
            <div className="LoginForm-modal-buttons">
              <button 
                className="LoginForm-btn-close" 
                onClick={closeModals}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;