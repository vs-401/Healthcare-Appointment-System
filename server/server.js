import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev & internship demos
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / API Welcome
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'HUMAC Medical Service API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    organization: {
      name: 'HUMAC Medical Service',
      address: 'No-141, Gopal Nagar, Najafgarh, South-west Delhi-110043',
      phones: ['8383999066', '9310813776'],
      email: 'humacMedicalServices@gmail.com',
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect DB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`  HUMAC Medical Service Backend Server Running    `);
      console.log(`  Port: http://localhost:${PORT}                   `);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
      console.log(`==================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to launch server:', err.message);
  });
