/**
 * RIPE Engine – API Service Layer
 * All frontend-to-backend API calls go through here.
 */

const API_BASE = '/api';

interface OnboardPayload {
  name: string;
  platform: string;
  location: string;
  weeklyIncome: number;
}

interface SimulatePayload {
  eventType: string;
}

interface ClaimPayload {
  userId: string;
  eventType?: string;
  eventId?: string;
}

interface ExplainPayload {
  event: string;
  payout: number;
  riskScore: number;
  fraudLevel?: string;
  status?: string;
}

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

export const api = {
  /** POST /api/onboard – register user and get risk + premium */
  onboard: (payload: OnboardPayload) =>
    request<{
      success: boolean;
      data: {
        user: { id: string; name: string; platform: string; location: string; weeklyIncome: number };
        risk: { riskScore: number; factors: Record<string, number> };
        pricing: { premium: number; tier: string; currency: string };
      };
      timestamp: string;
    }>('/onboard', payload),

  /** POST /api/simulate – simulate a disruption event */
  simulate: (payload: SimulatePayload) =>
    request<{
      success: boolean;
      data: {
        event: {
          id: string;
          type: string;
          label: string;
          eventSeverity: number;
          duration: number;
          affectedArea: string;
          triggeredAt: string;
        };
      };
      timestamp: string;
    }>('/simulate', payload),

  /** POST /api/claim – process a full claim */
  claim: (payload: ClaimPayload) =>
    request<{
      success: boolean;
      data: {
        claim: {
          claimId: string;
          userId: string;
          eventId: string;
          eventType: string;
          status: string;
          fraud: { fraudScore: number; level: string; checks: Record<string, string> };
          payout: { payout: number; hourlyIncome: number; lostHours: number; maxPayout: number; currency: string };
          processedAt: string;
        };
        event: {
          id: string;
          type: string;
          label: string;
          eventSeverity: number;
          duration: number;
          affectedArea: string;
          triggeredAt: string;
        };
        riskScore: number;
      };
      timestamp: string;
    }>('/claim', payload),

  /** POST /api/explain – get AI-powered explanation */
  explain: (payload: ExplainPayload) =>
    request<{
      success: boolean;
      data: { explanation: string; fallback?: boolean };
      timestamp: string;
    }>('/explain', payload),
};

export type OnboardResponse = Awaited<ReturnType<typeof api.onboard>>;
export type SimulateResponse = Awaited<ReturnType<typeof api.simulate>>;
export type ClaimResponse = Awaited<ReturnType<typeof api.claim>>;
export type ExplainResponse = Awaited<ReturnType<typeof api.explain>>;
