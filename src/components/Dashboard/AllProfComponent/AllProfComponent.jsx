import React, { useState } from "react";
import "./AllProfComponent.css";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ProfAddModal from "../../Modal/DasboardModal/ProfAddModal";

const AllProfComponent = ({ style = {} }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [professeurs, setProfesseurs] = useState([
        {
            id: 1,
            nom: "Bernard",
            prenom: "Céline",
            titre: "Professeur",
            identifiant: "bernard.c",
            filiere: "Mathématiques",
            filiereColor: "#10B981",
        },
        {
            id: 2,
            nom: "Dupont",
            prenom: "Jean",
            titre: "Maître de conférences",
            identifiant: "dupont.j",
            filiere: "Informatique",
            filiereColor: "#3B82F6",
        },
        {
            id: 3,
            nom: "Durand",
            prenom: "Pierre",
            titre: "Professeur",
            identifiant: "durand.p",
            filiere: "Physique",
            filiereColor: "#8B5CF6",
        },
        {
            id: 4,
            nom: "Fournier",
            prenom: "Sandrine",
            titre: "Maître de conférences",
            identifiant: "fournier.s",
            filiere: "Chimie",
            filiereColor: "#F59E0B",
        },
        {
            id: 5,
            nom: "Laurent",
            prenom: "Nicolas",
            titre: "Professeur",
            identifiant: "laurent.n",
            filiere: "Électronique",
            filiereColor: "#06B6D4",
        },
        {
            id: 6,
            nom: "Lefebvre",
            prenom: "Sophie",
            titre: "Professeur",
            identifiant: "lefebvre.s",
            filiere: "Chimie",
            filiereColor: "#F59E0B",
        },
        {
            id: 7,
            nom: "Martin",
            prenom: "Marie",
            titre: "Maître de conférences",
            identifiant: "martin.m",
            filiere: "Mathématiques",
            filiereColor: "#10B981",
        },
        {
            id: 8,
            nom: "Michel",
            prenom: "David",
            titre: "Professeur",
            identifiant: "michel.d",
            filiere: "Informatique",
            filiereColor: "#3B82F6",
        },
        {
            id: 9,
            nom: "Moreau",
            prenom: "Thomas",
            titre: "Professeur",
            identifiant: "moreau.t",
            filiere: "Biologie",
            filiereColor: "#EF4444",
        },
        {
            id: 10,
            nom: "Petit",
            prenom: "Isabelle",
            titre: "Maître de conférences",
            identifiant: "petit.i",
            filiere: "Génie Civil",
            filiereColor: "#F97316",
        },
        {
            id: 11,
            nom: "Robert",
            prenom: "Antoine",
            titre: "Professeur",
            identifiant: "robert.a",
            filiere: "Génie Civil",
            filiereColor: "#F97316",
        },
        {
            id: 12,
            nom: "Garcia",
            prenom: "Elena",
            titre: "Professeur",
            identifiant: "garcia.e",
            filiere: "Biologie",
            filiereColor: "#EF4444",
        },
        {
            id: 13,
            nom: "Leroy",
            prenom: "François",
            titre: "Maître de conférences",
            identifiant: "leroy.f",
            filiere: "Physique",
            filiereColor: "#8B5CF6",
        },
        {
            id: 14,
            nom: "Roux",
            prenom: "Camille",
            titre: "Professeur",
            identifiant: "roux.c",
            filiere: "Électronique",
            filiereColor: "#06B6D4",
        },
        {
            id: 15,
            nom: "Blanc",
            prenom: "Lucas",
            titre: "Maître de conférences",
            identifiant: "blanc.l",
            filiere: "Informatique",
            filiereColor: "#3B82F6",
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddProfesseur = (newProfesseur) => {
        setProfesseurs(prevProfesseurs => [...prevProfesseurs, newProfesseur]);
    };

    const filteredProfesseurs = professeurs.filter(prof => {
        const matchesSearch = `${prof.nom} ${prof.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFiliere = selectedFiliere === "" || prof.filiere === selectedFiliere;
        return matchesSearch && matchesFiliere;
    });

    const totalPages = Math.ceil(filteredProfesseurs.length / itemsPerPage);
    const totalItems = filteredProfesseurs.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProfesseurs = filteredProfesseurs.slice(startIndex, endIndex);

    const filieres = [...new Set(professeurs.map(prof => prof.filiere))];

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
        <div className="AllProfComponent-container" style={style}>
            <div className="AllProfComponent-card">
                <div className="AllProfComponent-header">
                    <h1 className="AllProfComponent-title">Liste des Professeurs</h1>

                    <div className="AllProfComponent-controls">
                        <div className="AllProfComponent-search-container">
                            <FaSearch className="AllProfComponent-search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher un professeur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="AllProfComponent-search-input"
                            />
                        </div>

                        <button 
                            className="AllProfComponent-add-button"
                            onClick={openModal}
                        >
                            <FaPlus className="AllProfComponent-add-icon" />
                            <span className="AllProfComponent-add-text">Ajouter Professeur</span>
                        </button>
                    </div>
                </div>

                <div className="AllProfComponent-table-container">
                    {filteredProfesseurs.length === 0 ? (
                        <div className="AllProfComponent-no-results">
                            Aucun professeur ne correspond à votre recherche
                        </div>
                    ) : (
                        <table className="AllProfComponent-table">
                            <thead className="AllProfComponent-table-header">
                                <tr>
                                    <th className="AllProfComponent-table-th">Nom & Prénom</th>
                                    <th className="AllProfComponent-table-th">Titre</th>
                                    <th className="AllProfComponent-table-th AllProfComponent-table-th-mobile-hidden">Identifiant</th>
                                    <th className="AllProfComponent-table-th">Filière</th>
                                    <th className="AllProfComponent-table-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="AllProfComponent-table-body">
                                {currentProfesseurs.map(prof => (
                                    <tr key={prof.id} className="AllProfComponent-table-row">
                                        <td className="AllProfComponent-table-td">
                                            <div className="AllProfComponent-name-cell">
                                                {prof.nom} {prof.prenom}
                                            </div>
                                        </td>
                                        <td className="AllProfComponent-table-td">
                                            <span className="AllProfComponent-titre">{prof.titre}</span>
                                        </td>
                                        <td className="AllProfComponent-table-td AllProfComponent-table-td-mobile-hidden">
                                            <span className="AllProfComponent-identifiant">{prof.identifiant}</span>
                                        </td>
                                        <td className="AllProfComponent-table-td">
                                            <div className="AllProfComponent-filiere-container">
                                                <span
                                                    className="AllProfComponent-filiere-badge"
                                                    style={{
                                                        backgroundColor: `${prof.filiereColor}20`,
                                                        color: prof.filiereColor,
                                                        borderColor: `${prof.filiereColor}40`
                                                    }}
                                                >
                                                    {prof.filiere}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="AllProfComponent-table-td">
                                            <div className="AllProfComponent-actions">
                                                <button className="AllProfComponent-action-button AllProfComponent-action-view">
                                                    <FaEye className="AllProfComponent-action-icon" />
                                                </button>
                                                <button className="AllProfComponent-action-button AllProfComponent-action-edit">
                                                    <FaEdit className="AllProfComponent-action-icon" />
                                                </button>
                                                <button className="AllProfComponent-action-button AllProfComponent-action-delete">
                                                    <FaTrash className="AllProfComponent-action-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {filteredProfesseurs.length > 0 && (
                    <div className="AllProfComponent-pagination">
                        <div className="AllProfComponent-pagination-info">
                            Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
                        </div>

                        <div className="AllProfComponent-pagination-controls">
                            <button
                                className={`AllProfComponent-pagination-nav-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="AllProfComponent-pagination-nav-icon" />
                            </button>
                            {getVisiblePages().map(page => (
                                <button
                                    key={page}
                                    className={`AllProfComponent-pagination-button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`AllProfComponent-pagination-nav-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight className="AllProfComponent-pagination-nav-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ProfAddModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddProfesseur={handleAddProfesseur}
            />
        </div>
    );
};

export default AllProfComponent;