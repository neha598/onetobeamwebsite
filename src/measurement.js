/**
 * Turf.js Measurement & Unit Conversions
 * Section 12: measurement.js
 */
window.Measurement = (function () {
  /**
   * Format number with standard commas and decimals
   */
  function format(num, decimals = 2) {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    return Number(num).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Compute full measurement metrics from a GeoJSON Polygon
   * @param {Object} geojson - Valid GeoJSON Polygon Feature
   * @returns {Object|null} Metric values in all units
   */
  function compute(geojson) {
    if (!geojson || !geojson.geometry || !geojson.geometry.coordinates || typeof turf === "undefined") {
      return null;
    }

    try {
      // 1. Geodesic area in square metres via Turf.js
      const areaSqM = turf.area(geojson);
      if (areaSqM <= 0) return null;

      const conf = window.AppConfig.conversions;

      // 2. Unit conversions (Section 6)
      const areaSqFt = areaSqM * conf.SQ_METERS_TO_SQ_FEET;
      const areaHectares = areaSqM / conf.SQ_METERS_TO_HECTARES;
      const areaAcres = areaSqM / conf.SQ_METERS_TO_ACRES;
      const areaGuntha = areaSqM / conf.SQ_METERS_TO_GUNTHA;

      // 3. Perimeter in metres and feet via Turf.js
      let perimeterMeters = 0;
      try {
        const line = turf.polygonToLine(geojson);
        perimeterMeters = turf.length(line, { units: "kilometers" }) * 1000;
      } catch (e) {
        perimeterMeters = 0;
      }
      const perimeterFeet = perimeterMeters * conf.METERS_TO_FEET;

      return {
        sqM: areaSqM,
        sqFt: areaSqFt,
        hectares: areaHectares,
        acres: areaAcres,
        guntha: areaGuntha,
        perimeterM: perimeterMeters,
        perimeterFt: perimeterFeet
      };
    } catch (err) {
      console.error("Measurement error:", err);
      return null;
    }
  }

  return {
    compute: compute,
    format: format
  };
})();
