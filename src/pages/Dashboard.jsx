// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { subscribeToRealTimeReadings, getHistoricalData, calculateStats, getAllDevices } from '../services/firebaseService';
import StatCard from '../components/StatCard';
import ReadingsTable from '../components/ReadingsTable';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [deviceId, setDeviceId] = useState('device_001');
  const [devices, setDevices] = useState([]);
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: new Date(Date.now() - 7*24*60*60*1000), end: new Date() });
  const [activeTab, setActiveTab] = useState('realtime');

  // Load devices on mount
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const allDevices = await getAllDevices();
        setDevices(allDevices);
      } catch (err) {
        console.error('Error loading devices:', err);
      }
    };
    loadDevices();
  }, []);

  // Real-time subscription
  useEffect(() => {
    if (activeTab !== 'realtime') return;

    const unsubscribe = subscribeToRealTimeReadings(deviceId, (data) => {
      setReadings(data);
      setStats(calculateStats(data));
    });

    return () => unsubscribe();
  }, [deviceId, activeTab]);

  // Historical data
  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const data = await getHistoricalData(deviceId, dateRange.start, dateRange.end);
      setReadings(data);
      setStats(calculateStats(data));
    } catch (err) {
      console.error('Error loading historical data:', err);
      alert('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (readings.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Timestamp', 'Moisture %', 'Temperature °C', 'EC', 'pH', 'Nitrogen', 'Phosphorus', 'Potassium'];
    const rows = readings.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.moisture.toFixed(1),
      r.temperature.toFixed(1),
      r.ec.toFixed(0),
      r.ph.toFixed(2),
      r.nitrogen.toFixed(0),
      r.phosphorus.toFixed(0),
      r.potassium.toFixed(0)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-data-${deviceId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Export to JSON
  const exportToJSON = () => {
    if (readings.length === 0) {
      alert('No data to export');
      return;
    }

    const data = {
      device: deviceId,
      exportDate: new Date().toISOString(),
      readings: readings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-data-${deviceId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const chartData = readings.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString(),
    moisture: r.moisture,
    temperature: r.temperature,
    ph: r.ph,
    ec: r.ec
  }));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌱 Soil Monitoring Dashboard</h1>
        <p>Real-time soil sensor data visualization</p>
      </header>

      {/* Controls */}
      <div className="controls-section">
        <div className="device-selector">
          <label>Select Device:</label>
          <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            {devices.map(device => (
              <option key={device} value={device}>{device}</option>
            ))}
          </select>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'realtime' ? 'active' : ''}`} onClick={() => setActiveTab('realtime')}>
            Real-Time
          </button>
          <button className={`tab ${activeTab === 'historical' ? 'active' : ''}`} onClick={() => setActiveTab('historical')}>
            Historical
          </button>
        </div>
      </div>

      {/* Historical Controls */}
      {activeTab === 'historical' && (
        <div className="historical-controls">
          <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
          />
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
          />
          <button onClick={loadHistoricalData} disabled={loading}>
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </div>
      )}

      {/* Export Buttons */}
      <div className="export-section">
        <button onClick={exportToCSV} className="btn-export">📊 Export CSV</button>
        <button onClick={exportToJSON} className="btn-export">📄 Export JSON</button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <StatCard title="Moisture" value={stats.moisture.avg.toFixed(1)} unit="%" color="#3498db" />
          <StatCard title="Temperature" value={stats.temperature.avg.toFixed(1)} unit="°C" color="#e74c3c" />
          <StatCard title="pH Level" value={stats.ph.avg.toFixed(2)} unit="pH" color="#27ae60" />
          <StatCard title="EC Level" value={stats.ec.avg.toFixed(0)} unit="µS/cm" color="#f39c12" />
        </div>
      )}

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Moisture & Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="#3498db" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#e74c3c" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>pH & EC Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="ph" fill="#27ae60" />
              <Bar yAxisId="right" dataKey="ec" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-section">
        <h3>Detailed Readings</h3>
        <ReadingsTable readings={readings.slice(-50)} />
      </div>
    </div>
  );
}
