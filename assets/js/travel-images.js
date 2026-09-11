/* Gunina Holidays — reliable destination photo resolver
   Keeps the existing destination/visa information untouched.
   Every card gets a real travel photograph immediately via a stable keyword
   photo fallback, then upgrades to a more specific Wikimedia Commons/Wikipedia
   photo when the browser can reach the public API. */
(function(){
  "use strict";

  const cacheKey="gunina-photo-cache-v4";
  const memory={};
  const aliases={
    "Bali / Indonesia":"Bali Indonesia tourism",
    "Dubai / UAE":"Dubai United Arab Emirates tourism",
    "Turkey":"Türkiye tourism",
    "Türkiye":"Türkiye tourism",
    "USA":"United States tourism",
    "United Kingdom":"United Kingdom tourism",
    "New Zealand":"New Zealand tourism",
    "South Korea":"South Korea tourism",
    "North Macedonia":"North Macedonia tourism",
    "Bosnia & Herzegovina":"Bosnia and Herzegovina tourism",
    "Czech Republic":"Czechia tourism",
    "Belgium & Luxembourg":"Belgium Luxembourg tourism",
    "Mauritius & Reunion":"Mauritius Réunion tourism",
    "Mauritius / Reunion":"Mauritius Réunion tourism",
    "European Capitals":"European capitals travel",
    "Balkan Europe":"Balkans Europe tourism",
    "Central Europe":"Central Europe tourism",
    "East Asia":"East Asia tourism",
    "Southeast Asia":"Southeast Asia tourism",
    "Japan Alps":"Japanese Alps tourism",
    "Nordic Countries":"Nordic countries tourism",
    "Slovenia Alps":"Slovenian Alps tourism",
    "Netherlands Tulip":"Netherlands tulip tourism"
  };

  function clean(v){
    return String(v||"").replace(/[\/#?&%]+/g," ").replace(/\s+/g," ").trim();
  }
  function queryName(name){
    const n=clean(name);
    return aliases[n] || (n + " tourism");
  }
  function hash(s){
    let h=2166136261;
    for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
    return (h>>>0);
  }
  function fallback(name){
    const q=encodeURIComponent(queryName(name)+",travel,landmark");
    return `https://loremflickr.com/1200/800/${q}?lock=${hash(name)}`;
  }
  function loadCache(){
    try{return JSON.parse(sessionStorage.getItem(cacheKey)||"{}")}catch(e){return {}}
  }
  const stored=loadCache();
  Object.keys(stored).forEach(k=>memory[k]=stored[k]);

  function saveCache(){
    try{sessionStorage.setItem(cacheKey,JSON.stringify(memory))}catch(e){}
  }

  async function wikiPhoto(name){
    const title=encodeURIComponent(queryName(name));
    const url=`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=1200&redirects=1&titles=${title}`;
    const r=await fetch(url,{mode:"cors",credentials:"omit"});
    if(!r.ok) throw new Error("wiki request failed");
    const j=await r.json();
    const pages=j?.query?.pages||{};
    const page=Object.values(pages)[0];
    const src=page?.thumbnail?.source||"";
    if(!src || /\.svg(?:[?#]|$)/i.test(src)) throw new Error("no usable photo");
    return src;
  }

  function setImage(img,name,url){
    if(!img || !url) return;
    img.dataset.travelPhotoName=name;
    img.src=url;
    img.loading="lazy";
    img.decoding="async";
    img.referrerPolicy="no-referrer";
    img.onerror=function(){
      if(this.dataset.photoFallbackUsed==="1") return;
      this.dataset.photoFallbackUsed="1";
      this.src=fallback(name);
    };
  }

  async function resolve(name){
    const key=clean(name);
    if(!key) return "";
    if(memory[key]) return memory[key];
    const fb=fallback(key);
    try{
      const src=await wikiPhoto(key);
      memory[key]=src; saveCache();
      return src;
    }catch(e){
      memory[key]=fb; saveCache();
      return fb;
    }
  }

  function wireImages(root){
    (root||document).querySelectorAll("img[data-travel-photo]").forEach(async img=>{
      const name=img.getAttribute("data-travel-photo");
      const immediate=memory[name]||fallback(name);
      setImage(img,name,immediate);
      const better=await resolve(name);
      if(better && better!==img.src) setImage(img,name,better);
    });
  }

  window.GUNINA_TRAVEL_IMAGES={
    fallback,
    resolve,
    setImage,
    wireImages
  };
})();
