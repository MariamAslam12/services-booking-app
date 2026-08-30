import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">ApexServe</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Connecting customers with trusted, verified local service professionals seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Explore Services</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login / Register</Link></li>
              <li><Link to="/customer-dashboard" className="hover:text-indigo-400 transition-colors">Customer Dashboard</Link></li>
              <li><Link to="/provider-dashboard" className="hover:text-indigo-400 transition-colors">Provider Dashboard</Link></li>
            </ul>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Electrical Systems</li>
              <li>Plumbing & Repairs</li>
              <li>Interior Design</li>
              <li>Deep Home Cleaning</li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ApexServe Inc. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for seamless local bookings.
          </p>
        </div>
      </div>
    </footer>
  );
};