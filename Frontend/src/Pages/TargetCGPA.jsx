import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Target, Sparkles, AlertCircle, CheckCircle2, LockKeyhole, Info } from "lucide-react";

export default function TargetPredictor() {
  // MOCK AUTH STATE: In production, pull this from your Context/Redux store
  const isAuthenticated = false; 

  // MOCK USER PROFILE DATA: Pulled from DB after login
  const [profile] = useState({
    currentCgpa: "7.60",
    completedCredits: "80",
    totalDegreeCredits: "160" // e.g., standard 4-year B.Tech
  });

  const [targetCgpa, setTargetCgpa] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateTarget = (e) => {
    e.preventDefault();
    setError("");

    const curr = Number(profile.currentCgpa);
    const currCred = Number(profile.completedCredits);
    const totalDegCred = Number(profile.totalDegreeCredits);
    const target = Number(targetCgpa);

    if (target < 0 || target > 10) {
      setError("Target CGPA must be between 0 and 10.");
      return;
    }

    const futureCredits = totalDegCred - currCred;
    if (futureCredits <= 0) {
      setError("You have already completed all credits for this degree.");
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
      futureCredits
    });
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />
      <main className="max-w-[850px] mx-auto p-4 md:p-8">
        <section className="text-center pt-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Target <span className="text-brand-primary">CGPA Planner</span>
          </h1>
          <p className="text-slate-400 text-sm">Find out the exact SGPA you need in upcoming semesters to hit your dream CGPA.</p>
        </section>

        {!isAuthenticated ? (
          <div className="p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl text-center">
            <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
              <LockKeyhole size={36} className="text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Unlock the Target Planner</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              Create a free account to store your degree's total credits and current SGPA history. 
              We calculate your remaining credits automatically so you never have to re-enter your data.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup" className="px-8 py-3 rounded-xl bg-btn-gradient text-white font-bold text-sm shadow-[0_8px_20px_rgba(167,92,255,0.25)] hover:brightness-110 transition-all">
                Create Account
              </Link>
              <Link to="/signin" className="px-8 py-3 rounded-xl border border-slate-600 bg-slate-800/50 text-white font-bold text-sm hover:bg-slate-800 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={calculateTarget} className="p-6 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Auto-filled fields based on profile */}
                <div className="opacity-70 pointer-events-none">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Current CGPA (Auto-saved)</label>
                  <input type="text" value={profile.currentCgpa} readOnly className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-300 text-sm" />
                </div>
                <div className="opacity-70 pointer-events-none">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Completed Credits (Auto-saved)</label>
                  <input type="text" value={profile.completedCredits} readOnly className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-300 text-sm" />
                </div>
                <div className="opacity-70 pointer-events-none">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Total Degree Credits</label>
                  <input type="text" value={profile.totalDegreeCredits} readOnly className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-300 text-sm" />
                </div>
                
                {/* User Input Field */}
                <div>
                  <label className="block text-xs text-brand-primary mb-1.5 font-medium">Target CGPA Goal</label>
                  <input
                    type="number" step="0.01" max="10" min="0" required placeholder="e.g. 8.50"
                    value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0c152c] border border-brand-primary/50 rounded-lg text-white text-sm focus:border-brand-primary outline-none transition-all shadow-[0_0_10px_rgba(167,92,255,0.1)]"
                  />
                </div>
              </div>

              {error && <div className="text-pink-400 bg-pink-950/30 border border-pink-800/40 p-3 rounded-lg text-xs mb-6">{error}</div>}

              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all">
                <Target size={18} /> Calculate Required SGPA
              </button>
            </form>

            <div className="flex items-start gap-3 p-4 mb-8 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-400 text-xs leading-relaxed">
              <Info size={18} className="text-brand-primary flex-shrink-0 mt-0.5" />
              <p>
                <strong>Need help finding your total degree credits?</strong> Usually, a 4-year B.Tech program consists of ~160 credits. You can verify your specific course requirements by checking your university's official syllabus PDF or logging into your student portal.
              </p>
            </div>

            {result && (
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
                      <span className="text-brand-primary text-xs font-semibold uppercase tracking-wider">Required Minimum Target</span>
                      <div className="text-4xl md:text-5xl font-black text-white mt-1">
                        {result.requiredSgpa.toFixed(2)} <span className="text-base text-slate-400 font-normal">Average SGPA</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-2">
                        Maintain this average across your remaining <strong>{result.futureCredits} credits</strong> to secure a {result.target} CGPA.
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 grid place-items-center text-brand-primary"><Sparkles size={28} /></div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 text-pink-400">
                    <AlertCircle size={28} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-base">Target Out of Reach</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        To reach {result.target}, you need an average SGPA of <strong className="text-pink-400">{result.requiredSgpa.toFixed(2)}</strong>. Because the maximum attainable score is 10.0, consider adjusting your target.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}