import React, { useState } from 'react';
import './DocFavorisComponent.css';

const DocFavorisComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'

  // Simulation des documents favoris (remplacer par des données réelles)
  const [favoriteDocuments, setFavoriteDocuments] = useState([
    {
      id: 1,
      title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
      description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion",
      image: "/Kotlin.jpg",
      level: "Master 2",
      category: "Finance",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Prof. Martin",
      dateAdded: "2024-08-20",
      stats: {
        views: "3,892",
        likes: "1,247",
        downloads: "856",
        comments: "234"
      }
    },
    {
      id: 4,
      title: "Marketing Digital",
      description: "Stratégies modernes de marketing digital et réseaux sociaux",
      image: "/miniature.png",
      level: "Master 1",
      category: "Marketing",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Prof. Leroy",
      dateAdded: "2024-08-18",
      stats: {
        views: "4,567",
        likes: "1,892",
        downloads: "1,234",
        comments: "456"
      }
    },
    {
      id: 11,
      title: "Mathématiques Financières",
      description: "Modèles mathématiques appliqués à la finance",
      image: "/Kotlin.jpg",
      level: "Master 2",
      category: "Finance",
      documentType: "TD/TP",
      academicYear: "2024-2025",
      author: "Prof. Durand",
      dateAdded: "2024-08-15",
      stats: {
        views: "2,987",
        likes: "943",
        downloads: "712",
        comments: "267"
      }
    }
  ]);

  // Filtrer les documents par recherche uniquement
  const filteredDocuments = favoriteDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const removeFromFavorites = (docId) => {
    setFavoriteDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleStatClick = (action, courseId, courseTitle) => {
    console.log(`Action: ${action} for course: ${courseId}`);
    
    switch(action) {
      case 'view':
        // Logique pour voir le cours
        break;
      case 'download':
        // Logique pour télécharger
        break;
      case 'comment':
        // Logique pour les commentaires
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (favoriteDocuments.length === 0) {
    return (
      <div className="docFavorisComponent">
        <div className="docFavorisComponent-header">
          <h2 className="docFavorisComponent-title">
            Mes documents <span className="docFavorisComponent-highlight">favoris</span>
          </h2>
        </div>
        
        <div className="docFavorisComponent-emptyState">
          <div className="docFavorisComponent-emptyIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3 className="docFavorisComponent-emptyTitle">Aucun document en favoris</h3>
          <p className="docFavorisComponent-emptyDescription">
            Vous n'avez encore aucun document en favori. Explorez nos cours et ajoutez vos documents préférés en cliquant sur l'icône cœur.
          </p>
          <button className="docFavorisComponent-exploreBtn">
            Découvrir les documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="docFavorisComponent">
      <div className="docFavorisComponent-header">
        <h2 className="docFavorisComponent-title">
          Mes documents <span className="docFavorisComponent-highlight">favoris</span>
        </h2>
        <p className="docFavorisComponent-subtitle">
          {favoriteDocuments.length} document{favoriteDocuments.length > 1 ? 's' : ''} en favori
        </p>
      </div>

      {/* Barre de recherche uniquement */}
      <div className="docFavorisComponent-controls">
        <div className="docFavorisComponent-searchContainer">
          <div className="docFavorisComponent-searchInputWrapper">
            <svg className="docFavorisComponent-searchIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher dans vos favoris..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="docFavorisComponent-searchInput"
            />
            {searchTerm && (
              <button
                className="docFavorisComponent-clearSearch"
                onClick={clearSearch}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
          
          <div className="docFavorisComponent-viewToggle">
            <button
              className={`docFavorisComponent-viewBtn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vue en cartes"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
              </svg>
            </button>
            <button
              className={`docFavorisComponent-viewBtn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue en liste"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {filteredDocuments.length === 0 ? (
        <div className="docFavorisComponent-noResults">
          <div className="docFavorisComponent-noResultsIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <h3>Aucun résultat trouvé</h3>
          <p>Aucun document ne correspond à vos critères de recherche.</p>
          <button onClick={clearSearch} className="docFavorisComponent-clearFiltersBtn">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className={`docFavorisComponent-documentsContainer ${viewMode === 'list' ? 'list-view' : 'cards-view'}`}>
          {filteredDocuments.map((document) => (
            <div key={document.id} className={`docFavorisComponent-documentItem ${viewMode}`}>
              {viewMode === 'cards' ? (
                <>
                  <div className="docFavorisComponent-documentImageContainer">
                    <img 
                      src={document.image} 
                      alt={document.title}
                      className="docFavorisComponent-documentImage"
                    />
                    <div className="docFavorisComponent-levelBadge">
                      {document.level}
                    </div>
                    <div className="docFavorisComponent-typeBadge">
                      {document.documentType}
                    </div>
                    <button
                      className="docFavorisComponent-favoriteBtn active"
                      onClick={() => removeFromFavorites(document.id)}
                      title="Retirer des favoris"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="docFavorisComponent-documentContent">
                    <div className="docFavorisComponent-documentMeta">
                      <span className="docFavorisComponent-category">{document.category}</span>
                      <span className="docFavorisComponent-year">{document.academicYear}</span>
                    </div>
                    
                    <h3 className="docFavorisComponent-documentTitle">{document.title}</h3>
                    <p className="docFavorisComponent-documentDescription">{document.description}</p>
                    <p className="docFavorisComponent-documentAuthor">Par {document.author}</p>
                    
                    <div className="docFavorisComponent-documentStats">
                      <div 
                        className="docFavorisComponent-statItem"
                        onClick={() => handleStatClick('view', document.id, document.title)}
                      >
                        <div className="docFavorisComponent-statIcon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </div>
                        <span className="docFavorisComponent-statNumber">{document.stats.views}</span>
                        <span className="docFavorisComponent-statLabel">VUES</span>
                      </div>
                      
                      <div 
                        className="docFavorisComponent-statItem"
                        onClick={() => handleStatClick('download', document.id, document.title)}
                      >
                        <div className="docFavorisComponent-statIcon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                        </div>
                        <span className="docFavorisComponent-statNumber">{document.stats.downloads}</span>
                        <span className="docFavorisComponent-statLabel">TÉLÉCH.</span>
                      </div>
                      
                      <div 
                        className="docFavorisComponent-statItem"
                        onClick={() => handleStatClick('comment', document.id, document.title)}
                      >
                        <div className="docFavorisComponent-statIcon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                          </svg>
                        </div>
                        <span className="docFavorisComponent-statNumber">{document.stats.comments}</span>
                        <span className="docFavorisComponent-statLabel">COMMENT</span>
                      </div>
                    </div>
                    
                    <button className="docFavorisComponent-exploreBtn">
                      <svg className="docFavorisComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                      </svg>
                      Explorer avec l'IA
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="docFavorisComponent-listImageContainer">
                    <img 
                      src={document.image} 
                      alt={document.title}
                      className="docFavorisComponent-listImage"
                    />
                  </div>
                  
                  <div className="docFavorisComponent-listContent">
                    <div className="docFavorisComponent-listHeader">
                      <div className="docFavorisComponent-listMeta">
                        <span className="docFavorisComponent-listBadge type">{document.documentType}</span>
                        <span className="docFavorisComponent-listBadge level">{document.level}</span>
                        <span className="docFavorisComponent-listBadge category">{document.category}</span>
                      </div>
                      <button
                        className="docFavorisComponent-favoriteBtn active"
                        onClick={() => removeFromFavorites(document.id)}
                        title="Retirer des favoris"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    
                    <h3 className="docFavorisComponent-listTitle">{document.title}</h3>
                    <p className="docFavorisComponent-listDescription">{document.description}</p>
                    <p className="docFavorisComponent-listAuthor">Par {document.author} • {document.academicYear}</p>
                    
                    <div className="docFavorisComponent-listActions">
                      <div className="docFavorisComponent-listStats">
                        <span className="docFavorisComponent-listStat">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          {document.stats.views}
                        </span>
                        <span className="docFavorisComponent-listStat">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                          {document.stats.downloads}
                        </span>
                      </div>
                      
                      <button className="docFavorisComponent-listExploreBtn">
                        Explorer
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocFavorisComponent;