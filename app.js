document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Left Map (Tiled Scroll Map using L.CRS.Simple & TMS tiles)
  const scrollMap = L.map('scrollMap', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 7
  });

  L.tileLayer('peutinger_map_scroll_tiles/{z}/{x}/{y}.webp', {
    minZoom: 0,
    maxZoom: 7,
    tms: true
  }).addTo(scrollMap);

  const scrollBounds = [[0, 0], [2000, 3000]]; 
  scrollMap.fitBounds(scrollBounds);

  // 2. Initialize Right Map (World Map Raster Tiles)
  const worldMap = L.map('worldMap').setView([20, 0], 2);
  L.tileLayer('natural_earth_tiles/{z}/{x}/{y}.webp', {
    minZoom: 0,
    maxZoom: 7,
    tms: false
  }).addTo(worldMap);

  // 3. Load GeoJSON Data & Populate Dropdown
  const response = await fetch('locations.geojson');
  const data = await response.json();
  const selectEl = document.getElementById('placeSelect');
  const searchInput = document.getElementById('searchInput'); // Optional search input element

  // Function to synchronously update both maps and open popups
  function selectLocation(feature, index) {
    const props = feature.properties;
    selectEl.value = index;

    // A. Update Scroll Map ([y, x] pixel coordinates)
    const scrollCoords = [props.y_scroll_map, props.x_scroll_map];
    scrollMap.setView(scrollCoords, 2);

    // B. Update World Map ([latitude, longitude] using 4326 CRS coordinates)
    const worldCoords = [props.y_true_world_4326crs, props.x_true_world_4326crs];
    worldMap.setView(worldCoords, 4);

    // Sync popups across both maps
    scrollGeoJsonLayer.eachLayer(layer => {
      if (layer.feature === feature) layer.openPopup();
    });
    worldGeoJsonLayer.eachLayer(layer => {
      if (layer.feature === feature) layer.openPopup();
    });
  }

  // Populate dropdown using latinplacename_english
  function populateDropdown(featuresToDisplay = data.features) {
    selectEl.innerHTML = '';
    featuresToDisplay.forEach((feature) => {
      const originalIndex = data.features.indexOf(feature);
      const props = feature.properties;
      const option = document.createElement('option');
      option.value = originalIndex;
      option.textContent = props.latinplacename_english || `Place ${props.Place_Reference_Number || originalIndex}`;
      selectEl.appendChild(option);
    });
  }

  populateDropdown();

  // 4. Add GeoJSON layers with dedicated panel property mappings
  const scrollGeoJsonLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
      const props = feature.properties;
      return L.marker([props.y_scroll_map, props.x_scroll_map]);
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      layer.bindPopup(`
        <b>${props.latinplacename_english || 'Unknown Place'}</b><br>
        Ref: ${props.Place_Reference_Number || 'N/A'}<br>
        Slice: ${props.vertical_slice_number || 'N/A'}<br>
        Segment: ${props.map_segment_number || 'N/A'} | Serial: ${props.serial_place_number || 'N/A'}
      `);
      layer.on('click', () => {
        const index = data.features.indexOf(feature);
        selectLocation(feature, index);
      });
    }
  }).addTo(scrollMap);

  const worldGeoJsonLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
      const props = feature.properties;
      return L.marker([props.y_true_world_4326crs, props.x_true_world_4326crs]);
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      layer.bindPopup(`
        <b>${props.address_english || 'World Location'}</b><br>
        GPS X: ${props.GPS_X_Base || ''} ${props.GPS_X_Direction || ''}<br>
        GPS Y: ${props.GPS_Y_Base || ''} ${props.GPS_Y_Direction || ''}
      `);
      layer.on('click', () => {
        const index = data.features.indexOf(feature);
        selectLocation(feature, index);
      });
    }
  }).addTo(worldMap);

  // 5. Handle Dropdown Change / "Show" Button Click
  document.getElementById('showBtn').addEventListener('click', () => {
    const selectedIndex = selectEl.value;
    const selectedFeature = data.features[selectedIndex];
    if (selectedFeature) {
      selectLocation(selectedFeature, selectedIndex);
    }
  });

  // 6. Optional Search / Filter Input Handler (if <input id="searchInput"> exists in HTML)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = data.features.filter(f => {
        const name = (f.properties.latinplacename_english || '').toLowerCase();
        const address = (f.properties.address_english || '').toLowerCase();
        return name.includes(query) || address.includes(query);
      });
      populateDropdown(filtered);
    });
  }
});
