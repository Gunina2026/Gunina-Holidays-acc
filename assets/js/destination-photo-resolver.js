/* Gunina Holidays photo-first destination resolver */
(function () {
  const PHOTO_URLS = window.GUNINA_DESTINATION_PHOTOS || {};
  window.getDestinationPhoto = function (d) {
    if (!d) return "";
    return String(PHOTO_URLS[d.slug] || d.photo || "").trim();
  };
  window.getDestinationImage = function (d, fallback) {
    return window.getDestinationPhoto(d) || (d && d.image) || fallback || "";
  };
})();
