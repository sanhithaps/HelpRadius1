/**
 * Calculate Haversine distance between two coordinates in kilometers.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100; // Round to 2 decimal places
}

/**
 * Estimate travel time in minutes based on distance and average urban speed (25 km/h).
 * @param {number} distanceKm 
 * @returns {number} minutes (minimum 1 minute)
 */
function estimateETA(distanceKm) {
  const averageUrbanSpeedKmH = 25;
  const hours = distanceKm / averageUrbanSpeedKmH;
  const minutes = Math.round(hours * 60);
  return Math.max(1, minutes);
}

module.exports = {
  calculateHaversineDistance,
  estimateETA
};
