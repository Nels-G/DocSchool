import React, { useState, useEffect } from 'react';
import './CommentSidebar.css';
import api from '../../services/api'; // Utilisation de votre service API existant

const CommentSidebar = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', 
    '😍', '🥰', '😘', '😗', '😙', '😚', '🤔', '🤨', '😐', '😑', '😶', 
    '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', 
    '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', 
    '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', 
    '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', 
    '👍', '👎', '👏', '🙌', '👌', '✨', '🎉', '❤️', '💙', '💚', '💛', '🧡', 
    '💜', '🖤', '🤍', '🤎', '💖', '💝', '✅', '❌', '⭐', '🔥', '💯', '💪'
  ];

  // Couleurs pour les avatars générés
  const avatarColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
    '#AED6F1', '#A9DFBF', '#F9E79F', '#D7BDE2', '#A3E4D7'
  ];

  // Fonction pour générer une couleur basée sur le nom d'utilisateur
  const generateAvatarColor = (userName) => {
    if (!userName) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
  };

  // Fonction pour extraire les initiales
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Composant Avatar généré
  const GeneratedAvatar = ({ userName, size = 40 }) => {
    const backgroundColor = generateAvatarColor(userName);
    const initials = getInitials(userName);
    
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: size * 0.4,
          flexShrink: 0,
          border: '2px solid #fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {initials}
      </div>
    );
  };

  // Composant Avatar avec fallback
  const UserAvatar = ({ src, userName, size = 40 }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      setImageError(false);
      setImageLoaded(false);
    }, [src]);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    // Si pas de src ou erreur de chargement, afficher l'avatar généré
    if (!src || imageError || src.includes('default-avatar')) {
      return <GeneratedAvatar userName={userName} size={size} />;
    }

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        {!imageLoaded && <GeneratedAvatar userName={userName} size={size} />}
        <img
          src={src}
          alt={userName}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none',
            position: imageLoaded ? 'static' : 'absolute',
            top: 0,
            left: 0,
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  // Récupérer l'utilisateur actuel
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(userData);
  }, []);

  // Charger les commentaires quand le sidebar s'ouvre
  useEffect(() => {
    if (isOpen && courseId) {
      fetchComments();
    }
  }, [isOpen, courseId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/action/commentaires/document/${courseId}/`);
      
      const processedComments = processCommentsWithAvatars(response.data.commentaires || []);
      setComments(processedComments);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Impossible de charger les commentaires');
      }
    } finally {
      setLoading(false);
    }
  };

  const processCommentsWithAvatars = (commentsList) => {
    return commentsList.map(comment => {
      const processedComment = {
        ...comment,
        utilisateur_avatar: comment.utilisateur_avatar 
          ? (comment.utilisateur_avatar.startsWith('http') 
              ? comment.utilisateur_avatar 
              : `http://localhost:8000${comment.utilisateur_avatar}`)
          : null
      };

      if (comment.reponses && comment.reponses.length > 0) {
        processedComment.reponses = comment.reponses.map(reponse => ({
          ...reponse,
          utilisateur_avatar: reponse.utilisateur_avatar 
            ? (reponse.utilisateur_avatar.startsWith('http') 
                ? reponse.utilisateur_avatar 
                : `http://localhost:8000${reponse.utilisateur_avatar}`)
            : null
        }));
      }

      return processedComment;
    });
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    
    try {
      setError(null);
      const payload = {
        document_id: courseId,
        contenu: newComment.trim(),
      };

      if (replyTo) {
        payload.parent_id = replyTo.id;
      }

      await api.post('/action/commentaires/ajouter/', payload);
      
      await fetchComments();
      
      setNewComment('');
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Impossible d\'ajouter le commentaire');
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/action/commentaires/${commentId}/toggle-like/`);
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              nb_likes: response.data.nb_likes,
              is_liked: response.data.is_liked
            };
          }
          
          if (comment.reponses) {
            const updatedReponses = comment.reponses.map(reponse => 
              reponse.id === commentId 
                ? { ...reponse, nb_likes: response.data.nb_likes, is_liked: response.data.is_liked }
                : reponse
            );
            return { ...comment, reponses: updatedReponses };
          }
          
          return comment;
        })
      );
    } catch (error) {
      console.error('Erreur lors du like:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.status === 400 && error.response?.data?.error?.includes('propre commentaire')) {
        // Ne pas afficher d'erreur pour les auto-likes, juste ignorer silencieusement
        console.log('Auto-like non autorisé');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erreur lors du like du commentaire');
      }
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!newContent.trim()) return;
    
    try {
      await api.put(`/action/commentaires/${commentId}/modifier/`, {
        contenu: newContent.trim()
      });
      
      await fetchComments();
      setEditingComment(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Impossible de modifier le commentaire');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await api.delete(`/action/commentaires/${commentId}/supprimer/`);
      await fetchComments();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Impossible de supprimer le commentaire');
      }
    }
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Fonction pour vérifier si l'utilisateur peut modifier/supprimer un commentaire
  const canModifyComment = (comment) => {
    if (!currentUser || !currentUser.id) return false;
    return comment.utilisateur === currentUser.id;
  };

  // Composant pour éditer un commentaire
  const EditCommentForm = ({ comment, onSave, onCancel }) => {
    const [editContent, setEditContent] = useState(comment.contenu);

    return (
      <div style={{ marginTop: '8px' }}>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button 
            onClick={() => onSave(editContent)}
            disabled={!editContent.trim()}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: editContent.trim() ? 'pointer' : 'not-allowed',
              opacity: editContent.trim() ? 1 : 0.6
            }}
          >
            Sauvegarder
          </button>
          <button 
            onClick={onCancel}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    );
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      marginLeft: isReply ? '32px' : '0',
      padding: '12px',
      backgroundColor: isReply ? '#f8f9fa' : 'white',
      borderRadius: '12px',
      border: '1px solid #e9ecef'
    }}>
      <UserAvatar 
        src={comment.utilisateur_avatar}
        userName={comment.utilisateur_nom}
        size={isReply ? 32 : 40}
      />
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>
            {comment.utilisateur_nom}
          </span>
          <span style={{ fontSize: '12px', color: '#6c757d' }}>
            {comment.date_relative}
          </span>
        </div>
        
        {editingComment && editingComment.id === comment.id ? (
          <EditCommentForm
            comment={comment}
            onSave={(content) => handleEditComment(comment.id, content)}
            onCancel={() => setEditingComment(null)}
          />
        ) : (
          <>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.4', 
              marginBottom: '8px',
              color: '#333'
            }}>
              {comment.contenu}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Masquer le bouton like si c'est le commentaire de l'utilisateur */}
              {!canModifyComment(comment) && (
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: comment.is_liked ? '#e3f2fd' : 'transparent',
                    color: comment.is_liked ? '#1976d2' : '#6c757d',
                    border: '1px solid',
                    borderColor: comment.is_liked ? '#1976d2' : '#dee2e6',
                    borderRadius: '16px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  👍 {comment.nb_likes > 0 ? comment.nb_likes : ''}
                </button>
              )}
              
              {/* Afficher juste le nombre de likes si c'est son propre commentaire */}
              {canModifyComment(comment) && comment.nb_likes > 0 && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  color: '#6c757d',
                  fontSize: '12px'
                }}>
                  👍 {comment.nb_likes}
                </span>
              )}
              
              {!isReply && (
                <button 
                  onClick={() => setReplyTo(comment)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    color: '#6c757d',
                    border: '1px solid #dee2e6',
                    borderRadius: '16px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Répondre
                </button>
              )}
              
              {canModifyComment(comment) && (
                <>
                  <button 
                    onClick={() => setEditingComment({ id: comment.id })}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      color: '#ffc107',
                      border: '1px solid #ffc107',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  const totalComments = comments.reduce((total, comment) => 
    total + 1 + (comment.reponses ? comment.reponses.length : 0), 0
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        width: '400px',
        backgroundColor: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Commentaires
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              color: '#6c757d'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Course Info */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{courseTitle}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
            {totalComments} commentaire{totalComments !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div style={{
            margin: '16px',
            padding: '12px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#721c24',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Reply Indicator */}
        {replyTo && (
          <div style={{
            margin: '16px 16px 0 16px',
            padding: '8px 12px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>En réponse à {replyTo.utilisateur_nom}</span>
            <button 
              onClick={() => setReplyTo(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Comments List */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              Chargement des commentaires...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6c757d' }}>
              <p>Aucun commentaire pour le moment.</p>
              <p>Soyez le premier à commenter !</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id}>
                {renderComment(comment)}
                {comment.reponses && comment.reponses.length > 0 && 
                  comment.reponses.map(reply => renderComment(reply, true))
                }
              </div>
            ))
          )}
        </div>
        
        {/* Comment Input */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #e9ecef',
          position: 'relative'
        }}>
          {showEmojiPicker && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '16px',
              right: '16px',
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0 -4px 8px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px'
              }}>
                {emojis.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      borderRadius: '4px'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                padding: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              😊
            </button>
            
            <textarea
              placeholder={replyTo ? `Répondre à ${replyTo.utilisateur_nom}...` : "Ajouter un commentaire..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              style={{
                flex: 1,
                minHeight: '40px',
                padding: '8px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'none'
              }}
              rows="2"
            />
            
            <button 
              onClick={handleAddComment}
              disabled={newComment.trim() === ''}
              style={{
                padding: '8px',
                backgroundColor: newComment.trim() ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSidebar;