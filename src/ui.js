/**
 * UI State & Results Display Controller
 * Section 12: ui.js
 */
window.UI = (function () {
  const elements = {};

  function init() {
    elements.valSqM = document.getElementById("valSqM");
    elements.valSqFt = document.getElementById("valSqFt");
    elements.valAcres = document.getElementById("valAcres");
    elements.valHectares = document.getElementById("valHectares");
    elements.valPerimeterM = document.getElementById("valPerimeterM");
    elements.valPerimeterFt = document.getElementById("valPerimeterFt");
    elements.valGuntha = document.getElementById("valGuntha");

    elements.statusText = document.getElementById("statusText");
    elements.statusDot = document.getElementById("statusDot");

    elements.btnEdit = document.getElementById("btnEdit");
    elements.btnEditText = document.getElementById("btnEditText");
    elements.btnClear = document.getElementById("btnClear");
    elements.btnCopyGeoJSON = document.getElementById("btnCopyGeoJSON");
    elements.btnDownloadGeoJSON = document.getElementById("btnDownloadGeoJSON");
    elements.toastMsg = document.getElementById("toastMsg");
    elements.toastText = document.getElementById("toastText");
  }

  function showToast(message) {
    if (!elements.toastMsg) return;
    elements.toastText.textContent = message;
    elements.toastMsg.classList.add("show");
    setTimeout(() => {
      elements.toastMsg.classList.remove("show");
    }, 2400);
  }

  function setStatus(text, dotColor = "var(--accent)") {
    if (elements.statusText) elements.statusText.textContent = text;
    if (elements.statusDot) {
      elements.statusDot.style.background = dotColor;
      elements.statusDot.style.boxShadow = `0 0 8px ${dotColor}`;
    }
  }

  function updateMetrics(metrics) {
    if (!metrics) {
      resetMetrics();
      return;
    }

    const fmt = window.Measurement.format;

    elements.valSqM.textContent = fmt(metrics.sqM, 2);
    elements.valSqFt.textContent = fmt(metrics.sqFt, 2);
    elements.valAcres.textContent = fmt(metrics.acres, 4);
    elements.valHectares.textContent = fmt(metrics.hectares, 4);
    elements.valPerimeterM.textContent = fmt(metrics.perimeterM, 2) + " m";
    elements.valPerimeterFt.textContent = fmt(metrics.perimeterFt, 2) + " ft";
    elements.valGuntha.textContent = fmt(metrics.guntha, 2) + " Guntha";

    elements.btnEdit.disabled = false;
    elements.btnClear.disabled = false;
    elements.btnCopyGeoJSON.disabled = false;
    elements.btnDownloadGeoJSON.disabled = false;

    setStatus(`Enclosed: ${fmt(metrics.sqFt, 2)} sq ft (${fmt(metrics.sqM, 2)} m²)`, "var(--success)");
  }

  function resetMetrics() {
    if (elements.valSqM) elements.valSqM.textContent = "0.00";
    if (elements.valSqFt) elements.valSqFt.textContent = "0.00";
    if (elements.valAcres) elements.valAcres.textContent = "0.0000";
    if (elements.valHectares) elements.valHectares.textContent = "0.0000";
    if (elements.valPerimeterM) elements.valPerimeterM.textContent = "0.00 m";
    if (elements.valPerimeterFt) elements.valPerimeterFt.textContent = "0.00 ft";
    if (elements.valGuntha) elements.valGuntha.textContent = "0.00 Guntha";

    if (elements.btnEdit) {
      elements.btnEdit.disabled = true;
      elements.btnEdit.classList.remove("active");
    }
    if (elements.btnEditText) elements.btnEditText.textContent = "Edit Shape";
    if (elements.btnClear) elements.btnClear.disabled = true;
    if (elements.btnCopyGeoJSON) elements.btnCopyGeoJSON.disabled = true;
    if (elements.btnDownloadGeoJSON) elements.btnDownloadGeoJSON.disabled = true;

    setStatus('Ready — Select "Draw Area" to begin', "var(--accent)");
  }

  function setEditMode(isEditing) {
    if (!elements.btnEdit) return;
    if (isEditing) {
      elements.btnEdit.classList.add("active");
      elements.btnEditText.textContent = "Done Editing";
      setStatus("Drag white corner handles to adjust boundary. Click 'Done' when finished.", "var(--accent)");
    } else {
      elements.btnEdit.classList.remove("active");
      elements.btnEditText.textContent = "Edit Shape";
      setStatus("Editing complete.", "var(--success)");
    }
  }

  return {
    init: init,
    updateMetrics: updateMetrics,
    resetMetrics: resetMetrics,
    setStatus: setStatus,
    setEditMode: setEditMode,
    showToast: showToast
  };
})();
