/* Gunina Holidays — package catalogue renderer */
(function(){
  "use strict";
  function init(){
    const data=window.GUNINA_PACKAGES||[],grid=document.getElementById("packageGrid");
    if(!grid) return;
    const destinations=window.GUNINA_DESTINATIONS||[],search=document.getElementById("packageSearch"),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])),map={};
    const imageItems=data.map(p=>destinations.find(d=>d.slug===p.destination)).filter(Boolean);
    function card(p){const d=destinations.find(x=>x.slug===p.destination);const image=map[d?.name]||window.GUNINA_TRAVEL_IMAGES.fallback(d?.name||p.destination,d?.region||"");return `<article class="card"><div class="card-media"><img loading="lazy" src="${esc(image)}" alt="${esc(p.title)}" onerror="this.onerror=null;this.src='${esc(window.GUNINA_TRAVEL_IMAGES.fallback(d?.name||p.destination,d?.region||''))}'></div><div class="card-body"><span class="eyebrow">${esc(p.duration)}</span><h3>${esc(p.title)}</h3><p>${esc(p.overview)}</p><a class="btn outline" href="packages/${esc(p.slug)}.html">View Package</a></div></article>`;}
    function render(){const q=(search?.value||"").trim().toLowerCase();grid.innerHTML=data.filter(p=>!q||[p.title,p.overview,p.region,p.highlights.join(" ")].join(" ").toLowerCase().includes(q)).map(card).join("");}
    grid.innerHTML='<div class="notice">Loading package photography…</div>';
    window.GUNINA_TRAVEL_IMAGES.resolveMany(imageItems).then(m=>{Object.assign(map,m);render();}).catch(()=>render());
    search?.addEventListener("input",render);
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
