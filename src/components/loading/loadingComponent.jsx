import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = ({ 
  title = "DocSchool", 
  message = "Chargement de la plateforme...",
  isVisible = true,
  onComplete = null,
  duration = 3000 
}) => {
  React.useEffect(() => {
    if (onComplete && duration > 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className="loading-container">
      <div className="logo">{title}</div>
      <div className="spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingComponent;