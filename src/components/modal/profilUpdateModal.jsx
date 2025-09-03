import React, { useState, useEffect } from 'react';
import './profilUpdateModal.css';

const ProfilUpdateModal = ({ profileData, onClose, onSave }) => {
  const [formData, setFormData] = useState(profileData);

  const filieresConfig = {
    "IRT": {
      "L1": ["IRT 1"],
      "L2": ["IRT 2"],
      "L3": ["Architecture Logiciel", "Système réseau sécurité"],
      "M1": ["Master 1"],
      "M2": ["Architecture Logiciel", "Système réseau sécurité"]
    },
    "Science de gestion": {
      "L1": ["SG 1"],
      "L2": ["SG 2"],
      "L3": ["Comptabilité", "Audit", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Droit": {
      "L1": ["Droit 1"],
      "L2": ["Droit 2"],
      "L3": ["Droit public", "Droit privé", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Transport Logistique": {
      "L1": ["TL 1"],
      "L2": ["TL 2"],
      "L3": ["Transport", "Logistique", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Management": {
      "L1": ["Management 1"],
      "L2": ["Management 2"],
      "L3": ["Management général", "RH", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "CAC": {
      "L1": ["CAC 1"],
      "L2": ["CAC 2"],
      "L3": ["Contrôle", "Audit", "Comptabilité"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    }
  };

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset specialite when filiere or niveau changes
    if (field === 'filiere' || field === 'niveau') {
      setFormData(prev => ({
        ...prev,
        specialite: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getSpecialites = () => {
    if (formData.filiere && formData.niveau && filieresConfig[formData.filiere]) {
      return filieresConfig[formData.filiere][formData.niveau] || [];
    }
    return [];
  };

  // Handle click outside modal to close
  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Modifier mes informations</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nom">Nom *</label>
                <input 
                  type="text" 
                  id="nom" 
                  className="form-input" 
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="prenom">Prénom *</label>
                <input 
                  type="text" 
                  id="prenom" 
                  className="form-input" 
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="filiere">Filière *</label>
                <select 
                  id="filiere" 
                  className="form-select" 
                  value={formData.filiere}
                  onChange={(e) => handleInputChange('filiere', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez votre filière</option>
                  {Object.keys(filieresConfig).map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="niveau">Niveau d'étude *</label>
                <select 
                  id="niveau" 
                  className="form-select" 
                  value={formData.niveau}
                  onChange={(e) => handleInputChange('niveau', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="L1">L1 (Licence 1)</option>
                  <option value="L2">L2 (Licence 2)</option>
                  <option value="L3">L3 (Licence 3)</option>
                  <option value="M1">M1 (Master 1)</option>
                  <option value="M2">M2 (Master 2)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="specialite">Spécialité *</label>
              <select 
                id="specialite" 
                className="form-select" 
                value={formData.specialite}
                onChange={(e) => handleInputChange('specialite', e.target.value)}
                required
              >
                <option value="">Sélectionnez votre spécialité</option>
                {getSpecialites().map(specialite => (
                  <option key={specialite} value={specialite}>{specialite}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Années académiques *</label>
              <div className="year-range">
                <select 
                  className="form-select" 
                  value={formData.anneeDebut}
                  onChange={(e) => handleInputChange('anneeDebut', e.target.value)}
                  required
                >
                  <option value="">Année de début</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                
                <span className="year-divider">à</span>
                
                <select 
                  className="form-select" 
                  value={formData.anneeFin}
                  onChange={(e) => handleInputChange('anneeFin', e.target.value)}
                  required
                >
                  <option value="">Année de fin</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Statut *</label>
              <div className="status-group">
                <div 
                  className={`radio-item ${formData.statut === 'En cours' ? 'selected' : ''}`}
                  onClick={() => handleInputChange('statut', 'En cours')}
                >
                  <input 
                    type="radio" 
                    id="en-cours" 
                    name="statut" 
                    value="En cours" 
                    checked={formData.statut === 'En cours'}
                    readOnly
                  />
                  <label htmlFor="en-cours">En cours</label>
                </div>
                
                <div 
                  className={`radio-item ${formData.statut === 'Terminé' ? 'selected' : ''}`}
                  onClick={() => handleInputChange('statut', 'Terminé')}
                >
                  <input 
                    type="radio" 
                    id="termine" 
                    name="statut" 
                    value="Terminé" 
                    checked={formData.statut === 'Terminé'}
                    readOnly
                  />
                  <label htmlFor="termine">Terminé</label>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Annuler
              </button>
              
              <button type="submit" className="btn btn-success">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilUpdateModal;