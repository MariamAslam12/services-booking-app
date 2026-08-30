import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Mail, Lock, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { setUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    const userData = {
      id: selectedRole === "provider" ? `prov_${Date.now()}` : `cust_${Date.now()}`,
      name: isLogin ? (selectedRole === "provider" ? "Alex Rivera" : "Sarah Jenkins") : name,
      email: email,
      role: selectedRole,
    };

    // Save to auth context
    setUser(userData);

    // Save to local storage for persistent account switching across components
    localStorage.setItem("app_user", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));

    // Dispatch custom storage event so other open tabs/dashboard listeners update instantly
    window.dispatchEvent(new Event("storage"));

    if (switchRole) {
      switchRole(selectedRole);
    }

    // Navigate to appropriate dashboard
    navigate(selectedRole === "provider" ? "/provider-dashboard" : "/customer-dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8 relative overflow-hidden shadow-2xl rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mb-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isLogin
              ? "Sign in to manage your bookings and services"
              : "Join ApexServe today"}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-semibold transition-all ${
              selectedRole === "customer"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("provider")}
            className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-semibold transition-all ${
              selectedRole === "provider"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Service Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 text-sm transition-all mt-4"
          >
            {isLogin
              ? `Log In as ${selectedRole === "customer" ? "Customer" : "Provider"}`
              : "Create Account"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:underline font-semibold ml-1"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};