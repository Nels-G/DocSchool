import React, { useState, useEffect } from 'react';
import './profilComponent.css';
import ProfilUpdateModal from '../../../../components/modal/profilUpdateModal';
import api from '../../../../services/api';

const ProfilComponent = () => {
  const [profileData, setProfileData] = useState({
    nom: "",
    prenom: "",
    email: "",
    filiere: "",
    niveau: "",
    specialite: "",
    matricule: "",
    anneeDebut: "",
    anneeFin: "",
    statut: "En cours"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les données utilisateur
  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        try {
          // Récupérer les données fraîches depuis l'API
          const response = await api.get(`/users/${userData.id}/`);
          const currentUserData = response.data;

          // Mettre à jour les données dans localStorage
          localStorage.setItem('user', JSON.stringify(currentUserData));

          // Mettre à jour le state avec les données de l'utilisateur
          setProfileData({
            nom: currentUserData.last_name || "",
            prenom: currentUserData.first_name || "",
            email: currentUserData.email || "",
            filiere: currentUserData.filiere_nom || "",
            niveau: currentUserData.niveau_nom || "",
            specialite: currentUserData.specialite_nom || "",
            matricule: currentUserData.matricule || "",
            anneeDebut: currentUserData.annee_debut || "",
            anneeFin: currentUserData.annee_fin || "",
            statut: currentUserData.statut || "En cours"
          });

          // Si l'utilisateur a une photo de profil
          if (currentUserData.photo_profil_url) {
            setAvatarImage(`http://127.0.0.1:8000${currentUserData.photo_profil_url}`);
          }

        } catch (apiError) {
          console.warn('Impossible de rafraîchir les données utilisateur, utilisation des données locales:', apiError);
          // Utiliser les données du localStorage si l'API échoue
          setProfileData({
            nom: userData.last_name || "",
            prenom: userData.first_name || "",
            email: userData.email || "",
            filiere: userData.filiere_nom || "",
            niveau: userData.niveau_nom || "",
            specialite: userData.specialite_nom || "",
            matricule: userData.matricule || "",
            anneeDebut: userData.annee_debut || "",
            anneeFin: userData.annee_fin || "",
            statut: userData.statut || "En cours"
          });

          if (userData.photo_profil_url) {
            setAvatarImage(`http://127.0.0.1:8000${userData.photo_profil_url}`);
          }
        }
      } else {
        setError('Utilisateur non connecté');
      }
    } catch (err) {
      setError('Erreur lors du chargement des données utilisateur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadUserData();
  }, []);

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('photo_profil', file);

        // Mettre à jour la photo via l'API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const response = await api.patch(`/users/${userData.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          // Mettre à jour l'image localement
          const reader = new FileReader();
          reader.onload = (e) => {
            setAvatarImage(e.target.result);
          };
          reader.readAsDataURL(file);

          // Rafraîchir les données utilisateur
          loadUserData();
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement de la photo:', error);
        alert('Erreur lors du téléchargement de la photo');
      }
    }
  };

  const changePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };

  const saveProfile = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Récupérer les IDs des objets filière, niveau, spécialité
        let filiereId = null;
        let niveauId = null;
        let specialiteId = null;

        if (updatedData.filiere) {
          try {
            const filieresRes = await api.get('/filieres/');
            const filiere = filieresRes.data.find(f => f.nom === updatedData.filiere);
            filiereId = filiere ? filiere.id : null;
          } catch (error) {
            console.error('Erreur lors de la récupération des filières:', error);
          }
        }

        if (updatedData.niveau) {
          try {
            const niveauxRes = await api.get('/niveaux/');
            const niveau = niveauxRes.data.find(n => n.nom_complet === updatedData.niveau);
            niveauId = niveau ? niveau.id : null;
          } catch (error) {
            console.error('Erreur lors de la récupération des niveaux:', error);
          }
        }

        if (updatedData.specialite && filiereId && niveauId) {
          try {
            const specialitesRes = await api.get('/specialites/');
            const specialite = specialitesRes.data.find(s => 
              s.nom === updatedData.specialite && 
              s.filiere === filiereId && 
              s.niveau === niveauId
            );
            specialiteId = specialite ? specialite.id : null;
          } catch (error) {
            console.error('Erreur lors de la récupération des spécialités:', error);
          }
        } else {
          // Pas de spécialité sélectionnée ou pas de spécialité disponible pour cette combinaison
          specialiteId = null;
        }
        
        // Préparer les données pour l'API
        const apiData = {
          first_name: updatedData.prenom,
          last_name: updatedData.nom,
          email: updatedData.email,
          filiere: filiereId,
          niveau: niveauId,
          specialite: specialiteId,
          annee_debut: parseInt(updatedData.anneeDebut),
          annee_fin: parseInt(updatedData.anneeFin),
          statut: updatedData.statut
        };

        console.log('Données à envoyer à l\'API:', apiData);

        // Envoyer les modifications à l'API
        await api.patch(`/users/${userData.id}/`, apiData);

        // Mettre à jour les données locales
        setProfileData(prev => ({ ...prev, ...updatedData }));
        
        // Rafraîchir les données utilisateur
        loadUserData();
        
        setIsModalOpen(false);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getInitials = () => {
    return `${profileData.prenom.charAt(0)}${profileData.nom.charAt(0)}`.toUpperCase();
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="profilComponent-container">
        <div className="profilComponent-loading">
          <div className="profilComponent-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="profilComponent-container">
        <div className="profilComponent-error">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={loadUserData} className="profilComponent-btn profilComponent-btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profilComponent-container">
      <div className="profilComponent-header">
        <h1>
          <div className="profilComponent-user-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          Mon Profil
        </h1>
        <p>Gérez vos informations personnelles et académiques</p>
      </div>

      <div className="profilComponent-content">
        <div className="profilComponent-avatar-section">
          <div className="profilComponent-avatar-container">
            <div className="profilComponent-avatar">
              {avatarImage ? (
                <img src={avatarImage} alt="Avatar" className="profilComponent-avatar-image" />
              ) : (
                getInitials()
              )}
            </div>
          </div>
          <button className="profilComponent-change-photo-btn" onClick={changePhoto}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm3-8c4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9s-9-4.03-9-9c0-4.97 4.03-9 9-9zm0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Changer la photo
          </button>
        </div>

        <div className="profilComponent-sections">
          <div className="profilComponent-card">
            <h3 className="profilComponent-card-title">
              <div className="profilComponent-card-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              Informations Personnelles
            </h3>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Nom</span>
              <span className="profilComponent-info-value">{profileData.nom}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Prénom</span>
              <span className="profilComponent-info-value">{profileData.prenom}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Email</span>
              <span className="profilComponent-info-value">{profileData.email}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Statut</span>
              <span className="profilComponent-info-value">
                <span className={`profilComponent-status-badge ${profileData.statut === 'En cours' ? 'profilComponent-status-en-cours' : 'profilComponent-status-termine'}`}>
                  {profileData.statut}
                </span>
              </span>
            </div>
          </div>

          <div className="profilComponent-card">
            <h3 className="profilComponent-card-title">
              <div className="profilComponent-card-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
              </div>
              Informations Académiques
            </h3>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Matricule étudiant</span>
              <span className="profilComponent-info-value">{profileData.matricule}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Filière</span>
              <span className="profilComponent-info-value">{profileData.filiere || "Non définie"}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Niveau d'étude</span>
              <span className="profilComponent-info-value">{profileData.niveau || "Non défini"}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Spécialité</span>
              <span className="profilComponent-info-value">{profileData.specialite || "Non définie"}</span>
            </div>
            
            <div className="profilComponent-info-item">
              <span className="profilComponent-info-label">Années académiques</span>
              <span className="profilComponent-info-value">
                {profileData.anneeDebut && profileData.anneeFin 
                  ? `${profileData.anneeDebut} - ${profileData.anneeFin}` 
                  : "Non définies"
                }
              </span>
            </div>
          </div>
        </div>

        {showSuccessMessage && (
          <div className="profilComponent-success-message">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Informations mises à jour avec succès !
          </div>
        )}

        <div className="profilComponent-action-buttons">
          <button className="profilComponent-btn profilComponent-btn-primary" onClick={openEditModal}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Modifier mes informations
          </button>
          
          <button className="profilComponent-btn profilComponent-btn-success" onClick={saveProfile}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Modal de modification */}
      {isModalOpen && (
        <ProfilUpdateModal
          profileData={profileData}
          onClose={closeEditModal}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfilComponent;