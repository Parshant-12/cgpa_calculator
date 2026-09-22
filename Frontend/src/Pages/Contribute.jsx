import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { Send, Building, FileText, Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contribute() {
  const [form, setForm] = useState({
    collegeName: "",
    branchName: "",
    creditStructure: "",
    proofLink: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Basic validation
    if (!form.collegeName || !form.branchName || !form.creditStructure || !form.proofLink) {
      setStatus("error");
      setErrorMsg("Please fill in all fields so we can verify the data.");
      return;
    }

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit contribution.");
      }

      setStatus("success");
      setForm({ collegeName: "", branchName: "", creditStructure: "", proofLink: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to submit contribution.");
    }
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-[750px] mx-auto p-4 md:p-8">
        <section className="text-center pt-8 pb-10">
          <div className="w-16 h-16 mx-auto bg-brand-primary/10 border border-brand-primary/30 rounded-2xl grid place-items-center mb-6">
            <Building size={32} className="text-brand-primary drop-shadow-[0_0_10px_rgba(167,92,255,0.6)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Add Your <span className="text-brand-primary">College</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Help us expand! Submit your college's credit structure, and our team will verify and add it to the calculator for everyone to use.
          </p>
        </section>

        {status === "success" ? (
          <div className="p-10 border border-emerald-500/30 rounded-3xl bg-emerald-950/20 shadow-2xl backdrop-blur-xl text-center animate-in zoom-in-95 duration-300">
            <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your contribution has been submitted. Our team will verify the syllabus proof and add it to the database soon.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="px-6 py-2.5 rounded-xl border border-slate-600 bg-slate-800/50 text-white font-medium text-sm hover:bg-slate-800 transition-all"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full College Name</label>
                  <div className="relative flex items-center">
                    <Building size={16} className="absolute left-3.5 text-slate-500" />
                    <input
                      type="text" required placeholder="e.g. Chandigarh Engineering College"
                      value={form.collegeName} onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Branch / Stream</label>
                  <div className="relative flex items-center">
                    <FileText size={16} className="absolute left-3.5 text-slate-500" />
                    <input
                      type="text" required placeholder="e.g. B.Tech CSE (2024 Scheme)"
                      value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Semester-wise Credits</label>
                <textarea
                  required rows="3" placeholder="e.g. Sem 1: 20, Sem 2: 20, Sem 3: 24, Sem 4: 24..."
                  value={form.creditStructure} onChange={(e) => setForm({ ...form, creditStructure: e.target.value })}
                  className="w-full p-4 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-brand-primary outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-primary mb-1.5 font-medium">Link to Syllabus PDF (Proof)</label>
                <div className="relative flex items-center">
                  <LinkIcon size={16} className="absolute left-3.5 text-brand-primary" />
                  <input
                    type="url" required placeholder="Paste university website link or Google Drive link"
                    value={form.proofLink} onChange={(e) => setForm({ ...form, proofLink: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 bg-[#0c152c] border border-brand-primary/50 rounded-lg text-white text-sm focus:border-brand-primary outline-none transition-all shadow-[0_0_10px_rgba(167,92,255,0.1)]"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  *We need an official document link to verify the formulas and credits before making it public.
                </p>
              </div>
            </div>

            {status === "error" && (
              <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-pink-950/30 border border-pink-800/40 text-pink-400 text-xs">
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === "submitting"}
              className="w-full flex items-center justify-center gap-2 h-12 mt-8 rounded-xl bg-btn-gradient shadow-[0_8px_20px_rgba(231,48,177,0.25)] text-sm font-bold text-white hover:brightness-110 disabled:opacity-70 disabled:cursor-wait transition-all"
            >
              {status === "submitting" ? (
                "Submitting..."
              ) : (
                <>Submit Contribution <Send size={16} /></>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}