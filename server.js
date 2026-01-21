const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const languageRoutes = require('./routes/languageRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const statRoutes = require('./routes/statRoutes');
const projectRoutes = require('./routes/projectRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const socialRoutes = require('./routes/socialRoutes');
const mapUrlRoutes = require('./routes/mapUrlRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  // Production
  'https://trmmc.az',
  'https://www.trmmc.az',
  'https://admin.trmmc.az',
  // Staging
  'https://stg-admin.trmmc.az',
  'https://stg-api-admin.trmmc.az',
  // Development
  'http://localhost:4175',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8000'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Headers'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/languages', languageRoutes);
app.use('/api/v1/hero', heroRoutes);
app.use('/api/v1/about', aboutRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/stats', statRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/workflow', workflowRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/contact_info', contactInfoRoutes);
app.use('/api/v1/socials', socialRoutes);
app.use('/api/v1/map_url', mapUrlRoutes);
app.use('/api/v1/applications', applicationRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'TR Construction API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
