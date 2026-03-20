import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { AlertTriangle, Search, ShieldCheck, FileCheck, CheckCircle, Loader2, ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlowChart from "@/components/ripe/FlowChart";
import { EventDetailsPanel, RiskBreakdownPanel, FraudAnalysisPanel, DecisionPanel, PayoutPanel } from "@/components/ripe/SimulationPanels";
import Navbar from "@/components/ripe/Navbar";
import { cn } from "@/lib/utils";

const scenarioMeta: Record<string, { label: string; emoji: string }> = {
  rain: { label: "Heavy Rain", emoji: "🌧️" },
  heat: { label: "Extreme Heat", emoji: "🔥" },
  pollution: { label: "Pollution Spike", emoji: "😷" },
  curfew: { label: "Curfew / Zone Closure", emoji: "🚫" },
  downtime: { label: "App Downtime", emoji: "📉" },
};

const steps = [
  { label: "Event Detected", desc: "External disruption confirmed via real-time data feeds.", icon: AlertTriangle },
  { label: "Analyzing Worker Exposure", desc: "Evaluating impact on delivery zone and shift schedule.", icon: Search },
  { label: "Running Fraud Checks", desc: "Multi-signal verification — GPS, activity, duplicates.", icon: ShieldCheck },
  { label: "Claim Automatically Triggered", desc: "Parametric threshold met — claim filed with full audit trail.", icon: FileCheck },
  { label: "Payout Processed", desc: "Funds transferred to wallet via UPI in 8.2 seconds.", icon: CheckCircle },
];

const Simulation = () => {
  const { scenarioId } = useParams();
  const id = scenarioId || "rain";
  const meta = scenarioMeta[id] || scenarioMeta.rain;
  const [traceId] = useState(() => `#RPE-${Math.floor(10000 + Math.random() * 89999)}`);

  const [currentStep, setCurrentStep] = useState(-1);
  const [started, setStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (currentStep >= steps.length - 1) {
      const t = setTimeout(() => setShowExplanation(true), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentStep((s) => s + 1), 1800);
    return () => clearTimeout(t);
  }, [currentStep, started]);

  const handleStart = () => {
    setStarted(true);
    setCurrentStep(0);
  };

  const scenarioData = { scenarioId: id, label: meta.label };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">
        <Link to="/scenarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scenarios
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {meta.emoji} {meta.label} Simulation
            </h1>
            <p className="text-muted-foreground mt-1">RIPE's AI pipeline processing this disruption in real-time.</p>
          </div>
          {started && (
            <span className="text-[11px] font-mono text-muted-foreground bg-secondary/40 px-3 py-1 rounded-full">
              Trace: {traceId}
            </span>
          )}
        </motion.div>

        {!started ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <p className="text-6xl mb-4">{meta.emoji}</p>
            <h2 className="text-xl font-bold mb-2">Ready to simulate?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This will trigger RIPE's real-time AI pipeline — from event detection to instant payout.
            </p>
            <Button variant="hero" size="xl" onClick={handleStart}>
              Start Simulation
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Step executor + Event Details side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-3 glass rounded-2xl p-6">
                <div className="space-y-4">
                  {steps.map((step, i) => {
                    const isActive = i <= currentStep;
                    const isCurrent = i === currentStep;
                    const isDone = i < currentStep;
                    const Icon = step.icon;

                    return (
                      <AnimatePresence key={i}>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-xl transition-all duration-500",
                              isCurrent && "bg-primary/5 glow-primary",
                              isDone && "opacity-70"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500",
                              isDone ? "bg-primary/10 text-primary" : isCurrent ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {isCurrent && !isDone ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : isDone ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="pt-0.5">
                              <p className="font-semibold">{step.label}</p>
                              <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <EventDetailsPanel scenario={scenarioData} />
              </div>
            </div>

            {/* Analysis panels - show progressively */}
            <AnimatePresence>
              {currentStep >= 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <RiskBreakdownPanel scenario={scenarioData} />
                  {currentStep >= 2 && <FraudAnalysisPanel />}
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentStep >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DecisionPanel scenario={scenarioData} />
                  {currentStep >= 4 && <PayoutPanel scenario={scenarioData} />}
                </div>
              )}
            </AnimatePresence>

            {/* Flowchart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 mb-6"
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">System Pipeline</h3>
              <FlowChart currentStep={currentStep} traceId={traceId} />
            </motion.div>

            {/* AI Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-2xl p-6 glow-accent"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold">Why did you receive this payout?</h3>
                    </div>
                    <span className="text-[10px] font-mono text-accent/60">Powered by Qwen 3 32B</span>
                  </div>
                  <TypeWriter text={`Based on real-time environmental data, ${meta.label.toLowerCase()} was detected in your delivery zone at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}. Your scheduled shift overlapped with the disruption window. The AI risk engine assessed a composite risk score above the parametric threshold after analyzing weather severity, zone flood history, and your exposure duration. Automated fraud verification confirmed your GPS location, validated normal activity patterns, and cleared duplicate claim checks (fraud score: 0.12). The parametric claim was auto-triggered and processed to your UPI wallet within 8.2 seconds. AI Confidence: 96.3%.`} />
                  <div className="mt-6 flex gap-3">
                    <Link to="/dashboard">
                      <Button variant="hero" size="lg">View Dashboard</Button>
                    </Link>
                    <Link to="/scenarios">
                      <Button variant="glass" size="lg">Try Another Scenario</Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
};

const TypeWriter = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-primary/60 animate-glow-pulse ml-0.5 align-middle" />
    </p>
  );
};

export default Simulation;
