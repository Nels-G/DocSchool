import React, { useState } from 'react';
import './bookAdd.css';

const BookAdd = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    documentType: '',
    academicYear: '',
    file: null,
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const categories = [
    'Audit et Contrôle de Gestion',
    'Finance',
    'Marketing',
    'Ressources Humaines',
    'Commerce International'
  ];

  const levels = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];
  const documentTypes = ['Cours', 'TD/TP', 'Exercices', 'Projet', 'Présentation'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouterez la logique pour envoyer les données au backend
    console.log('Données du formulaire:', formData);
    console.log('Utilisateur connecté:', user);
    
    // Réinitialiser le formulaire après soumission
    setFormData({
      title: '',
      description: '',
      category: '',
      level: '',
      documentType: '',
      academicYear: '',
      file: null,
      image: null
    });
    setPreviewImage(null);
    
    // Fermer le popup
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bookAdd-overlay" onClick={handleOverlayClick}>
      <div className="bookAdd-container">
        <div className="bookAdd-header">
          <h2 className="bookAdd-title">Ajouter un document</h2>
          <button className="bookAdd-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="bookAdd-form" onSubmit={handleSubmit}>
          <div className="bookAdd-form-row">
            <div className="bookAdd-form-group bookAdd-form-group-full">
              <label htmlFor="title" className="bookAdd-label">Titre du document *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bookAdd-input"
                required
                placeholder="Ex: Introduction au Calcul Différentiel"
              />
            </div>
          </div>

          <div className="bookAdd-form-row">
            <div className="bookAdd-form-group bookAdd-form-group-full">
              <label htmlFor="description" className="bookAdd-label">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bookAdd-textarea"
                required
                rows="3"
                placeholder="Décrivez brièvement le contenu de votre document..."
              ></textarea>
            </div>
          </div>

          <div className="bookAdd-form-row">
            <div className="bookAdd-form-group">
              <label htmlFor="category" className="bookAdd-label">Catégorie *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="bookAdd-select"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bookAdd-form-group">
              <label htmlFor="level" className="bookAdd-label">Niveau *</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="bookAdd-select"
                required
              >
                <option value="">Sélectionner un niveau</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bookAdd-form-row">
            <div className="bookAdd-form-group">
              <label htmlFor="documentType" className="bookAdd-label">Type de document *</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="bookAdd-select"
                required
              >
                <option value="">Sélectionner un type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="bookAdd-form-group">
              <label htmlFor="academicYear" className="bookAdd-label">Année académique *</label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="bookAdd-select"
                required
              >
                <option value="">Sélectionner une année</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bookAdd-form-row">
            <div className="bookAdd-form-group">
              <label htmlFor="file" className="bookAdd-label">Fichier du document *</label>
              <div className="bookAdd-file-upload">
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="bookAdd-file-input"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  required
                />
                <label htmlFor="file" className="bookAdd-file-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="bookAdd-file-icon">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formData.file ? formData.file.name : 'Choisir un fichier'}
                </label>
              </div>
            </div>

            <div className="bookAdd-form-group">
              <label htmlFor="image" className="bookAdd-label">Image de couverture</label>
              <div className="bookAdd-file-upload">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="bookAdd-file-input"
                  accept="image/*"
                />
                <label htmlFor="image" className="bookAdd-file-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="bookAdd-file-icon">
                    <path d="M4 16L8 12L11 15L16 10L20 14V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {formData.image ? formData.image.name : 'Choisir une image'}
                </label>
              </div>
            </div>
          </div>

          {previewImage && (
            <div className="bookAdd-preview-container">
              <p className="bookAdd-preview-label">Aperçu de l'image:</p>
              <div className="bookAdd-image-preview">
                <img src={previewImage} alt="Aperçu" className="bookAdd-preview-image" />
              </div>
            </div>
          )}

          <div className="bookAdd-author-info">
            <p className="bookAdd-author-text">
              Auteur: <span className="bookAdd-author-name">{user?.name || 'Utilisateur'}</span>
            </p>
            {user?.matricule && (
              <p className="bookAdd-author-matricule">Matricule: {user.matricule}</p>
            )}
          </div>

          <div className="bookAdd-actions">
            <button type="button" className="bookAdd-cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="bookAdd-submit-btn">
              Publier le document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAdd;