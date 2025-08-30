import React, { useState } from 'react';
import { FaTimes, FaCheck, FaExclamationTriangle, FaGraduationCap } from 'react-icons/fa';
import './FiliereAdd.css';

const FiliereAdd = ({ onClose, onAddFiliere, niveauxDisponibles = [] }) => {
  // Données fictives pour les niveaux si aucune n'est fournie
  const defaultNiveaux = [
    { id: 1, nom: 'Licence 1 (L1)' },
    { id: 2, nom: 'Licence 2 (L2)' },
    { id: 3, nom: 'Licence 3 (L3)' },
    { id: 4, nom: 'Master 1 (M1)' },
    { id: 5, nom: 'Master 2 (M2)' },
    { id: 6, nom: 'Doctorat' }
  ];

  const niveaux = niveauxDisponibles.length > 0 ? niveauxDisponibles : defaultNiveaux;

  const [formData, setFormData] = useState({
    nom: '',
    code: '', // Changé de 'sigle' à 'code'
    description: '',
    couleur: '#4B65D6',
    niveaux: []
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNiveauToggle = (niveauId) => {
    setFormData(prev => ({
      ...prev,
      niveaux: prev.niveaux.includes(niveauId)
        ? prev.niveaux.filter(id => id !== niveauId)
        : [...prev.niveaux, niveauId]
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nom', 'code']; // Changé de 'sigle' à 'code'
    const fieldsValid = requiredFields.every(field => formData[field].trim() !== '');
    const niveauxValid = formData.niveaux.length > 0;
    return fieldsValid && niveauxValid;
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
        id: Date.now(), // Ajout d'un ID unique
        ...formData,
        nom: formData.nom.trim(),
        code: formData.code.trim().toUpperCase(), // Changé de 'sigle' à 'code'
        description: formData.description.trim()
      };
      
      if (onAddFiliere) {
        await onAddFiliere(newFiliere);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onClose) onClose();
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
    if (!isSubmitting && onClose) {
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

          <div className="FiliereAdd-form">
            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Nom de la filière <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="FiliereAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: Informatique Réseaux Télécommunication"
              />
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">
                Code <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="code" // Changé de 'sigle' à 'code'
                value={formData.code} // Changé de 'sigle' à 'code'
                onChange={handleChange}
                className="FiliereAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: IRT"
                maxLength="10"
              />
              <small className="FiliereAdd-help-text">
                Code court pour identifier la filière (automatiquement en majuscules)
              </small>
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
              <label className="FiliereAdd-label">
                Niveaux disponibles <span style={{color: '#ef4444'}}>*</span>
              </label>
              <div className="FiliereAdd-niveaux-container">
                {niveaux.length > 0 ? (
                  niveaux.map(niveau => (
                    <label key={niveau.id} className="FiliereAdd-niveau-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.niveaux.includes(niveau.id)}
                        onChange={() => handleNiveauToggle(niveau.id)}
                        disabled={isSubmitting}
                      />
                      <span className="FiliereAdd-niveau-label">
                        <FaGraduationCap className="FiliereAdd-niveau-icon" />
                        {niveau.nom}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="FiliereAdd-no-niveaux">
                    Aucun niveau disponible. Veuillez d'abord créer des niveaux.
                  </div>
                )}
              </div>
              {formData.niveaux.length === 0 && (
                <small className="FiliereAdd-error-text">
                  Veuillez sélectionner au moins un niveau
                </small>
              )}
            </div>

            <div className="FiliereAdd-form-group">
              <label className="FiliereAdd-label">Couleur de la filière</label>
              <div className="FiliereAdd-color-container">
                <input
                  type="color"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleChange}
                  className="FiliereAdd-color-input"
                  disabled={isSubmitting}
                />
                <div className="FiliereAdd-color-preview">
                  <span 
                    className="FiliereAdd-color-sample"
                    style={{ 
                      backgroundColor: `${formData.couleur}15`,
                      color: formData.couleur,
                      border: `2px solid ${formData.couleur}30`
                    }}
                  >
                    {formData.code || 'CODE'} {/* Changé de 'sigle' à 'code' */}
                  </span>
                </div>
              </div>
              <small className="FiliereAdd-help-text">
                Cette couleur sera utilisée pour identifier visuellement la filière
              </small>
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
                type="button" 
                className="FiliereAdd-submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting || !validateForm()}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter la filière'}
              </button>
            </div>
            </div>
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
          Erreur : Veuillez remplir tous les champs obligatoires et sélectionner au moins un niveau
        </div>
      )}
    </>
  );
};

export default FiliereAdd;