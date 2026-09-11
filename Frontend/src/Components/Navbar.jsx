import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Home as HomeIcon, Menu, X, Calculator, Target, TrendingUp, HelpCircle } from "lucide-react";

export function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 text-[21px] font-bold whitespace-nowrap">
      <span className="w-12 h-10 grid place-items-center text-brand-secondary">
        <GraduationCap size={30} />
      </span>
      <span><b className="text-brand-primary">CGPA</b> Calc</span>
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-brand-primary/20 bg-brand-bg/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full w-[min(1380px,calc(100%-32px))] mx-auto md:w-[min(1380px,calc(100%-72px))]">
        <Logo onClick={closeMenu} />
        
        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-9 mr-auto ml-11">
          <Link
            className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`}
            to="/"
          >
            <HomeIcon size={16} /> Home
          </Link>

          <Link
            className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/calculator") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`}
            to="/calculator"
          >
            Calculator
          </Link>

          <Link
            className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/TargetCGPA") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`}
            to="/TargetCGPA"
          >
            Target CGPA
          </Link>

          <Link
            className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/percentage-converter") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`}
            to="/percentage-converter"
          >
            CGPA to %
          </Link>

          <Link
            className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/faq") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`}
            to="/faq"
          >
            FAQ
          </Link>
        </nav>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link className="px-6 py-2 rounded-lg border border-brand-primary bg-slate-900/60 text-white font-bold text-sm hover:-translate-y-[1px] transition-transform" to="/signin">
            Sign In
          </Link>
          <Link className="px-6 py-2 rounded-lg bg-btn-gradient shadow-[0_8px_25px_rgba(190,54,255,0.18)] text-white font-bold text-sm hover:-translate-y-[1px] transition-transform" to="/signup">
            Sign Up
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-brand-primary transition-colors focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-[68px] left-0 w-full h-[calc(100vh-68px)] bg-[#060b18]/95 backdrop-blur-xl border-t border-slate-800/50 flex flex-col p-6 md:hidden overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <Link onClick={closeMenu} to="/" className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive("/") ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:bg-slate-800/50"}`}>
              <HomeIcon size={20} /> <span className="font-medium text-base">Home</span>
            </Link>

            <Link onClick={closeMenu} to="/calculator" className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive("/calculator") ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:bg-slate-800/50"}`}>
              <Calculator size={20} /> <span className="font-medium text-base">Calculator</span>
            </Link>

            <Link onClick={closeMenu} to="/TargetCGPA" className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive("/TargetCGPA") ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:bg-slate-800/50"}`}>
              <Target size={20} /> <span className="font-medium text-base">Target CGPA</span>
            </Link>

            <Link onClick={closeMenu} to="/percentage-converter" className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive("/percentage-converter") ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:bg-slate-800/50"}`}>
              <TrendingUp size={20} /> <span className="font-medium text-base">CGPA to %</span>
            </Link>

            <Link onClick={closeMenu} to="/faq" className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive("/faq") ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:bg-slate-800/50"}`}>
              <HelpCircle size={20} /> <span className="font-medium text-base">FAQ</span>
            </Link>
          </nav>

          <div className="mt-auto pt-8 flex flex-col gap-4 pb-10">
            <Link onClick={closeMenu} to="/signin" className="w-full py-4 text-center rounded-xl border border-brand-primary bg-slate-900/60 text-white font-bold text-base active:bg-slate-800 transition-colors">
              Sign In
            </Link>
            <Link onClick={closeMenu} to="/signup" className="w-full py-4 text-center rounded-xl bg-btn-gradient shadow-[0_8px_25px_rgba(190,54,255,0.18)] text-white font-bold text-base active:brightness-90 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}