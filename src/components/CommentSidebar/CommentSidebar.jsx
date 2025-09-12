import React, { useState, useEffect } from 'react';
import './CommentSidebar.css';
import api from '../../services/api';

const CommentSidebar = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les commentaires
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/documents/documents/${courseId}/comments/`);
      setComments(response.data.commentaires || []);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && courseId) {
      fetchComments();
    }
  }, [isOpen, courseId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    
    try {
      const response = await api.post(`/documents/documents/${courseId}/comments/add/`, {
        texte: newComment
      });
      
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      setError('Impossible d\'ajouter le commentaire');
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await api.delete(`/documents/documents/${courseId}/comments/${commentId}/like/`);
      } else {
        await api.post(`/documents/documents/${courseId}/comments/${commentId}/like/`);
      }
      
      // Recharger les commentaires après like
      fetchComments();
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

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
            <p>{comments.length} commentaire{comments.length !== 1 ? 's' : ''}</p>
          </div>
          
          {loading && <div className="loading">Chargement...</div>}
          {error && <div className="error">{error}</div>}
          
          <div className="commentsList">
            {comments.map(comment => (
              <div key={comment.id} className="commentItem">
                <img 
                  src={comment.utilisateur_photo || "/default-avatar.png"} 
                  alt={comment.utilisateur_nom} 
                  className="commentAvatar" 
                />
                <div className="commentContent">
                  <div className="commentHeader">
                    <span className="commentUser">{comment.utilisateur_nom}</span>
                    <span className="commentTime">
                      {new Date(comment.date_creation).toLocaleDateString()}
                      {comment.est_modifie && ' (modifié)'}
                    </span>
                  </div>
                  <p className="commentText">{comment.texte}</p>
                  <div className="commentActions">
                    <button 
                      className={`likeBtn ${comment.aime_par_utilisateur ? 'liked' : ''}`}
                      onClick={() => handleLikeComment(comment.id, comment.aime_par_utilisateur)}
                    >
                      👍 {comment.nombre_likes > 0 ? comment.nombre_likes : ''}
                    </button>
                    <button className="replyBtn">Répondre</button>
                  </div>
                </div>
              </div>
            ))}
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
                {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'].map(emoji => (
                  <button 
                    key={emoji}
                    className="emojiOption"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="commentInput"
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