/**
 * Configuration & Constants for Area Measurement Tool
 * Section 12 & 15: config.js & Reference Notes
 * 
 * References:
 * - Esri Basemap Tiles: https://developers.arcgis.com/rest/static-basemap-tiles/
 * - Esri Leaflet Sample: https://developers.arcgis.com/esri-leaflet/samples/basemap-with-labels/
 * - Leaflet Project: https://github.com/Leaflet/Leaflet (BSD-2-Clause)
 * - Leaflet-Geoman: https://geoman.io/docs/leaflet (MIT)
 * - Turf.js Area API: https://turfjs.org/docs/7.0.0/api/area (MIT)
 */
window.AppConfig = {
  // Esri Credentials & Tile Endpoints
  esri: {
    apiKey: "", // Optional ArcGIS Location Platform API key
    imageryUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics'
  },

  // Map Default View (Center on India PropTech Hub / Bangalore)
  map: {
    initialCenter: [12.9716, 77.5946],
    initialZoom: 16,
    maxZoom: 19
  },

  // Polygon Styling for Leaflet-Geoman
  drawing: {
    color: "#c6a55c",
    fillColor: "#c6a55c",
    fillOpacity: 0.32,
    weight: 2.5,
    snapDistance: 20
  },

  // Conversion Multipliers as per Section 6 (Measurement Logic)
  conversions: {
    SQ_METERS_TO_SQ_FEET: 10.7639104167,
    SQ_METERS_TO_HECTARES: 10000,
    SQ_METERS_TO_ACRES: 4046.8564224,
    SQ_METERS_TO_GUNTHA: 101.17141,
    METERS_TO_FEET: 3.280839895
  }
};
