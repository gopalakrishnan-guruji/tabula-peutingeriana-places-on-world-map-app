# Tabula Peutingeriana Map App
**Interactive Peutinger Map Scroll with World Map**
## EBook Companion
This App can be used as a Companion for the Book **Geographical Localization of Historical Places on The Peutinger Map** [EBook - ISBN 9789334471038].

🔗 **[View Live App](https://gopalakrishnan-guruji.github.io/tabula-peutingeriana-places-on-world-map-app/)**

🔗 **[Read The Complete EBook @archive.org](https://archive.org/details/geographical-localization-of-historical-places-on-the-peutinger-map-ebook-isbn-9789334471038/mode/2up)**

An interactive web application exploring the **Tabula Peutingeriana** (the ancient Roman road network map) alongside a modern geographic world view. This App project maps all **2,922 historical locations** from the **Tabula Peutingeriana** onto both a continuous scrollable custom coordinate system and a contemporary Leaflet world map with real-time cross-window synchronization.

## Features

* **Dual Map Synchronization:** Explore the historical Peutinger Map scroll and the modern World Map simultaneously via a connected broadcast channel interface.
* **Instant Live Search:** Real-time search functionality that triggers immediately from the first character typed, allowing users to instantly find and focus on any of the 2,922 places by name or reference number.
* **Vertical Slice Navigation:** Quickly jump to specific vertical sections (1 to 100) of the Peutinger scroll map using the dedicated slice input control.
* **Toggleable Peutinger Map:** Easily toggle on or off the place icons on the map. Drag the map scroll to customize your viewing workspace.
* **Collapsible World Panel:** Easily minimize the secondary world map panel to customize your viewing workspace.
* **Detailed Place Metadata:** Click on any location marker to view its ancient Latin name, reference number, vertical slice, modern equivalent address, and exact geographic coordinates.

## Project Structure

* `index.html` - Main application entry containing the Peutinger scroll map, live search, and iframe container.
* `world-map.html` - Secondary interactive view rendering the modern world coordinates and location details.
* `locations.geojson` - Dataset containing all 2,922 historical places and their corresponding coordinates.
* `peutinger_map_scroll_tiles/` - Tile directory for the custom scroll view.
* `natural_earth_tiles/` - Tile directory for the modern world view.
