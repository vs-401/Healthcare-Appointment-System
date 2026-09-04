import React, { useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        toast.success('Message sent! Our team will contact you shortly.');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-gradient-to-b from-teal-50/70 via-white to-slate-50 py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Contact HUMAC Medical Service
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Have questions about doctor availability or treatments? Send us a message or call our support desk.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Hospital Information</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Clinic Address</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      HUMAC Medical Service<br />
                      No-141, Gopal Nagar, Najafgarh,<br />
                      South-west Delhi-110043
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Phone Numbers</h4>
                    <p className="text-slate-600 mt-0.5">
                      8383999066, 9310813776
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Address</h4>
                    <a
                      href="mailto:humacMedicalServices@gmail.com"
                      className="text-teal-600 hover:text-teal-700 mt-0.5 block"
                    >
                      humacMedicalServices@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">OPD Timings</h4>
                    <p className="text-slate-600 mt-0.5">
                      Mon – Sat: 8:00 AM – 8:00 PM<br />
                      Sun: Emergency Care
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-center space-y-2">
              <MapPin className="w-8 h-8 text-teal-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">Najafgarh, South-West Delhi</h4>
              <p className="text-xs text-slate-500">
                Easily accessible via Najafgarh Metro Station & Main Bus Stand
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Send Us a Direct Message</h3>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Message Received!</h4>
                  <p className="text-xs text-emerald-700">
                    Thank you for contacting HUMAC Medical Service. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-semibold border border-emerald-300"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g. rajesh@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9811223344"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="e.g. General OPD Inquiry"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message Content *</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please write your inquiry here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md transition-all disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
