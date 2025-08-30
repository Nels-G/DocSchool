import React, { useState } from 'react';
import './NiveauAdd.css';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const NiveauAdd = ({ onClose, onAddNiveau }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['code', 'nom'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newNiveau = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        nom: formData.nom.trim(),
        description: formData.description.trim()
      };
      
      await onAddNiveau(newNiveau);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du niveau:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      <div className="NiveauAdd-overlay" onClick={handleClose}>
        <div className="NiveauAdd-container" onClick={(e) => e.stopPropagation()}>
          <div className="NiveauAdd-header">
            <h2 className="NiveauAdd-title">Ajouter un nouveau niveau</h2>
            <button 
              className="NiveauAdd-close-button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <FaTimes className="NiveauAdd-close-icon" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="NiveauAdd-form">
            <div className="NiveauAdd-form-group">
              <label className="NiveauAdd-label">
                Code <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="NiveauAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: L1, M2, etc."
                maxLength="10"
              />
              <small className="NiveauAdd-help-text">
                Code court pour identifier le niveau (automatiquement en majuscules)
              </small>
            </div>

            <div className="NiveauAdd-form-group">
              <label className="NiveauAdd-label">
                Nom complet <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="NiveauAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: Licence 1 (L1), Master 2 (M2)"
              />
            </div>

            <div className="NiveauAdd-form-group">
              <label className="NiveauAdd-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="NiveauAdd-textarea"
                rows="3"
                disabled={isSubmitting}
                placeholder="Description du niveau (optionnel)"
              />
            </div>

            <div className="NiveauAdd-actions">
              <button 
                type="button" 
                className="NiveauAdd-cancel-button" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="NiveauAdd-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Messages de feedback */}
      {showSuccess && (
        <div className="NiveauAdd-success-message">
          <FaCheck className="NiveauAdd-success-icon" />
          Niveau ajouté avec succès !
        </div>
      )}
      {showError && (
        <div className="NiveauAdd-error-message">
          <FaExclamationTriangle className="NiveauAdd-success-icon" />
          Erreur : Veuillez remplir tous les champs obligatoires
        </div>
      )}
    </>
  );
};

export default NiveauAdd;