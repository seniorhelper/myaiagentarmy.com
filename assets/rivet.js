/* Rivet — the Factory Foreman (site guide). One file; injects its own markup. */
(function(){
"use strict";
if(window.__rivet)return;window.__rivet=1;
var RM=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var css='.rv{position:fixed;right:0;bottom:22px;z-index:120;font-family:var(--f-ui,system-ui)}'+
'.rv__tab{position:relative;width:92px;height:118px;border:0;background:none;cursor:pointer;padding:0;transform:translateX(18px);transition:transform .3s;filter:drop-shadow(0 10px 18px rgba(18,23,51,.25))}'+
'.rv__tab:hover,.rv__tab:focus-visible{transform:translateX(4px)}'+
'.rv__tab svg{width:92px;height:118px}'+
'.rv__float{animation:rvf 5s ease-in-out infinite}@keyframes rvf{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'+
'.rv__wave{transform-origin:76px 70px;animation:rvw 4s ease-in-out infinite}@keyframes rvw{0%,70%,100%{transform:rotate(0)}78%{transform:rotate(-18deg)}86%{transform:rotate(6deg)}94%{transform:rotate(-12deg)}}'+
'.rv__bub{position:absolute;right:96px;bottom:70px;background:#fff;border:1px solid #e2e5f1;border-radius:12px 12px 2px 12px;padding:9px 12px;font:600 .86rem/1.3 inherit;color:#121733;white-space:nowrap;box-shadow:0 8px 20px rgba(18,23,51,.12);opacity:0;transform:translateY(6px);transition:.4s;pointer-events:none}'+
'.rv__bub.on{opacity:1;transform:none}'+
'.rv__pan{position:fixed;right:16px;bottom:16px;width:min(380px,calc(100vw - 32px));height:min(600px,calc(100vh - 100px));background:#fff;border:1px solid #e2e5f1;border-radius:20px;box-shadow:0 30px 70px -20px rgba(18,23,51,.45);display:none;flex-direction:column;overflow:hidden}'+
'.rv.open .rv__pan{display:flex}.rv.open .rv__tab,.rv.open .rv__bub{display:none}'+
'.rv__hd{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(120deg,#4f46e5,#7c5cf6);color:#fff}'+
'.rv__hd svg{width:40px;height:52px;flex-shrink:0}.rv__hd b{font:700 1rem/1.1 var(--f-d,inherit);display:block}.rv__hd small{opacity:.85;font-size:.78rem}'+
'.rv__x{margin-left:auto;width:36px;height:36px;border:0;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font-size:1.3rem;cursor:pointer}'+
'.rv__log{flex:1;overflow-y:auto;padding:14px;background:#f7f7fc;display:flex;flex-direction:column;gap:10px}'+
'.rv__m{max-width:88%;padding:10px 12px;border-radius:14px;font-size:.92rem;line-height:1.5;color:#121733}'+
'.rv__m a{color:#4f46e5;font-weight:600}'+
'.rv__m.b{background:#fff;border:1px solid #e2e5f1;border-radius:4px 14px 14px 14px;align-self:flex-start}'+
'.rv__m.u{background:#4f46e5;color:#fff;border-radius:14px 4px 14px 14px;align-self:flex-end}'+
'.rv__dots{display:inline-flex;gap:4px}.rv__dots i{width:7px;height:7px;border-radius:50%;background:#9aa0bf;animation:rvd 1.2s ease-in-out infinite}.rv__dots i:nth-child(2){animation-delay:.15s}.rv__dots i:nth-child(3){animation-delay:.3s}@keyframes rvd{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}'+
'.rv__qr{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-top:1px solid #e2e5f1;background:#fff}'+
'.rv__qr button{border:1px solid #d6d5fb;background:#fff;color:#3730a3;border-radius:8px;padding:7px 10px;font:600 .8rem inherit;cursor:pointer}.rv__qr button:hover{background:#e9e8ff}'+
'.rv__in{display:flex;gap:8px;padding:10px 12px 12px;background:#fff}'+
'.rv__in input{flex:1;border:1px solid #d8dbea;border-radius:10px;padding:11px 12px;font:400 .95rem inherit;min-width:0}.rv__in input:focus{outline:0;border-color:#4f46e5;box-shadow:0 0 0 3px #e9e8ff}'+
'.rv__in button{border:0;background:#4f46e5;color:#fff;border-radius:10px;padding:0 14px;font:600 .9rem inherit;cursor:pointer}'+
'@media (max-width:600px){.rv{bottom:12px}.rv__tab{width:60px;height:77px;transform:translateX(16px)}.rv__tab svg{width:60px;height:77px}.rv__bub{right:76px;bottom:52px}.rv__pan{right:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100vh - 80px)}}'+
'@media (prefers-reduced-motion:reduce){.rv__float,.rv__wave,.rv__dots i{animation:none}}';
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

function rivet(sm){return '<svg viewBox="0 0 92 118" aria-hidden="true"><g class="'+(sm?"":"rv__float")+'">'+
'<path d="M24 26a22 18 0 0144 0z" fill="#f59e0b"/><rect x="18" y="24" width="56" height="7" rx="3.5" fill="#d97706"/><rect x="42" y="9" width="8" height="8" rx="2" fill="#fbbf24"/>'+
'<rect x="20" y="31" width="52" height="36" rx="12" fill="#4f46e5"/><rect x="26" y="38" width="40" height="19" rx="8" fill="#151a36"/>'+
'<circle cx="37" cy="47.5" r="4" fill="#7ef9e4"/><circle cx="55" cy="47.5" r="4" fill="#7ef9e4"/><path d="M40 61q6 4 12 0" stroke="#c7c2ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
'<rect x="15" y="40" width="6" height="14" rx="3" fill="#3730a3"/><rect x="71" y="40" width="6" height="14" rx="3" fill="#3730a3"/>'+
'<rect x="40" y="66" width="12" height="6" fill="#9aa0bf"/>'+
'<rect x="25" y="71" width="42" height="32" rx="11" fill="#3730a3"/><rect x="31" y="77" width="30" height="12" rx="4" fill="#ff5a3c"/><text x="46" y="86" text-anchor="middle" font-family="system-ui" font-size="8" font-weight="800" fill="#fff">BOSS</text>'+
'<rect x="15" y="74" width="9" height="22" rx="4.5" fill="#4f46e5"/>'+
'<g class="'+(sm?"":"rv__wave")+'"><rect x="68" y="56" width="9" height="22" rx="4.5" fill="#4f46e5" transform="rotate(-20 72 70)"/><circle cx="79" cy="55" r="6" fill="#4f46e5"/></g>'+
'<rect x="30" y="103" width="11" height="12" rx="4" fill="#151a36"/><rect x="51" y="103" width="11" height="12" rx="4" fill="#151a36"/></g></svg>';}

var A={
 hi:"Hey! I'm Rivet, foreman of the Agent Factory. I can explain what an AI agent does, what it costs, or help you size your army. What's on your plate?",
 price:'Two ways to own agents. <b>Build &amp; Own</b>: Scouts from $1,500, Specialists from $3,500, Commanders from $7,500 (one-time), with optional Agent Care from $99/mo per agent. <b>Subscribe-to-Own</b>: from $149, $299 or $599 a month per agent, Care included, with a buyout option. Squads of 5+ get volume pricing. <a href="/pricing/">See full pricing</a> or <a href="/factory/">build an estimate</a>.',
 deploy:'We quote development. Deployment, meaning hooking agents into your phones, CRM, inbox and permissions, gets scoped after your <a href="/pricing/#blueprint">Agent Blueprint</a> ($750, credited toward your build), because no two businesses have the same setup. You get a written scope and price before anything starts.',
 one:'Yes! Plenty of people start with just one or two agents. The most common first hire is an <a href="/agents/receptionist/">AI Receptionist</a>. Start small, see the hours come back, then add more. <a href="/factory/?add=ai-receptionist">Start with one</a>.',
 many:'You can order anywhere from 1 to 100 agents. Big armies get deployed in waves, starting with the agents that free up the most time fastest. Once you pass about six agents, a <a href="/agents/operations/">Commander Agent</a> keeps them coordinated. <a href="/blog/how-many-ai-agents-does-my-business-need/">How many do you need?</a>',
 recep:'An <a href="/agents/receptionist/">AI Receptionist</a> answers your line in your business name, handles routine questions, books appointments and texts you a recap. Callers can always reach a person. From $3,500 to build or $299/mo subscribed.',
 safe:'Every agent gets one job, the least access it needs, a full activity log and a human approval step on anything that spends money, makes a promise or says something sensitive. <a href="/safety/">How we keep agents safe</a>.',
 own:'<b>Build &amp; Own</b> means you pay once for development and own the agent. <b>Subscribe-to-Own</b> means a lower monthly cost with Care included for 2–4 years, then a buyout option at fair market value. <a href="/pricing/">Compare both</a>.',
 time:'Timelines depend on scope and on how ready your tools and data are. Your Blueprint comes with a written plan and timeline before any build starts. <a href="/how-it-works/">See how it works</a>.',
 what:'An AI agent is software with a goal, tools and rules. It doesn\'t just chat; it takes steps like checking a calendar, booking, drafting and following up, then reports back. <a href="/blog/ai-agents-vs-chatbots-vs-automation/">Agents vs. chatbots vs. automation</a>.',
 life:'Agents aren\'t just for work. <a href="/for/your-life/">Personal agents</a> can handle bills, renewals, family calendars, trip research and life admin, and you approve anything that spends money.',
 human:'Want a real person? Call <a href="tel:+18004818638">1-800-481-8638</a> or <a href="/contact/">send a message</a>. Our team is headquartered in Denver and works with businesses everywhere.',
 time2:'Curious how much time you\'d get back? The <a href="/time-back/">Time-Back Calculator</a> shows hours per week, per year, and what that\'s worth.',
 ind:'We build agents for <a href="/for/home-services/">home services</a>, <a href="/for/real-estate/">real estate</a>, <a href="/for/ecommerce/">ecommerce</a>, <a href="/for/professional-services/">professional services</a>, <a href="/for/agencies/">agencies</a>, and for <a href="/for/your-life/">your personal life</a>.',
 promise:'Honest answer: nobody can guarantee results with AI, and we won\'t pretend to. What we promise is that we treat your business like our own, build narrow agents that do real work, and keep a human in the loop where it matters.',
 fb:'Good question, and I want to get it right. I can talk about pricing, deployment, how many agents you need, safety, or the AI Receptionist. For anything else a human is one call away at <a href="tel:+18004818638">1-800-481-8638</a>.'
};
var RULES=[
 [/(price|pricing|cost|how much|\$|expensive|cheap|budget)/i,"price"],
 [/(deploy|install|set ?up|integrat|connect|crm|hook)/i,"deploy"],
 [/(just one|only one|one agent|two agents|1 agent|2 agents|small|start)/i,"one"],
 [/(100|hundred|army|lots|many|how many|fleet|scale)/i,"many"],
 [/(reception|phone|call|answer)/i,"recep"],
 [/(safe|secur|privacy|data|approve|trust|risk|wrong)/i,"safe"],
 [/(subscri|lease|own|buyout|monthly)/i,"own"],
 [/(how long|timeline|weeks|fast|when)/i,"time"],
 [/(what is|what's an|chatbot|explain|agent do|difference)/i,"what"],
 [/(life|personal|family|bills|home life)/i,"life"],
 [/(human|person|talk|contact|zach|email|reach)/i,"human"],
 [/(save time|hours|time back|calculator)/i,"time2"],
 [/(industr|contractor|real estate|ecommerce|law|agency|plumb|roof)/i,"ind"],
 [/(guarantee|promise|results|roi)/i,"promise"],
 [/^(hi|hey|hello|yo|sup)/i,"hi"]
];
var QR=[["What does it cost?","price"],["Can I buy just one?","one"],["Who handles deployment?","deploy"],["Is it safe?","safe"],["Talk to a human","human"]];

var w=document.createElement("div");w.className="rv";
w.innerHTML='<div class="rv__bub" aria-hidden="true">Need a hand building your army?</div><button class="rv__tab" type="button" aria-label="Chat with Rivet, the Factory Foreman">'+rivet()+'</button>'+
'<div class="rv__pan" role="dialog" aria-label="Rivet, the Factory Foreman"><div class="rv__hd">'+rivet(true)+'<div><b>Rivet</b><small>Factory Foreman · quick answers</small></div><button class="rv__x" type="button" aria-label="Close chat">×</button></div>'+
'<div class="rv__log" aria-live="polite"></div><div class="rv__qr"></div><form class="rv__in"><input type="text" placeholder="Ask about agents, pricing…" aria-label="Type a question"><button type="submit">Send</button></form></div>';
document.body.appendChild(w);
var log=w.querySelector(".rv__log"),qr=w.querySelector(".rv__qr"),inp=w.querySelector("input"),started=false;
function add(html,who){var m=document.createElement("div");m.className="rv__m "+who;if(who==="u")m.textContent=html;else m.innerHTML=html;log.appendChild(m);log.scrollTop=log.scrollHeight;return m;}
function say(key){var t=add('<span class="rv__dots"><i></i><i></i><i></i></span>',"b");setTimeout(function(){t.innerHTML=A[key];log.scrollTop=log.scrollHeight;},RM?0:550);}
function ask(text){add(text,"u");var k="fb";for(var i=0;i<RULES.length;i++){if(RULES[i][0].test(text)){k=RULES[i][1];break;}}say(k);}
QR.forEach(function(q){var b=document.createElement("button");b.type="button";b.textContent=q[0];b.addEventListener("click",function(){add(q[0],"u");say(q[1]);});qr.appendChild(b);});
function open(){w.classList.add("open");if(!started){started=true;say("hi");}setTimeout(function(){inp.focus()},50);}
w.querySelector(".rv__tab").addEventListener("click",open);
w.querySelector(".rv__x").addEventListener("click",function(){w.classList.remove("open");w.querySelector(".rv__tab").focus();});
w.querySelector("form").addEventListener("submit",function(e){e.preventDefault();var v=inp.value.trim();if(!v)return;inp.value="";ask(v);});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&w.classList.contains("open"))w.classList.remove("open");});
var bub=w.querySelector(".rv__bub");
setTimeout(function(){if(!started){bub.classList.add("on");setTimeout(function(){bub.classList.remove("on")},6000);}},9000);
})();
