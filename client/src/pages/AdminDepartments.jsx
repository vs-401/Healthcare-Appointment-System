import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  X,
  Stethoscope,
  HeartPulse,
  Activity,
  Brain,
  Baby,
  Sparkles,
  TestTube,
  Pill
} from 'lucide-react';

export default function AdminDepartments() {
  const toast = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Stethoscope',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);

  const iconList = [
    'Stethoscope',
    'HeartPulse',
    'Activity',
    'Brain',
    'Baby',
    'Sparkles',
    'TestTube',
    'Pill',
  ];

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/departments');
      setDepartments(res.data.departments || []);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({ name: '', description: '', icon: 'Stethoscope' });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      icon: dept.icon || 'Stethoscope',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDept) {
        const res = await API.put(`/departments/${editingDept._id}`, formData);
        if (res.data.success) {
          toast.success('Department updated successfully');
        }
      } else {
        const res = await API.post('/departments', formData);
        if (res.data.success) {
          toast.success('Department created successfully');
        }
      }
      setModalOpen(false);
      fetchDepts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDept) return;
    try {
      const res = await API.delete(`/departments/${deletingDept._id}`);
      if (res.data.success) {
        toast.success('Department deleted successfully');
        fetchDepts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete department');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hospital Departments</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure medical wings, specialties, icons, and clinical descriptions
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-3">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{dept.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-teal-700">
                  {dept.doctorCount || 0} Doctor(s) Assigned
                </div>
              </div>

              <div className="pt-4 mt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingDept(dept)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-soft-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingDept ? 'Edit Department' : 'Create Department'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="e.g. Ophthalmology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  required
                  placeholder="Clinical scope, diagnostic procedures..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Icon Symbol</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                >
                  {iconList.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {submitting ? 'Saving...' : editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(deletingDept)}
        onClose={() => setDeletingDept(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete ${deletingDept?.name}? Departments with active assigned doctors cannot be deleted.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
}
