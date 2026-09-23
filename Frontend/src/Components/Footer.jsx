import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Activity } from "lucide-react";
import scholar from "../Images/scholar.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060b18] border-t border-slate-800/60 pt-12 pb-6 relative z-5">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand & Hits Counter */}
          <div className="flex flex-col items-start gap-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 text-[21px] font-bold">
              <span className="w-10 h-10 grid place-items-center text-brand-secondary">
                <img src={scholar} alt="scholar" width={36} height={36} />
              </span>
              <span className="brand-wordmark">CGPA Hub</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              The ultimate tool for college students to plan, calculate, and achieve their academic goals.
            </p>
            
            {/* Space for Hits Counter */}
            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-700/50 rounded-lg shadow-[0_0_15px_rgba(167,92,255,0.05)]">
              <Activity size={16} className="text-brand-accent animate-pulse" />
              <span className="text-xs text-slate-400 font-mono tracking-wider">
                HITS: <span className="text-slate-200 font-bold">------</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:items-center">
            <h3 className="text-slate-200 font-semibold mb-2">Quick Links</h3>
            <Link to="/" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/calculator" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Calculator</Link>
            <Link to="/TargetCGPA" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Target CGPA</Link>
            <Link to="/percentage-converter" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">CGPA to %</Link>
            <Link to="/faq" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">FAQ</Link>
            <Link to="/contribute" onClick={scrollToTop} className="text-sm text-brand-primary hover:text-brand-accent transition-colors font-medium">Contribute by Adding College</Link>
            <Link to="/ReportCollege" onClick={scrollToTop} className="text-sm text-brand-primary hover:text-brand-accent transition-colors font-medium">Report Missing College</Link>
          </div>

          {/* Connect / Actions */}
          <div className="flex flex-col gap-3 md:items-end">
            <h3 className="text-slate-200 font-semibold mb-2">Account</h3>
            <Link to="/signin" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Sign In</Link>
            <Link to="/signup" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Create Free Account</Link>
            <Link to="/admin" onClick={scrollToTop} className="text-sm text-slate-400 hover:text-brand-primary transition-colors">Admin Panel</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800/60 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          
          <div className="text-slate-500 text-xs text-center md:text-left">
            <p className="mb-1">© {new Date().getFullYear()} CGPA Hub. All rights reserved.</p>
            <p>
              Developed with 💜 by <span className="text-slate-300 font-semibold">Parshant Kumar</span> & <span className="text-slate-300 font-semibold">Manav Sehgal</span>
            </p>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700/50 rounded-full text-xs text-slate-400 hover:text-brand-primary hover:border-brand-primary/50 transition-all shadow-lg"
          >
            Go to top 
            <span className="p-1 rounded-full bg-slate-800 group-hover:bg-brand-primary/20 transition-colors">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>

        </div>
      </div>
    </footer>
  );
}