import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Building2,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Booking form state
  const [selectedDept, setSelectedDept] = useState(searchParams.get('departmentId') || '');
  const [selectedDoctor, setSelectedDoctor] = useState(searchParams.get('doctorId') || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [patientDetails, setPatientDetails] = useState({
    fullName: user?.name || '',
    age: '',
    gender: 'Male',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [symptoms, setSymptoms] = useState('');

  // Fetch departments on load
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await API.get('/departments');
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  // Fetch doctors whenever department changes
  useEffect(() => {
    const fetchDocs = async () => {
      if (!selectedDept) {
        setDoctors([]);
        return;
      }
      try {
        const res = await API.get(`/doctors?department=${selectedDept}`);
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error('Failed to load doctors for department:', err);
      }
    };
    fetchDocs();
  }, [selectedDept]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setPatientDetails((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        phone: prev.phone || user.phone,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const activeDoctorObj = doctors.find((d) => d._id === selectedDoctor);
  const activeDeptObj = departments.find((d) => d._id === selectedDept);

  // Helper for generating next 7 available dates
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ iso, dayName, display });
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  const handleNext = () => {
    if (step === 1 && !selectedDept) {
      toast.warning('Please select a department to proceed');
      return;
    }
    if (step === 2 && !selectedDoctor) {
      toast.warning('Please choose a doctor');
      return;
    }
    if (step === 3 && !appointmentDate) {
      toast.warning('Please select an appointment date');
      return;
    }
    if (step === 4 && !timeSlot) {
      toast.warning('Please select a consultation time slot');
      return;
    }
    if (step === 5) {
      if (!patientDetails.fullName || !patientDetails.age || !patientDetails.phone || !symptoms) {
        toast.warning('Please fill in all required patient fields and symptoms');
        return;
      }
      if (!user) {
        toast.info('Please sign in or create an account to finalize your booking');
        navigate('/login', { state: { from: { pathname: '/book-appointment' } } });
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        doctorId: selectedDoctor,
        departmentId: selectedDept,
        appointmentDate,
        timeSlot,
        patientDetails: {
          ...patientDetails,
          age: Number(patientDetails.age),
        },
        symptoms,
      };

      const res = await API.post('/appointments', payload);
      if (res.data.success) {
        setConfirmedAppointment(res.data.appointment);
        setStep(6);
        toast.success('Appointment booked successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment. Time slot may be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Easy 6-Step Booking
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Book Doctor Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select department, choose your doctor, pick your slot, and confirm instantly.
        </p>
      </div>

      {/* Step Progress Tracker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] text-xs font-bold">
          {[
            { num: 1, label: 'Department' },
            { num: 2, label: 'Doctor' },
            { num: 3, label: 'Date' },
            { num: 4, label: 'Time Slot' },
            { num: 5, label: 'Patient Info' },
            { num: 6, label: 'Confirmed' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                  step === s.num
                    ? 'bg-teal-600 text-white shadow-md ring-4 ring-teal-50'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={step === s.num ? 'text-teal-900' : 'text-slate-500'}>
                {s.label}
              </span>
              {s.num < 6 && <div className="w-6 h-0.5 bg-slate-200 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl">
        {/* STEP 1: Select Department */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Medical Department</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <button
                  key={dept._id}
                  type="button"
                  onClick={() => {
                    setSelectedDept(dept._id);
                    setSelectedDoctor('');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedDept === dept._id
                      ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Building2
                    className={`w-6 h-6 mb-2 ${
                      selectedDept === dept._id ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  />
                  <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Select Doctor */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Choose Specialist Doctor</h3>
              <p className="text-xs text-slate-500">
                Department: <strong className="text-teal-700">{activeDeptObj?.name}</strong>
              </p>
            </div>

            {doctors.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No doctors currently listed for this department. Please choose another department.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <button
                    key={doc._id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc._id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                      selectedDoctor === doc._id
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={doc.userId?.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}
                      alt={doc.userId?.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{doc.userId?.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{doc.qualification}</p>
                      <div className="flex items-center justify-between mt-2 text-xs font-semibold">
                        <span className="text-teal-700">{doc.experience}+ Yrs Exp.</span>
                        <span className="text-slate-900">₹{doc.consultationFee}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Select Date */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 3: Select Appointment Date</h3>
              <p className="text-xs text-slate-500">
                Consulting with <strong className="text-teal-700">{activeDoctorObj?.userId?.name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {upcomingDates.map((item) => (
                <button
                  key={item.iso}
                  type="button"
                  onClick={() => setAppointmentDate(item.iso)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    appointmentDate === item.iso
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-teal-600" />
                  <span className="text-xs block font-bold">{item.display}</span>
                  <span className="text-[10px] text-slate-400 block">{item.dayName}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Or pick a custom date:</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Select Time Slot */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 4: Pick Consultation Time Slot</h3>
              <p className="text-xs text-slate-500">
                Selected Date: <strong className="text-teal-700">{appointmentDate}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeDoctorObj?.availableSlots?.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    timeSlot === slot
                      ? 'border-teal-600 bg-teal-600 text-white shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Patient Information & Review */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 5: Patient Details & Reason for Visit</h3>
              <p className="text-xs text-slate-500">Provide accurate patient information for clinical records.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  value={patientDetails.fullName}
                  onChange={(e) => setPatientDetails((p) => ({ ...p, fullName: e.target.value }))}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age *</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails((p) => ({ ...p, age: e.target.value }))}
                  required
                  placeholder="e.g. 28"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  value={patientDetails.gender}
                  onChange={(e) => setPatientDetails((p) => ({ ...p, gender: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  value={patientDetails.phone}
                  onChange={(e) => setPatientDetails((p) => ({ ...p, phone: e.target.value }))}
                  required
                  placeholder="9811223344"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Symptoms / Reason for Appointment *</label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                  placeholder="Please describe symptoms, duration, or previous diagnoses..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                ></textarea>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 text-xs space-y-2">
              <h4 className="font-bold text-teal-900">Appointment Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block">Department:</span>
                  <strong>{activeDeptObj?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Doctor:</span>
                  <strong>{activeDoctorObj?.userId?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Date & Slot:</span>
                  <strong>{appointmentDate} ({timeSlot})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Fee:</span>
                  <strong className="text-teal-800 text-sm">₹{activeDoctorObj?.consultationFee || 500}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation Screen */}
        {step === 6 && confirmedAppointment && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block font-mono text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                ID: {confirmedAppointment.appointmentId}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                Appointment Successfully Booked!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                Your consultation has been registered in the HUMAC Medical System. You will receive an SMS/email confirmation.
              </p>
            </div>

            <div className="bg-slate-50 max-w-md mx-auto p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{confirmedAppointment.doctorId?.userId?.name || 'Doctor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-900">{confirmedAppointment.appointmentDate} at {confirmedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600 uppercase">Pending Doctor Confirmation</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Clinic Location:</span>
                <span className="font-semibold text-slate-800">Najafgarh OPD Wing</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Link
                to="/patient/appointments"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                View in My Appointments
              </Link>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        {step < 6 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="flex items-center gap-1.5 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Confirming Appointment...' : 'Confirm & Save Appointment'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
