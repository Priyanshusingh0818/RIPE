import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CloudRain, Flame, Wind, Ban, TrendingDown, ArrowRight } from "lucide-react";
import Navbar from "@/components/ripe/Navbar";
import { cn } from "@/lib/utils";

const scenarios = [
  {
    id: "rain",
    label: "Heavy Rain",
    icon: CloudRain,
    desc: "Monsoon-level rainfall reduces delivery volume and increases accident risk.",
    gradient: "from-blue-500/10 to-cyan-500/5",
    border: "hover:border-blue-500/30",
    glow: "group-hover:shadow-[0_0_40px_-8px_hsl(200_80%_50%/0.3)]",
  },
  {
    id: "heat",
    label: "Extreme Heat",
    icon: Flame,
    desc: "Temperature exceeds 42°C, creating health hazards for outdoor workers.",
    gradient: "from-orange-500/10 to-red-500/5",
    border: "hover:border-orange-500/30",
    glow: "group-hover:shadow-[0_0_40px_-8px_hsl(25_90%_55%/0.3)]",
  },
  {
    id: "pollution",
    label: "Pollution Spike",
    icon: Wind,
    desc: "AQI exceeds hazardous levels, making outdoor work dangerous.",
    gradient: "from-yellow-500/10 to-amber-500/5",
    border: "hover:border-yellow-500/30",
    glow: "group-hover:shadow-[0_0_40px_-8px_hsl(48_90%_50%/0.3)]",
  },
  {
    id: "curfew",
    label: "Curfew / Zone Closure",
    icon: Ban,
    desc: "Local authorities restrict movement, preventing deliveries in your zone.",
    gradient: "from-red-500/10 to-pink-500/5",
    border: "hover:border-red-500/30",
    glow: "group-hover:shadow-[0_0_40px_-8px_hsl(0_70%_55%/0.3)]",
  },
  {
    id: "downtime",
    label: "App Downtime",
    icon: TrendingDown,
    desc: "Platform outage prevents order assignment — no orders, no income.",
    gradient: "from-purple-500/10 to-violet-500/5",
    border: "hover:border-purple-500/30",
    glow: "group-hover:shadow-[0_0_40px_-8px_hsl(270_60%_55%/0.3)]",
  },
];

const Scenarios = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">Disruption Scenarios</h1>
          <p className="text-muted-foreground mt-1">Select an event to simulate the RIPE protection pipeline.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(`/simulation/${s.id}`)}
                className={cn(
                  "group glass rounded-2xl p-6 text-left transition-all duration-300 active:scale-[0.97]",
                  s.border, s.glow
                )}
              >
                <div className={cn("w-full h-24 rounded-xl mb-5 bg-gradient-to-br flex items-center justify-center", s.gradient)}>
                  <Icon className="w-10 h-10 text-foreground/60 group-hover:text-foreground/80 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-1">{s.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Simulate Event <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Scenarios;
