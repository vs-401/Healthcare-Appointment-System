import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import {
  UserCheck,
  Plus,
  Trash2,
  Edit,
  X,
  Star,
  Award,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function AdminDoctors() {
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    specialization: '',
    departmentId: '',
    experience: 5,
    consultationFee: 500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    bio: '',
    profileImage: '',
    isFeatured: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, deptRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/departments'),
      ]);
      setDoctors(docRes.data.doctors || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      toast.error('Failed to load doctor management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      qualification: '',
      specialization: '',
      departmentId: departments[0]?._id || '',
      experience: 5,
      consultationFee: 500,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      bio: '',
      profileImage: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.userId?.name || '',
      email: doc.userId?.email || '',
      phone: doc.userId?.phone || '',
      password: '',
      qualification: doc.qualification || '',
      specialization: doc.specialization || '',
      departmentId: doc.department?._id || '',
      experience: doc.experience || 1,
      consultationFee: doc.consultationFee || 500,
      availableDays: doc.availableDays || [],
      availableSlots: doc.availableSlots || [],
      bio: doc.bio || '',
      profileImage: doc.userId?.profileImage || '',
      isFeatured: Boolean(doc.isFeatured),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDoctor) {
        const res = await API.put(`/doctors/${editingDoctor._id}`, formData);
        if (res.data.success) {
          toast.success('Doctor updated successfully');
        }
      } else {
        const res = await API.post('/doctors', formData);
        if (res.data.success) {
          toast.success('New doctor created with user login credentials');
        }
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDoc) return;
    try {
      const res = await API.delete(`/doctors/${deletingDoc._id}`);
      if (res.data.success) {
        toast.success('Doctor account deleted successfully');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const filtered = doctors.filter((doc) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      doc.userId?.name?.toLowerCase().includes(s) ||
      doc.specialization?.toLowerCase().includes(s) ||
      doc.department?.name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Doctor Directory & Management</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create, update doctor profiles, manage OPD consultation fees and schedules
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            Add New Doctor
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={doc.userId?.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}
                        alt={doc.userId?.name}
                        className="w-10 h-10 rounded-xl object-cover border"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.userId?.name}</span>
                        <span className="text-[11px] text-slate-400">{doc.userId?.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                        {doc.department?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{doc.specialization}</td>
                    <td className="p-4 text-slate-600">{doc.experience} Years</td>
                    <td className="p-4 font-bold text-slate-900">₹{doc.consultationFee}</td>
                    <td className="p-4 text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating || 4.9}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100"
                        title="Edit Doctor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingDoc(doc)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Doctor Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl border border-slate-100 my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Hospital Doctor'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Dr. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                    disabled={Boolean(editingDoctor)}
                    placeholder="doctor@humac.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    required
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                {!editingDoctor && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Initial Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      required
                      placeholder="Doctor@123"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifications *</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData((p) => ({ ...p, qualification: e.target.value }))}
                    required
                    placeholder="MBBS, MD, DM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData((p) => ({ ...p, specialization: e.target.value }))}
                    required
                    placeholder="Senior Cardiologist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData((p) => ({ ...p, departmentId: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData((p) => ({ ...p, experience: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData((p) => ({ ...p, consultationFee: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profile Image URL</label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData((p) => ({ ...p, profileImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Biography</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="feat" className="text-xs font-semibold text-slate-700">
                  Feature on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {submitting ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingDoc)}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${deletingDoc?.userId?.name}? All doctor profile records will be removed.`}
        confirmText="Delete Doctor"
        confirmStyle="danger"
      />
    </div>
  );
}
