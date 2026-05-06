import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const [studentProgressData, setStudentProgressData] = useState([
    { week: 'Week 1', progress: 20 },
    { week: 'Week 2', progress: 35 },
    { week: 'Week 3', progress: 55 },
    { week: 'Week 4', progress: 70 },
    { week: 'Week 5', progress: 85 },
    { week: 'Week 6', progress: 95 },
  ]);

  const [batchPerformanceData, setBatchPerformanceData] = useState([
    { name: 'React Alpha', score: 88 },
    { name: 'Design Beta', score: 72 },
    { name: 'Node Gamma', score: 94 },
    { name: 'Python Delta', score: 81 },
  ]);

  const [distributionData, setDistributionData] = useState([
    { name: 'Full Stack', value: 400 },
    { name: 'UI/UX', value: 300 },
    { name: 'Data Science', value: 300 },
    { name: 'DevOps', value: 200 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleRefresh = () => {
    setStudentProgressData(prev => prev.map((item, index) => ({
      ...item,
      // Create an upward trend but with random variation
      progress: Math.min(100, Math.max(10, 20 + (index * 15) + Math.floor(Math.random() * 20) - 10))
    })));

    setBatchPerformanceData(prev => prev.map(item => ({
      ...item,
      score: Math.floor(Math.random() * 35) + 65 // Random score between 65 and 100
    })));

    setDistributionData(prev => prev.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 300) + 150 // Random value between 150 and 450
    })));
  };

  return (
    <div className="page active">
      <div className="card-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="card-title">Analytics & Monitoring</h3>
          <p className="card-sub">Real-time performance metrics and student distribution across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary btn-small" onClick={handleRefresh}>🔄 Refresh Data</button>
          <button className="btn-primary btn-small" onClick={() => alert("Generating analytics report...")}>📊 Download Report</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h4 className="card-title">Student Learning Progress</h4></div>
          <div className="card-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h4 className="card-title">Batch Performance Average</h4></div>
          <div className="card-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header"><h4 className="card-title">Course Distribution</h4></div>
        <div className="card-body" style={{ height: '400px', display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
