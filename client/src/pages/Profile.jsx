import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('details');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', profileData);
      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const res = await API.put('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPassData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Profile & Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal profile details and security settings
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'details'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'security'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Change Password
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft">
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xl shrink-0">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{user?.name}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                    Role: {user?.role}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={profileData.profileImage}
                  onChange={(e) => setProfileData((p) => ({ ...p, profileImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft">
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm max-w-md">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passData.confirmNewPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
