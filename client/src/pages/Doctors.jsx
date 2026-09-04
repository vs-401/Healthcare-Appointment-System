import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Stethoscope, SlidersHorizontal, UserCheck } from 'lucide-react';

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || '');
  const [selectedDay, setSelectedDay] = useState(searchParams.get('day') || '');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await API.get('/departments');
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedDept) params.append('department', selectedDept);
        if (selectedDay) params.append('day', selectedDay);

        const res = await API.get(`/doctors?${params.toString()}`);
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchQuery, selectedDept, selectedDay]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedDay('');
    setSearchParams({});
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Medical Faculty
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find & Consult Our Doctors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse our certified physicians and surgeons across 8 specialized medical wings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search doctor by name, qualification, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-xs sm:text-sm"
            />
          </div>

          {/* Department Selector */}
          <div className="sm:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-xs sm:text-sm text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day Selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-xs sm:text-sm text-slate-700"
            >
              <option value="">Any Available Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchQuery || selectedDept || selectedDay) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Showing filtered results ({doctors.length} doctors found)</span>
            <button
              onClick={handleResetFilters}
              className="font-bold text-teal-600 hover:text-teal-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Loading verified doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No doctors matched your filter criteria. Try searching for a different specialty or clearing filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
