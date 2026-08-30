import React, { useState, useMemo } from "react";
import { getStoredProviders } from "../utils/storage";
import { ServiceCard } from "../components/ServiceCard";
import { Search, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Home = () => {
  const [providers] = useState(getStoredProviders());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Electrical",
    "Design",
    "Plumbing",
    "Cleaning",
    "Carpentry",
    "HVAC",
  ];

  // AI Keyword Analysis Engine
  const aiAnalysis = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 3) {
      return { category: null, urgency: "Normal" };
    }

    const text = searchTerm.toLowerCase();

    // Determine Urgency
    let urgency = "Normal";
    const emergencyKeywords = [
      "urgent",
      "emergency",
      "asap",
      "immediately",
      "fast",
      "leak",
      "leaking",
      "spark",
      "flood",
      "broken",
      "danger",
      "burst",
      "outage",
      "fire",
    ];
    const highKeywords = ["today", "soon", "quick", "same day", "issue", "trouble"];

    if (emergencyKeywords.some((word) => text.includes(word))) {
      urgency = "Emergency / Immediate";
    } else if (highKeywords.some((word) => text.includes(word))) {
      urgency = "High";
    }

    // Determine Category
    let category = null;
    if (text.match(/pipe|water|drain|faucet|toilet|sink|leak|plumb|tap/)) {
      category = "Plumbing";
    } else if (text.match(/light|wire|outlet|switch|power|electric|circuit|fuse/)) {
      category = "Electrical";
    } else if (text.match(/clean|deep clean|dust|wash|maid|carpet|stain/)) {
      category = "Cleaning";
    } else if (text.match(/ac|heat|hvac|air condition|cool|furnace|fan/)) {
      category = "HVAC";
    } else if (text.match(/door|table|wood|cabinet|carpenter|furniture|fix/)) {
      category = "Carpentry";
    } else if (text.match(/design|interior|decor|sketch|layout/)) {
      category = "Design";
    }

    return { category, urgency };
  }, [searchTerm]);

  // Filter Logic
  const filteredProviders = providers.filter((p) => {
    const text = searchTerm.toLowerCase();

    // Matches manual search or AI detected category/urgency keywords
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(text) ||
      p.service.toLowerCase().includes(text) ||
      p.location.toLowerCase().includes(text) ||
      p.category.toLowerCase().includes(text) ||
      (aiAnalysis.category &&
        p.category.toLowerCase() === aiAnalysis.category.toLowerCase());

    const activeCategory = aiAnalysis.category || selectedCategory;
    const matchesCategory =
      activeCategory === "All" ||
      p.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4"
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Service Matching</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Seamless Local Services,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              On Demand.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Describe your problem to our AI assistant or search by provider. Instant matching with verified specialists.
          </p>
        </motion.div>

        {/* AI Search & Filter Bar */}
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="glass-card p-4 sm:p-3 flex flex-col sm:flex-row items-center gap-3">
            {/* AI Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-3.5 top-3.5 flex items-center text-indigo-400">
                <Sparkles className="w-4 h-4 animate-pulse mr-1" />
              </div>
              <input
                type="text"
                placeholder="Describe your issue (e.g., 'Water is leaking fast from pipe')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-11 pr-10 py-2.5 text-sm"
              />
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive =
                  (aiAnalysis.category || selectedCategory) === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Intelligence Feedback Badge */}
          {searchTerm.trim().length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  AI Suggested Category:{" "}
                  <strong className="text-indigo-300">
                    {aiAnalysis.category || "General Search"}
                  </strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-200">
                <AlertCircle
                  className={`w-4 h-4 ${
                    aiAnalysis.urgency === "Emergency / Immediate"
                      ? "text-rose-400"
                      : aiAnalysis.urgency === "High"
                      ? "text-amber-400"
                      : "text-slate-400"
                  }`}
                />
                <span>
                  Detected Urgency:{" "}
                  <span
                    className={`font-semibold ${
                      aiAnalysis.urgency === "Emergency / Immediate"
                        ? "text-rose-400"
                        : aiAnalysis.urgency === "High"
                        ? "text-amber-400"
                        : "text-slate-300"
                    }`}
                  >
                    {aiAnalysis.urgency}
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Featured Specialists</h2>
          <span className="text-xs text-slate-400">
            Showing {filteredProviders.length} verified results
          </span>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400">
            No specialists match your criteria. Try adjusting your search description.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};