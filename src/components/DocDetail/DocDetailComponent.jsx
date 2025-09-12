import React, { useState, useEffect, useRef } from 'react';
import './docDetailComponent.css';
import api from '../../services/api';

const DocDetailComponent = ({ documentData, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiStatus, setAiStatus] = useState('online');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Message d'accueil automatique
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      content: 'Posez toutes les questions que vous voulez sur ce document. Je suis là pour vous aider à mieux comprendre son contenu !',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Vérifier le statut de l'IA
    checkAIStatus();
  }, []);

  // Vérifier le statut du service IA
  const checkAIStatus = async () => {
    try {
      const response = await api.get('/documents/ai/status/');
      setAiStatus(response.data.status);
    } catch (error) {
      console.error('Service IA indisponible:', error);
      setAiStatus('offline');
      
      // Ajouter un message d'avertissement
      const warningMessage = {
        id: Date.now(),
        type: 'ai',
        content: 'Le service IA est temporairement indisponible. Veuillez réessayer plus tard.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, warningMessage]);
    }
  };

  // Auto-scroll vers le dernier message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // NOUVELLE FONCTION: Nettoyer le texte pour la synthèse vocale
  const cleanTextForSpeech = (text) => {
    if (!text) return '';
    
    let cleanText = text;
    
    // Supprimer les balises HTML
    cleanText = cleanText.replace(/<[^>]*>/g, '');
    
    // Supprimer les caractères Markdown
    cleanText = cleanText.replace(/#{1,6}\s*/g, ''); // Titres (#, ##, ###, etc.)
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Gras **texte**
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // Italique *texte*
    cleanText = cleanText.replace(/__(.*?)__/g, '$1'); // Gras __texte__
    cleanText = cleanText.replace(/_(.*?)_/g, '$1'); // Italique _texte_
    cleanText = cleanText.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Code `texte` ou ```texte```
    cleanText = cleanText.replace(/^\s*[-*+]\s+/gm, ''); // Puces de listes (-, *, +)
    cleanText = cleanText.replace(/^\s*\d+\.\s+/gm, ''); // Listes numérotées (1., 2., etc.)
    cleanText = cleanText.replace(/^\s*>\s+/gm, ''); // Citations (>)
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Liens [texte](url)
    cleanText = cleanText.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // Images ![alt](url)
    
    // Nettoyer les espaces et sauts de ligne multiples
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n'); // Max 2 sauts de ligne consécutifs
    cleanText = cleanText.replace(/\s{2,}/g, ' '); // Espaces multiples en un seul
    
    // Supprimer les caractères spéciaux gênants pour la lecture
    cleanText = cleanText.replace(/[|{}[\]\\]/g, ''); // Caractères spéciaux
    
    // Nettoyer les bordures
    cleanText = cleanText.trim();
    
    return cleanText;
  };

  // Fonctions pour la synthèse vocale (AMÉLIORÉES)
  const speakText = (text, messageId) => {
    stopSpeaking();
    
    if ('speechSynthesis' in window) {
      // Nettoyer le texte avant la lecture
      const cleanText = cleanTextForSpeech(text);
      
      if (!cleanText.trim()) {
        console.log('Aucun texte à lire après nettoyage');
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Configuration améliorée
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Légèrement plus lent pour une meilleure compréhension
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Chercher une voix française si disponible
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') || voice.lang.includes('FR')
      );
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      
      utterance.onstart = () => {
        console.log('Début de la lecture:', cleanText.substring(0, 50) + '...');
        setSpeakingMessageId(messageId);
      };
      
      utterance.onend = () => {
        console.log('Fin de la lecture');
        setSpeakingMessageId(null);
      };
      
      utterance.onerror = (event) => {
        console.error('Erreur de synthèse vocale:', event);
        setSpeakingMessageId(null);
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Votre navigateur ne supporte pas la synthèse vocale.");
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  // Arrêter la lecture quand le composant est démonté
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Fonction pour copier le texte (AMÉLIORÉE)
  const copyToClipboard = async (text) => {
    try {
      // Nettoyer le texte pour la copie aussi (optionnel)
      const textToCopy = cleanTextForSpeech(text);
      await navigator.clipboard.writeText(textToCopy);
      console.log('Texte copié avec succès');
      
      // TODO: Ajouter une notification visuelle (toast) ici
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      // Fallback pour les anciens navigateurs
      const textArea = document.createElement('textarea');
      textArea.value = cleanTextForSpeech(text);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  // Fonction pour formater le texte Markdown de manière basique
  const formatMarkdown = (text) => {
    if (!text) return text;
    
    // Convertir le markdown en HTML basique
    let formattedText = text;
    
    // Titres
    formattedText = formattedText.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    formattedText = formattedText.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formattedText = formattedText.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Gras et italique
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Code inline
    formattedText = formattedText.replace(/`(.*?)`/gim, '<code>$1</code>');
    
    // Listes
    formattedText = formattedText.replace(/^- (.*$)/gim, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    
    // Citations
    formattedText = formattedText.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Paragraphes
    formattedText = formattedText.replace(/\n\n/gim, '</p><p>');
    formattedText = formattedText.replace(/\n/gim, '<br/>');
    
    return { __html: '<p>' + formattedText + '</p>' };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || aiStatus === 'offline') return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Appel à l'API GroqCloud
      const response = await api.post(`/documents/documents/${documentData.id}/ask/`, {
        question: inputMessage
      });

      if (response.data.success) {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Désolé, une erreur s'est produite: ${error.response?.data?.error || error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (pdfContainerRef.current?.requestFullscreen) {
          await pdfContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else if (pdfContainerRef.current?.webkitRequestFullscreen) {
          await pdfContainerRef.current.webkitRequestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Fullscreen not supported or error:', error);
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

  // S'assurer que l'URL du PDF est absolue
  const getPdfUrl = () => {
    if (!documentData?.pdfUrl) return "#";
    
    // Si l'URL est relative, ajouter l'origine du serveur
    if (!documentData.pdfUrl.startsWith('http')) {
      return `${window.location.origin}${documentData.pdfUrl}`;
    }
    
    return documentData.pdfUrl;
  };

  // Données par défaut si aucun document n'est fourni
  const defaultDoc = {
    title: "Document non disponible",
    description: "Aucune description disponible",
    pdfUrl: "#",
    stats: {
      views: "0",
      likes: "0",
      downloads: "0",
      comments: "0"
    }
  };

  const document = documentData || defaultDoc;

  return (
    <div className="docDetailComponent">
      <div className="docDetailComponent-content">
        <div className="docDetailComponent-pdfSection">
          <div className="docDetailComponent-pdfHeader">
            <div className="docDetailComponent-titleInfo">
              <h1 className="docDetailComponent-title">{document.title}</h1>
              <p className="docDetailComponent-description">{document.description}</p>
              
              {/* Ligne compacte pour auteur, niveau et catégorie */}
              <div className="docDetailComponent-metaLine">
                {document.auteur_nom && (
                  <span className="docDetailComponent-author">Par {document.auteur_nom}</span>
                )}
                
                {(document.level || document.category) && (
                  <div className="docDetailComponent-metaCompact">
                    {document.level && (
                      <span className="docDetailComponent-metaBadge docDetailComponent-levelBadge">
                        {document.level}
                      </span>
                    )}
                    {document.category && (
                      <span className="docDetailComponent-metaBadge docDetailComponent-categoryBadge">
                        {document.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="docDetailComponent-pdfControls">
              {/* Bouton Plein écran seulement */}
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
              src={getPdfUrl()}
              className="docDetailComponent-pdfViewer"
              title="Document PDF"
              frameBorder="0"
              allowFullScreen
            >
              <p>
                Votre navigateur ne supporte pas l'affichage des PDFs. 
                <a href={getPdfUrl()} target="_blank" rel="noopener noreferrer">
                  Cliquez ici pour télécharger le document.
                </a>
              </p>
            </iframe>
          </div>
        </div>

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
                  <div className={`docDetailComponent-statusDot ${aiStatus === 'online' ? 'online' : 'offline'}`}></div>
                  {aiStatus === 'online' ? 'En ligne' : 'Hors ligne'}
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
                    {message.type === 'ai' ? (
                      <div dangerouslySetInnerHTML={formatMarkdown(message.content)} />
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  
                  {/* Widget d'actions pour les messages */}
                  <div className="docDetailComponent-messageActions">
                    {message.type === 'ai' && (
                      <>
                        <button
                          className={`docDetailComponent-actionBtn ${speakingMessageId === message.id ? 'speaking' : ''}`}
                          onClick={() => {
                            if (speakingMessageId === message.id) {
                              stopSpeaking();
                            } else {
                              // MODIFICATION ICI: Passer directement le texte brut
                              speakText(message.content, message.id);
                            }
                          }}
                          title="Lire le texte"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            {speakingMessageId === message.id ? (
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            ) : (
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            )}
                          </svg>
                        </button>
                        
                        <button
                          className="docDetailComponent-actionBtn"
                          onClick={() => copyToClipboard(message.content)}
                          title="Copier le texte"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {message.type === 'user' && (
                      <button
                        className="docDetailComponent-actionBtn"
                        onClick={() => copyToClipboard(message.content)}
                        title="Copier la question"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
                      </button>
                    )}
                    
                    <span className="docDetailComponent-messageTime">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
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
                placeholder={aiStatus === 'offline' ? "Service IA temporairement indisponible" : "Posez votre question sur le document..."}
                className="docDetailComponent-textInput"
                rows={1}
                disabled={isLoading || aiStatus === 'offline'}
              />
              <button
                onClick={handleSendMessage}
                className="docDetailComponent-sendBtn"
                disabled={!inputMessage.trim() || isLoading || aiStatus === 'offline'}
                title={aiStatus === 'offline' ? "Service IA indisponible" : "Envoyer la question"}
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