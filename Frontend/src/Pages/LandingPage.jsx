import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import MotionCard from "../Components/MotionCard";
import { ArrowRight, Calculator, Target, TrendingUp, Sparkles, ShieldCheck, Zap, Star, BookOpen, Award, Brain, Library } from "lucide-react";

export default function LandingPage() {
  return (
    
    <div className="relative z-10 min-h-screen overflow-hidden flex flex-col">
        
      {/* Background Glowing Blobs for Landing Page */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      {/* Custom Keyframes for Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: float 8s ease-in-out infinite 1s; }
        .float-3 { animation: float 7s ease-in-out infinite 2.5s; }
        .float-4 { animation: float 9s ease-in-out infinite 0.5s; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <BookOpen className="absolute top-[10%] left-[10%] text-brand-primary/10 float-1 w-16 h-16" />
        <Award className="absolute top-[30%] right-[10%] text-brand-accent/10 float-2 w-20 h-20" />
        <Brain className="absolute top-[50%] left-[8%] text-blue-500/10 float-3 w-14 h-14" />
        <Library className="absolute top-[10%] right-[15%] text-purple-500/10 float-4 w-12 h-12" />
      </div>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wide mb-6">
              <Sparkles size={14} /> The Ultimate Student Tool
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Take Control of Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent drop-shadow-[0_0_20px_rgba(167,92,255,0.3)]">
                Academic Future
              </span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Calculate your CGPA instantly, predict exactly what grades you need for your upcoming semesters, and convert your scores for your resume—all in one sleek platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/calculator" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-btn-gradient shadow-[0_8px_25px_rgba(167,92,255,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all hover:-translate-y-1">
                Start Calculating Now <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-600 bg-slate-800/40 text-sm font-bold text-white hover:bg-slate-800 transition-all hover:-translate-y-1">
                Create Free Account
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col items-center justify-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#080d1d] bg-indigo-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#080d1d] bg-purple-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#080d1d] bg-pink-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#080d1d] bg-slate-700 flex items-center justify-center text-xs font-bold text-white">+2k</div>
              </div>
              <div className="flex items-center gap-1 text-brand-primary">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-xs text-slate-500">Trusted by thousands of college students</p>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-20 bg-[#091022]/50 border-y border-slate-800/50 relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to succeed</h2>
              <p className="text-slate-400">Ditch the confusing spreadsheets. We've built the perfect toolkit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <MotionCard delay={0} className="h-full">
                <div className="h-full p-8 rounded-3xl border border-slate-700/40 bg-[#0c142a]/80 backdrop-blur-sm hover:border-brand-primary/50 hover:shadow-[0_0_30px_rgba(167,92,255,0.1)] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calculator size={28} className="text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Calculator</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Input your SGPA and credits to instantly calculate your precise CGPA. Supports both credit-weighted and simple average university formulas.
                </p>
                <Link to="/calculator" className="text-brand-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Try it out <ArrowRight size={16} />
                </Link>
                </div>
              </MotionCard>

              {/* Feature 2 */}
              <MotionCard delay={0.1} className="h-full">
                <div className="h-full p-8 rounded-3xl border border-slate-700/40 bg-[#0c142a]/80 backdrop-blur-sm hover:border-brand-accent/50 hover:shadow-[0_0_30px_rgba(231,48,177,0.1)] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target size={28} className="text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Target Planner</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Want an 8.5 CGPA? Enter your current score, and we will tell you exactly what SGPA you need to maintain in your remaining semesters.
                </p>
                <Link to="/TargetCGPA" className="text-brand-accent text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Plan your target <ArrowRight size={16} />
                </Link>
                </div>
              </MotionCard>

              {/* Feature 3 */}
              <MotionCard delay={0.2} className="h-full">
                <div className="h-full p-8 rounded-3xl border border-slate-700/40 bg-[#0c142a]/80 backdrop-blur-sm hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp size={28} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Percentage Converter</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Applying for jobs or higher studies? Quickly convert your 10-point scale CGPA to a standard percentage with recognized multipliers.
                </p>
                <Link to="/percentage-converter" className="text-blue-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Convert now <ArrowRight size={16} />
                </Link>
                </div>
              </MotionCard>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Why create an account?</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="mt-1"><ShieldCheck className="text-emerald-400" size={24} /></div>
                    <div>
                      <h4 className="text-slate-200 font-semibold mb-1">Save your degree credits</h4>
                      <p className="text-slate-500 text-sm">Enter your total degree credits once, and our Target Planner will automatically fetch it every time.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1"><Zap className="text-yellow-400" size={24} /></div>
                    <div>
                      <h4 className="text-slate-200 font-semibold mb-1">Lightning fast calculations</h4>
                      <p className="text-slate-500 text-sm">Never lose your previous semester's data. Log in from any device and pick up right where you left off.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="text-brand-primary font-bold hover:text-brand-accent transition-colors flex items-center gap-2">
                    Join for free <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="relative">
                {/* Abstract graphic representing data saving */}
                <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-slate-800 to-[#0c142a] border border-slate-700/50 p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl"></div>
                  <div className="h-10 w-3/4 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-full bg-slate-700/30 rounded-lg"></div>
                  <div className="h-10 w-5/6 bg-slate-700/30 rounded-lg"></div>
                  <div className="mt-auto h-12 w-full bg-brand-primary/20 border border-brand-primary/50 rounded-xl flex items-center justify-center text-brand-primary font-bold text-sm">Data Saved Successfully</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/60 bg-[#060b18] py-8 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} CGPA Calc. Made for college students.</p>
      </footer>
    </div>
  );
}