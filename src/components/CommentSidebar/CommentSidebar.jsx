import React, { useState } from 'react';
import './CommentSidebar.css';

const CommentSidebar = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Jean Dupont",
      avatar: "/avatar1.jpg",
      text: "Très bon cours, merci pour le partage!",
      time: "Il y a 2 heures",
      likes: 3,
      isLiked: false
    },
    {
      id: 2,
      user: "Marie Martin",
      avatar: "/avatar2.jpg",
      text: "J'ai appris beaucoup de choses 👍",
      time: "Il y a 1 jour",
      likes: 5,
      isLiked: true
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const comment = {
      id: comments.length + 1,
      user: "Vous",
      avatar: "/user-avatar.jpg",
      text: newComment,
      time: "À l'instant",
      likes: 0,
      isLiked: false
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const updatedLikes = comment.isLiked ? comment.likes - 1 : comment.likes + 1;
        return {
          ...comment,
          likes: updatedLikes,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
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
          
          <div className="commentsList">
            {comments.map(comment => (
              <div key={comment.id} className="commentItem">
                <img src={comment.avatar} alt={comment.user} className="commentAvatar" />
                <div className="commentContent">
                  <div className="commentHeader">
                    <span className="commentUser">{comment.user}</span>
                    <span className="commentTime">{comment.time}</span>
                  </div>
                  <p className="commentText">{comment.text}</p>
                  <div className="commentActions">
                    <button 
                      className={`likeBtn ${comment.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      👍 {comment.likes > 0 ? comment.likes : ''}
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