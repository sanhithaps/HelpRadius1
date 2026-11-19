import React from 'react';
import { IndianRupee, Info, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PricingBreakdownCard({ breakdown, title = 'Assistance Compensation Breakdown' }) {
  if (!breakdown) return null;

  const isEmergency = breakdown.type === 'emergency';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          {title}
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          Prototype Estimate
        </span>
      </div>

      {isEmergency ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Emergency Help is Free & Unconditional</span>
          </div>
          <p className="text-[11px] text-rose-800">
            Supported by Help Radius. Emergency dispatch and helper radius expansion carry ₹0 mandatory fee. Assistance is never delayed or blocked by payments.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          {/* 1. Platform Expansion Fee */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Platform Radius Expansion Fee:</span>
              <span className="text-[10px] text-slate-400 font-mono">(Search radius wider)</span>
            </span>
            <span className="font-semibold text-slate-800">
              ₹{breakdown.platformExpansionFee || 0}
            </span>
          </div>

          {/* 2. Helper Travel Compensation */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Helper Travel Compensation:</span>
              <span className="text-[10px] text-slate-400 font-mono">(Direct to helper for fuel/travel)</span>
            </span>
            <span className="font-semibold text-slate-800">
              ₹{breakdown.travelCompensation || 0}
            </span>
          </div>

          {/* 3. Voluntary Reward */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Voluntary Reward / Tip:</span>
              <span className="text-[10px] text-slate-400 font-mono">(Optional token of gratitude)</span>
            </span>
            <span className="font-semibold text-emerald-700">
              ₹{breakdown.voluntaryReward || 0}
            </span>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-slate-900">
            <span>Estimated Total:</span>
            <span className="text-base text-slate-900">
              ₹{breakdown.total || 0}
            </span>
          </div>
        </div>
      )}

      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg flex items-start gap-1.5 border border-slate-100">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>
          {breakdown.disclaimer || 'Values are transparent estimates for demonstration. No real bank deductions in prototype mode.'}
        </span>
      </div>
    </div>
  );
}
