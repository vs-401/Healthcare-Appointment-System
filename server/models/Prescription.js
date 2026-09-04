import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. 500mg
  frequency: { type: String, required: true }, // e.g. 1-0-1 (After Food)
  duration: { type: String, required: true }, // e.g. 5 Days
  notes: { type: String, default: '' },
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
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
    diagnosis: {
      type: String,
      required: [true, 'Clinical diagnosis is required'],
      trim: true,
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    instructions: {
      type: String,
      default: 'Take medicines as directed. Drink plenty of water and rest well.',
    },
    prescriptionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Prescription', prescriptionSchema);
