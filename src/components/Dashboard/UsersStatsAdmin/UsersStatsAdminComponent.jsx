import React, { useState, useEffect } from 'react';
import './UsersStatsAdminComponent.css';

const UsersStatsAdminComponent = () => {
  // États pour les filtres
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Données simulées - statistiques des utilisateurs
  const [stats, setStats] = useState({
    totalUtilisateurs: 89,
    totalEtudiants: 75,
    totalAdministrateurs: 14,
    utilisateursActifs: 67
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
    <div className="UsersStatsAdminComponent-container">
      {/* Section des filtres compacte */}
      <div className="UsersStatsAdminComponent-filters-section">
        <div className="UsersStatsAdminComponent-filters-row">
          <div className="UsersStatsAdminComponent-filter-group">
            <label className="UsersStatsAdminComponent-filter-label">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="UsersStatsAdminComponent-select"
            >
              <option value="">Sélectionner</option>
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>

          <div className="UsersStatsAdminComponent-filter-group">
            <label className="UsersStatsAdminComponent-filter-label">Plage de dates</label>
            <div className="UsersStatsAdminComponent-date-picker-container">
              <input
                type="text"
                value={dateRange}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="UsersStatsAdminComponent-date-display"
                readOnly
                placeholder="Sélectionner une plage"
              />
              {showDatePicker && (
                <div className="UsersStatsAdminComponent-date-picker-modal">
                  <div className="UsersStatsAdminComponent-date-picker-content">
                    <div className="UsersStatsAdminComponent-date-picker-header">
                      <h4>Sélectionner une plage de dates</h4>
                    </div>
                    <div className="UsersStatsAdminComponent-date-inputs">
                      <div className="UsersStatsAdminComponent-date-input-group">
                        <label>Date de début</label>
                        <input
                          type="date"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          max={getTodayDate()}
                          className="UsersStatsAdminComponent-date-input"
                        />
                      </div>
                      <div className="UsersStatsAdminComponent-date-input-group">
                        <label>Date de fin</label>
                        <input
                          type="date"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          min={tempStartDate}
                          max={getTodayDate()}
                          className="UsersStatsAdminComponent-date-input"
                        />
                      </div>
                    </div>
                    <div className="UsersStatsAdminComponent-date-picker-actions">
                      <button
                        onClick={cancelDateSelection}
                        className="UsersStatsAdminComponent-date-cancel-btn"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={applyDateSelection}
                        className="UsersStatsAdminComponent-date-apply-btn"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="UsersStatsAdminComponent-filter-actions">
            <button
              onClick={updateStats}
              className="UsersStatsAdminComponent-apply-btn"
            >
              Appliquer
            </button>
            <button
              onClick={resetFilters}
              className="UsersStatsAdminComponent-reset-btn"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Section des statistiques compacte */}
      <div className="UsersStatsAdminComponent-stats-section">
        <div className="UsersStatsAdminComponent-stats-grid">
          <div className="UsersStatsAdminComponent-stat-card blue">
            <div className="UsersStatsAdminComponent-stat-content">
              <div className="UsersStatsAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C13.66 4.5 15 5.84 15 7.5C15 9.16 13.66 10.5 12 10.5C10.34 10.5 9 9.16 9 7.5C9 5.84 10.34 4.5 12 4.5ZM12 6C11.17 6 10.5 6.67 10.5 7.5C10.5 8.33 11.17 9 12 9C12.83 9 13.5 8.33 13.5 7.5C13.5 6.67 12.83 6 12 6Z" fill="currentColor"/>
                  <path d="M16.5 12C17.88 12 19 13.12 19 14.5C19 15.88 17.88 17 16.5 17C15.12 17 14 15.88 14 14.5C14 13.12 15.12 12 16.5 12ZM16.5 13.5C15.95 13.5 15.5 13.95 15.5 14.5C15.5 15.05 15.95 15.5 16.5 15.5C17.05 15.5 17.5 15.05 17.5 14.5C17.5 13.95 17.05 13.5 16.5 13.5Z" fill="currentColor"/>
                  <path d="M7.5 12C8.88 12 10 13.12 10 14.5C10 15.88 8.88 17 7.5 17C6.12 17 5 15.88 5 14.5C5 13.12 6.12 12 7.5 12ZM7.5 13.5C6.95 13.5 6.5 13.95 6.5 14.5C6.5 15.05 6.95 15.5 7.5 15.5C8.05 15.5 8.5 15.05 8.5 14.5C8.5 13.95 8.05 13.5 7.5 13.5Z" fill="currentColor"/>
                  <path d="M12 12C8.69 12 6 14.69 6 18V19.5H18V18C18 14.69 15.31 12 12 12ZM7.5 18C7.5 15.52 9.52 13.5 12 13.5C14.48 13.5 16.5 15.52 16.5 18H7.5Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="UsersStatsAdminComponent-stat-info">
                <div className="UsersStatsAdminComponent-stat-number">{stats.totalUtilisateurs}</div>
                <div className="UsersStatsAdminComponent-stat-label">Total Utilisateurs</div>
              </div>
            </div>
          </div>

          <div className="UsersStatsAdminComponent-stat-card green">
            <div className="UsersStatsAdminComponent-stat-content">
              <div className="UsersStatsAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z" fill="currentColor"/>
                  <path d="M19 15L20.09 17.26L22 18L20.09 18.74L19 21L17.91 18.74L16 18L17.91 17.26L19 15Z" fill="currentColor"/>
                  <path d="M5 15L6.09 17.26L8 18L6.09 18.74L5 21L3.91 18.74L2 18L3.91 17.26L5 15Z" fill="currentColor"/>
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6Z" fill="currentColor"/>
                  <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM18 18H6C6.22 16.81 9.31 16 12 16C14.69 16 17.78 16.81 18 18Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="UsersStatsAdminComponent-stat-info">
                <div className="UsersStatsAdminComponent-stat-number">{stats.totalEtudiants}</div>
                <div className="UsersStatsAdminComponent-stat-label">Étudiants</div>
              </div>
            </div>
          </div>

          <div className="UsersStatsAdminComponent-stat-card orange">
            <div className="UsersStatsAdminComponent-stat-content">
              <div className="UsersStatsAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 6.26L17 7L13.09 7.74L12 12L10.91 7.74L7 7L10.91 6.26L12 2Z" fill="currentColor"/>
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6Z" fill="currentColor"/>
                  <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM18 18H6C6.22 16.81 9.31 16 12 16C14.69 16 17.78 16.81 18 18Z" fill="currentColor"/>
                  <path d="M15 22H17V20H19V18H17V16H15V18H13V20H15V22Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="UsersStatsAdminComponent-stat-info">
                <div className="UsersStatsAdminComponent-stat-number">{stats.totalAdministrateurs}</div>
                <div className="UsersStatsAdminComponent-stat-label">Administrateurs</div>
              </div>
            </div>
          </div>

          <div className="UsersStatsAdminComponent-stat-card purple">
            <div className="UsersStatsAdminComponent-stat-content">
              <div className="UsersStatsAdminComponent-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V9C15 9.55 14.55 10 14 10H10C9.45 10 9 9.55 9 9V5.5L3 7V9H1V11H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H23V9H21ZM5 19V11H7V19H5ZM17 19H12V17H17V19ZM17 15H12V13H17V15ZM19 19V11H21V19H19Z" fill="currentColor"/>
                  <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                </svg>
              </div>
              <div className="UsersStatsAdminComponent-stat-info">
                <div className="UsersStatsAdminComponent-stat-number">{stats.utilisateursActifs}</div>
                <div className="UsersStatsAdminComponent-stat-label">Utilisateurs Actifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersStatsAdminComponent;