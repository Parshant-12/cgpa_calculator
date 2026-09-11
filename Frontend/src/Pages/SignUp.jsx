import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Mail, LockKeyhole, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Placeholder for backend auth logic
    console.log("Signing up with:", form);
    navigate("/");
  };

  return (
    <div className="relative z-10 min-h-screen pb-20 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 mt-8">
        <div className="w-full max-w-[650px] p-8 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
              Create Your <span className="text-brand-primary">Account</span>
            </h1>
            <p className="text-slate-400 text-sm">Join to track your CGPA progress and auto-save degree requirements.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-pink-950/30 border border-pink-800/40 text-pink-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name</label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3.5 text-slate-500" />
                  <input
                    type="text" required placeholder="John Doe"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-[#060b18] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                <div className="relative flex items-center">
                  <LockKeyhole size={18} className="absolute left-3.5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"} required placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-12 pl-10 pr-10 bg-[#060b18] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all"
                  />
                  <button 
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirm Password</label>
                <div className="relative flex items-center">
                  <LockKeyhole size={18} className="absolute left-3.5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"} required placeholder="••••••••"
                    value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full h-12 pl-10 pr-10 bg-[#060b18] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="terms" required className="w-4 h-4 accent-brand-primary cursor-pointer rounded border-slate-700 bg-[#060b18]" />
              <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer">
                I agree to the <span className="text-brand-primary hover:underline">Terms of Service</span> and <span className="text-brand-primary hover:underline">Privacy Policy</span>.
              </label>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 h-12 mt-4 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all">
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Already have an account? <Link to="/signin" className="text-brand-primary font-semibold hover:text-brand-accent transition-colors">Sign in</Link>
          </p>

        </div>
      </main>
    </div>
  );
}