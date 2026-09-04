import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import {
  Star,
  Award,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  HeartPulse
} from 'lucide-react';

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await API.get(`/doctors/${id}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error('Failed to fetch doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Doctor Not Found</h2>
        <Link to="/doctors" className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  const user = doctor.userId || {};
  const dept = doctor.department || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700">
        <ArrowLeft className="w-4 h-4" />
        Back to All Doctors
      </Link>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Image */}
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div className="w-44 h-44 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
            <img
              src={user.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{doctor.rating || 4.9}</span>
            <span className="text-slate-400 font-normal text-xs">({doctor.ratingCount || 25} patient reviews)</span>
          </div>

          <div className="mt-6 w-full p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-left space-y-2">
            <div className="text-xs text-slate-500 font-semibold">Consultation Fee</div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-baseline">
              ₹{doctor.consultationFee}
              <span className="text-xs font-normal text-slate-500 ml-1">/ visit</span>
            </div>
            <Link
              to={`/book-appointment?doctorId=${doctor._id}&departmentId=${dept._id || ''}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all mt-2"
            >
              <Calendar className="w-4 h-4" />
              Book Consultation
            </Link>
          </div>
        </div>

        {/* Right: Details & Bio */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2">
              {dept.name || 'Medical Department'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user.name}
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-1">{doctor.qualification}</p>
            <p className="text-xs text-teal-700 font-bold mt-0.5">{doctor.specialization}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-semibold">Experience</span>
              <span className="text-sm font-bold text-slate-900">{doctor.experience}+ Years</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-semibold">Verification</span>
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block font-semibold">Facility</span>
              <span className="text-sm font-bold text-slate-900">Najafgarh OPD</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Doctor Biography & Expertise
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {doctor.bio || 'Compassionate healthcare professional dedicated to clinical excellence and patient recovery.'}
            </p>
          </div>

          {/* Available Days */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              OPD Consultation Schedule
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.availableDays?.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Standard Daily Time Slots
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.availableSlots?.map((slot) => (
                <span
                  key={slot}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
