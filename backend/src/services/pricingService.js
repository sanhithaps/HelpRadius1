const config = require('../config');

class PricingService {
  /**
   * Calculate transparent 3-component pricing breakdown.
   * @param {Object} params
   * @param {string} params.type 'emergency' | 'general' | 'scheduled'
   * @param {number} params.distanceKm Distance between requester and helper
   * @param {number} params.radiusStepIndex Expansion step index (0, 1, 2...)
   * @param {number} [params.voluntaryReward] Optional tip/reward from requester
   * @param {number} [params.durationMinutes] For scheduled requests
   * @param {string} [params.category]
   * @returns {Object} itemized breakdown
   */
  calculateBreakdown({
    type = 'general',
    distanceKm = 1.0,
    radiusStepIndex = 0,
    voluntaryReward = 0,
    durationMinutes = 30,
    category = 'other'
  }) {
    const cleanDistance = Math.max(0, Number(distanceKm) || 0);
    const cleanReward = Math.max(0, Number(voluntaryReward) || 0);

    // 1. EMERGENCY
    if (type === 'emergency') {
      return {
        type: 'emergency',
        platformExpansionFee: 0,
        travelCompensation: 0,
        voluntaryReward: cleanReward,
        total: cleanReward,
        isEmergencyFree: true,
        disclaimer: 'Supported by Help Radius. Emergency rescue is 100% free; voluntary rewards are optional and never block assistance.',
        currency: 'INR',
        symbol: '₹'
      };
    }

    // 2. GENERAL IMMEDIATE HELP
    if (type === 'general') {
      const generalRules = config.pricingConfig.general;
      const expansionFee = radiusStepIndex * generalRules.expansionFeePerStep;
      
      const billableKm = Math.max(0, cleanDistance - generalRules.baseTravelKmFree);
      let travelComp = Math.round(billableKm * generalRules.travelRatePerKm);
      if (travelComp > generalRules.maxTravelComp) {
        travelComp = generalRules.maxTravelComp;
      }

      return {
        type: 'general',
        distanceKm: cleanDistance,
        freeBaseKm: generalRules.baseTravelKmFree,
        platformExpansionFee: expansionFee,
        travelCompensation: travelComp,
        voluntaryReward: cleanReward,
        total: expansionFee + travelComp + cleanReward,
        disclaimer: 'Estimate only. Travel compensation is paid directly to the helper. Base 2 km travel is free.',
        currency: 'INR',
        symbol: '₹'
      };
    }

    // 3. SCHEDULED HELP
    const schedRules = config.pricingConfig.scheduled;
    const hours = Math.max(0.5, (durationMinutes || 60) / 60);
    const multiplier = schedRules.categoryMultipliers[category] || 1.0;
    
    const suggestedReward = Math.round(hours * schedRules.ratePerHourSuggested * multiplier);
    const travelComp = Math.round(cleanDistance * schedRules.travelRatePerKm);
    const finalReward = cleanReward > 0 ? cleanReward : suggestedReward;

    return {
      type: 'scheduled',
      distanceKm: cleanDistance,
      durationHours: hours,
      categoryMultiplier: multiplier,
      platformExpansionFee: 10,
      travelCompensation: travelComp,
      voluntaryReward: finalReward,
      total: 10 + travelComp + finalReward,
      disclaimer: 'Estimate only. Scheduled compensation covers time and travel costs. No real charges in prototype.',
      currency: 'INR',
      symbol: '₹'
    };
  }
}

module.exports = new PricingService();
