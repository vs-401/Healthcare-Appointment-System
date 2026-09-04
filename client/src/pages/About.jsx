import React from 'react';
import { HeartPulse, Award, Shield, MapPin, Phone, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-16 pb-20">
      <div className="bg-gradient-to-b from-teal-50/70 via-white to-slate-50 py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            About HUMAC Medical Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Compassionate Care, Better Health
          </h1>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            HUMAC Medical Service is a state-of-the-art multi-specialty healthcare institution committed to clinical excellence, patient dignity, and modern healthcare accessibility.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To deliver patient-centric medical consultations with transparency, empathy, and advanced medical expertise.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To be the most trusted community healthcare service provider in South-West Delhi.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Clinical Quality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict adherence to clinical hygiene protocols and qualified medical practitioners in all departments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                HUMAC Medical Service Campus
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our main clinical facility is strategically located at Gopal Nagar, Najafgarh, offering full OPD wings, pediatric facilities, automated biochemistry diagnostics, and pharmacy counters.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>No-141, Gopal Nagar, Najafgarh, South-west Delhi-110043</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>8383999066, 9310813776</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>humacMedicalServices@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                alt="Hospital Reception"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
