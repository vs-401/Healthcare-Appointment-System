import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Award } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  const user = doctor.userId || {};
  const dept = doctor.department || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="relative p-5 pb-0 flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-100 shadow-sm">
            <img
              src={user.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-1">
              {dept.name || 'Specialist'}
            </span>
            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">{doctor.qualification}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                {doctor.rating || 4.9}
              </div>
              <span className="text-xs text-slate-400">({doctor.ratingCount || 25} reviews)</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-2 text-xs text-slate-600">
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {doctor.bio || 'Compassionate healthcare professional providing specialized medical treatment.'}
          </p>

          <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>{doctor.experience}+ Years Exp.</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900 font-bold justify-end">
              <span>₹{doctor.consultationFee}</span>
              <span className="text-[10px] text-slate-400 font-normal">/ Visit</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-[11px] text-slate-600 font-medium truncate">
              {doctor.availableDays?.slice(0, 3).join(', ')}...
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <Link
          to={`/doctors/${doctor._id}`}
          className="px-3 py-2 rounded-xl text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          View Profile
        </Link>
        <Link
          to={`/book-appointment?doctorId=${doctor._id}&departmentId=${dept._id || ''}`}
          className="px-3 py-2 rounded-xl text-center text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
