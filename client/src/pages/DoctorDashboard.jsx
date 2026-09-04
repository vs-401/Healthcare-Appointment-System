import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  Calendar,
  CalendarCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorAppointments = async () => {
    try {
      const res = await API.get('/appointments/doctor/my-appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingApts = appointments.filter((a) => a.status === 'pending');
  const completedApts = appointments.filter((a) => a.status === 'completed');
  const uniquePatients = new Set(appointments.map((a) => a.patientId?._id)).size;

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const res = await API.put(`/appointments/${appointmentId}/status`, { status });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchDoctorAppointments();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest bg-teal-900/60 px-3 py-1 rounded-full">
              Doctor Clinical Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Manage your daily consultation schedule, review patient medical complaints, and issue digital prescriptions.
            </p>
          </div>
          <Link
            to="/doctor/appointments"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-teal-900 text-xs sm:text-sm font-bold shadow-md hover:bg-teal-50 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            Manage All Appointments
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Appointments"
            value={todayApts.length}
            icon={Calendar}
            color="teal"
            subtitle="Scheduled for today"
          />
          <StatCard
            title="Pending Requests"
            value={pendingApts.length}
            icon={Clock}
            color="amber"
            subtitle="Awaiting your approval"
          />
          <StatCard
            title="Completed Consultations"
            value={completedApts.length}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Prescriptions finalized"
          />
          <StatCard
            title="Total Unique Patients"
            value={uniquePatients}
            icon={Users}
            color="sky"
            subtitle="Consulted patient pool"
          />
        </div>

        {/* Today's Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today's Patient Queue</h2>
              <p className="text-xs text-slate-500">Appointments scheduled for {new Date().toLocaleDateString()}</p>
            </div>
            <Link to="/doctor/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700">
              View Full Schedule →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading queue...</div>
          ) : todayApts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
              No appointments scheduled for today. Enjoy your day!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Time Slot</th>
                    <th className="p-3.5">Patient Name</th>
                    <th className="p-3.5">Age/Gender</th>
                    <th className="p-3.5">Reason / Symptoms</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayApts.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50/60">
                      <td className="p-3.5 font-bold text-teal-800">{apt.timeSlot}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {apt.patientDetails?.fullName || apt.patientId?.name}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {apt.patientDetails?.age || '-'}, {apt.patientDetails?.gender || '-'}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">{apt.symptoms}</td>
                      <td className="p-3.5">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        {apt.status === 'pending' ? (
                          <button
                            onClick={() => handleStatusChange(apt._id, 'confirmed')}
                            className="px-3 py-1 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
                          >
                            Accept
                          </button>
                        ) : (
                          <Link
                            to="/doctor/appointments"
                            className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                          >
                            Manage
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
