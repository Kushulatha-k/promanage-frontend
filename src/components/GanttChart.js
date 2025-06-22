import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const GanttChart = ({ tasks }) => {
  // Convert your tasks to the format gantt-task-react needs
  const ganttTasks = tasks.map((task, index) => ({
    start: new Date(), // You can adjust start and end as per your data
    end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days later (example)
    name: task.title,
    id: task._id,
    type: 'task',
    progress: 100,
    isDisabled: false,
    project: 'Project 1',
  }));

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Project Timeline - Gantt Chart</h3>
      <Gantt
        tasks={ganttTasks}
        viewMode={ViewMode.Day}
        listCellWidth="155px"
        columnWidth={65}
      />
    </div>
  );
};

export default GanttChart;
