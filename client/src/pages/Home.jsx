import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DoctorCard from '../components/DoctorCard';
import {
  Calendar,
  Award,
  Clock,
  HeartPulse,
  CheckCircle2,
  Shield,
  Stethoscope,
  Activity,
  Brain,
  Baby,
  Sparkles,
  TestTube,
  Pill,
  ArrowRight,
  Quote
} from 'lucide-react';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          API.get('/departments'),
          API.get('/doctors?isFeatured=true'),
        ]);
        setDepartments(deptRes.data.departments || []);
        setFeaturedDoctors(docRes.data.doctors?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    fetchData();
  }, []);

  const deptIcons = {
    Stethoscope,
    HeartPulse,
    Activity,
    Brain,
    Baby,
    Sparkles,
    TestTube,
    Pill,
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                Trusted Healthcare Partner in Delhi NCR
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Compassionate Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500">
                  Better Health
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                HUMAC Medical Service is committed to providing quality healthcare with compassion and excellence. Book verified doctor appointments online effortlessly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/book-appointment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-colors text-sm"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Expert Doctors</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Board-certified MD/DM clinical specialists</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Advanced Care</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Modern diagnostic labs & treatments</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">24/7 Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Round-the-clock emergency assistance</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                  alt="Medical team"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">HUMAC Najafgarh Clinic</p>
                      <p className="text-[11px] text-slate-500">No-141, Gopal Nagar, Delhi</p>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        OPD Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Departments Grid Section */}
      <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Our Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Medical Departments
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Explore our specialized clinical wings equipped with modern diagnostic facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = deptIcons[dept.icon] || Stethoscope;
            return (
              <div
                key={dept._id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {dept.doctorCount || 0} Doctor{dept.doctorCount === 1 ? '' : 's'}
                  </span>
                  <Link
                    to={`/doctors?department=${encodeURIComponent(dept.name)}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    View Doctors
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Meet Our Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Featured Doctors
            </h2>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            View All Doctors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </div>
      </section>

      {/* 4. Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            What Our Patients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative flex flex-col justify-between">
            <div>
              <Quote className="w-8 h-8 text-teal-500/20 mb-3" />
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Dr. Sarah Johnson was extremely polite and understood my chronic fever issues. Booking through the online portal took only 30 seconds."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                RS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Rahul Sharma</h4>
                <p className="text-[11px] text-slate-400">Najafgarh, New Delhi</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative flex flex-col justify-between">
            <div>
              <Quote className="w-8 h-8 text-teal-500/20 mb-3" />
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "The pediatric care for my 4-year-old child was flawless. Dr. Priya made the vaccination totally stress-free. Very clean hospital facility!"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                SP
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sneha Patel</h4>
                <p className="text-[11px] text-slate-400">Dwarka, New Delhi</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative flex flex-col justify-between">
            <div>
              <Quote className="w-8 h-8 text-teal-500/20 mb-3" />
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Dr. Rajesh Verma's cardiology advice helped stabilize my mother's blood pressure. Having all past digital prescriptions in the patient dashboard is fantastic."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Amit Kumar</h4>
                <p className="text-[11px] text-slate-400">Janakpuri, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Book Your Health Consultation?
            </h3>
            <p className="text-teal-100 text-sm max-w-xl">
              Choose your doctor, select a convenient time slot, and receive instant confirmation.
            </p>
          </div>
          <Link
            to="/book-appointment"
            className="shrink-0 px-8 py-4 rounded-2xl bg-white text-teal-900 font-bold text-sm shadow-lg hover:bg-teal-50 hover:scale-105 transition-all"
          >
            Book Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
}
