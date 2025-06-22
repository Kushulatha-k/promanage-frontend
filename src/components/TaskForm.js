import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do', // Default status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description } = formData;

    if (!title.trim() || !description.trim()) {
      alert('Please enter title and description');
      return;
    }

    onAdd(formData); // Send task data to parent
    setFormData({ title: '', description: '', status: 'To Do' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        style={{ marginRight: '10px', width: '200px' }}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        style={{ marginRight: '10px', width: '300px' }}
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={{ marginRight: '10px' }}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
