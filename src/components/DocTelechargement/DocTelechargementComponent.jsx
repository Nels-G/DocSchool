import React, { useState, useEffect } from 'react';
import './DocTelechargementComponent.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';

const DocTelechargementComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAjout');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const itemsPerPage = 9;

  const sortOptions = [
    { value: 'dateAjout', label: 'Date de téléchargement' },
    { value: 'titre', label: 'Titre' },
    { value: 'popularite', label: 'Popularité' },
    { value: 'niveau', label: 'Niveau' }
  ];

  // Documents téléchargés par l'utilisateur
  const downloadedDocuments = [
    {
      id: 1,
      title: "Introduction au Calcul Différentiel et Intégral",
      description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion",
      image: "/Kotlin.jpg",
      level: "Master 2",
      category: "Finance",
      documentType: "Cours",
      academicYear: "2024-2025",
      downloadDate: "2024-01-15",
      author: "Prof. Martin",
      stats: {
        views: "3,892",
        likes: "1,247",
        downloads: "856",
        comments: "234"
      }
    },
    {
      id: 2,
      title: "Analyse Financière Avancée",
      description: "Formation complète sur les principes fondamentaux du calcul mathématique",
      image: "/miniature.png",
      level: "Licence 1",
      category: "Finance",
      documentType: "TD/TP",
      academicYear: "2023-2024",
      downloadDate: "2024-02-10",
      author: "Prof. Laurent",
      stats: {
        views: "2,156",
        likes: "847",
        downloads: "623",
        comments: "189"
      }
    },
    {
      id: 3,
      title: "Marketing Digital",
      description: "Stratégies modernes de marketing digital et réseaux sociaux",
      image: "/miniature.png",
      level: "Master 1",
      category: "Marketing",
      documentType: "Cours",
      academicYear: "2024-2025",
      downloadDate: "2024-03-05",
      author: "Prof. Leroy",
      stats: {
        views: "4,567",
        likes: "1,892",
        downloads: "1,234",
        comments: "456"
      }
    },
    {
      id: 4,
      title: "Gestion des Ressources Humaines",
      description: "Principes et pratiques de la gestion des ressources humaines",
      image: "/miniature.png",
      level: "Licence 3",
      category: "Ressources Humaines",
      documentType: "Cours",
      academicYear: "2024-2025",
      downloadDate: "2024-01-28",
      author: "Prof. Bernard",
      stats: {
        views: "3,234",
        likes: "956",
        downloads: "678",
        comments: "234"
      }
    },
    {
      id: 5,
      title: "Audit et Contrôle Interne",
      description: "Méthodologies d'audit et techniques de contrôle interne",
      image: "/miniature.png",
      level: "Master 2",
      category: "Audit et Contrôle de Gestion",
      documentType: "Projet",
      academicYear: "2024-2025",
      downloadDate: "2024-02-18",
      author: "Prof. Moreau",
      stats: {
        views: "2,789",
        likes: "734",
        downloads: "567",
        comments: "123"
      }
    },
    {
      id: 6,
      title: "Commerce International",
      description: "Aspects juridiques et économiques du commerce international",
      image: "/miniature.png",
      level: "Master 1",
      category: "Commerce International",
      documentType: "Cours",
      academicYear: "2023-2024",
      downloadDate: "2024-01-10",
      author: "Prof. Petit",
      stats: {
        views: "1,987",
        likes: "623",
        downloads: "445",
        comments: "167"
      }
    }
  ];

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

  const handleStatClick = (action, documentId, documentTitle) => {
    console.log(`Action: ${action} for document: ${documentId}`);
    
    switch(action) {
      case 'view':
        // Logique pour voir le document
        break;
      case 'like':
        // Logique pour liker
        break;
      case 'download':
        // Logique pour télécharger
        break;
      case 'comment':
        // Ouvrir la sidebar de commentaires
        setSelectedDocument({ id: documentId, title: documentTitle });
        setCommentSidebarOpen(true);
        break;
      case 'delete':
        // Ouvrir la modal de confirmation
        setDocumentToDelete({ id: documentId, title: documentTitle });
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleExploreAI = (documentId, documentTitle) => {
    console.log(`Explorer avec l'IA: ${documentTitle}`);
    // Logique pour ouvrir le document avec l'IA
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      console.log(`Suppression du document ${documentToDelete.id}`);
      // Implémenter la logique de suppression ici
      // Par exemple, appel API pour supprimer le document de la liste des téléchargements
      
      // Réinitialiser les états
      setDocumentToDelete(null);
      setShowDeleteModal(false);
      
      // Optionnel : afficher une notification de succès
      console.log(`Document "${documentToDelete.title}" supprimé de vos téléchargements`);
    }
  };

  const handleDeleteCancel = () => {
    setDocumentToDelete(null);
    setShowDeleteModal(false);
  };

  // Filtrage des documents
  const filteredDocuments = downloadedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Tri des documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch(sortBy) {
      case 'titre':
        return a.title.localeCompare(b.title);
      case 'popularite':
        return parseInt(b.stats.views.replace(',', '')) - parseInt(a.stats.views.replace(',', ''));
      case 'niveau':
        return a.level.localeCompare(b.level);
      case 'dateAjout':
      default:
        return new Date(b.downloadDate) - new Date(a.downloadDate);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="docTelechargementComponent">
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

      <div className="docTelechargementComponent-resultsInfo">
        <p className="docTelechargementComponent-resultsCount">
          {sortedDocuments.length} document{sortedDocuments.length > 1 ? 's' : ''} téléchargé{sortedDocuments.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="docTelechargementComponent-documentsGrid">
        {currentDocuments.map((document) => (
          <div key={document.id} className="docTelechargementComponent-documentCard">
            <div className="docTelechargementComponent-documentImageContainer">
              <img 
                src={document.image} 
                alt={document.title}
                className="docTelechargementComponent-documentImage"
              />
              <div className="docTelechargementComponent-levelBadge">
                {document.level}
              </div>
              <div className="docTelechargementComponent-typeBadge">
                {document.documentType}
              </div>
            </div>
            
            <div className="docTelechargementComponent-documentContent">
              <div className="docTelechargementComponent-documentMeta">
                <span className="docTelechargementComponent-category">{document.category}</span>
                <span className="docTelechargementComponent-year">{document.academicYear}</span>
              </div>
              
              <h3 className="docTelechargementComponent-documentTitle">{document.title}</h3>
              <p className="docTelechargementComponent-documentDescription">{document.description}</p>
              <p className="docTelechargementComponent-documentAuthor">Par {document.author}</p>
              <p className="docTelechargementComponent-downloadDate">Téléchargé le {formatDate(document.downloadDate)}</p>
              
              <div className="docTelechargementComponent-documentStats">
                <div 
                  className="docTelechargementComponent-statItem"
                  onClick={() => handleStatClick('view', document.id, document.title)}
                >
                  <div className="docTelechargementComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <span className="docTelechargementComponent-statNumber">{document.stats.views}</span>
                  <span className="docTelechargementComponent-statLabel">VUES</span>
                </div>
                
                <div 
                  className="docTelechargementComponent-statItem"
                  onClick={() => handleStatClick('like', document.id, document.title)}
                >
                  <div className="docTelechargementComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="docTelechargementComponent-statNumber">{document.stats.likes}</span>
                  <span className="docTelechargementComponent-statLabel">J'AIME</span>
                </div>
                
                <div 
                  className="docTelechargementComponent-statItem"
                  onClick={() => handleStatClick('download', document.id, document.title)}
                >
                  <div className="docTelechargementComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  </div>
                  <span className="docTelechargementComponent-statNumber">{document.stats.downloads}</span>
                  <span className="docTelechargementComponent-statLabel">TÉLÉCH.</span>
                </div>
                
                <div 
                  className="docTelechargementComponent-statItem"
                  onClick={() => handleStatClick('comment', document.id, document.title)}
                >
                  <div className="docTelechargementComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                    </svg>
                  </div>
                  <span className="docTelechargementComponent-statNumber">{document.stats.comments}</span>
                  <span className="docTelechargementComponent-statLabel">COMMENT</span>
                </div>
              </div>

              <div className="docTelechargementComponent-documentActions">
                <button 
                  className="docTelechargementComponent-exploreBtn"
                  onClick={() => handleExploreAI(document.id, document.title)}
                >
                  <svg className="docTelechargementComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                  </svg>
                  Explorer avec l'IA
                </button>

                <button 
                  className="docTelechargementComponent-actionBtn docTelechargementComponent-deleteBtn"
                  onClick={() => handleStatClick('delete', document.id, document.title)}
                  title="Supprimer le téléchargement"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun document */}
      {currentDocuments.length === 0 && (
        <div className="docTelechargementComponent-emptyState">
          <svg className="docTelechargementComponent-emptyIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <h3 className="docTelechargementComponent-emptyTitle">Aucun document téléchargé</h3>
          <p className="docTelechargementComponent-emptyDescription">
            Vous n'avez pas encore téléchargé de documents. Explorez la bibliothèque pour trouver des ressources intéressantes.
          </p>
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
        type="download" // Spécifie que c'est pour un téléchargement
      />

      {/* Sidebar de commentaires */}
      <CommentSidebar
        isOpen={commentSidebarOpen}
        onClose={() => setCommentSidebarOpen(false)}
        courseId={selectedDocument?.id}
        courseTitle={selectedDocument?.title}
      />
    </div>
  );
};

export default DocTelechargementComponent;