import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Radio,
  FileText,
  Sliders,
  Clock,
  IndianRupee,
  Search,
  Check,
  Ban
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'verifications' | 'users' | 'reports' | 'config' | 'audit'
  const [metrics, setMetrics] = useState(null);
  const [helpers, setHelpers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [mRes, hRes, uRes, rRes, cRes, aRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/helpers'),
        api.get('/admin/users'),
        api.get('/admin/reports'),
        api.get('/admin/config'),
        api.get('/admin/audit-logs')
      ]);
      setMetrics(mRes.data.metrics);
      setHelpers(hRes.data.helpers || []);
      setUsersList(uRes.data.users || []);
      setReports(rRes.data.reports || []);
      setConfigData(cRes.data);
      setAuditLogs(aRes.data.logs || []);
    } catch (err) {
      console.warn('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateHelper = async (helperId, status, safetyEligible) => {
    const notes = prompt(`Enter review notes for helper (${status}):`, 'Verified credentials for emergency assistance.');
    if (notes === null) return;

    try {
      await api.patch(`/admin/helpers/${helperId}`, {
        status,
        safetyEligible,
        notes
      });
      alert(`Helper status updated to ${status}.`);
      fetchAdminData();
    } catch (e) {
      alert('Could not update helper.');
    }
  };

  const handleToggleSuspendUser = async (userId, currentSuspended) => {
    try {
      await api.patch(`/admin/users/${userId}/suspend`, {
        suspended: !currentSuspended,
        reason: 'Administrative moderation review'
      });
      fetchAdminData();
    } catch (e) {
      alert('Could not update user state.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500">
          Switch to the Admin account using the Demo switcher in the top navigation bar to test admin controls.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Moderation & Dispatch Center</span>
          </div>
          <h1 className="text-2xl font-black mt-2">Platform Administration</h1>
          <p className="text-xs text-slate-400">
            Manage helper verifications, user safety policies, dynamic radius steps, and audit trails.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Metrics Overview' },
          { id: 'verifications', label: `Helper Verifications (${helpers.filter(h => h.status === 'pending').length} pending)` },
          { id: 'users', label: 'Users Moderation' },
          { id: 'reports', label: `Safety Reports (${reports.filter(r => r.status === 'pending').length})` },
          { id: 'config', label: 'System Configuration' },
          { id: 'audit', label: 'Audit Log' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
              <div className="text-2xl font-black text-slate-900">{metrics.totalUsers}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Active in system</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Approved Helpers</span>
              <div className="text-2xl font-black text-emerald-600">{metrics.approvedHelpers}</div>
              <span className="text-[11px] text-purple-700 font-semibold">{metrics.safetyEligibleCount} Safety Certified</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Pending Verifications</span>
              <div className="text-2xl font-black text-amber-600">{metrics.pendingHelpers}</div>
              <span className="text-[11px] text-amber-700 font-semibold">Requires review</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Emergencies</span>
              <div className="text-2xl font-black text-rose-600">{metrics.activeRequests?.emergency || 0}</div>
              <span className="text-[11px] text-slate-500">{metrics.activeRequests?.total || 0} total active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HELPER VERIFICATION WORKFLOW */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Volunteer Helper Applications</h3>
          <div className="divide-y divide-slate-100">
            {helpers.map(h => (
              <div key={h.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border">
                    <img src={h.avatar} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{h.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        h.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.status}
                      </span>
                      {h.safetyEligible && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                          Safety Certified ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Doc: {h.verification?.simulatedIdType || 'Government ID'} • Categories: {h.categories?.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateHelper(h.id, 'approved', true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                  >
                    Approve + Safety Certify
                  </button>
                  <button
                    onClick={() => handleUpdateHelper(h.id, 'approved', false)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    Approve General Only
                  </button>
                  <button
                    onClick={() => handleUpdateHelper(h.id, 'rejected', false)}
                    className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MODERATION */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Registered Platform Users</h3>
          <div className="divide-y divide-slate-100">
            {usersList.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">{u.name}</span>
                  <span className="text-slate-500">{u.email} • {u.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold uppercase text-[10px]">
                    {u.role}
                  </span>
                  <button
                    onClick={() => handleToggleSuspendUser(u.id, u.suspended)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                      u.suspended ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {u.suspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM CONFIGURATION (Radius & Pricing) */}
      {activeTab === 'config' && configData && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Dynamic Platform Parameters</h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-800 block text-sm">Radius Expansion Steps (km):</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border">
                <span className="font-bold text-rose-600 block">Emergency SOS:</span>
                <span>{configData.radiusConfig?.emergency?.stepsKm?.join(' → ')} km</span>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <span className="font-bold text-amber-600 block">General Help:</span>
                <span>{configData.radiusConfig?.general?.stepsKm?.join(' → ')} km</span>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <span className="font-bold text-indigo-600 block">Scheduled Help:</span>
                <span>{configData.radiusConfig?.scheduled?.stepsKm?.join(' → ')} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="text-base font-bold text-slate-900">Administrative Audit Trail</h3>
          <div className="space-y-2 font-mono">
            {auditLogs.slice(0, 20).map((log, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span><strong>[{log.action}]</strong> by {log.actorId}</span>
                <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
