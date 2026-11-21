const CONFIG = window.CONFIG;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const d=new Date(CONFIG.weddingISO);
const pad=n=>String(n).padStart(2,"0");
CONFIG.dateDots=`${pad(d.getDate())} · ${pad(d.getMonth()+1)} · ${d.getFullYear()}`;
CONFIG.namesShort=`${CONFIG.groom} & ${CONFIG.bride}`;
CONFIG.dateSlash=`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
const MAIN=CONFIG.events[CONFIG.mainEvent];CONFIG.mainTime=MAIN.time;CONFIG.mainName=MAIN.name;

$$("[data-k]").forEach(el=>{const v=CONFIG[el.dataset.k]; if(v!=null) el.textContent=v;});
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
$$(".host-addr").forEach(el=>{if(el.textContent.includes("…"))el.style.display="none"});
$$(".host-addr").forEach(el=>{const t=el.textContent,i=t.lastIndexOf(",");if(i>0)el.innerHTML=`<span>${esc(t.slice(0,i+1))}</span><span>${esc(t.slice(i+1).trim())}</span>`});
const HEART=`<svg class="hrt" viewBox="0 0 24 22" aria-label="và"><path d="M12 20.3S2.2 14 2.2 7.6A4.9 4.9 0 0 1 12 5.4a4.9 4.9 0 0 1 9.8 2.2c0 6.4-9.8 12.7-9.8 12.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
$$('[data-k="namesShort"]').forEach(el=>el.innerHTML=esc(CONFIG.groom)+' '+HEART+' '+esc(CONFIG.bride));
const mapUrl=k=>CONFIG[k.replace("Addr","Map")]||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CONFIG[k]);
$$("[data-map]").forEach(a=>a.href=mapUrl(a.dataset.map));

/* Guest name via #ten-khach  e.g. ...#Anh-Tuan */
try{const h=decodeURIComponent(location.hash.slice(1)); if(h && !["top","essentials","invite","couple","events","gallery","rsvp","gift"].includes(h)){const g=h.replace(/-/g," ");$("#inviteGuest").textContent=g;}}catch(e){}

/* Âm lịch (thuật toán Hồ Ngọc Đức, múi giờ +7) */
const INT=Math.floor,TZ=7;
function jdFromDate(dd,mm,yy){const a=INT((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;let jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-INT(y/100)+INT(y/400)-32045;if(jd<2299161)jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-32083;return jd}
function newMoon(k){const T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180,sin=Math.sin;let Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;Jd1+=0.00033*sin((166.56+132.87*T-0.009173*T2)*dr);
 const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3,Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3,F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
 let C1=(0.1734-0.000393*T)*sin(M*dr)+0.0021*sin(2*dr*M);C1-=0.4068*sin(Mpr*dr)+0.0161*sin(dr*2*Mpr);C1-=0.0004*sin(dr*3*Mpr);C1+=0.0104*sin(dr*2*F)-0.0051*sin(dr*(M+Mpr));C1-=0.0074*sin(dr*(M-Mpr))+0.0004*sin(dr*(2*F+M));C1-=0.0004*sin(dr*(2*F-M))-0.0006*sin(dr*(2*F+Mpr));C1+=0.0010*sin(dr*(2*F-Mpr))+0.0005*sin(dr*(2*Mpr+M));
 const dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;return INT(Jd1+C1-dt+0.5+TZ/24)}
function sunLong(jdn){const T=(jdn-2451545.5-TZ/24)/36525,T2=T*T,dr=Math.PI/180,M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2,L0=280.46645+36000.76983*T+0.0003032*T2;
 let DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);DL+=(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);let L=(L0+DL)*dr;L=L-Math.PI*2*INT(L/(Math.PI*2));return INT(L/Math.PI*6)}
function month11(yy){const off=jdFromDate(31,12,yy)-2415021,k=INT(off/29.530588853);let nm=newMoon(k);if(sunLong(nm)>=9)nm=newMoon(k-1);return nm}
function leapOff(a11){const k=INT((a11-2415021.076998695)/29.530588853+0.5);let last=0,i=1,arc=sunLong(newMoon(k+i));do{last=arc;i++;arc=sunLong(newMoon(k+i))}while(arc!=last&&i<14);return i-1}
function solar2lunar(dd,mm,yy){const dn=jdFromDate(dd,mm,yy),k=INT((dn-2415021.076998695)/29.530588853);let ms=newMoon(k+1);if(ms>dn)ms=newMoon(k);let a11=month11(yy),b11=a11,ly;
 if(a11>=ms){ly=yy;a11=month11(yy-1)}else{ly=yy+1;b11=month11(yy+1)}const ld=dn-ms+1,diff=INT((ms-a11)/29);let lm=diff+11,leap=0;
 if(b11-a11>365){const lo=leapOff(a11);if(diff>=lo){lm=diff+10;if(diff==lo)leap=1}}if(lm>12)lm-=12;if(lm>=11&&diff<4)ly-=1;return[ld,lm,ly,leap]}
const CAN=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"],CHI=["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const WEEKDAYS=["Chủ nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
function lunarText(dt){const[l,m,y,lp]=solar2lunar(dt.getDate(),dt.getMonth()+1,dt.getFullYear());return `Nhằm ngày ${pad(l)} tháng ${pad(m)}${lp?" nhuận":""} năm ${CAN[(y+6)%10]} ${CHI[(y+8)%12]}`}

/* Lịch tháng */
(function(){const cd=CONFIG.calendarDays.map(x=>({...x,d:new Date(x.date+"T00:00:00")}));const base=new Date(CONFIG.weddingISO);const Y=base.getFullYear(),M=base.getMonth();
 const marked=new Set(cd.filter(x=>x.d.getFullYear()===Y&&x.d.getMonth()===M).map(x=>x.d.getDate()));
 const first=(new Date(Y,M,1).getDay()+6)%7,days=new Date(Y,M+1,0).getDate();
 const heart='<svg viewBox="0 0 48 44"><path d="M24 41S3 28 3 14.5C3 7.5 8.5 3 14.5 3c4.3 0 7.6 2.4 9.5 5.6C25.9 5.4 29.2 3 33.5 3 39.5 3 45 7.5 45 14.5 45 28 24 41 24 41z" fill="#fde6ee" stroke="var(--primary)" stroke-width="2.2" stroke-linejoin="round"/></svg>';
 let h=`<h3>Tháng ${pad(M+1)}<i>-</i>${Y}</h3><div class="calgrid">`+["T2","T3","T4","T5","T6","T7","CN"].map((t,i)=>`<div class="dh${i==6?" sun":""}">${t}</div>`).join("");
 for(let i=0;i<first;i++)h+='<div class="dd"></div>';
 for(let d=1;d<=days;d++){const sun=(first+d-1)%7===6,hl=marked.has(d);h+=`<div class="dd${sun?" sun":""}${hl?" hl":""}">${hl?heart:""}<b>${d}</b></div>`}
 h+='</div><div class="callegend">'+cd.map(x=>`<span>${pad(x.d.getDate())}/${pad(x.d.getMonth()+1)} · ${x.label}</span>`).join("")+'</div>';
 document.getElementById("calendar").innerHTML=h})();


/* Lưu vào Google Calendar */
function gcal(e){const st=new Date(`${e.date}T${e.time}:00+07:00`),en=new Date(st.getTime()+3*3600e3);
  const f=x=>x.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(`${e.name} · ${CONFIG.namesShort}`)+
    "&dates="+f(st)+"/"+f(en)+"&location="+encodeURIComponent(CONFIG[e.addrKey])+"&details="+encodeURIComponent("Thiệp mời nhà trai · "+CONFIG.namesShort)}
(function(){const ed=new Date(MAIN.date+"T00:00:00");
  $("#essWhen").textContent=`${MAIN.time} · ${WEEKDAYS[ed.getDay()]}, ${pad(ed.getDate())}/${pad(ed.getMonth()+1)}/${ed.getFullYear()}`;
  $("#essLunar").textContent=`${lunarText(ed)} · ${MAIN.welcome}`;$("#essCal").href=gcal(MAIN)})();

/* Thanh thao tác nhanh: hiện sau khi lướt qua phần đầu */
const bar=$("#actionbar");let barOn=false,barTick=false;addEventListener("scroll",()=>{if(barTick)return;barTick=true;requestAnimationFrame(()=>{barTick=false;const on=scrollY>innerHeight*.6&&!document.body.classList.contains("locked");if(on!==barOn){barOn=on;bar.classList.toggle("show",on)}})},{passive:true});

/* Events */
const months=["Tháng 01","Tháng 02","Tháng 03","Tháng 04","Tháng 05","Tháng 06","Tháng 07","Tháng 08","Tháng 09","Tháng 10","Tháng 11","Tháng 12"];
$("#eventList").innerHTML=CONFIG.events.map(e=>{const ed=new Date(e.date+"T00:00:00");
  return `<article class="event reveal"><div class="top"><small>${e.sub}</small><h3>${e.name}</h3></div>
  <div class="body">
  <div class="cal"><div class="side">${months[ed.getMonth()]}</div><div class="day">${pad(ed.getDate())}</div><div class="side">${ed.getFullYear()}</div></div>
  <div class="time">${e.time}</div><div class="welcome">${e.welcome}</div><div class="lunar">${WEEKDAYS[ed.getDay()]} · ${lunarText(ed)}</div>
  <div class="place"><b>${e.place}</b><span>${CONFIG[e.addrKey]}</span></div>
  <div class="acts"><a class="btn sm ghost" target="_blank" rel="noopener" href="${gcal(e)}">Lưu vào lịch</a></div></div></article>`}).join("");

/* Gallery placeholders */
const hs=[230,170,270,190,240,180,210,250,180,220];
$("#gal").innerHTML=hs.map((h,i)=>`<div class="g" data-i="${i}"><div class="photo" style="height:${h}px;background:linear-gradient(${120+i*25}deg,#fde2eb,#fbeee6)"><div><div class="mono" style="font-size:36px">♡</div><div class="hint">Ảnh ${pad(i+1)}</div></div></div></div>`).join("");
$$("#gal .g").forEach(g=>g.onclick=()=>{$("#lbPhoto").innerHTML=g.querySelector(".photo").innerHTML;$("#lb").classList.add("open")});
$("#lb").onclick=()=>$("#lb").classList.remove("open");

/* Countdown */
function tick(){if(document.hidden){setTimeout(tick,1000);return}let ms=d-new Date();
  if(ms<=0){$("#cd").innerHTML='<div style="width:auto;padding:20px 30px"><b style="font-size:30px">Hôm nay là ngày hạnh phúc!</b></div>';return}
  const s=Math.floor(ms/1000);$("#cdD").textContent=Math.floor(s/86400);$("#cdH").textContent=pad(Math.floor(s%86400/3600));
  $("#cdM").textContent=pad(Math.floor(s%3600/60));$("#cdS").textContent=pad(s%60);setTimeout(tick,1000)}
tick();

/* Reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

/* Opener */
let opening=false;
function openCard(){if(opening)return;opening=true;const o=$("#opener");playMusic();
  o.classList.add("opened");
  setTimeout(()=>{o.classList.add("stage2");burst(14)},450);
  setTimeout(()=>{tossFlowers();},2000);
  setTimeout(()=>{document.body.classList.remove("locked");o.classList.add("gone");setTimeout(()=>o.style.display="none",900);},2400);
  setTimeout(startPetals,4000);}
/* Tung hoa: cánh hoa bung mạnh từ giữa thiệp ra khắp màn hình */
function tossFlowers(){const n=matchMedia("(prefers-reduced-motion: reduce)").matches?50:150,cx=innerWidth/2,cy=innerHeight/2,R=Math.hypot(innerWidth,innerHeight)*.75;
  const box=document.createElement("div");box.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden";document.body.appendChild(box);
  for(let i=0;i<n;i++){const p=document.createElement("i");p.className="petal";const sc=.9+Math.random()*1.6;
    p.style.cssText=`position:absolute;left:${cx}px;top:${cy}px;width:${16*sc}px;height:${18*sc}px;margin:${-9*sc}px 0 0 ${-8*sc}px;background-image:url("${GEMS[i%GEMS.length]}")`;
    box.appendChild(p);
    const a=Math.random()*Math.PI*2,r=R*(.45+Math.random()*.7),dx=Math.cos(a)*r,dy=Math.sin(a)*r,rot=(Math.random()*2-1)*720,d=2400+Math.random()*1200,dl=Math.random()*250;
    p.animate([{transform:"translate3d(0,0,0) rotate(0deg) scale(.3)",opacity:0},{offset:.12,opacity:1},
      {transform:`translate3d(${dx*.75}px,${dy*.75}px,0) rotate(${rot*.7}deg) scale(1)`,opacity:1,offset:.6},
      {transform:`translate3d(${dx}px,${dy+120}px,0) rotate(${rot}deg) scale(.9)`,opacity:0}],{duration:d,delay:dl,easing:"cubic-bezier(.15,.7,.35,1)",fill:"forwards"});}
  setTimeout(()=>box.remove(),4200)}
$("#env").onclick=openCard;
function burst(n){for(let i=0;i<n;i++){const p=document.createElement("i");p.className="petal";p.style.backgroundImage=`url("${GEMS[i%GEMS.length]}")`;
  const sc=.7+Math.random()*.8;p.style.width=16*sc+"px";p.style.height=18*sc+"px";p.style.left="50vw";p.style.top="45vh";p.style.zIndex=101;p.style.position="fixed";
  p.style.animation="none";p.style.transition="transform 1.6s cubic-bezier(.2,.8,.3,1),opacity 1.6s";document.body.appendChild(p);
  const ang=Math.random()*Math.PI*2,r=120+Math.random()*180;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.transform=`translate(${Math.cos(ang)*r}px,${Math.sin(ang)*r-60}px) rotate(${Math.random()*540}deg)`;p.style.opacity=0}));
  setTimeout(()=>p.remove(),1800)}}


/* Nhạc nền: bắt đầu khi khách mở thiệp (trình duyệt chỉ cho phát nhạc sau một lần chạm) */
const bgm=$("#bgm"),musicBtn=$("#musicBtn");let musicWanted=true,fadeT=null;
function setMusicUI(on){musicBtn.classList.toggle("playing",on);musicBtn.classList.toggle("off",!on)}
function playMusic(){clearInterval(fadeT);bgm.volume=0;const pr=bgm.play();if(pr)pr.catch(()=>setMusicUI(false));
  fadeT=setInterval(()=>{bgm.volume=Math.min(.6,bgm.volume+.03);if(bgm.volume>=.6)clearInterval(fadeT)},100)}
bgm.addEventListener("play",()=>setMusicUI(true));bgm.addEventListener("pause",()=>setMusicUI(false));
musicBtn.onclick=()=>{if(bgm.paused){musicWanted=true;playMusic()}else{musicWanted=false;bgm.pause()}};
document.addEventListener("visibilitychange",()=>{if(document.hidden)bgm.pause();else if(musicWanted&&!document.body.classList.contains("locked"))playMusic()});

/* Petals */
const GEMS=["data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2040%2044%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%22.35%22%20cy%3D%22.3%22%20r%3D%22.9%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23ffd3df%22/%3E%3Cstop%20offset%3D%22.6%22%20stop-color%3D%22%23f27a9d%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23c93a66%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath%20d%3D%22M20%2043C8%2036%201%2025%203%2014%205%205%2012%201%2018%204c1%20.6%202%20.6%203%200C27%200%2036%203%2038%2012c2%2012-6%2024-18%2031z%22%20fill%3D%22url%28%23g%29%22/%3E%3Cpath%20d%3D%22M20%2041c-2-9-2-20%201-33%22%20stroke%3D%22%23c93a66%22%20stroke-width%3D%22.7%22%20fill%3D%22none%22%20opacity%3D%22.35%22/%3E%3Cpath%20d%3D%22M9%2010c3-3%207-3%209-1%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20opacity%3D%22.45%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2040%2044%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%22.35%22%20cy%3D%22.3%22%20r%3D%22.9%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23ffe4ec%22/%3E%3Cstop%20offset%3D%22.6%22%20stop-color%3D%22%23f5a3bb%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e0688d%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath%20d%3D%22M20%2043C8%2036%201%2025%203%2014%205%205%2012%201%2018%204c1%20.6%202%20.6%203%200C27%200%2036%203%2038%2012c2%2012-6%2024-18%2031z%22%20fill%3D%22url%28%23g%29%22/%3E%3Cpath%20d%3D%22M20%2041c-2-9-2-20%201-33%22%20stroke%3D%22%23e0688d%22%20stroke-width%3D%22.7%22%20fill%3D%22none%22%20opacity%3D%22.35%22/%3E%3Cpath%20d%3D%22M9%2010c3-3%207-3%209-1%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20opacity%3D%22.45%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2040%2044%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%22.35%22%20cy%3D%22.3%22%20r%3D%22.9%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23ffc2d1%22/%3E%3Cstop%20offset%3D%22.6%22%20stop-color%3D%22%23e5577f%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23b02a55%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath%20d%3D%22M20%2043C8%2036%201%2025%203%2014%205%205%2012%201%2018%204c1%20.6%202%20.6%203%200C27%200%2036%203%2038%2012c2%2012-6%2024-18%2031z%22%20fill%3D%22url%28%23g%29%22/%3E%3Cpath%20d%3D%22M20%2041c-2-9-2-20%201-33%22%20stroke%3D%22%23b02a55%22%20stroke-width%3D%22.7%22%20fill%3D%22none%22%20opacity%3D%22.35%22/%3E%3Cpath%20d%3D%22M9%2010c3-3%207-3%209-1%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20opacity%3D%22.45%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2040%2044%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%22.35%22%20cy%3D%22.3%22%20r%3D%22.9%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23fff0f4%22/%3E%3Cstop%20offset%3D%22.6%22%20stop-color%3D%22%23f8bfd0%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23ee8eab%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath%20d%3D%22M20%2043C8%2036%201%2025%203%2014%205%205%2012%201%2018%204c1%20.6%202%20.6%203%200C27%200%2036%203%2038%2012c2%2012-6%2024-18%2031z%22%20fill%3D%22url%28%23g%29%22/%3E%3Cpath%20d%3D%22M20%2041c-2-9-2-20%201-33%22%20stroke%3D%22%23ee8eab%22%20stroke-width%3D%22.7%22%20fill%3D%22none%22%20opacity%3D%22.35%22/%3E%3Cpath%20d%3D%22M9%2010c3-3%207-3%209-1%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.6%22%20fill%3D%22none%22%20opacity%3D%22.45%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E"];
let petalTimer=null;
function spawn(){if(document.hidden||$("#petals").childElementCount>=18)return;const p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"%";
  const dur=(8+Math.random()*7)*1000,dx=Math.random()*200-100,rot=Math.random()*900-450,sc=.6+Math.random()*.9;
  p.style.width=16*sc+"px";p.style.height=18*sc+"px";p.style.backgroundImage=`url("${GEMS[Math.floor(Math.random()*GEMS.length)]}")`;
  $("#petals").appendChild(p);
  p.animate([{transform:"translate3d(0,0,0) rotate(0deg)"},{transform:`translate3d(${dx}px,${innerHeight+60}px,0) rotate(${rot}deg)`}],{duration:dur,easing:"linear",fill:"forwards"}).onfinish=()=>p.remove();
  p.animate([{translate:"0 0"},{translate:"40px 0"}],{duration:3000,easing:"ease-in-out",direction:"alternate",iterations:Infinity});}
function startPetals(){if(!petalTimer){petalTimer=setInterval(spawn,matchMedia("(prefers-reduced-motion: reduce)").matches?1600:700);$("#petalBtn").classList.remove("off")}}
function stopPetals(){clearInterval(petalTimer);petalTimer=null;$("#petalBtn").classList.add("off")}
$("#petalBtn").onclick=()=>petalTimer?stopPetals():startPetals();

/* Toast + copy */
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
async function copy(t){try{await navigator.clipboard.writeText(t);toast("Đã sao chép ♡")}catch(e){toast("Không sao chép được — bạn chép tay giúp nhé")}}
$$("[data-copy]").forEach(b=>b.onclick=()=>copy(CONFIG[b.dataset.copy]));

/* Gift toggle */
$("#giftBtn").onclick=()=>{$("#gifts").classList.toggle("open")};

/* RSVP */
$$('input[name=att]').forEach(r=>r.onchange=()=>{const yes=$('input[name=att]:checked').value==="Có, tôi sẽ đến";$("#evField").style.display=$("#numField").style.display=yes?"":"none"});
$("#rsvpForm").onsubmit=e=>{e.preventDefault();
  const yes=$('input[name=att]:checked').value==="Có, tôi sẽ đến";
  const msg=`💌 Hồi âm thiệp mời nhà trai · ${CONFIG.namesShort}\nTên: ${$("#rName").value}\nTham dự: ${$('input[name=att]:checked').value}`+
    (yes?`\nSự kiện: ${$("#rEvent").value}\nSố người: ${$("#rNum").value}`:"")+
    ($("#rMsg").value.trim()?`\nLời nhắn: ${$("#rMsg").value.trim()}`:"");
  $("#msgbox").textContent=msg;$("#rsvpForm").style.display="none";$("#rsvpDone").style.display="block";
  $("#copyMsg").onclick=()=>copy(msg)};

/* Wishes (hiển thị trên máy người xem) */
$("#wishBtn").onclick=()=>{const t=$("#wishText").value.trim();if(!t){toast("Bạn viết vài dòng nhé ♡");return}
  const el=document.createElement("div");el.textContent="💌 "+t;$("#wishes").prepend(el);$("#wishText").value="";
  for(let i=0;i<14;i++)setTimeout(()=>{const h=document.createElement("i");h.textContent="♡";h.style.cssText=`position:fixed;left:${Math.random()*100}vw;bottom:-20px;color:#d0587e;font-size:${14+Math.random()*16}px;z-index:99;transition:3s ease-out;pointer-events:none;font-style:normal`;
    document.body.appendChild(h);requestAnimationFrame(()=>{h.style.transform=`translateY(-${60+Math.random()*40}vh)`;h.style.opacity=0});setTimeout(()=>h.remove(),3200)},i*80);
  toast("Đã gửi ngàn trái tim ♡")};
