import React, { useState } from "react";
import "./SpecialiteManager.css";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaChevronRight, FaChevronLeft, FaGraduationCap } from "react-icons/fa";
import SpecialiteAdd from "../../modal/SpecialiteAdd";

const SpecialiteManager = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Données des filières et niveaux (normalement récupérées depuis le contexte ou l'API)
    const [filieres] = useState([
        { id: 1, nom: "Informatique Réseau Télécommunication", code: "IRT" },
        { id: 2, nom: "Science de Gestion", code: "SG" }
    ]);
    
    const [niveaux] = useState([
        { id: 1, nom: "Licence 3", code: "L3" },
        { id: 2, nom: "Master 1", code: "M1" },
        { id: 3, nom: "Master 2", code: "M2" }
    ]);
    
    const [specialites, setSpecialites] = useState([
        {
            id: 1,
            nom: "Système Réseau Sécurité",
            code: "SRS",
            filiere: 1, // Référence à l'ID de la filière
            niveau: 1,  // Référence à l'ID du niveau
            description: "Spécialité en systèmes, réseaux et sécurité"
        },
        {
            id: 2,
            nom: "Architecture Logiciel",
            code: "AL",
            filiere: 1,
            niveau: 1,
            description: "Spécialité en architecture logicielle"
        }
    ]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fonctions pour gérer le modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddSpecialite = (newSpecialite) => {
        setSpecialites(prev => [...prev, { ...newSpecialite, id: Date.now() }]);
        closeModal();
    };

    // Filtrer les spécialités
    const filteredSpecialites = specialites.filter(specialite => {
        const matchesSearch = `${specialite.nom} ${specialite.code} ${specialite.description}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFiliere = selectedFiliere === "" || specialite.filiere === parseInt(selectedFiliere);
        const matchesNiveau = selectedNiveau === "" || specialite.niveau === parseInt(selectedNiveau);
        return matchesSearch && matchesFiliere && matchesNiveau;
    });

    // Pagination
    const totalPages = Math.ceil(filteredSpecialites.length / itemsPerPage);
    const totalItems = filteredSpecialites.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSpecialites = filteredSpecialites.slice(startIndex, endIndex);

    const goToPage = (page) => setCurrentPage(page);
    const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const getVisiblePages = () => {
        const maxVisiblePages = 5;
        const pages = [];
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) pages.push(i);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) pages.push(i);
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
            }
        }
        
        return pages;
    };

    // Fonction pour obtenir le nom d'une filière à partir de son ID
    const getFiliereNom = (filiereId) => {
        const filiere = filieres.find(f => f.id === filiereId);
        return filiere ? `${filiere.nom} (${filiere.code})` : "Filière inconnue";
    };

    // Fonction pour obtenir le nom d'un niveau à partir de son ID
    const getNiveauNom = (niveauId) => {
        const niveau = niveaux.find(n => n.id === niveauId);
        return niveau ? niveau.nom : "Niveau inconnu";
    };

    return (
        <div className="specialiteManager-container">
            <div className={`specialiteManager-card ${isModalOpen ? 'blur-background' : ''}`}>
                {/* Header */}
                <div className="specialiteManager-header">
                    <h1 className="specialiteManager-title">Gestion des Spécialités</h1>

                    <div className="specialiteManager-controls">
                        {/* Barre de recherche */}
                        <div className="specialiteManager-search-container">
                            <FaSearch className="specialiteManager-search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher une spécialité..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="specialiteManager-search-input"
                            />
                        </div>

                        {/* Filtre par filière */}
                        <select
                            value={selectedFiliere}
                            onChange={(e) => setSelectedFiliere(e.target.value)}
                            className="specialiteManager-filter-select"
                        >
                            <option value="">Toutes les filières</option>
                            {filieres.map(filiere => (
                                <option key={filiere.id} value={filiere.id}>{filiere.nom}</option>
                            ))}
                        </select>

                        {/* Filtre par niveau */}
                        <select
                            value={selectedNiveau}
                            onChange={(e) => setSelectedNiveau(e.target.value)}
                            className="specialiteManager-filter-select"
                        >
                            <option value="">Tous les niveaux</option>
                            {niveaux.map(niveau => (
                                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                            ))}
                        </select>

                        {/* Bouton Ajouter */}
                        <button 
                            className="specialiteManager-add-button"
                            onClick={openModal}
                        >
                            <FaPlus className="specialiteManager-add-icon" />
                            <span className="specialiteManager-add-text">Ajouter Spécialité</span>
                        </button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="specialiteManager-stats">
                    <div className="specialiteManager-stat-card">
                        <div className="specialiteManager-stat-icon specialiteManager-stat-icon-blue">
                            <FaGraduationCap />
                        </div>
                        <div className="specialiteManager-stat-content">
                            <div className="specialiteManager-stat-number">{specialites.length}</div>
                            <div className="specialiteManager-stat-label">Spécialités Total</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="specialiteManager-table-container">
                    <table className="specialiteManager-table">
                        <thead className="specialiteManager-table-header">
                            <tr>
                                <th className="specialiteManager-table-th">Code</th>
                                <th className="specialiteManager-table-th">Nom</th>
                                <th className="specialiteManager-table-th">Filière</th>
                                <th className="specialiteManager-table-th">Niveau</th>
                                <th className="specialiteManager-table-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="specialiteManager-table-body">
                            {currentSpecialites.length > 0 ? (
                                currentSpecialites.map(specialite => (
                                    <tr key={specialite.id} className="specialiteManager-table-row">
                                        <td className="specialiteManager-table-td">
                                            <span className="specialiteManager-code">{specialite.code}</span>
                                        </td>
                                        <td className="specialiteManager-table-td">
                                            <div className="specialiteManager-name-cell">
                                                <div className="specialiteManager-nom">{specialite.nom}</div>
                                                <div className="specialiteManager-description">{specialite.description}</div>
                                            </div>
                                        </td>
                                        <td className="specialiteManager-table-td">
                                            <div className="specialiteManager-filiere">
                                                {getFiliereNom(specialite.filiere)}
                                            </div>
                                        </td>
                                        <td className="specialiteManager-table-td">
                                            <div className="specialiteManager-niveau">
                                                {getNiveauNom(specialite.niveau)}
                                            </div>
                                        </td>
                                        <td className="specialiteManager-table-td">
                                            <div className="specialiteManager-actions">
                                                <button className="specialiteManager-action-button specialiteManager-action-edit">
                                                    <FaEdit className="specialiteManager-action-icon" />
                                                </button>
                                                <button className="specialiteManager-action-button specialiteManager-action-delete">
                                                    <FaTrash className="specialiteManager-action-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="specialiteManager-table-row">
                                    <td colSpan="5" className="specialiteManager-table-td specialiteManager-no-results">
                                        Aucune spécialité ne correspond à votre recherche
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredSpecialites.length > 0 && (
                    <div className="specialiteManager-pagination">
                        <div className="specialiteManager-pagination-info">
                            Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
                        </div>

                        <div className="specialiteManager-pagination-controls">
                            <button
                                className={`specialiteManager-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="specialiteManager-pagination-nav-icon" />
                            </button>
                            {getVisiblePages().map(page => (
                                <button
                                    key={page}
                                    className={`specialiteManager-pagination-button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`specialiteManager-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight className="specialiteManager-pagination-nav-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal SpecialiteAdd */}
            {isModalOpen && (
                <SpecialiteAdd
                    onClose={closeModal}
                    onAddSpecialite={handleAddSpecialite}
                    filieres={filieres}
                    niveaux={niveaux}
                />
            )}
        </div>
    );
};

export default SpecialiteManager;