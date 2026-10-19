const $=s=>document.querySelector(s);const params=new URLSearchParams(location.search);
$('.menu').onclick=()=>{const open=$('nav').classList.toggle('open');$('.menu').setAttribute('aria-expanded',open)};
const slides=[['japan','JAPAN — A world of contrasts'],['maldives','MALDIVES — Make room for wonder'],['new-zealand','NEW ZEALAND — Follow the extraordinary'],['thailand','THAILAND — Find your island rhythm'],['switzerland','SWITZERLAND — Take the scenic route'],['france','FRANCE — Savour every moment'],['uae','UAE — A new perspective'],['indonesia','INDONESIA — Escape into island life'],['singapore','SINGAPORE — A city full of possibilities'],['sri-lanka','SRI LANKA — Discover a different pace']];let current=0;
const heroImage = $('#hero-photo');
if (heroImage) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const incoming = heroImage.cloneNode(false);
  incoming.removeAttribute('id');
  incoming.classList.add('hero-incoming');
  incoming.alt = '';
  incoming.setAttribute('aria-hidden', 'true');
  heroImage.after(incoming);
  const photos = slides.map(([slug]) => {
    const destination = DESTINATIONS.find(item => item.slug === slug);
    const image = new Image();
    image.src = '/' + destination.image;
    return {image, destination};
  });
  let requestId = 0, fadeTimer, autoTimer;
  function updateCaption(n) {
    $('#hero-caption').textContent = `${String(n+1).padStart(2,'0')} / ${slides[n][1]}`;
    document.querySelectorAll('.slide').forEach((button, i) => {
      button.classList.toggle('active', i === n);
      button.setAttribute('aria-pressed', String(i === n));
    });
  }
  async function showSlide(n) {
    const request = ++requestId;
    const {image, destination} = photos[n];
    try { await image.decode(); } catch { if (!image.naturalWidth) return; }
    if (request !== requestId) return;
    clearTimeout(fadeTimer);
    if (incoming.classList.contains('visible')) {
      heroImage.src = incoming.src;
    }
    incoming.classList.remove('visible');
    incoming.style.transition = 'none';
    incoming.src = image.src;
    void incoming.offsetWidth;
    incoming.style.transition = '';
    current = n;
    updateCaption(n);
    heroImage.alt = destination.name;
    if (reducedMotion.matches) { heroImage.src = image.src; return; }
    incoming.classList.add('visible');
    fadeTimer = setTimeout(() => {
      if (request !== requestId) return;
      heroImage.src = image.src;
      incoming.classList.remove('visible');
    }, 900);
  }
  function startSlideshow() {
    clearInterval(autoTimer);
    if (!reducedMotion.matches && !document.hidden) {
      autoTimer = setInterval(() => showSlide((current + 1) % slides.length), 5000);
    }
  }
  document.querySelectorAll('.slide').forEach(button => {
    button.onclick = () => { showSlide(Number(button.dataset.slide)); startSlideshow(); };
  });
  updateCaption(0);
  startSlideshow();
  document.addEventListener('visibilitychange', startSlideshow);
  reducedMotion.addEventListener('change', startSlideshow);
}

if($('#destination-search')){const input=$('#destination-search'),region=$('#region-filter');input.value=params.get('q')||'';function filter(){let visible=0;document.querySelectorAll('#destination-grid .destination-card').forEach((c,i)=>{const d=DESTINATIONS[i];const ok=(!region.value||d.region===region.value)&&[d.name,d.region,...d.places].join(' ').toLowerCase().includes(input.value.toLowerCase().trim());c.hidden=!ok;c.style.display=ok?'block':'none';if(ok)visible++});$('#empty-results').hidden=visible>0}input.oninput=filter;region.onchange=filter;filter()}
document.querySelectorAll('.places-form').forEach(form=>{form.onchange=()=>{const n=form.querySelectorAll(':checked').length;form.querySelector('.selection-count').textContent=n?`${n} places selected`:'No places selected yet'};form.onsubmit=e=>{e.preventDefault();const q=new URLSearchParams({destination:form.dataset.destination,places:[...form.querySelectorAll(':checked')].map(x=>x.value).join(', ')});location.href='/enquiry/?'+q}});
if($('#enquiry-form')){$('#enquiry-destination').value=params.get('destination')||'';$('#enquiry-places').value=params.get('places')||'';$('#enquiry-service').value=params.get('package')||params.get('service')||'';const f=$('#enquiry-form');if(params.get('purpose')){const notes=f.querySelector('[name=message]');if(notes)notes.value='Travel purpose: '+params.get('purpose');}function message(){const d=Object.fromEntries(new FormData(f));return `Hello Gunina Holidays! I would like to plan a trip.\n\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nDestination: ${d.destination}\nPlaces: ${d.places||'Please suggest'}\nDeparture: ${d.date||'Flexible'}\nTravellers: ${d.travellers}\nService / holiday: ${d.service||'Personalised holiday'}\nNotes: ${d.message||'None'}`};f.onsubmit=e=>{e.preventDefault();location.href='https://wa.me/919222336122?text='+encodeURIComponent(message())};$('#email-enquiry').onclick=()=>{if(f.reportValidity())location.href='mailto:travel@guninaholidays.in?subject='+encodeURIComponent('Travel enquiry — '+$('#enquiry-destination').value)+'&body='+encodeURIComponent(message())}}
$('#chat-toggle').onclick=()=>{$('#chat').hidden=!$('#chat').hidden;if(!$('#chat').hidden)$('#chat-input').focus()};$('#chat-close').onclick=()=>$('#chat').hidden=true;$('#chat-form').onsubmit=e=>{e.preventDefault();const input=$('#chat-input'),q=input.value.trim().toLowerCase(),d=DESTINATIONS.find(x=>q.includes(x.name.toLowerCase()));const p=document.createElement('p');if(d){p.textContent=`Explore ${d.name}: ${d.places.join(', ')}. `;const a=document.createElement('a');a.href='/destinations/'+d.slug+'/';a.textContent='Choose places →';p.append(a)}else{const a=document.createElement('a');a.href=/visa/.test(q)?'/visa/':/hotel|insurance|passport|group/.test(q)?'/services/':/enquir|plan|contact/.test(q)?'/enquiry/':'/destinations/';a.textContent=/visa/.test(q)?'Explore visa assistance →':/hotel|insurance|passport|group/.test(q)?'Explore travel services →':/enquir|plan|contact/.test(q)?'Tell us about your trip →':'Browse destinations and choose your places →';p.append(a)}$('#chat-log').replaceChildren(p);input.value=''};
