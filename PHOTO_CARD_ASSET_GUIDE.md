# Gunina Holidays Photo Card System

This build adds a safe local-photo layer to the existing site.

## Destination photos
Add photographic files to:
`assets/images/destinations/`

Use the destination's slug as the filename, for example:
- `japan.jpg`
- `egypt.jpg`
- `sri-lanka.jpg`
- `switzerland.jpg`

Supported extensions: JPG, JPEG, WEBP, PNG.

## Visa photos
Add photographic files to:
`assets/images/visa/`

Use the country slug:
- `usa.jpg`
- `uk.jpg`
- `canada.jpg`
- `australia.jpg`

The resolver tries photographic formats first. If no photo exists, the site's existing SVG is used, so cards never show a broken-image icon.

## Recommended image shape
Use landscape images, approximately 16:9 or 4:3, with the main landmark/subject near the center.

## Important
This ZIP does not hotlink random Google/Pinterest images. That avoids unreliable URLs and copyright/licensing surprises. Supply properly licensed photos in the folders above.
