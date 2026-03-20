import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { AlertTriangle, Search, ShieldCheck, FileCheck, CheckCircle, Loader2, ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlowChart from "@/components/ripe/FlowChart";
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
  { label: "Analyzing Worker Exposure", desc: "Evaluating impact on your delivery zone and schedule.", icon: Search },
  { label: "Running Fraud Checks", desc: "Verifying legitimacy through multi-signal analysis.", icon: ShieldCheck },
  { label: "Claim Automatically Triggered", desc: "Parametric threshold met — claim filed instantly.", icon: FileCheck },
  { label: "Payout Processed", desc: "₹520 transferred to your wallet.", icon: CheckCircle },
];

const Simulation = () => {
  const { scenarioId } = useParams();
  const meta = scenarioMeta[scenarioId || "rain"] || scenarioMeta.rain;

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

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-16">
        <Link to="/scenarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scenarios
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {meta.emoji} {meta.label} Simulation
          </h1>
          <p className="text-muted-foreground mt-1">Watch RIPE's AI pipeline process this disruption in real-time.</p>
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
            {/* Step executor */}
            <div className="glass rounded-2xl p-6 mb-6">
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

            {/* Flowchart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 mb-6"
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">System Pipeline</h3>
              <FlowChart currentStep={currentStep} />
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
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">Why did you receive ₹520?</h3>
                  </div>
                  <TypeWriter text={`Based on real-time weather data, heavy rainfall (42mm/hr) was detected in your delivery zone at 2:34 PM. Your scheduled shift overlapped with the disruption window by 3.2 hours. The AI risk engine assessed a 72% income loss probability. After automated fraud verification confirmed your location and active status, a parametric claim of ₹520 was triggered and processed to your wallet within 8 seconds.`} />
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

// Typing animation component
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
    }, 18);
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
