import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, Menu, X, Calculator, Target, TrendingUp, HelpCircle, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import scholar from "../Images/scholar.png";
import { useAuth } from "../../Context/AuthContext"; // Adjust path if your context is named differently
import toast from "react-hot-toast";

export function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 text-[21px] font-bold whitespace-nowrap">
      <span className="w-12 h-10 grid place-items-center text-brand-secondary">
        <img src={scholar} alt="scholar" width={40} height={40} />
      </span>
      <span><b className="text-brand-primary">CGPA</b> </span>
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    closeMenu();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-brand-primary/20 bg-[#060b18]/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full w-[min(1380px,calc(100%-32px))] mx-auto md:w-[min(1380px,calc(100%-72px))]">
        <Logo onClick={closeMenu} />
        
        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-9 mr-auto ml-11">
          <Link className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`} to="/">
            <HomeIcon size={16} /> Home
          </Link>
          <Link className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/calculator") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`} to="/calculator">
            Calculator
          </Link>
          <Link className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/TargetCGPA") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`} to="/TargetCGPA">
            Target CGPA
          </Link>
          <Link className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/percentage-converter") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`} to="/percentage-converter">
            CGPA to %
          </Link>
          <Link className={`text-sm flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive("/faq") ? "text-brand-primary border-brand-primary" : "text-slate-300 border-transparent hover:text-brand-primary hover:border-brand-primary/50"}`} to="/faq">
            FAQ
          </Link>
        </nav>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4 relative">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium hidden lg:block">{user?.name?.split(' ')[0] || 'Profile'}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0c142a] border border-brand-primary/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-800/80 mb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Signed in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate">{user?.email}</p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={closeMenu} className="px-4 py-2.5 text-sm text-emerald-400 hover:bg-slate-800/50 flex items-center gap-3 transition-colors">
                      <ShieldCheck size={16} /> Admin Panel
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-sm text-pink-400 hover:bg-pink-950/30 flex items-center gap-3 text-left w-full transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="px-6 py-2 rounded-lg border border-brand-primary bg-slate-900/60 text-white font-bold text-sm hover:-translate-y-[1px] transition-transform" to="/signin">
                Sign In
              </Link>
              <Link className="px-6 py-2 rounded-lg bg-btn-gradient shadow-[0_8px_25px_rgba(190,54,255,0.18)] text-white font-bold text-sm hover:-translate-y-[1px] transition-transform" to="/signup">
                Sign Up
              </Link>
            </>
          )}
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

          <div className="mt-auto pt-8 flex flex-col gap-4 pb-10 border-t border-slate-800/60 mt-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-2">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <User size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-base truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <Link onClick={closeMenu} to="/admin" className="w-full py-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-900/20 text-emerald-400 font-bold text-base transition-colors">
                    <ShieldCheck size={18} /> Admin Panel
                  </Link>
                )}
                
                <button onClick={handleLogout} className="w-full py-4 flex items-center justify-center gap-2 rounded-xl border border-pink-500/30 bg-pink-900/20 text-pink-400 font-bold text-base transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link onClick={closeMenu} to="/signin" className="w-full py-4 text-center rounded-xl border border-brand-primary bg-slate-900/60 text-white font-bold text-base active:bg-slate-800 transition-colors">
                  Sign In
                </Link>
                <Link onClick={closeMenu} to="/signup" className="w-full py-4 text-center rounded-xl bg-btn-gradient shadow-[0_8px_25px_rgba(190,54,255,0.18)] text-white font-bold text-base active:brightness-90 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}