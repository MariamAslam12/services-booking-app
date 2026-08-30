import React, { useState, useEffect } from "react";
import { getStoredBookings, updateBookingStatus, saveBooking } from "../utils/storage";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Filter } from "lucide-react";

const DEFAULT_PROVIDER_ORDERS = [
  {
    id: "req_demo_1",
    customerName: "Mariam Khan",
    category: "Electrical",
    urgency: "Emergency / Immediate",
    notes: "Short circuit in the main circuit breaker. Power is completely out.",
    date: "2026-08-30",
    time: "14:00",
    status: "In Progress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "req_demo_2",
    customerName: "David Miller",
    category: "Plumbing",
    urgency: "High",
    notes: "Kitchen sink pipe burst and leaking onto floor.",
    date: "2026-08-30",
    time: "15:30",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "req_demo_3",
    customerName: "Sarah Jenkins",
    category: "Carpentry",
    urgency: "Normal",
    notes: "Repair wooden door alignment and fix loose hinges.",
    date: "2026-08-29",
    time: "11:00",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
];

export const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedUrgency, setSelectedUrgency] = useState("All");

  useEffect(() => {
    const stored = getStoredBookings() || [];
    
    // Filter out default orders if they already exist in stored data to avoid duplicate IDs
    const customStored = stored.filter(
      (s) => !DEFAULT_PROVIDER_ORDERS.some((d) => d.id === s.id)
    );

    // Combine custom customer bookings with default orders
    const combined = [...customStored, ...DEFAULT_PROVIDER_ORDERS];
    setBookings(combined);
  }, []);

  const handleStatusChange = (bookingId, newStatus) => {
    const isDefaultItem = DEFAULT_PROVIDER_ORDERS.some((item) => item.id === bookingId);

    if (isDefaultItem) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } else {
      const updated = updateBookingStatus(bookingId, newStatus);
      // Re-merge updated local storage items with default items
      const customStored = updated.filter(
        (s) => !DEFAULT_PROVIDER_ORDERS.some((d) => d.id === s.id)
      );
      setBookings([...customStored, ...DEFAULT_PROVIDER_ORDERS]);
    }
  };

  const filteredBookings =
    selectedUrgency === "All"
      ? bookings
      : bookings.filter((item) => item.urgency === selectedUrgency);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active service jobs, respond to emergency requests, and mark work completed.
          </p>
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 border border-slate-800 rounded-xl overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          {["All", "Emergency / Immediate", "High", "Normal"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedUrgency(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedUrgency === level
                  ? level === "Emergency / Immediate"
                    ? "bg-rose-600 text-white"
                    : level === "High"
                    ? "bg-amber-600 text-white"
                    : "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-sm">
            No service requests match the selected filter.
          </div>
        ) : (
          filteredBookings.map((item) => (
            <div
              key={item.id}
              className={`p-5 glass-card rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
                item.urgency === "Emergency / Immediate"
                  ? "border-rose-500/40 bg-rose-950/10"
                  : item.urgency === "High"
                  ? "border-amber-500/30"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-base">
                    {item.customerName || "Customer"}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.category || "General"}
                  </span>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      item.urgency === "Emergency / Immediate"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                        : item.urgency === "High"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {item.urgency || "Normal"}
                  </span>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      item.status === "In Progress"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : item.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    Status: {item.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300">
                  {item.notes || item.issueDescription || "No notes provided."}
                </p>

                {item.date && (
                  <p className="text-xs text-slate-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Scheduled: {item.date} at {item.time}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === "Pending" && (
                  <button
                    onClick={() => handleStatusChange(item.id, "In Progress")}
                    className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                  >
                    <PlayCircle className="w-4 h-4 mr-1.5" />
                    Accept & Start Job
                  </button>
                )}

                {item.status === "In Progress" && (
                  <button
                    onClick={() => handleStatusChange(item.id, "Completed")}
                    className="flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Mark Job Completed
                  </button>
                )}

                {item.status === "Completed" && (
                  <span className="flex items-center text-xs font-semibold px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Job Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};