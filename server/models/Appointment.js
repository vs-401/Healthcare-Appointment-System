import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM"
      required: [true, 'Time slot is required'],
    },
    patientDetails: {
      fullName: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    symptoms: {
      type: String,
      required: [true, 'Symptoms or reason for appointment is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Appointment', appointmentSchema);
