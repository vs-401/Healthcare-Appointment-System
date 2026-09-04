import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Users, Search, UserCheck, UserX, Calendar, FileText, Eye, X } from 'lucide-react';

export default function AdminPatients() {
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/patients?${search ? `search=${search}` : ''}`);
      setPatients(res.data.patients || []);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleToggleStatus = async (patientId) => {
    try {
      const res = await API.put(`/patients/${patientId}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchPatients();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleViewPatientDetails = async (patient) => {
    setSelectedPatient(patient);
    try {
      const res = await API.get(`/patients/${patient._id}`);
      setPatientDetails(res.data);
    } catch (err) {
      toast.error('Failed to fetch patient history');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Directory & Records</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View registered patients, inspect appointment histories, and manage account statuses
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Appointments</th>
                  <th className="p-4">Medical Records</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                        {p.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[11px] text-slate-400">{p.email}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{p.phone}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                        {p.appointmentCount || 0} visits
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold">
                        {p.recordCount || 0} records
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={p.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewPatientDetails(p)}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        View History
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p._id)}
                        className={`px-3 py-1 rounded-xl font-bold text-xs ${
                          p.isActive
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {p.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Patient History Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl border border-slate-100 my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}'s History</h3>
                <p className="text-xs text-slate-500">{selectedPatient.email} • {selectedPatient.phone}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientDetails(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                Appointment History ({patientDetails?.appointments?.length || 0})
              </h4>
              <div className="space-y-2">
                {patientDetails?.appointments?.map((a) => (
                  <div key={a._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{a.doctorId?.userId?.name}</span>
                      <p className="text-[11px] text-slate-500">{a.appointmentDate} at {a.timeSlot}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientDetails(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
