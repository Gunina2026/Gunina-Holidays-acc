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
