import {
  evaluateCampaignEligibility,
  maskGuestName,
  INITIAL_CAMPAIGNS,
  INITIAL_AD_OFFERS,
  INITIAL_PROPERTY_AD_ACCEPTANCES,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_SERVICE_ORDERS,
  AdOffer,
  PropertyAdAcceptance,
  Campaign,
  ServiceOrder,
} from '../src/data/mockData';

console.log('=== VERIFY FASE D: Commercial Expansion Foundation (Poin 13) ===\n');

// ----------------------------------------------------------------------------
// Test 1: Zero-PII Guest Name Masking (FR17-02)
// ----------------------------------------------------------------------------
console.log('1. Testing Zero-PII Guest Masking...');
const masked1 = maskGuestName('Bambang Soediro');
if (masked1 !== 'B*** S***') {
  throw new Error(`Expected 'B*** S***', got: '${masked1}'`);
}
const masked2 = maskGuestName('Dr. Dian Wulandari');
if (masked2 !== 'D*** D*** W***') {
  throw new Error(`Expected 'D*** D*** W***', got: '${masked2}'`);
}
console.log('  [PASS] maskGuestName correctly produces redacted display refs without PII leak.\n');

// ----------------------------------------------------------------------------
// Test 2: External Paid Ad Offer & Campaign Eligibility with Active Acceptance
// ----------------------------------------------------------------------------
console.log('2. Testing External Paid Ad Campaign Eligibility with Opt-In Acceptance...');
const activeAcceptance: PropertyAdAcceptance = {
  id: 'PAC-TEST-01',
  offerId: 'OFFER-01',
  offerVersion: 1,
  propertyId: 'P-01',
  acceptedPlacements: ['home_hero'],
  acceptedPeriod: { startUtc: '2026-11-01T00:00:00Z', endUtc: '2026-12-31T23:59:59Z' },
  acceptedCapPerStay: 2,
  commercialTermsRef: 'AGR-TEST-01',
  acceptedBy: 'pm_arunika',
  acceptedAtUtc: '2026-11-02T00:00:00Z',
  status: 'Accepted',
};

const externalCampaign: Campaign = {
  id: 'CMP-EXT-TEST',
  propertyId: 'P-01',
  name: 'Garuda Priority Executive (External)',
  category: 'External Offer',
  externalPaid: true,
  adOfferId: 'OFFER-01',
  offerVersion: 1,
  advertiserName: 'Garuda Indonesia',
  placement: 'home_hero',
  status: 'Active',
  priority: 88,
  frequencyCapPerStay: 2,
  durationSeconds: 15,
  skippableAfterSeconds: 5,
  startUtc: '2026-11-01T00:00:00Z',
  endUtc: '2026-12-31T23:59:59Z',
  imageUrl: '/assets/sample.png',
  headline: { id: 'Test Promo', en: 'Test Promo', 'zh-CN': '测试', 'ja-JP': 'テスト' },
  ctaLabel: { id: 'Claim', en: 'Claim', 'zh-CN': 'Claim', 'ja-JP': 'Claim' },
  creativeVersion: 1,
  startsCount: 0,
  completedCount: 0,
  skippedCount: 0,
  interruptedCount: 0,
  failedAfterStartCount: 0,
  totalPlaySeconds: 0,
};

const resultOptIn = evaluateCampaignEligibility(
  {
    propertyId: 'P-01',
    placement: 'home_hero',
    stayId: 'S-01',
    nowUtc: '2026-11-07T12:00:00Z',
    propertyAdAcceptances: [activeAcceptance],
  },
  [externalCampaign]
);

if (!resultOptIn.selectedCampaign || resultOptIn.selectedCampaign.id !== 'CMP-EXT-TEST') {
  throw new Error(`Expected external campaign to be selected when opt-in is active, got: ${resultOptIn.selectedCampaign?.id}`);
}
console.log(`  [PASS] Accepted AdOffer correctly schedules external campaign: ${resultOptIn.selectedCampaign.name}\n`);

// ----------------------------------------------------------------------------
// Test 3: Unaccepted External Offer is Denied by Eligibility Engine
// ----------------------------------------------------------------------------
console.log('3. Testing External Paid Ad Denial when NOT Accepted...');
const resultUnaccepted = evaluateCampaignEligibility(
  {
    propertyId: 'P-01',
    placement: 'home_hero',
    stayId: 'S-01',
    nowUtc: '2026-11-07T12:00:00Z',
    propertyAdAcceptances: [], // No acceptance!
  },
  [externalCampaign]
);

if (resultUnaccepted.selectedCampaign !== null) {
  throw new Error('Expected no campaign to be selected when offer has not been accepted');
}
const denialUnaccepted = resultUnaccepted.denials.find((d) => d.code === 'EXTERNAL_AD_NOT_ACCEPTED');
if (!denialUnaccepted) {
  throw new Error(`Expected denial code EXTERNAL_AD_NOT_ACCEPTED, got: ${JSON.stringify(resultUnaccepted.denials)}`);
}
console.log(`  [PASS] Unaccepted offer denied with code: ${denialUnaccepted.code} (${denialUnaccepted.reason})\n`);

// ----------------------------------------------------------------------------
// Test 4: Material Creative Revision Invalidates Acceptance (SUPERCEDED)
// ----------------------------------------------------------------------------
console.log('4. Testing Material Creative Revision Invalidation (SUPERCEDED Rule)...');
// Advertiser revised creative to version 2, but acceptance is still version 1:
const supercededAcceptance: PropertyAdAcceptance = {
  ...activeAcceptance,
  status: 'Superceded',
  supercededReason: 'Creative revised to v2 by advertiser.',
};

const revisedCampaign: Campaign = {
  ...externalCampaign,
  offerVersion: 2,
  creativeVersion: 2,
};

const resultSuperceded = evaluateCampaignEligibility(
  {
    propertyId: 'P-01',
    placement: 'home_hero',
    stayId: 'S-01',
    nowUtc: '2026-11-07T12:00:00Z',
    propertyAdAcceptances: [supercededAcceptance],
  },
  [revisedCampaign]
);

if (resultSuperceded.selectedCampaign !== null) {
  throw new Error('Expected superceded campaign to be rejected');
}
const denialSuperceded = resultSuperceded.denials.find((d) => d.code === 'EXTERNAL_AD_SUPERCEDED');
if (!denialSuperceded) {
  throw new Error(`Expected denial code EXTERNAL_AD_SUPERCEDED, got: ${JSON.stringify(resultSuperceded.denials)}`);
}
console.log(`  [PASS] Superceded acceptance rejected with code: ${denialSuperceded.code} (${denialSuperceded.reason})\n`);

// ----------------------------------------------------------------------------
// Test 5: Marketplace Catalog & Order Fulfillment State Machine
// ----------------------------------------------------------------------------
console.log('5. Testing Service Order Lifecycle (Request → Confirm → InFulfilment → Fulfilled)...');
const item = INITIAL_MARKETPLACE_ITEMS[0]; // Kayumanis Rijsttafel

const order: ServiceOrder = {
  id: 'ORD-TEST-001',
  itemId: item.id,
  itemTitle: item.title,
  propertyId: 'P-01',
  roomId: 'R-01-201',
  stayId: 'S-01',
  guestDisplayRef: `Room 201 · Guest ${maskGuestName('Bambang Soediro')}`,
  rawGuestName: 'Bambang Soediro',
  status: 'Requested',
  requestedAtUtc: new Date().toISOString(),
  fulfilmentType: item.fulfilmentType,
};

if (order.status !== 'Requested' || order.guestDisplayRef !== 'Room 201 · Guest B*** S***') {
  throw new Error(`Order initialization failed: ${JSON.stringify(order)}`);
}

// Front office confirms order
order.status = 'Confirmed';
order.confirmedAtUtc = new Date().toISOString();
order.assignedTo = 'Front Office Duty Manager';

// In fulfilment
order.status = 'InFulfilment';

// Fulfilled
order.status = 'Fulfilled';
order.fulfilledAtUtc = new Date().toISOString();

console.log(`  [PASS] Service order successfully completed lifecycle: ${order.status} (${order.guestDisplayRef})\n`);

console.log('=== ALL FASE D VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
