import React, { useState } from "react";
import "./FiliereComponent.css";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaChevronRight, FaChevronLeft, FaGraduationCap } from "react-icons/fa";
import FiliereAdd from "../../Modal/DasboardModal/FiliereAdd";

const FiliereComponent = ({ style = {} }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Données des filières avec spécialités
    const [filieres, setFilieres] = useState([
        {
            id: 1,
            code: "#0001",
            abbreviation: "IRT1",
            nom: "Informatique Réseau Télécommunication",
            niveau: "Première année",
            description: "Informatique réseau Télécommunication première année",
            specialite: null,
            couleur: "#3B82F6",
            etudiants: 45,
            professeurs: 8
        },
        {
            id: 2,
            code: "#0002",
            abbreviation: "IRT2",
            nom: "Informatique Réseau Télécommunication",
            niveau: "Deuxième année",
            description: "Informatique réseau Télécommunication Deuxième année",
            specialite: null,
            couleur: "#3B82F6",
            etudiants: 42,
            professeurs: 7
        },
        {
            id: 3,
            code: "#0003",
            abbreviation: "SG1",
            nom: "Science de Gestion",
            niveau: "Première année",
            description: "Science de gestion première année",
            specialite: null,
            couleur: "#10B981",
            etudiants: 38,
            professeurs: 6
        },
        {
            id: 4,
            code: "#0004",
            abbreviation: "IRT3 SRS",
            nom: "Informatique Réseau Télécommunication",
            niveau: "Troisième année",
            description: "Spécialité Système Réseau Sécurité",
            specialite: "Système Réseau Sécurité",
            couleur: "#8B5CF6",
            etudiants: 25,
            professeurs: 5
        },
        {
            id: 5,
            code: "#0005",
            abbreviation: "IRT3 AL",
            nom: "Informatique Réseau Télécommunication",
            niveau: "Troisième année",
            description: "Spécialité Architecture Logiciel",
            specialite: "Architecture Logiciel",
            couleur: "#8B5CF6",
            etudiants: 28,
            professeurs: 5
        },
        {
            id: 6,
            code: "#0006",
            abbreviation: "SG2",
            nom: "Science de Gestion",
            niveau: "Deuxième année",
            description: "Science de gestion deuxième année",
            specialite: null,
            couleur: "#10B981",
            etudiants: 35,
            professeurs: 6
        }
    ]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fonctions pour gérer le modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddFiliere = (newFiliere) => {
        setFilieres(prevFilieres => [...prevFilieres, newFiliere]);
        closeModal();
    };

    // Filtrer les filières
    const filteredFilieres = filieres.filter(filiere => {
        const matchesSearch = `${filiere.nom} ${filiere.abbreviation} ${filiere.description}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNiveau = selectedNiveau === "" || filiere.niveau === selectedNiveau;
        return matchesSearch && matchesNiveau;
    });

    // Pagination
    const totalPages = Math.ceil(filteredFilieres.length / itemsPerPage);
    const totalItems = filteredFilieres.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFilieres = filteredFilieres.slice(startIndex, endIndex);

    // Obtenir les niveaux uniques
    const niveaux = [...new Set(filieres.map(filiere => filiere.niveau))];

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

    return (
        <div className="filiereComponent-container" style={style}>
            {/* Effet de flou sur le contenu principal quand le modal est ouvert */}
            <div className={`filiereComponent-card ${isModalOpen ? 'blur-background' : ''}`}>
                {/* Header */}
                <div className="filiereComponent-header">
                    <h1 className="filiereComponent-title">Gestion des Filières</h1>

                    <div className="filiereComponent-controls">
                        {/* Barre de recherche */}
                        <div className="filiereComponent-search-container">
                            <FaSearch className="filiereComponent-search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher une filière..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filiereComponent-search-input"
                            />
                        </div>

                        {/* Filtre par niveau */}
                        <select
                            value={selectedNiveau}
                            onChange={(e) => setSelectedNiveau(e.target.value)}
                            className="filiereComponent-filter-select"
                        >
                            <option value="">Tous les niveaux</option>
                            {niveaux.map(niveau => (
                                <option key={niveau} value={niveau}>{niveau}</option>
                            ))}
                        </select>

                        {/* Bouton Ajouter */}
                        <button 
                            className="filiereComponent-add-button"
                            onClick={openModal}
                        >
                            <FaPlus className="filiereComponent-add-icon" />
                            <span className="filiereComponent-add-text">Ajouter Filière</span>
                        </button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="filiereComponent-stats">
                    <div className="filiereComponent-stat-card">
                        <div className="filiereComponent-stat-icon filiereComponent-stat-icon-blue">
                            <FaGraduationCap />
                        </div>
                        <div className="filiereComponent-stat-content">
                            <div className="filiereComponent-stat-number">{filieres.length}</div>
                            <div className="filiereComponent-stat-label">Filières Total</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="filiereComponent-table-container">
                    <table className="filiereComponent-table">
                        <thead className="filiereComponent-table-header">
                            <tr>
                                <th className="filiereComponent-table-th">Code</th>
                                <th className="filiereComponent-table-th">Sigle</th>
                                <th className="filiereComponent-table-th">Nom & Niveau</th>
                                <th className="filiereComponent-table-th">Spécialité</th>
                                <th className="filiereComponent-table-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="filiereComponent-table-body">
                            {currentFilieres.length > 0 ? (
                                currentFilieres.map(filiere => (
                                    <tr key={filiere.id} className="filiereComponent-table-row">
                                        <td className="filiereComponent-table-td">
                                            <span className="filiereComponent-code">{filiere.code}</span>
                                        </td>
                                        <td className="filiereComponent-table-td">
                                            <div className="filiereComponent-abbreviation-container">
                                                <span
                                                    className="filiereComponent-abbreviation-badge"
                                                    style={{
                                                        backgroundColor: `${filiere.couleur}20`,
                                                        color: filiere.couleur,
                                                        borderColor: `${filiere.couleur}40`
                                                    }}
                                                >
                                                    {filiere.abbreviation}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="filiereComponent-table-td">
                                            <div className="filiereComponent-name-cell">
                                                <div className="filiereComponent-nom">{filiere.nom}</div>
                                                <div className="filiereComponent-niveau">{filiere.niveau}</div>
                                            </div>
                                        </td>
                                        <td className="filiereComponent-table-td">
                                            {filiere.specialite ? (
                                                <span className="filiereComponent-specialite">{filiere.specialite}</span>
                                            ) : (
                                                <span className="filiereComponent-no-specialite">Tronc commun</span>
                                            )}
                                        </td>
                                        <td className="filiereComponent-table-td">
                                            <div className="filiereComponent-actions">
                                                <button className="filiereComponent-action-button filiereComponent-action-edit">
                                                    <FaEdit className="filiereComponent-action-icon" />
                                                </button>
                                                <button className="filiereComponent-action-button filiereComponent-action-delete">
                                                    <FaTrash className="filiereComponent-action-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="filiereComponent-table-row">
                                    <td colSpan="5" className="filiereComponent-table-td filiereComponent-no-results">
                                        Aucune filière ne correspond à votre recherche
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredFilieres.length > 0 && (
                    <div className="filiereComponent-pagination">
                        <div className="filiereComponent-pagination-info">
                            Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
                        </div>

                        <div className="filiereComponent-pagination-controls">
                            <button
                                className={`filiereComponent-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="filiereComponent-pagination-nav-icon" />
                            </button>
                            {getVisiblePages().map(page => (
                                <button
                                    key={page}
                                    className={`filiereComponent-pagination-button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`filiereComponent-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight className="filiereComponent-pagination-nav-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal FiliereAdd - Affiché conditionnellement */}
            {isModalOpen && (
                <FiliereAdd
                    onClose={closeModal}
                    onAddFiliere={handleAddFiliere}
                />
            )}
        </div>
    );
};

export default FiliereComponent;