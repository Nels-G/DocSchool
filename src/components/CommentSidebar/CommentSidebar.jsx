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

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

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
      setComments(response.data.commentaires || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      setError('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
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

      const response = await api.post('/action/commentaires/ajouter/', payload);
      
      // Recharger les commentaires pour avoir la structure complète
      await fetchComments();
      
      setNewComment('');
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      setError('Impossible d\'ajouter le commentaire');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/action/commentaires/${commentId}/toggle-like/`);
      
      // Mettre à jour le commentaire localement
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              nb_likes: response.data.nb_likes,
              is_liked: response.data.is_liked
            };
          }
          
          // Vérifier les réponses aussi
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
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await api.put(`/action/commentaires/${commentId}/modifier/`, {
        contenu: newContent
      });
      
      // Recharger les commentaires
      await fetchComments();
      setEditingComment(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Impossible de modifier le commentaire');
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
      setError('Impossible de supprimer le commentaire');
    }
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`commentItem ${isReply ? 'replyComment' : ''}`}>
      <img 
        src={comment.utilisateur_avatar || "/default-avatar.jpg"} 
        alt={comment.utilisateur_nom} 
        className="commentAvatar"
        onError={(e) => {
          e.target.src = "/default-avatar.jpg";
        }}
      />
      <div className="commentContent">
        <div className="commentHeader">
          <span className="commentUser">{comment.utilisateur_nom}</span>
          <span className="commentTime">{comment.date_relative}</span>
        </div>
        
        {editingComment === comment.id ? (
          <div className="editCommentForm">
            <textarea
              value={editingComment.content || comment.contenu}
              onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
              className="editCommentInput"
            />
            <div className="editCommentActions">
              <button 
                onClick={() => handleEditComment(comment.id, editingComment.content)}
                className="saveEditBtn"
              >
                Sauvegarder
              </button>
              <button 
                onClick={() => setEditingComment(null)}
                className="cancelEditBtn"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="commentText">{comment.contenu}</p>
            <div className="commentActions">
              <button 
                className={`likeBtn ${comment.is_liked ? 'liked' : ''}`}
                onClick={() => handleLikeComment(comment.id)}
              >
                👍 {comment.nb_likes > 0 ? comment.nb_likes : ''}
              </button>
              {!isReply && (
                <button 
                  className="replyBtn"
                  onClick={() => setReplyTo(comment)}
                >
                  Répondre
                </button>
              )}
              <button 
                className="editBtn"
                onClick={() => setEditingComment({id: comment.id, content: comment.contenu})}
              >
                Modifier
              </button>
              <button 
                className="deleteBtn"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Supprimer
              </button>
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
    <div className="commentSidebarOverlay" onClick={onClose}>
      <div className="commentSidebar" onClick={e => e.stopPropagation()}>
        <div className="commentSidebarHeader">
          <h3>Commentaires</h3>
          <button className="closeBtn" onClick={onClose}>×</button>
        </div>
        
        <div className="commentSidebarContent">
          <div className="courseTitleSection">
            <h4>{courseTitle}</h4>
            <p>{totalComments} commentaire{totalComments !== 1 ? 's' : ''}</p>
          </div>
          
          {error && (
            <div className="errorMessage">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {replyTo && (
            <div className="replyToIndicator">
              <span>En réponse à {replyTo.utilisateur_nom}</span>
              <button onClick={() => setReplyTo(null)}>×</button>
            </div>
          )}
          
          <div className="commentsList">
            {loading ? (
              <div className="loadingComments">Chargement des commentaires...</div>
            ) : comments.length === 0 ? (
              <div className="noComments">
                <p>Aucun commentaire pour le moment.</p>
                <p>Soyez le premier à commenter !</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id}>
                  {renderComment(comment)}
                  {comment.reponses && comment.reponses.length > 0 && (
                    <div className="repliesContainer">
                      {comment.reponses.map(reply => renderComment(reply, true))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="commentInputContainer">
          <div className="commentInputWrapper">
            <button 
              className="emojiBtn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
            
            {showEmojiPicker && (
              <div className="emojiPicker">
                <div className="emojiGrid">
                  {emojis.map(emoji => (
                    <button 
                      key={emoji}
                      className="emojiOption"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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
              className="commentInput"
              rows="3"
            />
            
            <button 
              className="sendCommentBtn"
              onClick={handleAddComment}
              disabled={newComment.trim() === ''}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
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