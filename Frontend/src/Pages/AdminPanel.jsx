import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { ShieldCheck, Plus, X, Send, Building, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const { token } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    collegeId: "",
    collegeName: "",
    branchId: "",
    branchName: "",
    formula: "weighted",
    credits: ["", "", "", "", "", "", "", ""] // Default 8 semesters
  });

  const handleCreditChange = (index, value) => {
    const newCredits = [...formData.credits];
    newCredits[index] = value;
    setFormData({ ...formData, credits: newCredits });
  };

  const addSemester = () => setFormData({ ...formData, credits: [...formData.credits, ""] });
  
  const removeSemester = (index) => {
    const newCredits = formData.credits.filter((_, i) => i !== index);
    setFormData({ ...formData, credits: newCredits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Clean up empty credits and convert to numbers
    const finalCredits = formData.credits
      .filter(c => c !== "")
      .map(c => Number(c));

    if (finalCredits.length === 0) {
      setStatus("error");
      setErrorMsg("Please add credit values for at least one semester.");
      return;
    }

    const payload = {
      collegeId: formData.collegeId,
      name: formData.collegeName,
      branch: {
        branchId: formData.branchId,
        name: formData.branchName,
        formula: formData.formula,
        credits: finalCredits
      }
    };

    try {
      const response = await fetch('/api/colleges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to add data");

      setStatus("success");
      toast.success("Data added successfully!");
      // Reset form but keep college info to quickly add another branch to the same college
      setFormData({
        ...formData,
        branchId: "",
        branchName: "",
        credits: ["", "", "", "", "", "", "", ""]
      });
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
      toast.error("Failed to add data.");
    }
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-[900px] mx-auto p-4 md:p-8">
        <section className="text-center pt-8 pb-10">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-2xl grid place-items-center mb-6">
            <ShieldCheck size={32} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Admin <span className="text-emerald-400">Database</span>
          </h1>
          <p className="text-slate-400 text-sm">Add colleges, streams, and semester credit formulas to the live database.</p>
        </section>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 border border-emerald-900/30 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl">
          
          {/* College Details Section */}
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Building size={18} className="text-emerald-400" /> College Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">College ID (e.g. cec_landran)</label>
              <input
                type="text" required placeholder="Unique ID, no spaces"
                value={formData.collegeId} onChange={(e) => setFormData({ ...formData, collegeId: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full College Name</label>
              <input
                type="text" required placeholder="Chandigarh Engineering College"
                value={formData.collegeName} onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Branch Details Section */}
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-400" /> Branch Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Branch ID (e.g. cse)</label>
              <input
                type="text" required placeholder="cse"
                value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Branch Name</label>
              <input
                type="text" required placeholder="B.Tech Computer Science"
                value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Formula</label>
              <select
                value={formData.formula} onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
              >
                <option value="weighted">Weighted by Credits</option>
                <option value="average">Simple Average</option>
              </select>
            </div>
          </div>

          {/* Credits Configuration */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">Semester Credits</h3>
            <button type="button" onClick={addSemester} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
              <Plus size={14} /> Add Semester
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {formData.credits.map((credit, idx) => (
              <div key={idx} className="relative group">
                <label className="block text-[10px] text-slate-500 mb-1 text-center">Sem {idx + 1}</label>
                <input
                  type="number" step="0.5" placeholder="e.g. 24"
                  value={credit} onChange={(e) => handleCreditChange(idx, e.target.value)}
                  className="w-full h-10 px-2 text-center bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
                />
                <button 
                  type="button" onClick={() => removeSemester(idx)}
                  className="absolute -top-1 -right-1 bg-pink-500 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          {status === "error" && (
            <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-pink-950/30 border border-pink-800/40 text-pink-400 text-xs">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {status === "success" && (
            <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs">
              <CheckCircle2 size={16} /> Database updated successfully!
            </div>
          )}

          <button 
            type="submit" disabled={status === "submitting"}
            className="w-full flex items-center justify-center gap-2 h-12 mt-8 rounded-xl bg-emerald-600 shadow-[0_8px_20px_rgba(5,150,105,0.25)] text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-wait transition-all"
          >
            {status === "submitting" ? "Saving to Database..." : <><Send size={16} /> Save to Database</>}
          </button>
        </form>
      </main>
    </div>
  );
}