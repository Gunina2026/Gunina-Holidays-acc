/* Gunina Holidays — package catalogue renderer */
(function(){
  "use strict";
  const data=window.GUNINA_PACKAGES||[];
  const grid=document.getElementById("packageGrid");
  if(!grid) return;
  const destinations=window.GUNINA_DESTINATIONS||[];
  const search=document.getElementById("packageSearch");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function card(p){
    const d=destinations.find(x=>x.slug===p.destination);
    const name=d?.name || p.region || p.title;
    return `<article class="card">
      <div class="card-media"><img data-travel-photo="${esc(name)}" src="${window.GUNINA_TRAVEL_IMAGES.fallback(name)}" alt="${esc(p.title)} travel destination"></div>
      <div class="card-body"><span class="eyebrow">${esc(p.duration)}</span><h3>${esc(p.title)}</h3><p>${esc(p.overview)}</p><div class="card-facts"><strong>Highlights:</strong> ${esc((p.highlights||[]).slice(0,4).join(" · "))}</div><a class="btn outline" href="packages/${esc(p.slug)}.html">View Package</a></div>
    </article>`;
  }
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const list=data.filter(p=>!q||[p.title,p.overview,p.region,(p.highlights||[]).join(" ")].join(" ").toLowerCase().includes(q));
    grid.innerHTML=list.map(card).join("");
    window.GUNINA_TRAVEL_IMAGES.wireImages(grid);
  }
  search?.addEventListener("input",render);
  render();
})();
