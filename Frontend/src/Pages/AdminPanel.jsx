import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { 
  ShieldCheck, Plus, X, Send, Building, BookOpen, AlertCircle, 
  CheckCircle2, Database, Edit2, Trash2 
} from "lucide-react";
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const { token } = useAuth();
  
  // --- States ---
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle"); // idle, submitting
  
  // Edit mode tracking
  const [isEditing, setIsEditing] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState(null);
  
  const initialFormState = {
    collegeId: "",
    collegeName: "",
    branchId: "",
    branchName: "",
    formula: "weighted",
    credits: ["", "", "", "", "", "", "", ""] // Default 8 semesters
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Fetch Colleges on Mount ---
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/colleges');
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      }
    } catch (err) {
      toast.error("Failed to load college database");
    } finally {
      setLoading(false);
    }
  };

  // --- Form Handlers ---
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCollegeId(null);
    setFormData(initialFormState);
  };

  const handleEditClick = (college, branch) => {
    setIsEditing(true);
    setEditingCollegeId(college._id);
    setFormData({
      collegeId: college.collegeId,
      collegeName: college.name,
      branchId: branch.branchId,
      branchName: branch.name,
      formula: branch.formula,
      credits: branch.credits
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- API Calls (Submit & Delete) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const finalCredits = formData.credits.filter(c => c !== "").map(c => Number(c));
    if (finalCredits.length === 0) {
      setStatus("idle");
      return toast.error("Add credit values for at least one semester.");
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
      const url = isEditing 
        ? `http://localhost:5000/api/colleges/${editingCollegeId}/branches/${formData.branchId}`
        : `http://localhost:5000/api/colleges`;
        
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save data");

      toast.success(isEditing ? "Branch updated successfully!" : "Branch added successfully!");
      
      // Reset form but keep college ID/Name to easily add multiple branches to one college
      if (!isEditing) {
        setFormData({ ...initialFormState, collegeId: formData.collegeId, collegeName: formData.collegeName });
      } else {
        handleCancelEdit();
      }
      
      fetchColleges(); // Refresh list
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus("idle");
    }
  };

  const handleDelete = async (collegeId, branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/colleges/${collegeId}/branches/${branchId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      toast.success("Branch deleted successfully");
      fetchColleges();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-[1000px] mx-auto p-4 md:p-8">
        
        {/* Header */}
        <section className="text-center pt-8 pb-10">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-2xl grid place-items-center mb-6">
            <ShieldCheck size={32} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Admin <span className="text-emerald-400">Database</span>
          </h1>
          <p className="text-slate-400 text-sm">Manage colleges, streams, and semester credit formulas.</p>
        </section>

        {/* --- FORM SECTION --- */}
        <form onSubmit={handleSubmit} className={`p-6 md:p-10 border border-emerald-900/30 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl mb-12 transition-all ${isEditing ? 'ring-2 ring-emerald-500/50' : ''}`}>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Building size={20} className="text-emerald-400" /> 
              {isEditing ? "Edit Branch" : "Add New College / Branch"}
            </h3>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">College ID (e.g. cec_landran)</label>
              <input type="text" required disabled={isEditing} placeholder="Unique ID, no spaces"
                value={formData.collegeId} onChange={(e) => setFormData({ ...formData, collegeId: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full College Name</label>
              <input type="text" required placeholder="Chandigarh Engineering College"
                value={formData.collegeName} onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Branch ID (e.g. cse)</label>
              <input type="text" required disabled={isEditing} placeholder="cse"
                value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Branch Name</label>
              <input type="text" required placeholder="B.Tech Computer Science"
                value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Formula</label>
              <select value={formData.formula} onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                className="w-full h-11 px-3 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none"
              >
                <option value="weighted">Weighted by Credits</option>
                <option value="average">Simple Average</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-300 font-bold flex items-center gap-2 text-sm">Semester Credits</h3>
            <button type="button" onClick={addSemester} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
              <Plus size={14} /> Add Semester
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {formData.credits.map((credit, idx) => (
              <div key={idx} className="relative group">
                <label className="block text-[10px] text-slate-500 mb-1 text-center">Sem {idx + 1}</label>
                <input type="number" step="0.5" placeholder="e.g. 24" value={credit} onChange={(e) => handleCreditChange(idx, e.target.value)}
                  className="w-full h-10 px-2 text-center bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-200 text-sm focus:border-emerald-400 outline-none transition-all"
                />
                <button type="button" onClick={() => removeSemester(idx)} className="absolute -top-1 -right-1 bg-pink-500 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={status === "submitting"} className="w-full flex items-center justify-center gap-2 h-12 mt-8 rounded-xl bg-emerald-600 shadow-[0_8px_20px_rgba(5,150,105,0.25)] text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-wait transition-all">
            {status === "submitting" ? "Saving..." : <><Send size={16} /> {isEditing ? "Update Branch Data" : "Save to Database"}</>}
          </button>
        </form>

        {/* --- LIST SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
              <Database size={18} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-white">Live Database</h2>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading database...</div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-10 border border-slate-800 border-dashed rounded-2xl text-slate-500">
              No colleges found in the database.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {colleges.map((college) => (
                <div key={college._id} className="bg-[#0c142a]/80 border border-slate-700/50 rounded-2xl overflow-hidden">
                  
                  <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
                    <h3 className="text-lg font-bold text-white">{college.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">ID: {college.collegeId}</p>
                  </div>
                  
                  <div className="p-5 flex flex-col gap-4">
                    {college.branches.length === 0 ? (
                      <p className="text-sm text-slate-500">No branches added yet.</p>
                    ) : (
                      college.branches.map(branch => (
                        <div key={branch._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700/40 bg-[#060b18]">
                          
                          <div className="flex-1">
                            <h4 className="text-emerald-400 font-semibold text-sm mb-1">{branch.name}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span className="font-mono">ID: {branch.branchId}</span>
                              <span className="capitalize text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">{branch.formula}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {branch.credits.map((cr, i) => (
                                <div key={i} className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                                  S{i+1}: <b className="text-white">{cr}</b>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 md:flex-col md:w-28">
                            <button onClick={() => handleEditClick(college, branch)} className="flex-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-colors">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => handleDelete(college._id, branch.branchId)} className="flex-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-pink-950/30 text-pink-500 border border-pink-900/40 text-xs font-medium hover:bg-pink-900/50 hover:text-pink-400 transition-colors">
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                          
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}