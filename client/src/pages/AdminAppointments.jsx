import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionModal from '../components/PrescriptionModal';
import { Calendar, Search, Filter } from 'lucide-react';

export default function AdminAppointments() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewingRx, setViewingRx] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (deptFilter) params.append('department', deptFilter);
      if (search) params.append('search', search);

      const [aptRes, deptRes] = await Promise.all([
        API.get(`/appointments?${params.toString()}`),
        API.get('/departments'),
      ]);

      setAppointments(aptRes.data.appointments || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, deptFilter, search]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const res = await API.put(`/appointments/${appointmentId}/status`, { status });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleViewPrescription = async (apt) => {
    try {
      const res = await API.get(`/prescriptions/appointment/${apt._id}`);
      setViewingRx(res.data.prescription);
    } catch (err) {
      toast.info('No electronic prescription found for this appointment.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Appointment Oversight</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor and manage consultation bookings across all doctors and medical departments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs sm:text-sm">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, patient, doctor, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt._id}
                appointment={apt}
                role="admin"
                onStatusChange={handleStatusChange}
                onViewPrescription={handleViewPrescription}
              />
            ))}
          </div>
        )}
      </main>

      <PrescriptionModal
        isOpen={Boolean(viewingRx)}
        onClose={() => setViewingRx(null)}
        prescription={viewingRx}
      />
    </div>
  );
}
