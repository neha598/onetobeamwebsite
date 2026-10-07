/**
 * Leaflet-Geoman Polygon Drawing & Editing Controller
 * Section 12: drawing.js
 */
window.Drawing = (function () {
  let activePolygon = null;
  let isEditing = false;
  let onMeasurementChangeCallback = null;

  function init(map, onChange) {
    onMeasurementChangeCallback = onChange;
    const config = (window.AppConfig && window.AppConfig.drawing) || {
      color: "#c6a55c",
      fillColor: "#c6a55c",
      fillOpacity: 0.32,
      weight: 2.5,
      snapDistance: 20
    };

    if (!map) return;

    // Check if Leaflet-Geoman is available
    if (!map.pm) {
      console.warn("Leaflet-Geoman library not detected on map instance.");
      return;
    }

    // Set Global Geoman Options
    try {
      map.pm.setGlobalOptions({
        snappable: true,
        snapDistance: config.snapDistance,
        allowSelfIntersection: false,
        templineStyle: {
          color: config.color,
          weight: 2.5,
          dashArray: "6, 6"
        },
        hintlineStyle: {
          color: "#e5cb87",
          dashArray: "4, 6"
        },
        pathOptions: {
          color: config.color,
          fillColor: config.fillColor,
          fillOpacity: config.fillOpacity,
          weight: config.weight
        }
      });
    } catch (err) {
      console.error("Geoman options error:", err);
    }

    // Listen to Geoman create event
    map.on("pm:create", (e) => {
      // Remove any previously drawn polygon (Single active polygon MVP scope)
      if (activePolygon && activePolygon !== e.layer) {
        map.removeLayer(activePolygon);
      }

      activePolygon = e.layer;

      // Apply primary golden styling
      activePolygon.setStyle({
        color: config.color,
        fillColor: config.fillColor,
        fillOpacity: config.fillOpacity,
        weight: config.weight
      });

      // Bind vertex modification events
      ["pm:edit", "pm:dragend", "pm:vertexadded", "pm:vertexremoved", "pm:markerdragend"].forEach((ev) => {
        activePolygon.on(ev, triggerUpdate);
      });

      // Fit map to completed polygon
      map.fitBounds(activePolygon.getBounds(), {
        padding: [40, 40],
        maxZoom: 18
      });

      triggerUpdate();
    });
  }

  function triggerUpdate() {
    if (!activePolygon) {
      if (onMeasurementChangeCallback) onMeasurementChangeCallback(null);
      return;
    }

    try {
      const geojson = activePolygon.toGeoJSON();
      const metrics = window.Measurement ? window.Measurement.compute(geojson) : null;
      if (onMeasurementChangeCallback) onMeasurementChangeCallback(metrics, geojson);
    } catch (e) {
      console.error("Trigger update failed:", e);
    }
  }

  function startDrawing(map) {
    if (!map || !map.pm) {
      console.error("Geoman is not available on map.");
      return;
    }

    if (isEditing) {
      toggleEdit(map);
    }

    // If a polygon already exists, clear it for redraw
    if (activePolygon) {
      clear(map);
    }

    map.pm.enableDraw("Polygon", {
      snappable: true,
      snapDistance: 20
    });
  }

  function stopDrawing(map) {
    if (map && map.pm && map.pm.globalDrawModeEnabled()) {
      map.pm.disableDraw();
    }
  }

  function toggleEdit(map) {
    if (!activePolygon || !map || !map.pm) return false;

    if (isEditing) {
      map.pm.disableGlobalEditMode();
      isEditing = false;
    } else {
      map.pm.enableGlobalEditMode({
        allowSelfIntersection: false
      });
      isEditing = true;
    }
    return isEditing;
  }

  function clear(map) {
    if (activePolygon && map) {
      map.removeLayer(activePolygon);
      activePolygon = null;
    }
    if (map && map.pm && map.pm.globalDrawModeEnabled()) {
      map.pm.disableDraw();
    }
    if (map && map.pm && isEditing) {
      map.pm.disableGlobalEditMode();
      isEditing = false;
    }
    triggerUpdate();
  }

  function getActiveGeoJSON() {
    if (!activePolygon) return null;
    return activePolygon.toGeoJSON();
  }

  function hasPolygon() {
    return activePolygon !== null;
  }

  return {
    init: init,
    startDrawing: startDrawing,
    stopDrawing: stopDrawing,
    toggleEdit: toggleEdit,
    clear: clear,
    getActiveGeoJSON: getActiveGeoJSON,
    hasPolygon: hasPolygon
  };
})();
