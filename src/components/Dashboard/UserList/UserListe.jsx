import React, { useState } from "react";
import "./UserListe.css";
import { FaFilter, FaSearch, FaEye, FaChevronLeft, FaChevronRight, FaCheckCircle, FaClock } from "react-icons/fa";

const UserListe = ({ style = {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Configuration des filières et niveaux
  const filieresConfig = {
    "IRT": {
      "L1": ["IRT 1"],
      "L2": ["IRT 2"],
      "L3": ["Architecture Logiciel", "Système réseau sécurité"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Science de gestion": {
      "L1": ["SG 1"],
      "L2": ["SG 2"],
      "L3": ["Comptabilité", "Audit", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Droit": {
      "L1": ["Droit 1"],
      "L2": ["Droit 2"],
      "L3": ["Droit public", "Droit privé", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Transport Logistique": {
      "L1": ["TL 1"],
      "L2": ["TL 2"],
      "L3": ["Transport", "Logistique", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "Management": {
      "L1": ["Management 1"],
      "L2": ["Management 2"],
      "L3": ["Management général", "RH", "Autres"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    },
    "CAC": {
      "L1": ["CAC 1"],
      "L2": ["CAC 2"],
      "L3": ["Contrôle", "Audit", "Comptabilité"],
      "M1": ["Master 1"],
      "M2": ["Master 2"]
    }
  };

  // Données des utilisateurs avec design moderne des couleurs
  const utilisateurs = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Marie",
      filiere: "IRT",
      niveau: "L3",
      specialisation: "Architecture Logiciel",
      statut: "En cours",
      documentsPublies: 5,
      filiereColor: "#3B82F6",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Jean",
      filiere: "Science de gestion",
      niveau: "M1",
      specialisation: "Master 1",
      statut: "Terminé",
      documentsPublies: 12,
      filiereColor: "#10B981",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Sophie",
      filiere: "Droit",
      niveau: "L2",
      specialisation: "Droit 2",
      statut: "En cours",
      documentsPublies: 3,
      filiereColor: "#8B5CF6",
    },
    {
      id: 4,
      nom: "Leroy",
      prenom: "Pierre",
      filiere: "Transport Logistique",
      niveau: "L3",
      specialisation: "Transport",
      statut: "En cours",
      documentsPublies: 7,
      filiereColor: "#F59E0B",
    },
    {
      id: 5,
      nom: "Moreau",
      prenom: "Camille",
      filiere: "Management",
      niveau: "M2",
      specialisation: "Master 2",
      statut: "Terminé",
      documentsPublies: 15,
      filiereColor: "#06B6D4",
    },
    {
      id: 6,
      nom: "Petit",
      prenom: "Lucas",
      filiere: "CAC",
      niveau: "L1",
      specialisation: "CAC 1",
      statut: "En cours",
      documentsPublies: 2,
      filiereColor: "#EF4444",
    },
    {
      id: 7,
      nom: "Robert",
      prenom: "Emma",
      filiere: "IRT",
      niveau: "M1",
      specialisation: "Master 1",
      statut: "En cours",
      documentsPublies: 9,
      filiereColor: "#3B82F6",
    },
    {
      id: 8,
      nom: "Dubois",
      prenom: "Thomas",
      filiere: "Science de gestion",
      niveau: "L3",
      specialisation: "Comptabilité",
      statut: "Terminé",
      documentsPublies: 8,
      filiereColor: "#10B981",
    },
    {
      id: 9,
      nom: "Garcia",
      prenom: "Julie",
      filiere: "Droit",
      niveau: "L3",
      specialisation: "Droit public",
      statut: "En cours",
      documentsPublies: 6,
      filiereColor: "#8B5CF6",
    },
    {
      id: 10,
      nom: "Roux",
      prenom: "Antoine",
      filiere: "Management",
      niveau: "L3",
      specialisation: "Management général",
      statut: "En cours",
      documentsPublies: 4,
      filiereColor: "#06B6D4",
    },
    {
      id: 11,
      nom: "Laurent",
      prenom: "Sarah",
      filiere: "Transport Logistique",
      niveau: "L2",
      specialisation: "TL 2",
      statut: "Terminé",
      documentsPublies: 11,
      filiereColor: "#F59E0B",
    },
    {
      id: 12,
      nom: "Michel",
      prenom: "David",
      filiere: "CAC",
      niveau: "L3",
      specialisation: "Audit",
      statut: "En cours",
      documentsPublies: 3,
      filiereColor: "#EF4444",
    },
    {
      id: 13,
      nom: "Simon",
      prenom: "Clara",
      filiere: "IRT",
      niveau: "L2",
      specialisation: "IRT 2",
      statut: "Terminé",
      documentsPublies: 13,
      filiereColor: "#3B82F6",
    },
    {
      id: 14,
      nom: "Blanc",
      prenom: "Nicolas",
      filiere: "Droit",
      niveau: "M2",
      specialisation: "Master 2",
      statut: "En cours",
      documentsPublies: 18,
      filiereColor: "#8B5CF6",
    },
    {
      id: 15,
      nom: "Faure",
      prenom: "Léa",
      filiere: "Management",
      niveau: "L1",
      specialisation: "Management 1",
      statut: "En cours",
      documentsPublies: 1,
      filiereColor: "#06B6D4",
    }
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les utilisateurs
  const filteredUtilisateurs = utilisateurs.filter(user => {
    const matchesSearch = `${user.nom} ${user.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.some(filter => 
      user.filiere === filter || user.statut === filter || `${user.filiere} ${user.niveau}` === filter
    );
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUtilisateurs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUtilisateurs = filteredUtilisateurs.slice(startIndex, endIndex);

  // Gérer les filtres
  const toggleFilter = (filterValue) => {
    setSelectedFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  // Obtenir les options de filtrage
  const getFilterOptions = () => {
    const filieres = [...new Set(utilisateurs.map(user => user.filiere))];
    const statuts = [...new Set(utilisateurs.map(user => user.statut))];
    const filieresNiveaux = [...new Set(utilisateurs.map(user => `${user.filiere} ${user.niveau}`))];
    
    return {
      "Filières": filieres,
      "Statuts": statuts,
      "Filière + Niveau": filieresNiveaux
    };
  };

  const filterOptions = getFilterOptions();

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fonction pour générer les numéros de page visibles
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  // Fonction pour obtenir l'icône du statut
  const getStatutIcon = (statut) => {
    return statut === "Terminé" ? <FaCheckCircle /> : <FaClock />;
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut) => {
    return statut === "Terminé" ? "#10B981" : "#F59E0B";
  };

  return (
    <div className="UserListe-container" style={style}>
      <div className="UserListe-card">
        {/* Header */}
        <div className="UserListe-header">
          <h1 className="UserListe-title">Liste des Utilisateurs</h1>
          
          <div className="UserListe-controls">
            {/* Bouton Filtre */}
            <div className="UserListe-filter-container">
              <button 
                className={`UserListe-filter-button ${filterOpen ? 'active' : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FaFilter className="UserListe-filter-icon" />
                <span className="UserListe-filter-text">Filtrer</span>
              </button>
              
              {/* Dropdown des filtres */}
              {filterOpen && (
                <div className="UserListe-filter-dropdown">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="UserListe-filter-category">
                      <h4 className="UserListe-filter-category-title">{category}</h4>
                      {options.map(option => (
                        <label key={option} className="UserListe-filter-option">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(option)}
                            onChange={() => toggleFilter(option)}
                          />
                          <span className="UserListe-filter-label">{option}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Barre de recherche */}
            <div className="UserListe-search-container">
              <FaSearch className="UserListe-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="UserListe-search-input"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="UserListe-table-container">
          <table className="UserListe-table">
            <thead className="UserListe-table-header">
              <tr>
                <th className="UserListe-table-th">Nom & Prénom</th>
                <th className="UserListe-table-th">Filière & Niveau</th>
                <th className="UserListe-table-th UserListe-table-th-mobile-hidden">Statut</th>
                <th className="UserListe-table-th UserListe-table-th-mobile-hidden">Documents</th>
                <th className="UserListe-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="UserListe-table-body">
              {currentUtilisateurs.map(user => (
                <tr key={user.id} className="UserListe-table-row">
                  <td className="UserListe-table-td">
                    <div className="UserListe-name-cell">
                      {user.nom} {user.prenom}
                    </div>
                  </td>
                  <td className="UserListe-table-td">
                    <div className="UserListe-filiere-container">
                      <span 
                        className="UserListe-filiere-badge"
                        style={{ 
                          '--badge-color': user.filiereColor,
                          '--badge-color-light': `${user.filiereColor}30`
                        }}
                      >
                        <span 
                          className="UserListe-filiere-dot"
                          style={{ backgroundColor: user.filiereColor }}
                        ></span>
                        {user.filiere} {user.niveau}
                      </span>
                      <div className="UserListe-specialisation">
                        {user.specialisation}
                      </div>
                    </div>
                  </td>
                  <td className="UserListe-table-td UserListe-table-td-mobile-hidden">
                    <div className="UserListe-statut-container">
                      <span 
                        className="UserListe-statut-badge"
                        style={{ 
                          '--statut-color': getStatutColor(user.statut),
                          '--statut-color-light': `${getStatutColor(user.statut)}20`
                        }}
                      >
                        <span 
                          className="UserListe-statut-icon"
                          style={{ color: getStatutColor(user.statut) }}
                        >
                          {getStatutIcon(user.statut)}
                        </span>
                        {user.statut}
                      </span>
                    </div>
                  </td>
                  <td className="UserListe-table-td UserListe-table-td-mobile-hidden">
                    <span className="UserListe-number">{user.documentsPublies}</span>
                  </td>
                  <td className="UserListe-table-td">
                    <button className="UserListe-action-button">
                      <FaEye className="UserListe-action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="UserListe-pagination">
          <div className="UserListe-pagination-info">
            Affichage {startIndex + 1}-{Math.min(endIndex, filteredUtilisateurs.length)} sur {filteredUtilisateurs.length}
          </div>
          
          <div className="UserListe-pagination-controls">
            <button
              className={`UserListe-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="UserListe-pagination-nav-icon" />
            </button>

            {getVisiblePages().map(page => (
              <button
                key={page}
                className={`UserListe-pagination-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className={`UserListe-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight className="UserListe-pagination-nav-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListe;