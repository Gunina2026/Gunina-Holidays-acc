# Gunina Holidays image update

- All 120 destination records now use self-contained local image assets under `assets/images/destinations/`.
- Removed runtime dependency on remote Unsplash images from destination and package data.
- Homepage hero and featured package images were switched to local assets.
- Popular destinations inherit the local destination assets automatically.
- Visa catalogue now displays a destination image where available and a local visa-assistance fallback otherwise.
- Visa detail pages use local destination artwork when available and a local visa fallback when not.
- Existing Gunina Holidays logo and page structure were preserved.

Note: the ZIP's destination assets are SVG artwork already included in the supplied project; this update makes them reliably load from GitHub Pages without depending on an external image host.
