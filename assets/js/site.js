/* Gunina Holidays — shared site interactions */
(function(){
  "use strict";

  const menu=document.querySelector(".menu"), nav=document.querySelector(".navlinks");
  if(menu&&nav){
    menu.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      menu.setAttribute("aria-expanded",String(open));
    });
  }

  const qs=new URLSearchParams(location.search);
  const prettify=s=>String(s||"").replace(/[-_]+/g," ").replace(/\b\w/g,m=>m.toUpperCase());

  function setValue(id,value){
    const el=document.getElementById(id);
    if(el && value) el.value=value;
  }

  // Enquiry context works from destination/package/visa/service CTAs.
  const context={
    destination:qs.get("destination")||"",
    package:qs.get("package")||"",
    visa:qs.get("visa")||"",
    service:qs.get("service")||""
  };
  setValue("destination",prettify(context.destination));
  setValue("package",prettify(context.package));
  setValue("visa",prettify(context.visa));
  setValue("service",prettify(context.service));

  const title=document.getElementById("contextTitle");
  const first=context.package||context.destination||context.visa||context.service;
  if(title&&first) title.textContent="Enquiry for "+prettify(first);

  const form=document.getElementById("enquiryForm");
  if(form){
    form.addEventListener("submit",async e=>{
      e.preventDefault();
      const msg=document.getElementById("formMessage");
      const btn=form.querySelector('button[type="submit"]');
      if(!btn) return;
      btn.disabled=true; btn.textContent="Sending…";
      try{
        const r=await fetch("https://api.web3forms.com/submit",{method:"POST",body:new FormData(form)});
        const j=await r.json();
        if(!j.success) throw new Error("Web3Forms rejected the submission");
        if(msg){msg.style.display="block";msg.textContent="Thank you! Your enquiry has been submitted successfully.";}
        form.reset();
        setValue("destination",prettify(context.destination));
        setValue("package",prettify(context.package));
        setValue("visa",prettify(context.visa));
        setValue("service",prettify(context.service));
      }catch(err){
        if(msg){msg.style.display="block";msg.textContent="Sorry, we could not submit your enquiry right now. Please call or WhatsApp us.";}
      }finally{
        btn.disabled=false; btn.textContent="Submit Enquiry";
      }
    });
  }

  // Generic search/filter hooks used by the current static pages.
  function filterInput(id,selector){
    const el=document.getElementById(id);
    if(!el) return;
    el.addEventListener("input",()=>{
      const q=el.value.trim().toLowerCase();
      document.querySelectorAll(selector).forEach(card=>{
        card.style.display=card.textContent.toLowerCase().includes(q)?"":"none";
      });
    });
  }
  filterInput("packageSearch","#packageGrid .card");
  filterInput("visaSearch","#visaGrid .card");

  document.querySelectorAll("[data-filter]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const val=btn.dataset.filter;
      document.querySelectorAll("[data-card]").forEach(card=>{
        card.style.display=(val==="all"||card.dataset.card===val)?"":"none";
      });
    });
  });
})();