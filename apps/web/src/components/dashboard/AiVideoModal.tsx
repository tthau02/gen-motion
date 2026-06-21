/* eslint-disable @remotion/non-pure-animation */
import React, { useState } from "react";
import { X, Sparkles, ChevronDown, Video, MessageSquare, Clock, Sliders, Layout } from "lucide-react";

interface AiVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (title: string, description: string, duration: string, tone: string, updateCurrent: boolean, templates: string[], aspectRatio: "16:9" | "9:16") => void;
  isGenerating: boolean;
  defaultUpdateCurrent?: boolean;
}

const TEMPLATE_OPTIONS = [
  { id: "intro", label: "Intro (Opening card)" },
  { id: "documentary", label: "Documentary (Social/Life)" },
  { id: "lifestyle", label: "Lifestyle (Daily Life)" },
  { id: "community", label: "Community (People/Street)" },
  { id: "street_story", label: "Street Story (Urban)" },
  { id: "education", label: "Education (Learning)" },
  { id: "culinary", label: "Culinary (Food/Culture)" },
  { id: "nature", label: "Nature (Outdoor)" },
  { id: "cyberpunk", label: "Cyberpunk (Neon/Tech)" },
  { id: "corporate", label: "Corporate (Business/Finance)" },
  { id: "vintage", label: "Vintage (Retro/Cinema)" },
  { id: "playful", label: "Playful (Gaming/Pop Art)" },
  { id: "react", label: "React Code (Developer)" },
  { id: "precision", label: "Precision (Timer/Steps)" },
  { id: "audio", label: "Audio (Podcast/Sound)" },
  { id: "scale", label: "Scale (Growth/Universe)" },
  { id: "transitions", label: "Transitions (Atmospheric)" },
  { id: "performance", label: "Performance (Metrics)" },
  { id: "outro", label: "Outro (Call to Action)" }
];

export const AiVideoModal: React.FC<AiVideoModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  defaultUpdateCurrent = false
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("20");
  const [customDuration, setCustomDuration] = useState("300");
  const [tone, setTone] = useState("Professional");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [updateCurrent, setUpdateCurrent] = useState(defaultUpdateCurrent);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setUpdateCurrent(defaultUpdateCurrent);
      setSelectedTemplates([]);
      setIsDropdownOpen(false);
      setAspectRatio("16:9");
    }
  }, [isOpen, defaultUpdateCurrent]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isGenerating]);

  React.useEffect(() => {
    if (!isOpen && hasGenerated && !isGenerating) {
      setTitle("");
      setDescription("");
      setHasGenerated(false);
    }
  }, [isOpen, hasGenerated, isGenerating]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setHasGenerated(true);
    const finalDuration = duration === "custom" ? customDuration : duration;
    onGenerate(title, description, finalDuration, tone, updateCurrent, selectedTemplates, aspectRatio);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isGenerating) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4 transition-all animate-fade-in"
    >
      <div className="w-full max-w-[860px] max-h-[85vh] bg-[#1a1613] rounded-xl border border-vintage-gold/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-12 border-b border-[#3e342c]/60 bg-black/40 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vintage-gold" />
            <span className="font-semibold text-xs tracking-wider text-vintage-gold uppercase">
              AI Video Composer
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-[#a3978f] hover:text-white cursor-pointer bg-transparent border-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden h-[500px]">
          {/* Left Panel: Aesthetic Teaser Card */}
          <div className="w-[40%] bg-gradient-to-br from-[#261f1c] to-[#120d0b] p-6 flex flex-col justify-between border-r border-[#3e342c]/40 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-vintage-gold/5 rounded-full filter blur-xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-amber-900/10 rounded-full filter blur-2xl pointer-events-none" />

            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-vintage-gold/10 border border-vintage-gold/25 flex items-center justify-center text-vintage-gold">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Instant Video</h3>
                <p className="text-xs text-[#a3978f] mt-1.5 leading-relaxed font-light">
                  Just define a title and describe your vision. Our advanced AI engine will automatically outline scenes, select templates, draft text descriptions, and configure custom slide effects for your video.
                </p>
              </div>
            </div>

            <div className="border border-vintage-border/30 bg-black/40 rounded-lg p-3 text-[10px] text-vintage-muted leading-relaxed font-mono relative z-10">
              <div className="flex items-center gap-1.5 text-vintage-gold mb-1 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>AI OUTLINER ACTIVE</span>
              </div>
              &bull; Scene parsing based on tone<br />
              &bull; Auto-matching transition types<br />
              &bull; Dynamic duration fitting
            </div>
          </div>

          {/* Right Panel: Clean Entry Form */}
          <form onSubmit={handleSubmit} className="w-[60%] p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-4">
              {/* Video Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>Video Title</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Brand Launch Intro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isGenerating}
                  required
                  className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white placeholder-[#6b5d53] focus:outline-none focus:border-vintage-gold/50"
                />
              </div>

              {/* Video Prompt/Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Prompt / Description</span>
                </label>
                <textarea
                  placeholder="Describe your video in detail. E.g., 'A modern 15-second intro clip highlighting our team's workflow with sleek gradients, dynamic text slides, and geometric patterns...'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isGenerating}
                  required
                  className="w-full h-28 bg-[#110d0b] border border-[#3e342c] rounded p-3 text-xs text-white placeholder-[#6b5d53] focus:outline-none focus:border-vintage-gold/50 resize-none leading-relaxed"
                />
              </div>

              {/* Select Options */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Duration</span>
                  </label>
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isGenerating}
                      className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-vintage-gold/50 appearance-none cursor-pointer"
                    >
                      <option value="15">15 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="45">45 seconds</option>
                      <option value="60">60 seconds (1m)</option>
                      <option value="120">120 seconds (2m)</option>
                      <option value="180">180 seconds (3m)</option>
                      <option value="300">300 seconds (5m)</option>
                      <option value="custom">Custom Duration (Advanced)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-2 text-[#6b5d53] pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                    <Layout className="w-3 h-3" />
                    <span>Aspect Ratio</span>
                  </label>
                  <div className="relative">
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as "16:9" | "9:16")}
                      disabled={isGenerating}
                      className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-vintage-gold/50 appearance-none cursor-pointer"
                    >
                      <option value="16:9">16:9 Horizontal</option>
                      <option value="9:16">9:16 Vertical</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-2 text-[#6b5d53] pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                    <Sliders className="w-3 h-3" />
                    <span>Voice Tone</span>
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      disabled={isGenerating}
                      className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-vintage-gold/50 appearance-none cursor-pointer"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Lively">Lively</option>
                      <option value="Retro">Retro</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-2 text-[#6b5d53] pointer-events-none" />
                  </div>
                </div>
              </div>

              {duration === "custom" && (
                <div className="flex flex-col gap-1.5 animate-fade-in mt-1">
                  <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-vintage-gold" />
                    <span>Custom Duration (Seconds)</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="3600"
                    placeholder="Enter duration in seconds (e.g. 300)"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    disabled={isGenerating}
                    required
                    className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white placeholder-[#6b5d53] focus:outline-none focus:border-vintage-gold/50"
                  />
                </div>
              )}

              {/* Template Selection Dropdown */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-vintage-gold" />
                    <span>Constrain Templates (Optional)</span>
                  </span>
                  {selectedTemplates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTemplates([])}
                      className="text-[9px] text-vintage-gold hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Clear All
                    </button>
                  )}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isGenerating}
                    className="w-full bg-[#110d0b] border border-[#3e342c] rounded px-3 py-2 text-xs text-white text-left focus:outline-none focus:border-vintage-gold/50 cursor-pointer flex justify-between items-center"
                  >
                    <span className="truncate">
                      {selectedTemplates.length === 0
                        ? "Auto (AI chooses templates)"
                        : `${selectedTemplates.length} selected: ${selectedTemplates
                            .map((id) => TEMPLATE_OPTIONS.find((opt) => opt.id === id)?.label.split(" (")[0] || id)
                            .join(", ")}`}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#6b5d53] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 mt-1.5 bg-[#161210] border border-[#3e342c] rounded-lg shadow-2xl z-50 p-2.5 max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1 animate-fade-in">
                        {TEMPLATE_OPTIONS.map((opt) => {
                          const isChecked = selectedTemplates.includes(opt.id);
                          return (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#261f1c] cursor-pointer text-xs text-stone-200 select-none transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedTemplates(selectedTemplates.filter((id) => id !== opt.id));
                                  } else {
                                    setSelectedTemplates([...selectedTemplates, opt.id]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded border-[#3e342c] bg-[#110d0b] accent-vintage-gold cursor-pointer"
                              />
                              <span className={isChecked ? "text-vintage-gold font-medium" : ""}>
                                {opt.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Update Current Video Checkbox */}
              <div className="flex items-center gap-2.5 mt-4 p-2.5 bg-black/20 rounded border border-[#3e342c]/30">
                <input
                  type="checkbox"
                  id="updateCurrent"
                  checked={updateCurrent}
                  onChange={(e) => setUpdateCurrent(e.target.checked)}
                  disabled={isGenerating}
                  className="w-3.5 h-3.5 rounded border-[#3e342c] bg-[#110d0b] accent-vintage-gold cursor-pointer"
                />
                <label
                  htmlFor="updateCurrent"
                  className="text-[10px] text-[#ded9d5] uppercase font-mono tracking-wider cursor-pointer select-none font-medium"
                >
                  Update current video content instead of creating new
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !title.trim() || !description.trim()}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all mt-6 cursor-pointer shadow-md border-none ${
                isGenerating || !title.trim() || !description.trim()
                  ? "bg-[#3e342c]/50 text-[#8f8278] cursor-not-allowed"
                  : "bg-vintage-gold text-black hover:bg-[#b08138] hover:shadow-lg hover:scale-[1.01]"
              }`}
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Composing video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
