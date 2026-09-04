import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    appointmentDate: {
      type: Date,
      default: Date.now,
    },
    symptoms: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    treatment: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('MedicalRecord', medicalRecordSchema);
