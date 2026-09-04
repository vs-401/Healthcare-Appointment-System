import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

export const getAllDoctors = async (req, res) => {
  try {
    const { search, department, specialization, day, isFeatured } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (day) {
      query.availableDays = { $in: [day] };
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    let doctors = await Doctor.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone profileImage isActive',
      })
      .populate('department', 'name description icon')
      .sort({ rating: -1, experience: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      doctors = doctors.filter(
        (doc) =>
          (doc.userId && searchRegex.test(doc.userId.name)) ||
          searchRegex.test(doc.specialization) ||
          searchRegex.test(doc.qualification)
      );
    }

    if (!req.user || req.user.role !== 'admin') {
      doctors = doctors.filter((doc) => doc.userId && doc.userId.isActive);
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone profileImage isActive',
      })
      .populate('department');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      qualification,
      specialization,
      departmentId,
      experience,
      consultationFee,
      availableDays,
      availableSlots,
      bio,
      profileImage,
      isFeatured,
    } = req.body;

    if (!name || !email || !phone || !password || !qualification || !specialization || !departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const dept = await Department.findById(departmentId);
    if (!dept) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID provided',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      role: 'doctor',
      profileImage: profileImage || '',
    });

    const doctor = await Doctor.create({
      userId: user._id,
      qualification,
      specialization,
      department: departmentId,
      experience: experience || 1,
      consultationFee: consultationFee || 500,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      bio: bio || 'Compassionate healthcare professional dedicated to clinical excellence.',
      isFeatured: Boolean(isFeatured),
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone profileImage isActive')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'Doctor account and profile created successfully',
      doctor: populatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own doctor profile',
      });
    }

    const {
      name,
      phone,
      profileImage,
      qualification,
      specialization,
      departmentId,
      experience,
      consultationFee,
      availableDays,
      availableSlots,
      bio,
      isFeatured,
      rating,
    } = req.body;

    if (name || phone || profileImage !== undefined) {
      const user = await User.findById(doctor.userId);
      if (user) {
        if (name) user.name = name.trim();
        if (phone) user.phone = phone.trim();
        if (profileImage !== undefined) user.profileImage = profileImage;
        await user.save();
      }
    }

    if (qualification) doctor.qualification = qualification;
    if (specialization) doctor.specialization = specialization;
    if (departmentId) doctor.department = departmentId;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableSlots) doctor.availableSlots = availableSlots;
    if (bio !== undefined) doctor.bio = bio;
    if (isFeatured !== undefined && req.user.role === 'admin') doctor.isFeatured = isFeatured;
    if (rating !== undefined && req.user.role === 'admin') doctor.rating = rating;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone profileImage isActive')
      .populate('department');

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor account and profile deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { availableDays, availableSlots } = req.body;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableSlots) doctor.availableSlots = availableSlots;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Availability schedule updated successfully',
      availableDays: doctor.availableDays,
      availableSlots: doctor.availableSlots,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
