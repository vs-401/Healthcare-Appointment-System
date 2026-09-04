import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  Users,
  UserCheck,
  Calendar,
  CalendarCheck,
  Building2,
  MessageSquare,
  IndianRupee,
  Activity,
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/analytics'),
        ]);
        setStats(statsRes.data.stats);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Hospital Master Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HUMAC Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Real-time monitoring of patients, doctors, appointments, departments, and consultation metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/doctors"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all"
            >
              + Add Doctor
            </Link>
            <Link
              to="/admin/departments"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              Departments
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            icon={Users}
            color="teal"
          />
          <StatCard
            title="Active Doctors"
            value={stats?.totalDoctors || 0}
            icon={UserCheck}
            color="sky"
          />
          <StatCard
            title="All Appointments"
            value={stats?.totalAppointments || 0}
            icon={Calendar}
            color="indigo"
          />
          <StatCard
            title="Today's Visits"
            value={stats?.todayAppointments || 0}
            icon={Activity}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={stats?.completedAppointments || 0}
            icon={CalendarCheck}
            color="emerald"
          />
          <StatCard
            title="Est. OPD Revenue"
            value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={IndianRupee}
            color="teal"
          />
        </div>

        {/* Charts & Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Department Breakdown Bar Graph */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Appointments by Department
              </h3>
              <span className="text-xs font-semibold text-slate-400">Distribution</span>
            </div>

            <div className="space-y-3 pt-2">
              {analytics?.departmentBreakdown?.map((item) => {
                const max = Math.max(...(analytics.departmentBreakdown.map((d) => d.count) || [1]), 1);
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span className="text-teal-700 font-bold">{item.count} appointments</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 6)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Registrations & Appointments */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Recent Appointments</h3>
                <Link to="/admin/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  View All →
                </Link>
              </div>

              <div className="space-y-2.5">
                {analytics?.recentAppointments?.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{apt.patientDetails?.fullName || apt.patientId?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {apt.doctorId?.userId?.name} • {apt.appointmentDate}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
