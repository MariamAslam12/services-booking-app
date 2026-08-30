import React from "react";
import { Sparkles, Search, AlertCircle, CheckCircle2 } from "lucide-react";

export const AiSearchBar = ({ searchQuery, setSearchQuery, aiResult }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400 flex items-center space-x-1">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Describe your problem (e.g. 'Water is leaking from pipe urgently')..."
          className="w-full pl-12 pr-10 py-4 text-sm glass-input rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xl"
        />

        <div className="absolute right-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* AI Intelligence Feedback Bar */}
      {searchQuery.trim().length >= 3 && aiResult && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Category matched:{" "}
              <strong className="text-indigo-300">
                {aiResult.category || "All Matching Categories"}
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-200">
            <AlertCircle
              className={`w-4 h-4 ${
                aiResult.urgency === "Emergency / Immediate"
                  ? "text-rose-400"
                  : aiResult.urgency === "High"
                  ? "text-amber-400"
                  : "text-slate-400"
              }`}
            />
            <span>
              Detected Urgency:{" "}
              <span
                className={`font-semibold ${
                  aiResult.urgency === "Emergency / Immediate"
                    ? "text-rose-400"
                    : aiResult.urgency === "High"
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
              >
                {aiResult.urgency}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};