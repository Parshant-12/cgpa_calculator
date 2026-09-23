import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import MotionCard from "../Components/MotionCard";
import { ArrowRightLeft, ChevronDown } from "lucide-react";

export default function PercentageConverter() {
  const [cgpa, setCgpa] = useState("");
  const [multiplier, setMultiplier] = useState("9.5");
  const [percentage, setPercentage] = useState("");
  const [mode, setMode] = useState("cgpaToPercent"); // or "percentToCgpa"

  const handleCgpaChange = (val) => {
    setCgpa(val);
    if (!val || isNaN(val)) {
      setPercentage("");
      return;
    }
    const res = Number(val) * Number(multiplier);
    setPercentage(Math.min(100, Math.max(0, res)).toFixed(2));
  };

  const handlePercentChange = (val) => {
    setPercentage(val);
    if (!val || isNaN(val)) {
      setCgpa("");
      return;
    }
    const res = Number(val) / Number(multiplier);
    setCgpa(Math.min(10, Math.max(0, res)).toFixed(2));
  };

  const toggleMode = () => {
    setMode(mode === "cgpaToPercent" ? "percentToCgpa" : "cgpaToPercent");
    setCgpa("");
    setPercentage("");
  };

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-[700px] mx-auto p-4 md:p-8">
        <section className="text-center pt-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            CGPA <span className="text-brand-accent">Converter</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Quickly convert your 10-point scale CGPA to a percentage and vice versa.
          </p>
        </section>

        <MotionCard hover={false}>
        <div className="p-6 md:p-10 border border-slate-700/40 rounded-3xl bg-[#091022]/90 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-end mb-8">
            <div className="w-64">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Conversion Multiplier</label>
              <div className="relative">
                <select
                  value={multiplier}
                  onChange={(e) => {
                    setMultiplier(e.target.value);
                    setCgpa("");
                    setPercentage("");
                  }}
                  className="w-full h-10 pl-3 pr-10 bg-[#060b18] border border-slate-700/50 rounded-lg text-slate-300 text-xs outline-none focus:border-brand-primary appearance-none cursor-pointer transition-all"
                >
                  <option value="9.5">Standard AICTE Formula (× 9.5)</option>
                  <option value="10">Direct 10-Point Scale (× 10.0)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
              </div>
            </div>

            <button
              onClick={toggleMode}
              className="flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors bg-brand-primary/10 border border-brand-primary/30 px-4 py-2.5 rounded-lg h-10"
            >
              <ArrowRightLeft size={14} /> Switch Direction
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* LEFT SIDE - ALWAYS ACTIVE INPUT */}
            <div className="w-full relative">
              <label className="block text-xs text-brand-primary mb-1.5 font-medium">
                {mode === "cgpaToPercent" ? "Enter CGPA (0 - 10)" : "Enter Percentage (0 - 100%)"}
              </label>
              <input
                type="number" step="0.01" 
                min="0" max={mode === "cgpaToPercent" ? "10" : "100"} 
                placeholder={mode === "cgpaToPercent" ? "e.g. 8.2" : "e.g. 77.9"}
                value={mode === "cgpaToPercent" ? cgpa : percentage}
                onChange={(e) => mode === "cgpaToPercent" ? handleCgpaChange(e.target.value) : handlePercentChange(e.target.value)}
                className="w-full h-14 px-4 rounded-xl text-lg font-bold outline-none border transition-all bg-[#060b18] border-brand-primary/50 text-white focus:border-brand-primary focus:shadow-[0_0_15px_rgba(167,92,255,0.15)]"
              />
            </div>

            <div className="hidden md:block mt-6 text-slate-600">
              <ArrowRightLeft size={24} />
            </div>

            {/* RIGHT SIDE - ALWAYS READ ONLY RESULT */}
            <div className="w-full">
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                {mode === "cgpaToPercent" ? "Calculated Percentage" : "Calculated CGPA"}
              </label>
              <input
                type="text"
                readOnly
                placeholder="Result"
                value={mode === "cgpaToPercent" ? (percentage ? `${percentage}%` : "") : (cgpa ? cgpa : "")}
                className="w-full h-14 px-4 rounded-xl text-lg font-bold outline-none border transition-all bg-[#0c152c] border-slate-700/50 text-brand-accent cursor-default pointer-events-none"
              />
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/30 text-center text-xs font-mono text-slate-500">
            Formula applied: {mode === "cgpaToPercent" ? `Percentage = CGPA × ${multiplier}` : `CGPA = Percentage ÷ ${multiplier}`}
          </div>
        </div>
        </MotionCard>
      </main>
    </div>
  );
}