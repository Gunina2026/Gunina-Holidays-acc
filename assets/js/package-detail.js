/* Gunina Holidays — holiday package detail renderer */
(function(){
  "use strict";
  async function init(){
  const data=window.GUNINA_PACKAGES||[];
  const root=document.getElementById("packageDetail");
  if(!root) return;
  const slug=root.dataset.slug||location.pathname.split("/").pop().replace(/\.html$/,"");
  const p=data.find(x=>x.slug===slug);
  const destinations=window.GUNINA_DESTINATIONS||[];
  const d=destinations.find(x=>x.slug===p?.destination);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  if(!p){
    root.innerHTML=`<div class="notice"><strong>Package not found.</strong><br><a class="btn outline" href="../packages.html">Back to Holiday Packages</a></div>`;
    return;
  }
  if(d) await window.GUNINA_TRAVEL_IMAGES.resolveMany([d]);
  document.title=`${p.title} | Gunina Holidays`;
  const img=d?window.GUNINA_TRAVEL_IMAGES.get(d.name,d.region,d.image):window.GUNINA_TRAVEL_IMAGES.fallback("world","Asia");
  const destinationLink=d?`../destinations/${d.slug}.html`:`../destinations.html`;
  root.innerHTML=`
    <section class="detail-hero destination-hero">
      <img class="detail-cover" src="${esc(img)}" alt="${esc(p.title)}" onerror="this.onerror=null;this.src='${esc(window.GUNINA_TRAVEL_IMAGES.fallback(d?.name||"world",d?.region||"Asia"))}'">
      <div class="detail-hero-overlay"></div>
      <div class="container detail-hero-content">
        <div class="crumb"><a href="../index.html">Home</a> › <a href="../packages.html">Holiday Packages</a> › ${esc(p.title)}</div>
        <span class="eyebrow detail-eyebrow">HOLIDAY PACKAGE</span>
        <h1>${esc(p.title)}</h1>
        <p>${esc(p.duration)} · ${esc(p.region)}</p>
        <div class="hero-actions"><a class="btn gold" href="../enquiry.html?package=${encodeURIComponent(p.slug)}">Get My Quote</a><a class="btn outline hero-outline" href="#package-itinerary">View Itinerary</a></div>
      </div>
    </section>
    <main class="container content destination-content">
      <div class="two">
        <div>
          <section><span class="eyebrow">PACKAGE OVERVIEW</span><h2>Why this package</h2><p>${esc(p.overview)}</p><p>Gunina Holidays can customize the route, hotel category, sightseeing, transfers and travel dates. No fixed price or availability is implied until the final quotation is confirmed.</p></section>
          <section><h2>Package Highlights</h2><div class="chips">${p.highlights.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div></section>
          <section id="package-itinerary"><h2>Day-by-Day Itinerary</h2>${p.itinerary.map(x=>`<div class="day"><strong>Day ${x.day} · ${esc(x.title)}</strong><p>${esc(x.description)}</p></div>`).join("")}</section>
          <section><h2>Accommodation</h2><p>${esc(p.accommodation)}</p></section>
          <section><h2>Transportation</h2><p>${esc(p.transport)}</p></section>
          <section><h2>Inclusions</h2><ul class="check-list">${p.inclusions.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
          <section><h2>Exclusions</h2><ul class="check-list">${p.exclusions.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
          <section><h2>Visa & Travel Information</h2><p>${d?esc(d.visaInfo):"Visa and entry requirements depend on the countries included in the final route and the traveller's nationality. Confirm current requirements before travel."}</p></section>
          <section><h2>Important Notes</h2><div class="notice">${esc(p.notes)}</div></section>
        </div>
        <aside class="side sticky-side">
          <span class="eyebrow">CUSTOMIZE THIS TRIP</span>
          <h3>${esc(p.title)}</h3>
          <p>Share your dates, number of travellers, preferred hotel category and interests. We will prepare a tailored quotation.</p>
          <a class="btn primary full" href="../enquiry.html?package=${encodeURIComponent(p.slug)}">Enquire Now</a>
          <a class="btn outline full" href="${destinationLink}">Explore Destination</a>
        </aside>
      </div>
    </main>`;
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();