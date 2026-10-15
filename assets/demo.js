/* Mission Control — live, scripted agent demos */
(function(){
"use strict";
var M=window.MAA;if(!M)return;var SQ=M.SQ,RM=M.RM;
var MISSIONS={
 calls:{chip:"Answer my missed calls",biz:"Sunrise Plumbing (sample)",prompt:"Answer my missed calls and book the jobs",
  agents:[["AI Receptionist","receptionist"],["Appointment Setter","receptionist"],["Daily Briefing","operations"]],
  steps:[[0,"phone","Call at 12:14 PM from a new customer. Answered in your business name."],[0,"chat","Water heater leaking. Collected name, address and urgency with your intake script."],[1,"calendar","Checked your calendar. Found 3 open windows tomorrow."],[1,"mail","Drafted a confirmation text for the 8 to 10 AM window."]],
  approve:{t:"Send this confirmation?",items:["Text to caller: “You’re booked tomorrow 8–10 AM with Sunrise Plumbing. Reply C to confirm.”"]},
  after:[[1,"check","Sent. Booked on your calendar with the job notes attached."],[2,"doc","Added to tomorrow morning’s briefing."]],
  result:"1 missed call became 1 booked job",mins:18,sched:"Answer every call, 24/7",add:"ai-receptionist,appointment-setter"},
 leads:{chip:"Follow up on new leads",biz:"Peak Realty (sample)",prompt:"Follow up on every new lead tonight",
  agents:[["Speed-to-Lead","sales"],["CRM Hygiene","sales"],["Follow-Up","sales"]],
  steps:[[0,"mail","2 new web leads came in after hours."],[0,"chat","Drafted a personal reply to each, based on what they asked for."],[1,"gear","Logged both leads in your CRM and tagged the source."],[2,"calendar","Scheduled day-2 and day-5 follow-ups."]],
  approve:{t:"Approve 2 replies?",items:["To Dana: “Thanks for asking about the Maple St. listing. I can show it Thursday at 5. Does that work?”","To Luis: “Happy to help you sell. Want a free value estimate this week?”"]},
  after:[[0,"check","Replies sent 4 minutes after each form came in."],[2,"bolt","Follow-ups armed. They stop the moment someone replies."]],
  result:"2 leads answered in minutes, follow-ups set",mins:35,sched:"Respond to every new lead, day or night",add:"lead-responder,crm-updater,follow-up"},
 invoices:{chip:"Chase unpaid invoices",biz:"Summit Design Co. (sample)",prompt:"Chase my unpaid invoices",
  agents:[["Invoice Reminder","admin-finance"],["Bookkeeping Prep","admin-finance"]],
  steps:[[0,"dollar","Found 4 invoices more than 30 days past due."],[0,"doc","Matched each one to its job and contact."],[0,"mail","Drafted friendly reminders, a little firmer for the oldest."],[1,"chart","Flagged one partial payment for your bookkeeper."]],
  approve:{t:"Send 4 reminders?",items:["3 friendly reminders with a pay-now link","1 firmer note on the 60-day invoice"]},
  after:[[0,"check","Sent, with payment links included."],[1,"doc","Notes saved for your bookkeeper."]],
  result:"4 reminders out, 1 issue flagged",mins:50,sched:"Remind on unpaid invoices every Monday",add:"invoice-chaser,bookkeeping-prep"},
 reviews:{chip:"Get more 5-star reviews",biz:"Blue Door Bakery (sample)",prompt:"Get us more 5-star reviews",
  agents:[["Review Request","marketing"],["Review Reply","marketing"],["Google Profile","marketing"]],
  steps:[[0,"check","Found 6 happy customers from this week’s orders."],[0,"mail","Drafted review requests timed for this afternoon."],[1,"star","Drafted replies to 2 new reviews. One needs a careful touch."],[2,"megaphone","Drafted this week’s Google Business Profile post."]],
  approve:{t:"Approve requests, replies and post?",items:["6 review requests by email","2 review replies (one marked for your edit)","1 Google Business Profile post"]},
  after:[[0,"check","Requests scheduled. The tricky reply waits for your edit."],[2,"check","Post scheduled for 10 AM tomorrow."]],
  result:"6 requests, 2 replies and 1 post, ready",mins:45,sched:"Every Friday at 3 PM",add:"review-requester,review-responder,gbp-poster"},
 brief:{chip:"Plan my week",biz:"Your business (sample)",prompt:"Plan my week and brief me every morning",
  agents:[["Commander","operations"],["Inbox Triage","operations"],["Scheduler","operations"],["Daily Briefing","operations"]],cmd:0,
  steps:[[0,"target","Split the mission across 3 agents."],[1,"mail","Sorted 64 emails: 7 need you, 3 replies drafted."],[2,"calendar","Fixed a double booking and protected 2 focus blocks."],[3,"doc","Wrote your 6:30 AM briefing: top 3 priorities, new leads, money in."]],
  approve:{t:"Approve the 3 drafted replies?",items:["Reply to your supplier about Friday’s delivery","Reply to a client asking for an update","Reply confirming Tuesday’s meeting"]},
  after:[[1,"check","Drafts saved. Nothing sends without you."],[0,"check","Mission complete. Report filed."]],
  result:"Your week, planned in about 2 minutes",mins:70,sched:"Brief me every weekday at 6:30 AM",add:"commander,inbox-triage,scheduler,reporting"},
 support:{chip:"Answer my support inbox",biz:"Trailhead Outfitters (sample)",prompt:"Answer my support inbox",
  agents:[["Ticket Triage","customer-service"],["Order Status","customer-service"],["Support Answer","customer-service"]],
  steps:[[0,"search","Read 12 new requests and tagged each by urgency."],[1,"cart","Looked up 5 “where’s my order?” requests with tracking."],[2,"chat","Drafted 5 answers from your approved help articles."],[0,"user","Routed 2 urgent requests to your team, with notes."]],
  approve:{t:"Approve 10 answers?",items:["5 order-status replies with tracking links","5 how-to answers from your help center"]},
  after:[[2,"check","Sent. 2 urgent requests are waiting for a human."],[0,"doc","Summary posted for your team."]],
  result:"12 requests handled or routed",mins:60,sched:"Every hour, 7 AM to 7 PM",add:"ticket-triage,order-status,support-answerer"},
 life:{chip:"Handle my bills and renewals",biz:"Your household (sample)",prompt:"Handle my bills and renewals",
  agents:[["Bill & Renewal","life"],["Family Calendar","life"],["Life Admin","life"]],
  steps:[[0,"dollar","Found 3 bills due this week and 1 renewal price jump."],[1,"calendar","Added practice and a dentist visit to the family calendar."],[2,"doc","Drafted a cancellation for a subscription nobody uses."]],
  approve:{t:"Send the cancellation request?",items:["Cancel the unused streaming add-on"]},
  after:[[2,"check","Sent. You’ll see the confirmation in your inbox."],[0,"bell","Reminders set 2 days before each bill."]],
  result:"3 bills tracked, 1 subscription canceled",mins:40,sched:"Check every Sunday evening",add:"bill-tracker,family-calendar,life-admin"}
};
window.MAA.MISSIONS=MISSIONS;
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function wait(ms){return new Promise(function(r){setTimeout(r,RM?0:ms)});}
var inst=[];
document.querySelectorAll(".mc[data-missions]").forEach(function(root){
  var ids=root.getAttribute("data-missions").split(",").filter(function(x){return MISSIONS[x]});
  root.innerHTML='<div class="mc__hd"><span class="mc__live"><i></i>Mission Control</span><span class="mc__biz"></span></div>'+
  '<div class="mc__bd"><div class="mc__prompt"><span class="mc__typed"></span><span class="mc__caret"></span><button type="button" class="mc__go" aria-label="Run this mission">'+M.icon("bolt")+'</button></div>'+
  '<div class="mc__chips" role="group" aria-label="Pick a mission"></div>'+
  '<div class="mc__squad" aria-label="Agents on this mission"></div>'+
  '<div class="mc__feed" aria-live="polite"></div></div>'+
  '<div class="mc__ft"><span>Demo simulation with sample data. Your agents are built for your own tools.</span><button type="button" class="mc__replay">Replay</button></div>';
  var chips=root.querySelector(".mc__chips"),typed=root.querySelector(".mc__typed"),squad=root.querySelector(".mc__squad"),feed=root.querySelector(".mc__feed"),biz=root.querySelector(".mc__biz");
  if(ids.length<2)chips.style.display="none";
  ids.forEach(function(id){var b=el("button","mc__chip");b.type="button";b.textContent=MISSIONS[id].chip;b.dataset.id=id;b.addEventListener("click",function(){run(id)});chips.appendChild(b);});
  var token=0,cur=ids[0];
  function scroll(){feed.scrollTop=feed.scrollHeight;}
  function agentBadge(a,i,m){var c=SQ[a[1]].c;var d=el("div","mc__agent");d.style.setProperty("--c",c);d.innerHTML=M.bot(c,{cmd:m.cmd===i})+"<span></span>";d.querySelector("span").textContent=a[0];return d;}
  function stepRow(m,s){var a=m.agents[s[0]],c=SQ[a[1]].c;var r=el("div","mc__step");r.style.setProperty("--c",c);
    r.innerHTML='<span class="mc__ic">'+M.icon(s[1])+'</span><div><b></b><p></p></div><span class="mc__ok">'+M.icon("check")+'</span>';
    r.querySelector("b").textContent=a[0];r.querySelector("p").textContent=s[2];return r;}
  async function typeIt(txt,my){typed.textContent="";if(RM){typed.textContent=txt;return;}for(var i=0;i<txt.length;i++){if(my!==token)return;typed.textContent+=txt[i];await wait(28);}}
  async function run(id){
    var my=++token;cur=id;var m=MISSIONS[id];
    chips.querySelectorAll(".mc__chip").forEach(function(c){c.setAttribute("aria-pressed",String(c.dataset.id===id))});
    biz.textContent=m.biz;feed.innerHTML="";squad.innerHTML="";root.classList.remove("done");
    await typeIt(m.prompt,my);if(my!==token)return;await wait(350);
    var badges=m.agents.map(function(a,i){var b=agentBadge(a,i,m);squad.appendChild(b);return b;});
    for(var i=0;i<badges.length;i++){await wait(220);if(my!==token)return;badges[i].classList.add("on");}
    var note=el("div","mc__note");note.textContent="Squad deployed. "+m.agents.length+" agents on the mission.";feed.appendChild(note);
    for(var k=0;k<m.steps.length;k++){await wait(750);if(my!==token)return;var s=m.steps[k];badges.forEach(function(b,j){b.classList.toggle("busy",j===s[0])});var r=stepRow(m,s);feed.appendChild(r);scroll();await wait(550);r.classList.add("ok");}
    badges.forEach(function(b){b.classList.remove("busy")});
    await wait(500);if(my!==token)return;
    var ap=el("div","mc__appr");ap.innerHTML='<p class="mc__appr-t">'+M.icon("shield")+'<span></span></p><ul></ul><div class="mc__appr-b"><button type="button" class="btn btn--primary btn--sm mc__yes">Approve</button><button type="button" class="btn btn--ghost btn--sm mc__edit">Edit first</button><small class="mc__cd"></small></div>';
    ap.querySelector(".mc__appr-t span").textContent="Your call: "+m.approve.t;
    m.approve.items.forEach(function(t){var li=el("li");li.textContent=t;ap.querySelector("ul").appendChild(li)});
    feed.appendChild(ap);scroll();
    var decided=await new Promise(function(res){var n=RM?0:10,cd=ap.querySelector(".mc__cd"),iv=null;
      function done(v){clearInterval(iv);res(v);}
      ap.querySelector(".mc__yes").addEventListener("click",function(){done("yes")});
      ap.querySelector(".mc__edit").addEventListener("click",function(){done("edit")});
      if(!RM){cd.textContent="Auto-approves in "+n+"s for the demo";iv=setInterval(function(){if(my!==token){clearInterval(iv);res(null);return;}n--;cd.textContent="Auto-approves in "+n+"s for the demo";if(n<=0)done("auto");},1000);}
    });
    if(my!==token||decided===null)return;
    ap.classList.add("decided");ap.querySelector(".mc__appr-b").innerHTML='<span class="mc__dec">'+M.icon("check")+(decided==="edit"?" You edited, then approved.":decided==="auto"?" Approved (demo auto-continue).":" Approved by you.")+'</span>';
    for(var a=0;a<m.after.length;a++){await wait(700);if(my!==token)return;var s2=m.after[a];var r2=stepRow(m,s2);feed.appendChild(r2);scroll();await wait(450);r2.classList.add("ok");}
    await wait(600);if(my!==token)return;
    var res=el("div","mc__res");res.innerHTML='<div class="mc__res-top"><div><p class="mc__res-h"></p><p class="mc__res-s">Time handed back on this one mission</p></div><p class="mc__mins"><b>0</b> min</p></div>'+
      '<div class="mc__sched"><span class="mc__clock">'+M.icon("clock")+'</span><div><b>Make it automatic</b><p></p></div><button type="button" class="mc__tog" role="switch" aria-checked="false" aria-label="Make this mission automatic"><i></i></button></div>'+
      '<a class="btn btn--primary mc__cta" href="/factory/?add='+m.add+'">Build this squad in the Factory</a>';
    res.querySelector(".mc__res-h").textContent=m.result;res.querySelector(".mc__sched p").textContent=m.sched;
    feed.appendChild(res);scroll();root.classList.add("done");
    var mb=res.querySelector(".mc__mins b"),t0=null,dur=RM?1:1100;
    requestAnimationFrame(function st(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);mb.textContent=Math.round(m.mins*p);if(p<1)requestAnimationFrame(st);});
    var tog=res.querySelector(".mc__tog");tog.addEventListener("click",function(){var on=tog.getAttribute("aria-checked")!=="true";tog.setAttribute("aria-checked",String(on));});
    await wait(1400);if(my!==token)return;tog.setAttribute("aria-checked","true");
  }
  root.querySelector(".mc__replay").addEventListener("click",function(){run(cur)});
  root.querySelector(".mc__go").addEventListener("click",function(){run(cur)});
  var started=false;
  var auto=root.getAttribute("data-auto");
  if(auto&&MISSIONS[auto]){cur=auto;}
  var o=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!started){started=true;run(cur);o.disconnect();}},{threshold:.25});o.observe(root);
  inst.push({root:root,run:function(id){started=true;run(id);}});
});
window.MAA.playMission=function(id){if(!inst.length||!MISSIONS[id])return false;var i=inst[0];i.run(id);if(window.innerWidth<1100)i.root.scrollIntoView({behavior:RM?"auto":"smooth",block:"start"});return true;};
})();
