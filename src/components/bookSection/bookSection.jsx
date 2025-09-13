import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookSection.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';
import api from '../../services/api';
import Toast from '../Toast/Toast';

const BookSection = () => {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  // État pour les statistiques en temps réel
  const [documentsStats, setDocumentsStats] = useState({});
  // État pour les favoris de l'utilisateur
  const [userFavorites, setUserFavorites] = useState(new Set());
  
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const categories = [
    'Toutes',
    'Audit et Contrôle de Gestion',
    'Finance',
    'Marketing',
    'Ressources Humaines',
    'Commerce International',
    'Tout voir'
  ];

  // Données fictives de secours
  const fakeCourses = [
    {
      id: 1,
      titre: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
      description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion",
      image_couverture: "/Kotlin.jpg",
      niveau_nom: "Master 2",
      categorie_nom: "Finance",
      type_document_nom: "Cours",
      annee_academique: "2024-2025",
      auteur_nom: "Prof. Martin",
    },
    {
      id: 2,
      titre: "Introduction au Calcul",
      description: "Cours de base en mathématiques pour débutants",
      image_couverture: "/miniature.png",
      niveau_nom: "Master 1",
      categorie_nom: "Finance",
      type_document_nom: "Cours",
      annee_academique: "2024-2025",
      auteur_nom: "Prof. Dubois",
    },
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

  // Fonction pour récupérer les statistiques d'un document (mise à jour avec commentaires)
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
        
        // Ajouter aux favoris si l'utilisateur a liké
        if (stats.has_liked) {
          favoritesSet.add(doc.id);
        }
      })
    );
    
    setDocumentsStats(statsMap);
    setUserFavorites(favoritesSet);
  };

  // Fonction pour récupérer les documents depuis l'API
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      console.log('Tentative de récupération des documents depuis l\'API...');
      
      try {
        const publicResponse = await api.get('/documents/documents/public/');
        console.log('Réponse API reçue avec succès');
        
        if (Array.isArray(publicResponse.data)) {
          console.log(publicResponse.data.length + ' document(s) récupéré(s) depuis l\'API');
          
          // Nettoyer les données et gérer les URLs problématiques
          const cleanedData = publicResponse.data.map(doc => {
            let imageUrl = doc.image_couverture;
            if (imageUrl && typeof imageUrl === 'string') {
              try {
                if (imageUrl.includes('%')) {
                  imageUrl = decodeURIComponent(imageUrl);
                }
              } catch (error) {
                console.warn('Erreur de décodage URL:', imageUrl, error);
                imageUrl = null;
              }
            }
            
            return {
              ...doc,
              image_couverture: imageUrl
            };
          });
          
          setCourses(cleanedData);
          // Récupérer les statistiques pour tous les documents
          await fetchAllDocumentsStats(cleanedData);
        } else {
          console.log('La réponse n\'est pas un tableau, utilisation des données fictives');
          setCourses(fakeCourses);
          await fetchAllDocumentsStats(fakeCourses);
        }
        
      } catch (apiError) {
        console.error('Erreur API:', apiError);
        console.log('Utilisation des données fictives en fallback');
        setCourses(fakeCourses);
        await fetchAllDocumentsStats(fakeCourses);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur générale:', err);
      setError('Erreur lors du chargement des documents');
      setLoading(false);
      setCourses(fakeCourses);
    }
  };

  // Fonction pour enregistrer une vue
  const enregistrerVue = async (documentId) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.access) {
        await api.post('/action/vues/enregistrer-vue/', {
          document_id: documentId
        });
        
        // Mettre à jour les statistiques localement
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
      
      // Mettre à jour l'état local des favoris
      setUserFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isNowFavorite) {
          newFavorites.add(documentId);
        } else {
          newFavorites.delete(documentId);
        }
        return newFavorites;
      });

      // Mettre à jour les statistiques
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

      // Afficher un message de confirmation
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
  const handleDownload = async (courseId, courseTitle) => {
    let toastId = null;
    try {
      // Afficher le toast de téléchargement en cours
      toastId = addToast(`Téléchargement de "${courseTitle}" en cours...`, 'info', 0);
      
      // Enregistrer le téléchargement
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.access) {
        await api.post('/action/telechargements/enregistrer-telechargement/', {
          document_id: courseId
        });
        
        // Mettre à jour les statistiques localement
        setDocumentsStats(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            downloads: (prev[courseId]?.downloads || 0) + 1,
            has_downloaded: true
          }
        }));
      }
      
      // Récupérer l'URL du document
      const response = await api.get(`/documents/documents/${courseId}/`);
      const pdfUrl = response.data.fichier;
      
      // Télécharger le fichier
      const downloadResponse = await fetch(pdfUrl);
      const blob = await downloadResponse.blob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${courseTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Mettre à jour le toast pour indiquer la réussite
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

  // Fonction pour gérer l'ouverture des commentaires
  const handleOpenComments = (courseId, courseTitle) => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (!tokens.access) {
      addToast('Vous devez être connecté pour voir les commentaires', 'error');
      return;
    }
    
    setSelectedCourse({ id: courseId, title: courseTitle });
    setCommentSidebarOpen(true);
  };

  // Fonction pour mettre à jour les statistiques de commentaires depuis le sidebar
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
    
    // Rafraîchir les statistiques du document courant
    if (selectedCourse?.id) {
      fetchDocumentStats(selectedCourse.id).then(stats => {
        setDocumentsStats(prev => ({
          ...prev,
          [selectedCourse.id]: stats
        }));
      });
    }
  };

  // Fonction pour formater les nombres
  const formatNumber = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number.toString();
  };

  useEffect(() => {
    fetchDocuments();
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

  const handleSeeAll = () => {
    console.log('Navigate to see all courses page');
  };

  const handleViewDocument = (courseId) => {
    // Enregistrer la vue avant la navigation
    enregistrerVue(courseId);
    navigate(`/document/detail/${courseId}`);
  };

  const handleStatClick = (action, courseId, courseTitle) => {
    console.log('Action: ' + action + ' for course: ' + courseId);
    
    switch(action) {
      case 'view':
        handleViewDocument(courseId);
        break;
      case 'like':
        handleToggleFavorite(courseId, courseTitle);
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

  // S'assurer que courses est toujours un tableau
  const safeCourses = Array.isArray(courses) ? courses : [];

  // Filtrer les cours par catégorie
  const filteredCourses = activeCategory === 'Toutes' 
    ? safeCourses 
    : safeCourses.filter(course => course.categorie_nom === activeCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  if (loading) {
    return <div className="bookSectionComponent-loading">Chargement des documents...</div>;
  }

  if (error && safeCourses.length === 0) {
    return <div className="bookSectionComponent-error">{error}</div>;
  }

  return (
    <div className="bookSectionComponent">
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

      <div className="bookSectionComponent-header">
        <h2 className="bookSectionComponent-title">
          Nos meilleures <span className="bookSectionComponent-highlight">catégories</span>
        </h2>
        
        <div className="bookSectionComponent-categoriesNav">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`bookSectionComponent-categoryBtn ${activeCategory === category ? 'bookSectionComponent-active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="bookSectionComponent-coursesGrid">
        {currentCourses.map((course) => {
          // S'assurer que toutes les statistiques ont des valeurs par défaut
          const stats = {
            views: 0,
            favoris: 0, 
            downloads: 0,
            comments: 0,
            ...documentsStats[course.id]
          };
          const isFavorite = userFavorites.has(course.id);
          
          return (
            <div key={course.id} className="bookSectionComponent-courseCard">
              <div className="bookSectionComponent-courseImageContainer">
                <img 
                  src={course.image_couverture || "/default-cover.jpg"} 
                  alt={course.titre}
                  className="bookSectionComponent-courseImage"
                  onError={(e) => {
                    console.warn('Erreur de chargement de l\'image: ' + course.image_couverture);
                    e.target.src = "/default-cover.jpg";
                  }}
                />
                <div className="bookSectionComponent-levelBadge">
                  {course.niveau_nom}
                </div>
                <div className="bookSectionComponent-typeBadge">
                  {course.type_document_nom}
                </div>
              </div>
              
              <div className="bookSectionComponent-courseContent">
                <div className="bookSectionComponent-courseMeta">
                  <span className="bookSectionComponent-category">{course.categorie_nom}</span>
                  <span className="bookSectionComponent-year">{course.annee_academique}</span>
                </div>
                
                <h3 className="bookSectionComponent-courseTitle">{course.titre}</h3>
                <p className="bookSectionComponent-courseDescription">{course.description}</p>
                <p className="bookSectionComponent-courseAuthor">Par {course.auteur_nom}</p>
                
                <div className="bookSectionComponent-courseStats">
                  <div 
                    className="bookSectionComponent-statItem"
                    onClick={() => handleStatClick('view', course.id, course.titre)}
                  >
                    <div className="bookSectionComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                    <span className="bookSectionComponent-statNumber">{formatNumber(stats.views)}</span>
                    <span className="bookSectionComponent-statLabel">VUES</span>
                  </div>
                  
                  <div 
                    className={`bookSectionComponent-statItem ${isFavorite ? 'favorite-active' : ''}`}
                    onClick={() => handleStatClick('like', course.id, course.titre)}
                  >
                    <div className="bookSectionComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="bookSectionComponent-statNumber">{formatNumber(stats.favoris)}</span>
                    <span className="bookSectionComponent-statLabel">J'AIME</span>
                  </div>
                  
                  <div 
                    className="bookSectionComponent-statItem"
                    onClick={() => handleStatClick('download', course.id, course.titre)}
                  >
                    <div className="bookSectionComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                    </div>
                    <span className="bookSectionComponent-statNumber">{formatNumber(stats.downloads)}</span>
                    <span className="bookSectionComponent-statLabel">TÉLÉCH.</span>
                  </div>
                  
                  <div 
                    className="bookSectionComponent-statItem"
                    onClick={() => handleStatClick('comment', course.id, course.titre)}
                  >
                    <div className="bookSectionComponent-statIcon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                      </svg>
                    </div>
                    <span className="bookSectionComponent-statNumber">{formatNumber(stats.comments)}</span>
                    <span className="bookSectionComponent-statLabel">COMMENT</span>
                  </div>
                </div>
                
                <button 
                  className="bookSectionComponent-exploreBtn"
                  onClick={() => handleViewDocument(course.id)}
                >
                  <svg className="bookSectionComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
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
      <div className="bookSectionComponent-paginationContainer">
        {totalPages > 1 && (
          <div className="bookSectionComponent-pagination">
            <button 
              className={`bookSectionComponent-pageBtn ${currentPage === 1 ? 'bookSectionComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`bookSectionComponent-pageBtn ${currentPage === index + 1 ? 'bookSectionComponent-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`bookSectionComponent-pageBtn ${currentPage === totalPages ? 'bookSectionComponent-disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
        
        <button className="bookSectionComponent-seeAllBtn" onClick={handleSeeAll}>
          Voir tout
        </button>
      </div>

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

export default BookSection;