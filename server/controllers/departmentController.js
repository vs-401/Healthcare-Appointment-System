import Department from '../models/Department.js';
import Doctor from '../models/Doctor.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });
    
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({ department: dept._id });
        return {
          ...dept.toObject(),
          doctorCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: departmentsWithCounts.length,
      departments: departmentsWithCounts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const doctors = await Doctor.find({ department: department._id }).populate(
      'userId',
      'name email phone profileImage'
    );

    res.status(200).json({
      success: true,
      department,
      doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Department name and description are required',
      });
    }

    const existing = await Department.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A department with this name already exists',
      });
    }

    const department = await Department.create({
      name: name.trim(),
      description: description.trim(),
      icon: icon || 'Stethoscope',
      image: image || '',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, description, icon, image, isActive } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    if (name) department.name = name.trim();
    if (description) department.description = description.trim();
    if (icon) department.icon = icon;
    if (image !== undefined) department.image = image;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      department,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const doctorsCount = await Doctor.countDocuments({ department: req.params.id });
    if (doctorsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department because ${doctorsCount} doctor(s) are assigned to it. Reassign doctors first.`,
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
