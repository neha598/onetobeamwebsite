/**
 * Leaflet Map & Esri Imagery Layer Initializer
 * Section 12: map.js
 */
window.MapModule = (function () {
  let mapInstance = null;
  let esriImageryLayer = null;
  let esriLabelsLayer = null;
  let labelsVisible = true;
  let searchMarker = null;

  function init() {
    const config = window.AppConfig;

    // Initialize Leaflet Map
    mapInstance = L.map("map", {
      center: config.map.initialCenter,
      zoom: config.map.initialZoom,
      zoomControl: false,
      maxZoom: config.map.maxZoom
    });

    // Top-left Zoom Controls
    L.control.zoom({ position: "topleft" }).addTo(mapInstance);

    // Esri World Imagery Base Layer
    let imageryUrl = config.esri.imageryUrl;
    if (config.esri.apiKey) {
      imageryUrl += `?token=${encodeURIComponent(config.esri.apiKey)}`;
    }

    esriImageryLayer = L.tileLayer(imageryUrl, {
      maxZoom: config.esri.maxZoom,
      attribution: config.esri.attribution
    }).addTo(mapInstance);

    // Esri Reference Labels Layer (Boundaries & Places)
    esriLabelsLayer = L.tileLayer(config.esri.labelsUrl, {
      maxZoom: config.esri.maxZoom,
      attribution: ""
    }).addTo(mapInstance);

    return mapInstance;
  }

  function toggleLabels() {
    if (!mapInstance || !esriLabelsLayer) return false;
    labelsVisible = !labelsVisible;

    if (labelsVisible) {
      mapInstance.addLayer(esriLabelsLayer);
    } else {
      mapInstance.removeLayer(esriLabelsLayer);
    }
    return labelsVisible;
  }

  function locateUser(onSuccess, onError) {
    if (!navigator.geolocation) {
      if (onError) onError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstance) {
          mapInstance.flyTo([latitude, longitude], 17, { duration: 1.5 });
          placeSearchPin(latitude, longitude, "Your Current Location");
        }
        if (onSuccess) onSuccess(pos.coords);
      },
      (err) => {
        if (onError) onError("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function parseCoordinates(input) {
    if (!input || typeof input !== "string") return null;
    const trimmed = input.trim();
    // Matches "12.345, 77.890" or "-12.345, -77.890"
    const commaMatch = trimmed.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
    if (commaMatch) {
      const lat = parseFloat(commaMatch[1]);
      const lng = parseFloat(commaMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    // Matches "12.345 77.890"
    const spaceMatch = trimmed.match(/^([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)$/);
    if (spaceMatch) {
      const lat = parseFloat(spaceMatch[1]);
      const lng = parseFloat(spaceMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  }

  async function searchLocation(query, onSuccess, onError) {
    if (!mapInstance || !query || !query.trim()) {
      if (onError) onError("Please enter a valid address or coordinates.");
      return;
    }

    const trimmed = query.trim();

    // 1. Check if user typed coordinates (e.g. 12.9716, 77.5946)
    const coords = parseCoordinates(trimmed);
    if (coords) {
      placeSearchPin(coords.lat, coords.lng, `Coordinates: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
      mapInstance.flyTo([coords.lat, coords.lng], 17, { duration: 1.5 });
      if (onSuccess) onSuccess(`Coordinates: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
      return;
    }

    // 2. Geocode address via Esri World Geocoding Service
    try {
      const esriUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(trimmed)}&maxLocations=1`;
      const res = await fetch(esriUrl);
      const data = await res.json();

      if (data && data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        const lat = candidate.location.y;
        const lng = candidate.location.x;
        const label = candidate.address || trimmed;

        placeSearchPin(lat, lng, label);
        mapInstance.flyTo([lat, lng], 17, { duration: 1.5 });
        if (onSuccess) onSuccess(label);
        return;
      }
    } catch (err) {
      console.warn("Esri geocode error, trying fallback:", err);
    }

    // 3. Fallback: OpenStreetMap Nominatim
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`;
      const res = await fetch(osmUrl, {
        headers: { "Accept-Language": "en" }
      });
      const data = await res.json();

      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const label = item.display_name || trimmed;

        placeSearchPin(lat, lng, label);
        mapInstance.flyTo([lat, lng], 17, { duration: 1.5 });
        if (onSuccess) onSuccess(label);
        return;
      }
    } catch (err) {
      console.warn("OSM geocode error:", err);
    }

    if (onError) onError("Location not found. Please try a different query.");
  }

  function placeSearchPin(lat, lng, label) {
    if (!mapInstance) return;
    if (searchMarker) {
      mapInstance.removeLayer(searchMarker);
    }

    // Custom golden pulse pin marker
    const pinIcon = L.divIcon({
      className: "search-pin-container",
      html: `<div class="search-pin-pulse"></div><div class="search-pin-dot"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    searchMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(mapInstance);
    if (label) {
      searchMarker.bindPopup(`<strong style="color:#c6a55c">Location</strong><br>${label}`).openPopup();
    }
  }

  function getMap() {
    return mapInstance;
  }

  return {
    init: init,
    toggleLabels: toggleLabels,
    locateUser: locateUser,
    searchLocation: searchLocation,
    getMap: getMap
  };
})();
