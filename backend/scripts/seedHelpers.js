/**
 * Helper Seeding Utility
 * Can be run manually with: node scripts/seedHelpers.js [lat] [lng]
 */
const db = require('../src/models/dataStore');

const lat = parseFloat(process.argv[2] || '12.9716');
const lng = parseFloat(process.argv[3] || '77.5946');

console.log(`Seeding and relocating helpers around coordinates: [${lat}, ${lng}]...`);
db.relocateSeedHelpersAround(lat, lng);

console.log(`Success! Current active helpers:`);
for (const h of db.helpers.values()) {
  console.log(`- ${h.name} (${h.status}, Safety: ${h.safetyEligible ? 'VERIFIED' : 'GENERAL'}) @ [${h.location.lat.toFixed(4)}, ${h.location.lng.toFixed(4)}]`);
}
process.exit(0);
