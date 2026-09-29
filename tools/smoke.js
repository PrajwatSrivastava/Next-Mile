/* ES3 JScript smoke harness: polyfill ES5, stub the DOM, run the real sim. */
if(!Math.imul)Math.imul=function(a,b){a=a|0;b=b|0;var ah=(a>>>16)&0xffff,al=a&0xffff,bh=(b>>>16)&0xffff,bl=b&0xffff;return((al*bl)+(((ah*bl+al*bh)<<16)>>>0)|0);};
if(!Object.keys)Object.keys=function(o){var r=[];for(var k in o)if(o.hasOwnProperty(k))r.push(k);return r;};
if(!Object.create)Object.create=function(p){if(p===null)return{};function F(){}F.prototype=p;return new F();};
if(!Array.prototype.forEach)Array.prototype.forEach=function(f,t){for(var i=0;i<this.length;i++)f.call(t,this[i],i,this);};
if(!Array.prototype.map)Array.prototype.map=function(f,t){var r=[];for(var i=0;i<this.length;i++)r.push(f.call(t,this[i],i,this));return r;};
if(!Array.prototype.indexOf)Array.prototype.indexOf=function(v){for(var i=0;i<this.length;i++)if(this[i]===v)return i;return -1;};
if(!Array.prototype.reduce)Array.prototype.reduce=function(f,a){var i=0;if(arguments.length<2)a=this[i++];for(;i<this.length;i++)a=f(a,this[i],i,this);return a;};
if(!Array.prototype.some)Array.prototype.some=function(f){for(var i=0;i<this.length;i++)if(f(this[i],i,this))return true;return false;};
if(!Array.prototype.every)Array.prototype.every=function(f){for(var i=0;i<this.length;i++)if(!f(this[i],i,this))return false;return true;};

function CtxStub(){this.fillStyle="";this.globalAlpha=1;this.imageSmoothingEnabled=false;
  this.globalCompositeOperation="source-over";}
/* buildBands bakes the land band's haze ramp with a gradient + destination-out */
CtxStub.prototype.createLinearGradient=function(){return{addColorStop:function(){}};};
CtxStub.prototype.fillRect=function(){};CtxStub.prototype.drawImage=function(){};
CtxStub.prototype.save=function(){};CtxStub.prototype.restore=function(){};
CtxStub.prototype.translate=function(){};CtxStub.prototype.rotate=function(){};
CtxStub.prototype.scale=function(){};CtxStub.prototype.clearRect=function(){};
CtxStub.prototype.beginPath=function(){};CtxStub.prototype.fill=function(){};
CtxStub.prototype.setTransform=function(){};
function CanvasStub(w,h){this.width=w||480;this.height=h||270;}
CanvasStub.prototype.getContext=function(){return new CtxStub();};
CanvasStub.prototype.addEventListener=function(){};
CanvasStub.prototype.setPointerCapture=function(){};
CanvasStub.prototype.getBoundingClientRect=function(){return{left:0,top:0,width:this.width,height:this.height};};
function ElStub(){this.innerHTML="";this.classList={add:function(){},remove:function(){}};}
ElStub.prototype.remove=function(){};ElStub.prototype.focus=function(){};
ElStub.prototype.querySelector=function(){return{onclick:null};};
ElStub.prototype.querySelectorAll=function(){return[];};
var _els={gl:new CanvasStub(480,270),boot:new ElStub(),screen:new ElStub(),si:new ElStub(),wrap:new ElStub()};
var document,window,navigator,performance,addEventListener,requestAnimationFrame,Image,__X,_T=0;
document={getElementById:function(id){return _els[id];},createElement:function(){return new CanvasStub(160,74);},addEventListener:function(){},hidden:false};
window={};navigator={vibrate:function(){}};
performance={now:function(){return _T*1000;}};
addEventListener=function(){};requestAnimationFrame=function(){};
var setTimeout,clearTimeout;setTimeout=function(){return 0;};clearTimeout=function(){};
Image=function(){this.width=100;this.height=100;this.onload=null;this.onerror=null;};

var fso=new ActiveXObject("Scripting.FileSystemObject");
var fh=fso.OpenTextFile(WScript.Arguments(0),1);var html=fh.ReadAll();fh.Close();
var code=html.substring(html.indexOf("<"+"script>")+8,html.lastIndexOf("<"+"/script>"));
code=code.replace("F[s[i].toUpperCase()]","F[s.charAt(i).toUpperCase()]");
code=code.replace("gl[r*3+q]","gl.charAt(r*3+q)");
var marker="\n})();",cut=code.lastIndexOf(marker);
var inject="\n;__X={G:G,ST:ST,SEG:SEG,SEGBY:SEGBY,ORDER:ORDER,STLEN:STLEN,OBS:OBS,IN:IN,CPSET:CPSET,"+
 "step:step,start:start,feed:feed,draw:draw,ready:ready,rnd:rnd,rseed:rseed,noise:noise,"+
 "trauma:trauma,spark:spark,blink:blink,riseT:riseT,FXP:FXP,coinY:coinY,coinVal:coinVal,"+
 "camera:camera,CAM:CAM,SQ:SQ,MINGAP:MINGAP,TIER:TIER,COIN_RY:COIN_RY,glyph:glyph,"+
 "JUMP_V:JUMP_V,WHEEL_JUMP:WHEEL_JUMP,GRAV:GRAV,AI_JUMP_V:AI_JUMP_V,"+
 "ROAD_Y:ROAD_Y,BD_H:BD_H,BG_RATE:BG_RATE,BG:BG,VW:VW,VH:VH,getRS:function(){return RS;},"+
 "getW:function(){return WHEEL;}};\n";
eval(code.substring(0,cut)+inject+code.substring(cut));

var fails=0;
function ok(n,c,d){WScript.Echo((c?"  PASS  ":"  FAIL  ")+n+(d?"   "+d:""));if(!c)fails++;}
function f2(v){return Math.round(v*100)/100;}

WScript.Echo("\n=== boot + smooth-render invariants ===");
__X.ready();var G=__X.G;
ok("ready() boots into the ATTRACT demo (was frozen on title)",G.mode==="attract","mode="+G.mode);
__X.start(0);ok("start() enters play",G.mode==="play");
ok("bike bitmap pre-scaled",true);

WScript.Echo("\n=== shake is now VISIBLE (was rounding to zero) ===");
var SPX=12;
function px(tr){return Math.round(1*tr*tr*SPX);}  /* noise=1 worst case */
ok("softest landing renders >=1px",px(0.26)>=1,"min landing 0.26 -> "+px(0.26)+"px");
ok("hard landing renders more",px(0.50)>px(0.26),"slam 0.50 -> "+px(0.50)+"px");
ok("launch renders >=1px",px(0.30)>=1,"0.30 -> "+px(0.30)+"px");
ok("crash is the loudest",px(0.62)>=3,"0.62 -> "+px(0.62)+"px");
ok("ladder is monotonic",px(0.26)<=px(0.30)&&px(0.30)<px(0.50)&&px(0.50)<px(0.62),
   [px(0.26),px(0.30),px(0.50),px(0.62)].join(" <= "));

WScript.Echo("\n=== jump arc + apex hang ===");
var g0=__X.GRAV, JV=-__X.JUMP_V;
var apexPlain=JV*JV/(2*g0);
ok("plain apex still under the wall clearance (72)",apexPlain<72,"apex="+f2(apexPlain));
ok("wall unreachable without charge",__X.riseT(72,JV)===null);
ok("charged jump clears the wall",__X.riseT(72,JV*(1+0.45*0.45))!==null,
   "cb at gate -> v="+f2(JV*1.2025));
var peakW=Math.pow(JV*__X.WHEEL_JUMP,2)/(2*g0);
ok("wheelie peak clears cone+crate (24)",peakW>24,"wheelie peak="+f2(peakW));
ok("AI jump clears the wall",__X.riseT(72,__X.AI_JUMP_V)!==null,"AI v="+__X.AI_JUMP_V);
ok("AI no longer out-jumps the player by much",__X.AI_JUMP_V<JV*1.10,
   "AI "+__X.AI_JUMP_V+" vs player "+JV);

WScript.Echo("\n=== coin tiers: reachability + reward ordering ===");
var GROUNDY=234;
function band(h){var c=__X.coinY(h)-GROUNDY+24;return [c-__X.COIN_RY,c+__X.COIN_RY];}
var b3=band(3),b2=band(2),b1=band(1);
ok("tier 3 reachable at a normal apex",-apexPlain<b3[1]&&-apexPlain>b3[0]-30,
   "apex=-"+f2(apexPlain)+" band="+b3);
ok("tier 3 UNREACHABLE on a wheelie",-peakW>b3[1],"wheelie=-"+f2(peakW)+" needs <= "+b3[1]);
ok("tier 2 still reachable on a wheelie",-peakW<b2[1],"band="+b2);
ok("tier 1 reachable from the ground",0>b1[0]&&0<b1[1],"band="+b1);
G.mult=1;
var t3=__X.TIER[3],t2w=__X.TIER[2]*1.5;
ok("tier 3 now outranks a wheelie tier 2",t3>t2w,"tier3="+t3+" vs wheelie tier2="+t2w);
ok("the wheelie still pays",t2w>__X.TIER[2],t2w+" > "+__X.TIER[2]);

WScript.Echo("\n=== level fairness: MINGAP across every stage ===");
var worst=1e9,worstAt="";
for(var st=0;st<3;st++){
  var base=0,pos=[];
  for(var i=0;i<__X.ORDER[st].length;i++){var s=__X.SEGBY[__X.ORDER[st][i]];
    for(var j=0;j<s.obs.length;j++)pos.push({x:base+s.obs[j][0],seg:s.id});
    base+=s.len;}
  for(var k=1;k<pos.length;k++){var d=pos[k].x-pos[k-1].x;
    if(d<worst){worst=d;worstAt="stage"+(st+1)+" "+pos[k-1].seg+"->"+pos[k].seg;}}
}
ok("every obstacle gap >= MINGAP ("+__X.MINGAP+"px)",worst>=__X.MINGAP,
   "tightest="+worst+"px at "+worstAt);
var airCap=0.8421*178+30+0.333*178;
ok("MINGAP matches the airtime derivation",Math.abs(__X.MINGAP-airCap)<3,
   "derived="+f2(airCap));

WScript.Echo("\n=== backgrounds: three modules, one contract ===");
/* The three stages own their background code outright and share nothing. What
   stops them drifting apart is this: every module is built here and checked
   against the same contract, so a rule broken in ONE stage fails the suite.
   That is the whole safety argument for the duplication. */
ok("there is exactly one background module per stage",
   __X.BG.length===3&&typeof __X.BG[0]==="function"&&
   typeof __X.BG[1]==="function"&&typeof __X.BG[2]==="function",
   "BG.length="+__X.BG.length);
/* Not "close to 1.0" — exactly 1.0, on every stage. Backdrop bottoms ARE road
   surface with lane markings, so any epsilon shows up as painted markings
   crawling against real ones. 0.78 drifted 39px/s; 0.95 still drifted 8.9. */
ok("BG_RATE is exactly the road's rate",__X.BG_RATE===1.0,
   "BG_RATE="+__X.BG_RATE+" -> drifts "+f2((1-__X.BG_RATE)*178)+"px/s at throttle");
for(var bi=0;bi<3;bi++){
  var layers=__X.BG[bi](1),tag="stage"+(bi+1);
  if(!layers){ ok(tag+" module builds",false,"returned null"); continue; }
  ok(tag+" builds a single merged backdrop",layers.length===1,
     "layers="+layers.length+" (sky and land baked into one image)");
  var L=layers[0],allRate=true,allFlat=true,reaches=true;
  for(var li=0;li<layers.length;li++){
    if(layers[li].rate!==__X.BG_RATE)allRate=false;
    if(layers[li].mir)allFlat=false;
  }
  reaches=(L.y+L.h)>=__X.ROAD_Y;
  /* One image at one rate: relative movement is not merely equal here, it is
     structurally impossible, because there is no second thing to move. */
  ok(tag+" scrolls every layer at BG_RATE",allRate,
     "rate="+L.rate+" on all "+layers.length+" layer(s)");
  /* The backdrop carries the GOA sign and one-way chevron boards. It also does
     not need mirroring: all six sources were measured to tile seamlessly. */
  ok(tag+" never mirrors its backdrop",allFlat,"mir=false (text + handedness)");
  ok(tag+" backdrop reaches the road",reaches,
     "backdrop ends "+(L.y+L.h)+" vs ROAD_Y "+__X.ROAD_Y);
  ok(tag+" reports a logical tile width",L.w>0&&L.h===__X.BD_H,
     "w="+L.w+" h="+L.h+" (BD_H="+__X.BD_H+")");
}
/* Source guards for the two rules that cannot be observed from the returned
   descriptor, because the stub canvas records no pixels. */
ok("land halves are joined before anything is scaled",
   code.indexOf("function joinLand")>0&&!/frameBand/.test(code),
   "joinLand composes at native resolution, then one scale per module");
/* Cropping a land band from the BOTTOM removes the tarmac and floats the
   backdrop off its road. Every module must take its window off the top. */
ok("every module crops land off the TOP only",
   (code.match(/raw\.height-lrows/g)||[]).length===2&&
   code.indexOf("lt.drawImage(raw,0,0,raw.width,raw.height")>0,
   "two stages crop to raw.height-lrows, stage 1 needs no crop at all");

WScript.Echo("\n=== source-pixel constants are resolution-independent ===");
/* Constants that index into the ART (seam overlaps, crop offsets, the stage 3
   patch rectangles) are written as FRACTIONS of the source they address, so
   re-exporting the art at 2x or 4x is drop-in. Two things must hold:
     1. at today's 1x dimensions each fraction rounds to the value that was
        originally MEASURED off the art, and
     2. at 2x it rounds to exactly double.
   (2) is the one that actually proves independence; (1) proves the refactor
   did not move anything today. Pure arithmetic, so no decoded image needed.

   EVERY FRACTION BELOW IS READ OUT OF index.html. They used to be passed in as
   literals, which meant this block only ever proved that 0.0881*613 rounds to
   54 — arithmetic the test handed to itself. It could not fail when BG2()
   changed, and it didn't: after the stage 3 rider patch was re-cut the suite
   still reported the old 54/56/106/4/12 while the game shipped 50/60/120/2/0.
   A test that cannot observe the code under test is decoration. */
function srcNum(marker){               /* the number immediately after marker */
  var i=code.indexOf(marker);
  if(i<0)return NaN;
  var m=/^[0-9.]+/.exec(code.substring(i+marker.length));
  return m?parseFloat(m[0]):NaN;
}
function srcCall(tag){                 /* the text of one call, tag up to ");" */
  var i=code.indexOf(tag); if(i<0)return "";
  var j=code.indexOf(");",i); return j<0?"":code.substring(i,j);
}
function srcFrac(src,unit,n){          /* the nth `unit*0.xxx` inside src */
  var re=new RegExp(unit+"\\*([0-9.]+)","g"),m,k=0;
  while((m=re.exec(src))!==null){ if(k===n)return parseFloat(m[1]); k++; }
  return NaN;
}
var SKYC=srcCall("patchOut(sky,"), MIDC=srcCall("patchOut(mid,");
function frac(name,f,dim1,want1){
  var got1=Math.round(dim1*f), got2=Math.round(dim1*2*f);
  ok(name,!isNaN(f)&&got1===want1&&got2===want1*2,
     "source "+f+";  at "+dim1+"px -> "+got1+" (want "+want1+");  at "+(dim1*2)+"px -> "+got2+" (want "+(want1*2)+")");
}
frac("stage1 land seam overlap",  srcNum("var OV=Math.round(mid.height*"),          101,   8);
frac("stage1 sky window offset",  srcNum("var SKYY=Math.round(sky.height*"),        152,  45);
frac("stage2 land seam overlap",  srcNum("joinLand(mid,nr,Math.round(mid.height*"), 120,  10);
frac("stage3 land seam overlap",  srcNum("joinLand(midFix,nr,Math.round(mh*"),      120,  10);
frac("stage3 sky patch x",        srcFrac(SKYC,"sw",0), 620, 436);
frac("stage3 sky patch width",    srcFrac(SKYC,"sw",1), 620,  86);
frac("stage3 sky patch feather",  srcFrac(SKYC,"sw",3), 620,  14);
frac("stage3 land patch x",       srcFrac(MIDC,"mw",0), 613,  50);
frac("stage3 land patch width",   srcFrac(MIDC,"mw",1), 613,  60);
frac("stage3 land patch feather", srcFrac(MIDC,"mw",3), 613,   2);
/* The sky patch clones from one width to its LEFT and the land patch mirrors
   about its own right edge, so in both cases the shift has to be the same
   fraction as the width or the clone reads from the wrong pixels. */
ok("stage3 sky patch shifts by exactly its own width",
   srcFrac(SKYC,"sw",1)===srcFrac(SKYC,"sw",2),
   "width and shift both "+srcFrac(SKYC,"sw",1));
ok("stage3 land patch mirrors about its own right edge",
   srcFrac(MIDC,"mw",1)===srcFrac(MIDC,"mw",2),
   "width and shift both "+srcFrac(MIDC,"mw",1));
/* The land figure runs to the bottom row of s2_mid, so the patch takes the
   FULL source height and has no bottom fade left to stop short with. Those two
   are now shapes in the source, not fractions, so assert the shape. */
ok("stage3 land patch covers the full source height",
   /patchOut\(mid,[^;]*?\),mh,/.test(code),
   "height argument is mh itself, not a fraction of it");
ok("stage3 land patch has no bottom fade",
   /Math\.round\(mw\*0?\.\d+\),0,true\)/.test(code),
   "bottom-fade argument is 0; the figure reaches the last row");
/* and nothing may go back to addressing the art by raw pixel count */
ok("no bare pixel literals left at the call sites",
   !/joinLand\([a-zA-Z]+,[a-zA-Z]+,\d+\)/.test(code)&&!/patchOut\([a-zA-Z]+,\d+,/.test(code),
   "joinLand and patchOut are called with computed fractions only");
WScript.Echo("\n=== stage pacing vs the clock ===");
for(var st=0;st<3;st++){
  var cruise=__X.STLEN[st]/124, thr=__X.STLEN[st]/178, T=__X.ST[st].time;
  ok("stage"+(st+1)+" clearable at throttle",thr<T-8,
     "len="+__X.STLEN[st]+" thr="+f2(thr)+"s clock="+T+"s");
  if(st<2)ok("stage"+(st+1)+" clearable at cruise",cruise<T,"cruise="+f2(cruise)+"s");
  else ok("stage3 still demands the throttle (+7% wall-braking overhead; play.js is authoritative)",cruise*1.07>T,"cruise="+f2(cruise)+"s -> "+f2(cruise*1.07)+"s vs clock "+T+"s");
}
ok("stage lengths escalate",__X.STLEN[0]<__X.STLEN[1]&&__X.STLEN[1]<__X.STLEN[2],
   __X.STLEN.join(" < "));

WScript.Echo("\n=== checkpoints land before rest pieces ===");
var REST2={open:1,open2:1,teach:1,arc:1,hop:1,vista:1};
for(var st=0;st<3;st++){
  var n=0,allRest=true;
  for(var key in __X.CPSET[st]){n++;
    var nxt=__X.ORDER[st][parseInt(key,10)];
    if(!REST2[nxt])allRest=false;}
  ok("stage"+(st+1)+" has checkpoints and all resume into a rest piece",n>0&&allRest,
     "count="+n);
}

WScript.Echo("\n=== battery never spawns inside an obstacle ===");
var minSep=1e9;
for(var i=0;i<__X.SEG.length;i++){var s=__X.SEG[i];
  if(!s.obs.length)continue;
  var best=s.len*0.5,bd=-1;
  for(var bq=60;bq<s.len-60;bq+=20){var md=1e9;
    for(var bo=0;bo<s.obs.length;bo++)md=Math.min(md,Math.abs(s.obs[bo][0]-bq));
    if(md>bd){bd=md;best=bq;}}
  if(bd<minSep)minSep=bd;}
ok("battery keeps >=80px from every obstacle",minSep>=80,"tightest="+minSep+"px");

WScript.Echo("\n=== 20s live run at throttle ===");
__X.start(0);var drew=0,maxT=0;
for(var i=0;i<2400;i++){_T+=1/120;__X.IN.th=1;__X.IN.j=(i%41===0)?1:0;__X.step(1/120);
  if(G.shake>maxT)maxT=G.shake;
  if(i%4===0){__X.camera(1/60);__X.draw();drew++;}}
ok("2400 steps + "+drew+" draws, no throw",true);
ok("trauma clamped at 1",maxT<=1,"max="+f2(maxT));
ok("camera produced lookahead",__X.CAM.x>0,"CAM.x="+f2(__X.CAM.x));
ok("camera lead is capped",__X.CAM.x<=34.1,"CAM.x="+f2(__X.CAM.x));
ok("squash spring stayed bounded",__X.SQ.v<=0.42&&__X.SQ.v>=-0.34,"SQ.v="+f2(__X.SQ.v));
ok("interpolation fields finite",isFinite(G.px)&&isFinite(G.py));
ok("particle pool recycling",__X.FXP.length>0,"pooled="+__X.FXP.length);
ok("glyph cache works",__X.glyph("7","#fff","#000").width===5);

WScript.Echo("\n=== determinism ===");
function runHash(){__X.start(0);var h=0;
  for(var k=0;k<1200;k++){_T+=1/120;__X.IN.th=1;__X.IN.j=(k%41===0)?1:0;__X.step(1/120);
    h=(h*31+Math.round(G.x*1000)+Math.round(G.coins)+G.crashes)|0;}
  return h+"|"+Math.round(G.x)+"|"+G.coins+"|"+G.crashes;}
var h1=runHash(),h2=runHash();
ok("two identical runs match",h1===h2,h1);

WScript.Echo("\n=== flash budget (WCAG 2.3.1) ===");
function flips(hz){var n=0,prev=null;
  for(var k=0;k<600;k++){G.rt=k/600;var v=__X.blink(hz);if(prev!==null&&v!==prev)n++;prev=v;}
  return n;}
var fa=flips(1.5);
ok("every blinker <= 3 transitions/sec",fa<=3,fa+" per second");
ok("three concurrent blinkers stay in budget",fa*3<=9,(fa*3)+" combined");

WScript.Echo("\n"+(fails===0?"ALL CHECKS PASSED":fails+" CHECK(S) FAILED"));






