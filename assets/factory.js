/* The Agent Factory — Army Builder */
(function(){
"use strict";
var root=document.getElementById("factory");if(!root||!window.MAA)return;
var M=window.MAA,SQ=M.SQ;

/* Starting prices — edit here and on /pricing/ together */
var PRICE={
  scout:{build:1500,sto:149,setup:500},
  specialist:{build:3500,sto:299,setup:1000},
  commander:{build:7500,sto:599,setup:1500},
  care:99, blueprint:750,
  copyBuild:.5, copySto:.7,           /* extra copies of an agent you already have */
  volBuild:[[25,.20],[10,.15],[5,.10]],
  volSto:[[25,.15],[10,.10],[5,.05]],
  maxTotal:100, maxEach:25
};
var CAT=[
 ["ai-receptionist","AI Receptionist","receptionist","specialist","Answers your business line, handles routine questions, books appointments and texts you a recap."],
 ["after-hours","After-Hours Answering Agent","receptionist","scout","Covers nights, weekends and lunch so no caller hits a dead voicemail."],
 ["appointment-setter","Appointment Setter","receptionist","specialist","Finds open times on your calendar, books, confirms and reminds."],
 ["support-answerer","Support Answer Agent","customer-service","scout","Answers common customer questions from a knowledge base you approve."],
 ["ticket-triage","Ticket Triage Agent","customer-service","scout","Reads incoming requests, tags urgency and routes each one to the right person."],
 ["order-status","Order Status Agent","customer-service","scout","Looks up orders and shipping so customers get answers without waiting."],
 ["returns","Returns & Exchanges Agent","customer-service","specialist","Walks customers through your return policy and prepares the paperwork for approval."],
 ["lead-responder","Speed-to-Lead Responder","sales","specialist","Replies to new web, form and ad leads within minutes, day or night."],
 ["follow-up","Follow-Up Agent","sales","specialist","Keeps every open quote and lead warm with timely, on-brand follow-ups."],
 ["quote-drafter","Quote Drafting Agent","sales","specialist","Turns notes and price lists into ready-to-review quotes and proposals."],
 ["crm-updater","CRM Hygiene Agent","sales","scout","Logs calls, cleans duplicates and keeps your pipeline up to date."],
 ["lead-researcher","Lead Research Agent","sales","scout","Researches prospects and companies before you pick up the phone."],
 ["content-drafter","Content Drafting Agent","marketing","specialist","Drafts blogs, emails and pages in your voice for you to approve."],
 ["social-poster","Social Posting Agent","marketing","scout","Plans, drafts and schedules social posts on a steady rhythm."],
 ["gbp-poster","Google Business Profile Agent","marketing","scout","Keeps your Google Business Profile active with fresh, approved posts."],
 ["review-requester","Review Request Agent","marketing","scout","Asks happy customers for reviews at the right moment, the right way."],
 ["review-responder","Review Reply Agent","marketing","scout","Drafts thoughtful replies to every review for you to approve."],
 ["seo-monitor","Rank & Site Monitor Agent","marketing","scout","Watches rankings, uptime and broken pages and flags what changed."],
 ["scheduler","Scheduling & Dispatch Agent","operations","specialist","Builds and reshuffles the schedule when jobs, people or weather change."],
 ["inbox-triage","Inbox Triage Agent","operations","scout","Sorts the inbox, drafts replies and surfaces only what needs you."],
 ["doc-processor","Document Intake Agent","operations","specialist","Reads forms, PDFs and attachments and files the data where it belongs."],
 ["inventory-watch","Inventory Watch Agent","operations","scout","Tracks stock levels and warns you before you run out."],
 ["reporting","Daily Briefing Agent","operations","scout","Sends a short morning summary of calls, leads, jobs and money."],
 ["commander","Commander Agent","operations","commander","Coordinates your other agents, routes work, handles approvals and reports up to you."],
 ["invoice-chaser","Invoice Reminder Agent","admin-finance","scout","Sends polite, persistent reminders on unpaid invoices."],
 ["bookkeeping-prep","Bookkeeping Prep Agent","admin-finance","specialist","Categorizes transactions and prepares books for your bookkeeper or CPA to review."],
 ["expense-sorter","Receipt & Expense Agent","admin-finance","scout","Collects receipts, matches them to expenses and flags gaps."],
 ["hr-screener","Applicant Screening Agent","admin-finance","specialist","Organizes applications against criteria you set; people make every hiring decision."],
 ["onboarding","Onboarding Agent","admin-finance","specialist","Walks new hires and new clients through paperwork, accounts and first steps."],
 ["life-admin","Life Admin Agent","life","scout","Handles the personal to-do pile: forms, renewals, appointments and reminders."],
 ["travel-planner","Travel Planning Agent","life","scout","Researches trips, compares options and builds itineraries for your approval."],
 ["family-calendar","Family Calendar Agent","life","scout","Keeps practices, school events and family plans on one calendar."],
 ["bill-tracker","Bill & Renewal Tracker","life","scout","Tracks bills, subscriptions and renewals so nothing surprises you."],
 ["research-assistant","Research Assistant","life","scout","Digs into any question and hands back a short, sourced summary."]
];
var BY={};CAT.forEach(function(r){BY[r[0]]=r});
var PRESETS=[
 ["Just one","AI Receptionist",{"ai-receptionist":1}],
 ["Starter squad","3 agents",{"ai-receptionist":1,"lead-responder":1,"review-requester":1}],
 ["Front office","6 agents",{"ai-receptionist":1,"after-hours":1,"appointment-setter":1,"lead-responder":1,"follow-up":1,"inbox-triage":1}],
 ["Growth squad","11 agents",{"ai-receptionist":1,"after-hours":1,"appointment-setter":1,"lead-responder":1,"follow-up":1,"inbox-triage":1,"review-requester":1,"social-poster":1,"gbp-poster":1,"reporting":1,"commander":1}],
 ["5-location army","40 agents",{"ai-receptionist":5,"after-hours":5,"appointment-setter":5,"review-requester":5,"gbp-poster":5,"scheduler":5,"lead-responder":5,"commander":1,"reporting":1,"bookkeeping-prep":1,"invoice-chaser":1,"content-drafter":1}],
 ["Life admin","3 agents",{"life-admin":1,"family-calendar":1,"bill-tracker":1}]
];
var panes0,q={},model="own",help="dfy",tab="all",lane="ready",ctools="1–2",cscope={label:"Single custom workflow",price:"from $4,000"};

/* build UI */
var presetsEl=root.querySelector(".presets"),tabsEl=root.querySelector(".tabs"),rolesEl=root.querySelector(".roles");
PRESETS.forEach(function(p,i){var b=document.createElement("button");b.type="button";b.className="preset";b.innerHTML=p[0]+"<small>"+p[1]+"</small>";b.addEventListener("click",function(){q={};for(var k in p[2])q[k]=p[2][k];render();pulse();});presetsEl.appendChild(b);});
var clr=document.createElement("button");clr.type="button";clr.className="preset";clr.innerHTML="Clear<small>start over</small>";clr.addEventListener("click",function(){q={};render();});presetsEl.appendChild(clr);
var tabList=[["all","All agents",""]];Object.keys(SQ).forEach(function(k){tabList.push([k,SQ[k].name,SQ[k].c])});
tabList.forEach(function(t){var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");b.dataset.t=t[0];b.innerHTML=(t[2]?'<i style="background:'+t[2]+'"></i>':"")+t[1];b.addEventListener("click",function(){tab=t[0];drawRoles();});tabsEl.appendChild(b);});

function tierName(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function money(n){return "$"+Math.round(n).toLocaleString("en-US")}
function drawRoles(){
  tabsEl.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.t===tab))});
  rolesEl.innerHTML="";
  CAT.forEach(function(r){
    if(tab!=="all"&&r[2]!==tab)return;
    var c=SQ[r[2]].c,n=q[r[0]]||0,p=PRICE[r[3]];
    var d=document.createElement("div");d.className="role"+(n?" has":"");d.style.setProperty("--c",c);
    d.innerHTML=M.bot(c,{cmd:r[3]==="commander"})+'<div style="flex:1;min-width:0"><h4></h4><p></p><div class="role__ft"><span><span class="tier tier--'+r[3]+'">'+tierName(r[3])+'</span> <small style="display:block;color:var(--muted);font-size:.78rem;margin-top:5px">from '+money(p.build)+' or '+money(p.sto)+'/mo</small></span><span class="qty"><button type="button" aria-label="Remove one">−</button><output aria-live="polite">'+n+'</output><button type="button" aria-label="Add one">+</button></span></div></div>';
    d.querySelector("h4").textContent=r[1];d.querySelector("p").textContent=r[4];
    var bs=d.querySelectorAll(".qty button");
    bs[0].setAttribute("aria-label","Remove one "+r[1]);bs[1].setAttribute("aria-label","Add one "+r[1]);
    bs[0].addEventListener("click",function(){set(r[0],(q[r[0]]||0)-1)});
    bs[1].addEventListener("click",function(){set(r[0],(q[r[0]]||0)+1)});
    rolesEl.appendChild(d);
  });
}
function total(){var t=0;for(var k in q)t+=q[k];return t}
var capMsg=root.querySelector("[data-cap]");
function set(id,n){
  n=Math.max(0,Math.min(PRICE.maxEach,n));
  var cur=q[id]||0,t=total()-cur+n;
  if(t>PRICE.maxTotal){capMsg.classList.add("on");capMsg.textContent="That's 100 agents — the most one order can hold. Bigger than that? We'll plan it with you.";return;}
  capMsg.classList.remove("on");
  if(n)q[id]=n;else delete q[id];
  render();
}
function vol(t,tbl){for(var i=0;i<tbl.length;i++)if(t>=tbl[i][0])return tbl[i][1];return 0}
function calc(){
  var t=total(),build=0,sto=0,setup=0;
  for(var k in q){var r=BY[k],p=PRICE[r[3]],n=q[k];build+=p.build+(n-1)*p.build*PRICE.copyBuild;sto+=p.sto+(n-1)*p.sto*PRICE.copySto;setup+=p.setup+(n-1)*p.setup*PRICE.copyBuild;}
  var vb=vol(t,PRICE.volBuild),vs=vol(t,PRICE.volSto);
  return{t:t,build:build*(1-vb),vb:vb,sto:sto*(1-vs),vs:vs,setup:setup*(1-vb),care:t*PRICE.care};
}
var form=root.querySelector(".formation"),ring=root.querySelector(".ring .fg"),ringN=root.querySelector(".ring b span"),list=root.querySelector(".army__list"),est=root.querySelector(".est"),hint=root.querySelector("[data-hint]"),mobBar=document.querySelector(".fac-mob");
var CIRC=2*Math.PI*27;ring.style.strokeDasharray=CIRC;
function render(){
  drawRoles();
  var c=calc(),t=c.t;
  ringN.textContent=t;ring.style.strokeDashoffset=CIRC*(1-t/PRICE.maxTotal);
  /* formation */
  var h="",order=Object.keys(SQ);
  if(!t)h='<p class="empty">Your army is empty. Tap <b>+</b> on any agent, or pick a starter squad above.</p>';
  else{
    for(var i=0;i<(q.commander||0);i++)h+=M.bot(SQ.operations.c,{cmd:true});
    order.forEach(function(s){CAT.forEach(function(r){if(r[2]===s&&r[0]!=="commander"){for(var j=0;j<(q[r[0]]||0);j++)h+=M.bot(SQ[s].c);}})});
  }
  form.innerHTML=h;form.classList.toggle("dense",t>40);
  /* list */
  list.innerHTML="";
  CAT.forEach(function(r){if(q[r[0]]){var li=document.createElement("li");li.innerHTML='<span><i style="background:'+SQ[r[2]].c+'"></i><span></span></span><b>×'+q[r[0]]+'</b>';li.querySelector("span span").textContent=r[1];list.appendChild(li);}});
  /* estimate */
  var hl={dfy:"Done-For-You: we deploy and run it. Deployment is scoped after your Blueprint.",copilot:"Co-Pilot: your team deploys with our guidance, scoped after your Blueprint.",handoff:"Handoff: you get the configured agents plus documentation. You deploy."}[help];
  var e="";
  if(!t)e='<div class="est__row"><span>Add agents to see your estimate</span></div>';
  else if(model==="own"){
    e='<div class="est__row big"><span>Own it, from</span><b>'+money(c.build)+'</b></div>'+
      (c.vb?'<div class="est__row"><span>Estimated volume pricing</span><b>−'+Math.round(c.vb*100)+'%</b></div>':'')+
      (help==="dfy"?'<div class="est__row"><span>Agent Care (monitoring + tuning)</span><b>'+money(c.care)+'/mo</b></div>':'<div class="est__row"><span>Agent Care</span><b>optional</b></div>')+
      '<div class="est__row"><span>Agent Blueprint</span><b>'+money(PRICE.blueprint)+'*</b></div>'+
      '<div class="est__row"><span>Deployment</span><b>scoped after Blueprint</b></div>';
  }else{
    e='<div class="est__row big"><span>Monthly, from</span><b>'+money(c.sto)+'/mo</b></div>'+
      '<div class="est__row"><span>One-time setup, from</span><b>'+money(c.setup)+'</b></div>'+
      (c.vs?'<div class="est__row"><span>Estimated volume pricing</span><b>−'+Math.round(c.vs*100)+'%</b></div>':'')+
      '<div class="est__row"><span>Agent Care</span><b>included</b></div>'+
      '<div class="est__row"><span>Term</span><b>2–4 years + buyout</b></div>'+
      '<div class="est__row"><span>Agent Blueprint</span><b>'+money(PRICE.blueprint)+'*</b></div>'+
      '<div class="est__row"><span>Deployment</span><b>scoped after Blueprint</b></div>';
  }
  est.innerHTML=e+'<p class="est__note">'+hl+' *Blueprint credited toward your build within 60 days. Estimates cover development only; usage (AI model, phone minutes, software) is billed at cost or runs on your accounts. Starting points, not a quote.</p>';
  /* commander hint */
  hint.classList.toggle("on",t>=6&&!q.commander);
  if(mobBar){var ms=mobBar.querySelector("span");if(lane==="custom"){ms.innerHTML="Custom build · <em>see estimate</em>";}else{ms.innerHTML="<b>"+t+"</b> "+(t===1?"agent":"agents")+" · <em>"+(t?(model==="own"?"from "+money(c.build):"from "+money(c.sto)+"/mo + setup"):"start building")+"</em>";}}
  try{localStorage.setItem("maa-army",JSON.stringify({q:q,model:model,help:help}))}catch(err){}
}
function pulse(){if(M.RM)return;var a=root.querySelector(".army");a.animate([{transform:"scale(1)"},{transform:"scale(1.015)"},{transform:"scale(1)"}],{duration:450});}
hint.querySelector("button").addEventListener("click",function(){set("commander",1)});
panes0=root.querySelector('[data-pane="ready"]');
panes0.querySelectorAll(".seg button").forEach(function(b){b.addEventListener("click",function(){model=b.dataset.m;panes0.querySelectorAll(".seg button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});render();})});
root.querySelector("#help").addEventListener("change",function(){help=this.value;render();});

/* summary for the form */
M.beforeSubmit=function(f){
  var ta=f.querySelector('[name="Army"]');if(!ta)return;var c=calc(),lines=[];
  var ln=f.querySelector('[name="Lane"]');if(ln)ln.value=lane==="custom"?"Custom-built":"Ready-made";
  if(lane==="custom"){ta.value="Custom build: "+cscope.label+" ("+cscope.price+")\nSystems to connect: "+ctools;return;}
  CAT.forEach(function(r){if(q[r[0]])lines.push(q[r[0]]+" x "+r[1]+" ("+tierName(r[3])+")")});
  lines.push("Total agents: "+c.t);
  lines.push("Model: "+(model==="own"?"Own it, from "+money(c.build)+(help==="dfy"?" + Care "+money(c.care)+"/mo":""):"Subscribe-to-Own, from "+money(c.sto)+"/mo + setup from "+money(c.setup)));
  lines.push("Help level: "+{dfy:"Done-For-You",copilot:"Co-Pilot",handoff:"Handoff"}[help]);
  ta.value=lines.join("\n");
};

/* lanes */
var panes={ready:root.querySelector('[data-pane="ready"]'),custom:root.querySelector('[data-pane="custom"]')};
function setLane(l){lane=l;root.querySelectorAll(".lanes button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.lane===l))});panes.ready.hidden=l!=="ready";panes.custom.hidden=l!=="custom";if(l==="custom")cest();render();}
root.querySelectorAll(".lanes button").forEach(function(b){b.addEventListener("click",function(){setLane(b.dataset.lane)})});
var cviz=root.querySelector("[data-cviz]");
function cest(){
  var n={single:1,multi:1,army:4}[cscope.key||"single"];
  var h="";for(var i=0;i<n;i++)h+=M.bot(i===0&&n>1?SQ.operations.c:"#4f46e5",{cmd:i===0&&n>1});
  cviz.innerHTML=h+'<p class="empty" style="flex-basis:100%;padding:8px 0 0">'+(n>1?"A custom squad plus a Commander":"One agent, built just for you")+'</p>';
  root.querySelector("[data-cest]").innerHTML='<div class="est__row big"><span>Custom build</span><b>'+cscope.price+'</b></div>'+
   '<div class="est__row"><span>Systems to connect</span><b>'+ctools+'</b></div>'+
   '<div class="est__row"><span>Agent Care</span><b>from 5% of build/mo</b></div>'+
   '<div class="est__row"><span>Agent Blueprint</span><b>'+money(PRICE.blueprint)+'*</b></div>'+
   '<div class="est__row"><span>Deployment</span><b>scoped after Blueprint</b></div>'+
   '<p class="est__note">*Credited toward your build within 60 days. Custom code we write for you is yours. Monthly Subscribe-to-Own options are quoted in your Blueprint. Starting points, not a quote.</p>';
}
root.querySelectorAll(".cscope button").forEach(function(b){b.addEventListener("click",function(){root.querySelectorAll(".cscope button").forEach(function(x){x.setAttribute("aria-checked",String(x===b))});cscope={key:b.dataset.scope,label:b.querySelector("b").textContent,price:b.querySelector("em").textContent};cest();})});
panes.custom.querySelectorAll(".seg button").forEach(function(b){b.addEventListener("click",function(){ctools=b.dataset.tools;panes.custom.querySelectorAll(".seg button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});cest();})});
/* restore / URL params */
try{var sv=JSON.parse(localStorage.getItem("maa-army")||"null");if(sv&&sv.q){q=sv.q;model=sv.model||"own";help=sv.help||"dfy";}}catch(err){}
var u=new URLSearchParams(location.search);
if(u.get("add")){u.get("add").split(",").forEach(function(id,ix){if(BY[id]){if(!q[id])q[id]=1;if(!ix)tab=BY[id][2];}});}
if(u.get("squad")&&SQ[u.get("squad")])tab=u.get("squad");
panes0.querySelectorAll(".seg button").forEach(function(x){x.setAttribute("aria-pressed",String(x.dataset.m===model))});
root.querySelector("#help").value=help;
if(u.get("lane")==="custom")setLane("custom");else render();
})();
