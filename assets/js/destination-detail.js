/* Gunina Holidays — destination detail renderer */
(function(){
  "use strict";
  async function init(){
  const data=window.GUNINA_DESTINATIONS||[];
  const packages=window.GUNINA_PACKAGES||[];
  const root=document.getElementById("destinationDetail");
  if(!root) return;
  const slug=root.dataset.slug||location.pathname.split("/").pop().replace(/\.html$/,"");
  const d=data.find(x=>x.slug===slug);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  if(!d){
    root.innerHTML=`<div class="notice"><strong>Destination not found.</strong><br><a class="btn outline" href="../destinations.html">Back to Destinations</a></div>`;
    return;
  }
  await window.GUNINA_TRAVEL_IMAGES.resolveMany([d]);
  document.title=`${d.name} | Gunina Holidays`;
  const meta=document.querySelector('meta[name="description"]');
  if(meta) meta.content=`Plan a customized ${d.name} holiday with Gunina Holidays.`;
  const related=packages.filter(p=>p.destination===d.slug).slice(0,3);
  const image=window.GUNINA_TRAVEL_IMAGES.get(d.name,d.region,d.image);
  root.innerHTML=`
    <section class="detail-hero destination-hero">
      <img class="detail-cover" src="${esc(image)}" alt="${esc(d.name)} destination cover" onerror="this.onerror=null;this.src='${esc(window.GUNINA_TRAVEL_IMAGES.fallback(d.name,d.region))}'">
      <div class="detail-hero-overlay"></div>
      <div class="container detail-hero-content">
        <div class="crumb"><a href="../index.html">Home</a> › <a href="../destinations.html">Destinations</a> › ${esc(d.name)}</div>
        <span class="eyebrow detail-eyebrow">${esc(d.region)}</span>
        <h1>${esc(d.name)}</h1>
        <p>${esc(d.country)} · ${esc(d.duration)}</p>
        <div class="hero-actions"><a class="btn gold" href="../enquiry.html?destination=${encodeURIComponent(d.slug)}">Plan This Trip</a><a class="btn outline hero-outline" href="#itinerary">View Itinerary</a></div>
      </div>
    </section>
    <main class="container content destination-content">
      <div class="two">
        <div>
          <section><span class="eyebrow">DESTINATION GUIDE</span><h2>About ${esc(d.name)}</h2><p>${esc(d.description)}</p></section>
          <section><h2>Why Visit ${esc(d.name)}?</h2><p>${esc(d.whyVisit)}</p></section>
          <section><h2>Popular Places</h2><div class="chips">${d.places.map(p=>`<span class="chip">${esc(p)}</span>`).join("")}</div></section>
          <section><h2>Famous Highlights</h2><ul class="check-list">${d.attractions.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></section>
          <section><h2>Recommended Experiences</h2><ul class="check-list">${d.experiences.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></section>
          <section><h2 id="itinerary">Suggested Itinerary</h2>
            <p class="muted">A planning framework based on the destination's principal places. The final sequence can be customized around your dates, pace and interests.</p>
            ${d.itinerary.map((place,i)=>`<div class="day"><strong>Day ${i+1} · ${esc(place)}</strong><p>${i===0?"Arrival, transfer and orientation around the first base.":i===d.itinerary.length-1?"Final sightseeing or leisure as time permits, followed by departure arrangements.":`Explore ${esc(place)} and nearby highlights, with time for local food, culture and experiences.`}</p></div>`).join("")}
          </section>
          <section><h2>Best Time & Suggested Duration</h2><p><strong>Suggested duration:</strong> ${esc(d.duration)}</p><p>${esc(d.bestTime)}</p></section>
          <section><h2>Travel Tips</h2><ul class="check-list">${d.travelTips.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></section>
          <section><h2>Visa Information</h2><p>${esc(d.visaInfo)}</p><div class="notice">Visa approval is always subject to the relevant embassy, consulate or immigration authority. Requirements can change.</div></section>
        </div>
        <aside class="side sticky-side">
          <span class="eyebrow">PLAN WITH GUNINA</span>
          <h3>${esc(d.name)}</h3>
          <p>Tell us your travel dates, preferred hotel category, interests and approximate budget. We can customize the route instead of forcing you into a fixed template.</p>
          <a class="btn primary full" href="../enquiry.html?destination=${encodeURIComponent(d.slug)}">Get My Quote</a>
          <a class="btn outline full" target="_blank" rel="noopener" href="https://wa.me/919222336122?text=${encodeURIComponent(`Hello Gunina Holidays, I want to plan a trip to ${d.name}.`)}">WhatsApp Gunina</a>
          ${related.length?`<hr><span class="eyebrow">SUGGESTED PACKAGES</span>${related.map(p=>`<a class="related-card" href="../packages/${esc(p.slug)}.html"><strong>${esc(p.title)}</strong><small>${esc(p.duration)}</small></a>`).join("")}`:""}
        </aside>
      </div>
    </main>`;
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();