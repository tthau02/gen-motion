/* eslint-disable @remotion/non-pure-animation */
import React from "react";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  activeProject: string;
}

export const Header: React.FC<HeaderProps> = ({ activeProject }) => {
  return (
    <header className="h-10 border-b border-[#2b2420] flex items-center justify-between px-4 bg-[#1b1714] shrink-0">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 font-bold tracking-widest text-vintage-gold text-xs uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Remotion Editor</span>
        </div>
        <nav className="flex items-center gap-4 text-xs text-[#a3978f]">
          {["File", "View", "Composition", "Tools", "Help"].map((menu) => (
            <button key={menu} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0">
              {menu}
            </button>
          ))}
        </nav>
      </div>

      <div className="text-xs text-[#8f8278] font-mono">
        video-remo / <span className="text-vintage-paper">{activeProject}</span>
      </div>
    </header>
  );
};
