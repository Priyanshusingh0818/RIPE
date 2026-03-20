import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CloudRain, Brain, Scale, ShieldCheck, FileCheck, Wallet, Cpu, Sparkles, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ripe/Navbar";
import { cn } from "@/lib/utils";

interface ArchNode {
  id: string;
  icon: typeof User;
  label: string;
  sublabel: string;
  tooltip: string;
  group: string;
  color: string;
}

const archNodes: ArchNode[] = [
  {
    id: "user", icon: User, label: "User Input", sublabel: "Persona • Location • Income",
    tooltip: "Collects worker profile — delivery platform, zone coordinates, and weekly earnings baseline for risk calibration.",
    group: "input", color: "primary",
  },
  {
    id: "event", icon: CloudRain, label: "Event Stream", sublabel: "Rain • Heat • AQI • Curfew • Downtime",
    tooltip: "Ingests real-time environmental feeds — IMD weather API, CPCB air quality, platform status monitors, and municipal alerts.",
    group: "input", color: "primary",
  },
  {
    id: "risk", icon: Brain, label: "Risk Engine", sublabel: "Multi-factor scoring",
    tooltip: "Calculates composite risk score using weather severity, zone flood history, worker exposure duration, and historical claim patterns.",
    group: "core", color: "primary",
  },
  {
    id: "pricing", icon: Cpu, label: "Pricing Engine", sublabel: "Dynamic premium calc",
    tooltip: "Computes personalized premiums based on zone risk tier, coverage level, claim frequency, and actuarial loss ratios.",
    group: "core", color: "primary",
  },
  {
    id: "fraud", icon: ShieldCheck, label: "Fraud Engine", sublabel: "Multi-signal verification",
    tooltip: "Validates claims through GPS location cross-check, activity pattern analysis, duplicate detection, and behavioral anomaly scoring.",
    group: "core", color: "primary",
  },
  {
    id: "decision", icon: Scale, label: "Decision Engine", sublabel: "Parametric threshold evaluation",
    tooltip: "Central orchestrator — evaluates all engine outputs against parametric thresholds to auto-approve or flag claims. Zero human intervention.",
    group: "decision", color: "accent",
  },
  {
    id: "claim", icon: FileCheck, label: "Claim Engine", sublabel: "Auto-filed in <2s",
    tooltip: "Generates claim record with full audit trail — event evidence, risk factors, fraud clearance, and payout calculation breakdown.",
    group: "output", color: "primary",
  },
  {
    id: "payout", icon: Wallet, label: "Payout System", sublabel: "Instant UPI transfer",
    tooltip: "Processes instant disbursement via UPI/wallet integration. Average settlement: 8 seconds from event detection to funds arrival.",
    group: "output", color: "primary",
  },
  {
    id: "ai", icon: Sparkles, label: "AI Explanation", sublabel: "Qwen 3 32B",
    tooltip: "Generates human-readable claim explanations using Qwen 3 32B — covers event context, risk reasoning, and payout breakdown for full transparency.",
    group: "output", color: "accent",
  },
];

const groupColors: Record<string, string> = {
  input: "border-primary/20",
  core: "border-primary/20",
  decision: "border-accent/30",
  output: "border-primary/20",
};

const groupLabels: Record<string, string> = {
  input: "Data Ingestion",
  core: "Core Engines",
  decision: "Orchestration",
  output: "Settlement & Explainability",
};

const stepOrder = ["user", "event", "risk", "pricing", "fraud", "decision", "claim", "payout", "ai"];

const Architecture = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!simulationActive) return;
    if (activeIndex >= stepOrder.length - 1) return;
    const t = setTimeout(() => setActiveIndex((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [simulationActive, activeIndex]);

  const handleSimulate = () => {
    setActiveIndex(0);
    setSimulationActive(true);
  };

  const handleReset = () => {
    setSimulationActive(false);
    setActiveIndex(-1);
  };

  const isNodeActive = (id: string) => {
    if (!simulationActive) return false;
    return stepOrder.indexOf(id) <= activeIndex;
  };

  const isNodeCurrent = (id: string) => {
    if (!simulationActive) return false;
    return stepOrder.indexOf(id) === activeIndex;
  };

  const renderNode = (node: ArchNode) => {
    const Icon = node.icon;
    const active = isNodeActive(node.id);
    const current = isNodeCurrent(node.id);
    const isDecision = node.group === "decision";

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: stepOrder.indexOf(node.id) * 0.06, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        className={cn(
          "relative glass rounded-2xl p-4 transition-all duration-500 cursor-default min-w-[160px]",
          active && "border-primary/40 bg-primary/5",
          current && "glow-primary",
          isDecision && active && "border-accent/40 bg-accent/5",
          isDecision && current && "glow-accent",
          !active && !simulationActive && "hover:border-muted-foreground/20 hover:bg-secondary/20",
        )}
      >
        {current && (
          <motion.div
            className={cn("absolute inset-0 rounded-2xl", isDecision ? "bg-accent/5" : "bg-primary/5")}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="relative flex flex-col items-center text-center gap-2">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-500",
            active
              ? isDecision ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
              : "bg-muted/50 text-muted-foreground"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className={cn("text-xs font-bold transition-colors", active ? "text-foreground" : "text-muted-foreground")}>{node.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{node.sublabel}</p>
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredNode === node.id && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 glass-strong rounded-xl p-3 pointer-events-none"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">{node.tooltip}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 glass-strong border-r border-b border-border/60" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const Arrow = ({ active, index }: { active: boolean; index: number }) => (
    <div className="flex items-center mx-1 shrink-0">
      <div className="relative w-6 h-[2px]">
        <div className="absolute inset-0 bg-border/30 rounded-full" />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-primary rounded-full origin-left"
        />
      </div>
      <div className={cn(
        "w-0 h-0 border-l-[4px] border-y-[3px] border-y-transparent transition-colors duration-300",
        active ? "border-l-primary" : "border-l-border/30"
      )} />
    </div>
  );

  const groups = ["input", "core", "decision", "output"];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
          <p className="text-muted-foreground mt-1">How RIPE's AI pipeline processes disruptions — from detection to instant payout.</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          {!simulationActive ? (
            <Button variant="hero" size="lg" onClick={handleSimulate}>
              <Play className="w-4 h-4" /> Run Simulation
            </Button>
          ) : (
            <Button variant="glass" size="lg" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          )}
          {simulationActive && activeIndex >= stepOrder.length - 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-primary font-medium"
            >
              ✓ Pipeline complete — payout settled in 8.2s
            </motion.span>
          )}
        </motion.div>

        {/* Architecture Flow - Horizontal */}
        <div className="glass rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-start gap-3 min-w-[1100px]">
            {groups.map((groupId, gi) => {
              const groupNodes = archNodes.filter((n) => n.group === groupId);
              return (
                <div key={groupId} className="flex items-center">
                  <div className={cn("rounded-2xl border p-4", groupColors[groupId])}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 text-center">
                      {groupLabels[groupId]}
                    </p>
                    <div className={cn("flex gap-2", groupNodes.length > 2 ? "flex-col" : groupNodes.length === 1 ? "" : "flex-col")}>
                      {groupNodes.map((node) => renderNode(node))}
                    </div>
                  </div>
                  {gi < groups.length - 1 && (
                    <Arrow
                      active={simulationActive && isNodeActive(archNodes.filter((n) => n.group === groups[gi + 1])[0]?.id)}
                      index={gi}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Trace */}
        {simulationActive && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Execution Trace</p>
              <span className="text-[10px] font-mono text-primary/70">ID: #RPE-{Math.floor(10000 + Math.random() * 89999)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stepOrder.map((id, i) => {
                const node = archNodes.find((n) => n.id === id)!;
                const active = i <= activeIndex;
                const current = i === activeIndex;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: active ? 1 : 0.3, scale: active ? 1 : 0.95 }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                      current ? "border-primary/40 bg-primary/10 text-primary" : active ? "border-border/40 bg-secondary/30 text-foreground" : "border-border/20 text-muted-foreground"
                    )}
                  >
                    {node.label}
                    {active && i <= activeIndex && (
                      <span className="ml-1.5 text-primary">✓</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" /> Active Node
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-accent/20 border border-accent/30" /> Decision / AI Layer
          </span>
          <span>Hover nodes for detailed explanations</span>
        </motion.div>
      </main>
    </div>
  );
};

export default Architecture;
