import crypto from 'node:crypto';
import type { Response } from 'express';
import type { EnvironmentId } from '../data/mockData.ts';

export const ALLOWED_EDGE_JOB_TYPES = [
  'SCAN_SUBNET',
  'ADB_CONNECT_AUTH',
  'ADB_PAIR',
  'ADB_PROBE',
  'CAPTURE_BACKUP',
  'DEPLOY_LAUNCHER',
  'RESTORE_OEM',
  'SCREENCAP',
] as const;

export type EdgeJobType = (typeof ALLOWED_EDGE_JOB_TYPES)[number];

export type RedeemPairingResult =
  | { ok: true; session: EdgeAgentSession; code?: string; message?: string }
  | { ok: false; code: string; message: string; session?: never };

export interface EdgePairingToken {
  code: string;
  propertyId: string;
  environmentId: EnvironmentId;
  createdBy: string;
  createdAtUtc: string;
  expiresAtUtc: string;
  redeemedAtUtc?: string;
  redeemedByAgentId?: string;
}

export interface EdgeAgentInterface {
  name: string;
  address: string;
  netmask?: string;
  cidr: string;
}

export interface EdgeAgentSession {
  agentId: string;
  agentToken: string;
  propertyId: string;
  environmentId: EnvironmentId;
  name: string;
  hostPlatform: string;
  interfaceName: string;
  subnetCidr: string;
  interfaces?: EdgeAgentInterface[];
  adbAvailable: boolean;
  adbVersion: string;
  rsaFingerprint?: string;
  status: 'Online' | 'Offline';
  enrolledAtUtc: string;
  lastHeartbeatUtc: string;
  sseResponse?: Response;
}

export interface EdgeJobRequest {
  jobId: string;
  type: EdgeJobType;
  propertyId: string;
  payload: Record<string, unknown>;
  issuedAtUtc: string;
}

export interface EdgeJobResult {
  jobId: string;
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
  completedAtUtc: string;
}

interface PendingJob {
  job: EdgeJobRequest;
  resolve: (result: EdgeJobResult) => void;
  reject: (err: Error) => void;
  timer: NodeJS.Timeout;
}

export class EdgeBridgeManager {
  private pairingTokens = new Map<string, EdgePairingToken>();
  private agentsById = new Map<string, EdgeAgentSession>();
  private tokenToAgentId = new Map<string, string>();
  private pendingJobs = new Map<string, PendingJob>();

  /** Generate a short-lived human-friendly pairing code (e.g. GJA-8492-P01) */
  generatePairingToken(propertyId: string, environmentId: EnvironmentId, createdBy: string, ttlMinutes = 15): EdgePairingToken {
    const suffix = crypto.randomInt(1000, 9999);
    const cleanProp = propertyId.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'PROP';
    const code = `GJA-${suffix}-${cleanProp}`;
    const now = Date.now();
    const record: EdgePairingToken = {
      code,
      propertyId,
      environmentId,
      createdBy,
      createdAtUtc: new Date(now).toISOString(),
      expiresAtUtc: new Date(now + ttlMinutes * 60 * 1000).toISOString(),
    };
    this.pairingTokens.set(code, record);
    return record;
  }

  /** Redeem a pairing code from an Edge Agent and issue a long-lived agent token */
  redeemPairingToken(
    code: string,
    agentMeta: {
      name?: string;
      hostPlatform?: string;
      interfaceName?: string;
      subnetCidr?: string;
      adbAvailable?: boolean;
      adbVersion?: string;
      rsaFingerprint?: string;
      interfaces?: EdgeAgentInterface[];
    }
  ): RedeemPairingResult {
    const normalized = String(code || '').trim().toUpperCase();
    const token = this.pairingTokens.get(normalized);
    if (!token) {
      return { ok: false, code: 'PAIRING_CODE_INVALID', message: 'Pairing code not found or invalid.' };
    }
    if (token.redeemedAtUtc) {
      return { ok: false, code: 'PAIRING_CODE_USED', message: 'Pairing code has already been redeemed.' };
    }
    if (Date.now() > Date.parse(token.expiresAtUtc)) {
      return { ok: false, code: 'PAIRING_CODE_EXPIRED', message: 'Pairing code has expired. Generate a new one in the dashboard.' };
    }

    const nowIso = new Date().toISOString();
    const agentId = `EDGE-${token.environmentId}-${token.propertyId}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const agentToken = `gja_edge_${crypto.randomBytes(24).toString('hex')}`;

    const session: EdgeAgentSession = {
      agentId,
      agentToken,
      propertyId: token.propertyId,
      environmentId: token.environmentId,
      name: agentMeta.name || `Gojja-Edge-${token.propertyId}`,
      hostPlatform: agentMeta.hostPlatform || 'unknown',
      interfaceName: agentMeta.interfaceName || 'lan0',
      subnetCidr: agentMeta.subnetCidr || '192.168.1.0/24',
      interfaces: agentMeta.interfaces || [],
      adbAvailable: Boolean(agentMeta.adbAvailable),
      adbVersion: agentMeta.adbVersion || 'Pending Auto-Install',
      rsaFingerprint: agentMeta.rsaFingerprint,
      status: 'Online',
      enrolledAtUtc: nowIso,
      lastHeartbeatUtc: nowIso,
    };

    token.redeemedAtUtc = nowIso;
    token.redeemedByAgentId = agentId;
    this.agentsById.set(agentId, session);
    this.tokenToAgentId.set(agentToken, agentId);

    return { ok: true, session };
  }

  authenticateAgentToken(bearerOrRawToken: string | undefined): EdgeAgentSession | null {
    if (!bearerOrRawToken) return null;
    const raw = bearerOrRawToken.replace(/^Bearer\s+/i, '').trim();
    const agentId = this.tokenToAgentId.get(raw);
    if (!agentId) return null;
    return this.agentsById.get(agentId) || null;
  }

  attachSseStream(agentId: string, res: Response): EdgeAgentSession | null {
    const session = this.agentsById.get(agentId);
    if (!session) return null;
    session.sseResponse = res;
    session.status = 'Online';
    session.lastHeartbeatUtc = new Date().toISOString();
    return session;
  }

  detachSseStream(agentId: string, res?: Response): void {
    const session = this.agentsById.get(agentId);
    if (!session) return;
    if (!res || session.sseResponse === res) {
      session.sseResponse = undefined;
      session.status = 'Offline';
    }
  }

  updateHeartbeat(
    agentId: string,
    patch: Partial<Pick<EdgeAgentSession, 'adbAvailable' | 'adbVersion' | 'subnetCidr' | 'interfaceName' | 'rsaFingerprint' | 'interfaces'>>
  ): EdgeAgentSession | null {
    const session = this.agentsById.get(agentId);
    if (!session) return null;
    Object.assign(session, patch);
    session.lastHeartbeatUtc = new Date().toISOString();
    session.status = 'Online';
    return session;
  }

  getOnlineAgentForProperty(propertyId: string, environmentId?: EnvironmentId): EdgeAgentSession | null {
    for (const session of this.agentsById.values()) {
      if (
        session.propertyId === propertyId &&
        (!environmentId || session.environmentId === environmentId) &&
        session.status === 'Online' &&
        Boolean(session.sseResponse)
      ) {
        return session;
      }
    }
    return null;
  }

  listAgents(propertyId?: string): Array<Omit<EdgeAgentSession, 'sseResponse' | 'agentToken'>> {
    const results: Array<Omit<EdgeAgentSession, 'sseResponse' | 'agentToken'>> = [];
    for (const s of this.agentsById.values()) {
      if (propertyId && s.propertyId !== propertyId) continue;
      const { sseResponse: _sse, agentToken: _tok, ...publicInfo } = s;
      results.push({
        ...publicInfo,
        status: s.sseResponse && !s.sseResponse.writableEnded ? 'Online' : 'Offline',
      });
    }
    return results;
  }

  /** Dispatch an allowlisted job over SSE to the property's online Edge Agent and await its result */
  dispatchJob(
    propertyId: string,
    type: EdgeJobType,
    payload: Record<string, unknown>,
    environmentId?: EnvironmentId,
    timeoutMs = 30000
  ): Promise<EdgeJobResult> {
    if (!ALLOWED_EDGE_JOB_TYPES.includes(type)) {
      return Promise.reject(new Error(`Disallowed edge job type: ${type}`));
    }
    const agent = this.getOnlineAgentForProperty(propertyId, environmentId);
    if (!agent || !agent.sseResponse || agent.sseResponse.writableEnded) {
      return Promise.reject(new Error(`No active Edge Agent connected for property ${propertyId}`));
    }

    const jobId = `JOB-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const job: EdgeJobRequest = {
      jobId,
      type,
      propertyId,
      payload,
      issuedAtUtc: new Date().toISOString(),
    };

    return new Promise<EdgeJobResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingJobs.delete(jobId);
        reject(new Error(`Edge Agent job ${jobId} (${type}) timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pendingJobs.set(jobId, { job, resolve, reject, timer });

      try {
        agent.sseResponse!.write(`event: job\ndata: ${JSON.stringify(job)}\n\n`);
      } catch (err) {
        clearTimeout(timer);
        this.pendingJobs.delete(jobId);
        reject(err instanceof Error ? err : new Error('Failed to write SSE job frame'));
      }
    });
  }

  completeJob(result: EdgeJobResult): boolean {
    const pending = this.pendingJobs.get(result.jobId);
    if (!pending) return false;
    clearTimeout(pending.timer);
    this.pendingJobs.delete(result.jobId);
    pending.resolve(result);
    return true;
  }
}

export const edgeBridge = new EdgeBridgeManager();

export function buildEdgeInstallerBash(serverUrl: string, pairingCode: string): string {
  const cleanUrl = serverUrl.replace(/\/$/, '');
  return `#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " GOJJA SmartTV — Zero-Touch Edge Agent Installer (Linux/macOS)"
echo "=============================================================="

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js v18+ is required. Please install Node.js LTS from https://nodejs.org/"
  exit 1
fi

EDGE_DIR="\${HOME}/.gojja-edge"
mkdir -p "\${EDGE_DIR}"

echo "-> Downloading Gojja Edge Agent from ${cleanUrl}/gojja-connector.mjs..."
curl -fsSL "${cleanUrl}/gojja-connector.mjs" -o "\${EDGE_DIR}/gojja-connector.mjs"

echo "-> Starting Edge Agent with Auto-ADB Bootstrap & Cloud Relay..."
exec node "\${EDGE_DIR}/gojja-connector.mjs" --server "${cleanUrl}" --pair "${pairingCode}" --daemon
`;
}

export function buildEdgeInstallerPowerShell(serverUrl: string, pairingCode: string): string {
  const cleanUrl = serverUrl.replace(/\/$/, '');
  return `$ErrorActionPreference = "Stop"
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " GOJJA SmartTV — Zero-Touch Edge Agent Installer (Windows)" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[ERROR] Node.js v18+ is required. Install from https://nodejs.org/" -ForegroundColor Red
  exit 1
}

$EdgeDir = Join-Path $env:USERPROFILE ".gojja-edge"
New-Item -ItemType Directory -Force -Path $EdgeDir | Out-Null
$AgentFile = Join-Path $EdgeDir "gojja-connector.mjs"

Write-Host "-> Downloading Gojja Edge Agent from ${cleanUrl}/gojja-connector.mjs..."
Invoke-WebRequest -Uri "${cleanUrl}/gojja-connector.mjs" -OutFile $AgentFile -UseBasicParsing

Write-Host "-> Starting Edge Agent with Auto-ADB Bootstrap & Cloud Relay..." -ForegroundColor Green
& node $AgentFile --server "${cleanUrl}" --pair "${pairingCode}" --daemon
`;
}
