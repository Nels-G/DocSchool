import React, { useState, useEffect } from 'react';
import './DocumentsComponents.css';

const DocumentsComponents = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const itemsPerPage = 10;

  const tabs = [
    { key: 'tous', label: 'Tous les documents', count: 12 },
    { key: 'cours', label: 'Cours', count: 6 },
    { key: 'td-tp', label: 'TD/TP', count: 3 },
    { key: 'projets', label: 'Projets', count: 2 },
    { key: 'exercices', label: 'Exercices', count: 1 }
  ];

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
      category: "Finance",
      type: "cours",
      level: "Master 2",
      author: "Prof. Martin",
      dateAdded: "2024-08-20",
      status: "publié",
      views: 3892,
      downloads: 856,
      fileSize: "2.5 MB",
      format: "PDF"
    },
    {
      id: 2,
      title: "Introduction au Calcul",
      category: "Finance",
      type: "cours",
      level: "Master 1",
      author: "Prof. Dubois",
      dateAdded: "2024-08-19",
      status: "publié",
      views: 3892,
      downloads: 856,
      fileSize: "1.8 MB",
      format: "PDF"
    },
    {
      id: 3,
      title: "Analyse Financière Avancée",
      category: "Finance",
      type: "td-tp",
      level: "Licence 1",
      author: "Prof. Laurent",
      dateAdded: "2024-08-18",
      status: "brouillon",
      views: 2156,
      downloads: 623,
      fileSize: "3.2 MB",
      format: "PDF"
    },
    {
      id: 4,
      title: "Marketing Digital",
      category: "Marketing",
      type: "cours",
      level: "Master 1",
      author: "Prof. Leroy",
      dateAdded: "2024-08-17",
      status: "publié",
      views: 4567,
      downloads: 1234,
      fileSize: "4.1 MB",
      format: "PDF"
    },
    {
      id: 5,
      title: "Gestion des Ressources Humaines",
      category: "Ressources Humaines",
      type: "cours",
      level: "Licence 3",
      author: "Prof. Bernard",
      dateAdded: "2024-08-16",
      status: "publié",
      views: 3234,
      downloads: 678,
      fileSize: "2.9 MB",
      format: "PDF"
    },
    {
      id: 6,
      title: "Audit et Contrôle Interne",
      category: "Audit et Contrôle de Gestion",
      type: "projets",
      level: "Master 2",
      author: "Prof. Moreau",
      dateAdded: "2024-08-15",
      status: "archivé",
      views: 2789,
      downloads: 567,
      fileSize: "5.3 MB",
      format: "PDF"
    },
    {
      id: 7,
      title: "Commerce International",
      category: "Commerce International",
      type: "cours",
      level: "Master 1",
      author: "Prof. Petit",
      dateAdded: "2024-08-14",
      status: "publié",
      views: 1987,
      downloads: 445,
      fileSize: "1.6 MB",
      format: "PDF"
    },
    {
      id: 8,
      title: "Statistiques Appliquées",
      category: "Finance",
      type: "exercices",
      level: "Licence 2",
      author: "Prof. Garcia",
      dateAdded: "2024-08-13",
      status: "publié",
      views: 3456,
      downloads: 789,
      fileSize: "2.2 MB",
      format: "PDF"
    },
    {
      id: 9,
      title: "Économie Internationale",
      category: "Commerce International",
      type: "cours",
      level: "Master 2",
      author: "Prof. Roux",
      dateAdded: "2024-08-12",
      status: "publié",
      views: 2345,
      downloads: 534,
      fileSize: "3.7 MB",
      format: "PDF"
    },
    {
      id: 10,
      title: "Droit des Affaires",
      category: "Commerce International",
      type: "cours",
      level: "Master 1",
      author: "Prof. Simon",
      dateAdded: "2024-08-11",
      status: "publié",
      views: 1876,
      downloads: 398,
      fileSize: "2.8 MB",
      format: "PDF"
    },
    {
      id: 11,
      title: "Mathématiques Financières",
      category: "Finance",
      type: "td-tp",
      level: "Master 2",
      author: "Prof. Durand",
      dateAdded: "2024-08-10",
      status: "publié",
      views: 2987,
      downloads: 712,
      fileSize: "4.5 MB",
      format: "PDF"
    },
    {
      id: 12,
      title: "Management Stratégique",
      category: "Ressources Humaines",
      type: "projets",
      level: "Master 1",
      author: "Prof. Michel",
      dateAdded: "2024-08-09",
      status: "publié",
      views: 4123,
      downloads: 987,
      fileSize: "3.9 MB",
      format: "PDF"
    }
  ]);

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesTab = activeTab === 'tous' || doc.type === activeTab;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Trier les documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.dateAdded);
        bValue = new Date(b.dateAdded);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'downloads':
        aValue = a.downloads;
        bValue = b.downloads;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, startIndex + itemsPerPage);

  // Gestion de la sélection
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentDocuments.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentDocuments.map(doc => doc.id));
    }
  };

  // Actions
  const handleEdit = (document) => {
    setEditingDocument(document);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    setDocuments(prev => prev.filter(doc => !selectedItems.includes(doc.id)));
    setSelectedItems([]);
    setShowDeleteModal(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'publié': return 'green';
      case 'brouillon': return 'orange';
      case 'archivé': return 'gray';
      default: return 'gray';
    }
  };

  const formatFileSize = (size) => {
    return size;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="DocumentsComponents-container">
      {/* En-tête */}
      <div className="DocumentsComponents-header">
        <div className="DocumentsComponents-header-top">
          <h1 className="DocumentsComponents-title">
            Gestion des <span className="DocumentsComponents-highlight">Documents</span>
          </h1>
          <button className="DocumentsComponents-add-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ajouter un document
          </button>
        </div>

        {/* Onglets */}
        <div className="DocumentsComponents-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`DocumentsComponents-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
            >
              {tab.label}
              <span className="DocumentsComponents-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="DocumentsComponents-toolbar">
        <div className="DocumentsComponents-search-container">
          <svg className="DocumentsComponents-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher des documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="DocumentsComponents-search-input"
          />
        </div>

        <div className="DocumentsComponents-toolbar-actions">
          <div className="DocumentsComponents-sort-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="DocumentsComponents-sort-select"
            >
              <option value="date">Date d'ajout</option>
              <option value="title">Titre</option>
              <option value="views">Vues</option>
              <option value="downloads">Téléchargements</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="DocumentsComponents-sort-order"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                {sortOrder === 'asc' ? (
                  <path d="M7 14l5-5 5 5z"/>
                ) : (
                  <path d="M7 10l5 5 5-5z"/>
                )}
              </svg>
            </button>
          </div>

          {selectedItems.length > 0 && (
            <div className="DocumentsComponents-bulk-actions">
              <span className="DocumentsComponents-selected-count">
                {selectedItems.length} sélectionné(s)
              </span>
              <button
                onClick={handleDelete}
                className="DocumentsComponents-delete-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table des documents */}
      <div className="DocumentsComponents-table-container">
        <table className="DocumentsComponents-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === currentDocuments.length && currentDocuments.length > 0}
                  onChange={handleSelectAll}
                  className="DocumentsComponents-checkbox"
                />
              </th>
              <th>Document</th>
              <th>Catégorie</th>
              <th>Type</th>
              <th>Niveau</th>
              <th>Statut</th>
              <th>Statistiques</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDocuments.map(document => (
              <tr key={document.id} className="DocumentsComponents-table-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(document.id)}
                    onChange={() => handleSelectItem(document.id)}
                    className="DocumentsComponents-checkbox"
                  />
                </td>
                <td>
                  <div className="DocumentsComponents-document-info">
                    <div className="DocumentsComponents-document-title">{document.title}</div>
                    <div className="DocumentsComponents-document-meta">
                      {document.author} • {formatFileSize(document.fileSize)} • {document.format}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="DocumentsComponents-category">{document.category}</span>
                </td>
                <td>
                  <span className="DocumentsComponents-type">{document.type.toUpperCase()}</span>
                </td>
                <td>
                  <span className="DocumentsComponents-level">{document.level}</span>
                </td>
                <td>
                  <select
                    value={document.status}
                    onChange={(e) => handleStatusChange(document.id, e.target.value)}
                    className={`DocumentsComponents-status-select ${getStatusColor(document.status)}`}
                  >
                    <option value="publié">Publié</option>
                    <option value="brouillon">Brouillon</option>
                    <option value="archivé">Archivé</option>
                  </select>
                </td>
                <td>
                  <div className="DocumentsComponents-stats">
                    <div className="DocumentsComponents-stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      {document.views.toLocaleString()}
                    </div>
                    <div className="DocumentsComponents-stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                      {document.downloads.toLocaleString()}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="DocumentsComponents-date">{formatDate(document.dateAdded)}</span>
                </td>
                <td>
                  <div className="DocumentsComponents-actions">
                    <button
                      onClick={() => handleEdit(document)}
                      className="DocumentsComponents-action-btn edit"
                      title="Modifier"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItems([document.id]);
                        setShowDeleteModal(true);
                      }}
                      className="DocumentsComponents-action-btn delete"
                      title="Supprimer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="DocumentsComponents-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="DocumentsComponents-page-btn"
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`DocumentsComponents-page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="DocumentsComponents-page-btn"
          >
            ›
          </button>
          
          <span className="DocumentsComponents-page-info">
            Page {currentPage} sur {totalPages} • {sortedDocuments.length} documents
          </span>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="DocumentsComponents-modal-overlay">
          <div className="DocumentsComponents-modal">
            <div className="DocumentsComponents-modal-header">
              <h3>Confirmer la suppression</h3>
            </div>
            <div className="DocumentsComponents-modal-content">
              <p>
                Êtes-vous sûr de vouloir supprimer {selectedItems.length} document(s) ?
                Cette action est irréversible.
              </p>
            </div>
            <div className="DocumentsComponents-modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="DocumentsComponents-modal-btn cancel"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="DocumentsComponents-modal-btn danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsComponents;