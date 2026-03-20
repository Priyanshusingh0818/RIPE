import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Clock, Brain, ShieldCheck, Scale, Wallet, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14, filter: "blur(4px)" as string },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" as string },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
});

interface ScenarioData {
  scenarioId: string;
  label: string;
}

const scenarioDetails: Record<string, {
  severity: string; severityColor: string; duration: string; zone: string;
  weatherRisk: number; zoneRisk: number; exposureRisk: number;
  hourlyIncome: number; lostHours: number; payout: number;
}> = {
  rain: { severity: "High", severityColor: "text-destructive", duration: "3.2 hrs", zone: "Koramangala, Bangalore", weatherRisk: 84, zoneRisk: 72, exposureRisk: 68, hourlyIncome: 162, lostHours: 3.2, payout: 520 },
  heat: { severity: "Critical", severityColor: "text-destructive", duration: "5.1 hrs", zone: "HSR Layout, Bangalore", weatherRisk: 91, zoneRisk: 65, exposureRisk: 78, hourlyIncome: 155, lostHours: 4.8, payout: 744 },
  pollution: { severity: "Medium", severityColor: "text-yellow-400", duration: "4.0 hrs", zone: "Indiranagar, Bangalore", weatherRisk: 62, zoneRisk: 58, exposureRisk: 55, hourlyIncome: 148, lostHours: 2.8, payout: 414 },
  curfew: { severity: "High", severityColor: "text-destructive", duration: "6.0 hrs", zone: "JP Nagar, Bangalore", weatherRisk: 0, zoneRisk: 95, exposureRisk: 88, hourlyIncome: 160, lostHours: 6.0, payout: 960 },
  downtime: { severity: "Medium", severityColor: "text-yellow-400", duration: "2.5 hrs", zone: "Pan-city (Swiggy)", weatherRisk: 0, zoneRisk: 40, exposureRisk: 72, hourlyIncome: 170, lostHours: 2.5, payout: 425 },
};

const Check = ({ label, pass = true }: { label: string; pass?: boolean }) => (
  <div className="flex items-center gap-2 py-1.5">
    {pass ? <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />}
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

const RiskBar = ({ label, value, delay }: { label: string; value: number; delay: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground tabular-nums">{value}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cn("h-full rounded-full", value > 75 ? "bg-destructive" : value > 50 ? "bg-yellow-400" : "bg-primary")}
      />
    </div>
  </div>
);

export const EventDetailsPanel = ({ scenario }: { scenario: ScenarioData }) => {
  const data = scenarioDetails[scenario.scenarioId] || scenarioDetails.rain;
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Event Details</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Event Type</p>
          <p className="text-sm font-semibold mt-0.5">{scenario.label}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Severity</p>
          <p className={cn("text-sm font-bold mt-0.5", data.severityColor)}>{data.severity}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</p>
          <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{data.duration}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Affected Zone</p>
          <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{data.zone}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Detected At</p>
          <p className="text-sm font-mono mt-0.5">{timeStr}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Date</p>
          <p className="text-sm font-mono mt-0.5">{dateStr}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const RiskBreakdownPanel = ({ scenario }: { scenario: ScenarioData }) => {
  const data = scenarioDetails[scenario.scenarioId] || scenarioDetails.rain;
  const composite = Math.round((data.weatherRisk + data.zoneRisk + data.exposureRisk) / 3);

  return (
    <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Risk Breakdown</h3>
        </div>
        <span className="text-xs font-mono text-primary">AI Confidence: 94%</span>
      </div>
      <div className="space-y-3">
        <RiskBar label="Weather Risk" value={data.weatherRisk} delay={0.3} />
        <RiskBar label="Zone Risk" value={data.zoneRisk} delay={0.4} />
        <RiskBar label="Exposure Risk" value={data.exposureRisk} delay={0.5} />
      </div>
      <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Composite Score</span>
        <span className="text-lg font-bold tabular-nums text-primary">{composite}</span>
      </div>
    </motion.div>
  );
};

export const FraudAnalysisPanel = () => (
  <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fraud Analysis</h3>
      </div>
      <span className="text-xs font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10">Validated</span>
    </div>
    <div className="space-y-0.5">
      <Check label="GPS Location Verified" />
      <Check label="Activity Pattern Normal" />
      <Check label="Duplicate Claim Check Passed" />
      <Check label="Behavioral Anomaly Score: 0.08" />
    </div>
    <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center">
      <span className="text-xs text-muted-foreground">Final Fraud Score</span>
      <span className="text-sm font-bold text-primary">Low Risk (0.12)</span>
    </div>
  </motion.div>
);

export const DecisionPanel = ({ scenario }: { scenario: ScenarioData }) => (
  <motion.div {...fadeUp(0.4)} className="glass rounded-2xl p-5 glow-primary">
    <div className="flex items-center gap-2 mb-3">
      <Scale className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Decision</h3>
    </div>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">✓ Approved</span>
      <span className="text-xs text-muted-foreground">Parametric threshold met</span>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">
      {scenario.label} disruption exceeded parametric trigger — composite risk score above threshold with validated fraud clearance. Auto-approved with 96.3% model confidence.
    </p>
  </motion.div>
);

export const PayoutPanel = ({ scenario }: { scenario: ScenarioData }) => {
  const data = scenarioDetails[scenario.scenarioId] || scenarioDetails.rain;
  const { value: payout } = useCountUp(data.payout, 1500);

  return (
    <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payout Breakdown</h3>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hourly Income</span>
          <span className="font-mono tabular-nums">₹{data.hourlyIncome}/hr</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lost Hours</span>
          <span className="font-mono tabular-nums">{data.lostHours} hrs</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Coverage Rate</span>
          <span className="font-mono tabular-nums">100%</span>
        </div>
      </div>
      <div className="pt-3 border-t border-border/30 flex justify-between items-center">
        <span className="text-sm font-semibold">Total Payout</span>
        <span className="text-2xl font-bold tabular-nums text-primary">₹{payout}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">Settled via UPI in 8.2 seconds • Auto-processed</p>
    </motion.div>
  );
};
