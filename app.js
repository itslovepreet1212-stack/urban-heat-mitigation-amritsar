import { ZONES } from './data.js';

// ==========================================================================
// CONFIGURATION & SETUP
// ==========================================================================
maptilersdk.config.apiKey = 'YOUR_MAPTILER_KEY_HERE';

const idMap = {
  "Zone_0_0": 0, "Zone_0_1": 1, "Zone_0_2": 2, "Zone_0_3": 3,
  "Zone_1_0": 4, "Zone_1_1": 5, "Zone_1_2": 6, "Zone_1_3": 7,
  "Zone_2_0": 8, "Zone_2_1": 9, "Zone_2_2": 10, "Zone_2_3": 11,
  "Zone_3_0": 12, "Zone_3_1": 13, "Zone_3_2": 14, "Zone_3_3": 15
};

const lonMin = 74.78;
const lonMax = 74.95;
const latMin = 31.55;
const latMax = 31.70;
const cols = 4;
const rows = 4;
const dLon = (lonMax - lonMin) / cols;
const dLat = (latMax - latMin) / rows;

let selectedZoneId = 'Zone_1_1';
let markers = {};

// ==========================================================================
// THERMAL SCALE COLOR INTERPOLATION
// ==========================================================================
function getThermalColor(temp) {
  const minTemp = 45.60;
  const maxTemp = 46.91;
  const ratio = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  
  let r, g, b;
  if (ratio < 0.5) {
    const t = ratio * 2;
    // teal rgb(0, 212, 200) to orange rgb(240, 104, 48)
    r = Math.round(0 + t * 240);
    g = Math.round(212 + t * (104 - 212));
    b = Math.round(200 + t * (48 - 200));
  } else {
    const t = (ratio - 0.5) * 2;
    // orange rgb(240, 104, 48) to red rgb(232, 64, 64)
    r = Math.round(240 + t * (232 - 240));
    g = Math.round(104 + t * (64 - 104));
    b = Math.round(48 + t * (64 - 48));
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function formatCoords(lng, lat) {
  return `LAT: ${lat.toFixed(4)}° N  |  LON: ${lng.toFixed(4)}° E`;
}

// ==========================================================================
// MAP INITIALIZATION
// ==========================================================================
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.SATELLITE,
  center: [74.865, 31.625],
  zoom: 11.8,
  scrollZoom: false
});

// Navigation control top-right
map.addControl(new maptilersdk.NavigationControl(), 'top-right');

// ==========================================================================
// ZONE SELECTION FUNCTION
// ==========================================================================
function selectZone(zoneId, fly = true) {
  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) return;

  selectedZoneId = zoneId;

  // 1. Update List Row Selection state
  const rows = document.querySelectorAll('.zone-list-row');
  rows.forEach(r => {
    if (r.id === `row-${zoneId}`) {
      r.classList.add('selected');
      r.setAttribute('aria-selected', 'true');
      r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      r.classList.remove('selected');
      r.setAttribute('aria-selected', 'false');
    }
  });

  // 2. Update Map Layers & Markers
  if (map.loaded()) {
    const numId = idMap[zoneId];
    map.setFilter('zones-selected-outline', ['==', ['id'], numId]);
    map.setFilter('zones-fill-selected', ['==', ['id'], numId]);
    
    // Update marker selection classes
    Object.keys(markers).forEach(id => {
      const el = markers[id].getElement();
      if (id === zoneId) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    if (fly) {
      const latMinCell = latMax - (zone.row + 1) * dLat;
      const lonMinCell = lonMin + zone.col * dLon;
      const center = [lonMinCell + dLon / 2, latMinCell + dLat / 2];
      map.flyTo({
        center: center,
        zoom: 12.5,
        duration: 800,
        essential: true
      });
    }
  }

  // 3. Update Selected Zone Details
  document.getElementById('detail-zone-name').textContent = zone.name;

  const latMinCell = latMax - (zone.row + 1) * dLat;
  const lonMinCell = lonMin + zone.col * dLon;
  const centerLon = lonMinCell + dLon / 2;
  const centerLat = latMinCell + dLat / 2;
  document.getElementById('detail-coordinates').textContent = formatCoords(centerLon, centerLat);

  // Metrics
  const tempValEl = document.getElementById('metric-current-temp');
  tempValEl.textContent = `${zone.lst.toFixed(2)}°C`;
  tempValEl.style.color = getThermalColor(zone.lst);

  // Negative sign prefix is standard en-dash: −
  document.getElementById('metric-max-reduction').textContent = `−${zone.combined.toFixed(2)}°C`;

  // Priority Badge
  const badge = document.getElementById('detail-priority-badge');
  badge.className = 'priority-badge';
  if (zone.combined >= 4.5) {
    badge.textContent = 'High Priority';
    badge.classList.add('pill-high');
  } else if (zone.combined >= 3.8) {
    badge.textContent = 'Moderate Priority';
    badge.classList.add('pill-moderate');
  } else {
    badge.textContent = 'Lower Priority';
    badge.classList.add('pill-low');
  }

  // 4. Update Strategy Progress Bars
  document.getElementById('bar-greenery-val').textContent = `${zone.greenery >= 0 ? '' : '−'}${Math.abs(zone.greenery).toFixed(2)}°C`;
  // Width represents % of max scale (6°C = 100%)
  const greenPct = Math.max(0, (zone.greenery / 6.0) * 100);
  document.getElementById('bar-greenery').style.width = `${greenPct}%`;

  document.getElementById('bar-roofs-val').textContent = `${zone.roofs.toFixed(2)}°C`;
  const roofsPct = Math.max(0, (zone.roofs / 6.0) * 100);
  document.getElementById('bar-roofs').style.width = `${roofsPct}%`;

  document.getElementById('bar-combined-val').textContent = `${zone.combined.toFixed(2)}°C`;
  const combinedPct = Math.max(0, (zone.combined / 6.0) * 100);
  document.getElementById('bar-combined').style.width = `${combinedPct}%`;

  // 5. Update Recommendation Text
  document.getElementById('recommendation-text').textContent = zone.ai;
}

// ==========================================================================
// INITIAL POPULATION & DOM LOAD
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Populate Zone Priority List
  const listContainer = document.getElementById('zone-priority-list');
  const sortedZones = [...ZONES].sort((a, b) => b.combined - a.combined);

  sortedZones.forEach(zone => {
    const row = document.createElement('div');
    row.className = 'zone-list-row';
    row.id = `row-${zone.id}`;
    row.setAttribute('role', 'option');
    row.setAttribute('aria-selected', 'false');

    const thermalColor = getThermalColor(zone.lst);

    row.innerHTML = `
      <span class="row-dot" style="background-color: ${thermalColor}"></span>
      <span class="row-name">${zone.name}</span>
      <span class="row-temp">${zone.lst.toFixed(2)}°C</span>
      <span class="row-reduction">−${zone.combined.toFixed(2)}°C</span>
    `;

    row.addEventListener('click', () => {
      selectZone(zone.id, true);
    });

    listContainer.appendChild(row);
  });

  // Scroll Zoom Toggle
  const zoomToggleBtn = document.getElementById('zoom-toggle');
  let scrollZoomEnabled = false;
  zoomToggleBtn.addEventListener('click', () => {
    scrollZoomEnabled = !scrollZoomEnabled;
    if (scrollZoomEnabled) {
      map.scrollZoom.enable();
      zoomToggleBtn.classList.add('active');
      zoomToggleBtn.setAttribute('aria-pressed', 'true');
      zoomToggleBtn.innerHTML = '<span class="toggle-icon">🖱️</span> Scroll Zoom Enabled';
    } else {
      map.scrollZoom.disable();
      zoomToggleBtn.classList.remove('active');
      zoomToggleBtn.setAttribute('aria-pressed', 'false');
      zoomToggleBtn.innerHTML = '<span class="toggle-icon">🖱️</span> Enable Scroll Zoom';
    }
  });

  // Apply default text updates
  selectZone('Zone_1_1', false);
});

// ==========================================================================
// MAP LOAD EVENT HANDLER
// ==========================================================================
map.on('load', () => {
  // Construct GeoJSON Source
  const zonesGeoJSON = {
    type: "FeatureCollection",
    features: ZONES.map(zone => {
      const latMinCell = latMax - (zone.row + 1) * dLat;
      const latMaxCell = latMax - zone.row * dLat;
      const lonMinCell = lonMin + zone.col * dLon;
      const lonMaxCell = lonMin + (zone.col + 1) * dLon;
      const color = getThermalColor(zone.lst);

      return {
        type: "Feature",
        id: idMap[zone.id],
        properties: {
          id: zone.id,
          name: zone.name,
          lst: zone.lst,
          color: color
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lonMinCell, latMinCell],
            [lonMaxCell, latMinCell],
            [lonMaxCell, latMaxCell],
            [lonMinCell, latMaxCell],
            [lonMinCell, latMinCell]
          ]]
        }
      };
    })
  };

  // Add Source
  map.addSource('zones', {
    type: 'geojson',
    data: zonesGeoJSON
  });

  // 1. Regular Fill Layer (Default opacity 0.32)
  map.addLayer({
    id: 'zones-fill',
    type: 'fill',
    source: 'zones',
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.32
    }
  });

  // 2. Selected Fill Layer (Opacity 0.55)
  map.addLayer({
    id: 'zones-fill-selected',
    type: 'fill',
    source: 'zones',
    filter: ['==', ['id'], idMap['Zone_1_1']],
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.55
    }
  });

  // 3. Dashed Outline for all zones (1.2px)
  map.addLayer({
    id: 'zones-outline',
    type: 'line',
    source: 'zones',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 1.2,
      'line-dasharray': [3, 3]
    }
  });

  // 4. Solid Amber Outline for selected zone (2.5px)
  map.addLayer({
    id: 'zones-selected-outline',
    type: 'line',
    source: 'zones',
    filter: ['==', ['id'], idMap['Zone_1_1']],
    paint: {
      'line-color': '#F0A500', // --amber
      'line-width': 2.5
    }
  });

  // Map Click Listener
  map.on('click', 'zones-fill', (e) => {
    if (e.features && e.features.length > 0) {
      const clickedFeature = e.features[0];
      const zoneId = clickedFeature.properties.id;
      selectZone(zoneId, true);
    }
  });

  // Cursor Hover Styles
  map.on('mouseenter', 'zones-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'zones-fill', () => {
    map.getCanvas().style.cursor = '';
  });

  // Render Floating Temperature Labels
  ZONES.forEach(zone => {
    const latMinCell = latMax - (zone.row + 1) * dLat;
    const lonMinCell = lonMin + zone.col * dLon;
    const centerLon = lonMinCell + dLon / 2;
    const centerLat = latMinCell + dLat / 2;

    const el = document.createElement('div');
    el.className = 'zone-temp-marker';
    el.id = `marker-${zone.id}`;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Zone ${zone.name}, temperature ${zone.lst}°C`);
    el.innerHTML = `
      <div class="marker-zone-name">${zone.id.replace('Zone_', 'Z-')}</div>
      <div class="marker-temp-val" style="color: ${getThermalColor(zone.lst)}">${zone.lst.toFixed(2)}°C</div>
    `;

    if (zone.id === 'Zone_1_1') {
      el.classList.add('selected');
    }

    const marker = new maptilersdk.Marker({
      element: el
    })
    .setLngLat([centerLon, centerLat])
    .addTo(map);

    markers[zone.id] = marker;
  });

  // Render Landmarks
  const landmarks = [
    { name: "Golden Temple", coords: [74.8765, 31.6200] },
    { name: "Railway Station", coords: [74.8736, 31.6326] },
    { name: "Khalsa College / Civil Lines", coords: [74.8531, 31.6504] }
  ];

  landmarks.forEach(lm => {
    const el = document.createElement('div');
    el.className = 'landmark-dot';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Landmark: ${lm.name}`);

    const popup = new maptilersdk.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'landmark-tooltip',
      offset: 8
    }).setHTML(`<strong>${lm.name}</strong>`);

    const marker = new maptilersdk.Marker({
      element: el
    })
    .setLngLat(lm.coords)
    .addTo(map);

    el.addEventListener('mouseenter', () => {
      popup.setLngLat(lm.coords).addTo(map);
    });
    el.addEventListener('mouseleave', () => {
      popup.remove();
    });
  });

  // Run final sync to establish initial highlights
  selectZone('Zone_1_1', false);
});
