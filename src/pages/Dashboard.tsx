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

const Dashboard = () => {
  // Get REAL user data from onboarding
  const stored = JSON.parse(localStorage.getItem("ripe_user") || "null");
  const user = stored?.user;
  const risk = stored?.risk;
  const pricing = stored?.pricing;

  const riskScore = risk?.riskScore || 0;
  const location = user?.location || "Not set";
  const platform = user?.platform || "Not set";
  const premium = pricing?.premium || 0;
  const tier = pricing?.tier || "N/A";
  const weeklyIncome = user?.weeklyIncome || 0;

  // Get claim history from localStorage
  const claims = JSON.parse(localStorage.getItem("ripe_claims") || "[]");
  const totalEarnings = claims.reduce((sum: number, c: Record<string, unknown>) => sum + Number(c.amount || 0), 0);

  const { value: earnings } = useCountUp(totalEarnings || 0, 2500);
  const { value: animatedRisk } = useCountUp(riskScore, 2000);

  const tierLabel = tier === "LOW" ? "Low Risk" : tier === "MEDIUM" ? "Medium Risk" : tier === "HIGH" ? "High Risk" : tier;
  const tierColor = tier === "LOW" ? "text-primary" : tier === "MEDIUM" ? "text-amber-400" : "text-destructive";

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
          <p className="text-muted-foreground mt-1">
            {user ? `Welcome back, ${user.name || platform + " worker"}!` : "Your income protection at a glance."} 
            {!user && <span className="text-primary ml-1">→ <Link to="/onboarding" className="underline">Onboard first</Link></span>}
          </p>
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
                <p className="font-bold text-primary">{user ? "Active" : "Not Enrolled"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {user ? `${tier} Tier · ₹${premium}/day` : "Complete onboarding to activate"}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> {location}
              {platform !== "Not set" && <span className="ml-auto font-mono">{platform}</span>}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-6 flex items-center gap-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(228 15% 16%)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={riskScore >= 60 ? "hsl(0 72% 51%)" : riskScore >= 30 ? "hsl(45 93% 47%)" : "hsl(158 64% 52%)"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * (riskScore / 100)) }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold tabular-nums">{animatedRisk}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Composite Risk Score</p>
              <p className={`font-bold ${tierColor}`}>{tierLabel}</p>
              {risk?.factors && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Location: {risk.factors.locationRisk} · Weather: {risk.factors.weatherRisk} · Pollution: {risk.factors.pollutionRisk}
                </p>
              )}
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
              <span className="text-[10px] font-mono text-primary">{claims.length} claim{claims.length !== 1 ? "s" : ""}</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div {...fadeUp(0.4)} className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Claims History</h3>
            </div>
            {claims.length > 0 ? (
              <div className="space-y-3">
                {claims.map((claim: Record<string, unknown>, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{String(claim.event)}</p>
                      <p className="text-xs text-muted-foreground">{String(claim.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">₹{Number(claim.amount)}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`text-xs ${claim.status === "APPROVED" ? "text-primary" : claim.status === "APPROVED_PARTIAL" ? "text-yellow-400" : "text-destructive"}`}>
                          {String(claim.status)}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">{String(claim.claimId)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No claims yet.</p>
                <p className="text-xs mt-1">Run a simulation to see real claim data here.</p>
              </div>
            )}
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-accent" />
              <h3 className="font-semibold">Quick Actions</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {user
                ? `You're covered at ₹${premium}/day. Weekly income: ₹${weeklyIncome}. Run a simulation to see the full pipeline in action.`
                : "Complete onboarding to get your personalized risk analysis and coverage."
              }
            </p>
            <div className="flex items-center gap-2 text-[10px] mb-4 text-muted-foreground">
              <Activity className="w-3 h-3" /> Backend connected • Live data
            </div>
            <div className="space-y-2">
              <Link to="/scenarios">
                <Button variant="glass" size="sm" className="w-full">
                  Run Simulation <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/onboarding">
                  <Button variant="hero" size="sm" className="w-full mt-2">
                    Get Protected <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
