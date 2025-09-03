import React, { useState } from "react";
import "./NiveauManager.css";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaChevronRight, FaChevronLeft, FaGraduationCap } from "react-icons/fa";
import NiveauAdd from "../../modal/NiveauAdd";


const NiveauManager = ({ style = {} }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Données des niveaux universitaires
    const [niveaux, setNiveaux] = useState([
        {
            id: 1,
            code: "L1",
            nom: "Licence 1 (L1)",
            description: "Première année de licence",
            ordre: 1,
            actif: true
        },
        {
            id: 2,
            code: "L2",
            nom: "Licence 2 (L2)",
            description: "Deuxième année de licence",
            ordre: 2,
            actif: true
        },
        {
            id: 3,
            code: "L3",
            nom: "Licence 3 (L3)",
            description: "Troisième année de licence",
            ordre: 3,
            actif: true
        },
        {
            id: 4,
            code: "M1",
            nom: "Master 1 (M1)",
            description: "Première année de master",
            ordre: 4,
            actif: true
        },
        {
            id: 5,
            code: "M2",
            nom: "Master 2 (M2)",
            description: "Deuxième année de master",
            ordre: 5,
            actif: true
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

    const handleAddNiveau = (newNiveau) => {
        const niveauWithId = {
            ...newNiveau,
            id: Date.now(),
            ordre: niveaux.length + 1,
            actif: true
        };
        setNiveaux(prevNiveaux => [...prevNiveaux, niveauWithId]);
        closeModal();
    };

    const handleDeleteNiveau = (niveauId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
            setNiveaux(prevNiveaux => prevNiveaux.filter(niveau => niveau.id !== niveauId));
        }
    };

    const handleToggleActif = (niveauId) => {
        setNiveaux(prevNiveaux =>
            prevNiveaux.map(niveau =>
                niveau.id === niveauId
                    ? { ...niveau, actif: !niveau.actif }
                    : niveau
            )
        );
    };

    // Filtrer les niveaux
    const filteredNiveaux = niveaux.filter(niveau => {
        const matchesSearch = `${niveau.nom} ${niveau.code} ${niveau.description}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredNiveaux.length / itemsPerPage);
    const totalItems = filteredNiveaux.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNiveaux = filteredNiveaux.slice(startIndex, endIndex);

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
        <div className="niveauManager-container" style={style}>
            {/* Effet de flou sur le contenu principal quand le modal est ouvert */}
            <div className={`niveauManager-card ${isModalOpen ? 'blur-background' : ''}`}>
                {/* Header */}
                <div className="niveauManager-header">
                    <h1 className="niveauManager-title">Gestion des Niveaux</h1>

                    <div className="niveauManager-controls">
                        {/* Barre de recherche */}
                        <div className="niveauManager-search-container">
                            <FaSearch className="niveauManager-search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher un niveau..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="niveauManager-search-input"
                            />
                        </div>

                        {/* Bouton Ajouter */}
                        <button 
                            className="niveauManager-add-button"
                            onClick={openModal}
                        >
                            <FaPlus className="niveauManager-add-icon" />
                            <span className="niveauManager-add-text">Ajouter Niveau</span>
                        </button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="niveauManager-stats">
                    <div className="niveauManager-stat-card">
                        <div className="niveauManager-stat-icon niveauManager-stat-icon-blue">
                            <FaGraduationCap />
                        </div>
                        <div className="niveauManager-stat-content">
                            <div className="niveauManager-stat-number">{niveaux.length}</div>
                            <div className="niveauManager-stat-label">Niveaux Total</div>
                        </div>
                    </div>
                    <div className="niveauManager-stat-card">
                        <div className="niveauManager-stat-icon niveauManager-stat-icon-green">
                            <FaGraduationCap />
                        </div>
                        <div className="niveauManager-stat-content">
                            <div className="niveauManager-stat-number">{niveaux.filter(n => n.actif).length}</div>
                            <div className="niveauManager-stat-label">Niveaux Actifs</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="niveauManager-table-container">
                    <table className="niveauManager-table">
                        <thead className="niveauManager-table-header">
                            <tr>
                                <th className="niveauManager-table-th">Code</th>
                                <th className="niveauManager-table-th">Nom</th>
                                <th className="niveauManager-table-th">Description</th>
                                <th className="niveauManager-table-th">Statut</th>
                                <th className="niveauManager-table-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="niveauManager-table-body">
                            {currentNiveaux.length > 0 ? (
                                currentNiveaux.map(niveau => (
                                    <tr key={niveau.id} className="niveauManager-table-row">
                                        <td className="niveauManager-table-td">
                                            <span className="niveauManager-code">{niveau.code}</span>
                                        </td>
                                        <td className="niveauManager-table-td">
                                            <div className="niveauManager-nom">{niveau.nom}</div>
                                        </td>
                                        <td className="niveauManager-table-td">
                                            <div className="niveauManager-description">{niveau.description}</div>
                                        </td>
                                        <td className="niveauManager-table-td">
                                            <button
                                                className={`niveauManager-status-badge ${niveau.actif ? 'actif' : 'inactif'}`}
                                                onClick={() => handleToggleActif(niveau.id)}
                                            >
                                                {niveau.actif ? 'Actif' : 'Inactif'}
                                            </button>
                                        </td>
                                        <td className="niveauManager-table-td">
                                            <div className="niveauManager-actions">
                                                <button className="niveauManager-action-button niveauManager-action-edit">
                                                    <FaEdit className="niveauManager-action-icon" />
                                                </button>
                                                <button 
                                                    className="niveauManager-action-button niveauManager-action-delete"
                                                    onClick={() => handleDeleteNiveau(niveau.id)}
                                                >
                                                    <FaTrash className="niveauManager-action-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="niveauManager-table-row">
                                    <td colSpan="5" className="niveauManager-table-td niveauManager-no-results">
                                        Aucun niveau ne correspond à votre recherche
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredNiveaux.length > 0 && (
                    <div className="niveauManager-pagination">
                        <div className="niveauManager-pagination-info">
                            Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
                        </div>

                        <div className="niveauManager-pagination-controls">
                            <button
                                className={`niveauManager-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="niveauManager-pagination-nav-icon" />
                            </button>
                            {getVisiblePages().map(page => (
                                <button
                                    key={page}
                                    className={`niveauManager-pagination-button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`niveauManager-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight className="niveauManager-pagination-nav-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal NiveauAdd - Affiché conditionnellement */}
            {isModalOpen && (
                <NiveauAdd
                    onClose={closeModal}
                    onAddNiveau={handleAddNiveau}
                />
            )}
        </div>
    );
};

export default NiveauManager;