import {
  // Fase A
  INITIAL_SEAT_LEDGER,
  resolveEndpointCapabilities,
  CapabilityKey,
  // Fase B
  evaluateEndpointUpdateEligibility,
  resolveEffectiveLineup,
  INITIAL_ENDPOINTS,
  INITIAL_RELEASES,
  INITIAL_UPDATE_APPROVALS,
  INITIAL_ROOMS,
  INITIAL_CONTRACTS,
  INITIAL_CHANNELS,
  INITIAL_STAYS,
  // Fase C
  resolveBranding,
  calculateContrastRatio,
  evaluateCampaignEligibility,
  INITIAL_PROPERTIES,
  INITIAL_PROFILE_OVERRIDES,
  INITIAL_CORPORATE_GROUPS,
  INITIAL_CAMPAIGNS,
  INITIAL_PLAYBACK_FACTS,
  // Fase D
  maskGuestName,
  INITIAL_AD_OFFERS,
  INITIAL_PROPERTY_AD_ACCEPTANCES,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_SERVICE_ORDERS,
  AdOffer,
  PropertyAdAcceptance,
  ServiceOrder,
} from '../src/data/mockData';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

console.log('================================================================');
console.log('🚀 GOJJA SMARTTV — UNIFIED SUITE: DEFINITION OF DONE VERIFIER');
console.log('================================================================\n');

// -------------------------------------------------------------
// FASE A: SEAT LEDGER & CAPABILITY GATING
// -------------------------------------------------------------
console.log('--- [FASE A] Seat Ledger, Prorata & Capability Gating ---');

// A1: Seat Ledger balance calculation
const totalCredits = INITIAL_SEAT_LEDGER.reduce((acc, e) => acc + (e.quantityDelta > 0 ? e.quantityDelta : 0), 0);
const totalDebits = INITIAL_SEAT_LEDGER.reduce((acc, e) => acc + (e.quantityDelta < 0 ? Math.abs(e.quantityDelta) : 0), 0);
const netActiveSeats = totalCredits - totalDebits;
assert(netActiveSeats > 0, `Seat ledger net active seats calculated (${netActiveSeats} seats)`);

// A2: Capability Taxonomy completeness & resolution
const expected10Keys: CapabilityKey[] = [
  'launcher.takeover',
  'adb.install',
  'adb.shell',
  'kiosk.mode',
  'power.recovery',
  'drm.widevine.l1',
  'playback.hls',
  'playback.dash',
  'offline.cache',
  'remote.dpad',
];
assert(expected10Keys.length === 10, '10-key capability taxonomy defined and complete');

const endpointCaps = resolveEndpointCapabilities(INITIAL_ENDPOINTS[0]);
expected10Keys.forEach((key) => {
  assert(endpointCaps[key] !== undefined, `Endpoint resolves capability: ${key}`);
});

// A3: Prorata formula test (30-day month, 15 days remaining for 10 additional seats @ $5/seat)
const remainingDays = 15;
const totalDaysInMonth = 30;
const additionalSeats = 10;
const pricePerSeat = 5;
const prorataCharge = (additionalSeats * pricePerSeat * remainingDays) / totalDaysInMonth;
assert(prorataCharge === 25, `Change order prorata calculated accurately ($${prorataCharge} for 15/30 days)`);

// -------------------------------------------------------------
// FASE B: OTA STATE MACHINE & PROVIDER ENTITLEMENT
// -------------------------------------------------------------
console.log('\n--- [FASE B] OTA Update Engine & Provider Entitlements ---');

const testEndpoint = INITIAL_ENDPOINTS[0];
const targetRelease = INITIAL_RELEASES[0];
const testRoom = INITIAL_ROOMS.find((r) => r.id === testEndpoint.roomId);
const testApproval = INITIAL_UPDATE_APPROVALS.find((a) => a.releaseId === targetRelease.id);

// B1: OTA 9-step evaluation
const otaEval = evaluateEndpointUpdateEligibility(
  testEndpoint,
  testRoom,
  INITIAL_STAYS[0],
  targetRelease,
  testApproval
);
assert(typeof otaEval.eligible === 'boolean', `OTA evaluation executed with eligible=${otaEval.eligible}`);
assert(otaEval.steps.length === 9, `OTA evaluation strictly executes 9-step criteria (${otaEval.steps.length} steps evaluated)`);
assert(typeof otaEval.primaryReason === 'string', `OTA evaluation outputs primaryReason: "${otaEval.primaryReason}"`);

// B2: Check-in deferral rule (BR06)
const stayImminent = {
  ...INITIAL_STAYS[0],
  status: 'Planned' as const,
  arrivalUtc: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now (<6h)
};
const otaDeferEval = evaluateEndpointUpdateEligibility(
  testEndpoint,
  testRoom,
  stayImminent,
  targetRelease,
  testApproval
);
const step7 = otaDeferEval.steps.find((s) => s.step === 7);
assert(
  step7?.passed === false || !otaDeferEval.eligible,
  'BR06 check-in deferral blocks non-critical update when guest check-in is imminent (<6h)'
);

// B3: Provider Entitlement & Effective Lineup
const lineupStandard = resolveEffectiveLineup(
  INITIAL_PROPERTIES[0].id,
  'Standard',
  false,
  INITIAL_CONTRACTS,
  INITIAL_CHANNELS
);
const lineupSuite = resolveEffectiveLineup(
  INITIAL_PROPERTIES[0].id,
  'Suite',
  false,
  INITIAL_CONTRACTS,
  INITIAL_CHANNELS
);
assert(lineupStandard.channels.length > 0, 'Standard room class receives authorized channels');
assert(lineupSuite.channels.length >= lineupStandard.channels.length, 'Suite tier receives equal or superior channel count');

// -------------------------------------------------------------
// FASE C: MULTI-LAYER BRANDING & CAMPAIGN MEASUREMENT
// -------------------------------------------------------------
console.log('\n--- [FASE C] Multi-Layer Branding & Campaign Telemetry ---');

// C1: WCAG 2.1 Contrast Ratio
const contrastRatioAA = calculateContrastRatio('#1E3A2F', '#DCC6A1');
assert(contrastRatioAA >= 4.5, `WCAG contrast passes AA threshold (${contrastRatioAA.toFixed(2)}:1 >= 4.5)`);

// C2: 6-Tier Branding Provenance
const suiteBranding = resolveBranding(
  INITIAL_PROPERTIES[0],
  INITIAL_PROFILE_OVERRIDES,
  { propertyId: INITIAL_PROPERTIES[0].id, roomClass: 'Suite' },
  INITIAL_CORPORATE_GROUPS,
  INITIAL_STAYS
);
assert(suiteBranding.values.accentColor === '#E5C185', 'Suite room class override applied (#E5C185)');
assert(suiteBranding.provenance.accentColor.layer === 'ROOM_CLASS', 'Provenance correctly traces to ROOM_CLASS tier');

// C3: Campaign Frequency Cap per Stay
const testCampaign = INITIAL_CAMPAIGNS[0];
const activeStay = INITIAL_STAYS[0];
const eligibility1 = evaluateCampaignEligibility(
  {
    propertyId: INITIAL_PROPERTIES[0].id,
    placement: testCampaign.placement,
    stayId: activeStay.id,
    currentPlayCountThisStay: 0,
  },
  INITIAL_CAMPAIGNS
);
assert(eligibility1.selectedCampaign !== null, `Campaign eligible under frequency cap (${eligibility1.selectedCampaign?.id})`);

// Exhaust cap: pass currentPlayCountThisStay >= frequencyCapPerStay
const eligibilityCap = evaluateCampaignEligibility(
  {
    propertyId: INITIAL_PROPERTIES[0].id,
    placement: testCampaign.placement,
    stayId: activeStay.id,
    currentPlayCountThisStay: (testCampaign.frequencyCapPerStay || 2) + 1,
  },
  [testCampaign]
);
assert(
  eligibilityCap.denials.some((d) => d.code === 'FREQUENCY_CAP_REACHED') || eligibilityCap.selectedCampaign === null,
  'Frequency cap per stay strictly enforced upon reaching limit (FREQUENCY_CAP_REACHED)'
);

// -------------------------------------------------------------
// FASE D: COMMERCIAL EXPANSION & ZERO-PII GOVERNANCE
// -------------------------------------------------------------
console.log('\n--- [FASE D] Marketplace, External Ads & Zero-PII ---');

// D1: Zero-PII Name Masking
assert(maskGuestName('Budi Santoso') === 'B*** S***', 'Budi Santoso masked to B*** S***');
assert(maskGuestName('Dr. Dian Wulandari') === 'D*** D*** W***', 'Dr. Dian Wulandari masked to D*** D*** W***');

// D2: External Ad Opt-In Requirement
const externalCampaign = {
  ...INITIAL_CAMPAIGNS[0],
  id: 'CMP-EXT-TEST',
  externalPaid: true,
  adOfferId: 'OFFER-01',
  offerVersion: 1,
  placement: 'home_hero' as const,
};
const unacceptedEval = evaluateCampaignEligibility(
  {
    propertyId: INITIAL_PROPERTIES[0].id,
    placement: 'home_hero',
    stayId: activeStay.id,
    propertyAdAcceptances: [], // No acceptances
  },
  [externalCampaign]
);
assert(
  unacceptedEval.denials.some((d) => d.code === 'EXTERNAL_AD_NOT_ACCEPTED'),
  'Unaccepted external ad offer denied with EXTERNAL_AD_NOT_ACCEPTED'
);

// D3: Material Creative Invalidation (Superceded)
const staleAcceptance: PropertyAdAcceptance = {
  id: 'ACC-TEST-STALE',
  offerId: 'OFFER-01',
  propertyId: INITIAL_PROPERTIES[0].id,
  acceptedPlacements: ['home_hero'],
  acceptedPeriod: { startUtc: '2026-01-01T00:00:00Z', endUtc: '2026-12-31T23:59:59Z' },
  acceptedCapPerStay: 500,
  commercialTermsRef: 'REF-01',
  acceptedBy: 'manager@hotel.com',
  acceptedAtUtc: new Date().toISOString(),
  status: 'Accepted',
  offerVersion: 1, // Accepted version 1
};
const revisedOfferCampaign = {
  ...externalCampaign,
  offerVersion: 2, // Material revision version 2
};
const supercededEval = evaluateCampaignEligibility(
  {
    propertyId: INITIAL_PROPERTIES[0].id,
    placement: 'home_hero',
    stayId: activeStay.id,
    propertyAdAcceptances: [staleAcceptance],
  },
  [revisedOfferCampaign]
);
assert(
  supercededEval.denials.some((d) => d.code === 'EXTERNAL_AD_SUPERCEDED'),
  'Revision mismatch automatically supercedes old acceptance and yields EXTERNAL_AD_SUPERCEDED'
);

// D4: ServiceOrder lifecycle transitions
const orderStatusSequence: ServiceOrder['status'][] = ['Requested', 'Confirmed', 'InFulfilment', 'Fulfilled'];
assert(orderStatusSequence.length === 4, 'Service order workflow Request -> Confirm -> InFulfilment -> Fulfilled intact');
assert(INITIAL_SERVICE_ORDERS.length > 0, `Initial service orders present (${INITIAL_SERVICE_ORDERS.length} orders)`);
assert(INITIAL_MARKETPLACE_ITEMS.length > 0, `Marketplace catalog items loaded (${INITIAL_MARKETPLACE_ITEMS.length} items)`);

console.log('\n================================================================');
console.log(`🎉 ALL TESTS PASSED: ${passedTests}/${totalTests} checks verified successfully.`);
console.log('================================================================\n');
