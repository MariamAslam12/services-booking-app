import React, { useState } from "react";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { analyzeServiceDescription } from "../utils/aiAssistant";

export const AiAssistantInput = ({ onSuggestionApply }) => {
  const [description, setDescription] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setDescription(text);
    const result = analyzeServiceDescription(text);
    setSuggestion(result);
  };

  const handleApply = () => {
    if (suggestion && onSuggestionApply) {
      onSuggestionApply(suggestion, description);
    }
  };

  return (
    <div className="space-y-4 glass-card p-6 border border-slate-800 rounded-2xl bg-slate-900/60">
      <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>AI Smart Service Assistent</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Describe what you need help with:
        </label>
        <textarea
          value={description}
          onChange={handleInputChange}
          rows={3}
          placeholder="e.g., Water is leaking fast from my kitchen sink pipe..."
          className="w-full glass-input p-3 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* AI Suggestions Box */}
      {suggestion && (
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Suggested Category: <strong className="text-white">{suggestion.category}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
              <AlertCircle
                className={`w-4 h-4 ${
                  suggestion.urgency === "Emergency"
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              />
              <span>
                Urgency Level:{" "}
                <span
                  className={`font-semibold ${
                    suggestion.urgency === "Emergency"
                      ? "text-rose-400"
                      : "text-slate-200"
                  }`}
                >
                  {suggestion.urgency}
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
          >
            Apply Suggestion
          </button>
        </div>
      )}
    </div>
  );
};