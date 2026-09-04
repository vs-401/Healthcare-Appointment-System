import http from 'http';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db.js';

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
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'online', system: 'HUMAC Medical Service API' }));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

async function runE2ETests() {
  await connectDB();
  const server = app.listen(5000);
  console.log('[E2E] Server listening on port 5000');

  const request = async (url, options = {}) => {
    const res = await fetch(`http://localhost:5000${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  try {
    // 1. Health Check
    console.log('[E2E] 1. Testing GET /api/health...');
    const health = await request('/api/health');
    console.log('   Health Status:', health.data.status);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Departments
    console.log('[E2E] 2. Testing GET /api/departments...');
    const depts = await request('/api/departments');
    console.log(`   Found ${depts.data.count} departments.`);
    if (depts.data.count < 8) throw new Error('Expected 8 departments');
    const firstDept = depts.data.departments[0];

    // 3. Doctors
    console.log('[E2E] 3. Testing GET /api/doctors...');
    const docs = await request('/api/doctors');
    console.log(`   Found ${docs.data.count} active doctors.`);
    if (docs.data.count < 6) throw new Error('Expected at least 6 doctors');
    const firstDoc = docs.data.doctors[0];

    // 4. Patient Login
    console.log('[E2E] 4. Testing POST /api/auth/login (Patient)...');
    const patLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'rahul.sharma@example.com',
        password: 'Patient@123',
      }),
    });
    console.log('   Patient Login Status:', patLogin.status, '| User:', patLogin.data.user?.name);
    if (!patLogin.data.token) throw new Error('Patient login failed');
    const patientToken = patLogin.data.token;

    // 5. Book Appointment
    console.log('[E2E] 5. Testing POST /api/appointments (Multi-Step Booking)...');
    const bookRes = await request('/api/appointments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${patientToken}` },
      body: JSON.stringify({
        doctorId: firstDoc._id,
        departmentId: firstDept._id,
        appointmentDate: '2026-09-10',
        timeSlot: '10:00 AM',
        patientDetails: {
          fullName: 'Rahul Sharma',
          age: 28,
          gender: 'Male',
          phone: '9811223344',
          email: 'rahul.sharma@example.com',
        },
        symptoms: 'Recurring headaches and mild sinus pressure.',
      }),
    });
    console.log('   Booking Result ID:', bookRes.data.appointment?.appointmentId);
    if (bookRes.status !== 201) throw new Error('Appointment booking failed');
    const bookedApt = bookRes.data.appointment;

    // 6. Double-Booking Conflict Prevention Check
    console.log('[E2E] 6. Testing Double-Booking Conflict Prevention...');
    const conflictRes = await request('/api/appointments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${patientToken}` },
      body: JSON.stringify({
        doctorId: firstDoc._id,
        departmentId: firstDept._id,
        appointmentDate: '2026-09-10',
        timeSlot: '10:00 AM',
        patientDetails: {
          fullName: 'Rahul Sharma',
          age: 28,
          gender: 'Male',
          phone: '9811223344',
          email: 'rahul.sharma@example.com',
        },
        symptoms: 'Duplicate attempt test.',
      }),
    });
    console.log('   Double booking status code:', conflictRes.status, '| Message:', conflictRes.data.message);
    if (conflictRes.status !== 400) throw new Error('Double booking prevention failed - should reject with 400');

    // 7. Doctor Login
    console.log('[E2E] 7. Testing POST /api/auth/login (Doctor)...');
    const docLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: firstDoc.userId.email,
        password: 'Doctor@123',
      }),
    });
    console.log('   Doctor Login Status:', docLogin.status, '| Doctor:', docLogin.data.user?.name);
    if (!docLogin.data.token) throw new Error('Doctor login failed');
    const doctorToken = docLogin.data.token;

    // 8. Doctor Writes Prescription
    console.log('[E2E] 8. Testing POST /api/prescriptions (Clinical Diagnosis & Rx)...');
    const rxRes = await request('/api/prescriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${doctorToken}` },
      body: JSON.stringify({
        appointmentId: bookedApt._id,
        diagnosis: 'Acute Tension Headache with Allergic Rhinitis',
        medicines: [
          {
            name: 'Naproxen',
            dosage: '250 mg',
            frequency: '1-0-1 (After Food)',
            duration: '3 Days',
            notes: 'Take with food',
          },
          {
            name: 'Levocetirizine',
            dosage: '5 mg',
            frequency: '0-0-1 (Night)',
            duration: '5 Days',
            notes: 'Night time only',
          },
        ],
        instructions: 'Avoid prolonged screen time. Maintain proper hydration and posture.',
      }),
    });
    console.log('   Prescription Created:', rxRes.data.prescription?._id);
    if (rxRes.status !== 201) throw new Error('Prescription creation failed');

    // 9. Admin Login & Stats
    console.log('[E2E] 9. Testing Admin Dashboard & Analytics APIs...');
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@humac.com',
        password: 'Admin@123',
      }),
    });
    const adminToken = adminLogin.data.token;
    const adminStats = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('   Admin Total Appointments Count:', adminStats.data.stats?.totalAppointments);
    console.log('   Admin Total Patients Count:', adminStats.data.stats?.totalPatients);
    if (adminStats.status !== 200) throw new Error('Admin stats failed');

    console.log('\n======================================================');
    console.log('   ALL END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY!    ');
    console.log('======================================================\n');
  } finally {
    server.close();
    await closeDB();
  }
}

runE2ETests().catch((err) => {
  console.error('[E2E] Test run failed:', err);
  process.exit(1);
});
