import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import GanttChart from '../components/GanttChart';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const columnsOrder = ['To Do', 'In Progress', 'Done'];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await axios.post('/tasks', task);
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const editTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`/tasks/${id}`, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const addComment = async (taskId, comment) => {
    try {
      const res = await axios.put(`/tasks/${taskId}`, {
        ...tasks.find((t) => t._id === taskId),
        comments: [...(tasks.find((t) => t._id === taskId).comments || []), comment]
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;

    const newStatus = destination.droppableId;

    try {
      const res = await axios.put(`/tasks/${draggableId}`, {
        ...draggedTask,
        status: newStatus,
      });
      const updated = tasks.map((task) =>
        task._id === draggableId ? res.data : task
      );
      setTasks(updated);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const ganttTasks = tasks.map((task) => ({
    start: new Date(),
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    name: task.title,
    id: task._id,
    type: 'task',
    progress: 50,
    project: 'project1',
    dependencies: [],
  }));

  const chartData = columnsOrder.map((status) => ({
    name: status,
    count: tasks.filter((t) => t.status === status).length
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Task Board (Kanban)</h2>
      <TaskForm onAdd={addTask} />

      {/* Analytics Chart */}
      <div style={{ height: 250, marginTop: 30 }}>
        <h3 style={{ textAlign: 'center' }}>Task Analytics</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          {columnsOrder.map((status) => {
            const tasksInColumn = tasks.filter((task) => task.status === status);

            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      background: '#f5f5f5',
                      padding: '10px',
                      borderRadius: '8px',
                      minHeight: '400px',
                      maxHeight: '600px',
                      overflowY: 'auto',
                    }}
                  >
                    <h3 style={{ textAlign: 'center' }}>
                      {status} ({tasksInColumn.length})
                    </h3>

                    {tasksInColumn.map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              background: snapshot.isDragging ? '#d3f3ff' : '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '6px',
                              marginBottom: 8,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onDelete={deleteTask}
                              onEdit={editTask}
                              onAddComment={addComment}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <GanttChart tasks={ganttTasks} />
    </div>
  );
};

export default TasksPage;
