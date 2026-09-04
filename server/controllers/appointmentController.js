import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { generateAppointmentId } from '../utils/appointmentIdGenerator.js';

export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      patientDetails,
      symptoms,
    } = req.body;

    if (!doctorId || !departmentId || !appointmentDate || !timeSlot || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required appointment booking details',
      });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Selected doctor was not found' });
    }

    // Double-booking check
    const existingBooking = await Appointment.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `Dr. ${doctor.userId.name} is already booked for ${timeSlot} on ${appointmentDate}. Please choose another available slot or date.`,
      });
    }

    const details = {
      fullName: patientDetails?.fullName || req.user.name,
      age: Number(patientDetails?.age) || 25,
      gender: patientDetails?.gender || 'Other',
      phone: patientDetails?.phone || req.user.phone,
      email: patientDetails?.email || req.user.email,
    };

    const appointmentId = generateAppointmentId();

    const appointment = await Appointment.create({
      appointmentId,
      patientId: req.user._id,
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      patientDetails: details,
      symptoms: symptoms.trim(),
      status: 'pending',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone profileImage' }, { path: 'department', select: 'name' }],
      })
      .populate('departmentId', 'name icon')
      .populate('patientId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { patientId: req.user._id };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone profileImage' }, { path: 'department', select: 'name' }],
      })
      .populate('departmentId', 'name icon')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const { status, date } = req.query;
    const query = { doctorId: doctor._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      query.appointmentDate = date;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone profileImage')
      .populate('departmentId', 'name')
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status, department, doctor, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (department) query.departmentId = department;
    if (doctor) query.doctorId = doctor;

    let appointments = await Appointment.find(query)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone profileImage' }, { path: 'department', select: 'name' }],
      })
      .populate('departmentId', 'name icon')
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: -1, createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      appointments = appointments.filter(
        (apt) =>
          apt.appointmentId.toLowerCase().includes(s) ||
          apt.patientDetails?.fullName?.toLowerCase().includes(s) ||
          apt.patientDetails?.email?.toLowerCase().includes(s) ||
          apt.doctorId?.userId?.name?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone profileImage' }, { path: 'department' }],
      })
      .populate('departmentId')
      .populate('patientId', 'name email phone profileImage');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, doctorNotes, cancellationReason } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (cancellationReason !== undefined) appointment.cancellationReason = cancellationReason;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }],
      })
      .populate('departmentId', 'name')
      .populate('patientId', 'name email');

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot } = req.body;

    if (!appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new appointment date and time slot',
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: appointment.doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for this doctor. Please pick another slot.',
      });
    }

    appointment.appointmentDate = appointmentDate;
    appointment.timeSlot = timeSlot;
    appointment.status = 'pending';

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason || 'Cancelled by user';

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
