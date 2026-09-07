import React, { useState, useMemo } from "react";
import { getStoredProviders } from "../utils/storage";
import { ServiceCard } from "../components/ServiceCard";
import { 
  Search, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Zap, 
  CheckCircle 
} from "lucide-react";
import { motion } from "framer-motion";

// Fallback provider list ensures cards always render even if localStorage is empty
const DEFAULT_PROVIDERS = [
  {
    id: "p1",
    name: "Alex Rivera",
    service: "Electrical Systems & Smart Home",
    category: "Electrical",
    rating: 4.9,
    reviewsCount: 42,
    price: "$65/hr",
    location: "Downtown Core",
    experience: "8+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p2",
    name: "Elena Rostova",
    service: "Interior Architectural Design",
    category: "Design",
    rating: 5.0,
    reviewsCount: 68,
    price: "$90/hr",
    location: "West End",
    experience: "10+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p3",
    name: "Marcus Vance",
    service: "Precision Plumbing & Diagnostics",
    category: "Plumbing",
    rating: 4.8,
    reviewsCount: 31,
    price: "$55/hr",
    location: "North Suburbs",
    experience: "6+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p4",
    name: "Sophia Chen",
    service: "Deep Home & Eco-Cleaning",
    category: "Cleaning",
    rating: 4.7,
    reviewsCount: 89,
    price: "$40/hr",
    location: "Metro Heights",
    experience: "5+ Years exp",
    available: false,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p5",
    name: "David Miller",
    service: "Custom Carpentry & Cabinetry",
    category: "Carpentry",
    rating: 4.9,
    reviewsCount: 53,
    price: "$75/hr",
    location: "East Riverside",
    experience: "12+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p6",
    name: "Aria Thorne",
    service: "HVAC & Climate Systems",
    category: "HVAC",
    rating: 4.8,
    reviewsCount: 39,
    price: "$70/hr",
    location: "Central City",
    experience: "7+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p7",
    name: "Kashif Malik",
    service: "Wall Painting & Surface Prep",
    category: "Painting",
    rating: 4.9,
    reviewsCount: 64,
    price: "$45/hr",
    location: "Metro Heights",
    experience: "6+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p8",
    name: "Rashid Khan",
    service: "Refrigerator & Washer Diagnostics",
    category: "Appliance Repair",
    rating: 4.8,
    reviewsCount: 103,
    price: "$50/hr",
    location: "Downtown Core",
    experience: "10+ Years exp",
    available: false,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p9",
    name: "Sajid Mahmood",
    service: "Termite & Pest Fumigation",
    category: "Pest Control",
    rating: 4.9,
    reviewsCount: 91,
    price: "$60/hr",
    location: "North Suburbs",
    experience: "8+ Years exp",
    available: true,
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
  },
];

export const Home = () => {
  const [providers] = useState(() => {
    const stored = getStoredProviders();
    return stored && stored.length > 0 ? stored : DEFAULT_PROVIDERS;
  });

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

  const whyChooseUsPoints = [
    {
      icon: ShieldCheck,
      title: "Verified Specialists",
      description: "Every service provider is background-checked, vetted, and highly rated.",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Immediate connection with top specialists for urgent home repairs.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book appointments at your convenience with guaranteed time slots.",
    },
    {
      icon: UserCheck,
      title: "Transparent Pricing",
      description: "Upfront hourly rates with no hidden fees or unexpected charges.",
    },
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
    }else if (text.match(/paint|wall|surface|color/)) {
      category = "Painting";
    } else if (text.match(/fridge|washer|refrigerator|appliance/)) {
      category = "Appliance Repair";
    } else if (text.match(/pest|termite|fumigation|bugs|insects/)) {
      category = "Pest Control";
    }

    return { category, urgency };
  }, [searchTerm]);

  // Filter Logic
  const filteredProviders = providers.filter((p) => {
    const text = searchTerm.toLowerCase();

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
    <div className="space-y-16 pb-16">
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
            <div className="relative flex-1 w-full">
              <div className="absolute left-3.5 top-3.5 flex items-center text-indigo-400">
                <Sparkles className="w-4 h-4 animate-pulse mr-1" />
              </div>
              <input
                type="text"
                placeholder="Describe your issue (e.g., 'Water is leaking fast from pipe')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-11 pr-10 py-2.5 text-sm text-white placeholder-slate-500 bg-slate-900/60 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = (aiAnalysis.category || selectedCategory) === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
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

       {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> About ApexServe
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Seamless Local Services, On Demand
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              ApexServe connects clients with trusted, verified local service professionals. From electrical repairs and interior design to home cleaning and plumbing, our platform makes booking experts effortless and transparent.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-slate-300 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI-Powered Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Customer Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated Dashboards</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Specialists Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Featured Specialists</h2>
          <span className="text-xs text-slate-400">
            Showing {filteredProviders.length} verified results
          </span>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40">
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
      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-2xl font-bold text-white">Built for Speed & Reliability</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center flex flex-col items-center space-y-3"
              >
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>


       </div>
  );
};