import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, documentTitle, type = "document" }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'download':
        return 'Supprimer le téléchargement';
      case 'document':
      default:
        return 'Supprimer le document';
    }
  };

  const getMessage = () => {
    switch(type) {
      case 'download':
        return `Êtes-vous sûr de vouloir supprimer "${documentTitle}" de vos téléchargements ?`;
      case 'document':
      default:
        return `Êtes-vous sûr de vouloir supprimer définitivement "${documentTitle}" ?`;
    }
  };

  const getSubMessage = () => {
    switch(type) {
      case 'download':
        return 'Ce document sera retiré de votre liste de téléchargements, mais restera disponible dans la bibliothèque.';
      case 'document':
      default:
        return 'Cette action est irréversible et le document sera définitivement supprimé.';
    }
  };

  return (
    <div className="deleteConfirmationModal-overlay" onClick={handleBackdropClick}>
      <div className="deleteConfirmationModal-container">
        <div className="deleteConfirmationModal-header">
          <div className="deleteConfirmationModal-iconContainer">
            <svg className="deleteConfirmationModal-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11C11 19.9 11.9 19 13 19S15 19.9 15 21H19C20.1 21 21 20.1 21 19V9M12 13C10.89 13 10 13.89 10 15S10.89 17 12 17 14 16.11 14 15 13.11 13 12 13Z"/>
            </svg>
          </div>
          <h3 className="deleteConfirmationModal-title">{getTitle()}</h3>
          <button 
            className="deleteConfirmationModal-closeBtn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        
        <div className="deleteConfirmationModal-content">
          <p className="deleteConfirmationModal-message">
            {getMessage()}
          </p>
          <p className="deleteConfirmationModal-subMessage">
            {getSubMessage()}
          </p>
        </div>
        
        <div className="deleteConfirmationModal-actions">
          <button 
            className="deleteConfirmationModal-cancelBtn"
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className="deleteConfirmationModal-confirmBtn"
            onClick={handleConfirm}
          >
            <svg className="deleteConfirmationModal-confirmIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;