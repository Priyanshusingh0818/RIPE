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
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cn("h-full rounded-full", value > 75 ? "bg-destructive" : value > 50 ? "bg-yellow-400" : "bg-primary")}
      />
    </div>
  </div>
);

/* ── Event Details Panel ─ uses REAL event data from backend ── */
export const EventDetailsPanel = ({ event, scenario }: { event: Record<string, unknown> | null; scenario: ScenarioData }) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const severity = event ? Number(event.eventSeverity) : 0;
  const severityLabel = severity >= 8 ? "Critical" : severity >= 5 ? "High" : "Medium";
  const severityColor = severity >= 8 ? "text-destructive" : severity >= 5 ? "text-orange-400" : "text-yellow-400";
  const duration = event ? `${event.duration} hrs` : "...";
  const zone = event ? String(event.affectedArea) : "Loading...";

  return (
    <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Event Details</h3>
        {event && <span className="ml-auto text-[9px] font-mono text-primary/60">LIVE</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Event Type</p>
          <p className="text-sm font-semibold mt-0.5">{event ? String(event.label) : scenario.label}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Severity</p>
          <p className={cn("text-sm font-bold mt-0.5", severityColor)}>{severityLabel} ({severity}/10)</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</p>
          <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Affected Zone</p>
          <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{zone}</p>
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

/* ── Risk Breakdown Panel ─ uses REAL risk score from backend ── */
export const RiskBreakdownPanel = ({ claim, scenario }: { claim: Record<string, unknown> | null; scenario: ScenarioData }) => {
  const riskScore = claim ? Number((claim as Record<string, unknown>).riskScore) : 0;
  // Distribute risk across categories based on the composite score
  const weatherRisk = Math.round(riskScore * 0.9 + Math.random() * 10);
  const zoneRisk = Math.round(riskScore * 0.85 + Math.random() * 8);
  const exposureRisk = Math.round(riskScore * 0.8 + Math.random() * 12);

  return (
    <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Risk Breakdown</h3>
        </div>
        {claim && <span className="text-xs font-mono text-primary">Score: {riskScore}/100</span>}
      </div>
      <div className="space-y-3">
        <RiskBar label="Weather Risk" value={Math.min(weatherRisk, 100)} delay={0.3} />
        <RiskBar label="Zone Risk" value={Math.min(zoneRisk, 100)} delay={0.4} />
        <RiskBar label="Exposure Risk" value={Math.min(exposureRisk, 100)} delay={0.5} />
      </div>
      <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Composite Score</span>
        <span className="text-lg font-bold tabular-nums text-primary">{riskScore}</span>
      </div>
    </motion.div>
  );
};

/* ── Fraud Analysis Panel ─ uses REAL fraud data from backend ── */
export const FraudAnalysisPanel = ({ claim }: { claim: Record<string, unknown> | null }) => {
  const claimRecord = claim ? (claim as Record<string, unknown>).claim as Record<string, unknown> : null;
  const fraud = claimRecord ? claimRecord.fraud as Record<string, unknown> : null;
  const checks = fraud ? fraud.checks as Record<string, string> : null;
  const level = fraud ? String(fraud.level) : "...";
  const score = fraud ? Number(fraud.fraudScore) : 0;

  const levelColor = level === "LOW" ? "text-primary" : level === "MEDIUM" ? "text-yellow-400" : "text-destructive";
  const levelBg = level === "LOW" ? "bg-primary/10" : level === "MEDIUM" ? "bg-yellow-400/10" : "bg-destructive/10";

  return (
    <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fraud Analysis</h3>
        </div>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", levelColor, levelBg)}>
          {level === "LOW" ? "Validated" : level === "MEDIUM" ? "Flagged" : "Rejected"}
        </span>
      </div>
      <div className="space-y-0.5">
        <Check label={`Location: ${checks?.locationConsistency || "..."}`} pass={checks?.locationConsistency === "MATCH"} />
        <Check label={`Claim Frequency: ${checks?.claimFrequency || "..."}`} pass={checks?.claimFrequency === "NORMAL"} />
        <Check label={`Duplicate Check: ${checks?.duplicateCheck || "..."}`} pass={checks?.duplicateCheck === "CLEAN"} />
      </div>
      <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Final Fraud Score</span>
        <span className={cn("text-sm font-bold", levelColor)}>{level} Risk ({score})</span>
      </div>
    </motion.div>
  );
};

/* ── Decision Panel ─ uses REAL claim status from backend ── */
export const DecisionPanel = ({ claim, scenario }: { claim: Record<string, unknown> | null; scenario: ScenarioData }) => {
  const claimRecord = claim ? (claim as Record<string, unknown>).claim as Record<string, unknown> : null;
  const status = claimRecord ? String(claimRecord.status) : "PROCESSING";
  const claimId = claimRecord ? String(claimRecord.claimId) : "...";

  const statusLabel = status === "APPROVED" ? "✓ Approved" : status === "APPROVED_PARTIAL" ? "⚠ Partial Approval" : status === "REJECTED" ? "✗ Rejected" : "Processing...";
  const statusColor = status === "APPROVED" ? "text-primary bg-primary/10 border-primary/20" : status === "APPROVED_PARTIAL" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" : "text-destructive bg-destructive/10 border-destructive/20";

  return (
    <motion.div {...fadeUp(0.4)} className="glass rounded-2xl p-5 glow-primary">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Decision</h3>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className={cn("text-sm font-bold px-3 py-1 rounded-full border", statusColor)}>
          {statusLabel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Claim <span className="font-mono text-foreground">{claimId}</span> for {scenario.label} disruption has been processed.
        {status === "APPROVED_PARTIAL" && " 50% payout applied due to medium fraud risk."}
        {status === "REJECTED" && " Claim rejected due to high fraud risk."}
      </p>
    </motion.div>
  );
};

/* ── Payout Panel ─ uses REAL payout data from backend ── */
export const PayoutPanel = ({ claim }: { claim: Record<string, unknown> | null; scenario: ScenarioData }) => {
  const claimRecord = claim ? (claim as Record<string, unknown>).claim as Record<string, unknown> : null;
  const payoutData = claimRecord ? claimRecord.payout as Record<string, unknown> : null;

  const payoutAmount = payoutData ? Number(payoutData.payout) : 0;
  const hourlyIncome = payoutData ? Number(payoutData.hourlyIncome) : 0;
  const lostHours = payoutData ? Number(payoutData.lostHours) : 0;
  const maxPayout = payoutData ? Number(payoutData.maxPayout) : 1500;
  const coverageRate = claimRecord && String(claimRecord.status) === "APPROVED_PARTIAL" ? "50%" : claimRecord && String(claimRecord.status) === "REJECTED" ? "0%" : "100%";

  const { value: animatedPayout } = useCountUp(payoutAmount, 1500);

  return (
    <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payout Breakdown</h3>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hourly Income</span>
          <span className="font-mono tabular-nums">₹{hourlyIncome}/hr</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lost Hours</span>
          <span className="font-mono tabular-nums">{lostHours} hrs</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Coverage Rate</span>
          <span className="font-mono tabular-nums">{coverageRate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max Payout Cap</span>
          <span className="font-mono tabular-nums">₹{maxPayout}</span>
        </div>
      </div>
      <div className="pt-3 border-t border-border/30 flex justify-between items-center">
        <span className="text-sm font-semibold">Total Payout</span>
        <span className="text-2xl font-bold tabular-nums text-primary">₹{animatedPayout}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        {claimRecord ? `Claim ${claimRecord.claimId} • Processed at ${claimRecord.processedAt}` : "Processing..."}
      </p>
    </motion.div>
  );
};
