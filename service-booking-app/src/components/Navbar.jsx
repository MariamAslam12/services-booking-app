import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, User, Briefcase, LogIn, LogOut, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? "/" : "/login"} className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            ApexServe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/"
                className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Explore Services
              </Link>

              {user.role === "customer" ? (
                <Link
                  to="/customer-dashboard"
                  className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  My Bookings
                </Link>
              ) : (
                <Link
                  to="/provider-dashboard"
                  className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Provider Portal
                </Link>
              )}

              {/* Role Switcher */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 ml-2">
                <button
                  onClick={() => {
                    switchRole("customer");
                    navigate("/customer-dashboard");
                  }}
                  className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    user.role === "customer"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  Customer
                </button>
                <button
                  onClick={() => {
                    switchRole("provider");
                    navigate("/provider-dashboard");
                  }}
                  className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    user.role === "provider"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  Provider
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors bg-indigo-600/20 border border-indigo-500/30 font-semibold"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {user ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-2"
              >
                Explore Services
              </Link>
              {user.role === "customer" ? (
                <Link
                  to="/customer-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-slate-300 hover:text-white py-2"
                >
                  My Bookings
                </Link>
              ) : (
                <Link
                  to="/provider-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-slate-300 hover:text-white py-2"
                >
                  Provider Portal
                </Link>
              )}
              <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    switchRole("customer");
                    setIsOpen(false);
                    navigate("/customer-dashboard");
                  }}
                  className={`flex items-center justify-center py-2 rounded-lg text-xs font-semibold ${
                    user.role === "customer" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-300"
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Switch to Customer View
                </button>
                <button
                  onClick={() => {
                    switchRole("provider");
                    setIsOpen(false);
                    navigate("/provider-dashboard");
                  }}
                  className={`flex items-center justify-center py-2 rounded-lg text-xs font-semibold ${
                    user.role === "provider" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-300"
                  }`}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Switch to Provider View
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center py-2 text-sm text-white bg-indigo-600 rounded-lg font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};