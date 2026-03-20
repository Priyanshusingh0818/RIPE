import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, MapPin, Wallet, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ripe/Navbar";
import { cn } from "@/lib/utils";

const platforms = [
  { id: "zomato", label: "Zomato", color: "hsl(0 72% 51%)" },
  { id: "swiggy", label: "Swiggy", color: "hsl(33 100% 50%)" },
  { id: "zepto", label: "Zepto", color: "hsl(265 55% 55%)" },
  { id: "amazon", label: "Amazon Flex", color: "hsl(200 70% 45%)" },
];

const premiums = [
  { label: "Basic", price: 49, coverage: "₹300/event" },
  { label: "Standard", price: 79, coverage: "₹520/event" },
  { label: "Premium", price: 99, coverage: "₹800/event" },
];

const stepVariants = {
  enter: { opacity: 0, x: 30, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -30, filter: "blur(4px)" },
};

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState("");
  const [location, setLocation] = useState("");
  const [income, setIncome] = useState("");
  const navigate = useNavigate();

  const canNext = step === 0 ? !!persona : step === 1 ? !!location : step === 2 ? !!income : true;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <Navbar />

      <main className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-16">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-muted">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step >= i ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-primary origin-left rounded-full"
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <h2 className="text-2xl font-bold mb-2">Select your platform</h2>
              <p className="text-muted-foreground mb-8">Choose which delivery service you work with.</p>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={cn(
                      "glass rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.97]",
                      persona === p.id ? "border-primary/50 glow-primary" : "hover:bg-secondary/30"
                    )}
                  >
                    <div className="w-3 h-3 rounded-full mb-3" style={{ background: p.color }} />
                    <span className="font-semibold">{p.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <h2 className="text-2xl font-bold mb-2">Your delivery zone</h2>
              <p className="text-muted-foreground mb-8">Enter the area where you deliver most.</p>
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Koramangala, Bangalore"
                  className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <h2 className="text-2xl font-bold mb-2">Weekly income</h2>
              <p className="text-muted-foreground mb-8">How much do you earn in a typical week?</p>
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 8000"
                  className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground tabular-nums"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Risk Analysis</h2>
                  <p className="text-sm text-muted-foreground">Based on your profile</p>
                </div>
              </div>

              {/* Risk Score Ring */}
              <div className="glass rounded-2xl p-8 flex flex-col items-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(228 15% 16%)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="hsl(158 64% 52%)"
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * 0.72) }}
                      transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl font-bold tabular-nums">72</span>
                    <span className="text-xs text-muted-foreground">Risk Score</span>
                  </motion.div>
                </div>
              </div>

              {/* Zone + Premium */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Zone Risk</p>
                  <p className="font-bold text-amber-400">Medium</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <p className="font-bold truncate">{location || "Koramangala"}</p>
                </div>
              </div>

              {/* Premium options */}
              <p className="text-sm text-muted-foreground mb-3">Select your coverage plan:</p>
              <div className="flex flex-col gap-2">
                {premiums.map((plan, i) => (
                  <motion.div
                    key={plan.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "glass rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.97]",
                      i === 1 ? "border-primary/40 glow-primary" : "hover:bg-secondary/30"
                    )}
                  >
                    <div>
                      <span className="font-semibold">{plan.label}</span>
                      <span className="text-sm text-muted-foreground ml-2">{plan.coverage}</span>
                    </div>
                    <span className="font-bold text-primary tabular-nums">₹{plan.price}/wk</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-10 flex gap-3">
          {step > 0 && (
            <Button variant="glass" size="lg" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button
            variant="hero"
            size="lg"
            className="flex-1"
            disabled={!canNext}
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else navigate("/dashboard");
            }}
          >
            {step === 3 ? "Activate Protection" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
