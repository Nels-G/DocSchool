import React, { useState, useEffect } from 'react';
import './SignupForm.css';

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    filiere: '',
    niveau: '',
    specialite: '',
    anneeDebut: '',
    anneeFin: '',
    statut: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSpecialite, setShowSpecialite] = useState(false);
  const [specialites, setSpecialites] = useState([]);
  const [years, setYears] = useState([]);

  const filieresConfig = {
    "IRT": {
      "L1": ["IRT 1"],
      "L2": ["IRT 2"],
      "L3": ["Architecture Logiciel", "Système réseau sécurité"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
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
    const currentYear = new Date().getFullYear();
    const startYear = 1994;
    const endYear = currentYear + 5;
    const yearsArray = [];
    
    for (let year = startYear; year <= endYear; year++) {
      yearsArray.push(year);
    }
    
    setYears(yearsArray);
    
    setFormData(prev => ({
      ...prev,
      anneeDebut: currentYear - 1,
      anneeFin: currentYear
    }));
  }, []);

  useEffect(() => {
    if (formData.filiere && formData.niveau) {
      const filiereSpecs = filieresConfig[formData.filiere];
      if (filiereSpecs && filiereSpecs[formData.niveau]) {
        setSpecialites(filiereSpecs[formData.niveau]);
        setShowSpecialite(true);
        setFormData(prev => ({ ...prev, specialite: '' }));
      } else {
        setShowSpecialite(false);
        setSpecialites([]);
      }
    } else {
      setShowSpecialite(false);
      setSpecialites([]);
    }
  }, [formData.filiere, formData.niveau]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.nom)) newErrors.nom = 'Le nom ne doit contenir que des lettres';
    
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.prenom)) newErrors.prenom = 'Le prénom ne doit contenir que des lettres';
    
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format d\'email invalide';
    
    if (!formData.filiere) newErrors.filiere = 'La filière est requise';
    if (!formData.niveau) newErrors.niveau = 'Le niveau est requis';
    
    if (showSpecialite && !formData.specialite) {
      newErrors.specialite = 'La spécialité est requise';
    }
    
    if (!formData.anneeDebut) newErrors.anneeDebut = "L'année de début est requise";
    if (!formData.anneeFin) newErrors.anneeFin = "L'année de fin est requise";
    
    if (formData.anneeDebut && formData.anneeFin && parseInt(formData.anneeFin) <= parseInt(formData.anneeDebut)) {
      newErrors.anneeFin = "L'année de fin doit être après l'année de début";
    }
    
    if (!formData.statut) newErrors.statut = 'Le statut est requis';
    
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const studentId = 'ETD' + Math.floor(100000 + Math.random() * 900000);
      
      if (onSuccess) {
        onSuccess({
          ...formData,
          studentId: studentId
        });
      }
    }
  };

  const selectStatus = (status) => {
    setFormData(prev => ({ ...prev, statut: status }));
    if (errors.statut) {
      setErrors(prev => ({ ...prev, statut: '' }));
    }
  };

  return (
    <div className="SignupForm-container">
      <form className="SignupForm-form" onSubmit={handleSubmit}>
        <div className="SignupForm-row">
          <div className={`SignupForm-group ${errors.nom ? 'error' : ''}`}>
            <label htmlFor="nom" className="SignupForm-label">Nom *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              className="SignupForm-input"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
            />
            {errors.nom && <div className="SignupForm-error">{errors.nom}</div>}
          </div>
          
          <div className={`SignupForm-group ${errors.prenom ? 'error' : ''}`}>
            <label htmlFor="prenom" className="SignupForm-label">Prénom *</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              className="SignupForm-input"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
            {errors.prenom && <div className="SignupForm-error">{errors.prenom}</div>}
          </div>
        </div>

        <div className={`SignupForm-group ${errors.email ? 'error' : ''}`}>
          <label htmlFor="email" className="SignupForm-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="SignupForm-input"
            placeholder="votre.email@exemple.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="SignupForm-error">{errors.email}</div>}
        </div>

        <div className="SignupForm-row">
          <div className={`SignupForm-group ${errors.filiere ? 'error' : ''}`}>
            <label htmlFor="filiere" className="SignupForm-label">Filière *</label>
            <select
              id="filiere"
              name="filiere"
              className="SignupForm-select"
              value={formData.filiere}
              onChange={handleChange}
            >
              <option value="">Sélectionnez votre filière</option>
              <option value="IRT">IRT</option>
              <option value="Science de gestion">Science de gestion</option>
              <option value="Droit">Droit</option>
              <option value="Transport Logistique">Transport Logistique</option>
              <option value="Management">Management</option>
              <option value="CAC">CAC</option>
            </select>
            {errors.filiere && <div className="SignupForm-error">{errors.filiere}</div>}
          </div>
          
          <div className={`SignupForm-group ${errors.niveau ? 'error' : ''}`}>
            <label htmlFor="niveau" className="SignupForm-label">Niveau d'étude *</label>
            <select
              id="niveau"
              name="niveau"
              className="SignupForm-select"
              value={formData.niveau}
              onChange={handleChange}
            >
              <option value="">Sélectionnez votre niveau</option>
              <option value="L1">L1 (Licence 1)</option>
              <option value="L2">L2 (Licence 2)</option>
              <option value="L3">L3 (Licence 3)</option>
              <option value="M1">M1 (Master 1)</option>
              <option value="M2">M2 (Master 2)</option>
            </select>
            {errors.niveau && <div className="SignupForm-error">{errors.niveau}</div>}
          </div>
        </div>

        {showSpecialite && (
          <div className={`SignupForm-group ${errors.specialite ? 'error' : ''}`}>
            <label htmlFor="specialite" className="SignupForm-label">Spécialité *</label>
            <select
              id="specialite"
              name="specialite"
              className="SignupForm-select"
              value={formData.specialite}
              onChange={handleChange}
            >
              <option value="">Sélectionnez votre spécialité</option>
              {specialites.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
            {errors.specialite && <div className="SignupForm-error">{errors.specialite}</div>}
          </div>
        )}

        <div className={`SignupForm-group ${errors.anneeDebut || errors.anneeFin ? 'error' : ''}`}>
          <label className="SignupForm-label">Années académiques *</label>
          <div className="SignupForm-year-range">
            <select
              name="anneeDebut"
              className="SignupForm-select"
              value={formData.anneeDebut}
              onChange={handleChange}
            >
              <option value="">Année de début</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <span className="SignupForm-year-divider">à</span>
            
            <select
              name="anneeFin"
              className="SignupForm-select"
              value={formData.anneeFin}
              onChange={handleChange}
            >
              <option value="">Année de fin</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {(errors.anneeDebut || errors.anneeFin) && (
            <div className="SignupForm-error">{errors.anneeDebut || errors.anneeFin}</div>
          )}
        </div>

        <div className={`SignupForm-group ${errors.statut ? 'error' : ''}`}>
          <label className="SignupForm-label">Statut *</label>
          <div className="SignupForm-status-group">
            <div 
              className={`SignupForm-radio-item ${formData.statut === 'En cours' ? 'selected' : ''}`}
              onClick={() => selectStatus('En cours')}
            >
              <input 
                type="radio" 
                id="en-cours" 
                name="statut" 
                value="En cours" 
                checked={formData.statut === 'En cours'}
                onChange={() => {}}
              />
              <label htmlFor="en-cours">En cours</label>
            </div>
            
            <div 
              className={`SignupForm-radio-item ${formData.statut === 'Terminé' ? 'selected' : ''}`}
              onClick={() => selectStatus('Terminé')}
            >
              <input 
                type="radio" 
                id="termine" 
                name="statut" 
                value="Terminé" 
                checked={formData.statut === 'Terminé'}
                onChange={() => {}}
              />
              <label htmlFor="termine">Terminé</label>
            </div>
          </div>
          {errors.statut && <div className="SignupForm-error">{errors.statut}</div>}
        </div>

        <div className={`SignupForm-group ${errors.password ? 'error' : ''}`}>
          <label htmlFor="password" className="SignupForm-label">Mot de passe *</label>
          <div className="SignupForm-password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="SignupForm-input"
              placeholder="Minimum 8 caractères"
              value={formData.password}
              onChange={handleChange}
            />
            <button 
              type="button" 
              className="SignupForm-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
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
          {errors.password && <div className="SignupForm-error">{errors.password}</div>}
        </div>

        <div className={`SignupForm-group ${errors.confirmPassword ? 'error' : ''}`}>
          <label htmlFor="confirmPassword" className="SignupForm-label">Confirmer le mot de passe *</label>
          <div className="SignupForm-password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="SignupForm-input"
              placeholder="Répétez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button 
              type="button" 
              className="SignupForm-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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
          {errors.confirmPassword && <div className="SignupForm-error">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="SignupForm-btn SignupForm-btn-primary">
          Créer mon compte
        </button>
      </form>
    </div>
  );
};

export default SignupForm;