import React, { useState, useEffect } from 'react';
import './SpecialiteAdd.css';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const SpecialiteAdd = ({ onClose, onAddSpecialite, filieres = [], niveaux = [] }) => {
  const [formData, setFormData] = useState({
    nom: '',
    code: '', // Changé de 'sigle' à 'code'
    description: '',
    filiere: '', // Changé de 'filiereId' à 'filiere'
    niveau: '', // Changé de 'niveauId' à 'niveau'
    couleur: '#4B65D6'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);

  // Mettre à jour la couleur par défaut selon la filière sélectionnée
  useEffect(() => {
    if (formData.filiere) {
      const filiere = filieres.find(f => f.id.toString() === formData.filiere);
      if (filiere) {
        setSelectedFiliere(filiere);
        // Si la filière a une couleur, l'utiliser, sinon garder la couleur actuelle
        if (filiere.couleur) {
          setFormData(prev => ({ ...prev, couleur: filiere.couleur }));
        }
      }
    } else {
      setSelectedFiliere(null);
    }
  }, [formData.filiere, filieres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['nom', 'code', 'filiere', 'niveau']; // Mis à jour
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
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
      const newSpecialite = {
        id: Date.now(), // Ajout d'un ID unique
        ...formData,
        nom: formData.nom.trim(),
        code: formData.code.trim().toUpperCase(), // Changé de 'sigle' à 'code'
        description: formData.description.trim(),
        filiere: parseInt(formData.filiere), // Changé de 'filiereId' à 'filiere'
        niveau: parseInt(formData.niveau) // Changé de 'niveauId' à 'niveau'
      };
      
      await onAddSpecialite(newSpecialite);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la spécialité:', error);
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
      <div className="SpecialiteAdd-overlay" onClick={handleClose}>
        <div className="SpecialiteAdd-container" onClick={(e) => e.stopPropagation()}>
          <div className="SpecialiteAdd-header">
            <h2 className="SpecialiteAdd-title">Ajouter une nouvelle spécialité</h2>
            <button 
              className="SpecialiteAdd-close-button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <FaTimes className="SpecialiteAdd-close-icon" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="SpecialiteAdd-form">
            <div className="SpecialiteAdd-form-row">
              <div className="SpecialiteAdd-form-group">
                <label className="SpecialiteAdd-label">
                  Filière <span style={{color: '#ef4444'}}>*</span>
                </label>
                <select
                  name="filiere" // Changé de 'filiereId' à 'filiere'
                  value={formData.filiere}
                  onChange={handleChange}
                  className="SpecialiteAdd-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner une filière</option>
                  {filieres.map(filiere => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.code} - {filiere.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="SpecialiteAdd-form-group">
                <label className="SpecialiteAdd-label">
                  Niveau <span style={{color: '#ef4444'}}>*</span>
                </label>
                <select
                  name="niveau" // Changé de 'niveauId' à 'niveau'
                  value={formData.niveau}
                  onChange={handleChange}
                  className="SpecialiteAdd-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map(niveau => (
                    <option key={niveau.id} value={niveau.id}>
                      {niveau.code} - {niveau.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedFiliere && (
              <div className="SpecialiteAdd-filiere-info">
                <span 
                  className="SpecialiteAdd-filiere-badge"
                  style={{
                    backgroundColor: selectedFiliere.couleur ? `${selectedFiliere.couleur}20` : '#4B65D620',
                    color: selectedFiliere.couleur || '#4B65D6',
                    borderColor: selectedFiliere.couleur ? `${selectedFiliere.couleur}40` : '#4B65D640'
                  }}
                >
                  {selectedFiliere.code}
                </span>
                <span className="SpecialiteAdd-filiere-name">
                  {selectedFiliere.nom}
                </span>
              </div>
            )}

            <div className="SpecialiteAdd-form-group">
              <label className="SpecialiteAdd-label">
                Nom de la spécialité <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="SpecialiteAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: Système Réseau Sécurité"
              />
            </div>

            <div className="SpecialiteAdd-form-group">
              <label className="SpecialiteAdd-label">
                Code <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                name="code" // Changé de 'sigle' à 'code'
                value={formData.code}
                onChange={handleChange}
                className="SpecialiteAdd-input"
                required
                disabled={isSubmitting}
                placeholder="Ex: SRS"
                maxLength="10"
              />
              <small className="SpecialiteAdd-help-text">
                Code court pour identifier la spécialité (automatiquement en majuscules)
              </small>
            </div>

            <div className="SpecialiteAdd-form-group">
              <label className="SpecialiteAdd-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="SpecialiteAdd-textarea"
                rows="3"
                disabled={isSubmitting}
                placeholder="Description de la spécialité (optionnel)"
              />
            </div>

            <div className="SpecialiteAdd-form-group">
              <label className="SpecialiteAdd-label">Couleur</label>
              <div className="SpecialiteAdd-color-container">
                <input
                  type="color"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleChange}
                  className="SpecialiteAdd-color-input"
                  disabled={isSubmitting}
                />
                <div className="SpecialiteAdd-color-preview">
                  <span 
                    className="SpecialiteAdd-color-sample"
                    style={{ 
                      backgroundColor: `${formData.couleur}20`,
                      color: formData.couleur,
                      borderColor: `${formData.couleur}40`
                    }}
                  >
                    {formData.code || 'CODE'} {/* Changé de 'sigle' à 'code' */}
                  </span>
                </div>
                {selectedFiliere && selectedFiliere.couleur && (
                  <button
                    type="button"
                    className="SpecialiteAdd-color-reset"
                    onClick={() => setFormData(prev => ({ ...prev, couleur: selectedFiliere.couleur }))}
                    disabled={isSubmitting}
                  >
                    Utiliser couleur filière
                  </button>
                )}
              </div>
            </div>

            <div className="SpecialiteAdd-actions">
              <button 
                type="button" 
                className="SpecialiteAdd-cancel-button" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="SpecialiteAdd-submit-button"
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
        <div className="SpecialiteAdd-success-message">
          <FaCheck className="SpecialiteAdd-success-icon" />
          Spécialité ajoutée avec succès !
        </div>
      )}
      {showError && (
        <div className="SpecialiteAdd-error-message">
          <FaExclamationTriangle className="SpecialiteAdd-success-icon" />
          Erreur : Veuillez remplir tous les champs obligatoires
        </div>
      )}
    </>
  );
};

export default SpecialiteAdd;