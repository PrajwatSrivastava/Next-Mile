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
/* minimal export set present in BOTH the baseline and the edited file */
var inject="\n;__X={G:G,step:step,start:start,ready:ready,draw:draw,IN:IN};\n";
eval(code.substring(0,cut)+inject+code.substring(cut));
__X.ready();
var G=__X.G,out=[];
for(var st=0;st<3;st++){
  __X.start(st);
  for(var i=0;i<1800;i++){_T+=1/120;__X.IN.th=1;__X.IN.j=(i%37===0)?1:0;__X.step(1/120);}
  out.push("stage"+(st+1)+" x="+Math.round(G.x)+" coins="+G.coins+" crashes="+G.crashes+
           " clock="+G.clock.toFixed(3)+" mult="+G.mult+" bat="+Math.round(G.bat)+" mode="+G.mode);
}
WScript.Echo(out.join("\n"));

