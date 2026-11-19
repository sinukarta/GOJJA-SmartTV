import React, { useState } from 'react';
import {
  Wifi,
  Radar,
  ShieldCheck,
  Terminal,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Plus,
  Link2,
  KeyRound,
  Cpu,
  ArrowRight,
  Lock,
  Play,
  Camera,
  Tv,
  Maximize2,
  Zap,
} from 'lucide-react';
import {
  EnvironmentId,
  Property,
  Room,
  ConnectorRegistration,
  DiscoveryCandidate,
  DiscoveryRun,
  ScenarioDefinition,
  runDevicePreflight,
  PreflightCheckItem,
} from '../data/mockData';

interface DeviceDiscoveryViewProps {
  environmentId: EnvironmentId;
  activeProperty: Property;
  properties: Property[];
  rooms: Room[];
  connectors: ConnectorRegistration[];
  candidates: DiscoveryCandidate[];
  discoveryRuns: DiscoveryRun[];
  scenarios: ScenarioDefinition[];
  hostRuntime: {
    adb: { available: boolean; version: string; path: string };
    interfaces: Array<{ name: string; address: string; netmask: string; cidr: string; internal: boolean }>;
    platform: string;
  };
  onRegisterConnector: (payload: {
    propertyId: string;
    name: string;
    interfaceName: string;
    subnetCidr: string;
  }) => Promise<void>;
  onRunScan: (payload: { propertyId: string; subnetCidr: string; ports: number[] }) => Promise<void>;
  onAddManualTarget: (payload: {
    propertyId: string;
    ip: string;
    port: number;
    pairingPort?: number;
    friendlyName?: string;
  }) => Promise<void>;
  onAdbPair: (payload: { candidateId: string; pairingPort: number; pairingCode: string }) => Promise<void>;
  onAdbConnect: (payload: { candidateId: string; simulateTvRsaApproval: boolean }) => Promise<void>;
  onAssignDevice: (payload: {
    candidateId: string;
    propertyId: string;
    roomId: string;
    endpointLabel: string;
  }) => Promise<void>;
  onRunScenario: (scenarioId: string) => Promise<void>;
  onAdbProbe?: (candidateId: string) => Promise<any>;
  onAdbScreenshot?: (candidateId: string) => Promise<any>;
  statusBanner: { type: 'success' | 'error' | 'info'; text: string } | null;
}

export const DeviceDiscoveryView: React.FC<DeviceDiscoveryViewProps> = ({
  environmentId,
  activeProperty,
  properties,
  rooms,
  connectors,
  candidates,
  discoveryRuns,
  scenarios,
  hostRuntime,
  onRegisterConnector,
  onRunScan,
  onAddManualTarget,
  onAdbPair,
  onAdbConnect,
  onAssignDevice,
  onRunScenario,
  onAdbProbe,
  onAdbScreenshot,
  statusBanner,
}) => {
  const defaultIface =
    hostRuntime.interfaces.find((i) => !i.internal) ||
    hostRuntime.interfaces[0] || { name: 'eth0', address: '192.168.10.10', cidr: '192.168.10.0/24' };

  const activeConnector = connectors.find((c) => c.propertyId === activeProperty.id);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(activeProperty.id);
  const [connectorName, setConnectorName] = useState<string>(`${activeProperty.name} Installer Laptop`);
  const [selectedInterface, setSelectedInterface] = useState<string>(
    activeConnector?.interfaceName || `${defaultIface.name} (${defaultIface.address})`
  );
  const [subnetCidr, setSubnetCidr] = useState<string>(
    activeConnector?.subnetCidr || (environmentId === 'DEMO' ? '192.168.10.0/24' : defaultIface.cidr)
  );
  const [portsInput, setPortsInput] = useState<string>('5555');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);
  const [autoRefreshScreenshot, setAutoRefreshScreenshot] = useState<boolean>(false);

  // Manual Target Form
  const [manualIp, setManualIp] = useState<string>(environmentId === 'DEMO' ? '192.168.10.108' : '');
  const [manualPort, setManualPort] = useState<string>('5555');
  const [manualPairPort, setManualPairPort] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');

  // Selected candidate for pairing / connecting / assigning
  const propertyCandidates = candidates.filter((c) => c.propertyId === selectedPropertyId);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(propertyCandidates[0]?.id || '');
  const selectedCandidate =
    propertyCandidates.find((c) => c.id === selectedCandidateId) || propertyCandidates[0] || null;

  const [pairingPortInput, setPairingPortInput] = useState<string>('37123');
  const [pairingCodeInput, setPairingCodeInput] = useState<string>('');
  const [simulateRsaChecked, setSimulateRsaChecked] = useState<boolean>(true);

  const propertyRooms = rooms.filter((r) => r.propertyId === selectedPropertyId);
  const [targetRoomId, setTargetRoomId] = useState<string>(propertyRooms[0]?.id || '');
  const [endpointLabel, setEndpointLabel] = useState<string>('Living Room SmartTV');

  const wrapBusy = async (key: string, fn: () => Promise<void>) => {
    setBusyAction(key);
    try {
      await fn();
    } finally {
      setBusyAction(null);
    }
  };

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (autoRefreshScreenshot && selectedCandidate && onAdbScreenshot) {
      timer = setInterval(() => {
        onAdbScreenshot(selectedCandidate.id).catch(() => {});
      }, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefreshScreenshot, selectedCandidate?.id, onAdbScreenshot]);

  return (
    <div className="space-y-6">
      {/* Top Provenance & Mode Disclosure Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          environmentId === 'LIVE_LAB'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
            : 'bg-blue-500/10 border-blue-500/30 text-slate-900 dark:text-slate-100'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Radar className="w-4 h-4 text-[#0050F5] dark:text-[#C7B9FF]" />
            <span>
              {environmentId === 'LIVE_LAB'
                ? 'LIVE_LAB Mode — Zero Simulated Scans or Fake Connections'
                : 'DEMO Workspace — Deterministic Onboarding & Failure Scenarios'}
            </span>
          </div>
          <p className="text-xs opacity-85 max-w-3xl">
            {environmentId === 'LIVE_LAB'
              ? 'In LIVE_LAB mode, network scans and ADB connections execute directly against real sockets and official Android SDK Platform-Tools (adb). Open ports alone never mark a TV as verified; DEVICE_VERIFIED requires adb get-state=device and allowlisted read-only getprop inventory.'
              : 'In DEMO mode, you can test the full 8-step onboarding wizard (IN-01..IN-08) and inject deterministic edge cases (Connector offline, RSA prompt pending, OutcomeUnknown disconnect) before switching to LIVE_LAB.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/gojja-connector.mjs"
            download="gojja-connector.mjs"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Local Connector CLI</span>
          </a>
        </div>
      </div>

      {statusBanner && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
            statusBanner.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-200'
              : statusBanner.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
              : 'bg-blue-500/15 border-blue-500/40 text-blue-800 dark:text-blue-200'
          }`}
        >
          {statusBanner.type === 'error' ? (
            <XCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{statusBanner.text}</span>
        </div>
      )}

      {/* LB-01: Runtime & Toolchain Preflight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
          <div className="text-xs text-[var(--cms-text-secondary)]">LB-01 • Host Runtime & OS</div>
          <div className="text-sm font-semibold mt-1 font-mono-tabular">{hostRuntime.platform}</div>
          <div className="text-xs text-[var(--cms-text-secondary)] mt-1">
            Interfaces detected: {hostRuntime.interfaces.length} IPv4 adapter(s)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
          <div className="text-xs text-[var(--cms-text-secondary)]">LB-01 • Official SDK Platform-Tools (ADB)</div>
          <div className="text-sm font-semibold mt-1 flex items-center gap-1.5">
            {hostRuntime.adb.available ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="truncate">{hostRuntime.adb.available ? 'ADB Binary Ready' : 'Host ADB Not in Container PATH'}</span>
          </div>
          <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1 line-clamp-1" title={hostRuntime.adb.version}>
            {hostRuntime.adb.version}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
          <div className="text-xs text-[var(--cms-text-secondary)]">LB-02 • Active Connector Grant</div>
          <div className="text-sm font-semibold mt-1">
            {activeConnector ? `${activeConnector.id} (${activeConnector.status})` : 'No Connector Enrolled Yet'}
          </div>
          <div className="text-xs text-[var(--cms-text-secondary)] mt-1 font-mono-tabular">
            {activeConnector ? `Authorized Subnet: ${activeConnector.subnetCidr}` : 'Complete Step 1 below to grant LAN consent'}
          </div>
        </div>
      </div>

      {/* STEP 1 & STEP 2: Connector Registration (IN-01/02) + Network Scan Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#0050F5] dark:text-[#C7B9FF]">STEP 1 • IN-01 & IN-02</span>
              <h3 className="text-base font-bold">Authorize Local Network & Connector Grant</h3>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#0050F5] dark:text-[#C7B9FF]" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium mb-1">Target Property Scope</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  const firstR = rooms.find((r) => r.propertyId === e.target.value);
                  if (firstR) setTargetRoomId(firstR.id);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Connector Identity Label</label>
              <input
                type="text"
                value={connectorName}
                onChange={(e) => setConnectorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Host LAN Interface</label>
                <select
                  value={selectedInterface}
                  onChange={(e) => setSelectedInterface(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-mono-tabular"
                >
                  {hostRuntime.interfaces.map((iface, i) => (
                    <option key={i} value={`${iface.name} (${iface.address})`}>
                      {iface.name} — {iface.address}
                    </option>
                  ))}
                  <option value="eth0 (Hospitality Management VLAN 10)">eth0 — 192.168.10.10</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Bounded RFC1918 CIDR (Max /24)</label>
                <input
                  type="text"
                  value={subnetCidr}
                  onChange={(e) => setSubnetCidr(e.target.value)}
                  placeholder="192.168.10.0/24"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-mono-tabular"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Candidate ADB / Pairing Ports to Probe</label>
              <input
                type="text"
                value={portsInput}
                onChange={(e) => setPortsInput(e.target.value)}
                placeholder="5555, 5556"
                className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-mono-tabular"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                disabled={busyAction !== null}
                onClick={() =>
                  wrapBusy('enroll', () =>
                    onRegisterConnector({
                      propertyId: selectedPropertyId,
                      name: connectorName,
                      interfaceName: selectedInterface,
                      subnetCidr,
                    })
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[var(--cms-bg)] hover:opacity-90 border border-[var(--cms-control-border)] font-semibold text-xs transition-all"
              >
                {busyAction === 'enroll' ? 'Saving Grant...' : '1. Enroll & Authorize Subnet Grant'}
              </button>

              <button
                disabled={busyAction !== null}
                onClick={() => {
                  const parsedPorts = portsInput
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => !Number.isNaN(n) && n > 0 && n <= 65535);
                  wrapBusy('scan', () =>
                    onRunScan({
                      propertyId: selectedPropertyId,
                      subnetCidr,
                      ports: parsedPorts.length ? parsedPorts : [5555],
                    })
                  );
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${busyAction === 'scan' ? 'animate-spin' : ''}`} />
                <span>{busyAction === 'scan' ? 'Scanning Subnet...' : '2. Scan Authorized Network'}</span>
              </button>
            </div>
          </div>

          {/* Manual IP / Wireless Debugging Target Addition (L-009) */}
          <div className="pt-4 border-t border-[var(--cms-divider)] space-y-2.5 text-xs">
            <div className="font-semibold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#0050F5]" />
              <span>Manual Target / Wireless Debugging Endpoint (Fallback when mDNS is filtered)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={manualIp}
                onChange={(e) => setManualIp(e.target.value)}
                placeholder="IP (e.g. 192.168.10.108)"
                className="px-2.5 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
              />
              <input
                type="text"
                value={manualPort}
                onChange={(e) => setManualPort(e.target.value)}
                placeholder="Conn Port (5555)"
                className="px-2.5 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
              />
              <input
                type="text"
                value={manualPairPort}
                onChange={(e) => setManualPairPort(e.target.value)}
                placeholder="Pair Port (opt)"
                className="px-2.5 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Friendly hint (e.g. Room 108 Android TV)"
                className="flex-1 px-2.5 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
              />
              <button
                disabled={busyAction !== null || !manualIp.trim()}
                onClick={() =>
                  wrapBusy('manual', () =>
                    onAddManualTarget({
                      propertyId: selectedPropertyId,
                      ip: manualIp,
                      port: Number(manualPort) || 5555,
                      pairingPort: manualPairPort ? Number(manualPairPort) : undefined,
                      friendlyName: manualName || undefined,
                    })
                  )
                }
                className="px-3.5 py-2 rounded-lg bg-[#0050F5] text-white font-semibold whitespace-nowrap"
              >
                Add & Probe Target
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 RESULTS: Discovery Candidate Table (IN-03) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-semibold text-[#0050F5] dark:text-[#C7B9FF]">STEP 2 • IN-03 DISCOVERY RESULTS</span>
                <h3 className="text-base font-bold">
                  Discovered LAN Candidates ({propertyCandidates.length})
                </h3>
              </div>
              <span className="text-xs text-[var(--cms-text-secondary)]">
                Found ≠ Reachable ≠ ADBVerified ≠ Enrolled
              </span>
            </div>

            {propertyCandidates.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-[var(--cms-divider)] text-center space-y-2">
                <Wifi className="w-8 h-8 mx-auto text-[var(--cms-text-secondary)] opacity-60" />
                <div className="text-sm font-semibold">
                  {environmentId === 'LIVE_LAB'
                    ? '0 Verified Live Candidates Observed Yet'
                    : 'No Candidates in Current Property Scope'}
                </div>
                <p className="text-xs text-[var(--cms-text-secondary)] max-w-md mx-auto">
                  {environmentId === 'LIVE_LAB'
                    ? 'LIVE_LAB never populates simulated TVs. Click "1. Enroll & Authorize Subnet Grant" then "2. Scan Authorized Network", or run the downloadable gojja-connector.mjs script on your property Wi-Fi/LAN.'
                    : 'Run a discovery scan or add a manual IP target to inspect candidate states.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                      <th className="py-2.5 px-4 font-medium">Candidate / Brand & Model</th>
                      <th className="py-2.5 px-3 font-medium">IP : Port</th>
                      <th className="py-2.5 px-3 font-medium">Source</th>
                      <th className="py-2.5 px-3 font-medium">Reachability</th>
                      <th className="py-2.5 px-3 font-medium">Verification State</th>
                      <th className="py-2.5 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cms-divider)]">
                    {propertyCandidates.map((cand) => {
                      const isSel = selectedCandidate?.id === cand.id;
                      const hasBrand = Boolean(cand.observedBrand || cand.observedManufacturer);
                      return (
                        <tr
                          key={cand.id}
                          onClick={() => setSelectedCandidateId(cand.id)}
                          className={`cursor-pointer transition-colors ${
                            isSel ? 'bg-[#0050F5]/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Tv className="w-4 h-4 text-[#0050F5] shrink-0" />
                              <div>
                                <div className="font-semibold flex items-center gap-1.5">
                                  <span>{cand.friendlyName}</span>
                                  {hasBrand && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                      {cand.observedBrand || cand.observedManufacturer}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[var(--cms-text-secondary)]">
                                  {cand.observedModel ? `${cand.observedModel} • Android ${cand.observedAndroidVersion || '?'}` : cand.serviceHint}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono-tabular">
                            {cand.ip}:{cand.port}
                            {cand.pairingPort && (
                              <div className="text-[10px] text-amber-600 dark:text-amber-300">
                                Pair:{cand.pairingPort}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono-tabular text-[11px]">
                            {cand.discoverySource} · {cand.executionMode}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-medium ${
                                cand.reachability === 'Reachable'
                                   ? 'text-emerald-700 dark:text-emerald-300'
                                   : 'text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {cand.reachability}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {cand.authState === 'DeviceVerified' || cand.authState === 'Enrolled' ? (
                              <span className="text-emerald-700 dark:text-emerald-300">{cand.authState}</span>
                            ) : cand.authState === 'Unsupported' ? (
                              <span className="text-rose-700 dark:text-rose-300">{cand.authState}</span>
                            ) : (
                              <span className="text-amber-700 dark:text-amber-300">{cand.authState}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onAdbProbe && cand.port === 5555 && (
                                <button
                                  title="Probe & Kenali TV"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCandidateId(cand.id);
                                    wrapBusy(`probe-${cand.id}`, () => onAdbProbe(cand.id));
                                  }}
                                  className="px-2 py-1 rounded-lg text-xs bg-[var(--cms-bg)] hover:bg-[#0050F5]/10 border border-[var(--cms-control-border)] text-[var(--cms-text)] flex items-center gap-1"
                                >
                                  <Zap className={`w-3 h-3 text-amber-500 ${busyAction === `probe-${cand.id}` ? 'animate-spin' : ''}`} />
                                  <span>{busyAction === `probe-${cand.id}` ? 'Probing...' : 'Probe'}</span>
                                </button>
                              )}
                              {onAdbScreenshot && cand.port === 5555 && (
                                <button
                                  title="Ambil Screenshot Realtime"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCandidateId(cand.id);
                                    wrapBusy(`snap-${cand.id}`, () => onAdbScreenshot(cand.id));
                                  }}
                                  className="px-2 py-1 rounded-lg text-xs bg-[var(--cms-bg)] hover:bg-[#0050F5]/10 border border-[var(--cms-control-border)] text-[var(--cms-text)] flex items-center gap-1"
                                >
                                  <Camera className={`w-3 h-3 text-[#0050F5] ${busyAction === `snap-${cand.id}` ? 'animate-pulse' : ''}`} />
                                  <span>{busyAction === `snap-${cand.id}` ? 'Snap...' : 'Screenshot'}</span>
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidateId(cand.id);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  isSel
                                    ? 'bg-[#0050F5] text-white'
                                    : 'bg-[var(--cms-bg)] border border-[var(--cms-control-border)]'
                                }`}
                              >
                                {isSel ? 'Selected' : 'Inspect'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Latest Discovery Run Coverage Log */}
          {discoveryRuns.length > 0 && discoveryRuns[0] && (
            <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs space-y-1">
              <div className="flex items-center justify-between font-mono-tabular text-[11px] text-[var(--cms-text-secondary)]">
                <span>Latest Run: {discoveryRuns[0]?.id || '-'} ({discoveryRuns[0]?.executionMode || '-'})</span>
                <span>Subnet: {discoveryRuns[0]?.subnetCidr || '-'} • Attempted: {discoveryRuns[0]?.hostsAttempted || 0} hosts</span>
              </div>
              <div className="font-medium">{discoveryRuns[0]?.summaryText || 'Scan run completed.'}</div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3 & STEP 4: ADB Pair / Connect / Read Device Info (IN-04 / LB-03) + Assign to Property & Room (IN-05) */}
      {selectedCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: ADB Authorization, Wireless Pairing & Read-Only getprop Inventory */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0050F5] dark:text-[#C7B9FF]">
                  STEP 3 • IN-04 & LB-03 ADB SESSION INSPECTOR
                </span>
                <h3 className="text-base font-bold">
                  Pair, Connect & Read Device Inventory — {selectedCandidate.friendlyName} ({selectedCandidate.ip}:{selectedCandidate.port})
                </h3>
              </div>
              <Terminal className="w-5 h-5 text-[#0050F5] dark:text-[#C7B9FF]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                <span>State: <strong>{selectedCandidate.authState}</strong></span>
                <span>·</span>
                <span>Origin: <strong>{selectedCandidate.origin}</strong></span>
                <span>·</span>
                <span>Mode: <strong>{selectedCandidate.executionMode}</strong></span>
              </div>
              <p className="text-[var(--cms-text-secondary)]">{selectedCandidate.notes}</p>
            </div>

            {/* Route A: Wireless Debugging Pairing (Android 11+/13+ TLS Pairing Port + 6-digit code) */}
            <div className="p-4 rounded-xl border border-[var(--cms-divider)] space-y-3 text-xs">
              <div className="font-semibold flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0050F5]" />
                <span>Route A — Wireless Debugging TLS Pairing (Optional if device uses separate pairing port)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-[var(--cms-text-secondary)] mb-1">Pairing Port (≠ {selectedCandidate.port})</label>
                  <input
                    type="text"
                    value={pairingPortInput}
                    onChange={(e) => setPairingPortInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--cms-text-secondary)] mb-1">6-Digit One-Time Pairing Code</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={pairingCodeInput}
                    onChange={(e) => setPairingCodeInput(e.target.value)}
                    placeholder="e.g. 482910"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    disabled={busyAction !== null}
                    onClick={() =>
                      wrapBusy('pair', () =>
                        onAdbPair({
                          candidateId: selectedCandidate.id,
                          pairingPort: Number(pairingPortInput) || 37123,
                          pairingCode: pairingCodeInput,
                        })
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--cms-bg)] hover:opacity-90 border border-[var(--cms-control-border)] font-semibold"
                  >
                    {busyAction === 'pair' ? 'Pairing...' : 'Run adb pair'}
                  </button>
                </div>
              </div>
            </div>

            {/* Route B: Direct TCP Connect (Port 5555 or Paired Connection Port) + Read-Only Inventory */}
            <div className="p-4 rounded-xl border border-[var(--cms-divider)] space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#0050F5]" />
                  <span>Route B — Connect & Verify Transport + Read-Only getprop Inventory ({selectedCandidate.ip}:{selectedCandidate.port})</span>
                </div>
                {environmentId === 'DEMO' && (
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px]">
                    <input
                      type="checkbox"
                      checked={simulateRsaChecked}
                      onChange={(e) => setSimulateRsaChecked(e.target.checked)}
                    />
                    <span>Simulate On-TV RSA Prompt Approved</span>
                  </label>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={busyAction !== null}
                  onClick={() =>
                    wrapBusy('connect', () =>
                      onAdbConnect({
                        candidateId: selectedCandidate.id,
                        simulateTvRsaApproval: simulateRsaChecked,
                      })
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold inline-flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>
                    {busyAction === 'connect'
                      ? 'Connecting & Querying getprop...'
                      : `Connect to ${selectedCandidate.ip}:${selectedCandidate.port} & Read Device Info`}
                  </span>
                </button>
              </div>

              {/* Verified Device Hardware Information Table */}
              {selectedCandidate.observedModel && (
                <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Android TV / Box Inventory (Read-Only getprop)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono-tabular text-[11px]">
                    <div>
                      <span className="text-[var(--cms-text-secondary)] block">ro.product.manufacturer</span>
                      <strong>{selectedCandidate.observedManufacturer}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--cms-text-secondary)] block">ro.product.model</span>
                      <strong>{selectedCandidate.observedModel}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--cms-text-secondary)] block">ro.build.version.release / sdk</span>
                      <strong>
                        Android {selectedCandidate.observedAndroidVersion} (API {selectedCandidate.observedSdkInt})
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--cms-text-secondary)] block">ro.serialno</span>
                      <strong>{selectedCandidate.observedSerial}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[var(--cms-text-secondary)] block">ro.build.fingerprint</span>
                      <strong className="break-all">{selectedCandidate.observedBuildFingerprint}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Route C: Live Remote Visual TV Screen Capture & Diagnostics (Zero-Console Realtime View) */}
            <div className="p-4 rounded-xl border border-[var(--cms-divider)] space-y-3 text-xs bg-[var(--cms-bg)]/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#0050F5]" />
                  <span>Route C — Real-Time Visual Screen Capture & Live Remote View</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-[var(--cms-text-secondary)]">
                    <input
                      type="checkbox"
                      checked={autoRefreshScreenshot}
                      onChange={(e) => setAutoRefreshScreenshot(e.target.checked)}
                      className="rounded"
                    />
                    <span>Auto-refresh (5s)</span>
                  </label>
                  <button
                    disabled={busyAction !== null}
                    onClick={() =>
                      wrapBusy('screenshot', async () => {
                        if (onAdbScreenshot) {
                          await onAdbScreenshot(selectedCandidate.id);
                        }
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Camera className={`w-3.5 h-3.5 ${busyAction === 'screenshot' ? 'animate-pulse' : ''}`} />
                    <span>{busyAction === 'screenshot' ? 'Capturing Frame...' : 'Ambil Screenshot Realtime'}</span>
                  </button>
                </div>
              </div>

              {/* TV Screen Display with Realistic TV Bezel Frame */}
              <div className="relative rounded-2xl border-4 border-slate-900 bg-black overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
                {selectedCandidate.lastScreenshotUrl ? (
                  <>
                    <img
                      src={selectedCandidate.lastScreenshotUrl}
                      alt={`Live screen of ${selectedCandidate.friendlyName}`}
                      className="w-full h-full object-contain cursor-pointer transition-transform duration-200"
                      onClick={() => setScreenshotModalUrl(selectedCandidate.lastScreenshotUrl || null)}
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur text-[10px] text-white font-mono flex items-center gap-2 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>LIVE TV • {selectedCandidate.lastScreenshotCapturedAt ? new Date(selectedCandidate.lastScreenshotCapturedAt).toLocaleTimeString() : 'Current'}</span>
                    </div>
                    <button
                      onClick={() => setScreenshotModalUrl(selectedCandidate.lastScreenshotUrl || null)}
                      className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/70 hover:bg-black text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 backdrop-blur border border-white/10"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Perbesar Layar</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2.5 text-slate-400">
                    <Tv className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
                    <div className="text-xs font-semibold text-slate-300">Belum ada screenshot TV yang diambil</div>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Klik <strong>"Ambil Screenshot Realtime"</strong> di atas untuk menangkap tampilan fisik layar TV {selectedCandidate.friendlyName} secara langsung tanpa membuka command prompt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: STEP 4 — Assign Verified Device to Property & Room (IN-05) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#0050F5] dark:text-[#C7B9FF]">
                    STEP 4 • IN-05 ROOM MAPPING & SEAT BINDING
                  </span>
                  <h3 className="text-base font-bold">Assign Verified Device to Property & Room</h3>
                </div>
                <Smartphone className="w-5 h-5 text-[#0050F5] dark:text-[#C7B9FF]" />
              </div>

              <p className="text-xs text-[var(--cms-text-secondary)]">
                Binding requires <code className="font-mono-tabular">DeviceVerified</code> state and checks available subscription seats atomically (BR01 / BR03).
              </p>

              {/* M10 / Area 5: Hardware Preflight & Limitation Inspection Report */}
              {(() => {
                const preflight = runDevicePreflight(selectedCandidate);
                return (
                  <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--cms-text)]">
                        <ShieldCheck className="w-4 h-4 text-[#0050F5]" />
                        <span>Preflight & Limitation Inspection</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          preflight.criticalPassed
                            ? preflight.items.some((i) => i.status === 'Unsupported')
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {preflight.criticalPassed
                          ? preflight.items.some((i) => i.status === 'Unsupported')
                            ? 'Limited'
                            : 'Supported'
                          : 'Preflight Blocked'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--cms-text-secondary)] italic leading-relaxed">
                      {preflight.summary}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {preflight.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-lg bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-[11px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[var(--cms-text)]">{item.name}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                item.status === 'Supported'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : item.status === 'Limited'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--cms-text-secondary)] flex items-center justify-between">
                            <span>{item.observedValue}</span>
                            {item.isCritical && <span className="text-rose-500 font-bold uppercase text-[9px]">Critical</span>}
                          </div>
                          {item.requiredAction && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium pt-0.5">
                              Action: {item.requiredAction}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Selected Candidate</label>
                  <div className="px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] font-mono-tabular">
                    {selectedCandidate.friendlyName} ({selectedCandidate.ip}:{selectedCandidate.port}) —{' '}
                    <strong>{selectedCandidate.authState}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Assign to Room in {selectedPropertyId}</label>
                  <select
                    value={targetRoomId}
                    onChange={(e) => setTargetRoomId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                  >
                    {propertyRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.code} ({r.roomClass} • Floor {r.floor})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Endpoint Role Label</label>
                  <input
                    type="text"
                    value={endpointLabel}
                    onChange={(e) => setEndpointLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                  />
                </div>

                {(() => {
                  const preflight = runDevicePreflight(selectedCandidate);
                  const canBind = preflight.criticalPassed && busyAction === null;
                  return (
                    <button
                      disabled={!canBind}
                      onClick={() =>
                        wrapBusy('assign', () =>
                          onAssignDevice({
                            candidateId: selectedCandidate.id,
                            propertyId: selectedPropertyId,
                            roomId: targetRoomId,
                            endpointLabel,
                          })
                        )
                      }
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                        canBind
                          ? 'bg-[#0050F5] hover:bg-[#0040C8] text-white shadow-sm'
                          : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span>
                        {busyAction === 'assign'
                          ? 'Binding Endpoint & Seat...'
                          : canBind
                          ? 'Bind Verified Device to Room'
                          : 'Binding Blocked (Resolve Critical Preflight)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  );
                })()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] text-[var(--cms-text-secondary)] space-y-1">
              <div className="font-semibold text-[var(--cms-text)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0050F5]" />
                <span>Command Allowlist & Recovery Guardrails (§15)</span>
              </div>
              <p>
                Live connector surface strictly allowlists <code className="font-mono-tabular">adb version</code>,{' '}
                <code className="font-mono-tabular">adb mdns services</code>,{' '}
                <code className="font-mono-tabular">adb pair</code>,{' '}
                <code className="font-mono-tabular">adb connect</code>,{' '}
                <code className="font-mono-tabular">get-state</code>, and fixed read-only{' '}
                <code className="font-mono-tabular">getprop</code> keys. Arbitrary shell, root, bootloader unlock, and factory reset are prohibited.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deterministic Scenario Controller Strip (DEMO Mode Only) */}
      {environmentId === 'DEMO' && (
        <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#0050F5] dark:text-[#C7B9FF]">
                DETERMINISTIC SCENARIO CONTROLLER (DEMO WORKSPACE ONLY)
              </span>
              <h3 className="text-sm font-bold">
                Reproduce Onboarding, Update Race, Stale Checkout & Idempotency Scenarios
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {scenarios.map((scn) => (
              <div
                key={scn.id}
                className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex flex-col justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">{scn.code}</div>
                  <div className="font-semibold mt-0.5">{scn.title}</div>
                  <p className="text-[11px] text-[var(--cms-text-secondary)] mt-1">{scn.description}</p>
                </div>
                <button
                  disabled={busyAction !== null}
                  onClick={() => wrapBusy(scn.id, () => onRunScenario(scn.id))}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[var(--cms-surface)] hover:bg-[#0050F5] hover:text-white border border-[var(--cms-control-border)] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Trigger {scn.code}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen TV Screenshot Modal */}
      {screenshotModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setScreenshotModalUrl(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#0050F5]" />
                <span className="font-bold text-sm">
                  {selectedCandidate ? `${selectedCandidate.friendlyName} (${selectedCandidate.ip}:${selectedCandidate.port})` : 'Live TV Screen'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  REALTIME CAPTURE
                </span>
              </div>
              <button
                onClick={() => setScreenshotModalUrl(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Tutup (Esc)
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center">
              <img
                src={screenshotModalUrl}
                alt="Fullscreen TV Capture"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Resolution: Direct Framebuffer Stream</span>
              <a
                href={screenshotModalUrl}
                download={`tv_screenshot_${selectedCandidate?.ip || 'capture'}.png`}
                className="text-[#0050F5] hover:underline flex items-center gap-1 font-sans"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Gambar PNG</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
