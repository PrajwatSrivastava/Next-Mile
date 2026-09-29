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
 "JUMP_V:JUMP_V,WHEEL_JUMP:WHEEL_JUMP,GRAV:GRAV,AI_JUMP_V:AI_JUMP_V,getW:function(){return WHEEL;}};\n";
eval(code.substring(0,cut)+inject+code.substring(cut));

var fails=0;
function ok(n,c,d){WScript.Echo((c?"  PASS  ":"  FAIL  ")+n+(d?"   "+d:""));if(!c)fails++;}
function f2(v){return Math.round(v*100)/100;}
var G=__X.G;
__X.ready();

/* Bot that clears obstacles using the real clearance maths, mirroring the
   approach harness.js takes. Deliberately imperfect. */
function bot(fast){
  var spd=Math.max(40,G.spd),o=null,od=1e9;
  for(var i=0;i<G.ents.length;i++){var e=G.ents[i];if(e.t!=="o")continue;
    var d=e.x-G.x-96;if(d<=0||d>460)continue;if(d<od){od=d;o=e;}}
  var j=0,th=fast?1:0,bk=0;
  if(o&&o.k==="wall"){
    var fire=15+spd*__X.riseT(72,320*1.45)+8; th=0;
    if(G.charge<0.98&&od>fire+26)bk=1;
    else if(G.ground&&od<=fire&&G.charge>0.5)j=1;
    else if(G.ground&&G.charge<0.98)bk=1;
  }else if(o){
    var t1=__X.riseT((__X.OBS[o.k]||__X.OBS.cone).cl,320);
    if(t1!==null&&G.ground&&od<=15+spd*t1+8)j=1;
  }
  if(!G.ground&&G.vy<0)j=1;
  __X.IN.jp=__X.IN.j;__X.IN.j=j;__X.IN.th=th;__X.IN.bk=bk;__X.IN.dn=0;__X.IN.ai=0;
}
function run(st,mode,maxF){
  __X.start(st);var f=0;maxF=maxF||16000;
  while(G.mode==="play"&&f++<maxF){
    if(mode==="idle"){__X.IN.jp=__X.IN.j;__X.IN.j=0;__X.IN.th=0;__X.IN.bk=0;__X.IN.ai=0;__X.IN.dn=0;}
    else bot(mode==="fast");
    var a=1/60;_T+=a;while(a>=1/120){__X.step(1/120);a-=1/120;}
  }
  return {mode:G.mode,t:G.t,clock:G.clock,coins:G.coins,crashes:G.crashes,
          pct:Math.round(G.x/Math.max(1,G.endX)*100)};
}

WScript.Echo("\n=== 8. the clock is still a real fail state ===");
for(var st=0;st<3;st++){
  var r=run(st,"idle");
  ok("stage"+(st+1)+": doing nothing loses the run",r.mode==="fail",
     "mode="+r.mode+" reached "+r.pct+"% crashes="+r.crashes+" t="+f2(r.t)+"s");
}

WScript.Echo("\n=== 8b. a competent rider beats the clock on all three ===");
for(var st=0;st<3;st++){
  var r=run(st,"fast");
  ok("stage"+(st+1)+" completed at throttle",r.mode==="done",
     "mode="+r.mode+" t="+f2(r.t)+"s left="+f2(r.clock)+"s crashes="+r.crashes+" coins="+r.coins);
  ok("stage"+(st+1)+" had clock to spare",r.mode==="done"&&r.clock>2,"left="+f2(r.clock)+"s");
}

WScript.Echo("\n=== cautious cruise: 1-2 clear, 3 demands the throttle ===");
var c0=run(0,"cruise"),c1=run(1,"cruise"),c2=run(2,"cruise");
ok("cruise clears stage 1",c0.mode==="done","t="+f2(c0.t)+"s left="+f2(c0.clock)+"s crashes="+c0.crashes);
ok("cruise clears stage 2",c1.mode==="done","t="+f2(c1.t)+"s left="+f2(c1.clock)+"s crashes="+c1.crashes);
ok("stage 3 demands the throttle",c2.mode==="fail","reached "+c2.pct+"% t="+f2(c2.t)+"s");

WScript.Echo("\n=== camera lookahead is now perceptible ===");
/* Drive the camera directly off speed. Sampling CAM.x after a live run made
   this a test of where the autopilot happened to crash, not of the camera. */
__X.start(2);__X.CAM.x=0;
__X.G.spd=178;for(var i=0;i<120;i++)__X.camera(1/60);
ok("full throttle opens the road ahead",__X.CAM.x>24,"CAM.x="+f2(__X.CAM.x)+"px at spd 178");
ok("lookahead stays under its cap",__X.CAM.x<=34.05,"CAM.x="+f2(__X.CAM.x)+" cap 34");
__X.G.spd=54;for(var i=0;i<120;i++)__X.camera(1/60);
ok("braking closes it back to zero",__X.CAM.x<0.5,"CAM.x="+f2(__X.CAM.x)+"px at spd 54");

WScript.Echo("\n"+(fails===0?"ALL GAMEPLAY CHECKS PASSED":fails+" CHECK(S) FAILED"));



