import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionModal from '../components/PrescriptionModal';
import ConfirmModal from '../components/ConfirmModal';
import { Calendar, Filter, Clock, X } from 'lucide-react';

export default function MyAppointments() {
  const { user } = useAuth();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [cancellingApt, setCancellingApt] = useState(null);
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/patient/my-appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!cancellingApt) return;
    try {
      const res = await API.put(`/appointments/${cancellingApt._id}/cancel`, {
        cancellationReason: 'Cancelled by patient',
      });
      if (res.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newSlot) {
      toast.warning('Please choose date and time slot');
      return;
    }
    setRescheduling(true);
    try {
      const res = await API.put(`/appointments/${reschedulingApt._id}/reschedule`, {
        appointmentDate: newDate,
        timeSlot: newSlot,
      });
      if (res.data.success) {
        toast.success('Appointment rescheduled successfully!');
        setReschedulingApt(null);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conflict: Slot already booked');
    } finally {
      setRescheduling(false);
    }
  };

  const handleViewPrescription = async (apt) => {
    try {
      const res = await API.get(`/prescriptions/appointment/${apt._id}`);
      setPrescriptionData(res.data.prescription);
    } catch (err) {
      toast.info('No electronic prescription attached to this appointment yet.');
    }
  };

  const filtered = appointments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your upcoming, past, and completed consultations
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-400">No records matching the "{filterStatus}" filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((apt) => (
              <AppointmentCard
                key={apt._id}
                appointment={apt}
                role="patient"
                onCancel={(a) => setCancellingApt(a)}
                onReschedule={(a) => {
                  setReschedulingApt(a);
                  setNewDate(a.appointmentDate);
                  setNewSlot(a.timeSlot);
                }}
                onViewPrescription={handleViewPrescription}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(cancellingApt)}
        onClose={() => setCancellingApt(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel appointment ${cancellingApt?.appointmentId}? This action cannot be reversed.`}
        confirmText="Cancel Appointment"
        confirmStyle="danger"
      />

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
              <button onClick={() => setReschedulingApt(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Appointment Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="">Select Time Slot</option>
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduling}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription View Modal */}
      <PrescriptionModal
        isOpen={Boolean(prescriptionData)}
        onClose={() => setPrescriptionData(null)}
        prescription={prescriptionData}
      />
    </div>
  );
}
