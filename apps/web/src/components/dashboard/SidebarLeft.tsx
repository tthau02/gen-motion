/* eslint-disable @remotion/non-pure-animation, @remotion/warn-native-media-tag */
import React from "react";
import {
  Film,
  Layers,
  FolderOpen,
  Search,
  FileVideo,
  Music,
  Monitor,
  Plus
} from "lucide-react";
import { LeftTab, SidebarProject } from "./types";

interface SidebarLeftProps {
  leftTab: LeftTab;
  setLeftTab: (tab: LeftTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProjects: SidebarProject[];
  activeProject: string;
  onProjectSelect: (proj: SidebarProject) => void;
  onNewProject: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  leftTab,
  setLeftTab,
  searchQuery,
  setSearchQuery,
  filteredProjects,
  activeProject,
  onProjectSelect,
  onNewProject
}) => {
  return (
    <section className="w-full h-full border-r border-[#2b2420] flex flex-col bg-[#181412] shrink-0">
      {/* Tabs */}
      <div className="h-11 border-b border-[#2b2420] flex items-center bg-[#1c1815] p-1 gap-1 shrink-0">
        <button
          onClick={() => setLeftTab("compositions")}
          className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer bg-transparent border-none ${leftTab === "compositions"
            ? "bg-[#2d2621] text-vintage-gold"
            : "text-[#8f8278] hover:text-white"
            }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Comps</span>
        </button>
        <button
          onClick={() => setLeftTab("assets")}
          className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer bg-transparent border-none ${leftTab === "assets"
            ? "bg-[#2d2621] text-vintage-gold"
            : "text-[#8f8278] hover:text-white"
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Assets</span>
        </button>
        <button
          onClick={() => setLeftTab("projects")}
          className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer bg-transparent border-none ${leftTab === "projects"
            ? "bg-[#2d2621] text-vintage-gold"
            : "text-[#8f8278] hover:text-white"
            }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>
      </div>

      {/* Search bar inside Sidebar */}
      <div className="p-3 border-b border-[#2b2420]/50 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#110d0b] border border-[#2b2420] rounded px-3 py-1.5 pl-8 text-xs text-white placeholder-[#6b5d53] focus:outline-none focus:border-vintage-gold/50"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6b5d53]" />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {leftTab === "projects" && (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onNewProject}
              className="w-full py-2 px-3 rounded bg-vintage-gold hover:bg-[#b08138] text-black font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none mb-1 shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>NEW VIDEO</span>
            </button>

            <div className="flex items-center justify-between text-xs text-[#8f8278] mb-1">
              <span>LIBRARY TEMPLATES</span>
              <span className="font-mono text-[10px]">{filteredProjects.length} ITEMS</span>
            </div>

            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onProjectSelect(proj)}
                className={`group p-2 rounded border transition-all cursor-pointer flex gap-3 ${activeProject === proj.id
                  ? "bg-[#28211d] border-vintage-gold/50 shadow-md"
                  : "bg-[#1f1a17]/50 border-transparent hover:bg-[#1f1a17]"
                  }`}
              >
                <div className="w-24 h-14 rounded overflow-hidden bg-black/40 border border-[#3e342c]/40 relative shrink-0">
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-mono px-1 rounded text-vintage-gold">
                    {proj.duration}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <span className="font-medium text-xs text-white leading-snug group-hover:text-vintage-gold transition-colors">
                    {proj.title}
                  </span>
                  <span className="text-[10px] text-[#8f8278] uppercase font-mono">
                    {proj.data.scenes.length} Scenes &bull; HD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {leftTab === "compositions" && (
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-[#1e1916]/40 rounded border border-[#3e342c]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-vintage-gold" />
                <span className="text-xs font-semibold text-white">VintageCinematic</span>
              </div>
              <span className="text-[10px] font-mono bg-vintage-gold/15 px-1.5 py-0.5 rounded text-vintage-gold border border-vintage-gold/20">
                ACTIVE
              </span>
            </div>
          </div>
        )}

        {leftTab === "assets" && (
          <div className="grid grid-cols-2 gap-2 text-center">
            {[
              { name: "audio.mp3", type: "Audio", icon: Music },
              { name: "backdrop.jpg", type: "Image", icon: Monitor },
              { name: "still.jpg", type: "Image", icon: Monitor }
            ].map((asset, i) => {
              const Icon = asset.icon;
              return (
                <div
                  key={i}
                  className="p-3 rounded bg-[#1e1916]/40 border border-[#3e342c]/30 hover:border-[#52443a] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Icon className="w-6 h-6 text-[#8f8278]" />
                  <span className="text-[10px] text-white truncate w-full">{asset.name}</span>
                  <span className="text-[8px] text-[#8f8278] uppercase tracking-wider font-mono">
                    {asset.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
