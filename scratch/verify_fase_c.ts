import {
  resolveBranding,
  calculateContrastRatio,
  evaluateCampaignEligibility,
  INITIAL_PROPERTIES,
  INITIAL_PROFILE_OVERRIDES,
  INITIAL_CORPORATE_GROUPS,
  INITIAL_STAYS,
  INITIAL_CAMPAIGNS,
  INITIAL_PLAYBACK_FACTS,
} from '../src/data/mockData';

console.log('=== VERIFYING FASE C: EXPERIENCE DEEPENING ===\n');

// 1. WCAG Contrast Calculation Verification
console.log('--- 1. WCAG 2.1 Contrast Testing ---');
const darkBg = '#1E3A2F';
const defaultAccent = '#DCC6A1';
const suiteGold = '#E5C185';
const lowContrast = '#2A3030';

const r1 = calculateContrastRatio(darkBg, defaultAccent);
console.log(`Contrast [${darkBg}] vs [${defaultAccent}]: ${r1.toFixed(2)} : 1 (Passes AA >= 4.5: ${r1 >= 4.5})`);
if (r1 < 4.5) throw new Error('Default contrast should pass AA');

const r2 = calculateContrastRatio(darkBg, suiteGold);
console.log(`Contrast [${darkBg}] vs [${suiteGold}]: ${r2.toFixed(2)} : 1 (Passes AA >= 4.5: ${r2 >= 4.5})`);
if (r2 < 4.5) throw new Error('Suite gold contrast should pass AA');

const r3 = calculateContrastRatio(darkBg, lowContrast);
console.log(`Contrast [${darkBg}] vs [${lowContrast}]: ${r3.toFixed(2)} : 1 (Fails AA < 4.5: ${r3 < 4.5})`);
if (r3 >= 4.5) throw new Error('Low contrast test should fail AA');

// 2. Multi-Layer Branding Inheritance & Resolution Verification (Poin 6)
console.log('\n--- 2. Multi-Layer Branding Resolution & Provenance ---');
const prop = INITIAL_PROPERTIES[0];

// 2.1 Property Level Resolution
const propBranding = resolveBranding(prop, INITIAL_PROFILE_OVERRIDES, { propertyId: prop.id }, INITIAL_CORPORATE_GROUPS, INITIAL_STAYS);
console.log(`Property Default Accent: ${propBranding.values.accentColor} (Provenance: ${propBranding.provenance.accentColor.layer}, Status: ${propBranding.provenance.accentColor.status})`);
if (propBranding.values.accentColor !== '#DCC6A1') throw new Error('Expected property default accent');

// 2.2 Room Class Suite Override Resolution
const suiteBranding = resolveBranding(prop, INITIAL_PROFILE_OVERRIDES, { propertyId: prop.id, roomClass: 'Suite' }, INITIAL_CORPORATE_GROUPS, INITIAL_STAYS);
console.log(`Suite Tier Accent: ${suiteBranding.values.accentColor} (Provenance: ${suiteBranding.provenance.accentColor.layer}, Status: ${suiteBranding.provenance.accentColor.status})`);
console.log(`Suite Welcome Headline: "${suiteBranding.values.welcomeHeadline}" (Provenance: ${suiteBranding.provenance.welcomeHeadline.layer})`);
if (suiteBranding.values.accentColor !== '#E5C185') throw new Error('Expected Suite gold override #E5C185');
if (suiteBranding.provenance.accentColor.status !== 'Overridden') throw new Error('Expected Suite accent to be Overridden');

// 2.3 Explicit Coexistence Conflict Resolution (Corporate Group Stay)
const groupBranding = resolveBranding(
  prop,
  INITIAL_PROFILE_OVERRIDES,
  { propertyId: prop.id, roomClass: 'Suite', groupId: 'G-CORP', stayId: 'S-01' },
  INITIAL_CORPORATE_GROUPS,
  INITIAL_STAYS
);
console.log(`Group Stay Welcome Headline: "${groupBranding.values.welcomeHeadline}"`);
console.log(`Group Stay Welcome Subline: "${groupBranding.values.welcomeSubline}"`);
console.log(`Conflicts Detected & Resolved: ${groupBranding.conflicts.length}`);
groupBranding.conflicts.forEach((c) => {
  console.log(`  -> Field [${c.field}]: Policy "${c.resolutionPolicy}" (Winning Layer: ${c.winningLayer})`);
});
if (groupBranding.conflicts.length === 0) throw new Error('Expected coexistence conflict resolution between personal stay and corporate group');

// 3. Campaign Placement Eligibility & Deterministic 10-Step Pipeline (Poin 7)
console.log('\n--- 3. Campaign Eligibility & Denial Diagnostics (10-Step Pipeline) ---');

// 3.1 Pre-live TV interstitial in Suite (Should Match CMP-05)
const suitePreTvResult = evaluateCampaignEligibility(
  {
    propertyId: prop.id,
    placement: 'pre_live_tv',
    roomClass: 'Suite',
    stayId: 'S-01',
    currentPlayCountThisStay: 0,
  },
  INITIAL_CAMPAIGNS
);
console.log(`Pre-Live TV in Suite: Winner = [${suitePreTvResult.selectedCampaign?.id}] ${suitePreTvResult.selectedCampaign?.name} (Priority ${suitePreTvResult.selectedCampaign?.priority})`);
if (suitePreTvResult.selectedCampaign?.id !== 'CMP-05') {
  throw new Error(`Expected CMP-05 for pre_live_tv in Suite, got: ${suitePreTvResult.selectedCampaign?.id}`);
}

// 3.2 Pre-live TV interstitial in Standard room (CMP-05 is Suite/Deluxe only -> should be denied)
const standardPreTvResult = evaluateCampaignEligibility(
  {
    propertyId: prop.id,
    placement: 'pre_live_tv',
    roomClass: 'Standard',
    stayId: 'S-01',
    currentPlayCountThisStay: 0,
  },
  INITIAL_CAMPAIGNS
);
console.log(`Pre-Live TV in Standard Room: Winner = ${standardPreTvResult.selectedCampaign ? standardPreTvResult.selectedCampaign.id : 'None (Fallback)'}`);
console.log(`  Denial for CMP-05: ${standardPreTvResult.denials.find((d) => d.campaignId === 'CMP-05')?.reason}`);
if (standardPreTvResult.selectedCampaign?.id === 'CMP-05') {
  throw new Error('Standard room should NOT be eligible for CMP-05 (Suite/Deluxe only)');
}

// 3.3 Frequency Capping Test (CMP-05 frequency cap = 2 per stay)
const cappedResult = evaluateCampaignEligibility(
  {
    propertyId: prop.id,
    placement: 'pre_live_tv',
    roomClass: 'Suite',
    stayId: 'S-01',
    currentPlayCountThisStay: 2, // Cap hit
  },
  INITIAL_CAMPAIGNS
);
console.log(`Pre-Live TV with Frequency Cap Hit (1 play): Winner = ${cappedResult.selectedCampaign ? cappedResult.selectedCampaign.id : 'None (Capped)'}`);
console.log(`  Denial Code: ${cappedResult.denials.find((d) => d.campaignId === 'CMP-05')?.code} - ${cappedResult.denials.find((d) => d.campaignId === 'CMP-05')?.reason}`);
if (cappedResult.selectedCampaign?.id === 'CMP-05') {
  throw new Error('Campaign should be disqualified when frequency cap is reached');
}

// 3.4 Public Area Signage Privacy Constraint
const publicSignageResult = evaluateCampaignEligibility(
  {
    propertyId: prop.id,
    placement: 'shared_signage',
    isPublicArea: true,
  },
  INITIAL_CAMPAIGNS
);
console.log(`Public Signage Placement: Winner = [${publicSignageResult.selectedCampaign?.id}] ${publicSignageResult.selectedCampaign?.name}`);
if (!publicSignageResult.selectedCampaign) {
  throw new Error('Expected shared_signage campaign for public area');
}

// 4. Playback Fact Telemetry Taxonomy (BR19)
console.log('\n--- 4. BR19 Telemetry Taxonomy & Playback Facts ---');
console.log(`Seeded Facts: ${INITIAL_PLAYBACK_FACTS.length}`);
INITIAL_PLAYBACK_FACTS.forEach((f) => {
  console.log(`  Fact ${f.id}: [${f.eventType}] on ${f.endpointId} (${f.playSeconds}s) outcome=${f.outcome}`);
});

console.log('\n>>> ALL FASE C VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
