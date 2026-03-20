import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Clock, Brain, ArrowRight, MapPin, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";
import Navbar from "@/components/ripe/Navbar";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" as string },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" as string },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const claimsHistory = [
  { date: "Mar 18, 2:34 PM", event: "Heavy Rain – Koramangala", amount: 520, status: "Paid", confidence: "96.3%", latency: "8.2s" },
  { date: "Mar 14, 11:22 AM", event: "App Downtime – Swiggy", amount: 340, status: "Paid", confidence: "91.7%", latency: "6.8s" },
  { date: "Mar 10, 3:15 PM", event: "Extreme Heat – HSR Layout", amount: 420, status: "Paid", confidence: "94.1%", latency: "7.4s" },
  { date: "Mar 6, 9:48 AM", event: "Pollution Spike – Indiranagar", amount: 280, status: "Paid", confidence: "88.9%", latency: "9.1s" },
];

const Dashboard = () => {
  const { value: earnings } = useCountUp(1560, 2500);
  const { value: riskScore } = useCountUp(72, 2000);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">
        <motion.div {...fadeUp(0)} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your income protection at a glance — real-time monitoring active.</p>
        </motion.div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-6 glow-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coverage Status</p>
                <p className="font-bold text-primary">Active</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Standard Plan · ₹520/event max</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> Koramangala, Bangalore
              <span className="ml-auto font-mono">Zone Risk: Flood-prone</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-6 flex items-center gap-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(228 15% 16%)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke="hsl(158 64% 52%)"
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * 0.72) }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold tabular-nums">{riskScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Composite Risk Score</p>
              <p className="font-bold">Medium Zone</p>
              <p className="text-[10px] text-muted-foreground mt-1">Weather: 68 · Zone: 72 · Exposure: 64</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Earnings Protected</p>
            </div>
            <p className="text-3xl font-bold tracking-tight tabular-nums">₹{earnings.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">This month</p>
              <span className="text-[10px] font-mono text-primary">4 claims · avg 8.1s settlement</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div {...fadeUp(0.4)} className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Claims History</h3>
            </div>
            <div className="space-y-3">
              {claimsHistory.map((claim, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{claim.event}</p>
                    <p className="text-xs text-muted-foreground">{claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">₹{claim.amount}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-primary">{claim.status}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">AI: {claim.confidence} · {claim.latency}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-accent" />
              <h3 className="font-semibold">AI Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Based on IMD weather forecasts and Swiggy platform data, there's a <span className="text-foreground font-medium">68% chance of heavy rain</span> in your zone this Thursday 2:00–6:00 PM.
            </p>
            <div className="flex items-center gap-2 text-[10px] mb-4 text-muted-foreground">
              <Activity className="w-3 h-3" /> AI Confidence: 92% · Updated 14 min ago
            </div>
            <Link to="/scenarios">
              <Button variant="glass" size="sm" className="w-full">
                Run Simulation <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
