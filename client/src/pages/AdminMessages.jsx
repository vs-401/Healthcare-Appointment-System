import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminMessages() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingMsg, setDeletingMsg] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/contact${statusFilter ? `?status=${statusFilter}` : ''}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleUpdateStatus = async (msgId, status) => {
    try {
      const res = await API.put(`/contact/${msgId}`, { status });
      if (res.data.success) {
        toast.success(`Message marked as ${status}`);
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to update message status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMsg) return;
    try {
      const res = await API.delete(`/contact/${deletingMsg._id}`);
      if (res.data.success) {
        toast.success('Message deleted');
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient & Public Inquiries</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review inquiries submitted through the official HUMAC contact form
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
            {['', 'unread', 'read', 'replied'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === '' ? 'All Messages' : st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No contact messages</h3>
            <p className="text-xs text-slate-400">No messages found matching current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{msg.name}</h4>
                      <p className="text-xs text-slate-400">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</p>
                    </div>
                    <StatusBadge status={msg.status} />
                  </div>

                  <div className="text-xs font-bold text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-100">
                    Subject: {msg.subject}
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                    "{msg.message}"
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {msg.status !== 'replied' && (
                      <button
                        onClick={() => handleUpdateStatus(msg._id, 'replied')}
                        className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                      >
                        Mark Replied
                      </button>
                    )}
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => handleUpdateStatus(msg._id, 'read')}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setDeletingMsg(msg)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={Boolean(deletingMsg)}
        onClose={() => setDeletingMsg(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message record?"
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
}
