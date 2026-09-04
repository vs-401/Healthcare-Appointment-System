import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Prescription from '../models/Prescription.js';

export const getAllPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'patient' };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const patients = await User.find(query).sort({ createdAt: -1 });

    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ patientId: patient._id });
        const recordCount = await MedicalRecord.countDocuments({ patientId: patient._id });
        return {
          ...patient.toObject(),
          appointmentCount,
          recordCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: patientsWithStats.length,
      patients: patientsWithStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: 'patient' });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }, { path: 'department', select: 'name' }],
      })
      .sort({ appointmentDate: -1 });

    const medicalRecords = await MedicalRecord.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }],
      })
      .sort({ appointmentDate: -1 });

    const prescriptions = await Prescription.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }],
      })
      .sort({ prescriptionDate: -1 });

    res.status(200).json({
      success: true,
      patient,
      appointments,
      medicalRecords,
      prescriptions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePatientStatus = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: 'patient' });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    patient.isActive = !patient.isActive;
    await patient.save();

    res.status(200).json({
      success: true,
      message: `Patient account has been ${patient.isActive ? 'activated' : 'deactivated'}`,
      isActive: patient.isActive,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
