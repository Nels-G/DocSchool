import React, { useState, useEffect } from 'react';
import './mesDocumentsComponent.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';

const MesDocumentsComponent = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAjout');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const itemsPerPage = 9;



  const sortOptions = [
    { value: 'dateAjout', label: 'Date d\'ajout' },
    { value: 'titre', label: 'Titre' },
    { value: 'popularite', label: 'Popularité' },
    { value: 'niveau', label: 'Niveau' }
  ];

  // Documents de l'utilisateur connecté
  const myDocuments = [
    {
      id: 1,
      title: "Analyse Financière - Cours Complet",
      description: "Cours détaillé sur l'analyse financière des entreprises avec exercices pratiques",
      image: "/miniature.png",
      level: "Master 1",
      category: "Finance",
      documentType: "Cours",
      academicYear: "2024-2025",
      dateAdded: "2024-01-15",
      author: "Moi",
      stats: {
        views: "1,234",
        likes: "87",
        downloads: "456",
        comments: "23"
      }
    },
    {
      id: 2,
      title: "Projet Marketing Digital - Stratégie Réseaux Sociaux",
      description: "Projet complet sur une stratégie marketing pour une startup tech",
      image: "/Kotlin.jpg",
      level: "Master 1",
      category: "Marketing",
      documentType: "Projet",
      academicYear: "2024-2025",
      dateAdded: "2024-02-10",
      author: "Moi",
      stats: {
        views: "892",
        likes: "124",
        downloads: "267",
        comments: "45"
      }
    },
    {
      id: 3,
      title: "TD Contrôle de Gestion - Cas Pratiques",
      description: "Série d'exercices corrigés en contrôle de gestion avec méthodologie",
      image: "/miniature.png",
      level: "Licence 3",
      category: "Audit et Contrôle de Gestion",
      documentType: "TD/TP",
      academicYear: "2023-2024",
      dateAdded: "2023-11-20",
      author: "Moi",
      stats: {
        views: "2,156",
        likes: "198",
        downloads: "834",
        comments: "67"
      }
    },
    {
      id: 4,
      title: "Mémoire - Impact du Digital sur les RH",
      description: "Mémoire de fin d'études sur la transformation digitale des ressources humaines",
      image: "/miniature.png",
      level: "Master 2",
      category: "Ressources Humaines",
      documentType: "Mémoire",
      academicYear: "2023-2024",
      dateAdded: "2023-06-15",
      author: "Moi",
      stats: {
        views: "3,421",
        likes: "276",
        downloads: "1,123",
        comments: "89"
      }
    },
    {
      id: 5,
      title: "Présentation Commerce International - INCOTERMS",
      description: "Support de présentation sur les termes commerciaux internationaux",
      image: "/Kotlin.jpg",
      level: "Master 1",
      category: "Commerce International",
      documentType: "Présentation",
      academicYear: "2024-2025",
      dateAdded: "2024-03-05",
      author: "Moi",
      stats: {
        views: "756",
        likes: "92",
        downloads: "345",
        comments: "28"
      }
    },
    {
      id: 6,
      title: "Exercices Mathématiques Financières",
      description: "Collection d'exercices sur les calculs d'intérêts et d'annuités",
      image: "/miniature.png",
      level: "Licence 2",
      category: "Mathématiques",
      documentType: "Exercices",
      academicYear: "2022-2023",
      dateAdded: "2022-12-10",
      author: "Moi",
      stats: {
        views: "1,678",
        likes: "143",
        downloads: "589",
        comments: "34"
      }
    }
  ];

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
        // Logique pour supprimer le document
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${documentTitle}" ?`)) {
          console.log(`Suppression du document ${documentId}`);
          // Implémenter la logique de suppression
        }
        break;
      case 'edit':
        // Logique pour éditer le document
        console.log(`Édition du document ${documentId}`);
        break;
      default:
        break;
    }
  };

  const handleExploreAI = (documentId, documentTitle) => {
    console.log(`Explorer avec l'IA: ${documentTitle}`);
    // Logique pour ouvrir le document avec l'IA
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // Filtrage des documents
  const filteredDocuments = myDocuments.filter(doc => {
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
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  return (
    <div className="mesDocumentsComponent">
      <div className="mesDocumentsComponent-header">
        <div className="mesDocumentsComponent-titleSection">
          <h2 className="mesDocumentsComponent-title">
            Mes <span className="mesDocumentsComponent-highlight">Documents</span>
          </h2>
          <button 
            className="mesDocumentsComponent-uploadBtn"
            onClick={handleUpload}
          >
            <svg className="mesDocumentsComponent-uploadIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              <path d="M12,11L16,15H13V19H11V15H8L12,11Z"/>
            </svg>
            Ajouter un document
          </button>
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

      <div className="mesDocumentsComponent-documentsGrid">
        {currentDocuments.map((document) => (
          <div key={document.id} className="mesDocumentsComponent-documentCard">
            <div className="mesDocumentsComponent-documentImageContainer">
              <img 
                src={document.image} 
                alt={document.title}
                className="mesDocumentsComponent-documentImage"
              />
              <div className="mesDocumentsComponent-levelBadge">
                {document.level}
              </div>
              <div className="mesDocumentsComponent-typeBadge">
                {document.documentType}
              </div>
            </div>
            
            <div className="mesDocumentsComponent-documentContent">
              <div className="mesDocumentsComponent-documentMeta">
                <span className="mesDocumentsComponent-category">{document.category}</span>
                <span className="mesDocumentsComponent-year">{document.academicYear}</span>
              </div>
              
              <h3 className="mesDocumentsComponent-documentTitle">{document.title}</h3>
              <p className="mesDocumentsComponent-documentDescription">{document.description}</p>
              
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
                  <span className="mesDocumentsComponent-statNumber">{document.stats.views}</span>
                  <span className="mesDocumentsComponent-statLabel">VUES</span>
                </div>
                
                <div 
                  className="mesDocumentsComponent-statItem"
                  onClick={() => handleStatClick('like', document.id, document.title)}
                >
                  <div className="mesDocumentsComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="mesDocumentsComponent-statNumber">{document.stats.likes}</span>
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
                  <span className="mesDocumentsComponent-statNumber">{document.stats.downloads}</span>
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
                  <span className="mesDocumentsComponent-statNumber">{document.stats.comments}</span>
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
        ))}
      </div>

      {/* Message si aucun document */}
      {currentDocuments.length === 0 && (
        <div className="mesDocumentsComponent-emptyState">
          <svg className="mesDocumentsComponent-emptyIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <h3 className="mesDocumentsComponent-emptyTitle">Aucun document trouvé</h3>
          <p className="mesDocumentsComponent-emptyDescription">
            Aucun document ne correspond aux critères de recherche sélectionnés.
          </p>
          <button 
            className="mesDocumentsComponent-uploadBtn"
            onClick={handleUpload}
          >
            Ajouter votre premier document
          </button>
        </div>
      )}

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
        onClose={() => setCommentSidebarOpen(false)}
        courseId={selectedDocument?.id}
        courseTitle={selectedDocument?.title}
      />
    </div>
  );
};

export default MesDocumentsComponent;