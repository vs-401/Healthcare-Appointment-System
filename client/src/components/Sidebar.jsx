import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  UserCheck,
  Users,
  FileText,
  ClipboardList,
  User,
  LogOut,
  Building2,
  MessageSquare,
  Clock
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/admin/appointments', icon: CalendarCheck },
        { name: 'Doctors', path: '/admin/doctors', icon: UserCheck },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
        { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (user.role === 'doctor') {
      return [
        { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/doctor/appointments', icon: CalendarCheck },
        { name: 'Availability', path: '/doctor/availability', icon: Clock },
        { name: 'Patients', path: '/doctor/patients', icon: Users },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    return [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Book Appointment', path: '/book-appointment', icon: Calendar },
      { name: 'My Appointments', path: '/patient/appointments', icon: CalendarCheck },
      { name: 'Doctors', path: '/doctors', icon: UserCheck },
      { name: 'Medical Records', path: '/patient/records', icon: FileText },
      { name: 'Prescriptions', path: '/patient/prescriptions', icon: ClipboardList },
      { name: 'Profile', path: '/profile', icon: User },
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
            <span className="inline-block text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
              {user?.role} Portal
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
