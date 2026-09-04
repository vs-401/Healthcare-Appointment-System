import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PrescriptionModal from '../components/PrescriptionModal';
import {
  Calendar,
  CalendarCheck,
  FileText,
  ClipboardList,
  Clock,
  HeartPulse,
  Activity,
  ArrowRight,
  AlertCircle,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [aptRes, recRes] = await Promise.all([
          API.get('/appointments/patient/my-appointments'),
          API.get(`/medical-records/patient/${user?._id || user?.id}`),
        ]);
        setAppointments(aptRes.data.appointments || []);
        setRecords(recRes.data.records?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboard();
  }, [user]);

  const upcomingApts = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const completedApts = appointments.filter((a) => a.status === 'completed');
  const cancelledApts = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest bg-teal-800/60 px-3 py-1 rounded-full">
              Patient Health Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Track your upcoming consultations, view electronic prescriptions, and manage medical records from HUMAC Medical Service.
            </p>
          </div>
          <Link
            to="/book-appointment"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-teal-900 text-xs sm:text-sm font-bold shadow-md hover:bg-teal-50 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Appointment
          </Link>
        </div>

        {/* 4 Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Upcoming Appointments"
            value={upcomingApts.length}
            icon={Calendar}
            color="teal"
            subtitle="Scheduled visits"
          />
          <StatCard
            title="Completed Consultations"
            value={completedApts.length}
            icon={CalendarCheck}
            color="emerald"
            subtitle="Past medical visits"
          />
          <StatCard
            title="Cancelled Appointments"
            value={cancelledApts.length}
            icon={AlertCircle}
            color="rose"
            subtitle="Archived slots"
          />
          <StatCard
            title="Medical Records"
            value={records.length}
            icon={FileText}
            color="sky"
            subtitle="Diagnostic histories"
          />
        </div>

        {/* 2-Column: Upcoming Appointments & Recent Records */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Upcoming Appointments */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                Loading appointments...
              </div>
            ) : upcomingApts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No upcoming consultations</p>
                <p className="text-[11px] text-slate-400">You have no pending visits scheduled.</p>
                <Link
                  to="/book-appointment"
                  className="inline-block mt-2 text-xs font-bold text-teal-600 hover:underline"
                >
                  Book an appointment now →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingApts.slice(0, 3).map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {apt.doctorId?.userId?.name || 'Doctor'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {apt.departmentId?.name || 'General OPD'} • {apt.appointmentDate} at {apt.timeSlot}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Health Tips & Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Daily Healthcare Tips
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Stay well hydrated with 2.5 - 3 liters of water per day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Aim for 30 minutes of moderate aerobic exercise 5 days a week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Schedule annual blood profile exams for preventive monitoring.</span>
                </li>
              </ul>
            </div>

            {/* Quick Contacts Card */}
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <h4 className="font-bold text-slate-900">Hospital Support Desk</h4>
              <p>HUMAC Najafgarh OPD Clinic: <strong>8383999066</strong></p>
              <p>Email: <a href="mailto:humacMedicalServices@gmail.com" className="text-teal-700">humacMedicalServices@gmail.com</a></p>
            </div>
          </div>
        </div>
      </main>

      <PrescriptionModal
        isOpen={Boolean(selectedPrescription)}
        onClose={() => setSelectedPrescription(null)}
        prescription={selectedPrescription}
      />
    </div>
  );
}
