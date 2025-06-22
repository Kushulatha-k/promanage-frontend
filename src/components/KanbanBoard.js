// src/components/KanbanBoard.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      alert('Failed to load tasks');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    // Update frontend
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: destination.droppableId } : task
    );
    setTasks(updatedTasks);

    // Update backend
    try {
      await axios.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      alert('Failed to update task');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {columns.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  background: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '8px',
                  minHeight: '400px',
                }}
              >
                <h3 style={{ textAlign: 'center' }}>{status}</h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: '10px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
