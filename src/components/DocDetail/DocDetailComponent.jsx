import React, { useState, useEffect, useRef } from 'react';
import './docDetailComponent.css';

const DocDetailComponent = ({ documentData, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pdfContainerRef = useRef(null);

  // Message d'accueil automatique
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      content: 'Posez toutes les questions que vous voulez sur ce document. Je suis là pour vous aider à mieux comprendre son contenu !',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simuler une réponse de l'IA (à remplacer par l'intégration Ollama)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Je comprends votre question sur "${inputMessage}". Basé sur le document "${documentData?.title}", voici ma réponse détaillée... (Cette réponse sera générée par Ollama)`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAudioRead = () => {
    setIsAudioPlaying(!isAudioPlaying);
    console.log('Toggle audio reading:', !isAudioPlaying);
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (pdfContainerRef.current?.requestFullscreen) {
          await pdfContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else if (pdfContainerRef.current?.webkitRequestFullscreen) {
          // Support Safari
          await pdfContainerRef.current.webkitRequestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          // Support Safari
          await document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Fullscreen not supported or error:', error);
      // Fallback: simuler le plein écran avec CSS
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Ajouter les événements pour différents navigateurs
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(event => {
      if (document.addEventListener) {
        document.addEventListener(event, handleFullscreenChange);
      }
    });

    return () => {
      events.forEach(event => {
        if (document.removeEventListener) {
          document.removeEventListener(event, handleFullscreenChange);
        }
      });
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Données par défaut si aucun document n'est fourni
  const defaultDoc = {
    title: "Introduction au Calcul Différentiel et Intégral pour les Sciences Économiques",
    description: "Ce cours couvre les bases du calcul différentiel et intégral appliquées aux sciences économiques et de gestion. Une approche pratique et théorique pour maîtriser les concepts fondamentaux des mathématiques appliquées.",
    pdfUrl: "/sample-document.pdf"
  };

  const document = documentData || defaultDoc;

  return (
    <div className="docDetailComponent">
      {/* Contenu principal sans en-tête */}
      <div className="docDetailComponent-content">
        {/* Section PDF avec contrôles intégrés */}
        <div className="docDetailComponent-pdfSection">
          <div className="docDetailComponent-pdfHeader">
            <div className="docDetailComponent-titleInfo">
              <h1 className="docDetailComponent-title">{document.title}</h1>
              <p className="docDetailComponent-description">{document.description}</p>
            </div>
            
            <div className="docDetailComponent-pdfControls">
              <button 
                className="docDetailComponent-controlBtn"
                onClick={handleAudioRead}
                title={isAudioPlaying ? "Arrêter la lecture" : "Lire en audio"}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {isAudioPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  ) : (
                    <path d="M8 5v14l11-7z"/>
                  )}
                </svg>
              </button>
              
              <button 
                className="docDetailComponent-controlBtn"
                onClick={toggleFullscreen}
                title="Plein écran"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
              
              <button 
                className="docDetailComponent-controlBtn docDetailComponent-backBtn"
                onClick={onBack}
                title="Retour"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div 
            className="docDetailComponent-pdfContainer"
            ref={pdfContainerRef}
          >
            <iframe
              src={`${document.pdfUrl}#view=FitV&scrollbar=1&toolbar=1&navpanes=1`}
              className="docDetailComponent-pdfViewer"
              title="Document PDF"
              frameBorder="0"
            >
              <p>
                Votre navigateur ne supporte pas l'affichage des PDFs. 
                <a href={document.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Cliquez ici pour télécharger le document.
                </a>
              </p>
            </iframe>
          </div>
        </div>

        {/* Section Chat IA */}
        <div className="docDetailComponent-chatSection">
          <div className="docDetailComponent-chatHeader">
            <div className="docDetailComponent-chatTitle">
              <div className="docDetailComponent-aiAvatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                </svg>
              </div>
              <div>
                <div className="docDetailComponent-aiName">Assistant IA</div>
                <div className="docDetailComponent-aiStatus">
                  <div className="docDetailComponent-statusDot"></div>
                  En ligne
                </div>
              </div>
            </div>
          </div>

          <div className="docDetailComponent-chatMessages" ref={chatContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`docDetailComponent-message ${message.type === 'user' ? 'user' : 'ai'}`}
              >
                {message.type === 'ai' && (
                  <div className="docDetailComponent-messageAvatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                    </svg>
                  </div>
                )}
                <div className="docDetailComponent-messageContent">
                  <div className="docDetailComponent-messageBubble">
                    <p>{message.content}</p>
                  </div>
                  <span className="docDetailComponent-messageTime">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="docDetailComponent-message ai">
                <div className="docDetailComponent-messageAvatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM10 17V14.5L8 13V11L10 9.5V7L12 8L14 7V9.5L16 11V13L14 14.5V17L12 16L10 17ZM12 11.5C11.2 11.5 10.5 10.8 10.5 10S11.2 8.5 12 8.5S13.5 9.2 13.5 10S12.8 11.5 12 11.5Z"/>
                  </svg>
                </div>
                <div className="docDetailComponent-messageContent">
                  <div className="docDetailComponent-messageBubble">
                    <div className="docDetailComponent-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="docDetailComponent-chatInput">
            <div className="docDetailComponent-inputContainer">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur le document..."
                className="docDetailComponent-textInput"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="docDetailComponent-sendBtn"
                disabled={!inputMessage.trim() || isLoading}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocDetailComponent;