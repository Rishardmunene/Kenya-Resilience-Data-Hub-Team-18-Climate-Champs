const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'kcrd-api',
    version: '1.0.0'
  });
});

// Mock climate data endpoints
app.get('/api/climate/overview', (req, res) => {
  res.json({
    temperature: {
      current: 24.5,
      unit: '°C',
      trend: 'stable'
    },
    rainfall: {
      current: 45.2,
      unit: 'mm',
      trend: 'increasing'
    },
    airQuality: {
      current: 156,
      unit: 'AQI',
      trend: 'moderate'
    },
    droughtRisk: {
      current: 'low',
      trend: 'stable'
    }
  });
});

app.get('/api/climate/regions', (req, res) => {
  res.json([
    { id: 1, name: 'Nairobi', code: 'NBI', aqi: 156, status: 'warning' },
    { id: 2, name: 'Mombasa', code: 'MBS', aqi: 45, status: 'safe' },
    { id: 3, name: 'Kisumu', code: 'KSM', aqi: 78, status: 'info' },
    { id: 4, name: 'Nakuru', code: 'NKR', aqi: 52, status: 'safe' },
    { id: 5, name: 'Eldoret', code: 'ELD', aqi: 189, status: 'danger' }
  ]);
});

app.get('/api/insights', (req, res) => {
  res.json([
    {
      id: 1,
      type: 'recommendation',
      title: 'Implement Green Infrastructure',
      description: 'Consider planting urban forests in Nairobi to improve air quality.',
      priority: 'high'
    },
    {
      id: 2,
      type: 'alert',
      title: 'High Pollution Alert',
      description: 'Air quality in Eldoret has exceeded safe levels.',
      priority: 'critical'
    }
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KCRD API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
