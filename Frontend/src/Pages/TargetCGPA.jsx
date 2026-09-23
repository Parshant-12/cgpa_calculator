import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import MotionCard from "../Components/MotionCard";
import { Target, Sparkles, AlertCircle, CheckCircle2, Info, Calendar, X, LogIn } from "lucide-react";
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";

export default function TargetPredictor() {
  const { isAuthenticated, user, token, updateLocalProfile } = useAuth();
  
  const [currentCgpa, setCurrentCgpa] = useState(user?.academicProfile?.currentCgpa || "");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [completedCredits, setCompletedCredits] = useState(user?.academicProfile?.completedCredits || "");
  const [totalDegreeCredits, setTotalDegreeCredits] = useState(user?.academicProfile?.totalDegreeCredits || "160");
  const [remainingSemesters, setRemainingSemesters] = useState(user?.academicProfile?.remainingSemesters || "");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const resultRef = useRef(null); // Reference for smooth scrolling

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const calculateTarget = async (e) => {
    e.preventDefault();
    setError("");

    const curr = Number(currentCgpa);
    const currCred = Number(completedCredits);
    const totalDegCred = Number(totalDegreeCredits);
    const target = Number(targetCgpa);
    const remSems = Number(remainingSemesters);

    if (curr < 0 || curr > 10 || target < 0 || target > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    if (remSems <= 0) {
      setError("Remaining semesters must be at least 1.");
      return;
    }

    const futureCredits = totalDegCred - currCred;
    if (futureCredits <= 0) {
      setError("Completed credits cannot be equal to or greater than total degree credits.");
      return;
    }

    const currentPoints = curr * currCred;
    const targetTotalPoints = target * totalDegCred;
    const requiredFuturePoints = targetTotalPoints - currentPoints;

    const requiredSgpa = requiredFuturePoints / futureCredits;

    setResult({
      requiredSgpa,
      isPossible: requiredSgpa <= 10.0,
      isAlreadyAchieved: requiredSgpa <= 0,
      target,
      futureCredits,
      remSems
    });

    toast.success("Target calculated successfully!");

    // Smoothly scroll to the result after a tiny delay to allow React to render it
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    if (isAuthenticated && token) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ currentCgpa, completedCredits, totalDegreeCredits, remainingSemesters })
        });
        const data = await res.json();
        if (res.ok) {
          updateLocalProfile(data.academicProfile);
          toast.success("Profile autosaved successfully!", {
            icon: '💾',
            style: {
              background: '#0c142a',
              color: '#34d399', // Emerald color to distinguish from primary toast
              border: '1px solid rgba(16, 185, 129, 0.3)',
            },
          });
        }
      } catch (err) {
        console.error("Failed to auto-save profile:", err);
      }
    }
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />
      <main className="max-w-[850px] mx-auto p-4 md:p-8 relative">
        
        <section className="text-center pt-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Target <span className="text-brand-primary">CGPA Planner</span>
          </h1>
          <p className="text-slate-400 text-sm">Find out the exact average SGPA you need in your upcoming semesters to hit your dream CGPA.</p>
        </section>

        <MotionCard hover={false}>
        <form onSubmit={calculateTarget} className="p-6 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl mb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Current CGPA</label>
              <input
                type="number" step="0.01" min="0" max="10" required placeholder="e.g. 7.60"
                value={currentCgpa} onChange={(e) => setCurrentCgpa(e.target.value)}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-100 text-sm focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-primary mb-1.5 font-medium">Target CGPA Goal</label>
              <input
                type="number" step="0.01" max="10" min="0" required placeholder="e.g. 8.50"
                value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)}
                className="w-full h-11 px-3 bg-[#0c152c] border border-brand-primary/50 rounded-lg text-white text-sm focus:border-brand-primary outline-none transition-all shadow-[0_0_10px_rgba(167,92,255,0.1)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-slate-800/60">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Completed Credits</label>
              <input
                type="number" step="0.5" min="1" required placeholder="e.g. 80"
                value={completedCredits} onChange={(e) => setCompletedCredits(e.target.value)}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-100 text-sm focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Total Degree Credits</label>
              <input
                type="number" step="0.5" min="1" required placeholder="e.g. 160"
                value={totalDegreeCredits} onChange={(e) => setTotalDegreeCredits(e.target.value)}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-100 text-sm focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Remaining Semesters</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number" step="1" min="1" required placeholder="e.g. 4"
                  value={remainingSemesters} onChange={(e) => setRemainingSemesters(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-100 text-sm focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {error && <div className="text-pink-400 bg-pink-950/30 border border-pink-800/40 p-3 rounded-lg text-xs mb-6">{error}</div>}

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all">
            <Target size={18} /> Calculate Required SGPA
          </button>
        </form>
        </MotionCard>

        <MotionCard delay={0.08} hover={false}>
        <div className="flex items-start gap-3 p-4 mb-8 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-400 text-xs leading-relaxed">
          <Info size={18} className="text-brand-primary flex-shrink-0 mt-0.5" />
          <p>
            <strong>Need help finding your total degree credits?</strong> Usually, a 4-year B.Tech program consists of ~160 credits. You can verify your specific course requirements by checking your university's official syllabus PDF or logging into your student portal.
          </p>
        </div>
        </MotionCard>

        {/* Added ref here for smooth scrolling */}
        <div ref={resultRef}>
          {result && (
            <MotionCard delay={0.12} hover={false}>
            <div className="p-6 md:p-8 border border-brand-primary/30 rounded-2xl bg-[#0c142a]/90 backdrop-blur-md">
              {result.isAlreadyAchieved ? (
                <div className="flex items-center gap-4 text-emerald-400">
                  <CheckCircle2 size={32} />
                  <div>
                    <h3 className="font-bold text-base">Target Met!</h3>
                    <p className="text-slate-400 text-sm">Even with an SGPA of 0.0, your target of {result.target} is mathematically locked.</p>
                  </div>
                </div>
              ) : result.isPossible ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-brand-primary text-xs font-semibold uppercase tracking-wider">Required Semester Average</span>
                    <div className="text-4xl md:text-5xl font-black text-white mt-1">
                      {result.requiredSgpa.toFixed(2)} <span className="text-base text-slate-400 font-normal">SGPA</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-2">
                      You need to score an average of <strong>{result.requiredSgpa.toFixed(2)} SGPA</strong> in <u>each</u> of your remaining <strong>{result.remSems} semesters</strong> to hit your {result.target} CGPA goal.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 grid place-items-center text-brand-primary"><Sparkles size={28} /></div>
                </div>
              ) : (
                <div className="flex items-start gap-4 text-pink-400">
                  <AlertCircle size={28} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-base">Target Out of Reach</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      To reach {result.target}, you need an average SGPA of <strong className="text-pink-400">{result.requiredSgpa.toFixed(2)}</strong>. Because the maximum attainable score is 10.0, consider adjusting your target.
                    </p>
                  </div>
                </div>
              )}
            </div>
            </MotionCard>
          )}
        </div>
      </main>

      {showAuthPrompt && !isAuthenticated && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[1000] animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="w-[320px] p-5 border border-brand-primary/40 rounded-2xl bg-[#091022]/95 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative group">
            
            <button 
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={18} className="text-brand-primary" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Want a smoother experience?</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Sign in to auto-fill your current CGPA, total credits, and remaining semesters every time you visit.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link 
                to="/signin" 
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/90 transition-colors"
              >
                <LogIn size={14} /> Sign In
              </Link>
              <Link 
                to="/signup" 
                className="flex-1 flex items-center justify-center py-2.5 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Create Account
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
