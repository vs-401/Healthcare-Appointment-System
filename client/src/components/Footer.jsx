import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, MapPin, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                HUMAC<span className="text-teal-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              HUMAC Medical Service is committed to providing compassionate, top-tier healthcare with excellence and ease of online appointment booking.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              Certified Medical Excellence
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Specialist Doctors</Link></li>
              <li><Link to="/book-appointment" className="hover:text-teal-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact & Directions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Key Departments</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">General Medicine</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Cardiology</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Orthopedics</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Neurology</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Pediatrics & Dermatology</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact Info</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>No-141, Gopal Nagar, Najafgarh, South-west Delhi-110043</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <span>8383999066, 9310813776</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="mailto:humacMedicalServices@gmail.com" className="hover:text-teal-400 transition-colors">
                humacMedicalServices@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-teal-400 shrink-0" />
              <span>OPD: Mon - Sat (8:00 AM - 8:00 PM)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} HUMAC Medical Service. All rights reserved.</p>
          <p>College Summer Internship Web Development Project</p>
        </div>
      </div>
    </footer>
  );
}
