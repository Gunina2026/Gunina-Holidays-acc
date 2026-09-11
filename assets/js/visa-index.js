/* Gunina Holidays — visa country catalogue renderer */
(function(){
  "use strict";
  const data=window.GUNINA_VISA_COUNTRIES||[];
  const grid=document.getElementById("visaGrid");
  if(!grid) return;
  const search=document.getElementById("visaSearch");
  const count=document.getElementById("visaCount");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const list=data.filter(v=>v.name.toLowerCase().includes(q));
    grid.innerHTML=list.map(v=>`<article class="card visa-card">
      <div class="card-media"><img data-travel-photo="${esc(v.name)}" src="${window.GUNINA_TRAVEL_IMAGES.fallback(v.name)}" alt="${esc(v.name)} travel photo"></div>
      <div class="card-body"><span class="eyebrow">VISA ASSISTANCE</span><h3>${esc(v.name)}</h3><p>Country-specific documentation and application guidance, subject to current rules.</p><a class="btn outline" href="visa/${esc(v.slug)}.html">View Visa Details</a></div>
    </article>`).join("");
    if(count) count.textContent=`${list.length} of ${data.length} countries`;
    window.GUNINA_TRAVEL_IMAGES.wireImages(grid);
  }
  search?.addEventListener("input",render);
  render();
})();
