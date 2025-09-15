import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocTelechargementComponent.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import Toast from '../Toast/Toast';
import api from '../../services/api';

const SkeletonCard = () => {
  return (
    <div className="docTelechargementComponent-documentCard skeleton-card">
      <div className="docTelechargementComponent-documentImageContainer skeleton-image">
        <div className="skeleton-shimmer"></div>
        <div className="docTelechargementComponent-levelBadge skeleton-badge">
          <div className="skeleton-text skeleton-text-small"></div>
        </div>
        <div className="docTelechargementComponent-typeBadge skeleton-badge">
          <div className="skeleton-text skeleton-text-small"></div>
        </div>
      </div>
      
      <div className="docTelechargementComponent-documentContent">
        <div className="docTelechargementComponent-documentMeta">
          <div className="skeleton-text skeleton-text-category"></div>
          <div className="skeleton-text skeleton-text-year"></div>
        </div>
        
        <div className="skeleton-text skeleton-text-title"></div>
        <div className="skeleton-text skeleton-text-title-short"></div>
        
        <div className="skeleton-text skeleton-text-description"></div>
        <div className="skeleton-text skeleton-text-description-short"></div>
        
        <div className="skeleton-text skeleton-text-author"></div>
        <div className="skeleton-text skeleton-text-download-date"></div>
        
        <div className="docTelechargementComponent-documentStats">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="docTelechargementComponent-statItem">
              <div className="docTelechargementComponent-statIcon skeleton-icon">
                <div className="skeleton-shimmer"></div>
              </div>
              <div className="skeleton-text skeleton-text-stat-number"></div>
              <div className="skeleton-text skeleton-text-stat-label"></div>
            </div>
          ))}
        </div>
        
        <div className="docTelechargementComponent-documentActions">
          <div className="skeleton-button skeleton-explore-btn">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-button skeleton-delete-btn">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoading = () => {
  return (
    <div className="docTelechargementComponent">
      <div className="docTelechargementComponent-header">
        <div className="docTelechargementComponent-titleSection">
          <h2 className="docTelechargementComponent-title">
            Mes <span className="docTelechargementComponent-highlight">Téléchargements</span>
          </h2>
        </div>

        <div className="docTelechargementComponent-searchSection">
          <div className="docTelechargementComponent-searchContainer skeleton-search">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="docTelechargementComponent-sortContainer skeleton-sort">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="docTelechargementComponent-resultsInfo">
        <div className="skeleton-text skeleton-text-results"></div>
      </div>

      <div className="docTelechargementComponent-documentsGrid">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

const DocTelechargementComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateTelechargement');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [downloadedDocuments, setDownloadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [documentsStats, setDocumentsStats] = useState({});
  const [categories, setCategories] = useState(['Toutes']);
  const [activeCategory, setActiveCategory] = useState('Toutes');
  
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const sortOptions = [
    { value: 'dateTelechargement', label: 'Date de téléchargement' },
    { value: 'titre', label: 'Titre' },
    { value: 'popularite', label: 'Popularité' },
    { value: 'niveau', label: 'Niveau' }
  ];

  // Fonction pour ajouter un toast
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  // Fonction pour supprimer un toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fonction pour mettre à jour un toast
  const updateToast = (id, message, type) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, message, type } : toast
    ));
  };

  // Fonction pour récupérer les téléchargements via l'API - VERSION CORRIGÉE
  const fetchDownloadedDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est connecté
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (!tokens.access) {
        setError('Vous devez être connecté pour voir vos téléchargements');
        setLoading(false);
        return;
      }
      
      console.log('Chargement des téléchargements...');
      
      // Récupérer les téléchargements de l'utilisateur connecté
      const response = await api.get('/action/telechargements/mes-telechargements/');
      const telechargementsData = response.data;
      
      console.log('Données téléchargements reçues:', telechargementsData); // Debug
      
      if (!telechargementsData || telechargementsData.length === 0) {
        setDownloadedDocuments([]);
        setLoading(false);
        return;
      }
      
      // Transformer les données pour correspondre au format attendu - VERSION CORRIGÉE
      const formattedDocuments = telechargementsData.map(telechargement => {
        console.log('Téléchargement traité:', {
          document_image_url: telechargement.document_image_url,
          document_image: telechargement.document_image,
          toutes_les_cles: Object.keys(telechargement)
        }); // Debug
        
        return {
          id: telechargement.document,
          titre: telechargement.document_titre,
          description: telechargement.document_description || "Aucune description disponible",
          // CORRECTION IMPORTANTE : Utilisez document_image_url car c'est ce que retourne votre serializer
          image_couverture: telechargement.document_image_url || null,
          niveau_nom: telechargement.document_niveau,
          categorie_nom: telechargement.document_categorie,
          type_document_nom: telechargement.document_type || "Document",
          annee_academique: telechargement.document_annee_academique,
          auteur_nom: telechargement.document_auteur_nom,
          auteur_matricule: telechargement.document_auteur_matricule,
          filiere_nom: telechargement.document_filiere,
          specialite_nom: telechargement.document_specialite,
          fichier_url: telechargement.document_fichier_url,
          date_telechargement: telechargement.date_telechargement,
          telechargement_id: telechargement.id, // ID du téléchargement pour la suppression
        };
      });
      
      console.log('Documents formatés:', formattedDocuments); // Debug
      
      setDownloadedDocuments(formattedDocuments);
      
      // Extraire les catégories uniques
      const uniqueCategories = ['Toutes', ...new Set(formattedDocuments.map(doc => doc.categorie_nom))];
      setCategories(uniqueCategories);
      
      // Récupérer les statistiques de tous les documents
      await fetchDocumentsStats(formattedDocuments.map(doc => doc.id));
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des téléchargements:', err);
      
      if (err.response?.status === 401) {
        setError('Vous devez être connecté pour voir vos téléchargements');
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      } else {
        setError('Erreur lors du chargement des téléchargements');
      }
      
      setLoading(false);
    }
  };

  // Fonction pour récupérer les statistiques des documents
  const fetchDocumentsStats = async (documentIds) => {
    try {
      const response = await api.get('/action/documents/stats/');
      const allStats = response.data;
      
      // Filtrer uniquement les statistiques des documents téléchargés
      const filteredStats = {};
      documentIds.forEach(id => {
        if (allStats[id]) {
          filteredStats[id] = allStats[id];
        }
      });
      
      setDocumentsStats(filteredStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Fonction pour supprimer un téléchargement
  const handleDeleteDownload = async (telechargementId, documentTitle) => {
    try {
      console.log('Suppression du téléchargement:', telechargementId);
      
      // Appeler l'API pour supprimer le téléchargement
      await api.delete(`/action/telechargements/${telechargementId}/`);
      
      // Retirer le document de la liste locale
      setDownloadedDocuments(prev => prev.filter(doc => doc.telechargement_id !== telechargementId));
      
      addToast(`"${documentTitle}" retiré de vos téléchargements`, 'success');

    } catch (error) {
      console.error('Erreur lors de la suppression du téléchargement:', error);
      addToast('Erreur lors de la suppression du téléchargement', 'error');
    }
  };

  // Fonction pour gérer le re-téléchargement
  const handleRedownload = async (documentId, documentTitle) => {
    let toastId = null;
    try {
      toastId = addToast(`Re-téléchargement de "${documentTitle}" en cours...`, 'info', 0);
      
      // Récupérer le fichier PDF
      const response = await api.get(`/documents/pdf/${documentId}/`, {
        responseType: 'blob'
      });
      
      // Créer et déclencher le téléchargement
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Mettre à jour les statistiques localement
      setDocumentsStats(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          downloads: (prev[documentId]?.downloads || 0) + 1,
        }
      }));
      
      if (toastId) {
        updateToast(toastId, `"${documentTitle}" téléchargé avec succès!`, 'success');
        setTimeout(() => removeToast(toastId), 3000);
      }
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      if (toastId) {
        updateToast(toastId, `Erreur lors du téléchargement de "${documentTitle}"`, 'error');
        setTimeout(() => removeToast(toastId), 3000);
      }
    }
  };

  // Fonction pour enregistrer une vue
  const handleViewDocument = async (documentId) => {
    try {
      await api.post('/action/vues/enregistrer-vue/', {
        document_id: documentId
      });
      
      setDocumentsStats(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          views: (prev[documentId]?.views || 0) + 1,
          has_viewed: true
        }
      }));
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
    }
    
    navigate(`/document/detail/${documentId}`);
  };

  // Fonction pour gérer l'ajout/suppression des favoris
  const handleToggleFavorite = async (documentId, documentTitle) => {
    try {
      const response = await api.post('/action/favoris/toggle-favori/', {
        document_id: documentId
      });
      
      const { status, is_favori } = response.data;
      
      // Mettre à jour les statistiques
      setDocumentsStats(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          favoris: (prev[documentId]?.favoris || 0) + (is_favori ? 1 : -1),
          has_liked: is_favori
        }
      }));
      
      addToast(
        is_favori 
          ? `"${documentTitle}" ajouté aux favoris` 
          : `"${documentTitle}" retiré des favoris`,
        'success'
      );

    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      addToast('Erreur lors de la modification des favoris', 'error');
    }
  };

  // Fonction pour gérer l'ouverture des commentaires
  const handleOpenComments = (documentId, documentTitle) => {
    setSelectedDocument({ id: documentId, title: documentTitle });
    setCommentSidebarOpen(true);
  };

  // Fonction pour mettre à jour les statistiques de commentaires
  const updateCommentStats = (documentId, newCommentCount) => {
    setDocumentsStats(prev => ({
      ...prev,
      [documentId]: {
        ...prev[documentId],
        comments: newCommentCount
      }
    }));
  };

  // Fonction pour formater les nombres
  const formatNumber = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number?.toString() || '0';
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchDownloadedDocuments();
  }, []);

  useEffect(() => {
    if (commentSidebarOpen || showDeleteModal) {
      document.body.classList.add('sidebarOpen');
    } else {
      document.body.classList.remove('sidebarOpen');
    }
    
    return () => {
      document.body.classList.remove('sidebarOpen');
    };
  }, [commentSidebarOpen, showDeleteModal]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleStatClick = (action, documentId, documentTitle, telechargementId = null) => {
    console.log(`Action: ${action} for document: ${documentId}`);
    
    switch(action) {
      case 'view':
        handleViewDocument(documentId);
        break;
      case 'like':
        handleToggleFavorite(documentId, documentTitle);
        break;
      case 'download':
        handleRedownload(documentId, documentTitle);
        break;
      case 'comment':
        handleOpenComments(documentId, documentTitle);
        break;
      case 'delete':
        setDocumentToDelete({ 
          id: documentId, 
          title: documentTitle, 
          telechargementId: telechargementId 
        });
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      handleDeleteDownload(documentToDelete.telechargementId, documentToDelete.title);
      setDocumentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setDocumentToDelete(null);
    setShowDeleteModal(false);
  };

  // Filtrage des documents
  const filteredDocuments = downloadedDocuments.filter(doc => {
    const matchesSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Toutes' || doc.categorie_nom === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Tri des documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch(sortBy) {
      case 'titre':
        return a.titre.localeCompare(b.titre);
      case 'popularite':
        const aViews = documentsStats[a.id]?.views || 0;
        const bViews = documentsStats[b.id]?.views || 0;
        return bViews - aViews;
      case 'niveau':
        return a.niveau_nom.localeCompare(b.niveau_nom);
      case 'dateTelechargement':
      default:
        return new Date(b.date_telechargement) - new Date(a.date_telechargement);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return <SkeletonLoading />;
  }

  if (error) {
    return (
      <div className="docTelechargementComponent">
        <div className="docTelechargementComponent-error">
          <div className="docTelechargementComponent-errorIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <div className="docTelechargementComponent-errorActions">
            <button 
              className="docTelechargementComponent-exploreBtn"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
            <button 
              className="docTelechargementComponent-exploreBtn"
              onClick={() => navigate('/documents')}
            >
              Explorer les documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="docTelechargementComponent">
      {/* Composant Toast */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="docTelechargementComponent-header">
        <div className="docTelechargementComponent-titleSection">
          <h2 className="docTelechargementComponent-title">
            Mes <span className="docTelechargementComponent-highlight">Téléchargements</span>
          </h2>
        </div>

        <div className="docTelechargementComponent-searchSection">
          <div className="docTelechargementComponent-searchContainer">
            <svg className="docTelechargementComponent-searchIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher dans mes téléchargements..."
              className="docTelechargementComponent-searchInput"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="docTelechargementComponent-sortContainer">
            <label className="docTelechargementComponent-sortLabel">Trier par:</label>
            <select 
              className="docTelechargementComponent-sortSelect"
              value={sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filtrage par catégories */}
      {categories.length > 1 && (
        <div className="docTelechargementComponent-categoriesNav">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`docTelechargementComponent-categoryBtn ${activeCategory === category ? 'docTelechargementComponent-active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="docTelechargementComponent-resultsInfo">
        <p className="docTelechargementComponent-resultsCount">
          {sortedDocuments.length} document{sortedDocuments.length > 1 ? 's' : ''} téléchargé{sortedDocuments.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="docTelechargementComponent-documentsGrid">
        {currentDocuments.map((document) => {
          const stats = {
            views: 0,
            favoris: 0, 
            downloads: 0,
            comments: 0,
            has_liked: false,
            has_downloaded: true, // Toujours true car ce sont les téléchargements
            has_viewed: false,
            ...documentsStats[document.id]
          };

          // Debug pour voir l'image
          console.log('Rendu document:', {
            id: document.id,
            titre: document.titre,
            image_couverture: document.image_couverture
          });

          return (
            <div key={document.id} className="docTelechargementComponent-documentCard">
              <div className="docTelechargementComponent-documentImageContainer">
                <img 
                  src={document.image_couverture || "/default-cover.jpg"} 
                  alt={document.titre}
                  className="docTelechargementComponent-documentImage"
                  onLoad={(e) => {
                    console.log(`Image chargée avec succès: ${e.target.src}`);
                  }}
                  onError={(e) => {
                    console.log(`Erreur chargement image: ${e.target.src}`);
                    e.target.src = "/default-cover.jpg";
                  }}
                />
                <div className="docTelechargementComponent-levelBadge">
                  {document.niveau_nom}
                </div>
                <div className="docTelechargementComponent-typeBadge">
                  {document.type_document_nom}
                </div>
                <div className="docTelechargementComponent-downloadIndicator">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </div>
              </div>
              
              <div className="docTelechargementComponent-documentContent">
                <div className="docTelechargementComponent-documentMeta">
                  <span className="docTelechargementComponent-category">{document.categorie_nom}</span>
                  <span className="docTelechargementComponent-year">{document.annee_academique}</span>
                </div>
                
                <h3 className="docTelechargementComponent-documentTitle">{document.titre}</h3>
                <p className="docTelechargementComponent-documentDescription">{document.description}</p>
                <p className="docTelechargementComponent-documentAuthor">Par {document.auteur_nom}</p>
                <p className="docTelechargementComponent-downloadDate">
                  Téléchargé le {formatDate(document.date_telechargement)}
                </p>
                
                <div className="docTelechargementComponent-documentStats">
                  <div 
                    className="docTelechargementComponent-statItem"
                    onClick={() => handleStatClick('view', document.id, document.titre)}
                  >
                    <div className="docTelechargementComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                    <span className="docTelechargementComponent-statNumber">{formatNumber(stats.views)}</span>
                    <span className="docTelechargementComponent-statLabel">VUES</span>
                  </div>
                  
                  <div 
                    className={`docTelechargementComponent-statItem ${stats.has_liked ? 'docTelechargementComponent-liked' : ''}`}
                    onClick={() => handleStatClick('like', document.id, document.titre)}
                  >
                    <div className="docTelechargementComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="docTelechargementComponent-statNumber">{formatNumber(stats.favoris)}</span>
                    <span className="docTelechargementComponent-statLabel">J'AIME</span>
                  </div>
                  
                  <div 
                    className="docTelechargementComponent-statItem"
                    onClick={() => handleStatClick('download', document.id, document.titre)}
                  >
                    <div className="docTelechargementComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                    </div>
                    <span className="docTelechargementComponent-statNumber">{formatNumber(stats.downloads)}</span>
                    <span className="docTelechargementComponent-statLabel">TÉLÉCH.</span>
                  </div>
                  
                  <div 
                    className="docTelechargementComponent-statItem"
                    onClick={() => handleStatClick('comment', document.id, document.titre)}
                  >
                    <div className="docTelechargementComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                      </svg>
                    </div>
                    <span className="docTelechargementComponent-statNumber">{formatNumber(stats.comments)}</span>
                    <span className="docTelechargementComponent-statLabel">COMMENT</span>
                  </div>
                </div>

                <div className="docTelechargementComponent-documentActions">
                  <button 
                    className="docTelechargementComponent-exploreBtn"
                    onClick={() => handleViewDocument(document.id)}
                  >
                    <svg className="docTelechargementComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                    </svg>
                    Explorer avec l'IA
                  </button>

                  <button 
                    className="docTelechargementComponent-actionBtn docTelechargementComponent-deleteBtn"
                    onClick={() => handleStatClick('delete', document.id, document.titre, document.telechargement_id)}
                    title="Supprimer le téléchargement"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun document */}
      {currentDocuments.length === 0 && !loading && (
        <div className="docTelechargementComponent-emptyState">
          <svg className="docTelechargementComponent-emptyIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <h3 className="docTelechargementComponent-emptyTitle">
            {searchTerm || activeCategory !== 'Toutes' 
              ? 'Aucun résultat trouvé' 
              : 'Aucun document téléchargé'}
          </h3>
          <p className="docTelechargementComponent-emptyDescription">
            {searchTerm || activeCategory !== 'Toutes'
              ? 'Essayez de modifier vos critères de recherche ou de filtrage.'
              : 'Vous n\'avez pas encore téléchargé de documents. Explorez la bibliothèque pour trouver des ressources intéressantes.'}
          </p>
          {(!searchTerm && activeCategory === 'Toutes') && (
            <button 
              className="docTelechargementComponent-exploreBtn"
              onClick={() => navigate('/documents')}
            >
              Explorer les documents
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="docTelechargementComponent-paginationContainer">
          <div className="docTelechargementComponent-pagination">
            <button 
              className={`docTelechargementComponent-pageBtn ${currentPage === 1 ? 'docTelechargementComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`docTelechargementComponent-pageBtn ${currentPage === index + 1 ? 'docTelechargementComponent-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`docTelechargementComponent-pageBtn ${currentPage === totalPages ? 'docTelechargementComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        documentTitle={documentToDelete?.title}
        type="download"
      />

      {/* Sidebar de commentaires */}
      <CommentSidebar
        isOpen={commentSidebarOpen}
        onClose={() => setCommentSidebarOpen(false)}
        courseId={selectedDocument?.id}
        courseTitle={selectedDocument?.title}
        onCommentUpdate={updateCommentStats}
      />
    </div>
  );
};

export default DocTelechargementComponent;