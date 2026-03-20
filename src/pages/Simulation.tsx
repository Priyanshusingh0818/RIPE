import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { AlertTriangle, Search, ShieldCheck, FileCheck, CheckCircle, Loader2, ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlowChart from "@/components/ripe/FlowChart";
import { EventDetailsPanel, RiskBreakdownPanel, FraudAnalysisPanel, DecisionPanel, PayoutPanel } from "@/components/ripe/SimulationPanels";
import Navbar from "@/components/ripe/Navbar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const scenarioMeta: Record<string, { label: string; emoji: string; eventType: string }> = {
  rain: { label: "Heavy Rain", emoji: "🌧️", eventType: "rain" },
  heat: { label: "Extreme Heat", emoji: "🔥", eventType: "heat" },
  pollution: { label: "Pollution Spike", emoji: "😷", eventType: "pollution" },
  curfew: { label: "Curfew / Zone Closure", emoji: "🚫", eventType: "curfew" },
  downtime: { label: "App Downtime", emoji: "📉", eventType: "app_down" },
};

const stepLabels = [
  { label: "Event Detected", desc: "External disruption confirmed via real-time data feeds.", icon: AlertTriangle },
  { label: "Analyzing Worker Exposure", desc: "Evaluating impact on delivery zone & shift schedule.", icon: Search },
  { label: "Running Fraud Checks", desc: "Multi-signal verification — location, activity, duplicates.", icon: ShieldCheck },
  { label: "Claim Automatically Triggered", desc: "Parametric threshold met — claim filed with audit trail.", icon: FileCheck },
  { label: "Payout Processed", desc: "Funds calculation complete — payout determined.", icon: CheckCircle },
];

const Simulation = () => {
  const { scenarioId } = useParams();
  const id = scenarioId || "rain";
  const meta = scenarioMeta[id] || scenarioMeta.rain;
  const [traceId] = useState(() => `#RPE-${Math.floor(10000 + Math.random() * 89999)}`);

  const [currentStep, setCurrentStep] = useState(-1);
  const [started, setStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // REAL data from backend
  const [eventData, setEventData] = useState<Record<string, unknown> | null>(null);
  const [claimData, setClaimData] = useState<Record<string, unknown> | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get stored user data from onboarding
  const storedUser = JSON.parse(localStorage.getItem("ripe_user") || "null");

  const runPipeline = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Step 0: Simulate event
      setCurrentStep(0);
      const simRes = await api.simulate({ eventType: meta.eventType });
      setEventData(simRes.data.event as unknown as Record<string, unknown>);

      // Step 1: Analyze (brief delay for UX)
      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(1);

      // Step 2: Fraud check + Claim
      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(2);

      // If user is onboarded, run real claim; otherwise create a temp user
      let userId = storedUser?.user?.id;
      if (!userId) {
        // Auto-onboard a default user so the simulation still works
        const onboardRes = await api.onboard({
          name: "Demo User",
          platform: "Zomato",
          location: "Mumbai",
          weeklyIncome: 5000,
        });
        userId = onboardRes.data.user.id;
        localStorage.setItem("ripe_user", JSON.stringify(onboardRes.data));
      }

      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(3);

      const claimRes = await api.claim({ userId, eventType: meta.eventType });
      setClaimData(claimRes.data as unknown as Record<string, unknown>);

      // Save claim to localStorage for Dashboard
      const existingClaims = JSON.parse(localStorage.getItem("ripe_claims") || "[]");
      existingClaims.unshift({
        claimId: claimRes.data.claim.claimId,
        event: `${meta.label} – ${claimRes.data.event.affectedArea}`,
        amount: claimRes.data.claim.payout.payout,
        status: claimRes.data.claim.status,
        fraudLevel: claimRes.data.claim.fraud.level,
        date: new Date().toLocaleString("en-IN"),
      });
      localStorage.setItem("ripe_claims", JSON.stringify(existingClaims));

      // Step 4: Payout processed
      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(4);

      // Get AI explanation
      await new Promise((r) => setTimeout(r, 800));

      const claim = claimRes.data.claim;
      const explainRes = await api.explain({
        event: meta.label,
        payout: claim.payout.payout,
        riskScore: claimRes.data.riskScore,
        fraudLevel: claim.fraud.level,
        status: claim.status,
      });
      setExplanation(explainRes.data.explanation);
      setShowExplanation(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Pipeline failed. Is the backend running?");
      console.error("Pipeline error:", err);
    } finally {
      setLoading(false);
    }
  }, [meta.eventType, meta.label, storedUser?.user?.id]);

  const handleStart = () => {
    setStarted(true);
    runPipeline();
  };

  // Build scenario data for panels using REAL backend data
  const event = eventData as Record<string, unknown> | null;
  const claim = (claimData as Record<string, unknown> | null);

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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {!started ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <p className="text-6xl mb-4">{meta.emoji}</p>
            <h2 className="text-xl font-bold mb-2">Ready to simulate?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This will call the REAL backend — event simulation, fraud check, payout calculation, and AI explanation.
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
                  {stepLabels.map((step, i) => {
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
                <EventDetailsPanel event={event} scenario={scenarioData} />
              </div>
            </div>

            {/* Analysis panels - show progressively with REAL data */}
            <AnimatePresence>
              {currentStep >= 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <RiskBreakdownPanel claim={claim} scenario={scenarioData} />
                  {currentStep >= 2 && <FraudAnalysisPanel claim={claim} />}
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentStep >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DecisionPanel claim={claim} scenario={scenarioData} />
                  {currentStep >= 4 && <PayoutPanel claim={claim} scenario={scenarioData} />}
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

            {/* AI Explanation — REAL from backend */}
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
                  <TypeWriter text={explanation} />
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
