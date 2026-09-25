import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import MotionCard from "../Components/MotionCard";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the difference between SGPA and CGPA?",
    answer: "SGPA (Semester Grade Point Average) is your performance in a single specific semester. CGPA (Cumulative Grade Point Average) is the overall average of all your semesters combined, weighted by the credit hours of each semester."
  },
  {
    question: "Which formula should I select?",
    answer: "Most universities use the 'Weighted by Credits' formula, which multiplies each semester's SGPA by its total credits before averaging. Only select 'Simple Average' if your specific college explicitly calculates CGPA without factoring in credit weights."
  },
  {
    question: "How does the Target Planner work?",
    answer: "The Target Planner uses your current CGPA, completed credits, and upcoming credits to reverse-engineer the exact SGPA you need to maintain in the future to hit your goal. It mathematically proves if your target is achievable."
  },
  {
    question: "Why use 9.5 to calculate percentage?",
    answer: "The 9.5 multiplier is the standard formula historically used by CBSE and adopted by many universities (like AICTE guidelines) to convert a 10-point scale CGPA into a percentage. Some universities use a direct 10.0 multiplier. Check your university guidelines to be sure."
  },
  {
    question: "Is my grade data saved on a server?",
    answer: "Currently, all calculations are performed directly in your browser. Your grades, credits, and targets are not saved to any database, ensuring complete privacy."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="relative z-10 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-[800px] mx-auto p-4 md:p-8">
        <section className="text-center pt-8 pb-10">
          <div className="w-16 h-16 mx-auto bg-brand-primary/10 border border-brand-primary/30 rounded-2xl grid place-items-center mb-6">
            <HelpCircle size={32} className="text-brand-primary drop-shadow-[0_0_10px_rgba(167,92,255,0.6)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Frequently Asked <span className="text-brand-primary">Questions</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Everything you need to know about calculating and managing your academic scores.
          </p>
        </section>

        <section className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <MotionCard key={index} delay={index * 0.06} hover={false}>
              <div 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? "bg-[#0c142a]/90 border-brand-primary/50 shadow-[0_0_20px_rgba(167,92,255,0.15)]" 
                    : "bg-[#091022]/80 border-slate-700/40 hover:border-brand-primary/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer outline-none"
                >
                  <span className={`font-semibold text-sm md:text-base ${isOpen ? "text-brand-primary" : "text-slate-200"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "text-brand-primary rotate-180" : "text-slate-500"}`} 
                  />
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 pt-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/30 mt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
              </MotionCard>
            );
          })}
        </section>
      </main>
    </div>
  );
}