import MedicalRecord from '../models/MedicalRecord.js';
import Doctor from '../models/Doctor.js';

export const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, symptoms, diagnosis, treatment, notes } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Patient and diagnosis are required fields',
      });
    }

    let actualDoctorId = doctorId;
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (doc) actualDoctorId = doc._id;
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId: actualDoctorId,
      appointmentId,
      symptoms,
      diagnosis,
      treatment,
      notes,
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }, { path: 'department', select: 'name' }],
      });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      record: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const records = await MedicalRecord.find({ patientId })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'department', select: 'name' }],
      })
      .populate('appointmentId')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }, { path: 'department' }],
      })
      .populate('appointmentId');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
