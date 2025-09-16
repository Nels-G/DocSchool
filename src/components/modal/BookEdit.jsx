import React, { useState, useEffect } from 'react';
import './bookAdd.css'; // Utilisez le même CSS

const BookEdit = ({ isOpen, onClose, user, document, onUpdate }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    type_document: '',
    niveau: '',
    annee_academique: '',
    fichier: null,
    image_couverture: null
  });

  const [options, setOptions] = useState({
    categories: [],
    types_document: [],
    niveaux: [],
    filieres: [],
    specialites: []
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Initialiser les données du document à modifier
  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        titre: document.titre || '',
        description: document.description || '',
        categorie: document.categorie || '',
        type_document: document.type_document || '',
        niveau: document.niveau || '',
        annee_academique: document.annee_academique || '',
        fichier: null, // Ne pas pré-remplir le fichier
        image_couverture: null // Ne pas pré-remplir l'image
      });
      
      // Charger l'image de couverture existante si disponible
      if (document.image_couverture) {
        setPreviewImage(document.image_couverture);
      }
    }
  }, [document, isOpen]);

  // Fonctions pour gérer les modals (identique à BookAdd)
  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showError = (message) => {
    showModal('Erreur', message, 'error');
  };

  const showSuccess = (message) => {
    showModal('Succès', message, 'success');
  };

  // Récupérer les options depuis l'API publique
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/documents/options/public/');
        if (!response.ok) {
          throw new Error('Erreur de chargement des options');
        }
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Erreur lors du chargement des options:', error);
        showError('Impossible de charger les options du formulaire');
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  // Gestion des changements de formulaire (identique à BookAdd)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation des formats PDF uniquement
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (fileExtension !== '.pdf') {
      showError('Format de fichier non autorisé. Seuls les fichiers PDF sont acceptés.');
      e.target.value = '';
      return;
    }

    // Validation de la taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showError('Le fichier ne doit pas dépasser 50MB');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({
      ...prev,
      fichier: file
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation image (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('L\'image ne doit pas dépasser 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        image_couverture: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour récupérer le token JWT depuis localStorage (identique à BookAdd)
  const getAuthToken = () => {
    // Chercher le token JWT dans localStorage
    const tokenKeys = [
      'tokens', // Nouvelle clé pour l'objet tokens
      'access', 'access_token', 'token', 'authToken', 'jwt', 'accessToken',
      'userToken', 'auth_token', 'jwtToken', 'docschool_token'
    ];

    // Chercher dans localStorage
    for (const key of tokenKeys) {
      const tokenData = localStorage.getItem(key);
      if (tokenData) {
        try {
          // Si c'est un objet JSON (tokens: {access: ..., refresh: ...})
          const parsed = JSON.parse(tokenData);
          if (parsed.access) {
            console.log('Token access trouvé dans l\'objet tokens');
            return parsed.access;
          }
        } catch (e) {
          // Si c'est une string directe (token seul)
          if (tokenData && tokenData !== 'undefined' && tokenData !== 'null' && tokenData.trim() !== '') {
            console.log(`Token trouvé avec la clé: ${key}`);
            return tokenData;
          }
        }
      }
    }

    console.log('Aucun token trouvé');
    return null;
  };

  // Fonction pour rafraîchir le token JWT (identique à BookAdd)
  const refreshToken = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const refreshToken = tokens.refresh;
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newTokens = { ...tokens, access: data.access };
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        return data.access;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      // Déconnecter l'utilisateur
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      showError('Session expirée. Veuillez vous reconnecter.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation des champs requis
    if (!formData.titre || !formData.description || !formData.categorie || 
        !formData.type_document || !formData.niveau || !formData.annee_academique) {
      showError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    let token = getAuthToken();

    if (!token) {
      showError('Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    
    // Ajouter tous les champs au FormData
    formDataToSend.append('titre', formData.titre);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('categorie', formData.categorie);
    formDataToSend.append('type_document', formData.type_document);
    formDataToSend.append('niveau', formData.niveau);
    formDataToSend.append('annee_academique', formData.annee_academique);
    
    // Ajouter le fichier seulement s'il a été modifié
    if (formData.fichier) {
      formDataToSend.append('fichier', formData.fichier);
    }
    
    // Ajouter l'image seulement si elle a été modifiée
    if (formData.image_couverture) {
      formDataToSend.append('image_couverture', formData.image_couverture);
    }

    try {
      console.log('Envoi de la requête avec token:', token.substring(0, 20) + '...');
      
      let response = await fetch(`http://localhost:8000/api/documents/documents/${document.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      // Si le token a expiré, essayer de le rafraîchir
      if (response.status === 401) {
        console.log('Token expiré, tentative de rafraîchissement...');
        const newToken = await refreshToken();
        
        if (newToken) {
          // Réessayer la requête avec le nouveau token
          response = await fetch(`http://localhost:8000/api/documents/documents/${document.id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
            body: formDataToSend,
          });
        } else {
          throw new Error('Impossible de rafraîchir le token');
        }
      }

      console.log('Status de la réponse:', response.status);

      if (response.ok) {
        showSuccess('Document modifié avec succès !');
        
        // Appeler la fonction de callback pour mettre à jour la liste
        if (onUpdate) {
          onUpdate();
        }
        
        // Fermer le popup après 2 secondes
        setTimeout(() => {
          onClose();
        }, 2000);
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur backend:', errorData);
        console.error('Status:', response.status);
        console.error('StatusText:', response.statusText);
        
        if (response.status === 401 || response.status === 403) {
          showError('Accès refusé. Votre session a peut-être expiré. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const errorMessage = errorData.detail || 
                              (typeof errorData === 'object' ? JSON.stringify(errorData) : 'Données invalides');
          showError('Données invalides: ' + errorMessage);
        } else {
          const errorMessage = errorData.detail || errorData.message || 'Erreur serveur';
          showError('Erreur lors de la modification du document: ' + errorMessage);
        }
      }
    } catch (error) {
      console.error('Erreur réseau complète:', error);
      showError('Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      titre: '',
      description: '',
      categorie: '',
      type_document: '',
      niveau: '',
      annee_academique: '',
      fichier: null,
      image_couverture: null
    });
    setPreviewImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bookAdd-overlay" onClick={handleOverlayClick}>
        <div className="bookAdd-container">
          <div className="bookAdd-header">
            <h2 className="bookAdd-title">Modifier le document</h2>
            <button className="bookAdd-close-btn" onClick={handleCancel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <form className="bookAdd-form" onSubmit={handleSubmit}>
            <div className="bookAdd-form-row">
              <div className="bookAdd-form-group bookAdd-form-group-full">
                <label htmlFor="titre" className="bookAdd-label">Titre du document *</label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="bookAdd-input"
                  required
                  placeholder="Ex: Introduction au Calcul Différentiel"
                />
              </div>
            </div>

            <div className="bookAdd-form-row">
              <div className="bookAdd-form-group bookAdd-form-group-full">
                <label htmlFor="description" className="bookAdd-label">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bookAdd-textarea"
                  required
                  rows="3"
                  placeholder="Décrivez brièvement le contenu de votre document..."
                ></textarea>
              </div>
            </div>

            <div className="bookAdd-form-row">
              <div className="bookAdd-form-group">
                <label htmlFor="categorie" className="bookAdd-label">Catégorie *</label>
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className="bookAdd-select"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {options.categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>

              <div className="bookAdd-form-group">
                <label htmlFor="type_document" className="bookAdd-label">Type de document *</label>
                <select
                  id="type_document"
                  name="type_document"
                  value={formData.type_document}
                  onChange={handleInputChange}
                  className="bookAdd-select"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {options.types_document?.map(type => (
                    <option key={type.id} value={type.id}>{type.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bookAdd-form-row">
              <div className="bookAdd-form-group">
                <label htmlFor="niveau" className="bookAdd-label">Niveau *</label>
                <select
                  id="niveau"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="bookAdd-select"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  {options.niveaux?.map(niveau => (
                    <option key={niveau.id} value={niveau.id}>{niveau.nom_complet}</option>
                  ))}
                </select>
              </div>

              <div className="bookAdd-form-group">
                <label htmlFor="annee_academique" className="bookAdd-label">Année académique *</label>
                <select
                  id="annee_academique"
                  name="annee_academique"
                  value={formData.annee_academique}
                  onChange={handleInputChange}
                  className="bookAdd-select"
                  required
                >
                  <option value="">Sélectionner une année</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
            </div>

            <div className="bookAdd-form-row">
              <div className="bookAdd-form-group">
                <label htmlFor="fichier" className="bookAdd-label">Fichier du document</label>
                <div className="bookAdd-file-upload">
                  <input
                    type="file"
                    id="fichier"
                    name="fichier"
                    onChange={handleFileChange}
                    className="bookAdd-file-input"
                    accept=".pdf"
                  />
                  <label htmlFor="fichier" className="bookAdd-file-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="bookAdd-file-icon">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {formData.fichier ? formData.fichier.name : document.fichier ? 'Fichier actuel: ' + document.fichier.name : 'Choisir un nouveau fichier PDF'}
                  </label>
                </div>
                <div className="bookAdd-file-hint">
                  Format accepté: PDF (max 50MB). Laissez vide pour conserver le fichier actuel.
                </div>
              </div>

              <div className="bookAdd-form-group">
                <label htmlFor="image_couverture" className="bookAdd-label">Image de couverture</label>
                <div className="bookAdd-file-upload">
                  <input
                    type="file"
                    id="image_couverture"
                    name="image_couverture"
                    onChange={handleImageChange}
                    className="bookAdd-file-input"
                    accept="image/*"
                  />
                  <label htmlFor="image_couverture" className="bookAdd-file-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="bookAdd-file-icon">
                      <path d="M4 16L8 12L11 15L16 10L20 14V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {formData.image_couverture ? formData.image_couverture.name : document.image_couverture ? 'Image actuelle: ' + document.image_couverture.name : 'Choisir une nouvelle image'}
                  </label>
                </div>
                <div className="bookAdd-file-hint">
                  Formats: JPG, PNG, GIF, WEBP (max 5MB). Laissez vide pour conserver l'image actuelle.
                </div>
              </div>
            </div>

            {previewImage && (
              <div className="bookAdd-preview-container">
                <p className="bookAdd-preview-label">Aperçu de l'image:</p>
                <div className="bookAdd-image-preview">
                  <img src={previewImage} alt="Aperçu" className="bookAdd-preview-image" />
                </div>
              </div>
            )}

            <div className="bookAdd-author-info">
              <p className="bookAdd-author-text">
                Auteur: <span className="bookAdd-author-name">{user?.nom_complet || user?.first_name + ' ' + user?.last_name || 'Utilisateur'}</span>
              </p>
              {user?.matricule && (
                <p className="bookAdd-author-matricule">Matricule: {user.matricule}</p>
              )}
              <p className="bookAdd-author-note">
                Les modifications seront soumises pour approbation avant publication.
              </p>
            </div>

            <div className="bookAdd-actions">
              <button type="button" className="bookAdd-cancel-btn" onClick={handleCancel} disabled={loading}>
                Annuler
              </button>
              <button type="submit" className="bookAdd-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="bookAdd-spinner"></span>
                    Modification...
                  </>
                ) : (
                  'Modifier le document'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal amélioré pour les messages */}
      {modal.isOpen && (
        <div className="bookAdd-modal-overlay" onClick={hideModal}>
          <div className="bookAdd-modal-container" onClick={e => e.stopPropagation()}>
            <div className="bookAdd-modal-header">
              <div className={`bookAdd-modal-icon ${modal.type}`}>
                {modal.type === 'error' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
                {modal.type === 'success' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="9,12 12,15 22,4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
                {modal.type === 'info' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <div className="bookAdd-modal-header-text">
                <h3 className="bookAdd-modal-title">{modal.title}</h3>
                <button className="bookAdd-modal-close-btn" onClick={hideModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bookAdd-modal-body">
              <p className="bookAdd-modal-message">{modal.message}</p>
            </div>
            
            <div className="bookAdd-modal-footer">
              <button className={`bookAdd-modal-btn ${modal.type}`} onClick={hideModal}>
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookEdit;