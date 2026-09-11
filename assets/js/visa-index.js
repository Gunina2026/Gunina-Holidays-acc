/* Gunina Holidays — visa country catalogue renderer */
(function(){
  "use strict";
  const data=window.GUNINA_VISA_COUNTRIES||[];
  const grid=document.getElementById("visaGrid");
  if(!grid) return;
  const search=document.getElementById("visaSearch");
  const count=document.getElementById("visaCount");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const aliases={
    "usa":"united states", "us":"united states", "u.s.a.":"united states",
    "uk":"united kingdom", "britain":"united kingdom", "england":"united kingdom",
    "uae":"united arab emirates", "dubai":"united arab emirates",
    "south korea":"south korea", "korea":"south korea",
    "czechia":"czech republic", "turkiye":"türkiye", "turkey":"türkiye"
  };
  function searchable(v){
    const extra=Object.entries(aliases).filter(([k,val])=>v.name.toLowerCase()===val).map(([k])=>k);
    return [v.name,v.slug,...extra].join(" ").toLowerCase();
  }
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const list=data.filter(v=>!q||searchable(v).includes(q));
    grid.innerHTML=list.length ? list.map(v=>{
      const image=`assets/images/visa/${v.slug}.svg`;
      return `<article class="card visa-card">
        <img loading="lazy" src="${image}" alt="${esc(v.name)} visa assistance" onerror="this.onerror=null;this.src='assets/images/visa/generic.svg'">
        <div class="card-body"><span class="eyebrow">VISA ASSISTANCE</span><h3>${esc(v.name)}</h3><p>Country-specific documentation and application guidance, subject to current rules.</p><a class="btn outline" href="visa/${esc(v.slug)}.html">View Visa Details</a></div>
      </article>`;
    }).join("") : `<div class="notice no-results"><strong>No visa options found.</strong> Try another country.</div>`;
    if(count) count.textContent=`${list.length} of ${data.length} countries`;
  }
  search?.addEventListener("input",render);
  render();
})();