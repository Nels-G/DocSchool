import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import './docDetailPage.css';
import DocDetailComponent from '../../components/DocDetail/DocDetailComponent';
import api from '../../services/api'; // Assurez-vous d'avoir votre service API configuré

const DocDetailPage = () => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Récupérer l'ID du document depuis l'URL

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les données du document depuis l'API
        const response = await api.get(`/documents/documents/${id}/`);
        
        if (response.data) {
          // Formater les données pour correspondre à la structure attendue
          const formattedData = {
            id: response.data.id,
            title: response.data.titre,
            description: response.data.description || "Aucune description disponible",
            pdfUrl: response.data.fichier,
            level: response.data.niveau_nom,
            category: response.data.categorie_nom,
            stats: {
              views: "0", // À adapter si vous avez ces données
              likes: "0", // À adapter si vous avez ces données
              downloads: response.data.stats?.downloads || "0",
              comments: "0" // À adapter si vous avez ces données
            },
            // Ajouter d'autres champs si nécessaire
            image_couverture: response.data.image_couverture,
            annee_academique: response.data.annee_academique,
            auteur_nom: response.data.auteur_nom,
            auteur_matricule: response.data.auteur_matricule
          };
          
          setDocumentData(formattedData);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du document:', err);
        setError('Impossible de charger le document. Veuillez réessayer.');
        
        // Données de démo en cas d'erreur (optionnel)
        const demoData = {
          id: 1,
          title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
          description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion. Une approche pratique et théorique pour maîtriser les concepts fondamentaux des mathématiques appliquées.",
          pdfUrl: "/doc.pdf",
          level: "Master 2",
          stats: {
            views: "3,892",
            likes: "1,247", 
            downloads: "856",
            comments: "234"
          },
          category: "Finance"
        };
        setDocumentData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [id]);

  const handleBackToDashboard = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="docDetailPage">
        <div className="docDetailPage-loading">
          <div className="docDetailPage-loadingSpinner">
            <div className="docDetailPage-spinner"></div>
          </div>
          <p>Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error && !documentData) {
    return (
      <div className="docDetailPage">
        <div className="docDetailPage-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="docDetailPage">
      <DocDetailComponent
        documentData={documentData}
        onBack={handleBackToDashboard}
      />
    </div>
  );
};

export default DocDetailPage;