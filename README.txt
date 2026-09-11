Gunina Holidays — Updated Static Website

See IMPLEMENTATION_REPORT.md for the complete architecture audit, changes, image system and deployment checklist.

The website is designed for GitHub Pages / static hosting.

Important:
- Keep the real `gunina-holidays-logo.png` in the project root if you already have it.
- `CNAME` is configured for `www.guninaholidays.in`.
- Do not delete `assets/js/destinations-data.js`; it is the master destination source.
- Do not manually maintain separate destination card data.
- The enquiry form continues to use the existing Web3Forms integration.

Master data:
- 120 destinations: assets/js/destinations-data.js
- 25 packages: assets/js/packages-data.js
- 195 visa countries: assets/js/visa-data.js
- Destination image manifest: assets/destination-image-manifest.json


PHOTO CARD UPDATE — 20260911-photo-fix-01
- The original destination/package/visa information is preserved.
- Destination cards, homepage Popular Destinations, Holiday Package cards and Visa country cards now use real travel photographs.
- Images are selected per place/country: the site immediately loads a stable place-specific photo, then attempts to upgrade it to a matching Wikipedia/Wikimedia photo.
- Legacy SVG placeholder files are retained in the archive but are no longer referenced by the card renderers.
- Browser cache-busting is included on the CSS/JS files for this photo-card build.
- Upload the CONTENTS of this ZIP to the GitHub Pages publishing branch/repository root. Do not upload the ZIP file itself.
