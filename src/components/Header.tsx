import React from "react";
import { Building2, Scale } from "lucide-react";

const Header = () => {
  return (
    <header className="header-gradient text-primary-foreground shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-foreground/10 border border-primary-foreground/20">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-sans font-medium uppercase tracking-widest text-primary-foreground/60">
                Cook County
              </span>
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              Sarnoff Property Tax Estimator
            </h1>
            <p className="text-[10px] text-primary-foreground/80 font-sans mt-0.5 line-clamp-1 italic">
              "Increasing Income by Reducing Property Tax"
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-primary-foreground/50 text-xs font-sans">
            <Building2 className="w-3.5 h-3.5" />
            <span>Sarnoff Law Firm</span>
            <span className="px-1.5 py-0.5 rounded text-primary-foreground/70 border border-primary-foreground/20 bg-primary-foreground/5 text-[10px] font-medium uppercase tracking-wide">
              Prototype
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
