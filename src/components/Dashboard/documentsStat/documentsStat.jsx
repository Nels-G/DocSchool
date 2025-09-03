import React, { useState, useEffect } from 'react';
import './documentsStat.css';

const DocumentsStat = () => {
  // États pour les filtres
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const periods = [
    { value: 'jour', label: 'Aujourd\'hui' },
    { value: 'semaine', label: 'Cette semaine' },
    { value: 'mois', label: 'Ce mois' },
    { value: '3mois', label: '3 derniers mois' },
    { value: 'annee', label: 'Cette année' }
  ];

  const categories = [
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'audit', label: 'Audit et Contrôle' },
    { value: 'commerce', label: 'Commerce International' }
  ];

  const documentTypes = [
    { value: 'cours', label: 'Cours' },
    { value: 'td-tp', label: 'TD/TP' },
    { value: 'projets', label: 'Projets' },
    { value: 'exercices', label: 'Exercices' },
    { value: 'presentations', label: 'Présentations' }
  ];

  // Données simulées - statistiques des documents
  const [stats, setStats] = useState({
    totalDocuments: 1247,
    totalVues: 45892,
    totalTelechargements: 18456,
    totalCommentaires: 2387,
    documentsPublies: 1098,
    documentsBrouillon: 89,
    documentsArchives: 60,
    moyenneVuesParDocument: 37,
    tauxTelechargement: 40.2,
    croissanceDocuments: 12.5,
    croissanceVues: 8.7,
    croissanceTelechargements: 15.3
  });

  // Données pour les graphiques (simulées)
  const [chartData, setChartData] = useState({
    documentsParMois: [
      { mois: 'Jan', documents: 89, vues: 3245, telechargements: 1890 },
      { mois: 'Fév', documents: 94, vues: 3567, telechargements: 2134 },
      { mois: 'Mar', documents: 102, vues: 4123, telechargements: 2567 },
      { mois: 'Avr', documents: 87, vues: 3890, telechargements: 2234 },
      { mois: 'Mai', documents: 115, vues: 4567, telechargements: 2890 },
      { mois: 'Jun', documents: 98, vues: 4234, telechargements: 2678 }
    ],
    topCategories: [
      { categorie: 'Finance', documents: 456, pourcentage: 36.6 },
      { categorie: 'Marketing', documents: 298, pourcentage: 23.9 },
      { categorie: 'RH', documents: 234, pourcentage: 18.8 },
      { categorie: 'Audit', documents: 178, pourcentage: 14.3 },
      { categorie: 'Commerce', documents: 81, pourcentage: 6.5 }
    ],
    topDocuments: [
      { titre: 'Introduction au Calcul Différentiel', vues: 3892, telechargements: 856, categorie: 'Finance' },
      { titre: 'Marketing Digital Avancé', vues: 3567, telechargements: 745, categorie: 'Marketing' },
      { titre: 'Gestion des Ressources Humaines', vues: 3234, telechargements: 678, categorie: 'RH' },
      { titre: 'Analyse Financière', vues: 2987, telechargements: 623, categorie: 'Finance' },
      { titre: 'Commerce International', vues: 2789, telechargements: 567, categorie: 'Commerce' }
    ]
  });

  // Fonction pour obtenir la date du jour
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fonction pour formater une date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Initialisation avec la date du jour
  useEffect(() => {
    const today = getTodayDate();
    setTempStartDate(today);
    setTempEndDate(today);
    setDateRange(`${formatDate(today)}`);
  }, []);

  // Fonction pour appliquer la sélection de dates
  const applyDateSelection = () => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      
      if (start <= end) {
        if (tempStartDate === tempEndDate) {
          setDateRange(`${formatDate(tempStartDate)}`);
        } else {
          setDateRange(`${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`);
        }
      }
    }
    setShowDatePicker(false);
  };

  // Fonction pour annuler la sélection
  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  // Fonction pour mettre à jour les statistiques
  const updateStats = () => {
    console.log('Filtres appliqués:', {
      period: selectedPeriod,
      category: selectedCategory,
      type: selectedType,
      dateRange: dateRange
    });
    // Ici vous pouvez ajouter la logique pour filtrer les données
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedPeriod('');
    setSelectedCategory('');
    setSelectedType('');
    const today = getTodayDate();
    setTempStartDate(today);
    setTempEndDate(today);
    setDateRange(`${formatDate(today)}`);
  };

  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Fonction pour obtenir la couleur de croissance
  const getGrowthColor = (value) => {
    return value >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="DocumentsStat-container">
      {/* En-tête */}
      <div className="DocumentsStat-header">
        <h1 className="DocumentsStat-title">
          Statistiques des <span className="DocumentsStat-highlight">Documents</span>
        </h1>
        <p className="DocumentsStat-subtitle">
          Analysez les performances et l'engagement de vos documents
        </p>
      </div>

      {/* Section des filtres */}
      <div className="DocumentsStat-filters-section">
        <div className="DocumentsStat-filters-row">
          <div className="DocumentsStat-filter-group">
            <label className="DocumentsStat-filter-label">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="DocumentsStat-select"
            >
              <option value="">Toutes les périodes</option>
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>

          <div className="DocumentsStat-filter-group">
            <label className="DocumentsStat-filter-label">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="DocumentsStat-select"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>

          <div className="DocumentsStat-filter-group">
            <label className="DocumentsStat-filter-label">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="DocumentsStat-select"
            >
              <option value="">Tous les types</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="DocumentsStat-filter-group">
            <label className="DocumentsStat-filter-label">Plage de dates</label>
            <div className="DocumentsStat-date-picker-container">
              <input
                type="text"
                value={dateRange}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="DocumentsStat-date-display"
                readOnly
                placeholder="Sélectionner une plage"
              />
              {showDatePicker && (
                <div className="DocumentsStat-date-picker-modal">
                  <div className="DocumentsStat-date-picker-content">
                    <div className="DocumentsStat-date-picker-header">
                      <h4>Sélectionner une plage de dates</h4>
                    </div>
                    <div className="DocumentsStat-date-inputs">
                      <div className="DocumentsStat-date-input-group">
                        <label>Date de début</label>
                        <input
                          type="date"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          max={getTodayDate()}
                          className="DocumentsStat-date-input"
                        />
                      </div>
                      <div className="DocumentsStat-date-input-group">
                        <label>Date de fin</label>
                        <input
                          type="date"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          min={tempStartDate}
                          max={getTodayDate()}
                          className="DocumentsStat-date-input"
                        />
                      </div>
                    </div>
                    <div className="DocumentsStat-date-picker-actions">
                      <button
                        onClick={cancelDateSelection}
                        className="DocumentsStat-date-cancel-btn"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={applyDateSelection}
                        className="DocumentsStat-date-apply-btn"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="DocumentsStat-filter-actions">
            <button
              onClick={updateStats}
              className="DocumentsStat-apply-btn"
            >
              Appliquer
            </button>
            <button
              onClick={resetFilters}
              className="DocumentsStat-reset-btn"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="DocumentsStat-main-stats">
        <div className="DocumentsStat-stats-grid">
          <div className="DocumentsStat-stat-card primary">
            <div className="DocumentsStat-stat-content">
              <div className="DocumentsStat-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="DocumentsStat-stat-info">
                <div className="DocumentsStat-stat-number">{stats.totalDocuments.toLocaleString()}</div>
                <div className="DocumentsStat-stat-label">Total Documents</div>
                <div className={`DocumentsStat-stat-growth ${getGrowthColor(stats.croissanceDocuments)}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                  +{stats.croissanceDocuments}% ce mois
                </div>
              </div>
            </div>
          </div>

          <div className="DocumentsStat-stat-card blue">
            <div className="DocumentsStat-stat-content">
              <div className="DocumentsStat-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                </svg>
              </div>
              <div className="DocumentsStat-stat-info">
                <div className="DocumentsStat-stat-number">{formatNumber(stats.totalVues)}</div>
                <div className="DocumentsStat-stat-label">Total Vues</div>
                <div className={`DocumentsStat-stat-growth ${getGrowthColor(stats.croissanceVues)}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                  +{stats.croissanceVues}% ce mois
                </div>
              </div>
            </div>
          </div>

          <div className="DocumentsStat-stat-card green">
            <div className="DocumentsStat-stat-content">
              <div className="DocumentsStat-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                </svg>
              </div>
              <div className="DocumentsStat-stat-info">
                <div className="DocumentsStat-stat-number">{formatNumber(stats.totalTelechargements)}</div>
                <div className="DocumentsStat-stat-label">Total Téléchargements</div>
                <div className={`DocumentsStat-stat-growth ${getGrowthColor(stats.croissanceTelechargements)}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                  +{stats.croissanceTelechargements}% ce mois
                </div>
              </div>
            </div>
          </div>

          <div className="DocumentsStat-stat-card orange">
            <div className="DocumentsStat-stat-content">
              <div className="DocumentsStat-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" fill="currentColor"/>
                </svg>
              </div>
              <div className="DocumentsStat-stat-info">
                <div className="DocumentsStat-stat-number">{stats.totalCommentaires.toLocaleString()}</div>
                <div className="DocumentsStat-stat-label">Total Commentaires</div>
                <div className="DocumentsStat-stat-meta">
                  Engagement actif
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques secondaires */}
        <div className="DocumentsStat-secondary-stats">
          <div className="DocumentsStat-metric-card">
            <div className="DocumentsStat-metric-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
            </div>
            <div className="DocumentsStat-metric-info">
              <div className="DocumentsStat-metric-number">{stats.documentsPublies}</div>
              <div className="DocumentsStat-metric-label">Publiés</div>
            </div>
          </div>

          <div className="DocumentsStat-metric-card">
            <div className="DocumentsStat-metric-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <div className="DocumentsStat-metric-info">
              <div className="DocumentsStat-metric-number">{stats.documentsBrouillon}</div>
              <div className="DocumentsStat-metric-label">Brouillons</div>
            </div>
          </div>

          <div className="DocumentsStat-metric-card">
            <div className="DocumentsStat-metric-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
              </svg>
            </div>
            <div className="DocumentsStat-metric-info">
              <div className="DocumentsStat-metric-number">{stats.documentsArchives}</div>
              <div className="DocumentsStat-metric-label">Archivés</div>
            </div>
          </div>

          <div className="DocumentsStat-metric-card">
            <div className="DocumentsStat-metric-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <div className="DocumentsStat-metric-info">
              <div className="DocumentsStat-metric-number">{stats.moyenneVuesParDocument}</div>
              <div className="DocumentsStat-metric-label">Vues/Doc</div>
            </div>
          </div>

          <div className="DocumentsStat-metric-card">
            <div className="DocumentsStat-metric-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 4C5.01 4 3 6.01 3 8.5S5.01 13 7.5 13 12 11.99 12 9.5 9.99 6 7.5 6zM7.5 11C6.12 11 5 9.88 5 8.5S6.12 6 7.5 6s2.5 1.12 2.5 2.5S8.88 11 7.5 11zm8.5 0c1.25 0 2.25-1 2.25-2.25S17.25 6.5 16 6.5s-2.25 1-2.25 2.25S14.75 11 16 11zm0-3c.69 0 1.25.56 1.25 1.25S16.69 10.5 16 10.5s-1.25-.56-1.25-1.25S15.31 8 16 8z"/>
              </svg>
            </div>
            <div className="DocumentsStat-metric-info">
              <div className="DocumentsStat-metric-number">{stats.tauxTelechargement}%</div>
              <div className="DocumentsStat-metric-label">Taux Téléch.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des graphiques et analyses */}
      <div className="DocumentsStat-analytics-section">
        {/* Top catégories */}
        <div className="DocumentsStat-chart-card">
          <div className="DocumentsStat-chart-header">
            <h3>Top Catégories</h3>
            <p>Répartition des documents par catégorie</p>
          </div>
          <div className="DocumentsStat-categories-list">
            {chartData.topCategories.map((category, index) => (
              <div key={index} className="DocumentsStat-category-item">
                <div className="DocumentsStat-category-info">
                  <span className="DocumentsStat-category-name">{category.categorie}</span>
                  <span className="DocumentsStat-category-count">{category.documents} docs</span>
                </div>
                <div className="DocumentsStat-category-bar">
                  <div 
                    className="DocumentsStat-category-fill"
                    style={{ width: `${category.pourcentage}%` }}
                  ></div>
                </div>
                <span className="DocumentsStat-category-percentage">{category.pourcentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top documents */}
        <div className="DocumentsStat-chart-card">
          <div className="DocumentsStat-chart-header">
            <h3>Documents les plus populaires</h3>
            <p>Classement par nombre de vues</p>
          </div>
          <div className="DocumentsStat-top-documents">
            {chartData.topDocuments.map((doc, index) => (
              <div key={index} className="DocumentsStat-document-item">
                <div className="DocumentsStat-document-rank">
                  #{index + 1}
                </div>
                <div className="DocumentsStat-document-info">
                  <div className="DocumentsStat-document-title">{doc.titre}</div>
                  <div className="DocumentsStat-document-category">{doc.categorie}</div>
                </div>
                <div className="DocumentsStat-document-stats">
                  <div className="DocumentsStat-document-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/>
                    </svg>
                    {doc.vues.toLocaleString()}
                  </div>
                  <div className="DocumentsStat-document-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7z"/>
                    </svg>
                    {doc.telechargements.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="DocumentsStat-evolution-section">
        <div className="DocumentsStat-chart-card full-width">
          <div className="DocumentsStat-chart-header">
            <h3>Évolution mensuelle</h3>
            <p>Tendances des documents, vues et téléchargements</p>
          </div>
          <div className="DocumentsStat-evolution-chart">
            <div className="DocumentsStat-chart-legend">
              <div className="DocumentsStat-legend-item">
                <span className="DocumentsStat-legend-color documents"></span>
                Documents
              </div>
              <div className="DocumentsStat-legend-item">
                <span className="DocumentsStat-legend-color vues"></span>
                Vues (x100)
              </div>
              <div className="DocumentsStat-legend-item">
                <span className="DocumentsStat-legend-color telechargements"></span>
                Téléchargements (x100)
              </div>
            </div>
            <div className="DocumentsStat-chart-bars">
              {chartData.documentsParMois.map((data, index) => (
                <div key={index} className="DocumentsStat-chart-month">
                  <div className="DocumentsStat-chart-bars-group">
                    <div 
                      className="DocumentsStat-chart-bar documents"
                      style={{ height: `${(data.documents / 120) * 100}%` }}
                      title={`${data.documents} documents`}
                    ></div>
                    <div 
                      className="DocumentsStat-chart-bar vues"
                      style={{ height: `${(data.vues / 5000) * 100}%` }}
                      title={`${data.vues} vues`}
                    ></div>
                    <div 
                      className="DocumentsStat-chart-bar telechargements"
                      style={{ height: `${(data.telechargements / 3000) * 100}%` }}
                      title={`${data.telechargements} téléchargements`}
                    ></div>
                  </div>
                  <div className="DocumentsStat-chart-month-label">{data.mois}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStat;