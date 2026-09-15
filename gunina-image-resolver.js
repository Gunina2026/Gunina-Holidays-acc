/* Gunina Holidays - Photo Card Image Resolver
 * Uses local photographic assets first, then existing SVG artwork as a safe fallback.
 * Put destination photos in assets/images/destinations/<slug>.jpg (or .webp/.png).
 * Put visa photos in assets/images/visa/<slug>.jpg (or .webp/.png).
 */
(function () {
  "use strict";

  const EXTENSIONS = ["jpg", "jpeg", "webp", "png"];

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function candidates(base, value, fallbackSvg) {
    const slug = slugify(value);
    const names = [slug, slug.replace(/-+/g, "-")];
    const out = [];
    names.forEach(n => EXTENSIONS.forEach(ext => out.push(base + n + "." + ext)));
    if (fallbackSvg) out.push(base + fallbackSvg);
    return out;
  }

  function setWithFallback(img, list, index) {
    if (!img || index >= list.length) return;
    const next = list[index];
    img.onerror = function () {
      setWithFallback(img, list, index + 1);
    };
    img.src = next;
  }

  window.GuninaImageResolver = {
    slugify,
    destination(value, img) {
      const name = String(value || "");
      const fallback = slugify(name) + ".svg";
      const list = candidates("assets/images/destinations/", name, fallback);
      setWithFallback(img, list, 0);
    },
    visa(value, img) {
      const name = String(value || "");
      const fallback = slugify(name) + ".svg";
      const list = candidates("assets/images/visa/", name, fallback);
      setWithFallback(img, list, 0);
    }
  };
})();
