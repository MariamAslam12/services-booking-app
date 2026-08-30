import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const ServiceCard = ({ provider }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden flex flex-col justify-between group border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300"
    >
      <div>
        <div className="relative h-48 overflow-hidden">
          <img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
            {provider.category}
          </span>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs text-slate-300">
            <span className="flex items-center font-medium bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
              {provider.rating} ({provider.reviewsCount})
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-medium">
              {provider.available ? "Available Now" : "Busy"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-white group-hover:text-indigo-400 transition-colors">
              {provider.name}
            </h3>
            <span className="text-indigo-400 font-bold text-lg">{provider.price}</span>
          </div>

          <p className="text-slate-400 text-sm mb-4 line-clamp-1">{provider.service}</p>

          <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {provider.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {provider.experience} exp
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        <Link
          to={`/provider/${provider.id}`}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group/btn"
        >
          <span>View Profile & Book</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};