/* Gunina Holidays — homepage popular destinations renderer */
(function(){
  "use strict";
  const data=window.GUNINA_DESTINATIONS||[];
  const grid=document.getElementById("popularDestinationGrid");
  if(!grid) return;
  const popularSlugs=["japan","dubai","malaysia","singapore","thailand","bali","vietnam","turkey","switzerland","france","italy","australia","new-zealand","usa","canada","egypt","mauritius","maldives","sri-lanka","greece"];
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  grid.innerHTML=popularSlugs.map(slug=>data.find(d=>d.slug===slug)).filter(Boolean).map(d=>`
    <article class="card destination-card">
      <div class="card-media"><img data-travel-photo="${esc(d.name)}" src="${window.GUNINA_TRAVEL_IMAGES.fallback(d.name)}" alt="${esc(d.name)} travel destination"></div>
      <div class="card-body">
        <span class="eyebrow">${esc(d.region)}</span>
        <h3>${esc(d.name)}</h3>
        <p>${esc(d.description)}</p>
        <div class="card-facts"><strong>Popular places:</strong> ${esc((d.places||[]).slice(0,4).join(" · "))}<br><strong>Suggested:</strong> ${esc(d.duration)}</div>
        <a class="btn outline" href="destinations/${esc(d.slug)}.html">View Details</a>
      </div>
    </article>`).join("");
  window.GUNINA_TRAVEL_IMAGES.wireImages(grid);
})();
