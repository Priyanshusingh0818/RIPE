import { motion } from "framer-motion";
import { Shield, Brain, Zap, Users, Globe, Lock } from "lucide-react";
import Navbar from "@/components/ripe/Navbar";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" as string },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" as string },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const features = [
  { icon: Brain, title: "AI-Powered Risk Assessment", desc: "Multi-factor risk engine analyzing weather, zone history, platform status, and behavioral patterns in real-time." },
  { icon: Zap, title: "Parametric Claims", desc: "Zero paperwork. When thresholds are met, claims trigger automatically — no manual filing needed." },
  { icon: Lock, title: "Fraud Detection", desc: "GPS verification, duplicate detection, activity pattern analysis, and behavioral anomaly scoring." },
  { icon: Globe, title: "Real-time Data Feeds", desc: "IMD weather API, CPCB air quality, platform status monitors, and municipal alerts integrated." },
  { icon: Users, title: "Built for Gig Workers", desc: "Designed specifically for delivery partners on Zomato, Swiggy, Zepto, and Amazon Flex." },
  { icon: Shield, title: "Instant Payouts", desc: "Average 8-second settlement via UPI. From event detection to funds in wallet — fully automated." },
];

const About = () => (
  <div className="min-h-screen relative">
    <div className="absolute inset-0 pointer-events-none">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
    </div>
    <Navbar />

    <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-16">
      <motion.div {...fadeUp(0)} className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">About RIPE Engine</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed max-w-2xl">
          RIPE (Real-time Income Protection Engine) is an AI-powered parametric insurance platform that automatically protects gig delivery workers' income during external disruptions.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-xs font-medium text-accent">
          Phase 1 Prototype • Hackathon Demo
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              {...fadeUp(0.1 + i * 0.08)}
              className="glass rounded-2xl p-5 hover:bg-secondary/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...fadeUp(0.6)} className="glass rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Qwen 3 32B", "Parametric Models", "UPI Integration", "Real-time APIs"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-medium border border-border/40 bg-secondary/30 text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </main>
  </div>
);

export default About;
