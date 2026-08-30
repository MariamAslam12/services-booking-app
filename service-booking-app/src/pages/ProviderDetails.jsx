import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredProviders, saveBooking } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { Star, MapPin, Clock, CheckCircle, Heart, Upload, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const providers = getStoredProviders();
    const found = providers.find((p) => p.id === id);
    if (found) {
      setProvider(found);
    } else {
      setProvider(providers[0]);
    }

    const favs = JSON.parse(localStorage.getItem("app_favorites") || "[]");
    setIsFavorite(favs.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("app_favorites") || "[]");
    let updated;
    if (favs.includes(provider.id)) {
      updated = favs.filter((favId) => favId !== provider.id);
      setIsFavorite(false);
    } else {
      updated = [...favs, provider.id];
      setIsFavorite(true);
    }
    localStorage.setItem("app_favorites", JSON.stringify(updated));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiAssistant = () => {
    if (!formData.description) {
      alert("Please enter a description first.");
      return;
    }
    setIsAiAnalyzing(true);
    setTimeout(() => {
      const text = formData.description.toLowerCase();
      let urgency = "Standard";
      if (text.includes("leak") || text.includes("emergency") || text.includes("spark") || text.includes("broken")) {
        urgency = "High Priority / Emergency";
      }
      setAiSuggestion({
        category: provider.category,
        urgency,
        recommendedSlot: "Today or Tomorrow Morning",
      });
      setIsAiAnalyzing(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.location || !formData.description) {
      alert("Please complete all required fields.");
      return;
    }

    const newBooking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: user.id,
      customerName: user.name,
      providerId: provider.id,
      providerName: provider.name,
      serviceCategory: provider.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      image: imagePreview,
      urgency: aiSuggestion?.urgency || "Standard",
      status: "Pending",
      isReviewed: false,
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);
    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/customer-dashboard");
    }, 1500);
  };

  if (!provider) return <div className="p-8 text-center text-slate-400">Loading provider details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center relative">
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
            </button>

            <img
              src={provider.image}
              alt={provider.name}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-indigo-500/40 p-1"
            />
            <h2 className="text-2xl font-bold text-white">{provider.name}</h2>
            <p className="text-indigo-400 text-sm font-medium mb-2">{provider.service}</p>

            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 mb-4">
              <span className={`w-2 h-2 rounded-full mr-2 ${provider.available ? "bg-emerald-400" : "bg-amber-400"}`} />
              {provider.available ? "Available Now" : "Busy / High Demand"}
            </div>
            
            <div className="flex justify-center items-center space-x-4 text-sm text-slate-300 border-t border-b border-slate-800 py-3 mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-bold">{provider.rating}</span>
              </div>
              <span>•</span>
              <div>{provider.experience} Exp</div>
              <span>•</span>
              <div className="text-indigo-400 font-bold">{provider.price}</div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed text-left">{provider.bio}</p>
          </div>
        </div>

        {/* Booking Form with AI & Image Upload */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-2">Schedule Service Request</h3>
            <p className="text-slate-400 text-sm mb-6">
              Complete the details below to dispatch a request to {provider.name}.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3"
              >
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-300">Booking Request Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time Slot *</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter complete address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Requirement Description *</label>
                    <button
                      type="button"
                      onClick={runAiAssistant}
                      className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      {isAiAnalyzing ? "Analyzing..." : "AI Urgency Check"}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the issue or service required..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full glass-input text-sm resize-none"
                  />
                </div>

                {/* AI Assistant Output Box */}
                {aiSuggestion && (
                  <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs space-y-1">
                    <div className="flex items-center text-indigo-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                      AI Assistant Analysis:
                    </div>
                    <p className="text-slate-300">Category: <span className="text-white font-medium">{aiSuggestion.category}</span></p>
                    <p className="text-slate-300">Urgency Level: <span className="text-amber-400 font-semibold">{aiSuggestion.urgency}</span></p>
                  </div>
                )}

                {/* Image Upload Feature */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Attach Photo (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer border border-slate-700 transition-colors">
                      <Upload className="w-3.5 h-3.5 mr-2" />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-indigo-500" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm mt-4"
                >
                  Submit Booking
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};