import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';
import ContactMessage from '../models/ContactMessage.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = await Appointment.countDocuments({ appointmentDate: todayStr });
    
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });

    const completedList = await Appointment.find({ status: 'completed' }).populate('doctorId', 'consultationFee');
    const totalRevenue = completedList.reduce((acc, curr) => acc + (curr.doctorId?.consultationFee || 500), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalDepartments,
        totalAppointments,
        todayAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        unreadMessages,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    const departments = await Department.find();
    const departmentBreakdown = await Promise.all(
      departments.map(async (dept) => {
        const count = await Appointment.countDocuments({ departmentId: dept._id });
        return {
          name: dept.name,
          count,
        };
      })
    );

    const recentAppointments = await Appointment.find()
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name' }],
      })
      .populate('patientId', 'name email')
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPatients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      departmentBreakdown,
      recentAppointments,
      recentPatients,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
