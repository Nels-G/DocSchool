import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocFavorisComponent.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';
import Toast from '../Toast/Toast';
import api from '../../services/api'; // Votre service API

const SkeletonCard = () => {
  return (
    <div className="DocFavorisComponent-courseCard skeleton-card">
      <div className="DocFavorisComponent-courseImageContainer skeleton-image">
        <div className="skeleton-shimmer"></div>
        <div className="DocFavorisComponent-levelBadge skeleton-badge">
          <div className="skeleton-text skeleton-text-small"></div>
        </div>
        <div className="DocFavorisComponent-typeBadge skeleton-badge">
          <div className="skeleton-text skeleton-text-small"></div>
        </div>
      </div>
      
      <div className="DocFavorisComponent-courseContent">
        <div className="DocFavorisComponent-courseMeta">
          <div className="skeleton-text skeleton-text-category"></div>
          <div className="skeleton-text skeleton-text-year"></div>
        </div>
        
        <div className="skeleton-text skeleton-text-title"></div>
        <div className="skeleton-text skeleton-text-title-short"></div>
        
        <div className="skeleton-text skeleton-text-description"></div>
        <div className="skeleton-text skeleton-text-description-short"></div>
        
        <div className="skeleton-text skeleton-text-author"></div>
        
        <div className="DocFavorisComponent-courseStats">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="DocFavorisComponent-statItem">
              <div className="DocFavorisComponent-statIcon skeleton-icon">
                <div className="skeleton-shimmer"></div>
              </div>
              <div className="skeleton-text skeleton-text-stat-number"></div>
              <div className="skeleton-text skeleton-text-stat-label"></div>
            </div>
          ))}
        </div>
        
        <div className="DocFavorisComponent-exploreBtn skeleton-button">
          <div className="skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoading = () => {
  return (
    <div className="DocFavorisComponent">
      <div className="DocFavorisComponent-header">
        <h2 className="DocFavorisComponent-title">
          Mes <span className="DocFavorisComponent-highlight">documents favoris</span>
        </h2>
        
        <div className="DocFavorisComponent-categoriesNav">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="DocFavorisComponent-categoryBtn skeleton-category-btn">
              <div className="skeleton-text skeleton-text-category-btn"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="DocFavorisComponent-coursesGrid">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="DocFavorisComponent-paginationContainer">
        <div className="DocFavorisComponent-pagination">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="DocFavorisComponent-pageBtn skeleton-page-btn">
              <div className="skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocFavorisComponent = () => {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [favoriteDocuments, setFavoriteDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [documentsStats, setDocumentsStats] = useState({});
  const [categories, setCategories] = useState(['Toutes']);
  
  const navigate = useNavigate();
  const itemsPerPage = 9;

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

  // Fonction pour récupérer les documents favoris via l'API
  const fetchFavoriteDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est connecté
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (!tokens.access) {
        setError('Vous devez être connecté pour voir vos documents favoris');
        setLoading(false);
        return;
      }
      
      console.log('Chargement des documents favoris...');
      
      // Récupérer les favoris de l'utilisateur connecté
      const response = await api.get('/action/favoris/mes-favoris/');
      const favorisData = response.data;
      
      if (!favorisData || favorisData.length === 0) {
        setFavoriteDocuments([]);
        setLoading(false);
        return;
      }
      
      // Transformer les données pour correspondre au format attendu
      const formattedDocuments = favorisData.map(favori => ({
        id: favori.document,
        titre: favori.document_titre,
        description: favori.document_description || "Aucune description disponible",
        image_couverture: favori.document_image_url,
        niveau_nom: favori.document_niveau,
        categorie_nom: favori.document_categorie,
        type_document_nom: favori.document_type || "Document",
        annee_academique: favori.document_annee_academique,
        auteur_nom: favori.document_auteur_nom,
        auteur_matricule: favori.document_auteur_matricule,
        filiere_nom: favori.document_filiere,
        specialite_nom: favori.document_specialite,
        fichier_url: favori.document_fichier_url,
        date_ajout_favoris: favori.date_ajout,
      }));
      
      setFavoriteDocuments(formattedDocuments);
      
      // Extraire les catégories uniques
      const uniqueCategories = ['Toutes', ...new Set(formattedDocuments.map(doc => doc.categorie_nom))];
      setCategories(uniqueCategories);
      
      // Récupérer les statistiques de tous les documents
      await fetchDocumentsStats(formattedDocuments.map(doc => doc.id));
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des documents favoris:', err);
      
      if (err.response?.status === 401) {
        setError('Vous devez être connecté pour voir vos documents favoris');
        // Rediriger vers la page de connexion si nécessaire
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      } else {
        setError('Erreur lors du chargement des documents favoris');
      }
      
      setLoading(false);
    }
  };

  // Fonction pour récupérer les statistiques des documents
  const fetchDocumentsStats = async (documentIds) => {
    try {
      // Récupérer les statistiques de tous les documents
      const response = await api.get('/action/documents/stats/');
      const allStats = response.data;
      
      // Filtrer uniquement les statistiques des documents favoris
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

  // Fonction pour retirer des favoris
  const handleRemoveFromFavorites = async (documentId, documentTitle) => {
    try {
      console.log('Retirer des favoris:', documentId);
      
      // Appeler l'API pour toggle le favori (cela va le retirer)
      await api.post('/action/favoris/toggle-favori/', {
        document_id: documentId
      });
      
      // Retirer le document de la liste locale
      setFavoriteDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      // Mettre à jour les statistiques
      setDocumentsStats(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          favoris: Math.max((prev[documentId]?.favoris || 1) - 1, 0),
          has_liked: false
        }
      }));

      addToast(`"${documentTitle}" retiré des favoris`, 'success');

    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      addToast('Erreur lors de la suppression des favoris', 'error');
    }
  };

  // Fonction pour gérer le téléchargement
  const handleDownload = async (courseId, courseTitle) => {
    let toastId = null;
    try {
      toastId = addToast(`Téléchargement de "${courseTitle}" en cours...`, 'info', 0);
      
      // Enregistrer le téléchargement
      await api.post('/action/telechargements/enregistrer-telechargement/', {
        document_id: courseId
      });
      
      // Récupérer le fichier PDF
      const response = await api.get(`/documents/pdf/${courseId}/`, {
        responseType: 'blob'
      });
      
      // Créer et déclencher le téléchargement
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${courseTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Mettre à jour les statistiques localement
      setDocumentsStats(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          downloads: (prev[courseId]?.downloads || 0) + 1,
          has_downloaded: true
        }
      }));
      
      if (toastId) {
        updateToast(toastId, `"${courseTitle}" téléchargé avec succès!`, 'success');
        setTimeout(() => removeToast(toastId), 3000);
      }
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      if (toastId) {
        updateToast(toastId, `Erreur lors du téléchargement de "${courseTitle}"`, 'error');
        setTimeout(() => removeToast(toastId), 3000);
      }
    }
  };

  // Fonction pour enregistrer une vue
  const handleViewDocument = async (courseId) => {
    try {
      // Enregistrer la vue
      await api.post('/action/vues/enregistrer-vue/', {
        document_id: courseId
      });
      
      // Mettre à jour les statistiques de vue
      setDocumentsStats(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          views: (prev[courseId]?.views || 0) + 1,
          has_viewed: true
        }
      }));
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
    }
    
    navigate(`/document/detail/${courseId}`);
  };

  // Fonction pour gérer l'ouverture des commentaires
  const handleOpenComments = (courseId, courseTitle) => {
    setSelectedCourse({ id: courseId, title: courseTitle });
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

  // Fonction pour fermer le sidebar de commentaires
  const handleCloseSidebar = () => {
    setCommentSidebarOpen(false);
    setSelectedCourse(null);
  };

  // Fonction pour formater les nombres
  const formatNumber = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number?.toString() || '0';
  };

  useEffect(() => {
    fetchFavoriteDocuments();
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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatClick = (action, courseId, courseTitle) => {
    console.log('Action: ' + action + ' for course: ' + courseId);
    
    switch(action) {
      case 'view':
        handleViewDocument(courseId);
        break;
      case 'remove-favorite':
        handleRemoveFromFavorites(courseId, courseTitle);
        break;
      case 'download':
        handleDownload(courseId, courseTitle);
        break;
      case 'comment':
        handleOpenComments(courseId, courseTitle);
        break;
      default:
        break;
    }
  };

  // Filtrer les documents par catégorie
  const filteredDocuments = activeCategory === 'Toutes' 
    ? favoriteDocuments 
    : favoriteDocuments.filter(doc => doc.categorie_nom === activeCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return <SkeletonLoading />;
  }

  if (error) {
    return (
      <div className="DocFavorisComponent">
        <div className="DocFavorisComponent-error">
          <div className="DocFavorisComponent-errorIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <div className="DocFavorisComponent-errorActions">
            <button 
              className="DocFavorisComponent-exploreBtn"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
            <button 
              className="DocFavorisComponent-exploreBtn"
              onClick={() => navigate('/documents')}
            >
              Explorer les documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (favoriteDocuments.length === 0) {
    return (
      <div className="DocFavorisComponent">
        <div className="DocFavorisComponent-empty">
          <div className="DocFavorisComponent-emptyIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3>Aucun document dans vos favoris</h3>
          <p>Commencez à ajouter des documents à vos favoris pour les retrouver facilement ici.</p>
          <button 
            className="DocFavorisComponent-exploreBtn"
            onClick={() => navigate('/documents')}
          >
            Explorer les documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="DocFavorisComponent">
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

      <div className="DocFavorisComponent-header">
        <h2 className="DocFavorisComponent-title">
          Mes <span className="DocFavorisComponent-highlight">documents favoris</span>
        </h2>
        <p className="DocFavorisComponent-subtitle">
          {favoriteDocuments.length} document{favoriteDocuments.length > 1 ? 's' : ''} dans vos favoris
        </p>
        
        <div className="DocFavorisComponent-categoriesNav">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`DocFavorisComponent-categoryBtn ${activeCategory === category ? 'DocFavorisComponent-active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="DocFavorisComponent-coursesGrid">
        {currentDocuments.map((document) => {
          const stats = {
            views: 0,
            favoris: 0, 
            downloads: 0,
            comments: 0,
            has_liked: true, // Toujours true car ce sont les favoris
            has_downloaded: false,
            has_viewed: false,
            ...documentsStats[document.id]
          };
          
          return (
            <div key={document.id} className="DocFavorisComponent-courseCard">
              <div className="DocFavorisComponent-courseImageContainer">
                <img 
                  src={document.image_couverture || "/default-cover.jpg"} 
                  alt={document.titre}
                  className="DocFavorisComponent-courseImage"
                  onError={(e) => {
                    e.target.src = "/default-cover.jpg";
                  }}
                />
                <div className="DocFavorisComponent-levelBadge">
                  {document.niveau_nom}
                </div>
                <div className="DocFavorisComponent-typeBadge">
                  {document.type_document_nom}
                </div>
                <div className="DocFavorisComponent-favoriteIndicator">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              
              <div className="DocFavorisComponent-courseContent">
                <div className="DocFavorisComponent-courseMeta">
                  <span className="DocFavorisComponent-category">{document.categorie_nom}</span>
                  <span className="DocFavorisComponent-year">{document.annee_academique}</span>
                </div>
                
                <h3 className="DocFavorisComponent-courseTitle">{document.titre}</h3>
                <p className="DocFavorisComponent-courseDescription">{document.description}</p>
                <p className="DocFavorisComponent-courseAuthor">Par {document.auteur_nom}</p>
                
                <div className="DocFavorisComponent-courseStats">
                  <div 
                    className="DocFavorisComponent-statItem"
                    onClick={() => handleStatClick('view', document.id, document.titre)}
                  >
                    <div className="DocFavorisComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                    <span className="DocFavorisComponent-statNumber">{formatNumber(stats.views)}</span>
                    <span className="DocFavorisComponent-statLabel">VUES</span>
                  </div>
                  
                  <div 
                    className="DocFavorisComponent-statItem DocFavorisComponent-removeFavorite"
                    onClick={() => handleStatClick('remove-favorite', document.id, document.titre)}
                    title="Retirer des favoris"
                  >
                    <div className="DocFavorisComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </div>
                    <span className="DocFavorisComponent-statNumber">{formatNumber(stats.favoris)}</span>
                    <span className="DocFavorisComponent-statLabel">RETIRER</span>
                  </div>
                  
                  <div 
                    className="DocFavorisComponent-statItem"
                    onClick={() => handleStatClick('download', document.id, document.titre)}
                  >
                    <div className="DocFavorisComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                    </div>
                    <span className="DocFavorisComponent-statNumber">{formatNumber(stats.downloads)}</span>
                    <span className="DocFavorisComponent-statLabel">TÉLÉCH.</span>
                  </div>
                  
                  <div 
                    className="DocFavorisComponent-statItem"
                    onClick={() => handleStatClick('comment', document.id, document.titre)}
                  >
                    <div className="DocFavorisComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                      </svg>
                    </div>
                    <span className="DocFavorisComponent-statNumber">{formatNumber(stats.comments)}</span>
                    <span className="DocFavorisComponent-statLabel">COMMENT</span>
                  </div>
                </div>
                
                <button 
                  className="DocFavorisComponent-exploreBtn"
                  onClick={() => handleViewDocument(document.id)}
                >
                  <svg className="DocFavorisComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                  </svg>
                  Explorer avec l'IA
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="DocFavorisComponent-paginationContainer">
          <div className="DocFavorisComponent-pagination">
            <button 
              className={`DocFavorisComponent-pageBtn ${currentPage === 1 ? 'DocFavorisComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`DocFavorisComponent-pageBtn ${currentPage === index + 1 ? 'DocFavorisComponent-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`DocFavorisComponent-pageBtn ${currentPage === totalPages ? 'DocFavorisComponent-disabled' : ''}`}
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
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
        onCommentUpdate={updateCommentStats}
      />
    </div>
  );
};

export default DocFavorisComponent;