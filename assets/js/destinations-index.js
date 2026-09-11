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

  if(regionSelect){
    regionSelect.innerHTML='<option value="">All regions</option>'+regions.map(r=>`<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("");
  }

  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const imagePath=d=>d.image||`assets/images/destinations/${d.slug}.svg`;
  function card(d){
    return `<article class="card destination-card" data-name="${escapeHtml(d.name.toLowerCase())}" data-region="${escapeHtml(d.region)}">
      <img loading="lazy" src="${imagePath(d)}" alt="${escapeHtml(d.name)} travel destination" onerror="this.onerror=null;this.src='assets/images/destinations/${d.slug}.svg'">
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
  }
  search?.addEventListener("input",render);
  regionSelect?.addEventListener("change",render);
  render();
})();