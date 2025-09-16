import React, { useState, useEffect } from 'react';
import './CommentSidebar.css';
import api from '../../services/api';

const CommentSidebar = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const avatarColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
    '#AED6F1', '#A9DFBF', '#F9E79F', '#D7BDE2', '#A3E4D7'
  ];

  const generateAvatarColor = (userName) => {
    if (!userName) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const GeneratedAvatar = ({ userName, size = 40 }) => {
    const backgroundColor = generateAvatarColor(userName);
    const initials = getInitials(userName);
    
    return (
      <div
        className="generated-avatar"
        style={{
          width: size,
          height: size,
          backgroundColor: backgroundColor,
          fontSize: size * 0.4
        }}
      >
        {initials}
      </div>
    );
  };

  const UserAvatar = ({ src, userName, size = 40 }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (src && src !== 'null' && src !== 'undefined') {
        setHasError(false);
        setIsLoading(true);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }, [src]);

    const handleImageLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleImageError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    if (!src || src === 'null' || src === 'undefined' || hasError) {
      return <GeneratedAvatar userName={userName} size={size} />;
    }

    return (
      <div className="user-avatar-container" style={{ width: size, height: size }}>
        {isLoading && (
          <div className="avatar-loading">
            <GeneratedAvatar userName={userName} size={size} />
          </div>
        )}
        <img
          src={src}
          alt={userName || 'Avatar'}
          className="user-avatar-img"
          style={{
            width: size,
            height: size
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(userData);
  }, []);

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

  const buildAvatarUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === 'null' || avatarPath === 'undefined') {
      return null;
    }
    
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    if (avatarPath.startsWith('/')) {
      return `http://localhost:8000${avatarPath}`;
    }
    
    return `http://localhost:8000/media/${avatarPath}`;
  };

  const processCommentsWithAvatars = (commentsList) => {
    return commentsList.map(comment => {
      const processedComment = {
        ...comment,
        utilisateur_avatar: buildAvatarUrl(comment.utilisateur_avatar)
      };

      if (comment.reponses && comment.reponses.length > 0) {
        processedComment.reponses = comment.reponses.map(reponse => ({
          ...reponse,
          utilisateur_avatar: buildAvatarUrl(reponse.utilisateur_avatar)
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
    try {
      await api.delete(`/action/commentaires/${commentId}/supprimer/`);
      await fetchComments();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Impossible de supprimer le commentaire');
      }
      setDeleteConfirm(null);
    }
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const canModifyComment = (comment) => {
    if (!currentUser || !currentUser.id) return false;
    return comment.utilisateur === currentUser.id;
  };

  const EditCommentForm = ({ comment, onSave, onCancel }) => {
    const [editContent, setEditContent] = useState(comment.contenu);

    return (
      <div className="edit-comment-form">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="edit-comment-input"
        />
        <div className="edit-comment-actions">
          <button 
            onClick={() => onSave(editContent)}
            disabled={!editContent.trim()}
            className="save-edit-btn"
          >
            Sauvegarder
          </button>
          <button 
            onClick={onCancel}
            className="cancel-edit-btn"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  };

  const getCurrentUserAvatarUrl = () => {
    if (currentUser && currentUser.photo_profil_url) {
      return buildAvatarUrl(currentUser.photo_profil_url);
    }
    return null;
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`comment-item ${isReply ? 'reply-comment' : ''}`}>
      <UserAvatar 
        src={comment.utilisateur_avatar}
        userName={comment.utilisateur_nom}
        size={isReply ? 32 : 40}
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-user">{comment.utilisateur_nom}</span>
          <span className="comment-time">{comment.date_relative}</span>
        </div>
        
        {editingComment && editingComment.id === comment.id ? (
          <EditCommentForm
            comment={comment}
            onSave={(content) => handleEditComment(comment.id, content)}
            onCancel={() => setEditingComment(null)}
          />
        ) : (
          <>
            <p className="comment-text">{comment.contenu}</p>
            <div className="comment-actions">
              {!canModifyComment(comment) && (
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  className={`like-btn ${comment.is_liked ? 'liked' : ''}`}
                >
                  👍 {comment.nb_likes > 0 ? comment.nb_likes : ''}
                </button>
              )}
              
              {canModifyComment(comment) && comment.nb_likes > 0 && (
                <span className="like-count">
                  👍 {comment.nb_likes}
                </span>
              )}
              
              {!isReply && (
                <button 
                  onClick={() => setReplyTo(comment)}
                  className="reply-btn"
                >
                  Répondre
                </button>
              )}
              
              {canModifyComment(comment) && (
                <>
                  <button 
                    onClick={() => setEditingComment({ id: comment.id })}
                    className="edit-btn"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm({ 
                      commentId: comment.id, 
                      userName: comment.utilisateur_nom 
                    })}
                    className="delete-btn"
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
    <div className="comment-sidebar-overlay" onClick={onClose}>
      <div className="comment-sidebar" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="comment-sidebar-header">
          <h3>Commentaires</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {/* Course Info */}
        <div className="course-title-section">
          <h4>{courseTitle}</h4>
          <p>{totalComments} commentaire{totalComments !== 1 ? 's' : ''}</p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Reply Indicator */}
        {replyTo && (
          <div className="reply-to-indicator">
            <span>En réponse à {replyTo.utilisateur_nom}</span>
            <button onClick={() => setReplyTo(null)}>×</button>
          </div>
        )}
        
        {/* Comments List */}
        <div className="comment-sidebar-content">
          {loading ? (
            <div className="loading-comments">
              Chargement des commentaires...
            </div>
          ) : comments.length === 0 ? (
            <div className="no-comments">
              <p>Aucun commentaire pour le moment.</p>
              <p>Soyez le premier à commenter !</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id}>
                  {renderComment(comment)}
                  {comment.reponses && comment.reponses.length > 0 && 
                    <div className="replies-container">
                      {comment.reponses.map(reply => renderComment(reply, true))}
                    </div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Comment Input */}
        <div className="comment-input-container">
          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-grid">
                {emojis.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="emoji-option"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="comment-input-wrapper">
            <UserAvatar 
              src={getCurrentUserAvatarUrl()}
              userName={currentUser ? currentUser.nom_complet : 'Utilisateur'}
              size={32}
            />
            
            <div className="input-with-actions">
              <div className="input-row">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="emoji-btn"
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
                  className="comment-input"
                  rows="2"
                />
                
                <button 
                  onClick={handleAddComment}
                  disabled={newComment.trim() === ''}
                  className="send-comment-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delete Confirmation Popup */}
        {deleteConfirm && (
          <div className="delete-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="delete-confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="delete-icon">🗑️</div>
              <h3>Supprimer le commentaire</h3>
              <p>
                Êtes-vous sûr de vouloir supprimer ce commentaire de <strong>{deleteConfirm.userName}</strong> ?
                Cette action est irréversible.
              </p>
              <div className="delete-confirm-actions">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="cancel-delete-btn"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteComment(deleteConfirm.commentId)}
                  className="confirm-delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSidebar;