import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight, Github, GraduationCap } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSignIn = (e) => {
    e.preventDefault();
    // Placeholder for backend auth logic
    console.log("Signing in with:", form);
    navigate("/"); // Redirect to dashboard on success
  };

  return (
    <div className="relative z-10 min-h-screen pb-20 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 mt-8">
        <div className="w-full max-w-[480px] p-8 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-brand-primary/10 border border-brand-primary/30 rounded-2xl grid place-items-center mb-5">
              <GraduationCap size={32} className="text-brand-primary drop-shadow-[0_0_10px_rgba(167,92,255,0.6)]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Welcome Back!</h1>
            <p className="text-slate-400 text-sm">Sign in to sync your degree credits and targets.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-slate-500" />
                <input
                  type="email" required placeholder="you@university.edu"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 bg-[#060b18] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs text-slate-400 font-medium">Password</label>
                <Link to="#" className="text-xs text-brand-primary hover:text-brand-accent transition-colors">Forgot password?</Link>
              </div>
              <div className="relative flex items-center">
                <LockKeyhole size={18} className="absolute left-3.5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-12 pl-10 pr-10 bg-[#060b18] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 h-12 mt-2 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex-1 h-px bg-slate-700/50"></div>
            <span>Or continue with</span>
            <div className="flex-1 h-px bg-slate-700/50"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 transition-colors text-sm text-slate-300 font-medium">
              <span className="font-bold text-white text-base">G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 transition-colors text-sm text-slate-300 font-medium">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account? <Link to="/signup" className="text-brand-primary font-semibold hover:text-brand-accent transition-colors">Sign up</Link>
          </p>

        </div>
      </main>
    </div>
  );
}