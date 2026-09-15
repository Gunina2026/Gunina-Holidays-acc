/* Gunina Holidays — destination catalogue renderer v3 */
(function(){
  "use strict";
  const data=Array.isArray(window.GUNINA_DESTINATIONS)?window.GUNINA_DESTINATIONS:[];
  const grid=document.getElementById("destinationGrid");
  if(!grid) return;
  const search=document.getElementById("destinationSearch");
  const count=document.getElementById("destinationCount");
  const regionSelect=document.getElementById("destinationRegion");
  const initialSearch=new URLSearchParams(location.search).get("search");
  if(search && initialSearch) search.value=initialSearch;
  const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const regions=[...new Set(data.map(d=>d.region).filter(Boolean))].sort();

  if(regionSelect){
    regionSelect.innerHTML='<option value="">All regions</option>'+regions.map(r=>`<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("");
  }

  function card(d){
    const image=escapeHtml(d.image||`assets/images/destinations/${d.slug}.svg`);
    const fallback=escapeHtml(`assets/images/destinations/${d.slug}.svg`);
    return `<article class="card destination-card" data-name="${escapeHtml(String(d.name||"").toLowerCase())}" data-region="${escapeHtml(d.region||"")}">
      <img loading="lazy" src="${image}" alt="${escapeHtml(d.name)} travel destination" onerror="this.onerror=null;this.src='${fallback}'">
      <div class="card-body">
        <span class="eyebrow">${escapeHtml(d.region||"Destination")}</span>
        <h3>${escapeHtml(d.name)}</h3>
        <p>${escapeHtml(d.description||"Plan a customized journey with Gunina Holidays.")}</p>
        <a class="btn outline" href="destinations/${encodeURIComponent(d.slug)}.html">View Destination</a>
      </div>
    </article>`;
  }

  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const region=regionSelect?.value||"";
    const filtered=data.filter(d=>{
      const hay=[d.name,d.country,d.region,...(Array.isArray(d.places)?d.places:[])].filter(Boolean).join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!region||d.region===region);
    });
    grid.innerHTML=filtered.length
      ? filtered.map(card).join("")
      : `<div class="empty-state"><strong>No destinations found.</strong><span>Try another country, city, place or region.</span></div>`;
    if(count) count.textContent=`${filtered.length} of ${data.length} destinations`;
  }
  search?.addEventListener("input",render);
  regionSelect?.addEventListener("change",render);
  render();
})();