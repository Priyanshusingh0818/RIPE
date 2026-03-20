import { motion } from "framer-motion";
import { User, Zap, Brain, Scale, ShieldCheck, FileCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const nodes = [
  { icon: User, label: "User", data: "Active" },
  { icon: Zap, label: "Event Trigger", data: "Detected" },
  { icon: Brain, label: "Risk Engine", data: "Score: 72" },
  { icon: Scale, label: "Decision", data: "Approved" },
  { icon: ShieldCheck, label: "Fraud Check", data: "Low Risk" },
  { icon: FileCheck, label: "Claim Engine", data: "Auto-filed" },
  { icon: Wallet, label: "Payout", data: "₹520" },
];

// Map simulation step (0-4) to how many flowchart nodes are active
const stepToActiveNodes = [2, 3, 5, 6, 7];

interface FlowChartProps {
  currentStep: number; // 0-4 simulation step index, -1 = none
}

const FlowChart = ({ currentStep }: FlowChartProps) => {
  const activeCount = currentStep >= 0 ? stepToActiveNodes[Math.min(currentStep, 4)] : 0;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center gap-0 min-w-[800px] px-4">
        {nodes.map((node, i) => {
          const isActive = i < activeCount;
          const isCurrent = i === activeCount - 1;
          const Icon = node.icon;

          return (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ opacity: 0.3, scale: 0.9 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border transition-all duration-500 min-w-[100px]",
                  isActive
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/30 bg-card/30",
                  isCurrent && "glow-primary"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500",
                    isActive ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-semibold transition-colors duration-500 text-center",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {node.label}
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="text-[10px] font-mono text-primary/80"
                >
                  {node.data}
                </motion.span>
              </motion.div>

              {i < nodes.length - 1 && (
                <div className="relative w-8 h-[2px] mx-1">
                  <div className="absolute inset-0 bg-border/30 rounded-full" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: i < activeCount - 1 ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-primary rounded-full origin-left"
                  />
                  {i < activeCount - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-primary border-y-[3px] border-y-transparent"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlowChart;
