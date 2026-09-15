/* Gunina Holidays — homepage popular destinations renderer */
(function(){
  "use strict";
  const data=window.GUNINA_DESTINATIONS||[];
  const grid=document.getElementById("popularDestinationGrid");
  if(!grid) return;
  const popularSlugs=["japan","dubai","malaysia","singapore","thailand","bali","vietnam","turkey","switzerland","france","italy","australia","new-zealand","usa","canada","egypt","mauritius","maldives","sri-lanka","greece"];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  grid.innerHTML=popularSlugs.map(slug=>data.find(d=>d.slug===slug)).filter(Boolean).map(d=>`
    <article class="card destination-card">
      <img loading="lazy" src="${esc(d.image)}" alt="${esc(d.name)} travel destination" onerror="this.onerror=null;this.src='assets/images/destinations/${d.slug}.svg'">
      <div class="card-body"><span class="eyebrow">${esc(d.region)}</span><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p><a class="btn outline" href="destinations/${esc(d.slug)}.html">View Details</a></div>
    </article>`).join("");
})();