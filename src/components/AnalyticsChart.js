import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ tasks }) => {
  const data = ['To Do', 'In Progress', 'Done'].map((status) => ({
    name: status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ textAlign: 'center' }}>Task Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
