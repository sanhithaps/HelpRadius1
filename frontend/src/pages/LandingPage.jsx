import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldCheck,
  Radio,
  Clock,
  HeartHandshake,
  Users,
  Compass,
  PhoneCall,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function LandingPage({ onOpenSOS }) {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-rose-50/70 via-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            Location-Based Emergency & Community Help
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Help within your radius,{' '}
            <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
              right when you need it.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect instantaneously with nearby verified first-responders and helpful community volunteers through GPS geofencing, automatic radius expansion, and private communication.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenSOS}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>Launch Emergency SOS</span>
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow flex items-center justify-center gap-2 transition-all"
            >
              <span>Register with Your Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>

          {/* Quick Emergency Hotline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>National Emergency: Dial <strong>112</strong> immediately in severe life-threatening crises</span>
          </div>
        </div>
      </section>

      {/* The 3 Core Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Three Tailored Assistance Categories
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Engineered with unique priority algorithms, radius growth rates, and safety verification filters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Emergency SOS */}
          <div className="bg-gradient-to-b from-rose-50/50 to-white p-6 rounded-3xl border-2 border-rose-300 shadow-lg space-y-4 hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                Highest Priority
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Emergency SOS</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Accidents, personal safety harassment, physical danger. Rapid radius expansion (2km → 20km). Saved emergency contacts alerted in parallel regardless of distance.
              </p>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Verified safety-certified helpers only</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>100% Free & unconditional assistance</span>
              </li>
            </ul>
          </div>

          {/* Card 2: General Immediate Help */}
          <div className="bg-gradient-to-b from-amber-50/40 to-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Immediate Community
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">General Immediate Help</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Punctured tyre, stranded vehicle, heavy lifting, jumpstart, groceries. Gradual radius expansion with transparent distance compensation.
              </p>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Transparent travel compensation (₹8/km)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Photo and voice note attachments</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Scheduled Help */}
          <div className="bg-gradient-to-b from-indigo-50/40 to-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                Planned Assistance
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Scheduled Help</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Hospital appointment companion, elderly shopping assistant, moving luggage. Plan ahead with clear lead times, reschedule and cancel flexibility.
              </p>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span>Date & meeting point scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span>Reschedule & cancel capabilities</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Safety & Privacy Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Security & Privacy First
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Built with zero-compromise personal privacy
            </h2>
            <p className="text-sm text-slate-400">
              Personal safety requires strict boundaries. Help Radius protects your identity at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-sm">No Phone Numbers Shared</h4>
              <p className="text-xs text-slate-400">
                In-app private messaging and WebRTC voice calls keep your actual phone number completely confidential.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Radio className="w-6 h-6 text-rose-400" />
              <h4 className="font-bold text-sm">Temporary Live Tracking</h4>
              <p className="text-xs text-slate-400">
                GPS location is shared exclusively while an assistance request is active, and locks immediately upon completion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Users className="w-6 h-6 text-blue-400" />
              <h4 className="font-bold text-sm">Admin-Verified Helpers</h4>
              <p className="text-xs text-slate-400">
                High-priority personal safety emergency requests are routed strictly to verified first-responder volunteers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
