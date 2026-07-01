/*
  DESIGN: Tactical Command Console
  - Dark gunmetal canvas, tactical amber accent (#F5A623)
  - Asymmetric console: left obstacle library rail, center 3D viewport (hero),
    right inspector panel. Thin top command bar with mode toggles.
  - Fonts: Oxanium (display), Inter Tight (body), JetBrains Mono (data)
*/
import { useState, useMemo, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Boxes,
  Layers3,
  Maximize2,
  Crosshair,
  ChevronRight,
  Activity,
  Ruler,
  Tag,
  Gauge,
  Menu,
  Download,
  Camera,
  Loader2,
} from "lucide-react";
import type { SingleViewerHandle } from "@/components/three/SingleObstacleViewer";
import { OBSTACLES, getObstacle, CATEGORY_COLORS } from "@/lib/obstacles";
import { LAYOUTS, getLayout } from "@/lib/layouts";
import { cn } from "@/lib/utils";

const SingleObstacleViewer = lazy(() => import("@/components/three/SingleObstacleViewer"));
const CourseViewer = lazy(() => import("@/components/three/CourseViewer"));

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663188977782/cWPkKZbm67DNLVJdZLn2vQ/logo-NyfQhuTLMVgMsEyhvGFtAV.webp";

type Mode = "course" | "single";

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-3 rounded-[1px]",
            i < level ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("course");
  const [layoutId, setLayoutId] = useState("standard");
  const [selectedId, setSelectedId] = useState<string>("knotted-rope-climb");
  const [railOpen, setRailOpen] = useState(true);
  const [exporting, setExporting] = useState(false);
  const singleRef = useRef<SingleViewerHandle | null>(null);
  const inspectorRef = useRef<SingleViewerHandle | null>(null);

  const layout = useMemo(() => getLayout(layoutId), [layoutId]);
  const selected = getObstacle(selectedId);

  const activeViewer = () => (mode === "single" ? singleRef.current : inspectorRef.current);

  const handleExportGlb = async () => {
    if (!selected) return;
    const v = activeViewer();
    if (!v) {
      toast.error("3D viewer not ready yet");
      return;
    }
    setExporting(true);
    try {
      await v.exportGlb(`${selected.id}.glb`);
      toast.success(`Exported ${selected.name}.glb`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleCapturePng = () => {
    if (!selected) return;
    const v = activeViewer();
    if (!v) {
      toast.error("3D viewer not ready yet");
      return;
    }
    v.capturePng(`${selected.id}.png`);
    toast.success(`Saved ${selected.name}.png`);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const focusSingle = (id: string) => {
    setSelectedId(id);
    setMode("single");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* ===== COMMAND BAR ===== */}
      <header className="relative z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-3 sm:px-5 h-14 shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-sm hover:bg-secondary"
            onClick={() => setRailOpen((v) => !v)}
            aria-label="Toggle library"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src={LOGO} alt="logo" className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-display font-bold tracking-wide text-sm sm:text-base">
              TACTICAL COURSE <span className="text-primary">VIEWER</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest hidden sm:block">
              OBSTACLE ARSENAL · 16 UNITS · 3D PRESENTATION SYSTEM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary rounded-md p-1">
          <ModeButton active={mode === "course"} onClick={() => setMode("course")} icon={<Layers3 className="h-4 w-4" />} label="COURSE" />
          <ModeButton active={mode === "single"} onClick={() => setMode("single")} icon={<Boxes className="h-4 w-4" />} label="OBSTACLE" />
        </div>
      </header>

      <div className="relative flex flex-1 min-h-0">
        {/* ===== LEFT LIBRARY RAIL ===== */}
        <AnimatePresence>
          {railOpen && (
            <motion.aside
              initial={{ x: -340, opacity: 0.4 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -340, opacity: 0.2 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              className="absolute lg:relative z-10 h-full w-[300px] shrink-0 border-r border-border bg-card flex flex-col"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="font-display font-semibold text-sm tracking-wide flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-primary" /> OBSTACLE ARSENAL
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">16</span>
              </div>
              <div className="flex-1 overflow-y-auto tactical-scrollbar p-2 space-y-1">
                {OBSTACLES.map((o) => {
                  const isSel = selectedId === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => focusSingle(o.id)}
                      className={cn(
                        "w-full text-left rounded-sm border px-3 py-2.5 transition-all duration-150 group",
                        isSel
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-border hover:bg-secondary",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "font-mono text-[11px] font-bold w-6 shrink-0",
                            isSel ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {String(o.index).padStart(2, "0")}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-medium leading-tight truncate">{o.name}</span>
                          {o.aka && (
                            <span className="block font-mono text-[10px] text-muted-foreground truncate">{o.aka}</span>
                          )}
                        </span>
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ background: CATEGORY_COLORS[o.category] }}
                          title={o.category}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ===== CENTER VIEWPORT ===== */}
        <main className="relative flex-1 min-w-0 hud-corners">
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-items-center">
                <div className="font-mono text-xs text-primary animate-pulse">INITIALIZING 3D ENGINE…</div>
              </div>
            }
          >
            {mode === "single" ? (
              <SingleObstacleViewer id={selectedId} ref={singleRef} />
            ) : (
              <CourseViewer layout={layout} selectedId={selectedId} onSelect={handleSelect} />
            )}
          </Suspense>

          {/* viewport HUD overlay */}
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <Activity className="h-3 w-3 text-primary" />
            <span>{mode === "single" ? "SINGLE UNIT INSPECTION" : `COURSE: ${layout.name.toUpperCase()}`}</span>
          </div>

          {/* course layout selector (course mode) */}
          {mode === "course" && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-2xl">
              <div className="rounded-md border border-border bg-card/85 backdrop-blur-md p-2">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Layers3 className="h-3.5 w-3.5 text-primary" />
                  <span className="font-display text-[11px] font-semibold tracking-wide">DEPLOY COURSE LAYOUT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLayoutId(l.id)}
                      className={cn(
                        "rounded-sm border px-2.5 py-1.5 text-left transition-all duration-150",
                        layoutId === l.id
                          ? "border-primary bg-primary/15"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <div className="text-[12px] font-medium leading-tight">{l.name}</div>
                      <div className="font-mono text-[9px] text-muted-foreground">{l.obstacles.length} UNITS</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* single mode focus button */}
          {mode === "course" && selected && (
            <button
              onClick={() => focusSingle(selected.id)}
              className="pointer-events-auto absolute top-3 right-3 flex items-center gap-1.5 rounded-sm border border-border bg-card/85 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono hover:border-primary transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5 text-primary" /> INSPECT {selected.name.toUpperCase()}
            </button>
          )}

          {/* single mode export toolbar */}
          {mode === "single" && selected && (
            <div className="pointer-events-auto absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={handleCapturePng}
                className="flex items-center gap-1.5 rounded-sm border border-border bg-card/85 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono hover:border-primary transition-colors"
              >
                <Camera className="h-3.5 w-3.5 text-primary" /> PNG
              </button>
              <button
                onClick={handleExportGlb}
                disabled={exporting}
                className="flex items-center gap-1.5 rounded-sm bg-primary text-primary-foreground px-3 py-1.5 text-[11px] font-mono font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} EXPORT .GLB
              </button>
            </div>
          )}
        </main>

        {/* ===== RIGHT INSPECTOR ===== */}
        <aside className="hidden xl:flex w-[320px] shrink-0 border-l border-border bg-card flex-col">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary">UNIT {String(selected.index).padStart(2, "0")} / 16</span>
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm"
                    style={{ background: CATEGORY_COLORS[selected.category] + "22", color: CATEGORY_COLORS[selected.category] }}
                  >
                    {selected.category.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold mt-1.5 leading-tight">{selected.name}</h2>
                {selected.aka && <p className="font-mono text-[11px] text-muted-foreground">a.k.a. {selected.aka}</p>}
              </div>

              {/* mini preview when in course mode */}
              {mode === "course" && (
                <div className="h-44 border-b border-border relative">
                  <Suspense fallback={<div className="absolute inset-0 grid place-items-center font-mono text-[10px] text-muted-foreground">…</div>}>
                    <SingleObstacleViewer id={selected.id} ref={inspectorRef} />
                  </Suspense>
                </div>
              )}

              <div className="flex-1 overflow-y-auto tactical-scrollbar p-4 space-y-4">
                <p className="text-[13px] leading-relaxed text-foreground/85">{selected.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <Spec icon={<Ruler className="h-3.5 w-3.5" />} label="HEIGHT" value={`${selected.height} m`} />
                  <Spec icon={<Tag className="h-3.5 w-3.5" />} label="FOOTPRINT" value={`${selected.footprint[0]}×${selected.footprint[1]} m`} />
                </div>

                <div className="rounded-sm border border-border p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Gauge className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider">DIFFICULTY</span>
                  </div>
                  <DifficultyDots level={selected.difficulty} />
                </div>

                {mode === "single" ? (
                  <button
                    onClick={() => setMode("course")}
                    className="w-full flex items-center justify-center gap-1.5 rounded-sm bg-secondary hover:bg-muted border border-border py-2 text-[12px] font-mono transition-colors"
                  >
                    <Layers3 className="h-3.5 w-3.5" /> BACK TO COURSE VIEW
                  </button>
                ) : (
                  <button
                    onClick={() => focusSingle(selected.id)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-sm bg-primary text-primary-foreground py-2 text-[12px] font-mono font-semibold transition-transform active:scale-[0.98]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" /> INSPECT IN 3D
                  </button>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-border font-mono text-[9px] text-muted-foreground flex items-center justify-between">
                <span>DRAG TO ORBIT · SCROLL TO ZOOM</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-muted-foreground font-mono text-xs">SELECT A UNIT</div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-sm px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-semibold tracking-wide transition-all duration-150",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border p-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="font-mono text-[9px] tracking-wider">{label}</span>
      </div>
      <div className="font-display text-sm font-semibold">{value}</div>
    </div>
  );
}
