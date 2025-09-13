import React, { useState, useEffect } from 'react';
import './profilUpdateModal.css';
import api from '../../services/api';

const ProfilUpdateModal = ({ profileData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    filiere: "",
    niveau: "",
    specialite: "",
    anneeDebut: "",
    anneeFin: "",
    statut: "En cours"
  });

  // États pour les données de l'API
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [filteredSpecialites, setFilteredSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données des filières, niveaux et spécialités depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [filieresRes, niveauxRes, specialitesRes] = await Promise.all([
          api.get('/filieres/'),
          api.get('/niveaux/'),
          api.get('/specialites/')
        ]);
        
        setFilieres(filieresRes.data);
        setNiveaux(niveauxRes.data);
        setSpecialites(specialitesRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mettre à jour formData avec les données du profil
  useEffect(() => {
    if (profileData) {
      setFormData({
        nom: profileData.nom || "",
        prenom: profileData.prenom || "",
        email: profileData.email || "",
        filiere: profileData.filiere || "",
        niveau: profileData.niveau || "",
        specialite: profileData.specialite || "",
        anneeDebut: profileData.anneeDebut || "",
        anneeFin: profileData.anneeFin || "",
        statut: profileData.statut || "En cours"
      });
    }
  }, [profileData]);

  // Filtrer les spécialités basées sur la filière et le niveau sélectionnés
  useEffect(() => {
    if (formData.filiere && formData.niveau) {
      const filiereObj = filieres.find(f => f.nom === formData.filiere);
      const niveauObj = niveaux.find(n => n.nom_complet === formData.niveau);
      
      if (filiereObj && niveauObj) {
        const filtered = specialites.filter(s => 
          s.filiere === filiereObj.id && s.niveau === niveauObj.id
        );
        setFilteredSpecialites(filtered);
      } else {
        setFilteredSpecialites([]);
      }
    } else {
      setFilteredSpecialites([]);
    }
  }, [formData.filiere, formData.niveau, filieres, niveaux, specialites]);

  // Vérifier si la combinaison filière/niveau a des spécialités disponibles
  const hasSpecialites = () => {
    if (!formData.filiere || !formData.niveau) return false;
    return filteredSpecialites.length > 0;
  };

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
    
    // Validation des dates
    if (formData.anneeDebut && formData.anneeFin) {
      if (parseInt(formData.anneeDebut) >= parseInt(formData.anneeFin)) {
        alert('La date de début doit être antérieure à la date de fin');
        return;
      }
    }

    // Validation de la spécialité seulement si elle est requise
    if (hasSpecialites() && !formData.specialite) {
      alert('Veuillez sélectionner une spécialité pour cette filière/niveau');
      return;
    }
    
    // Préparer les données à envoyer
    const dataToSave = {
      ...formData,
      email: profileData.email // Garder l'email original
    };
    
    onSave(dataToSave);
  };

  // Générer les options d'années (plage étendue)
  const generateYearOptions = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const currentYear = new Date().getFullYear();
  const startYears = generateYearOptions(1980, currentYear + 10); // De 1980 à 10 ans dans le futur
  const endYears = generateYearOptions(1980, currentYear + 15); // Jusqu'à 15 ans dans le futur

  // Filtrer les années de fin pour qu'elles soient supérieures à l'année de début
  const getValidEndYears = () => {
    if (formData.anneeDebut) {
      return endYears.filter(year => year > parseInt(formData.anneeDebut));
    }
    return endYears;
  };

  // Handle click outside modal to close
  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Chargement...</h2>
            <span className="close" onClick={onClose}>&times;</span>
          </div>
          <div className="modal-body">
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <label className="form-label" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={formData.email}
                readOnly
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small className="form-help-text">
                L'adresse email ne peut pas être modifiée
              </small>
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
                  {filieres.map(filiere => (
                    <option key={filiere.id} value={filiere.nom}>{filiere.nom}</option>
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
                  {niveaux.map(niveau => (
                    <option key={niveau.id} value={niveau.nom_complet}>{niveau.nom_complet}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Champ Spécialité - Affiché seulement si des spécialités existent pour cette combinaison */}
            {hasSpecialites() && (
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
                  {filteredSpecialites.map(specialite => (
                    <option key={specialite.id} value={specialite.nom}>{specialite.nom}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Message informatif si aucune spécialité n'est disponible */}
            {formData.filiere && formData.niveau && !hasSpecialites() && (
              <div className="form-group">
                <div className="form-info-message" style={{ 
                  padding: '10px', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '4px', 
                  color: '#1976d2',
                  fontSize: '14px'
                }}>
                  Cette combinaison filière/niveau ne nécessite pas de spécialité spécifique.
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Années académiques *</label>
              <div className="year-range">
                <select 
                  className="form-select" 
                  value={formData.anneeDebut}
                  onChange={(e) => {
                    handleInputChange('anneeDebut', e.target.value);
                    // Reset année de fin si elle devient invalide
                    if (formData.anneeFin && parseInt(e.target.value) >= parseInt(formData.anneeFin)) {
                      handleInputChange('anneeFin', '');
                    }
                  }}
                  required
                >
                  <option value="">Année de début</option>
                  {startYears.map(year => (
                    <option key={`start-${year}`} value={year}>{year}</option>
                  ))}
                </select>
                
                <span className="year-divider">à</span>
                
                <select 
                  className="form-select" 
                  value={formData.anneeFin}
                  onChange={(e) => handleInputChange('anneeFin', e.target.value)}
                  required
                  disabled={!formData.anneeDebut}
                >
                  <option value="">Année de fin</option>
                  {getValidEndYears().map(year => (
                    <option key={`end-${year}`} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {formData.anneeDebut && formData.anneeFin && parseInt(formData.anneeDebut) >= parseInt(formData.anneeFin) && (
                <small className="form-help-text" style={{ color: 'red' }}>
                  L'année de début doit être antérieure à l'année de fin
                </small>
              )}
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