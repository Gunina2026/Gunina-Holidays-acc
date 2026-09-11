/* Gunina Holidays — unified travel image system
 * Replaces placeholder SVG covers with real travel imagery where available.
 * Images are sourced at runtime from Wikimedia's public API; no API key is required.
 */
(function(){
  "use strict";
  const API="https://en.wikipedia.org/w/api.php";
  const GENERIC="https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1400&q=82";
  const FALLBACKS={
    "Europe":"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=82",
    "Asia":"https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1400&q=82",
    "East Asia":"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=82",
    "South Asia":"https://images.unsplash.com/photo-1711389552655-9230667c6338?auto=format&fit=crop&w=1400&q=82",
    "Southeast Asia":"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1400&q=82",
    "Middle East":"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=82",
    "Africa":"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=82",
    "Americas":"https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1400&q=82",
    "Oceania":"https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=82",
    "Caucasus & Central Asia":"https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1400&q=82"
  };
  const alias={
    "Bali / Indonesia":"Bali", "Dubai / UAE":"Dubai", "USA":"United States",
    "UK":"United Kingdom", "United States of America":"United States",
    "Türkiye":"Turkey", "Czech Republic":"Czech Republic", "South Korea":"South Korea",
    "Vietnam":"Vietnam", "Laos":"Laos", "UAE":"United Arab Emirates",
    "Côte d’Ivoire":"Ivory Coast", "Cabo Verde":"Cape Verde",
    "Congo, Democratic Republic of the":"Democratic Republic of the Congo",
    "Congo, Republic of the":"Republic of the Congo", "Eswatini":"Eswatini",
    "Micronesia":"Federated States of Micronesia", "Palestine":"State of Palestine",
    "Vatican City":"Vatican City"
  };
  const cache={};
  try{Object.assign(cache,JSON.parse(sessionStorage.getItem("guninaTravelImages")||"{}"));}catch(e){}
  const save=()=>{try{sessionStorage.setItem("guninaTravelImages",JSON.stringify(cache));}catch(e){}};

  function clean(v){ return String(v||"").replace(/\s+/g," ").trim(); }
  function titleFor(name){ const n=clean(name); return alias[n]||n; }
  function sourceIsPhoto(src){
    if(!src) return false;
    const s=src.toLowerCase();
    if(/\.(svg)(\?|$)/.test(s)) return false;
    if(/flag_of_|flag-|coat_of_arms|logo|map_of_|location_map/.test(s)) return false;
    return /\.(jpg|jpeg|png|webp)(\?|$)/.test(s) || s.includes("thumb.wikimedia.org");
  }

  async function fetchBatch(names){
    const unique=[...new Set(names.map(clean).filter(Boolean))];
    const need=unique.filter(n=>!cache[n]);
    if(!need.length) return cache;
    // 25 countries x 2 candidate pages = 50 titles per request.
    for(let i=0;i<need.length;i+=25){
      const part=need.slice(i,i+25);
      const titles=[];
      part.forEach(n=>{ const t=titleFor(n); titles.push("Tourism in "+t,t); });
      const params=new URLSearchParams({action:"query",format:"json",origin:"*",prop:"pageimages",piprop:"thumbnail",pithumbsize:"1400",titles:titles.join("|")});
      try{
        const r=await fetch(API+"?"+params.toString(),{mode:"cors",credentials:"omit"});
        if(!r.ok) throw new Error("image API "+r.status);
        const j=await r.json();
        const pages=Object.values(j?.query?.pages||{});
        for(const n of part){
          const target=titleFor(n);
          const candidates=pages.filter(p=>p.thumbnail?.source && (p.title===`Tourism in ${target}` || p.title===target));
          // Prefer a real travel thumbnail from the Tourism article.
          let hit=candidates.find(p=>p.title===`Tourism in ${target}` && sourceIsPhoto(p.thumbnail.source));
          if(!hit) hit=candidates.find(p=>sourceIsPhoto(p.thumbnail.source));
          cache[n]=hit?.thumbnail?.source||null;
        }
      }catch(e){
        // Leave unresolved names null; the deterministic fallbacks below keep every card visual.
        part.forEach(n=>{if(!(n in cache)) cache[n]=null;});
      }
    }
    save();
    return cache;
  }

  function fallback(name,region){
    return FALLBACKS[region]||GENERIC;
  }

  async function resolve(items){
    const names=items.map(x=>typeof x==="string"?x:(x.name||x.country||x.slug||""));
    await fetchBatch(names);
    const out={};
    items.forEach(item=>{
      const name=typeof item==="string"?item:(item.name||item.country||item.slug||"");
      const region=typeof item==="object"?item.region:"";
      out[name]=cache[name]||fallback(name,region);
    });
    return out;
  }

  window.GUNINA_TRAVEL_IMAGES={
    resolveMany:resolve,
    fallback,
    get(name,region,current){ return cache[name]||((current&&/^https?:\/\//i.test(current))?current:fallback(name,region)); },
    preload:fetchBatch
  };
})();
