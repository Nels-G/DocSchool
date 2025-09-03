import React, { useState, useEffect } from 'react';
import './docDetailPage.css';
import DocDetailComponent from '../../components/DocDetail/DocDetailComponent';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';

const DocDetailPage = () => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du document depuis une API ou les props
    // En pratique, vous récupéreriez les données via useParams() pour l'ID du document
    const loadDocumentData = async () => {
      setLoading(true);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        // Exemple de données de document
        const docData = {
          id: 1,
          title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
          description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion. Une approche pratique et théorique pour maîtriser les concepts fondamentaux des mathématiques appliquées.",
          pdfUrl: "/doc.pdf", // Remplacez par l'URL réelle de votre PDF
          level: "Master 2",
          stats: {
            views: "3,892",
            likes: "1,247",
            downloads: "856",
            comments: "234"
          },
          category: "Finance"
        };
        
        setDocumentData(docData);
        setLoading(false);
      }, 1000);
    };

    loadDocumentData();
  }, []);

  const handleBackToDashboard = () => {
    // Navigation vers le dashboard
    // En pratique, utilisez votre système de routing (React Router, Next.js, etc.)
    console.log('Navigating back to dashboard...');
    
    // Exemple avec React Router :
    // navigate('/dashboard');
    
    // Exemple avec Next.js :
    // router.push('/dashboard');
    
    // Pour l'instant, on simule juste le retour
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

  return (
    <div className="docDetailPage">
      {/* <Header/> */}
      <DocDetailComponent
        documentData={documentData}
        onBack={handleBackToDashboard}
      />
      {/* <Footer/> */}
    </div>
  );
};

export default DocDetailPage;