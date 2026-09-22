import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Calculator, Plus, Trophy, X, Info, Target, TrendingUp,
  HelpCircle, BookOpen, Award, Brain, Library, ArrowUpRight, ChevronDown, Lock, LogIn, Sparkles
} from "lucide-react";
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";
import { useRef } from "react";

const formulaOptions = [
  { id: "weighted", label: "Weighted by Credits", expression: "Σ(Grade Point × Credit Hours) / Total Credit Hours" },
  { id: "average", label: "Simple Average", expression: "ΣGPA / Number of Semesters" }
];

const initialSemesters = [
  { id: 1, gpa: "", credits: "" },
  { id: 2, gpa: "", credits: "" }
];

function SemesterCard({ semester, index, onChange, onRemove, formula, isLocked }) {
  const isAverage = formula === "average";

  return (
    <div className="p-5 border border-slate-700/50 rounded-xl bg-[#0c142a]/80 hover:border-brand-primary/40 transition-colors shadow-sm relative h-fit">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-brand-primary font-medium text-sm">Semester {index + 1}</h3>
        <button onClick={() => onRemove(semester.id)} disabled={index < 2} className="text-pink-500 hover:text-pink-400 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity">
          <X size={16} />
        </button>
      </div>

      <label className="block text-xs text-slate-400 mb-1.5">GPA (Grade Point)</label>
      <input
        type="number" step="0.01" placeholder="e.g. 8.5" value={semester.gpa}
        onChange={(e) => onChange(semester.id, "gpa", e.target.value)}
        className={`w-full h-10 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all ${!isAverage ? 'mb-4' : ''}`}
      />

      {/* Hide credits input dynamically if simple average is selected */}
      {!isAverage && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs text-slate-400 flex items-center gap-1">
              Total Credits {isLocked && <Lock size={10} className="text-brand-accent" />}
            </label>
            {!isLocked && (
              <div className="group relative cursor-help">
                <Info size={12} className="text-slate-500 hover:text-brand-primary" />
                <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-slate-800 text-[10px] text-slate-300 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                  Check your university syllabus PDF, student portal, or previous grade sheets for credit hours.
                </div>
              </div>
            )}
          </div>
          <input
            type="number" step="0.5" placeholder="e.g. 24" value={semester.credits}
            onChange={(e) => onChange(semester.id, "credits", e.target.value)}
            readOnly={isLocked}
            className={`w-full h-10 px-3 border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all ${isLocked ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed opacity-80' : 'bg-[#060b18]'}`}
          />
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, user, token, updateLocalProfile } = useAuth();
  const resultRef = useRef(null);
  
  // Database states
  const [collegesList, setCollegesList] = useState([
    { collegeId: "manual", name: "Manual Entry (Custom)", branches: [] }
  ]);
  
  // Selection states
  const [college, setCollege] = useState("manual");
  const [branch, setBranch] = useState("");
  const [semesters, setSemesters] = useState(initialSemesters);
  const [formula, setFormula] = useState("weighted");
  
  // UI states
  const [result, setResult] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Check if fields should be locked based on selection
  const isLocked = college !== "manual" && branch !== "";

  // Fetch colleges from the database on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('/api/colleges');
        if (response.ok) {
          const data = await response.json();
          // Keep manual entry as the first option, then append database colleges
          setCollegesList([
            { collegeId: "manual", name: "Manual Entry (Custom)", branches: [] },
            ...data
          ]);
        } else {
          toast.error("Failed to load college database");
        }
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
        toast.error("Server connection error while loading colleges");
      }
    };
    fetchColleges();
  }, []);

  // Trigger the popup 1.5 seconds after load if the user is NOT logged in
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Auto-fill credits when college/branch changes
  useEffect(() => {
    if (isLocked) {
      const selectedCollegeData = collegesList.find(c => c.collegeId === college);
      if (selectedCollegeData) {
        const branchData = selectedCollegeData.branches.find(b => b.branchId === branch);
        if (branchData) {
          setFormula(branchData.formula);
          setSemesters(current => current.map((sem, idx) => ({
            ...sem,
            credits: branchData.credits[idx] || "" // Auto-fill based on index
          })));
        }
      }
    }
  }, [college, branch, isLocked, collegesList]);

  const updateSemester = (id, field, value) => setSemesters(current => current.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addSemester = () => {
    const newIndex = semesters.length;
    let autoCredit = "";

    // Auto-fill the new semester if a branch is selected
    if (isLocked) {
      const selectedCollegeData = collegesList.find(c => c.collegeId === college);
      if (selectedCollegeData) {
        const branchData = selectedCollegeData.branches.find(b => b.branchId === branch);
        if (branchData && branchData.credits[newIndex]) {
          autoCredit = branchData.credits[newIndex];
        }
      }
    }
    setSemesters([...semesters, { id: Date.now(), gpa: "", credits: autoCredit }]);
  };

  const removeSemester = (id) => setSemesters(semesters.filter(s => s.id !== id));

  const calculate = async () => {
    const isAverage = formula === "average";
    const filled = semesters.filter(s => s.gpa !== "" && (isAverage || s.credits !== ""));
    if (!filled.length) return;

    let cgpa;
    let totalCredits = 0;
    let totalPoints = 0;

    if (isAverage) {
      cgpa = filled.reduce((sum, s) => sum + Number(s.gpa), 0) / filled.length;
    } else {
      totalCredits = filled.reduce((sum, s) => sum + Number(s.credits), 0);
      totalPoints = filled.reduce((sum, s) => sum + (Number(s.gpa) * Number(s.credits)), 0);
      cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    }

    const finalCgpa = Math.min(10, Math.max(0, cgpa));
    
    setResult({
      cgpa: finalCgpa,
      totalCredits,
      totalPoints,
      semesterCount: filled.length,
      formulaUsed: formula
    });

    toast.success("CGPA Calculated successfully!");

    // Auto-save the calculated results to user profile if authenticated
    if (isAuthenticated && token) {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ 
            currentCgpa: finalCgpa.toFixed(2), 
            completedCredits: totalCredits.toString(),
            // Keep the previous totalDegreeCredits and remainingSemesters intact
            totalDegreeCredits: user?.academicProfile?.totalDegreeCredits || "160",
            remainingSemesters: user?.academicProfile?.remainingSemesters || ""
          })
        });
        const data = await res.json();
        if (res.ok) {
          updateLocalProfile(data.academicProfile);
          toast.success("Progress auto-saved to profile!");
        }
      } catch (err) {
        console.error("Failed to auto-save profile from Dashboard:", err);
        toast.error("Failed to auto-save progress.");
      }
    }
  };

  // Scroll to result smoothly when result state updates
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [result]);

  return (
    <div className="relative z-10 min-h-screen pb-20 overflow-hidden">
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
        <Award className="absolute top-[25%] right-[15%] text-brand-accent/10 float-2 w-20 h-20" />
        <Brain className="absolute top-[40%] left-[8%] text-blue-500/10 float-3 w-14 h-14" />
        <Library className="absolute top-[15%] right-[30%] text-purple-500/10 float-4 w-12 h-12" />
      </div>

      <Navbar />
      <main className="max-w-[1300px] mx-auto p-4 md:p-8 relative">

        <section className="text-center pt-8 pb-12 relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(167,92,255,0.4)]">CGPA</span> Calculator
          </h1>
          <h2 className="text-xl md:text-2xl text-slate-200 mb-3 font-medium">Get your GPA Instantly and Accurately</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Add your semester GPA and credits to calculate your overall CGPA in seconds. <br />
            <span className="text-brand-primary/80 mt-1 block">Plan better. Aim higher. Achieve more!</span>
          </p>
        </section>

        {}
        <section className="w-full max-w-[1200px] mx-auto p-6 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10">

          {/* ======================================= */}
          {/* TOP CONTROLS: COLLEGE, BRANCH, FORMULA  */}
          {/* ======================================= */}
          <div className="flex flex-col gap-6 mb-10 border-b border-slate-700/40 pb-8">
            <div className="flex gap-4 items-center mb-2">
              <span className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/30 grid place-items-center text-brand-primary"><Calculator size={20} /></span>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Calculate Your CGPA</h2>
                <p className="text-slate-500 text-xs mt-0.5">Select your college for automatic credit filling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Select College */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-slate-300">University / College</label>
                <div className="relative">
                  <select
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      setBranch("");
                      setResult(null);
                    }}
                    className="h-10 w-full pl-3 pr-10 bg-[#060b18] border border-slate-700/60 rounded-lg text-slate-300 text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                  >
                    {collegesList.map((data) => (
                      <option key={data.collegeId} value={data.collegeId}>{data.name}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-right">
                    <Link to="/report-college" className="text-[11px] text-slate-400 hover:text-brand-primary transition-colors inline-flex items-center gap-1">
                      Don't see your college? <span className="font-semibold underline decoration-brand-primary/40 underline-offset-2">Request to add it</span>
                    </Link>
                  </div>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Select Branch (Only visible if college is not manual) */}
              {college !== "manual" && (
                <div className="flex flex-col gap-1.5 w-full animate-in fade-in duration-300">
                  <label className="text-xs font-medium text-slate-300">Branch / Stream</label>
                  <div className="relative">
                    <select
                      value={branch}
                      onChange={(e) => {
                        setBranch(e.target.value);
                        setResult(null);
                      }}
                      className="h-10 w-full pl-3 pr-10 bg-[#060b18] border border-slate-700/60 rounded-lg text-slate-300 text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                    >
                      <option value="" disabled>Select your branch</option>
                      {collegesList.find(c => c.collegeId === college)?.branches.map(b => (
                        <option key={b.branchId} value={b.branchId}>{b.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
                  </div>
                </div>
              )}

              {/* CGPA Formula (Disabled if College auto-sets it) */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  CGPA Formula {isLocked && <Lock size={10} className="text-brand-accent" />}
                </label>
                <div className="relative">
                  <select
                    value={formula}
                    onChange={(e) => { setFormula(e.target.value); setResult(null); }}
                    disabled={isLocked}
                    className={`h-10 w-full pl-3 pr-10 border border-slate-700/60 rounded-lg text-slate-300 text-sm outline-none focus:border-brand-primary transition-colors appearance-none ${isLocked ? 'bg-slate-800/50 cursor-not-allowed opacity-80' : 'bg-[#060b18] cursor-pointer'}`}
                  >
                    {formulaOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {}
          {/* ======================================= */}
          {/* SEMESTER GRID                             */}
          {/* ======================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10 items-start">
            {semesters.map((sem, idx) => (
              <SemesterCard
                key={sem.id}
                semester={sem}
                index={idx}
                onChange={updateSemester}
                onRemove={removeSemester}
                formula={formula}
                isLocked={isLocked}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button onClick={addSemester} className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-600 bg-slate-800/30 text-sm font-medium hover:bg-slate-800/60 transition-colors"><Plus size={18} /> Add Semester</button>
            <button onClick={calculate} className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 transition-all"><Calculator size={18} /> Calculate Your CGPA</button>
          </div>

          {result && (
            <div ref={resultRef} className="flex flex-col lg:flex-row items-center justify-between p-8 border border-brand-primary/30 rounded-2xl bg-gradient-to-r from-brand-secondary/10 via-[#0c142a] to-[#0c142a] gap-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6 min-w-max">
                <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center"><Trophy size={32} className="text-brand-primary" /></div>
                <div>
                  <p className="text-brand-primary text-sm font-medium mb-1">Your CGPA is</p>
                  <strong className="text-6xl font-black text-white">{result.cgpa.toFixed(2)}</strong>
                </div>
              </div>
              <div className="flex-1 border-l border-slate-700/50 pl-10">
                <h3 className="text-brand-accent text-sm font-semibold mb-3">Calculation Details</h3>
                <div className="flex flex-col gap-2 text-sm text-slate-300 font-mono">
                  {result.formulaUsed === "weighted" ? (
                    <>
                      <div className="flex justify-between max-w-xs"><span>Total Credit Hours</span><span className="text-white">: {result.totalCredits.toFixed(1)}</span></div>
                      <div className="flex justify-between max-w-xs"><span>Total (Point × Credit)</span><span className="text-white">: {result.totalPoints.toFixed(1)}</span></div>
                    </>
                  ) : (
                    <div className="flex justify-between max-w-xs"><span>Semesters Counted</span><span className="text-white">: {result.semesterCount}</span></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {}
        {/* Feature & Navigation Links */}
        <section className="max-w-[1100px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <Link to="/TargetCGPA" className="relative flex gap-4 items-start p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-brand-accent/50 hover:bg-slate-800/40 transition-all cursor-pointer group">
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-600 group-hover:text-brand-accent transition-colors" />
            <span className="p-3 rounded-lg bg-brand-accent/10 text-brand-accent group-hover:scale-110 transition-transform"><Target size={20} /></span>
            <div className="pr-4">
              <h4 className="text-slate-200 font-medium text-sm mb-1 group-hover:text-brand-accent transition-colors">Target Planner</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Calculate exactly how much SGPA you need in your upcoming semesters to hit your dream CGPA.</p>
            </div>
          </Link>

          <Link to="/percentage-converter" className="relative flex gap-4 items-start p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-blue-400/50 hover:bg-slate-800/40 transition-all cursor-pointer group">
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
            <span className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform"><TrendingUp size={20} /></span>
            <div className="pr-4">
              <h4 className="text-slate-200 font-medium text-sm mb-1 group-hover:text-blue-400 transition-colors">Percentage Converter</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Quickly convert your 10-point scale CGPA into a standard percentage format for resumes.</p>
            </div>
          </Link>

          <Link to="/faq" className="relative flex gap-4 items-start p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-brand-primary/50 hover:bg-slate-800/40 transition-all cursor-pointer group">
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-600 group-hover:text-brand-primary transition-colors" />
            <span className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform"><HelpCircle size={20} /></span>
            <div className="pr-4">
              <h4 className="text-slate-200 font-medium text-sm mb-1 group-hover:text-brand-primary transition-colors">FAQ & Guide</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Confused about formulas, SGPA vs CGPA, or credits? Read our FAQ to clear your doubts instantly.</p>
            </div>
          </Link>
        </section>
      </main>

      {}
      {/* Floating Auth Prompt for Unauthenticated Users */}
      {showAuthPrompt && !isAuthenticated && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
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
