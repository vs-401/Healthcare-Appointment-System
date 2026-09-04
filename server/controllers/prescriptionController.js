import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Doctor from '../models/Doctor.js';

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medicines, instructions } = req.body;

    if (!appointmentId || !diagnosis || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID, diagnosis, and at least one medication are required',
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    let doctorId = appointment.doctorId;
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile || doctorProfile._id.toString() !== appointment.doctorId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are only authorized to write prescriptions for your own appointments',
        });
      }
      doctorId = doctorProfile._id;
    }

    let prescription = await Prescription.findOne({ appointmentId });

    if (prescription) {
      prescription.diagnosis = diagnosis;
      prescription.medicines = medicines;
      prescription.instructions = instructions || prescription.instructions;
      prescription.prescriptionDate = new Date();
      await prescription.save();
    } else {
      prescription = await Prescription.create({
        appointmentId,
        patientId: appointment.patientId,
        doctorId,
        diagnosis,
        medicines,
        instructions: instructions || 'Take medicines as directed. Hydrate and get adequate rest.',
      });
    }

    appointment.status = 'completed';
    appointment.doctorNotes = diagnosis;
    await appointment.save();

    await MedicalRecord.findOneAndUpdate(
      { appointmentId },
      {
        patientId: appointment.patientId,
        doctorId,
        appointmentId,
        appointmentDate: new Date(appointment.appointmentDate),
        symptoms: appointment.symptoms,
        diagnosis,
        treatment: medicines.map((m) => `${m.name} (${m.dosage}, ${m.frequency})`).join(', '),
        notes: instructions || '',
      },
      { upsert: true, new: true }
    );

    const populated = await Prescription.findById(prescription._id)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'department', select: 'name' }],
      })
      .populate('patientId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Prescription created and appointment completed successfully',
      prescription: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const prescriptions = await Prescription.find({ patientId })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'department', select: 'name' }],
      })
      .populate('appointmentId')
      .sort({ prescriptionDate: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'department', select: 'name' }],
      })
      .populate('patientId', 'name email phone')
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({
      success: true,
      prescription,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'department', select: 'name' }],
      })
      .populate('patientId', 'name email phone')
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'No prescription found for this appointment' });
    }

    res.status(200).json({
      success: true,
      prescription,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
