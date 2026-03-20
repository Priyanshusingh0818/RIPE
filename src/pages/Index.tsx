import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";
import Navbar from "@/components/ripe/Navbar";

const statCards = [
  { label: "Auto-paid", value: 520, prefix: "₹", icon: Zap, delay: 0.2 },
  { label: "Risk Score", value: 72, suffix: "%", icon: Shield, delay: 0.35 },
  { label: "Weekly Protection", value: 100, suffix: "%", icon: TrendingUp, delay: 0.5 },
];

const StatCard = ({ label, value, prefix = "", suffix = "", icon: Icon, delay }: {
  label: string; value: number; prefix?: string; suffix?: string; icon: typeof Zap; delay: number;
}) => {
  const { value: count } = useCountUp(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-6 flex flex-col gap-3 hover:bg-secondary/30 transition-colors duration-300 group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight tabular-nums">
          {prefix}{count}{suffix}
        </p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-24">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <Shield className="w-3.5 h-3.5" />
            AI-Powered Parametric Insurance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Protect Your Income.{" "}
            <span className="text-gradient">Automatically.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Real-time income protection for delivery partners. When rain, heat,
            or downtime disrupts your earnings — RIPE pays you instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/onboarding">
              <Button variant="hero" size="xl">
                Start Simulation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/scenarios">
              <Button variant="glass" size="lg">
                View Scenarios
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stat cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
