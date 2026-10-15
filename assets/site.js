/* My AI Agent Army — site script */
(function(){
"use strict";
document.documentElement.classList.remove("no-js");
var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Squads + bot drawing (shared with factory.js / rivet.js) ---------- */
var SQ = {
  "receptionist":{name:"Receptionist",c:"#0d9488"},
  "customer-service":{name:"Customer Service",c:"#0284c7"},
  "sales":{name:"Sales",c:"#ff5a3c"},
  "marketing":{name:"Marketing",c:"#8b5cf6"},
  "operations":{name:"Operations",c:"#4f46e5"},
  "admin-finance":{name:"Admin & Finance",c:"#d97706"},
  "life":{name:"Your Life",c:"#db2777"}
};
function shade(hex,p){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;function f(v){return Math.max(0,Math.min(255,Math.round(v+(p<0?v:255-v)*p)))}return"#"+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
function bot(color,opt){
  opt=opt||{};var c=color||"#b8bcd3",d=shade(c,-.22),l=shade(c,.35),cmd=opt.cmd,blank=opt.blank;
  var eye=blank?"#5b6182":"#7ef9e4";
  return '<svg class="mbot'+(cmd?' cmd':'')+'" viewBox="0 0 60 70" aria-hidden="true">'+
  '<g class="ant"><line x1="30" y1="15" x2="30" y2="6" stroke="'+d+'" stroke-width="2.5" stroke-linecap="round"/><circle cx="30" cy="5" r="'+(cmd?4:3.2)+'" fill="'+(cmd?"#fbbf24":(blank?"#9aa0bf":"#ff7a5c"))+'"/></g>'+
  '<rect x="6.5" y="24" width="5" height="11" rx="2.5" fill="'+d+'"/><rect x="48.5" y="24" width="5" height="11" rx="2.5" fill="'+d+'"/>'+
  '<rect x="10" y="14" width="40" height="28" rx="10" fill="'+c+'"/><rect x="10" y="14" width="40" height="10" rx="10" fill="'+l+'" opacity=".35"/>'+
  '<rect x="15" y="20" width="30" height="15" rx="7" fill="#151a36"/>'+
  '<g class="eye"><circle cx="24" cy="27.5" r="3.2" fill="'+eye+'"/><circle cx="36" cy="27.5" r="3.2" fill="'+eye+'"/></g>'+
  '<rect x="26" y="41" width="8" height="5" fill="#9aa0bf"/>'+
  '<rect x="11" y="47" width="5" height="13" rx="2.5" fill="'+d+'"/><rect x="44" y="47" width="5" height="13" rx="2.5" fill="'+d+'"/>'+
  '<rect x="16" y="45" width="28" height="21" rx="8" fill="'+d+'"/>'+
  (cmd?'<path d="M30 49.5l1.9 3.9 4.3.6-3.1 3 .7 4.2-3.8-2-3.8 2 .7-4.2-3.1-3 4.3-.6z" fill="#fbbf24"/>':'<circle cx="30" cy="55" r="3" fill="#fff" opacity="'+(blank?.35:.85)+'"/>')+
  '</svg>';
}
var ICONS={
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
 chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 dollar:'<path d="M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.8s2.2 3 5 3.7 5 1.6 5 3.8-2.2 3.2-5 3.2-5-1.1-5-3"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1.5 1.5 0 001.5 1.1h9.2a1.5 1.5 0 001.5-1.2L22 7H6"/>',
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 doc:'<path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
 megaphone:'<path d="M3 11v2a1 1 0 001 1h3l9 5V5L7 10H4a1 1 0 00-1 1zM20 9a3 3 0 010 6M7 14l1.5 5h3L10 15"/>',
 heart:'<path d="M12 21s-7.5-4.6-9.5-9.3C1 7.9 3.3 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.5 0 5.8 3.4 4.3 7.2C19.5 16.4 12 21 12 21z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 brain:'<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 003 3h1V4zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3h-1V4z"/>',
 check:'<path d="M5 12l5 5L20 7"/>'
};
function icon(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||ICONS.bolt)+'</svg>';}
window.MAA={SQ:SQ,bot:bot,icon:icon,shade:shade,RM:RM};

document.querySelectorAll("[data-icon]").forEach(function(el){el.innerHTML=icon(el.getAttribute("data-icon"));});
document.querySelectorAll("[data-bot]").forEach(function(el){var s=SQ[el.getAttribute("data-bot")];el.innerHTML=bot(s?s.c:el.getAttribute("data-color"),{cmd:el.hasAttribute("data-cmd")});});

/* ---------- Nav ---------- */
var burger=document.querySelector(".burger"),nav=document.querySelector(".nav"),scrim=document.querySelector(".nav-scrim");
function setNav(o){if(!nav)return;nav.classList.toggle("open",o);burger&&burger.setAttribute("aria-expanded",o?"true":"false");scrim&&scrim.classList.toggle("on",o);document.body.style.overflow=o?"hidden":"";document.body.classList.toggle("navopen",o);}
burger&&burger.addEventListener("click",function(){setNav(!nav.classList.contains("open"));});
scrim&&scrim.addEventListener("click",function(){setNav(false);});
document.querySelectorAll(".nav__dd>button").forEach(function(b){b.addEventListener("click",function(e){var dd=b.parentNode,o=!dd.classList.contains("open");document.querySelectorAll(".nav__dd.open").forEach(function(x){if(x!==dd)x.classList.remove("open")});dd.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");e.stopPropagation();});});
document.addEventListener("click",function(e){if(!e.target.closest(".nav__dd"))document.querySelectorAll(".nav__dd.open").forEach(function(x){x.classList.remove("open")});});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){setNav(false);document.querySelectorAll(".nav__dd.open").forEach(function(x){x.classList.remove("open")});}});

/* ---------- Email assembly ---------- */
function d64(s){try{return atob(s)}catch(e){return""}}
document.querySelectorAll(".eml").forEach(function(a){var u=d64(a.getAttribute("data-u")||""),d=d64(a.getAttribute("data-d")||"");if(!u||!d)return;var e=u+String.fromCharCode(64)+d;a.setAttribute("href","mai"+"lto:"+e);if(!a.textContent.trim())a.textContent=e;});

/* ---------- Reveal ---------- */
var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}});},{rootMargin:"0px 0px -8% 0px"}):null;
document.querySelectorAll(".reveal").forEach(function(el){
  var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
  el.style.transitionDelay=Math.min(sib,6)*70+"ms";
  if(io&&!RM)io.observe(el);else el.classList.add("in");
});

/* ---------- Count-up ---------- */
function fmt(v,dec){return dec?v.toFixed(dec):Math.round(v).toLocaleString("en-US");}
function countUp(el){
  var t=parseFloat(el.getAttribute("data-count"));if(isNaN(t))return;
  var dec=parseInt(el.getAttribute("data-decimals")||(String(t).split(".")[1]||"").length,10)||0,
      pre=el.getAttribute("data-prefix")||"",suf=el.getAttribute("data-suffix")||"";
  if(RM){el.textContent=pre+fmt(t,dec)+suf;return;}
  var s=null,dur=1400;
  function step(ts){if(!s)s=ts;var p=Math.min(1,(ts-s)/dur),e=1-Math.pow(1-p,3);el.textContent=pre+fmt(t*e,dec)+suf;if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
var cio=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){countUp(en.target);cio.unobserve(en.target);}});},{threshold:.4}):null;
document.querySelectorAll("[data-count]").forEach(function(el){cio?cio.observe(el):countUp(el);});

/* ---------- Flow pipelines ---------- */
document.querySelectorAll(".flow[data-steps]").forEach(function(f){
  var steps;try{steps=JSON.parse(f.getAttribute("data-steps"))}catch(e){return}
  var n=steps.length;if(!n)return;
  var h='<div class="flow__track" role="list"><div class="flow__line" style="left:'+(50/n)+'%;right:'+(50/n)+'%"><i></i></div><span class="flow__packet"></span>';
  steps.forEach(function(s,i){h+='<div class="flow__step" role="listitem"><div class="flow__dot">'+(i+1)+'</div><div class="flow__txt"></div></div>';});
  f.innerHTML=h+'</div>';
  f.querySelectorAll(".flow__txt").forEach(function(t,i){t.textContent=steps[i];});
  var els=f.querySelectorAll(".flow__step"),fill=f.querySelector(".flow__line i"),pk=f.querySelector(".flow__packet"),i=0,tm=null,mob=function(){return window.innerWidth<=700};
  function paint(k){els.forEach(function(e,j){e.classList.toggle("on",j<=k)});var p=n>1?k/(n-1)*100:100;if(mob()){fill.style.height=p+"%";fill.style.width="100%"}else{fill.style.width=p+"%";fill.style.height=""}pk.style.left=((k+.5)/n*100)+"%";}
  function tick(){paint(i);i++;if(i>=n){i=0;tm=setTimeout(function(){els.forEach(function(e){e.classList.remove("on")});fill.style.width="0";fill.style.height="0";pk.style.left=(50/n)+"%";tm=setTimeout(tick,900);},2600);}else tm=setTimeout(tick,1300);}
  if(RM){paint(n-1);return;}
  var o=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){if(!tm)tick();}else{clearTimeout(tm);tm=null;}});},{threshold:.35});o.observe(f);
});

/* ---------- Charts (HTML bars/columns + SVG line) ---------- */
var tip=document.createElement("div");tip.className="tip";tip.setAttribute("role","tooltip");document.body.appendChild(tip);
function showTip(e,txt){tip.textContent=txt;tip.classList.add("on");var x=e.clientX+14,y=e.clientY-38;if(x+250>window.innerWidth)x=e.clientX-250;tip.style.left=x+"px";tip.style.top=Math.max(8,y)+"px";}
function hideTip(){tip.classList.remove("on");}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var COLORS=["#4f46e5","#0d9488","#ff5a3c","#8b5cf6","#d97706","#0284c7"];
document.querySelectorAll(".chart[data-values]").forEach(function(ch,ci){
  var vals;try{vals=JSON.parse(ch.getAttribute("data-values"))}catch(e){return}
  var type=ch.getAttribute("data-type")||"bar",unit=ch.getAttribute("data-unit")||"",title=ch.getAttribute("data-title")||"",src=ch.getAttribute("data-source")||"",href=ch.getAttribute("data-href")||"";
  var max=Math.max.apply(null,vals.map(function(v){return +v[1]}));
  var top=unit==="%"?Math.max(100,max):max*1.12;
  var col=ch.getAttribute("data-color")||COLORS[ci%COLORS.length];
  function vfmt(v){v=+v;var s=(Math.abs(v)>=1000?Math.round(v).toLocaleString("en-US"):String(v));return unit==="%"?s+"%":(unit==="$"?"$"+s:(unit?s+" "+unit:s));}
  var h='<p class="chart__t">'+esc(title)+'</p>',body="";
  if(type==="column"){
    body='<div class="cols" style="display:flex;align-items:flex-end;gap:14px;height:240px;padding:24px 4px 0;border-bottom:1px solid #d7dae8;background:repeating-linear-gradient(180deg,transparent 0 59px,#eceef6 59px 60px)">';
    vals.forEach(function(v){body+='<div class="colw" style="flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;position:relative" data-tip="'+esc(v[0]+": "+vfmt(v[1]))+'"><span style="font:650 .9rem var(--f-d);color:var(--ink);margin-bottom:6px">'+esc(vfmt(v[1]))+'</span><i class="cb" style="display:block;width:min(64px,80%);height:0;border-radius:6px 6px 0 0;background:linear-gradient(180deg,'+shade(col,.25)+','+col+');transition:height 1.1s cubic-bezier(.2,.8,.2,1)" data-h="'+(Math.max(0.6,+v[1]/top*100))+'"></i></div>';});
    body+='</div><div style="display:flex;gap:14px;padding:8px 4px 0">';
    vals.forEach(function(v){body+='<div style="flex:1;text-align:center;font:500 .8rem/1.3 var(--f-ui);color:var(--ink-2)">'+esc(v[0])+'</div>';});
    body+='</div>';
  }else{
    body='<div class="bars">';
    vals.forEach(function(v){body+='<div class="br" style="display:grid;grid-template-columns:minmax(110px,38%) 1fr;gap:12px;align-items:center;margin:10px 0" data-tip="'+esc(v[0]+": "+vfmt(v[1]))+'"><span style="font:500 .9rem/1.3 var(--f-ui);color:var(--ink-2)">'+esc(v[0])+'</span><span style="display:flex;align-items:center;gap:8px"><span style="flex:1;height:22px;background:#f0f1f8;border-radius:4px;overflow:hidden"><i class="bb" style="display:block;height:100%;width:0;border-radius:0 4px 4px 0;background:linear-gradient(90deg,'+shade(col,.2)+','+col+');transition:width 1.1s cubic-bezier(.2,.8,.2,1)" data-w="'+(Math.max(0.6,+v[1]/top*100))+'"></i></span><b style="font:650 .9rem var(--f-d);min-width:58px;text-align:right">'+esc(vfmt(v[1]))+'</b></span></div>';});
    body+='</div>';
  }
  var tbl='<table hidden><thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>'+vals.map(function(v){return'<tr><td>'+esc(v[0])+'</td><td>'+esc(vfmt(v[1]))+'</td></tr>'}).join("")+'</tbody></table>';
  h+=body+tbl+'<div class="chart__src"><span>Source: '+(href?'<a href="'+esc(href)+'" target="_blank" rel="noopener">'+esc(src)+'</a>':esc(src))+'</span><button type="button">View as table</button></div>';
  ch.innerHTML=h;ch.setAttribute("role","figure");ch.setAttribute("aria-label",title);
  ch.querySelector(".chart__src button").addEventListener("click",function(){var t=ch.querySelector("table");t.hidden=!t.hidden;this.textContent=t.hidden?"View as table":"Hide table";});
  ch.querySelectorAll("[data-tip]").forEach(function(r){r.addEventListener("mousemove",function(e){showTip(e,r.getAttribute("data-tip"))});r.addEventListener("mouseleave",hideTip);});
  function grow(){ch.querySelectorAll(".bb").forEach(function(b){b.style.width=b.getAttribute("data-w")+"%"});ch.querySelectorAll(".cb").forEach(function(b){b.style.height=b.getAttribute("data-h")+"%"});}
  if(RM||!("IntersectionObserver" in window))grow();else{var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){grow();o.disconnect();}},{threshold:.3});o.observe(ch);}
});
window.MAA.showTip=showTip;window.MAA.hideTip=hideTip;

/* ---------- Line chart (data-lines) ---------- */
document.querySelectorAll(".chart[data-lines]").forEach(function(ch){
  var cfg;try{cfg=JSON.parse(ch.getAttribute("data-lines"))}catch(e){return}
  var W=900,H=400,L=70,R=20,T=24,B=50,xs=cfg.x,series=cfg.series,ymax=0;
  series.forEach(function(s){s.v.forEach(function(v){if(v>ymax)ymax=v})});
  ymax=Math.ceil(ymax*1.1/2000)*2000||1;
  function X(i){return L+(W-L-R)*i/(xs.length-1)}function Y(v){return T+(H-T-B)*(1-v/ymax)}
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(cfg.title)+'">';
  for(var g=0;g<=4;g++){var gv=ymax*g/4;s+='<line class="grid-l" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(gv)+'" y2="'+Y(gv)+'"/><text class="lbl" x="'+(L-8)+'" y="'+(Y(gv)+4)+'" text-anchor="end" style="font-size:14px">$'+Math.round(gv/1000)+'k</text>';}
  xs.forEach(function(x,i){if(i%cfg.every===0)s+='<text class="lbl" x="'+X(i)+'" y="'+(H-18)+'" text-anchor="middle" style="font-size:14px">'+esc(x)+'</text>';});
  s+='<text class="lbl" x="'+((L+W-R)/2)+'" y="'+(H-1)+'" text-anchor="middle" style="font-size:13px">'+esc(cfg.xlabel||"")+'</text>';
  series.forEach(function(se,k){var d=se.v.map(function(v,i){return(i?"L":"M")+X(i).toFixed(1)+" "+Y(v).toFixed(1)}).join(" ");s+='<path class="ln" d="'+d+'" fill="none" stroke="'+se.c+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s ease '+(k*.3)+'s"/>';});
  if(cfg.mark){s+='<line x1="'+X(cfg.mark.i)+'" x2="'+X(cfg.mark.i)+'" y1="'+T+'" y2="'+(H-B)+'" stroke="#9aa0bf" stroke-dasharray="4 4"/><text x="'+(X(cfg.mark.i)+6)+'" y="'+(T+14)+'" class="val" style="font-size:14px">'+esc(cfg.mark.t)+'</text>';}
  s+='<line class="axis" x1="'+L+'" x2="'+(W-R)+'" y1="'+(H-B)+'" y2="'+(H-B)+'"/><rect class="hit" x="'+L+'" y="'+T+'" width="'+(W-L-R)+'" height="'+(H-T-B)+'" fill="transparent"/><line class="cross" x1="0" x2="0" y1="'+T+'" y2="'+(H-B)+'" stroke="#121733" stroke-opacity=".25" style="display:none"/></svg>';
  var leg='<div class="legend">'+series.map(function(se){return'<span><i style="background:'+se.c+'"></i>'+esc(se.n)+'</span>'}).join("")+'</div>';
  var tbl='<table hidden><thead><tr><th>'+esc(cfg.xlabel||"")+'</th>'+series.map(function(se){return'<th>'+esc(se.n)+'</th>'}).join("")+'</tr></thead><tbody>'+xs.map(function(x,i){return i%cfg.every===0?'<tr><td>'+esc(x)+'</td>'+series.map(function(se){return'<td>$'+Math.round(se.v[i]).toLocaleString("en-US")+'</td>'}).join("")+'</tr>':''}).join("")+'</tbody></table>';
  ch.innerHTML='<p class="chart__t">'+esc(cfg.title)+'</p>'+leg+s+tbl+'<div class="chart__src"><span>'+esc(cfg.note||"")+'</span><button type="button">View as table</button></div>';
  ch.querySelector(".chart__src button").addEventListener("click",function(){var t=ch.querySelector("table");t.hidden=!t.hidden;this.textContent=t.hidden?"View as table":"Hide table";});
  var svg=ch.querySelector("svg"),cross=svg.querySelector(".cross");
  svg.querySelector(".hit").addEventListener("mousemove",function(e){var r=svg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,i=Math.round((px-L)/(W-L-R)*(xs.length-1));i=Math.max(0,Math.min(xs.length-1,i));cross.setAttribute("x1",X(i));cross.setAttribute("x2",X(i));cross.style.display="";showTip(e,xs[i]+" — "+series.map(function(se){return se.n+": $"+Math.round(se.v[i]).toLocaleString("en-US")}).join(" · "));});
  svg.querySelector(".hit").addEventListener("mouseleave",function(){cross.style.display="none";hideTip();});
  function go(){svg.querySelectorAll(".ln").forEach(function(p){p.style.strokeDashoffset="0"})}
  if(RM)go();else{var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){go();o.disconnect()}},{threshold:.3});o.observe(ch);}
});

/* ---------- Home: assembly line ---------- */
var fv=document.querySelector("[data-fv]");
if(fv){
  var ROLES=[["Receptionist","receptionist"],["Follow-Up","sales"],["Reviews","marketing"],["Inbox","operations"],["Support","customer-service"],["Invoices","admin-finance"],["Scheduler","operations"],["Social","marketing"],["Life Admin","life"]];
  var bay=fv.querySelector(".fv__bay"),arm=fv.querySelector(".fv__arm"),spark=fv.querySelector(".fv__spark"),cnt=fv.querySelector(".fv__count b"),built=0,k=0,running=false,visible=false;
  for(var si=0;si<9;si++){var sl=document.createElement("div");sl.className="fv__slot";bay.appendChild(sl);}
  var slots=bay.querySelectorAll(".fv__slot");
  function fillSlot(idx,r){slots[idx].innerHTML=bot(SQ[r[1]].c)+'<small>'+r[0]+'</small>';}
  if(RM){ROLES.forEach(function(r,i){fillSlot(i,r)});cnt.textContent="9";}
  else{
    var one=function(){
      if(!visible){running=false;return;}running=true;
      var idx=k%9,r=ROLES[idx];
      if(idx===0&&k>0){slots.forEach(function(s){s.innerHTML=""});}
      var fr=fv.getBoundingClientRect(),b=document.createElement("div");b.className="fv__bot";b.innerHTML=bot(null,{blank:true})+'<span class="fv__tag">'+r[0]+'</span>';fv.appendChild(b);
      var stampX=fr.width*(parseFloat(getComputedStyle(arm).left)/fr.width)-29;
      var a1=b.animate([{transform:"translateX(-70px)"},{transform:"translateX("+stampX+"px)"}],{duration:2000,easing:"cubic-bezier(.4,0,.3,1)",fill:"forwards"});
      a1.onfinish=function(){
        arm.classList.add("stamp");
        setTimeout(function(){spark.classList.remove("on");void spark.offsetWidth;spark.classList.add("on");b.innerHTML=bot(SQ[r[1]].c)+'<span class="fv__tag">'+r[0]+'</span>';b.classList.add("done");},300);
        setTimeout(function(){arm.classList.remove("stamp");},620);
        setTimeout(function(){
          var br=b.getBoundingClientRect(),sr=slots[idx].getBoundingClientRect();
          var dx=(sr.left+sr.width/2)-(br.left+br.width/2),dy=(sr.top+sr.height/2-6)-(br.top+br.height/2),bx=stampX;
          var a2=b.animate([{transform:"translate("+bx+"px,0) scale(1)"},{transform:"translate("+(bx+dx/2)+"px,"+(Math.min(dy,0)-60)+"px) scale(.85)"},{transform:"translate("+(bx+dx)+"px,"+dy+"px) scale(.62)"}],{duration:1100,easing:"ease-in-out",fill:"forwards"});
          a2.onfinish=function(){b.remove();fillSlot(idx,r);built++;cnt.textContent=built;k++;setTimeout(one,idx===8?2600:350);};
        },1100);
      };
    };
    new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible&&!running)one();},{threshold:.2}).observe(fv);
  }
}

/* ---------- Home: day timeline ---------- */
var day=document.querySelector("[data-day]");
if(day){
  var T0=8,SPAN=10;
  var tasks=[[8,.75,"Inbox sorting","agent"],[8.75,.5,"Return missed calls","agent"],[9.25,1.25,"Client work","work"],[10.5,1,"Draft quotes","agent"],[11.5,.5,"Approve quotes","work"],[12,1,"Lunch keeps getting interrupted","agent"],[13,.75,"Chase new leads","agent"],[13.75,1.75,"Client work","work"],[15.5,.5,"Ask for reviews","agent"],[16,.75,"Shuffle the schedule","agent"],[16.75,.5,"Plan tomorrow","work"],[17.25,.75,"Invoices and reminders","agent"]];
  var you=day.querySelector('[data-lane="you"]'),ag=day.querySelector('[data-lane="agents"]'),back=day.querySelector(".day__back b"),btns=day.querySelectorAll(".toggle button");
  var blks=[];
  tasks.forEach(function(t){var b=document.createElement("div");b.className="day__blk "+(t[3]==="agent"?"k-busy":"k-work");b.style.left=((t[0]-T0)/SPAN*100)+"%";b.style.width="calc("+(t[1]/SPAN*100)+"% - 3px)";b.textContent=t[2];b.title=t[2];you.appendChild(b);blks.push([b,t]);});
  var frees=[];
  function mode(withA){
    btns.forEach(function(x){x.setAttribute("aria-pressed",String((x.getAttribute("data-m")==="with")===withA))});
    var hrs=0,laneGap=ag.getBoundingClientRect().top-you.getBoundingClientRect().top;
    frees.forEach(function(f){f.remove()});frees=[];
    blks.forEach(function(p){var b=p[0],t=p[1];if(t[3]==="agent"){if(withA){b.style.transform="translateY("+laneGap+"px)";b.className="day__blk k-agent";hrs+=t[1];var f=document.createElement("div");f.className="day__blk k-free";f.style.left=b.style.left;f.style.width=b.style.width;f.textContent="Yours";f.style.opacity="0";you.appendChild(f);frees.push(f);setTimeout(function(){f.style.opacity="1"},450);}else{b.style.transform="";b.className="day__blk k-busy";}}});
    var start=parseFloat(back.textContent)||0,end=hrs,s=null;
    if(RM){back.textContent=end.toFixed(1);return;}
    requestAnimationFrame(function st(ts){if(!s)s=ts;var p=Math.min(1,(ts-s)/700);back.textContent=(start+(end-start)*p).toFixed(1);if(p<1)requestAnimationFrame(st);});
  }
  btns.forEach(function(x){x.addEventListener("click",function(){mode(x.getAttribute("data-m")==="with")})});
  window.addEventListener("resize",function(){var w=day.querySelector('[aria-pressed="true"]');if(w&&w.getAttribute("data-m")==="with")mode(true);});
  if(!RM){var dio=new IntersectionObserver(function(es){if(es[0].isIntersecting){setTimeout(function(){mode(true)},900);dio.disconnect();}},{threshold:.5});dio.observe(day);}
}

/* ---------- TOC highlight ---------- */
var toc=document.querySelector(".toc");
if(toc&&"IntersectionObserver" in window){var links={};toc.querySelectorAll("a").forEach(function(a){links[a.getAttribute("href").slice(1)]=a});
  var tio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){toc.querySelectorAll("a.on").forEach(function(x){x.classList.remove("on")});var a=links[en.target.id];a&&a.classList.add("on");}})},{rootMargin:"-20% 0px -70% 0px"});
  document.querySelectorAll(".prose h2[id]").forEach(function(h){tio.observe(h)});}

/* ---------- Forms (hardened) ---------- */
var t0=Date.now();
document.querySelectorAll("form[data-fs]").forEach(function(f){
  var human=false;["keydown","pointerdown","touchstart"].forEach(function(ev){f.addEventListener(ev,function(){human=true},{passive:true})});
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var msg=f.querySelector(".form__msg"),btn=f.querySelector("button[type=submit]");
    var hp=f.querySelector('[name="_honey"]');
    if((hp&&hp.value)||!human){msg.className="form__msg ok";msg.textContent="Thanks — your request is on its way.";f.reset();return;}
    if(!f.checkValidity()){f.reportValidity();return;}
    var wait=Math.max(0,4000-(Date.now()-t0));
    btn.disabled=true;var bt=btn.textContent;btn.textContent="Sending…";
    if(typeof window.MAA.beforeSubmit==="function")window.MAA.beforeSubmit(f);
    setTimeout(function(){
      var to=d64(f.getAttribute("data-k1"))+String.fromCharCode(64)+d64(f.getAttribute("data-k2"));
      var fd=new FormData(f);
      fetch("https://formsubmit.co/ajax/"+to,{method:"POST",headers:{"Accept":"application/json"},body:fd}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,j:j}})}).then(function(res){
        var s=String(res.j.success);
        if(res.ok&&s==="true"){msg.className="form__msg ok";msg.textContent="Got it. A real person will reach out within one business day. Want to talk sooner? Call 1-800-481-8638.";f.reset();}
        else if(res.j&&res.j.message&&/activat|confirm/i.test(res.j.message)){msg.className="form__msg warn";msg.textContent="Your message was sent, but we couldn't confirm it reached our inbox. To be safe, please also call 1-800-481-8638.";}
        else throw new Error("fail");
      }).catch(function(){msg.className="form__msg err";msg.textContent="Something blocked the send. Please call 1-800-481-8638 and we'll take care of you right away.";}).then(function(){btn.disabled=false;btn.textContent=bt;});
    },wait);
  });
});

/* ---------- Year ---------- */
document.querySelectorAll("[data-year]").forEach(function(y){y.textContent=new Date().getFullYear()});
})();
