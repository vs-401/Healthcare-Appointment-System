import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import { Clock, Calendar, Save, CheckCircle2 } from 'lucide-react';

export default function DoctorAvailability() {
  const { user } = useAuth();
  const toast = useToast();

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data.user?.doctor) {
          setDoctorProfile(res.data.user.doctor);
          setAvailableDays(res.data.user.doctor.availableDays || []);
          setAvailableSlots(res.data.user.doctor.availableSlots || []);
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, []);

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = (slot) => {
    setAvailableSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    if (!doctorProfile) return;
    setSaving(true);
    try {
      const res = await API.put(`/doctors/${doctorProfile._id}/availability`, {
        availableDays,
        availableSlots,
      });
      if (res.data.success) {
        toast.success('Availability schedule updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Availability Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Set your working OPD days and time slots for online patient booking
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading schedule...</div>
        ) : (
          <div className="space-y-6">
            {/* Working Days Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Working Days of the Week
              </h3>
              <p className="text-xs text-slate-500">Click to enable or disable days you are available at HUMAC OPD.</p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {allDays.map((day) => {
                  const isSelected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Available Consultation Time Slots
              </h3>
              <p className="text-xs text-slate-500">Select consultation time slots patients can book with you.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {allSlots.map((slot) => {
                  const isSelected = availableSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Schedule Changes'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
