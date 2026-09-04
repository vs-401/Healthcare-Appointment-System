import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import MedicalRecordModal from '../components/MedicalRecordModal';
import { FileText, Calendar, User, Eye, Stethoscope } from 'lucide-react';

export default function PatientRecords() {
  const { user } = useAuth();
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await API.get(`/medical-records/patient/${user?._id || user?.id}`);
        setRecords(res.data.records || []);
      } catch (err) {
        toast.error('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRecords();
  }, [user]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Records & History</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your clinical consultations, symptoms, diagnoses, and medical summaries
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No medical records found</h3>
            <p className="text-xs text-slate-400">Clinical records will appear here after your doctor consultations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-teal-700">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(rec.appointmentDate || rec.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {rec.appointmentId?.appointmentId || 'Consultation'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Diagnosis
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{rec.diagnosis}</h4>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-medium">Attending Doctor:</span>
                    <span className="font-bold text-slate-800">{rec.doctorId?.userId?.name || 'Dr. Specialist'}</span>
                    <span className="text-[11px] text-slate-400 block">{rec.doctorId?.department?.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Clinical Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MedicalRecordModal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </div>
  );
}
