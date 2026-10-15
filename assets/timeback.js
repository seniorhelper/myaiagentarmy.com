/* Time-Back Calculator */
(function(){
"use strict";
var root=document.getElementById("timeback");if(!root)return;
var TASKS=[
 ["Answering and returning calls",5,60,"ai-receptionist","AI Receptionist"],
 ["Replying to new leads and following up",4,60,"lead-responder","Speed-to-Lead Responder"],
 ["Email and inbox sorting",6,50,"inbox-triage","Inbox Triage Agent"],
 ["Scheduling and rescheduling",3,60,"scheduler","Scheduling & Dispatch Agent"],
 ["Writing quotes and proposals",3,40,"quote-drafter","Quote Drafting Agent"],
 ["Review requests and social posts",2,70,"review-requester","Review Request Agent"],
 ["Invoices and payment reminders",2,60,"invoice-chaser","Invoice Reminder Agent"],
 ["Data entry and paperwork",3,50,"doc-processor","Document Intake Agent"],
 ["Personal admin (bills, forms, appointments)",2,50,"life-admin","Life Admin Agent"]
];
var list=root.querySelector(".tasks"),rate=root.querySelector("#rate"),rateO=root.querySelector("#rateO");
function paint(r){var p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty("--p",p+"%")}
TASKS.forEach(function(t,i){
  var d=document.createElement("div");d.className="task";
  d.innerHTML='<div class="task__top"><h4></h4><span class="tier tier--scout"></span></div>'+
  '<div class="sl"><span>Hours per week</span><input type="range" min="0" max="20" step="0.5" value="'+t[1]+'" data-h="'+i+'" aria-label="Hours per week"><output>'+t[1]+' h</output></div>'+
  '<div class="sl"><span>An agent could handle</span><input type="range" min="0" max="90" step="5" value="'+t[2]+'" data-p="'+i+'" aria-label="Share an agent could handle"><output>'+t[2]+'%</output></div>';
  d.querySelector("h4").textContent=t[0];d.querySelector(".tier").textContent=t[4];
  d.querySelectorAll('input[type=range]').forEach(function(r){r.setAttribute("aria-label",r.getAttribute("aria-label")+": "+t[0]);});
  list.appendChild(d);
});
var big=root.querySelector(".result__big span"),yr=root.querySelector("[data-yr]"),wk=root.querySelector("[data-wk]"),val=root.querySelector("[data-val]"),mB=root.querySelector("[data-mb]"),mA=root.querySelector("[data-ma]"),mBt=root.querySelector("[data-mbt]"),mAt=root.querySelector("[data-mat]"),fun=root.querySelector(".fun"),sug=root.querySelector("[data-sug]"),go=root.querySelector("[data-go]");
function upd(){
  var tot=0,back=0,picks=[];
  root.querySelectorAll("[data-h]").forEach(function(r){var i=+r.dataset.h,h=+r.value,p=+root.querySelector('[data-p="'+i+'"]').value/100;tot+=h;back+=h*p;if(h*p>=1)picks.push([h*p,TASKS[i]]);});
  root.querySelectorAll('input[type=range]').forEach(function(r){paint(r);var o=r.nextElementSibling;if(o&&o.tagName==="OUTPUT")o.textContent=r.dataset.p!==undefined?r.value+"%":(r.id==="rate"?"":r.value+" h");});
  var y=back*50,dollars=y*(+rate.value);rateO.textContent="$"+rate.value+"/hr";
  big.textContent=back.toFixed(1);yr.textContent=Math.round(y).toLocaleString("en-US");wk.textContent=(y/40).toFixed(1);val.textContent="$"+Math.round(dollars).toLocaleString("en-US");
  var mx=Math.max(tot,1);mB.style.width=(tot/mx*100)+"%";mA.style.width=((tot-back)/mx*100)+"%";mBt.textContent=tot.toFixed(1)+" h/wk";mAt.textContent=(tot-back).toFixed(1)+" h/wk";
  fun.innerHTML='<li><b>'+Math.floor(y/8)+'</b> full 8-hour Saturdays a year</li><li><b>'+Math.floor(y/2)+'</b> two-hour dinners with people you love</li><li><b>'+Math.floor(y/4.5)+'</b> rounds of golf, hikes or long rides</li><li><b>'+Math.floor(back*60/30)+'</b> extra 30-minute blocks every week to work <em>on</em> the business</li>';
  picks.sort(function(a,b){return b[0]-a[0]});
  sug.innerHTML=picks.slice(0,3).map(function(p){return'<li><span><i style="background:#0d9488"></i><span>'+p[1][4]+'</span></span><b>'+p[0].toFixed(1)+' h/wk</b></li>'}).join("")||'<li><span>Slide a few hours in to see suggestions</span></li>';
  var ids=picks.slice(0,3).map(function(p){return p[1][3]});
  go.setAttribute("href","/factory/"+(ids.length?"?add="+ids.join(","):""));
}
root.addEventListener("input",upd);upd();
})();
