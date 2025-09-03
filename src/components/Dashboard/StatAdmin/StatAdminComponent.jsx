import React, { useState, useEffect } from 'react';
import './StatAdminComponent.css';

const StatAdminComponent = () => {
  // États pour les filtres
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Données simulées - nouvelles statistiques
  const [stats, setStats] = useState({
    totalDocuments: 1247,
    totalUtilisateurs: 89,
    totalTelechargements: 4532
  });

  const periods = [
    { value: 'jour', label: 'Jour' },
    { value: 'semaine', label: 'Semaine' },
    { value: 'mois', label: 'Mois' }
  ];

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
    setDateRange(`${formatDate(today)} - ${formatDate(today)}`);
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
      dateRange: dateRange
    });
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedPeriod('');
    const today = getTodayDate();
    setTempStartDate(today);
    setTempEndDate(today);
    setDateRange(`${formatDate(today)}`);
  };

  return (
    <div className="StatAdminComponent-container">
      {/* Section des filtres compacte */}
      <div className="StatAdminComponent-filters-section">
        <div className="StatAdminComponent-filters-row">
          <div className="StatAdminComponent-filter-group">
            <label className="StatAdminComponent-filter-label">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="StatAdminComponent-select"
            >
              <option value="">Sélectionner</option>
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>

          <div className="StatAdminComponent-filter-group">
            <label className="StatAdminComponent-filter-label">Plage de dates</label>
            <div className="StatAdminComponent-date-picker-container">
              <input
                type="text"
                value={dateRange}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="StatAdminComponent-date-display"
                readOnly
                placeholder="Sélectionner une plage"
              />
              {showDatePicker && (
                <div className="StatAdminComponent-date-picker-modal">
                  <div className="StatAdminComponent-date-picker-content">
                    <div className="StatAdminComponent-date-picker-header">
                      <h4>Sélectionner une plage de dates</h4>
                    </div>
                    <div className="StatAdminComponent-date-inputs">
                      <div className="StatAdminComponent-date-input-group">
                        <label>Date de début</label>
                        <input
                          type="date"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          max={getTodayDate()}
                          className="StatAdminComponent-date-input"
                        />
                      </div>
                      <div className="StatAdminComponent-date-input-group">
                        <label>Date de fin</label>
                        <input
                          type="date"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          min={tempStartDate}
                          max={getTodayDate()}
                          className="StatAdminComponent-date-input"
                        />
                      </div>
                    </div>
                    <div className="StatAdminComponent-date-picker-actions">
                      <button
                        onClick={cancelDateSelection}
                        className="StatAdminComponent-date-cancel-btn"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={applyDateSelection}
                        className="StatAdminComponent-date-apply-btn"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="StatAdminComponent-filter-actions">
            <button
              onClick={updateStats}
              className="StatAdminComponent-apply-btn"
            >
              Appliquer
            </button>
            <button
              onClick={resetFilters}
              className="StatAdminComponent-reset-btn"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Section des statistiques compacte */}
      <div className="StatAdminComponent-stats-section">
        <div className="StatAdminComponent-stats-grid">
          <div className="StatAdminComponent-stat-card blue">
            <div className="StatAdminComponent-stat-content">
              <div className="StatAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                  <path d="M8 12H16V14H8V12ZM8 16H13V18H8V16Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="StatAdminComponent-stat-info">
                <div className="StatAdminComponent-stat-number">{stats.totalDocuments.toLocaleString()}</div>
                <div className="StatAdminComponent-stat-label">Total Documents</div>
              </div>
            </div>
          </div>

          <div className="StatAdminComponent-stat-card green">
            <div className="StatAdminComponent-stat-content">
              <div className="StatAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6Z" fill="currentColor"/>
                  <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM18 18H6C6.22 16.81 9.31 16 12 16C14.69 16 17.78 16.81 18 18Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="StatAdminComponent-stat-info">
                <div className="StatAdminComponent-stat-number">{stats.totalUtilisateurs}</div>
                <div className="StatAdminComponent-stat-label">Total Utilisateurs</div>
              </div>
            </div>
          </div>

          <div className="StatAdminComponent-stat-card orange">
            <div className="StatAdminComponent-stat-content">
              <div className="StatAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9H15L13.5 7.5C13.1 7.1 12.6 6.9 12 6.9S10.9 7.1 10.5 7.5L9 9H5C3.9 9 3 9.9 3 11V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V11C21 9.9 20.1 9 19 9ZM19 18H5V11H8.17L10.17 9H13.83L15.83 11H19V18Z" fill="currentColor"/>
                  <path d="M12 13L16 17H8L12 13Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="StatAdminComponent-stat-info">
                <div className="StatAdminComponent-stat-number">{stats.totalTelechargements.toLocaleString()}</div>
                <div className="StatAdminComponent-stat-label">Total Téléchargements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatAdminComponent;