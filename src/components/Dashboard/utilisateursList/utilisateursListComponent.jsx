import React, { useState } from "react";
import "./UserListeComponent.css";
import { FaFilter, FaSearch, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaCheckCircle, FaClock, FaPause, FaUserTimes, FaPlus, FaBan, FaUserShield, FaGraduationCap } from "react-icons/fa";

const UserListeComponent = ({ style = {} }) => {
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

  // Données des utilisateurs avec les nouveaux champs
  const utilisateurs = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Marie",
      email: "marie.dupont@etudiant.univ.fr",
      matricule: "ETD123456",
      filiere: "IRT",
      niveau: "L3",
      specialite: "Architecture Logiciel",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 5,
      filiereColor: "#3B82F6",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@etudiant.univ.fr",
      matricule: "ETD123457",
      filiere: "Science de gestion",
      niveau: "M1",
      specialite: "Master 1",
      anneeAcademique: "2024-2025",
      statut: "Terminé",
      typeUtilisateur: "Étudiant",
      documentsPublies: 12,
      filiereColor: "#10B981",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Sophie",
      email: "sophie.bernard@etudiant.univ.fr",
      matricule: "ETD123458",
      filiere: "Droit",
      niveau: "L2",
      specialite: "Droit 2",
      anneeAcademique: "2024-2025",
      statut: "Suspendu",
      typeUtilisateur: "Étudiant",
      documentsPublies: 3,
      filiereColor: "#8B5CF6",
    },
    {
      id: 4,
      nom: "Leroy",
      prenom: "Pierre",
      email: "pierre.leroy@etudiant.univ.fr",
      matricule: "ETD123459",
      filiere: "Transport Logistique",
      niveau: "L3",
      specialite: "Transport",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 7,
      filiereColor: "#F59E0B",
    },
    {
      id: 5,
      nom: "Moreau",
      prenom: "Camille",
      email: "camille.moreau@etudiant.univ.fr",
      matricule: "ETD123460",
      filiere: "Management",
      niveau: "M2",
      specialite: "Master 2",
      anneeAcademique: "2024-2025",
      statut: "Terminé",
      typeUtilisateur: "Étudiant",
      documentsPublies: 15,
      filiereColor: "#06B6D4",
    },
    {
      id: 6,
      nom: "Petit",
      prenom: "Lucas",
      email: "lucas.petit@etudiant.univ.fr",
      matricule: "ETD123461",
      filiere: "CAC",
      niveau: "L1",
      specialite: "CAC 1",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 2,
      filiereColor: "#EF4444",
    },
    {
      id: 7,
      nom: "Robert",
      prenom: "Emma",
      email: "emma.robert@etudiant.univ.fr",
      matricule: "ETD123462",
      filiere: "IRT",
      niveau: "M1",
      specialite: "Master 1",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 9,
      filiereColor: "#3B82F6",
    },
    {
      id: 8,
      nom: "Dubois",
      prenom: "Thomas",
      email: "thomas.dubois@etudiant.univ.fr",
      matricule: "ETD123463",
      filiere: "Science de gestion",
      niveau: "L3",
      specialite: "Comptabilité",
      anneeAcademique: "2024-2025",
      statut: "Terminé",
      typeUtilisateur: "Étudiant",
      documentsPublies: 8,
      filiereColor: "#10B981",
    },
    {
      id: 9,
      nom: "Garcia",
      prenom: "Julie",
      email: "julie.garcia@etudiant.univ.fr",
      matricule: "ETD123464",
      filiere: "Droit",
      niveau: "L3",
      specialite: "Droit public",
      anneeAcademique: "2024-2025",
      statut: "Suspendu",
      typeUtilisateur: "Étudiant",
      documentsPublies: 6,
      filiereColor: "#8B5CF6",
    },
    {
      id: 10,
      nom: "Roux",
      prenom: "Antoine",
      email: "antoine.roux@etudiant.univ.fr",
      matricule: "ETD123465",
      filiere: "Management",
      niveau: "L3",
      specialite: "Management général",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 4,
      filiereColor: "#06B6D4",
    },
    {
      id: 11,
      nom: "Laurent",
      prenom: "Sarah",
      email: "sarah.laurent@admin.univ.fr",
      matricule: "ADM001",
      filiere: "Administration",
      niveau: "Admin",
      specialite: "Gestionnaire système",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Administrateur",
      documentsPublies: 25,
      filiereColor: "#7C3AED",
    },
    {
      id: 12,
      nom: "Michel",
      prenom: "David",
      email: "david.michel@etudiant.univ.fr",
      matricule: "ETD123467",
      filiere: "CAC",
      niveau: "L3",
      specialite: "Audit",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 3,
      filiereColor: "#EF4444",
    },
    {
      id: 13,
      nom: "Simon",
      prenom: "Clara",
      email: "clara.simon@etudiant.univ.fr",
      matricule: "ETD123468",
      filiere: "IRT",
      niveau: "L2",
      specialite: "IRT 2",
      anneeAcademique: "2024-2025",
      statut: "Terminé",
      typeUtilisateur: "Étudiant",
      documentsPublies: 13,
      filiereColor: "#3B82F6",
    },
    {
      id: 14,
      nom: "Blanc",
      prenom: "Nicolas",
      email: "nicolas.blanc@admin.univ.fr",
      matricule: "ADM002",
      filiere: "Administration",
      niveau: "Admin",
      specialite: "Responsable pédagogique",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Administrateur",
      documentsPublies: 45,
      filiereColor: "#7C3AED",
    },
    {
      id: 15,
      nom: "Faure",
      prenom: "Léa",
      email: "lea.faure@etudiant.univ.fr",
      matricule: "ETD123470",
      filiere: "Management",
      niveau: "L1",
      specialite: "Management 1",
      anneeAcademique: "2024-2025",
      statut: "En cours",
      typeUtilisateur: "Étudiant",
      documentsPublies: 1,
      filiereColor: "#06B6D4",
    }
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les utilisateurs
  const filteredUtilisateurs = utilisateurs.filter(user => {
    const matchesSearch = `${user.nom} ${user.prenom} ${user.email} ${user.matricule}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.some(filter => 
      user.filiere === filter || user.statut === filter || `${user.filiere} ${user.niveau}` === filter || user.anneeAcademique === filter || user.typeUtilisateur === filter
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
    const anneesAcademiques = [...new Set(utilisateurs.map(user => user.anneeAcademique))];
    const typesUtilisateur = [...new Set(utilisateurs.map(user => user.typeUtilisateur))];
    
    return {
      "Type d'utilisateur": typesUtilisateur,
      "Filières": filieres,
      "Statuts": statuts,
      "Filière + Niveau": filieresNiveaux,
      "Année académique": anneesAcademiques
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
    switch (statut) {
      case "En cours":
        return <FaClock />;
      case "Terminé":
        return <FaCheckCircle />;
      case "Suspendu":
        return <FaPause />;
      default:
        return <FaUserTimes />;
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut) => {
    switch (statut) {
      case "En cours":
        return "#F59E0B";
      case "Terminé":
        return "#10B981";
      case "Suspendu":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  // Fonction pour obtenir l'icône du type d'utilisateur
  const getTypeUtilisateurIcon = (type) => {
    return type === "Administrateur" ? <FaUserShield /> : <FaGraduationCap />;
  };

  // Fonction pour gérer la suspension/activation d'un utilisateur
  const handleToggleUserStatus = (userId) => {
    console.log("Toggle user status for user ID:", userId);
  };

  // Fonction pour ajouter un nouvel utilisateur
  const handleAddUser = () => {
    console.log("Add new user");
  };

  return (
    <div className="UserListeComponent-container" style={style}>
      <div className="UserListeComponent-card">
        {/* Header */}
        <div className="UserListeComponent-header">
          <h1 className="UserListeComponent-title">Liste des Utilisateurs</h1>
          
          <div className="UserListeComponent-header-controls">
            {/* Bouton Ajouter */}
            <button 
              className="UserListeComponent-add-button"
              onClick={handleAddUser}
            >
              <FaPlus className="UserListeComponent-add-icon" />
              <span className="UserListeComponent-add-text">Ajouter un utilisateur</span>
            </button>

            <div className="UserListeComponent-controls">
              {/* Bouton Filtre */}
              <div className="UserListeComponent-filter-container">
                <button 
                  className={`UserListeComponent-filter-button ${filterOpen ? 'active' : ''}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FaFilter className="UserListeComponent-filter-icon" />
                  <span className="UserListeComponent-filter-text">Filtrer</span>
                </button>
                
                {/* Dropdown des filtres */}
                {filterOpen && (
                  <div className="UserListeComponent-filter-dropdown">
                    {Object.entries(filterOptions).map(([category, options]) => (
                      <div key={category} className="UserListeComponent-filter-category">
                        <h4 className="UserListeComponent-filter-category-title">{category}</h4>
                        {options.map(option => (
                          <label key={option} className="UserListeComponent-filter-option">
                            <input
                              type="checkbox"
                              checked={selectedFilters.includes(option)}
                              onChange={() => toggleFilter(option)}
                            />
                            <span className="UserListeComponent-filter-label">{option}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Barre de recherche */}
              <div className="UserListeComponent-search-container">
                <FaSearch className="UserListeComponent-search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher (nom, email, matricule)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="UserListeComponent-search-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="UserListeComponent-table-container">
          <table className="UserListeComponent-table">
            <thead className="UserListeComponent-table-header">
              <tr>
                <th className="UserListeComponent-table-th">Utilisateur</th>
                <th className="UserListeComponent-table-th UserListeComponent-table-th-mobile-hidden">Matricule</th>
                <th className="UserListeComponent-table-th UserListeComponent-table-th-mobile-hidden">Type</th>
                <th className="UserListeComponent-table-th">Filière & Niveau</th>
                <th className="UserListeComponent-table-th UserListeComponent-table-th-mobile-hidden">Année</th>
                <th className="UserListeComponent-table-th">Statut</th>
                <th className="UserListeComponent-table-th UserListeComponent-table-th-mobile-hidden">Documents</th>
                <th className="UserListeComponent-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="UserListeComponent-table-body">
              {currentUtilisateurs.map(user => (
                <tr key={user.id} className="UserListeComponent-table-row">
                  <td className="UserListeComponent-table-td">
                    <div className="UserListeComponent-user-info">
                      <div className="UserListeComponent-name">
                        {user.nom} {user.prenom}
                      </div>
                      <div className="UserListeComponent-email">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="UserListeComponent-table-td UserListeComponent-table-td-mobile-hidden">
                    <span className="UserListeComponent-matricule">{user.matricule}</span>
                  </td>
                  <td className="UserListeComponent-table-td UserListeComponent-table-td-mobile-hidden">
                    <div className="UserListeComponent-type-container">
                      <span className="UserListeComponent-type-badge">
                        <span className="UserListeComponent-type-icon">
                          {getTypeUtilisateurIcon(user.typeUtilisateur)}
                        </span>
                        {user.typeUtilisateur}
                      </span>
                    </div>
                  </td>
                  <td className="UserListeComponent-table-td">
                    <div className="UserListeComponent-filiere-container">
                      <span 
                        className="UserListeComponent-filiere-badge"
                        style={{ 
                          '--badge-color': user.filiereColor,
                          '--badge-color-light': `${user.filiereColor}30`
                        }}
                      >
                        <span 
                          className="UserListeComponent-filiere-dot"
                          style={{ backgroundColor: user.filiereColor }}
                        ></span>
                        {user.filiere} {user.niveau}
                      </span>
                      <div className="UserListeComponent-specialite">
                        {user.specialite}
                      </div>
                    </div>
                  </td>
                  <td className="UserListeComponent-table-td UserListeComponent-table-td-mobile-hidden">
                    <span className="UserListeComponent-annee">{user.anneeAcademique}</span>
                  </td>
                  <td className="UserListeComponent-table-td">
                    <div className="UserListeComponent-statut-container">
                      <span 
                        className="UserListeComponent-statut-badge"
                        style={{ 
                          '--statut-color': getStatutColor(user.statut),
                          '--statut-color-light': `${getStatutColor(user.statut)}20`
                        }}
                      >
                        <span 
                          className="UserListeComponent-statut-icon"
                          style={{ color: getStatutColor(user.statut) }}
                        >
                          {getStatutIcon(user.statut)}
                        </span>
                        {user.statut}
                      </span>
                    </div>
                  </td>
                  <td className="UserListeComponent-table-td UserListeComponent-table-td-mobile-hidden">
                    <span className="UserListeComponent-number">{user.documentsPublies}</span>
                  </td>
                  <td className="UserListeComponent-table-td">
                    <div className="UserListeComponent-actions">
                      <button className="UserListeComponent-action-button view" title="Voir">
                        <FaEye className="UserListeComponent-action-icon" />
                      </button>
                      <button className="UserListeComponent-action-button edit" title="Modifier">
                        <FaEdit className="UserListeComponent-action-icon" />
                      </button>
                      {user.statut !== "Suspendu" ? (
                        <button 
                          className="UserListeComponent-action-button suspend" 
                          title="Suspendre"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          <FaBan className="UserListeComponent-action-icon" />
                        </button>
                      ) : (
                        <button 
                          className="UserListeComponent-action-button activate" 
                          title="Activer"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          <FaCheckCircle className="UserListeComponent-action-icon" />
                        </button>
                      )}
                      <button className="UserListeComponent-action-button delete" title="Supprimer">
                        <FaTrash className="UserListeComponent-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="UserListeComponent-pagination">
          <div className="UserListeComponent-pagination-info">
            Affichage {startIndex + 1}-{Math.min(endIndex, filteredUtilisateurs.length)} sur {filteredUtilisateurs.length}
          </div>
          
          <div className="UserListeComponent-pagination-controls">
            <button
              className={`UserListeComponent-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="UserListeComponent-pagination-nav-icon" />
            </button>

            {getVisiblePages().map(page => (
              <button
                key={page}
                className={`UserListeComponent-pagination-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className={`UserListeComponent-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight className="UserListeComponent-pagination-nav-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListeComponent;