import React, { useState } from "react";
import { saveBooking } from "../utils/storage";
import { X, AlertCircle, Zap, Clock } from "lucide-react";

export const BookingModal = ({ isOpen, onClose, provider }) => {
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  // Dynamically resolve logged-in user name/email
  const getCurrentUserIdentity = () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed.name || parsed.email || "Mariam";
      }
    } catch (err) {
      console.error("Failed to parse currentUser from storage", err);
    }
    return "Mariam";
  };

  const urgencyOptions = [
    {
      id: "Normal",
      label: "Normal",
      badge: "Standard Schedule",
      color: "border-slate-700 bg-slate-800/50 text-slate-300",
      activeColor: "border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-indigo-500/20",
      icon: Clock,
    },
    {
      id: "High",
      label: "High / Urgent",
      badge: "Fast Attention Needed",
      color: "border-slate-700 bg-slate-800/50 text-slate-300",
      activeColor: "border-amber-500 bg-amber-500/20 text-amber-300 shadow-amber-500/20",
      icon: AlertCircle,
    },
    {
      id: "Emergency / Immediate",
      label: "Emergency",
      badge: "Immediate Action Required",
      color: "border-slate-700 bg-slate-800/50 text-slate-300",
      activeColor: "border-rose-500 bg-rose-500/20 text-rose-300 shadow-rose-500/20 ring-2 ring-rose-500/40",
      icon: Zap,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerIdentity = getCurrentUserIdentity();
    const userNotes = description.trim() || "Service request submitted by customer.";

    saveBooking({
      providerId: provider?.id || null,
      providerName: provider?.name || "Unassigned Specialist",
      customerName: customerIdentity, // Attaches request to logged-in user account
      category: provider?.category || "General",
      urgency: urgency, // Stores 'Emergency / Immediate', 'High', or 'Normal'
      notes: userNotes,
      description: userNotes,
      issueDescription: userNotes,
      date: date,
      time: time,
      status: "Pending",
    });

    setDescription("");
    setDate("");
    setTime("");
    onClose();
    alert(`Request submitted successfully as [${urgency}] priority for ${customerIdentity}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 relative rounded-2xl bg-slate-900 border border-slate-800 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">
          Request Service from {provider?.name || "Specialist"}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Select an urgency level to alert the provider immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Urgency Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Priority / Urgency Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {urgencyOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = urgency === option.id;
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setUrgency(option.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-200 ${
                      isSelected ? option.activeColor : option.color
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">{option.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">
                      {option.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Describe your issue or complaint
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Electrical outlet sparked and power is completely off..."
              className="w-full glass-input p-3 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full glass-input p-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full glass-input p-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all text-white ${
              urgency === "Emergency / Immediate"
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                : urgency === "High"
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            }`}
          >
            Submit Request ({urgency})
          </button>
        </form>
      </div>
    </div>
  );
};