import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import MedicalRecord from '../models/MedicalRecord.js';
import ContactMessage from '../models/ContactMessage.js';
import { generateAppointmentId } from '../utils/appointmentIdGenerator.js';

dotenv.config();

export const seedDatabase = async (standalone = true) => {
  try {
    if (standalone) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/humac_medical';
      console.log(`Connecting to ${mongoUri} for seeding...`);
      await mongoose.connect(mongoUri);
    }

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      Appointment.deleteMany({}),
      Prescription.deleteMany({}),
      MedicalRecord.deleteMany({}),
      ContactMessage.deleteMany({}),
    ]);

    // 1. Create Admin
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Dr. H.U. Mac (Hospital Admin)',
      email: 'admin@humac.com',
      phone: '8383999066',
      password: 'Admin@123', // Pre-save hook or pre-hashed
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    });

    // 2. Create Departments
    const departmentsData = [
      {
        name: 'General Medicine',
        description: 'Comprehensive primary healthcare, routine medical exams, preventive care, and adult illness management.',
        icon: 'Stethoscope',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cardiology',
        description: 'Advanced cardiovascular care, heart failure management, ECG, echocardiograms, and hypertension treatments.',
        icon: 'HeartPulse',
        image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Orthopedics',
        description: 'Bone, spine, joint replacements, sports injuries, ligament care, arthritis, and rehabilitation therapy.',
        icon: 'Activity',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Neurology',
        description: 'Expert diagnostics and care for stroke, migraine headaches, nerve disorders, epilepsy, and memory care.',
        icon: 'Brain',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pediatrics',
        description: 'Dedicated and caring pediatric medicine, infant immunizations, child wellness checks, and growth tracking.',
        icon: 'Baby',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dermatology',
        description: 'Clinical skincare, acne treatments, allergic skin conditions, laser therapy, hair, and nail health.',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Laboratory',
        description: 'State-of-the-art diagnostic testing, full blood profiles, biochemistry, microbiology, and fast pathology reports.',
        icon: 'TestTube',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pharmacy',
        description: '24/7 on-site licensed pharmacy stocking verified prescription drugs, patient counseling, and wellness goods.',
        icon: 'Pill',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const departments = await Department.insertMany(departmentsData);
    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.name] = d._id;
    });

    // 3. Create Doctors (User + Doctor Profile)
    const doctorsData = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'dr.sarah@humac.com',
        phone: '9876543210',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MD (Internal Medicine)',
        specialization: 'General Physician & Consultant',
        department: deptMap['General Medicine'],
        experience: 8,
        consultationFee: 500,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        bio: 'Dr. Sarah Johnson is a leading internal medicine consultant with over 8 years of clinical practice in preventive health and chronic disease management.',
        rating: 4.9,
        ratingCount: 38,
        isFeatured: true,
      },
      {
        name: 'Dr. Rajesh Verma',
        email: 'dr.rajesh@humac.com',
        phone: '9876543211',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MD, DM (Cardiology)',
        specialization: 'Senior Interventional Cardiologist',
        department: deptMap['Cardiology'],
        experience: 14,
        consultationFee: 800,
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
        bio: 'Dr. Rajesh Verma brings 14+ years of expertise in diagnosing complex cardiac cases, coronary angioplasty, and lifestyle cardiac rehabilitation.',
        rating: 4.95,
        ratingCount: 52,
        isFeatured: true,
      },
      {
        name: 'Dr. Ananya Iyer',
        email: 'dr.ananya@humac.com',
        phone: '9876543212',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1594824813629-4f815d97be5a?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MS (Orthopedics), Fellowship Joint Care',
        specialization: 'Orthopedic & Joint Replacement Surgeon',
        department: deptMap['Orthopedics'],
        experience: 11,
        consultationFee: 750,
        availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        bio: 'Dr. Ananya Iyer specializes in arthroscopic surgery, total joint reconstructions, and modern sports injury rehabilitative procedures.',
        rating: 4.88,
        ratingCount: 29,
        isFeatured: true,
      },
      {
        name: 'Dr. Vikram Malhotra',
        email: 'dr.vikram@humac.com',
        phone: '9876543213',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MD, DM (Neurology)',
        specialization: 'Consultant Neurologist',
        department: deptMap['Neurology'],
        experience: 13,
        consultationFee: 900,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        bio: 'Dr. Vikram Malhotra has extensive experience managing acute stroke, neuropathies, severe migraines, and neuromuscular disorders.',
        rating: 4.92,
        ratingCount: 44,
        isFeatured: true,
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'dr.priya@humac.com',
        phone: '9876543214',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MD (Pediatrics), DNB',
        specialization: 'Child Specialist & Neonatologist',
        department: deptMap['Pediatrics'],
        experience: 9,
        consultationFee: 600,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM'],
        bio: 'Dr. Priya Sharma is dedicated to pediatric wellness, newborn developmental care, immunization schedules, and childhood infection treatment.',
        rating: 4.96,
        ratingCount: 67,
        isFeatured: false,
      },
      {
        name: 'Dr. Amit Patel',
        email: 'dr.amit@humac.com',
        phone: '9876543215',
        password: 'Doctor@123',
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
        specialization: 'Dermatologist & Cosmetologist',
        department: deptMap['Dermatology'],
        experience: 7,
        consultationFee: 650,
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
        availableSlots: ['11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        bio: 'Dr. Amit Patel provides state-of-the-art therapies for skin allergies, acne scarring, eczema, psoriasis, and cosmetic dermatology.',
        rating: 4.82,
        ratingCount: 23,
        isFeatured: false,
      },
    ];

    const createdDoctors = [];
    for (const docData of doctorsData) {
      const user = await User.create({
        name: docData.name,
        email: docData.email,
        phone: docData.phone,
        password: docData.password,
        role: 'doctor',
        profileImage: docData.profileImage,
      });

      const doctor = await Doctor.create({
        userId: user._id,
        qualification: docData.qualification,
        specialization: docData.specialization,
        department: docData.department,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        availableDays: docData.availableDays,
        availableSlots: docData.availableSlots,
        bio: docData.bio,
        rating: docData.rating,
        ratingCount: docData.ratingCount,
        isFeatured: docData.isFeatured,
      });

      createdDoctors.push({ ...doctor.toObject(), user });
    }

    // 4. Create Sample Patients
    const patientsData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '9811223344',
        password: 'Patient@123',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@example.com',
        phone: '9822334455',
        password: 'Patient@123',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        phone: '9833445566',
        password: 'Patient@123',
        profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      },
    ];

    const createdPatients = [];
    for (const patData of patientsData) {
      const patient = await User.create({
        name: patData.name,
        email: patData.email,
        phone: patData.phone,
        password: patData.password,
        role: 'patient',
        profileImage: patData.profileImage,
      });
      createdPatients.push(patient);
    }

    // 5. Create Sample Appointments
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date();
      d.setDate(today.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const appointmentsData = [
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        departmentId: deptMap['General Medicine'],
        appointmentDate: formatDate(-3),
        timeSlot: '10:00 AM',
        patientDetails: {
          fullName: createdPatients[0].name,
          age: 28,
          gender: 'Male',
          phone: createdPatients[0].phone,
          email: createdPatients[0].email,
        },
        symptoms: 'Mild fever, sore throat, and fatigue for 2 days.',
        status: 'completed',
        doctorNotes: 'Acute viral upper respiratory infection. Rest and hydration recommended.',
      },
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[1]._id,
        departmentId: deptMap['Cardiology'],
        appointmentDate: formatDate(-1),
        timeSlot: '11:00 AM',
        patientDetails: {
          fullName: createdPatients[1].name,
          age: 45,
          gender: 'Female',
          phone: createdPatients[1].phone,
          email: createdPatients[1].email,
        },
        symptoms: 'Occasional chest tightness and elevated blood pressure.',
        status: 'completed',
        doctorNotes: 'Stage 1 essential hypertension. ECG normal. Prescribed anti-hypertensive regimen.',
      },
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[2]._id,
        departmentId: deptMap['Orthopedics'],
        appointmentDate: formatDate(1),
        timeSlot: '02:00 PM',
        patientDetails: {
          fullName: createdPatients[0].name,
          age: 28,
          gender: 'Male',
          phone: createdPatients[0].phone,
          email: createdPatients[0].email,
        },
        symptoms: 'Knee joint pain after weekend jogging.',
        status: 'confirmed',
      },
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[2]._id,
        doctorId: createdDoctors[3]._id,
        departmentId: deptMap['Neurology'],
        appointmentDate: formatDate(2),
        timeSlot: '10:00 AM',
        patientDetails: {
          fullName: createdPatients[2].name,
          age: 34,
          gender: 'Male',
          phone: createdPatients[2].phone,
          email: createdPatients[2].email,
        },
        symptoms: 'Persistent throbbing migraine headaches on the left side.',
        status: 'pending',
      },
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[4]._id,
        departmentId: deptMap['Pediatrics'],
        appointmentDate: formatDate(0), // Today
        timeSlot: '04:00 PM',
        patientDetails: {
          fullName: 'Aarav Patel (Child of Sneha)',
          age: 4,
          gender: 'Male',
          phone: createdPatients[1].phone,
          email: createdPatients[1].email,
        },
        symptoms: 'Routine 4-year booster immunization and developmental milestone checkup.',
        status: 'confirmed',
      },
      {
        appointmentId: generateAppointmentId(),
        patientId: createdPatients[2]._id,
        doctorId: createdDoctors[5]._id,
        departmentId: deptMap['Dermatology'],
        appointmentDate: formatDate(-5),
        timeSlot: '12:00 PM',
        patientDetails: {
          fullName: createdPatients[2].name,
          age: 34,
          gender: 'Male',
          phone: createdPatients[2].phone,
          email: createdPatients[2].email,
        },
        symptoms: 'Red itching skin rash on arms.',
        status: 'cancelled',
        cancellationReason: 'Patient had travel conflict',
      },
    ];

    const createdAppointments = await Appointment.insertMany(appointmentsData);

    // 6. Create Prescriptions for completed appointments
    const prescription1 = await Prescription.create({
      appointmentId: createdAppointments[0]._id,
      patientId: createdPatients[0]._id,
      doctorId: createdDoctors[0]._id,
      diagnosis: 'Acute Viral Pharyngitis',
      medicines: [
        {
          name: 'Paracetamol',
          dosage: '650 mg',
          frequency: '1-0-1 (After Food)',
          duration: '3 Days',
          notes: 'Take only when fever exceeds 100°F',
        },
        {
          name: 'Cetirizine',
          dosage: '10 mg',
          frequency: '0-0-1 (Night)',
          duration: '5 Days',
          notes: 'May cause mild drowsiness',
        },
        {
          name: 'Vitamin C + Zinc Chewable',
          dosage: '500 mg',
          frequency: '1-0-0 (Morning)',
          duration: '10 Days',
          notes: 'Chew thoroughly after breakfast',
        },
      ],
      instructions: 'Gargle with warm salt water twice daily. Drink at least 3 liters of warm water daily and avoid cold beverages.',
      prescriptionDate: new Date(createdAppointments[0].appointmentDate),
    });

    const prescription2 = await Prescription.create({
      appointmentId: createdAppointments[1]._id,
      patientId: createdPatients[1]._id,
      doctorId: createdDoctors[1]._id,
      diagnosis: 'Essential Hypertension (Stage 1)',
      medicines: [
        {
          name: 'Telmisartan',
          dosage: '40 mg',
          frequency: '1-0-0 (Morning)',
          duration: '30 Days',
          notes: 'Take before breakfast daily at the same time',
        },
        {
          name: 'Atorvastatin',
          dosage: '10 mg',
          frequency: '0-0-1 (Night)',
          duration: '30 Days',
          notes: 'Cholesterol control',
        },
      ],
      instructions: 'Limit daily salt intake to under 3 grams. Walk briskly 30 minutes daily. Follow up in 4 weeks with BP chart.',
      prescriptionDate: new Date(createdAppointments[1].appointmentDate),
    });

    // 7. Create Medical Records
    await MedicalRecord.create({
      patientId: createdPatients[0]._id,
      doctorId: createdDoctors[0]._id,
      appointmentId: createdAppointments[0]._id,
      appointmentDate: new Date(createdAppointments[0].appointmentDate),
      symptoms: 'Mild fever, sore throat, and fatigue',
      diagnosis: 'Acute Viral Pharyngitis',
      treatment: 'Paracetamol (650mg), Cetirizine (10mg), Vit C',
      notes: 'Advised warm saline gargle and voice rest. Patient responded well to symptomatic relief.',
    });

    await MedicalRecord.create({
      patientId: createdPatients[1]._id,
      doctorId: createdDoctors[1]._id,
      appointmentId: createdAppointments[1]._id,
      appointmentDate: new Date(createdAppointments[1].appointmentDate),
      symptoms: 'Occasional chest tightness, BP 144/92 mmHg',
      diagnosis: 'Essential Hypertension (Stage 1)',
      treatment: 'Telmisartan 40mg, Atorvastatin 10mg, DASH diet',
      notes: 'ECG normal sinus rhythm. Advised lifestyle modification and salt restriction.',
    });

    // 8. Create Sample Contact Messages
    await ContactMessage.insertMany([
      {
        name: 'Vikas Mehra',
        email: 'vikas.mehra@gmail.com',
        phone: '9899001122',
        subject: 'Inquiry about Health Checkup Packages',
        message: 'Hello, I want to know if HUMAC Medical Service offers whole-body comprehensive annual health checkups for senior citizens?',
        status: 'unread',
      },
      {
        name: 'Ritu Sen',
        email: 'ritu.sen@outlook.com',
        phone: '9877002233',
        subject: 'Sunday Orthopedic OPD Availability',
        message: 'Are joint replacement consultation specialists available on Sundays in Najafgarh clinic?',
        status: 'replied',
        replyNotes: 'Replied via email confirming Sunday emergency care & weekday OPD timings.',
      },
    ]);

    console.log('====================================================');
    console.log('  HUMAC Medical Service Database Seeded Successfully!');
    console.log('====================================================');
    console.log('  Default Test Credentials:');
    console.log('  - Admin:   admin@humac.com       / Admin@123');
    console.log('  - Doctor:  dr.sarah@humac.com    / Doctor@123');
    console.log('  - Doctor:  dr.rajesh@humac.com   / Doctor@123');
    console.log('  - Patient: rahul.sharma@example.com / Patient@123');
    console.log('  - Patient: sneha.patel@example.com  / Patient@123');
    console.log('====================================================');

    if (standalone) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (err) {
    console.error('Error seeding database:', err);
    if (standalone) process.exit(1);
  }
};

// If run directly via node seeds/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase(true);
}
