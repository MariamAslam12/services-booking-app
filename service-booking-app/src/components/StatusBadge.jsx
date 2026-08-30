import React from "react";

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "In Progress": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {status}
    </span>
  );
};