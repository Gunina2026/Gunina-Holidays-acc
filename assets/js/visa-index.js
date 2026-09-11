/* Gunina Holidays — visa country catalogue renderer */
(function(){
  "use strict";
  const data=window.GUNINA_VISA_COUNTRIES||[];
  const grid=document.getElementById("visaGrid");
  if(!grid) return;
  const search=document.getElementById("visaSearch");
  const destinations=window.GUNINA_DESTINATIONS||[];
  const count=document.getElementById("visaCount");
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const list=data.filter(v=>!q||v.name.toLowerCase().includes(q));
    grid.innerHTML=list.map(v=>{ const d=destinations.find(x=>x.slug===v.slug); const image=d?.image||"assets/images/visa/visa-assistance.svg"; return `<article class="card visa-card">
      <img class="visa-cover" loading="lazy" src="${esc(image)}" alt="${esc(v.name)} visa assistance" onerror="this.onerror=null;this.src='assets/images/visa/visa-assistance.svg'">
      <div class="card-body"><span class="eyebrow">VISA ASSISTANCE</span><h3>${esc(v.name)}</h3><p>Country-specific documentation and application guidance, subject to current rules.</p><a class="btn outline" href="visa/${esc(v.slug)}.html">View Visa Details</a></div>
    </article>`; }).join("");
    if(count) count.textContent=`${list.length} of ${data.length} countries`;
  }
  search?.addEventListener("input",render);
  render();
})();