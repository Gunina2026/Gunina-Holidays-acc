/* Gunina Holidays — destination catalogue renderer */
(function(){
  "use strict";
  const data=window.GUNINA_DESTINATIONS||[];
  const grid=document.getElementById("destinationGrid");
  if(!grid) return;
  const search=document.getElementById("destinationSearch");
  const count=document.getElementById("destinationCount");
  const regionSelect=document.getElementById("destinationRegion");
  const regions=[...new Set(data.map(d=>d.region))].sort();
  const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  if(regionSelect){
    regionSelect.innerHTML='<option value="">All regions</option>'+regions.map(r=>`<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("");
  }

  function card(d){
    return `<article class="card destination-card" data-name="${escapeHtml(d.name.toLowerCase())}" data-region="${escapeHtml(d.region)}">
      <div class="card-media"><img data-travel-photo="${escapeHtml(d.name)}" src="${window.GUNINA_TRAVEL_IMAGES.fallback(d.name)}" alt="${escapeHtml(d.name)} travel destination"></div>
      <div class="card-body">
        <span class="eyebrow">${escapeHtml(d.region)}</span>
        <h3>${escapeHtml(d.name)}</h3>
        <p>${escapeHtml(d.description)}</p>
        <a class="btn outline" href="destinations/${encodeURIComponent(d.slug)}.html">View Destination</a>
      </div>
    </article>`;
  }
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const region=regionSelect?.value||"";
    const filtered=data.filter(d=>
      (!q || [d.name,d.country,d.region,...d.places].join(" ").toLowerCase().includes(q)) &&
      (!region || d.region===region)
    );
    grid.innerHTML=filtered.map(card).join("");
    if(count) count.textContent=`${filtered.length} of ${data.length} destinations`;
    window.GUNINA_TRAVEL_IMAGES.wireImages(grid);
  }
  search?.addEventListener("input",render);
  regionSelect?.addEventListener("change",render);
  render();
})();
