// src/components/KanbanBoard.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskCard from './TaskCard';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        alert('Failed to load tasks');
      }
    };
    fetchTasks();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {columns.map((status) => (
        <div key={status} style={{ flex: 1, background: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
          <h3 style={{ textAlign: 'center' }}>{status}</h3>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
