import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Compass, Code } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", {
  weights: ["400", "700"],
});

interface SceneReactProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  codeSnippet?: string;
}

export const SceneReact: React.FC<SceneReactProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  codeSnippet,
}) => {
  return (
    <div className="relative flex flex-row items-center justify-between w-full h-full max-w-[1050px] px-12 gap-12">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-10 scale-[1.08] animate-subtle-drift"
            durationInFrames={151}
          />
        </div>
      )}
      <div className="w-[45%] h-[320px] relative rounded-lg overflow-hidden border border-vintage-border/40 bg-vintage-bg/90 shadow-2xl flex flex-col">
        <div className="h-9 border-b border-vintage-border/30 bg-black/30 flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-vintage-rust/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-vintage-gold/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-vintage-muted/60" />
          </div>
          <span className="text-[9px] text-vintage-muted font-mono tracking-widest">
            Comp.tsx
          </span>
          <Code className="w-3.5 h-3.5 text-vintage-gold" />
        </div>

        <div className="p-5 font-mono text-[10px] leading-relaxed text-vintage-muted/90 flex-1 overflow-hidden">
          {codeSnippet === undefined ||
          codeSnippet.includes("Chào mừng Remotion") ? (
            <>
              <div className="text-vintage-gold font-bold">
                import <span className="text-vintage-paper">React</span> from{" "}
                <span className="text-vintage-rust">"react"</span>;
              </div>
              <div className="text-vintage-gold font-bold">
                import{" "}
                <span className="text-vintage-paper">{"{ Sequence }"}</span>{" "}
                from <span className="text-vintage-rust">"remotion"</span>;
              </div>
              <br />
              <div>
                <span className="text-vintage-gold">export const</span>{" "}
                <span className="text-vintage-paper font-bold">MyVideo</span> =
                () =&gt; {"{"}
              </div>
              <div className="pl-4">return (</div>
              <div className="pl-8 text-vintage-paper">
                &lt;<span className="text-vintage-gold">Sequence</span>&gt;
              </div>
              <div className="pl-12 text-vintage-muted">
                &lt;<span className="text-vintage-gold">div</span> className=
                <span className="text-vintage-rust">"text-gold"</span>&gt;
              </div>
              <div className="pl-16 text-vintage-paper font-bold">
                Chào mừng Remotion
              </div>
              <div className="pl-12">
                &lt;/<span className="text-vintage-gold">div</span>&gt;
              </div>
              <div className="pl-8 text-vintage-paper">
                &lt;/<span className="text-vintage-gold">Sequence</span>&gt;
              </div>
              <div className="pl-4">);</div>
              <div>{"};"}</div>
            </>
          ) : (
            <pre className="text-left w-full h-full overflow-auto whitespace-pre font-mono text-[9px] leading-tight text-vintage-muted">
              {codeSnippet}
            </pre>
          )}
        </div>
      </div>
      <div className="w-[55%] flex flex-col justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Compass
            className="w-4 h-4 text-vintage-gold animate-spin"
            style={{ animationDuration: "12s" }}
          />
          <span
            className="text-vintage-gold font-sans text-xs tracking-widest uppercase font-bold"
            style={{ fontFamily: sansFont }}
          >
            {subtitle}
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 16, type: "spring", damping: 14 }}
          className="text-vintage-paper font-serif text-3xl md:text-4xl leading-tight mb-4 font-bold"
          style={{ fontFamily: serifFont }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-vintage-paper font-sans text-xs md:text-sm leading-relaxed mb-4 font-light"
            style={{ fontFamily: sansFont }}
          >
            {description}
          </MotionDiv>
        )}

        <div className="w-full h-[1px] bg-vintage-border/30 my-3" />
        <span
          className="text-[10px] text-vintage-muted"
          style={{ fontFamily: sansFont }}
        >
          React 19 &bull; Tailwind CSS v4 &bull; Webpack
        </span>
      </div>
    </div>
  );
};
