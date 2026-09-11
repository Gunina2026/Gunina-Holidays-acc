/* Gunina Holidays — visa country catalogue renderer */
(function(){
  "use strict";
  function init(){
    const data=window.GUNINA_VISA_COUNTRIES||[];
    const grid=document.getElementById("visaGrid");
    if(!grid) return;
    const search=document.getElementById("visaSearch"), count=document.getElementById("visaCount"), imageMap={};
    const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
    const aliases={"usa":"united states","us":"united states","u.s.a.":"united states","uk":"united kingdom","britain":"united kingdom","england":"united kingdom","uae":"united arab emirates","dubai":"united arab emirates","korea":"south korea","czechia":"czech republic","turkiye":"türkiye","turkey":"türkiye"};
    function searchable(v){const extra=Object.entries(aliases).filter(([k,val])=>v.name.toLowerCase()===val).map(([k])=>k);return [v.name,v.slug,...extra].join(" ").toLowerCase();}
    function card(v){const image=imageMap[v.name]||window.GUNINA_TRAVEL_IMAGES.fallback(v.name,"");return `<article class="card visa-card"><div class="card-media"><img loading="lazy" src="${esc(image)}" alt="${esc(v.name)} visa assistance" onerror="this.onerror=null;this.src='${esc(window.GUNINA_TRAVEL_IMAGES.fallback(v.name,''))}'></div><div class="card-body"><span class="eyebrow">VISA ASSISTANCE</span><h3>${esc(v.name)}</h3><p>Country-specific documentation and application guidance, subject to current rules.</p><a class="btn outline" href="visa/${esc(v.slug)}.html">View Visa Details</a></div></article>`;}
    function render(){const q=(search?.value||"").trim().toLowerCase();const list=data.filter(v=>!q||searchable(v).includes(q));grid.innerHTML=list.length?list.map(card).join(""):`<div class="notice no-results"><strong>No visa options found.</strong> Try another country.</div>`;if(count) count.textContent=`${list.length} of ${data.length} countries`;}
    grid.innerHTML='<div class="notice">Loading visa photography…</div>';
    window.GUNINA_TRAVEL_IMAGES.resolveMany(data).then(m=>{Object.assign(imageMap,m);render();}).catch(()=>render());
    search?.addEventListener("input",render);
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
