import React, { useState } from 'react';
import './FiliereAdd.css';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const FiliereAdd = ({ onClose, onAddFiliere }) => {
  const [formData, setFormData] = useState({
    code: '',
    abbreviation: '',
    nom: '',
    niveau: '',
    description: '',
    specialite: '',
    couleur: '#3B82F6'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['code', 'abbreviation', 'nom', 'niveau'];
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
      const newFiliere = {
        ...formData,
        id: Date.now(),
        etudiants: 0,
        professeurs: 0,
        specialite: formData.specialite.trim() || null,
        code: formData.code.trim(),
        abbreviation: formData.abbreviation.trim(),
        nom: formData.nom.trim(),
        description: formData.description.trim()
      };
      
      await onAddFiliere(newFiliere);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la filière:', error);
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
      <div className="FiliereAdd-overlay" onClick={handleClose}>
        <div className="FiliereAdd-container" onClick={(e) => e.stopPropagation()}>
          <div className="FiliereAdd-header">
            <h2 className="FiliereAdd-title">Ajouter une nouvelle filière</h2>
            <button 
              className="FiliereAdd-close-button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <FaTimes className="FiliereAdd-close-icon" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="FiliereAdd-form">
            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Code <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="FiliereAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: INF101"
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Sigle <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="abbreviation"
                value={formData.abbreviation}
                onChange={handleChange}
                className="FiliereAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: INFO"
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Nom complet <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="FiliereAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: Informatique"
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Niveau <span style={{color: '#ef4444'}}>*</span>
              </label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                className="FiliereAdd-select"
                required
                disabled={isSubmitting}
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Première année">Première année</option>
                <option value="Deuxième année">Deuxième année</option>
                <option value="Troisième année">Troisième année</option>
              </select>
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="FiliereAdd-textarea"
                rows="3"
                disabled={isSubmitting}
                placeholder="Description de la filière (optionnel)"
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">Spécialité (optionnel)</label>
              <input
                type="text"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                className="FiliereAdd-input"
                placeholder="Laissez vide pour tronc commun"
                disabled={isSubmitting}
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">Couleur</label>
              <input
                type="color"
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                className="FiliereAdd-color-input"
                disabled={isSubmitting}
              />
            </div>

            <div className="FiliereAdd-actions">
              <button 
                type="button" 
                className="FiliereAdd-cancel-button" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="FiliereAdd-submit-button"
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
        <div className="FiliereAdd-success-message">
          <FaCheck className="FiliereAdd-success-icon" />
          Filière ajoutée avec succès !
        </div>
      )}
      {showError && (
        <div className="FiliereAdd-error-message">
          <FaExclamationTriangle className="FiliereAdd-success-icon" />
          Erreur : Veuillez remplir tous les champs obligatoires
        </div>
      )}
    </>
  );
};

export default FiliereAdd;