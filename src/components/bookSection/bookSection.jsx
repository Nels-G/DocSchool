import React, { useState, useEffect } from 'react';
import './bookSection.css';
import CommentSidebar from '../CommentSidebar/CommentSidebar';

const BookSection = () => {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const courses = [
    {
      id: 1,
      title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
      description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion",
      image: "/Kotlin.jpg",
      level: "Master 2",
      category: "Finance",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Parait audo",
      stats: {
        views: "3,892",
        likes: "1,247",
        downloads: "856",
        comments: "234"
      }
    },
    {
      id: 2,
      title: "Introduction au Calcul",
      description: "Cours de base en mathématiques pour débutants",
      image: "/miniature.png",
      level: "Master 1",
      category: "Finance",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Prof. Dubois",
      stats: {
        views: "3,892",
        likes: "1,247",
        downloads: "856",
        comments: "234"
      }
    },
    {
      id: 3,
      title: "Analyse Financière Avancée",
      description: "Formation complète sur les principes fondamentaux du calcul mathématique",
      image: "/miniature.png",
      level: "Licence 1",
      category: "Finance",
      documentType: "TD/TP",
      academicYear: "2023-2024",
      author: "Prof. Laurent",
      stats: {
        views: "2,156",
        likes: "847",
        downloads: "623",
        comments: "189"
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
      stats: {
        views: "4,567",
        likes: "1,892",
        downloads: "1,234",
        comments: "456"
      }
    },
    {
      id: 5,
      title: "Gestion des Ressources Humaines",
      description: "Principes et pratiques de la gestion des ressources humaines",
      image: "/miniature.png",
      level: "Licence 3",
      category: "Ressources Humaines",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Prof. Bernard",
      stats: {
        views: "3,234",
        likes: "956",
        downloads: "678",
        comments: "234"
      }
    },
    {
      id: 6,
      title: "Audit et Contrôle Interne",
      description: "Méthodologies d'audit et techniques de contrôle interne",
      image: "/miniature.png",
      level: "Master 2",
      category: "Audit et Contrôle de Gestion",
      documentType: "Projet",
      academicYear: "2024-2025",
      author: "Prof. Moreau",
      stats: {
        views: "2,789",
        likes: "734",
        downloads: "567",
        comments: "123"
      }
    },
    {
      id: 7,
      title: "Commerce International",
      description: "Aspects juridiques et économiques du commerce international",
      image: "/miniature.png",
      level: "Master 1",
      category: "Commerce International",
      documentType: "Cours",
      academicYear: "2023-2024",
      author: "Prof. Petit",
      stats: {
        views: "1,987",
        likes: "623",
        downloads: "445",
        comments: "167"
      }
    },
    {
      id: 8,
      title: "Statistiques Appliquées",
      description: "Méthodes statistiques pour l'analyse des données",
      image: "/miniature.png",
      level: "Licence 2",
      category: "Finance",
      documentType: "Exercices",
      academicYear: "2024-2025",
      author: "Prof. Garcia",
      stats: {
        views: "3,456",
        likes: "1,123",
        downloads: "789",
        comments: "298"
      }
    },
    {
      id: 9,
      title: "Économie Internationale",
      description: "Théories et pratiques de l'économie internationale moderne",
      image: "/miniature.png",
      level: "Master 2",
      category: "Commerce International",
      documentType: "Cours",
      academicYear: "2023-2024",
      author: "Prof. Roux",
      stats: {
        views: "2,345",
        likes: "867",
        downloads: "534",
        comments: "201"
      }
    },
    {
      id: 10,
      title: "Droit des Affaires",
      description: "Cadre juridique des entreprises et transactions commerciales",
      image: "/miniature.png",
      level: "Master 1",
      category: "Commerce International",
      documentType: "Cours",
      academicYear: "2024-2025",
      author: "Prof. Simon",
      stats: {
        views: "1,876",
        likes: "567",
        downloads: "398",
        comments: "145"
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
      stats: {
        views: "2,987",
        likes: "943",
        downloads: "712",
        comments: "267"
      }
    },
    {
      id: 12,
      title: "Management Stratégique",
      description: "Stratégies d'entreprise et prise de décision managériale",
      image: "/miniature.png",
      level: "Master 1",
      category: "Ressources Humaines",
      documentType: "Présentation",
      academicYear: "2023-2024",
      author: "Prof. Michel",
      stats: {
        views: "4,123",
        likes: "1,456",
        downloads: "987",
        comments: "378"
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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSeeAll = () => {
    // Navigate to the "see all" page - you can replace this with your routing logic
    console.log('Navigate to see all courses page');
    // Example: navigate('/all-courses');
  };

  const handleStatClick = (action, courseId, courseTitle) => {
    console.log(`Action: ${action} for course: ${courseId}`);
    
    switch(action) {
      case 'view':
        // Logique pour voir le cours
        break;
      case 'like':
        // Logique pour liker
        break;
      case 'download':
        // Logique pour télécharger
        break;
      case 'comment':
        // Ouvrir la sidebar de commentaires
        setSelectedCourse({ id: courseId, title: courseTitle });
        setCommentSidebarOpen(true);
        break;
      default:
        break;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  return (
    <div className="bookSectionComponent">
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
        {currentCourses.map((course) => (
          <div key={course.id} className="bookSectionComponent-courseCard">
            <div className="bookSectionComponent-courseImageContainer">
              <img 
                src={course.image} 
                alt={course.title}
                className="bookSectionComponent-courseImage"
              />
              <div className="bookSectionComponent-levelBadge">
                {course.level}
              </div>
              <div className="bookSectionComponent-typeBadge">
                {course.documentType}
              </div>
            </div>
            
            <div className="bookSectionComponent-courseContent">
              <div className="bookSectionComponent-courseMeta">
                <span className="bookSectionComponent-category">{course.category}</span>
                <span className="bookSectionComponent-year">{course.academicYear}</span>
              </div>
              
              <h3 className="bookSectionComponent-courseTitle">{course.title}</h3>
              <p className="bookSectionComponent-courseDescription">{course.description}</p>
              <p className="bookSectionComponent-courseAuthor">Par {course.author}</p>
              
              <div className="bookSectionComponent-courseStats">
                <div 
                  className="bookSectionComponent-statItem"
                  onClick={() => handleStatClick('view', course.id, course.title)}
                >
                  <div className="bookSectionComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <span className="bookSectionComponent-statNumber">{course.stats.views}</span>
                  <span className="bookSectionComponent-statLabel">VUES</span>
                </div>
                
                <div 
                  className="bookSectionComponent-statItem"
                  onClick={() => handleStatClick('like', course.id, course.title)}
                >
                  <div className="bookSectionComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="bookSectionComponent-statNumber">{course.stats.likes}</span>
                  <span className="bookSectionComponent-statLabel">J'AIME</span>
                </div>
                
                <div 
                  className="bookSectionComponent-statItem"
                  onClick={() => handleStatClick('download', course.id, course.title)}
                >
                  <div className="bookSectionComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  </div>
                  <span className="bookSectionComponent-statNumber">{course.stats.downloads}</span>
                  <span className="bookSectionComponent-statLabel">TÉLÉCH.</span>
                </div>
                
                <div 
                  className="bookSectionComponent-statItem"
                  onClick={() => handleStatClick('comment', course.id, course.title)}
                >
                  <div className="bookSectionComponent-statIcon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                    </svg>
                  </div>
                  <span className="bookSectionComponent-statNumber">{course.stats.comments}</span>
                  <span className="bookSectionComponent-statLabel">COMMENT</span>
                </div>
              </div>
              
              <button className="bookSectionComponent-exploreBtn">
                <svg className="bookSectionComponent-aiIcon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                </svg>
                Explorer avec l'IA
              </button>
            </div>
          </div>
        ))}
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
        onClose={() => setCommentSidebarOpen(false)}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
      />
    </div>
  );
};

export default BookSection;