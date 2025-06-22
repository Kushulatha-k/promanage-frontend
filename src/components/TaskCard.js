import React, { useState, useEffect } from 'react';

const TaskCard = ({ task, onDelete, onEdit, onAddComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);

  useEffect(() => {
    setComments(task.comments || []);
  }, [task]);

  const handleChange = (e) => {
    setEditedTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(task._id, { ...editedTask });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        author: 'Kushulatha', // You can change this to dynamic user later
        text: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment('');

      // Update backend
      onAddComment(task._id, updatedComments);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '6px',
        background: '#fff',
      }}
    >
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            placeholder="Title"
            required
            style={{ marginBottom: '5px', width: '100%' }}
          />
          <input
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={{ marginBottom: '5px', width: '100%' }}
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            style={{ marginBottom: '5px', width: '100%' }}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button type="submit" style={{ marginRight: '10px' }}>
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <small>Status: {task.status}</small>

          {/* Comments Section */}
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={comment}
              placeholder="Add comment"
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', marginBottom: '5px', padding: '4px' }}
            />
            <button onClick={handleAddComment} style={{ marginBottom: '10px' }}>
              Add Comment
            </button>

            {comments.length > 0 && (
              <div>
                <strong>Comments:</strong>
                <ul style={{ paddingLeft: '20px' }}>
                  {comments.map((c, idx) => (
                    <li key={idx}>
                      <strong>{c.author}</strong>: {c.text}
                      <br />
                      <small style={{ color: '#888' }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ marginTop: '8px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                marginRight: '8px',
                background: 'blue',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                style={{
                  background: 'red',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
