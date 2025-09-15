import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mesDocumentsComponent.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import BookAdd from '../modal/bookAdd';
import Toast from '../Toast/Toast';
import api from '../../services/api';

const MesDocumentsComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAjout');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // États pour le modal de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  
  // États pour les données API
  const [myDocuments, setMyDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Nouveaux états pour les statistiques et toasts
  const [documentsStats, setDocumentsStats] = useState({});
  const [userFavorites, setUserFavorites] = useState(new Set());
  const [toasts, setToasts] = useState([]);
  
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const sortOptions = [
    { value: 'dateAjout', label: 'Date d\'ajout' },
    { value: 'titre', label: 'Titre' },
    { value: 'popularite', label: 'Popularité' },
    { value: 'niveau', label: 'Niveau' }
  ];

  // Fonctions pour gérer les toasts
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

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id, message, type) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, message, type } : toast
    ));
  };

  // Fonction pour récupérer les statistiques d'un document
  const fetchDocumentStats = async (documentId) => {
    try {
      const response = await api.get(`/action/documents/${documentId}/stats/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des stats pour le document ${documentId}:`, error);
      return {
        views: 0,
        downloads: 0,
        favoris: 0,
        comments: 0,
        has_liked: false,
        has_downloaded: false,
        has_viewed: false
      };
    }
  };

  // Fonction pour récupérer les statistiques de tous les documents
  const fetchAllDocumentsStats = async (documentsList) => {
    const statsMap = {};
    const favoritesSet = new Set();
    
    await Promise.all(
      documentsList.map(async (doc) => {
        const stats = await fetchDocumentStats(doc.id);
        statsMap[doc.id] = stats;
        
        if (stats.has_liked) {
          favoritesSet.add(doc.id);
        }
      })
    );
    
    setDocumentsStats(statsMap);
    setUserFavorites(favoritesSet);
  };

  // Fonction pour enregistrer une vue
  const enregistrerVue = async (documentId) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.access) {
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
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
    }
  };

  // Fonction pour gérer les favoris
  const handleToggleFavorite = async (documentId, documentTitle) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (!tokens.access) {
        addToast('Vous devez être connecté pour ajouter aux favoris', 'error');
        return;
      }

      const response = await api.post('/action/favoris/toggle-favori/', {
        document_id: documentId
      });

      const isNowFavorite = response.data.is_favori;
      
      setUserFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isNowFavorite) {
          newFavorites.add(documentId);
        } else {
          newFavorites.delete(documentId);
        }
        return newFavorites;
      });

      setDocumentsStats(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          favoris: isNowFavorite 
            ? (prev[documentId]?.favoris || 0) + 1 
            : Math.max((prev[documentId]?.favoris || 1) - 1, 0),
          has_liked: isNowFavorite
        }
      }));

      const message = isNowFavorite 
        ? `"${documentTitle}" ajouté aux favoris`
        : `"${documentTitle}" retiré des favoris`;
      addToast(message, 'success');

    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
      addToast('Erreur lors de la gestion des favoris', 'error');
    }
  };

  // Fonction pour gérer le téléchargement
  const handleDownload = async (documentId, documentTitle) => {
    let toastId = null;
    try {
      toastId = addToast(`Téléchargement de "${documentTitle}" en cours...`, 'info', 0);
      
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.access) {
        await api.post('/action/telechargements/enregistrer-telechargement/', {
          document_id: documentId
        });
        
        setDocumentsStats(prev => ({
          ...prev,
          [documentId]: {
            ...prev[documentId],
            downloads: (prev[documentId]?.downloads || 0) + 1,
            has_downloaded: true
          }
        }));
      }
      
      const response = await api.get(`/documents/documents/${documentId}/`);
      const pdfUrl = response.data.fichier;
      
      const downloadResponse = await fetch(pdfUrl);
      const blob = await downloadResponse.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${documentTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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

  // Fonction pour gérer l'ouverture des commentaires
  const handleOpenComments = (documentId, documentTitle) => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (!tokens.access) {
      addToast('Vous devez être connecté pour voir les commentaires', 'error');
      return;
    }
    
    setSelectedDocument({ id: documentId, title: documentTitle });
    setCommentSidebarOpen(true);
  };

  // Fonction pour fermer le sidebar de commentaires
  const handleCloseSidebar = () => {
    setCommentSidebarOpen(false);
    setSelectedDocument(null);
    
    if (selectedDocument?.id) {
      fetchDocumentStats(selectedDocument.id).then(stats => {
        setDocumentsStats(prev => ({
          ...prev,
          [selectedDocument.id]: stats
        }));
      });
    }
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
    return number.toString();
  };

  // Récupérer les informations de l'utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erreur parsing user data:', e);
      }
    }
  }, []);

  // Fonction pour récupérer les documents de l'utilisateur
  const fetchMyDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/documents/documents/');
      
      const transformedDocuments = response.data.map(doc => ({
        id: doc.id,
        title: doc.titre,
        description: doc.description || "Aucune description disponible",
        image: doc.image_couverture || "/miniature.png",
        level: doc.niveau_nom || "Non spécifié",
        category: doc.categorie_nom || "Non spécifiée",
        documentType: doc.type_document_nom || "Non spécifié",
        academicYear: doc.annee_academique || "Non spécifiée",
        dateAdded: doc.date_upload,
        author: doc.auteur_nom || "Moi", // Utilisation du nom d'auteur de l'API ou "Moi" par défaut
        status: doc.statut,
        isPublic: doc.est_public,
        stats: {
          views: "0",
          likes: "0",
          downloads: "0",
          comments: "0"
        }
      }));
      
      setMyDocuments(transformedDocuments);
      
      // Récupérer les statistiques pour tous les documents
      await fetchAllDocumentsStats(transformedDocuments);
    } catch (err) {
      console.error('Erreur lors de la récupération des documents:', err);
      setError('Erreur lors du chargement des documents');
      setMyDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les documents au montage du composant
  useEffect(() => {
    fetchMyDocuments();
  }, []);

  useEffect(() => {
    if (commentSidebarOpen) {
      document.body.classList.add('sidebarOpen');
    } else {
      document.body.classList.remove('sidebarOpen');
    }
    
    return () => {
      document.body.classList.remove('sidebarOpen');
    };
  }, [commentSidebarOpen]);

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

  const handleStatClick = (action, documentId, documentTitle) => {
    console.log(`Action: ${action} for document: ${documentId}`);
    
    switch(action) {
      case 'view':
        // Enregistrer la vue et naviguer vers la page détail
        enregistrerVue(documentId);
        navigate(`/document/detail/${documentId}`);
        break;
      case 'like':
        handleToggleFavorite(documentId, documentTitle);
        break;
      case 'download':
        handleDownload(documentId, documentTitle);
        break;
      case 'comment':
        handleOpenComments(documentId, documentTitle);
        break;
      case 'delete':
        const docToDelete = myDocuments.find(doc => doc.id === documentId);
        if (docToDelete) {
          setDocumentToDelete(docToDelete);
          setShowDeleteModal(true);
        }
        break;
      case 'edit':
        console.log(`Édition du document ${documentId}`);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        await api.delete(`/documents/documents/${documentToDelete.id}/`);
        
        console.log(`Suppression confirmée du document ${documentToDelete.id}`);
        
        setMyDocuments(prevDocs => 
          prevDocs.filter(doc => doc.id !== documentToDelete.id)
        );
        
        setDocumentToDelete(null);
        setShowDeleteModal(false);
        
        addToast(`"${documentToDelete.title}" a été supprimé avec succès`, 'success');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        addToast('Erreur lors de la suppression du document', 'error');
      }
    }
  };

  const handleExploreAI = (documentId, documentTitle) => {
    console.log(`Explorer avec l'IA: ${documentTitle}`);
    // Enregistrer la vue avant la navigation
    enregistrerVue(documentId);
    // Naviguer vers la page de détail du document
    navigate(`/document/detail/${documentId}`);
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    fetchMyDocuments();
    setShowUploadModal(false);
    addToast('Document ajouté avec succès', 'success');
  };

  // Filtrage des documents
  const filteredDocuments = myDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Tri des documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch(sortBy) {
      case 'titre':
        return a.title.localeCompare(b.title);
      case 'popularite':
        const aStats = documentsStats[a.id] || { views: 0 };
        const bStats = documentsStats[b.id] || { views: 0 };
        return bStats.views - aStats.views;
      case 'niveau':
        return a.level.localeCompare(b.level);
      case 'dateAjout':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_attente': { label: 'En attente', class: 'status-pending' },
      'approuve': { label: 'Approuvé', class: 'status-approved' },
      'rejete': { label: 'Rejeté', class: 'status-rejected' }
    };
    
    const config = statusConfig[status] || statusConfig['en_attente'];
    
    return (
      <span className={`mesDocumentsComponent-statusBadge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="mesDocumentsComponent">
        <div className="mesDocumentsComponent-loading">
          <div className="mesDocumentsComponent-spinner"></div>
          <p>Chargement de vos documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mesDocumentsComponent">
        <div className="mesDocumentsComponent-error">
          <p>{error}</p>
          <button onClick={fetchMyDocuments} className="mesDocumentsComponent-retryBtn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mesDocumentsComponent">
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

      <div className="mesDocumentsComponent-header">
        <div className="mesDocumentsComponent-titleSection">
          <h2 className="mesDocumentsComponent-title">
            Mes <span className="mesDocumentsComponent-highlight">Documents</span>
          </h2>
        </div>

        <div className="mesDocumentsComponent-searchSection">
          <div className="mesDocumentsComponent-searchContainer">
            <svg className="mesDocumentsComponent-searchIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher dans mes documents..."
              className="mesDocumentsComponent-searchInput"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="mesDocumentsComponent-sortContainer">
            <label className="mesDocumentsComponent-sortLabel">Trier par:</label>
            <select 
              className="mesDocumentsComponent-sortSelect"
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

      <div className="mesDocumentsComponent-resultsInfo">
        <p className="mesDocumentsComponent-resultsCount">
          {sortedDocuments.length} document{sortedDocuments.length > 1 ? 's' : ''} trouvé{sortedDocuments.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Message si aucun document */}
      {currentDocuments.length === 0 && !loading && (
        <div className="mesDocumentsComponent-emptyState">
          <svg className="mesDocumentsComponent-emptyIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <h3 className="mesDocumentsComponent-emptyTitle">
            {myDocuments.length === 0 ? 'Vous n\'avez publié aucun document' : 'Aucun document trouvé'}
          </h3>
          <p className="mesDocumentsComponent-emptyDescription">
            {myDocuments.length === 0 
              ? 'Commencez à partager vos connaissances avec la communauté !'
              : 'Aucun document ne correspond aux critères de recherche sélectionnés.'
            }
          </p>
          <button 
            className="mesDocumentsComponent-uploadBtn"
            onClick={handleUpload}
          >
            {myDocuments.length === 0 ? 'Publier votre premier document' : 'Ajouter un document'}
          </button>
        </div>
      )}

      <div className="mesDocumentsComponent-documentsGrid">
        {currentDocuments.map((document) => {
          // Récupérer les statistiques réelles depuis l'API
          const stats = {
            views: 0,
            favoris: 0, 
            downloads: 0,
            comments: 0,
            ...documentsStats[document.id]
          };
          const isFavorite = userFavorites.has(document.id);

          return (
            <div key={document.id} className="mesDocumentsComponent-documentCard">
              <div className="mesDocumentsComponent-documentImageContainer">
                <img 
                  src={document.image} 
                  alt={document.title}
                  className="mesDocumentsComponent-documentImage"
                  onError={(e) => {
                    e.target.src = "/miniature.png";
                  }}
                />
                <div className="mesDocumentsComponent-levelBadge">
                  {document.level}
                </div>
                <div className="mesDocumentsComponent-typeBadge">
                  {document.documentType}
                </div>
                <div className="mesDocumentsComponent-statusContainer">
                  {getStatusBadge(document.status)}
                </div>
              </div>
              
              <div className="mesDocumentsComponent-documentContent">
                <div className="mesDocumentsComponent-documentMeta">
                  <span className="mesDocumentsComponent-category">{document.category}</span>
                  <span className="mesDocumentsComponent-year">{document.academicYear}</span>
                </div>
                
                <h3 className="mesDocumentsComponent-documentTitle">{document.title}</h3>
                <p className="mesDocumentsComponent-documentDescription">{document.description}</p>
                
                {/* Ajout de l'auteur */}
                <p className="mesDocumentsComponent-documentAuthor">Par {document.author}</p>
                
                <div className="mesDocumentsComponent-documentStats">
                  <div 
                    className="mesDocumentsComponent-statItem"
                    onClick={() => handleStatClick('view', document.id, document.title)}
                  >
                    <div className="mesDocumentsComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                    <span className="mesDocumentsComponent-statNumber">{formatNumber(stats.views)}</span>
                    <span className="mesDocumentsComponent-statLabel">VUES</span>
                  </div>
                  
                  <div 
                    className={`mesDocumentsComponent-statItem ${isFavorite ? 'favorite-active' : ''}`}
                    onClick={() => handleStatClick('like', document.id, document.title)}
                  >
                    <div className="mesDocumentsComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="mesDocumentsComponent-statNumber">{formatNumber(stats.favoris)}</span>
                    <span className="mesDocumentsComponent-statLabel">J'AIME</span>
                  </div>
                  
                  <div 
                    className="mesDocumentsComponent-statItem"
                    onClick={() => handleStatClick('download', document.id, document.title)}
                  >
                    <div className="mesDocumentsComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                    </div>
                    <span className="mesDocumentsComponent-statNumber">{formatNumber(stats.downloads)}</span>
                    <span className="mesDocumentsComponent-statLabel">TÉLÉCH.</span>
                  </div>
                  
                  <div 
                    className="mesDocumentsComponent-statItem"
                    onClick={() => handleStatClick('comment', document.id, document.title)}
                  >
                    <div className="mesDocumentsComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                      </svg>
                    </div>
                    <span className="mesDocumentsComponent-statNumber">{formatNumber(stats.comments)}</span>
                    <span className="mesDocumentsComponent-statLabel">COMMENT</span>
                  </div>
                </div>

                <div className="mesDocumentsComponent-documentActions">
                  <button 
                    className="mesDocumentsComponent-exploreBtn"
                    onClick={() => handleExploreAI(document.id, document.title)}
                  >
                    <svg className="mesDocumentsComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                    </svg>
                    Explorer avec l'IA
                  </button>

                  <div className="mesDocumentsComponent-actionButtons">
                    <button 
                      className="mesDocumentsComponent-actionBtn mesDocumentsComponent-editBtn"
                      onClick={() => handleStatClick('edit', document.id, document.title)}
                      title="Modifier"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                      </svg>
                    </button>
                    
                    <button 
                      className="mesDocumentsComponent-actionBtn mesDocumentsComponent-deleteBtn"
                      onClick={() => handleStatClick('delete', document.id, document.title)}
                      title="Supprimer"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mesDocumentsComponent-paginationContainer">
          <div className="mesDocumentsComponent-pagination">
            <button 
              className={`mesDocumentsComponent-pageBtn ${currentPage === 1 ? 'mesDocumentsComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`mesDocumentsComponent-pageBtn ${currentPage === index + 1 ? 'mesDocumentsComponent-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`mesDocumentsComponent-pageBtn ${currentPage === totalPages ? 'mesDocumentsComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Sidebar de commentaires */}
      <CommentSidebar
        isOpen={commentSidebarOpen}
        onClose={handleCloseSidebar}
        courseId={selectedDocument?.id}
        courseTitle={selectedDocument?.title}
        onCommentUpdate={updateCommentStats}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        documentTitle={documentToDelete?.title || ''}
        type="document"
      />

      {/* Modal d'ajout de document */}
      <BookAdd
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        user={user}
      />
    </div>
  );
};

export default MesDocumentsComponent;