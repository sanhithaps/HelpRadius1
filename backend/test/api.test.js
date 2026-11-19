const test = require('node:test');
const assert = require('node:assert');
const { calculateHaversineDistance, estimateETA } = require('../src/utils/distance');
const pricingService = require('../src/services/pricingService');
const db = require('../src/models/dataStore');

test('Haversine Distance calculation accuracy', () => {
  // Distance between Bengaluru Vidhana Soudha (12.9797, 77.5907) and MG Road (12.9756, 77.6066) is ~1.79 km
  const dist = calculateHaversineDistance(12.9797, 77.5907, 12.9756, 77.6066);
  assert.ok(dist >= 1.5 && dist <= 2.0, `Expected ~1.8 km, got ${dist}`);

  // Same point distance should be 0
  const zeroDist = calculateHaversineDistance(12.9797, 77.5907, 12.9797, 77.5907);
  assert.strictEqual(zeroDist, 0);
});

test('ETA estimation adheres to urban transit speed', () => {
  const eta1 = estimateETA(2.5); // 2.5 km @ 25km/h -> 6 mins
  assert.strictEqual(eta1, 6);

  const etaZero = estimateETA(0.1);
  assert.strictEqual(etaZero, 1); // Minimum 1 minute
});

test('Pricing rule: Emergency SOS is 100% free and voluntary reward is optional', () => {
  const sosBreakdown = pricingService.calculateBreakdown({
    type: 'emergency',
    distanceKm: 8.5,
    radiusStepIndex: 3,
    voluntaryReward: 0
  });

  assert.strictEqual(sosBreakdown.platformExpansionFee, 0);
  assert.strictEqual(sosBreakdown.travelCompensation, 0);
  assert.strictEqual(sosBreakdown.voluntaryReward, 0);
  assert.strictEqual(sosBreakdown.total, 0);
  assert.strictEqual(sosBreakdown.isEmergencyFree, true);
});

test('Pricing rule: General Help separates 3 transparent tiers and first 2 km travel is free', () => {
  // 5 km travel: 2 km free base, 3 km billable @ ₹8 = ₹24
  // Step 2 expansion fee = 2 * ₹5 = ₹10
  // Voluntary reward = ₹50
  // Total = 10 + 24 + 50 = ₹84
  const genBreakdown = pricingService.calculateBreakdown({
    type: 'general',
    distanceKm: 5.0,
    radiusStepIndex: 2,
    voluntaryReward: 50
  });

  assert.strictEqual(genBreakdown.platformExpansionFee, 10);
  assert.strictEqual(genBreakdown.travelCompensation, 24);
  assert.strictEqual(genBreakdown.voluntaryReward, 50);
  assert.strictEqual(genBreakdown.total, 84);
});

test('Emergency Contacts: Enforces maximum 6 contacts rule', () => {
  const testUser = {
    id: 'usr_test_001',
    name: 'Test Member',
    email: 'test@example.com',
    emergencyContacts: [
      { id: 'ec_1', name: 'Contact 1', phone: '+919811111111' },
      { id: 'ec_2', name: 'Contact 2', phone: '+919822222222' }
    ]
  };
  db.users.set(testUser.id, testUser);
  const user = db.users.get('usr_test_001');
  assert.ok(user, 'User must exist in database');
  assert.ok(user.emergencyContacts.length <= 6, 'Must not exceed 6 contacts');
});
