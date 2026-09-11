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
    const image=d?.image||"assets/images/destinations/european-capitals.svg";
    return `<article class="card">
      <img loading="lazy" src="${esc(image)}" alt="${esc(p.title)}" onerror="this.onerror=null;this.src='assets/images/destinations/${esc(d?.slug||"european-capitals")}.svg'">
      <div class="card-body"><span class="eyebrow">${esc(p.duration)}</span><h3>${esc(p.title)}</h3><p>${esc(p.overview)}</p><a class="btn outline" href="packages/${esc(p.slug)}.html">View Package</a></div>
    </article>`;
  }
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    grid.innerHTML=data.filter(p=>!q||[p.title,p.overview,p.region,p.highlights.join(" ")].join(" ").toLowerCase().includes(q)).map(card).join("");
  }
  search?.addEventListener("input",render);
  render();
})();