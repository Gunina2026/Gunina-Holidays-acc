/* Gunina Holidays — homepage popular destinations renderer */
(function(){
  "use strict";
  function init(){
    const data=window.GUNINA_DESTINATIONS||[],grid=document.getElementById("popularDestinationGrid");
    if(!grid) return;
    const popularSlugs=["japan","dubai","malaysia","singapore","thailand","bali","vietnam","turkey","switzerland","france","italy","australia","new-zealand","usa","canada","egypt","mauritius","maldives","sri-lanka","greece"];
    const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
    const list=popularSlugs.map(slug=>data.find(d=>d.slug===slug)).filter(Boolean),map={};
    grid.innerHTML='<div class="notice">Loading destination photography…</div>';
    window.GUNINA_TRAVEL_IMAGES.resolveMany(list).then(m=>{Object.assign(map,m);grid.innerHTML=list.map(d=>{const image=map[d.name]||window.GUNINA_TRAVEL_IMAGES.fallback(d.name,d.region);return `<article class="card destination-card"><div class="card-media"><img loading="lazy" src="${esc(image)}" alt="${esc(d.name)} travel destination" onerror="this.onerror=null;this.src='${esc(window.GUNINA_TRAVEL_IMAGES.fallback(d.name,d.region))}'></div><div class="card-body"><span class="eyebrow">${esc(d.region)}</span><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p><a class="btn outline" href="destinations/${esc(d.slug)}.html">View Details</a></div></article>`;}).join("");});
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
