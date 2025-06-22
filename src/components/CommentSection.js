import React, { useState } from 'react';
import axios from '../api/axios';

const CommentSection = ({ taskId, comments, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(comments || []);
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`/tasks/${taskId}/comments`, {
        author: currentUser,  // Pass current logged-in user’s name or id
        text: commentText,
      });
      setLocalComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      alert('Failed to add comment');
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/tasks/${taskId}/comments/${commentId}`);
      setLocalComments(res.data.comments);
    } catch (err) {
      alert('Failed to delete comment');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Comments</h4>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          style={{ width: '80%', marginRight: '10px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Add
        </button>
      </form>

      <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '10px' }}>
        {localComments.map((comment) => (
          <li key={comment._id || comment.createdAt} style={{ marginBottom: '8px' }}>
            <b>{comment.author}:</b> {comment.text}{' '}
            <button
              onClick={() => handleDeleteComment(comment._id)}
              style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
        {localComments.length === 0 && <li>No comments yet.</li>}
      </ul>
    </div>
  );
};

export default CommentSection;
