import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartPulse, Mail, Lock, LogIn, ArrowRight, Shield, User, Stethoscope } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (data.user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to HUMAC
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your appointments, medical records, and prescriptions
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Box for Testing */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@humac.com', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 text-center transition-colors text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dr.sarah@humac.com', 'Doctor@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 text-center transition-colors text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('rahul.sharma@example.com', 'Patient@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 text-center transition-colors text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                Patient
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
