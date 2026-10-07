/**
 * Area Measurement Tool - App Startup & Orchestration
 * Section 12: main.js
 */
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Nav Toggle
  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");
  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 1. Initialize UI Elements
  if (window.UI) {
    window.UI.init();
  }

  // 2. Initialize Leaflet Map
  let map = null;
  try {
    map = window.MapModule.init();
  } catch (err) {
    console.error("Map initialization failed:", err);
  }

  // 3. Initialize Drawing Module with Change Callback
  if (map && window.Drawing) {
    try {
      window.Drawing.init(map, (metrics, geojson) => {
        if (metrics) {
          window.UI.updateMetrics(metrics);
        } else {
          window.UI.resetMetrics();
        }
      });
    } catch (err) {
      console.error("Drawing init error:", err);
    }
  }

  // 4. Bind Toolbar Buttons
  const btnDraw = document.getElementById("btnDraw");
  const btnDrawText = document.getElementById("btnDrawText");
  const btnEdit = document.getElementById("btnEdit");
  const btnClear = document.getElementById("btnClear");
  const btnLabels = document.getElementById("btnLabels");
  const labelsBtnText = document.getElementById("labelsBtnText");
  const btnLocate = document.getElementById("btnLocate");
  const btnCopyGeoJSON = document.getElementById("btnCopyGeoJSON");
  const btnDownloadGeoJSON = document.getElementById("btnDownloadGeoJSON");

  // Map drawing state events
  if (map) {
    map.on("pm:drawstart", ({ shape }) => {
      if (shape === "Polygon") {
        if (btnDraw) btnDraw.classList.add("active");
        if (btnDrawText) btnDrawText.textContent = "Finish / Cancel";
        if (window.UI) window.UI.setStatus("Click on the map to add boundary corners. Click first point to finish.");
      }
    });

    map.on("pm:drawend", () => {
      if (btnDraw) btnDraw.classList.remove("active");
      if (btnDrawText) btnDrawText.textContent = "Draw Area";
      if (window.Drawing && !window.Drawing.hasPolygon() && window.UI) {
        window.UI.setStatus('Ready — Select "Draw Area" to begin');
      }
    });
  }

  // Draw Button
  if (btnDraw && map) {
    btnDraw.addEventListener("click", (e) => {
      e.preventDefault();
      if (map.pm && map.pm.globalDrawModeEnabled()) {
        window.Drawing.stopDrawing(map);
        btnDraw.classList.remove("active");
        if (btnDrawText) btnDrawText.textContent = "Draw Area";
      } else {
        window.Drawing.startDrawing(map);
        btnDraw.classList.add("active");
        if (btnDrawText) btnDrawText.textContent = "Finish / Cancel";
        if (window.UI) window.UI.setStatus("Click on the map to add boundary corners. Click first point to finish.");
      }
    });
  }

  // Edit Button
  if (btnEdit && map) {
    btnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      const isNowEditing = window.Drawing.toggleEdit(map);
      if (window.UI) window.UI.setEditMode(isNowEditing);
    });
  }

  // Clear Button
  if (btnClear && map) {
    btnClear.addEventListener("click", (e) => {
      e.preventDefault();
      window.Drawing.clear(map);
      if (window.UI) {
        window.UI.resetMetrics();
        window.UI.showToast("Boundary removed.");
      }
      if (btnDraw) btnDraw.classList.remove("active");
      if (btnDrawText) btnDrawText.textContent = "Draw Area";
    });
  }

  // Toggle Labels
  if (btnLabels) {
    btnLabels.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = window.MapModule.toggleLabels();
      if (labelsBtnText) labelsBtnText.textContent = isVisible ? "Labels: On" : "Labels: Off";
      btnLabels.classList.toggle("active", !isVisible);
    });
  }

  // Locate Me
  if (btnLocate) {
    btnLocate.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.UI) window.UI.setStatus("Locating your position...");
      window.MapModule.locateUser(
        () => {
          if (window.UI) {
            window.UI.setStatus("Located. Trace the boundaries around your site.");
            window.UI.showToast("Location found!");
          }
        },
        (errMsg) => {
          if (window.UI) {
            window.UI.setStatus("Location access unavailable.");
            window.UI.showToast(errMsg);
          }
        }
      );
    });
  }

  // Address & Coordinates Search
  const inputSearch = document.getElementById("inputSearch");
  const btnSearch = document.getElementById("btnSearch");

  function triggerSearch() {
    if (!inputSearch) return;
    const query = inputSearch.value.trim();
    if (!query) {
      if (window.UI) window.UI.showToast("Please enter an address or coordinates.");
      inputSearch.focus();
      return;
    }

    if (window.UI) window.UI.setStatus(`Searching for "${query}"...`);
    if (btnSearch) btnSearch.disabled = true;

    window.MapModule.searchLocation(
      query,
      (label) => {
        if (btnSearch) btnSearch.disabled = false;
        if (window.UI) {
          window.UI.setStatus(`Found: ${label}. Trace your boundaries.`);
          window.UI.showToast(`Found: ${label}`);
        }
      },
      (errMsg) => {
        if (btnSearch) btnSearch.disabled = false;
        if (window.UI) {
          window.UI.setStatus(errMsg);
          window.UI.showToast(errMsg);
        }
      }
    );
  }

  if (btnSearch) {
    btnSearch.addEventListener("click", (e) => {
      e.preventDefault();
      triggerSearch();
    });
  }

  if (inputSearch) {
    inputSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerSearch();
      }
    });
  }

  // Copy GeoJSON
  if (btnCopyGeoJSON) {
    btnCopyGeoJSON.addEventListener("click", (e) => {
      e.preventDefault();
      const geojson = window.Drawing.getActiveGeoJSON();
      if (!geojson) return;

      navigator.clipboard
        .writeText(JSON.stringify(geojson, null, 2))
        .then(() => {
          if (window.UI) window.UI.showToast("GeoJSON copied to clipboard!");
        })
        .catch(() => {
          alert("Unable to copy to clipboard.");
        });
    });
  }

  // Download GeoJSON
  if (btnDownloadGeoJSON) {
    btnDownloadGeoJSON.addEventListener("click", (e) => {
      e.preventDefault();
      const geojson = window.Drawing.getActiveGeoJSON();
      if (!geojson) return;

      const jsonString = JSON.stringify(geojson, null, 2);
      const blob = new Blob([jsonString], { type: "application/geo+json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `area-measurement-${Date.now()}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.UI) window.UI.showToast("GeoJSON downloaded!");
    });
  }
});
