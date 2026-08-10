"use strict";(()=>{var kh=0,Ql=1,Dh=2;var ec=1,Lh=2,Kn=3,si=0,nn=1,Gt=2,$n=0,zi=1,tc=2,nc=3,ic=4,Nh=5,yi=100,Uh=101,Fh=102,Bh=103,Oh=104,zh=200,Hh=201,Gh=202,Vh=203,_o=204,Mo=205,Wh=206,Xh=207,qh=208,Yh=209,Kh=210,$h=211,jh=212,Zh=213,Jh=214,$o=0,jo=1,Zo=2,Hi=3,Jo=4,Qo=5,ea=6,ta=7,rc=0,Qh=1,ed=2,li=0,td=1,nd=2,id=3,na=4,rd=5,sd=6,od=7;var sc=300,$i=301,ji=302,ia=303,ra=304,Is=306,xn=1e3,Pn=1001,Eo=1002,vt=1003,sa=1004;var Ps=1005;var Kt=1006,oa=1007;var yn=1008;var Gn=1009,oc=1010,ac=1011,kr=1012,aa=1013,Si=1014,jn=1015,Zi=1016,la=1017,ca=1018,Dr=1020,lc=35902,cc=35899,hc=1021,dc=1022,Ln=1023,Mr=1026,Lr=1027,uc=1028,ha=1029,da=1030,ua=1031;var fa=1033,ks=33776,Ds=33777,Ls=33778,Ns=33779,pa=35840,ma=35841,ga=35842,xa=35843,ba=36196,ya=37492,va=37496,_a=37808,Ma=37809,Ea=37810,Sa=37811,wa=37812,Ta=37813,Aa=37814,Ra=37815,Ca=37816,Ia=37817,Pa=37818,ka=37819,Da=37820,La=37821,Na=36492,Ua=36494,Fa=36495,Ba=36283,Oa=36284,za=36285,Ha=36286;var jr=2300,So=2301,vo=2302,Hl=2400,Gl=2401,Vl=2402;var ad=3200,ld=3201;var fc=0,cd=1,ci="",pt="srgb",Gi="srgb-linear",Zr="linear",Et="srgb";var Oi=7680;var Wl=519,hd=512,dd=513,ud=514,pc=515,fd=516,pd=517,md=518,gd=519,Xl=35044;var mc="300 es",On=2e3,Jr=2001;function gc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Qr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xd(){let i=Qr("canvas");return i.style.display="block",i}var lh={},Er=null;function xc(...i){let e="THREE."+i.shift();Er?Er("log",e,...i):console.log(e,...i)}function st(...i){let e="THREE."+i.shift();Er?Er("warn",e,...i):console.warn(e,...i)}function ut(...i){let e="THREE."+i.shift();Er?Er("error",e,...i):console.error(e,...i)}function Sr(...i){let e=i.join(" ");e in lh||(lh[e]=!0,st(...i))}function bd(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var oi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var fl=Math.PI/180,es=180/Math.PI;function Nr(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function ft(i,e,t){return Math.max(e,Math.min(t,i))}function Ju(i,e){return(i%e+e)%e}function pl(i,e,t){return(1-t)*i+t*e}function Hr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function gn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ye=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},zn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let c=n[r+0],l=n[r+1],h=n[r+2],d=n[r+3],u=s[o+0],f=s[o+1],g=s[o+2],x=s[o+3];if(a<=0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(a>=1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=x;return}if(d!==x||c!==u||l!==f||h!==g){let m=c*u+l*f+h*g+d*x;m<0&&(u=-u,f=-f,g=-g,x=-x,m=-m);let p=1-a;if(m<.9995){let E=Math.acos(m),v=Math.sin(E);p=Math.sin(p*E)/v,a=Math.sin(a*E)/v,c=c*p+u*a,l=l*p+f*a,h=h*p+g*a,d=d*p+x*a}else{c=c*p+u*a,l=l*p+f*a,h=h*p+g*a,d=d*p+x*a;let E=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=E,l*=E,h*=E,d*=E}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,o){let a=n[r],c=n[r+1],l=n[r+2],h=n[r+3],d=s[o],u=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-a*f,e[t+2]=l*g+h*f+a*u-c*d,e[t+3]=h*g-a*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(r/2),d=a(s/2),u=c(n/2),f=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:st("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(o-r)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-c)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+l)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(s-l)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-r)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-r*a,this._w=o*h-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,r=-r,s=-s,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ch.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ch.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*n),h=2*(a*t-s*r),d=2*(s*n-o*t);return this.x=t+c*l+o*d-a*h,this.y=n+c*h+a*l-s*d,this.z=r+c*d+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ml.copy(this).projectOnVector(e),this.sub(ml)}reflect(e){return this.sub(ml.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ml=new U,ch=new zn,ht=class i{constructor(e,t,n,r,s,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l)}set(e,t,n,r,s,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],x=r[0],m=r[3],p=r[6],E=r[1],v=r[4],S=r[7],b=r[2],y=r[5],T=r[8];return s[0]=o*x+a*E+c*b,s[3]=o*m+a*v+c*y,s[6]=o*p+a*S+c*T,s[1]=l*x+h*E+d*b,s[4]=l*m+h*v+d*y,s[7]=l*p+h*S+d*T,s[2]=u*x+f*E+g*b,s[5]=u*m+f*v+g*y,s[8]=u*p+f*S+g*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*s*h+n*a*c+r*s*l-r*o*c}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,u=a*c-h*s,f=l*s-o*c,g=t*d+n*u+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=d*x,e[1]=(r*l-h*n)*x,e[2]=(a*n-r*o)*x,e[3]=u*x,e[4]=(h*t-r*c)*x,e[5]=(r*s-a*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*s)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(gl.makeScale(e,t)),this}rotate(e){return this.premultiply(gl.makeRotation(-e)),this}translate(e,t){return this.premultiply(gl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},gl=new ht,hh=new ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dh=new ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qu(){let i={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Et&&(r.r=ri(r.r),r.g=ri(r.g),r.b=ri(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Et&&(r.r=_r(r.r),r.g=_r(r.g),r.b=_r(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ci?Zr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Sr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Sr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gi]:{primaries:e,whitePoint:n,transfer:Zr,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:pt},outputColorSpaceConfig:{drawingBufferColorSpace:pt}},[pt]:{primaries:e,whitePoint:n,transfer:Et,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:pt}}}),i}var gt=Qu();function ri(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _r(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var cr,wo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{cr===void 0&&(cr=Qr("canvas")),cr.width=e.width,cr.height=e.height;let r=cr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=cr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Qr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=ri(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ri(t[n]/255)*255):t[n]=ri(t[n]);return{data:t,width:e.width,height:e.height}}else return st("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},ef=0,wr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=Nr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(xl(r[o].image)):s.push(xl(r[o]))}else s=xl(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function xl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(st("Texture: Unable to serialize Texture."),{})}var tf=0,bl=new U,un=class i extends oi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Pn,r=Pn,s=Kt,o=yn,a=Ln,c=Gn,l=i.DEFAULT_ANISOTROPY,h=ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=Nr(),this.name="",this.source=new wr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(bl).x}get height(){return this.source.getSize(bl).y}get depth(){return this.source.getSize(bl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){st(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){st(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xn:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case Eo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xn:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case Eo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=sc;un.DEFAULT_ANISOTROPY=1;var yt=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(l+1)/2,S=(f+1)/2,b=(p+1)/2,y=(h+u)/4,T=(d+x)/4,k=(g+m)/4;return v>S&&v>b?v<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(v),r=y/n,s=T/n):S>b?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=y/r,s=k/r):b<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),n=T/s,r=k/s),this.set(n,r,s,t),this}let E=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-x)/E,this.z=(u-h)/E,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},To=class extends oi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);let r={width:e,height:t,depth:n.depth},s=new un(r);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new wr(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},kn=class extends To{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ts=class extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=vt,this.minFilter=vt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ao=class extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=vt,this.minFilter=vt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var vi=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(s,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Js.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Js.copy(n.boundingBox)),Js.applyMatrix4(e.matrixWorld),this.union(Js)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gr),Qs.subVectors(this.max,Gr),hr.subVectors(e.a,Gr),dr.subVectors(e.b,Gr),ur.subVectors(e.c,Gr),ui.subVectors(dr,hr),fi.subVectors(ur,dr),Ni.subVectors(hr,ur);let t=[0,-ui.z,ui.y,0,-fi.z,fi.y,0,-Ni.z,Ni.y,ui.z,0,-ui.x,fi.z,0,-fi.x,Ni.z,0,-Ni.x,-ui.y,ui.x,0,-fi.y,fi.x,0,-Ni.y,Ni.x,0];return!yl(t,hr,dr,ur,Qs)||(t=[1,0,0,0,1,0,0,0,1],!yl(t,hr,dr,ur,Qs))?!1:(eo.crossVectors(ui,fi),t=[eo.x,eo.y,eo.z],yl(t,hr,dr,ur,Qs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qn=[new U,new U,new U,new U,new U,new U,new U,new U],Un=new U,Js=new vi,hr=new U,dr=new U,ur=new U,ui=new U,fi=new U,Ni=new U,Gr=new U,Qs=new U,eo=new U,Ui=new U;function yl(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Ui.fromArray(i,s);let a=r.x*Math.abs(Ui.x)+r.y*Math.abs(Ui.y)+r.z*Math.abs(Ui.z),c=e.dot(Ui),l=t.dot(Ui),h=n.dot(Ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var nf=new vi,Vr=new U,vl=new U,Tr=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):nf.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vr.subVectors(e,this.center);let t=Vr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Vr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(vl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vr.copy(e.center).add(vl)),this.expandByPoint(Vr.copy(e.center).sub(vl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ei=new U,_l=new U,to=new U,pi=new U,Ml=new U,no=new U,El=new U,Ro=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){_l.copy(e).add(t).multiplyScalar(.5),to.copy(t).sub(e).normalize(),pi.copy(this.origin).sub(_l);let s=e.distanceTo(t)*.5,o=-this.direction.dot(to),a=pi.dot(this.direction),c=-pi.dot(to),l=pi.lengthSq(),h=Math.abs(1-o*o),d,u,f,g;if(h>0)if(d=o*c-a,u=o*a-c,g=s*h,d>=0)if(u>=-g)if(u<=g){let x=1/h;d*=x,u*=x,f=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-o*s+a)),u=d>0?-s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),f=u*(u+2*c)+l):(d=Math.max(0,-(o*s+a)),u=d>0?s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l);else u=o>0?-s:s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(_l).addScaledVector(to,u),f}intersectSphere(e,t){ei.subVectors(e.center,this.origin);let n=ei.dot(this.direction),r=ei.dot(ei)-n*n,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,r,s){Ml.subVectors(t,e),no.subVectors(n,e),El.crossVectors(Ml,no);let o=this.direction.dot(El),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;pi.subVectors(this.origin,e);let c=a*this.direction.dot(no.crossVectors(pi,no));if(c<0)return null;let l=a*this.direction.dot(Ml.cross(pi));if(l<0||c+l>o)return null;let h=-a*pi.dot(El);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Mt=class i{constructor(e,t,n,r,s,o,a,c,l,h,d,u,f,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l,h,d,u,f,g,x,m)}set(e,t,n,r,s,o,a,c,l,h,d,u,f,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/fr.setFromMatrixColumn(e,0).length(),s=1/fr.setFromMatrixColumn(e,1).length(),o=1/fr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let u=o*h,f=o*d,g=a*h,x=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-x*l,t[9]=-a*c,t[2]=x-u*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){let u=c*h,f=c*d,g=l*h,x=l*d;t[0]=u+x*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=x+u*a,t[10]=o*c}else if(e.order==="ZXY"){let u=c*h,f=c*d,g=l*h,x=l*d;t[0]=u-x*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=x-u*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let u=o*h,f=o*d,g=a*h,x=a*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+x,t[1]=c*d,t[5]=x*l+u,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let u=o*c,f=o*l,g=a*c,x=a*l;t[0]=c*h,t[4]=x-u*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-x*d}else if(e.order==="XZY"){let u=o*c,f=o*l,g=a*c,x=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+x,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rf,e,sf)}lookAt(e,t,n){let r=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),mi.crossVectors(n,En),mi.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),mi.crossVectors(n,En)),mi.normalize(),io.crossVectors(En,mi),r[0]=mi.x,r[4]=io.x,r[8]=En.x,r[1]=mi.y,r[5]=io.y,r[9]=En.y,r[2]=mi.z,r[6]=io.z,r[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],E=n[3],v=n[7],S=n[11],b=n[15],y=r[0],T=r[4],k=r[8],_=r[12],M=r[1],D=r[5],L=r[9],N=r[13],z=r[2],O=r[6],G=r[10],Y=r[14],H=r[3],V=r[7],ee=r[11],re=r[15];return s[0]=o*y+a*M+c*z+l*H,s[4]=o*T+a*D+c*O+l*V,s[8]=o*k+a*L+c*G+l*ee,s[12]=o*_+a*N+c*Y+l*re,s[1]=h*y+d*M+u*z+f*H,s[5]=h*T+d*D+u*O+f*V,s[9]=h*k+d*L+u*G+f*ee,s[13]=h*_+d*N+u*Y+f*re,s[2]=g*y+x*M+m*z+p*H,s[6]=g*T+x*D+m*O+p*V,s[10]=g*k+x*L+m*G+p*ee,s[14]=g*_+x*N+m*Y+p*re,s[3]=E*y+v*M+S*z+b*H,s[7]=E*T+v*D+S*O+b*V,s[11]=E*k+v*L+S*G+b*ee,s[15]=E*_+v*N+S*Y+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+s*c*d-r*l*d-s*a*u+n*l*u+r*a*f-n*c*f)+x*(+t*c*f-t*l*u+s*o*u-r*o*f+r*l*h-s*c*h)+m*(+t*l*d-t*a*f-s*o*d+n*o*f+s*a*h-n*l*h)+p*(-r*a*h-t*c*d+t*a*u+r*o*d-n*o*u+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],E=d*m*l-x*u*l+x*c*f-a*m*f-d*c*p+a*u*p,v=g*u*l-h*m*l-g*c*f+o*m*f+h*c*p-o*u*p,S=h*x*l-g*d*l+g*a*f-o*x*f-h*a*p+o*d*p,b=g*d*c-h*x*c-g*a*u+o*x*u+h*a*m-o*d*m,y=t*E+n*v+r*S+s*b;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/y;return e[0]=E*T,e[1]=(x*u*s-d*m*s-x*r*f+n*m*f+d*r*p-n*u*p)*T,e[2]=(a*m*s-x*c*s+x*r*l-n*m*l-a*r*p+n*c*p)*T,e[3]=(d*c*s-a*u*s-d*r*l+n*u*l+a*r*f-n*c*f)*T,e[4]=v*T,e[5]=(h*m*s-g*u*s+g*r*f-t*m*f-h*r*p+t*u*p)*T,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*T,e[7]=(o*u*s-h*c*s+h*r*l-t*u*l-o*r*f+t*c*f)*T,e[8]=S*T,e[9]=(g*d*s-h*x*s-g*n*f+t*x*f+h*n*p-t*d*p)*T,e[10]=(o*x*s-g*a*s+g*n*l-t*x*l-o*n*p+t*a*p)*T,e[11]=(h*a*s-o*d*s-h*n*l+t*d*l+o*n*f-t*a*f)*T,e[12]=b*T,e[13]=(h*x*r-g*d*r+g*n*u-t*x*u-h*n*m+t*d*m)*T,e[14]=(g*a*r-o*x*r-g*n*c+t*x*c+o*n*m-t*a*m)*T,e[15]=(o*d*r-h*a*r+h*n*c-t*d*c-o*n*u+t*a*u)*T,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+n,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,h=o+o,d=a+a,u=s*l,f=s*h,g=s*d,x=o*h,m=o*d,p=a*d,E=c*l,v=c*h,S=c*d,b=n.x,y=n.y,T=n.z;return r[0]=(1-(x+p))*b,r[1]=(f+S)*b,r[2]=(g-v)*b,r[3]=0,r[4]=(f-S)*y,r[5]=(1-(u+p))*y,r[6]=(m+E)*y,r[7]=0,r[8]=(g+v)*T,r[9]=(m-E)*T,r[10]=(1-(u+x))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=fr.set(r[0],r[1],r[2]).length(),o=fr.set(r[4],r[5],r[6]).length(),a=fr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Fn.copy(this);let l=1/s,h=1/o,d=1/a;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=d,Fn.elements[9]*=d,Fn.elements[10]*=d,t.setFromRotationMatrix(Fn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=On,c=!1){let l=this.elements,h=2*s/(t-e),d=2*s/(n-r),u=(t+e)/(t-e),f=(n+r)/(n-r),g,x;if(c)g=s/(o-s),x=o*s/(o-s);else if(a===On)g=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Jr)g=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=On,c=!1){let l=this.elements,h=2/(t-e),d=2/(n-r),u=-(t+e)/(t-e),f=-(n+r)/(n-r),g,x;if(c)g=1/(o-s),x=o/(o-s);else if(a===On)g=-2/(o-s),x=-(o+s)/(o-s);else if(a===Jr)g=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},fr=new U,Fn=new Mt,rf=new U(0,0,0),sf=new U(1,1,1),mi=new U,io=new U,En=new U,uh=new Mt,fh=new zn,Hn=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],d=r[2],u=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ft(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:st("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return uh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(uh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fh.setFromEuler(this),this.setFromQuaternion(fh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Hn.DEFAULT_ORDER="XYZ";var ns=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},of=0,ph=new U,pr=new zn,ti=new Mt,ro=new U,Wr=new U,af=new U,lf=new zn,mh=new U(1,0,0),gh=new U(0,1,0),xh=new U(0,0,1),bh={type:"added"},cf={type:"removed"},mr={type:"childadded",child:null},Sl={type:"childremoved",child:null},Nt=class i extends oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=Nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new Hn,n=new zn,r=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new ht}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ns,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return pr.setFromAxisAngle(e,t),this.quaternion.multiply(pr),this}rotateOnWorldAxis(e,t){return pr.setFromAxisAngle(e,t),this.quaternion.premultiply(pr),this}rotateX(e){return this.rotateOnAxis(mh,e)}rotateY(e){return this.rotateOnAxis(gh,e)}rotateZ(e){return this.rotateOnAxis(xh,e)}translateOnAxis(e,t){return ph.copy(e).applyQuaternion(this.quaternion),this.position.add(ph.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mh,e)}translateY(e){return this.translateOnAxis(gh,e)}translateZ(e){return this.translateOnAxis(xh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ro.copy(e):ro.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(Wr,ro,this.up):ti.lookAt(ro,Wr,this.up),this.quaternion.setFromRotationMatrix(ti),r&&(ti.extractRotation(r.matrixWorld),pr.setFromRotationMatrix(ti),this.quaternion.premultiply(pr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ut("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bh),mr.child=e,this.dispatchEvent(mr),mr.child=null):ut("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cf),Sl.child=e,this.dispatchEvent(Sl),Sl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bh),mr.child=e,this.dispatchEvent(mr),mr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,e,af),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,lf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};Nt.DEFAULT_UP=new U(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=new U,ni=new U,wl=new U,ii=new U,gr=new U,xr=new U,yh=new U,Tl=new U,Al=new U,Rl=new U,Cl=new yt,Il=new yt,Pl=new yt,bi=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Bn.subVectors(e,t),r.cross(Bn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Bn.subVectors(r,t),ni.subVectors(n,t),wl.subVectors(e,t);let o=Bn.dot(Bn),a=Bn.dot(ni),c=Bn.dot(wl),l=ni.dot(ni),h=ni.dot(wl),d=o*l-a*a;if(d===0)return s.set(0,0,0),null;let u=1/d,f=(l*c-a*h)*u,g=(o*h-a*c)*u;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ii)===null?!1:ii.x>=0&&ii.y>=0&&ii.x+ii.y<=1}static getInterpolation(e,t,n,r,s,o,a,c){return this.getBarycoord(e,t,n,r,ii)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ii.x),c.addScaledVector(o,ii.y),c.addScaledVector(a,ii.z),c)}static getInterpolatedAttribute(e,t,n,r,s,o){return Cl.setScalar(0),Il.setScalar(0),Pl.setScalar(0),Cl.fromBufferAttribute(e,t),Il.fromBufferAttribute(e,n),Pl.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Cl,s.x),o.addScaledVector(Il,s.y),o.addScaledVector(Pl,s.z),o}static isFrontFacing(e,t,n,r){return Bn.subVectors(n,t),ni.subVectors(e,t),Bn.cross(ni).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bn.subVectors(this.c,this.b),ni.subVectors(this.a,this.b),Bn.cross(ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,o,a;gr.subVectors(r,n),xr.subVectors(s,n),Tl.subVectors(e,n);let c=gr.dot(Tl),l=xr.dot(Tl);if(c<=0&&l<=0)return t.copy(n);Al.subVectors(e,r);let h=gr.dot(Al),d=xr.dot(Al);if(h>=0&&d<=h)return t.copy(r);let u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(gr,o);Rl.subVectors(e,s);let f=gr.dot(Rl),g=xr.dot(Rl);if(g>=0&&f<=g)return t.copy(s);let x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(xr,a);let m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return yh.subVectors(s,r),a=(d-h)/(d-h+(f-g)),t.copy(r).addScaledVector(yh,a);let p=1/(m+x+u);return o=x*p,a=u*p,t.copy(n).addScaledVector(gr,o).addScaledVector(xr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},yd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gi={h:0,s:0,l:0},so={h:0,s:0,l:0};function kl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ot=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,gt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=gt.workingColorSpace){return this.r=e,this.g=t,this.b=n,gt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=gt.workingColorSpace){if(e=Ju(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=kl(o,s,e+1/3),this.g=kl(o,s,e),this.b=kl(o,s,e-1/3)}return gt.colorSpaceToWorking(this,r),this}setStyle(e,t=pt){function n(s){s!==void 0&&parseFloat(s)<1&&st("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:st("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);st("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pt){let n=yd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):st("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ri(e.r),this.g=ri(e.g),this.b=ri(e.b),this}copyLinearToSRGB(e){return this.r=_r(e.r),this.g=_r(e.g),this.b=_r(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pt){return gt.workingToColorSpace(ln.copy(this),e),Math.round(ft(ln.r*255,0,255))*65536+Math.round(ft(ln.g*255,0,255))*256+Math.round(ft(ln.b*255,0,255))}getHexString(e=pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=gt.workingColorSpace){gt.workingToColorSpace(ln.copy(this),t);let n=ln.r,r=ln.g,s=ln.b,o=Math.max(n,r,s),a=Math.min(n,r,s),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=gt.workingColorSpace){return gt.workingToColorSpace(ln.copy(this),t),e.r=ln.r,e.g=ln.g,e.b=ln.b,e}getStyle(e=pt){gt.workingToColorSpace(ln.copy(this),e);let t=ln.r,n=ln.g,r=ln.b;return e!==pt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(gi),this.setHSL(gi.h+e,gi.s+t,gi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(gi),e.getHSL(so);let n=pl(gi.h,so.h,t),r=pl(gi.s,so.s,t),s=pl(gi.l,so.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ln=new ot;ot.NAMES=yd;var hf=0,_i=class extends oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=Nr(),this.name="",this.type="Material",this.blending=zi,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_o,this.blendDst=Mo,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ot(0,0,0),this.blendAlpha=0,this.depthFunc=Hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){st(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){st(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_o&&(n.blendSrc=this.blendSrc),this.blendDst!==Mo&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Dn=class extends _i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.combine=rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Wt=new U,oo=new ye,df=0,dn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:df++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xl,this.updateRanges=[],this.gpuType=jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)oo.fromBufferAttribute(this,t),oo.applyMatrix3(e),this.setXY(t,oo.x,oo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix3(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix4(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyNormalMatrix(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.transformDirection(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Hr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=gn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hr(t,this.array)),t}setX(e,t){return this.normalized&&(t=gn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hr(t,this.array)),t}setY(e,t){return this.normalized&&(t=gn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=gn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hr(t,this.array)),t}setW(e,t){return this.normalized&&(t=gn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=gn(t,this.array),n=gn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=gn(t,this.array),n=gn(n,this.array),r=gn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=gn(t,this.array),n=gn(n,this.array),r=gn(r,this.array),s=gn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xl&&(e.usage=this.usage),e}};var is=class extends dn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var rs=class extends dn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var at=class extends dn{constructor(e,t,n){super(new Float32Array(e),t,n)}},uf=0,Cn=new Mt,Dl=new Nt,br=new U,Sn=new vi,Xr=new vi,en=new U,It=class i extends oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=Nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gc(e)?rs:is)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new ht().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return Dl.lookAt(e),Dl.updateMatrix(),this.applyMatrix4(Dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(br).negate(),this.translate(br.x,br.y,br.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new at(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&st("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];Sn.setFromBufferAttribute(s),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Xr.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(Sn.min,Xr.min),Sn.expandByPoint(en),en.addVectors(Sn.max,Xr.max),Sn.expandByPoint(en)):(Sn.expandByPoint(Xr.min),Sn.expandByPoint(Xr.max))}Sn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)en.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(en));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)en.fromBufferAttribute(a,l),c&&(br.fromBufferAttribute(e,l),en.add(br)),r=Math.max(r,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new dn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let k=0;k<n.count;k++)a[k]=new U,c[k]=new U;let l=new U,h=new U,d=new U,u=new ye,f=new ye,g=new ye,x=new U,m=new U;function p(k,_,M){l.fromBufferAttribute(n,k),h.fromBufferAttribute(n,_),d.fromBufferAttribute(n,M),u.fromBufferAttribute(s,k),f.fromBufferAttribute(s,_),g.fromBufferAttribute(s,M),h.sub(l),d.sub(l),f.sub(u),g.sub(u);let D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),a[k].add(x),a[_].add(x),a[M].add(x),c[k].add(m),c[_].add(m),c[M].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let k=0,_=E.length;k<_;++k){let M=E[k],D=M.start,L=M.count;for(let N=D,z=D+L;N<z;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let v=new U,S=new U,b=new U,y=new U;function T(k){b.fromBufferAttribute(r,k),y.copy(b);let _=a[k];v.copy(_),v.sub(b.multiplyScalar(b.dot(_))).normalize(),S.crossVectors(y,_);let D=S.dot(c[k])<0?-1:1;o.setXYZW(k,v.x,v.y,v.z,D)}for(let k=0,_=E.length;k<_;++k){let M=E[k],D=M.start,L=M.count;for(let N=D,z=D+L;N<z;N+=3)T(e.getX(N+0)),T(e.getX(N+1)),T(e.getX(N+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new dn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let r=new U,s=new U,o=new U,a=new U,c=new U,l=new U,h=new U,d=new U;if(e)for(let u=0,f=e.count;u<f;u+=3){let g=e.getX(u+0),x=e.getX(u+1),m=e.getX(u+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)r.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h),f=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?f=c[x]*a.data.stride+a.offset:f=c[x]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new dn(u,h,d)}if(this.index===null)return st("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let a in r){let c=r[a],l=e(c,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let h=0,d=l.length;h<d;h++){let u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){let f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let l in r){let h=r[l];this.setAttribute(l,h.clone(t))}let s=e.morphAttributes;for(let l in s){let h=[],d=s[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},vh=new Mt,Fi=new Ro,ao=new Tr,_h=new U,lo=new U,co=new U,ho=new U,Ll=new U,uo=new U,Mh=new U,fo=new U,K=class extends Nt{constructor(e=new It,t=new Dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){uo.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let h=a[c],d=s[c];h!==0&&(Ll.fromBufferAttribute(d,e),o?uo.addScaledVector(Ll,h):uo.addScaledVector(Ll.sub(t),h))}t.add(uo)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(s),Fi.copy(e.ray).recast(e.near),!(ao.containsPoint(Fi.origin)===!1&&(Fi.intersectSphere(ao,_h)===null||Fi.origin.distanceToSquared(_h)>(e.far-e.near)**2))&&(vh.copy(s).invert(),Fi.copy(e.ray).applyMatrix4(vh),!(n.boundingBox!==null&&Fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Fi)))}_computeIntersections(e,t,n){let r,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let m=u[g],p=o[m.materialIndex],E=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let S=E,b=v;S<b;S+=3){let y=a.getX(S),T=a.getX(S+1),k=a.getX(S+2);r=po(this,p,e,n,l,h,d,y,T,k),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let E=a.getX(m),v=a.getX(m+1),S=a.getX(m+2);r=po(this,o,e,n,l,h,d,E,v,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let m=u[g],p=o[m.materialIndex],E=Math.max(m.start,f.start),v=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let S=E,b=v;S<b;S+=3){let y=S,T=S+1,k=S+2;r=po(this,p,e,n,l,h,d,y,T,k),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let E=m,v=m+1,S=m+2;r=po(this,o,e,n,l,h,d,E,v,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function ff(i,e,t,n,r,s,o,a){let c;if(e.side===nn?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,e.side===si,a),c===null)return null;fo.copy(a),fo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(fo);return l<t.near||l>t.far?null:{distance:l,point:fo.clone(),object:i}}function po(i,e,t,n,r,s,o,a,c,l){i.getVertexPosition(a,lo),i.getVertexPosition(c,co),i.getVertexPosition(l,ho);let h=ff(i,e,t,n,lo,co,ho,Mh);if(h){let d=new U;bi.getBarycoord(Mh,lo,co,ho,d),r&&(h.uv=bi.getInterpolatedAttribute(r,a,c,l,d,new ye)),s&&(h.uv1=bi.getInterpolatedAttribute(s,a,c,l,d,new ye)),o&&(h.normal=bi.getInterpolatedAttribute(o,a,c,l,d,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new U,materialIndex:0};bi.getNormal(lo,co,ho,u.normal),h.face=u,h.barycoord=d}return h}var tt=class i extends It{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(d,2));function g(x,m,p,E,v,S,b,y,T,k,_){let M=S/T,D=b/k,L=S/2,N=b/2,z=y/2,O=T+1,G=k+1,Y=0,H=0,V=new U;for(let ee=0;ee<G;ee++){let re=ee*D-N;for(let xe=0;xe<O;xe++){let ke=xe*M-L;V[x]=ke*E,V[m]=re*v,V[p]=z,l.push(V.x,V.y,V.z),V[x]=0,V[m]=0,V[p]=y>0?1:-1,h.push(V.x,V.y,V.z),d.push(xe/T),d.push(1-ee/k),Y+=1}}for(let ee=0;ee<k;ee++)for(let re=0;re<T;re++){let xe=u+re+O*ee,ke=u+re+O*(ee+1),Xe=u+(re+1)+O*(ee+1),je=u+(re+1)+O*ee;c.push(xe,ke,je),c.push(ke,Xe,je),H+=6}a.addGroup(f,H,_),f+=H,u+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ji(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(st("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function cn(i){let e={};for(let t=0;t<i.length;t++){let n=Ji(i[t]);for(let r in n)e[r]=n[r]}return e}function pf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function bc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:gt.workingColorSpace}var vd={clone:Ji,merge:cn},mf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bn=class extends _i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mf,this.fragmentShader=gf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=pf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ss=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},xi=new U,Eh=new ye,Sh=new ye,Xt=class extends ss{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=es*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(fl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return es*2*Math.atan(Math.tan(fl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xi.x,xi.y).multiplyScalar(-e/xi.z),xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xi.x,xi.y).multiplyScalar(-e/xi.z)}getViewSize(e,t){return this.getViewBounds(e,Eh,Sh),t.subVectors(Sh,Eh)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(fl*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},yr=-90,vr=1,Co=class extends Nt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Xt(yr,vr,e,t);r.layers=this.layers,this.add(r);let s=new Xt(yr,vr,e,t);s.layers=this.layers,this.add(s);let o=new Xt(yr,vr,e,t);o.layers=this.layers,this.add(o);let a=new Xt(yr,vr,e,t);a.layers=this.layers,this.add(a);let c=new Xt(yr,vr,e,t);c.layers=this.layers,this.add(c);let l=new Xt(yr,vr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,c]=t;for(let l of t)this.remove(l);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},os=class extends un{constructor(e=[],t=$i,n,r,s,o,a,c,l,h){super(e,t,n,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Io=class extends kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new os(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new tt(5,5,5),s=new bn({name:"CubemapFromEquirect",uniforms:Ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:$n});s.uniforms.tEquirect.value=t;let o=new K(r,s),a=t.minFilter;return t.minFilter===yn&&(t.minFilter=Kt),new Co(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}},pe=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},xf={type:"move"},Ar=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(xf)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new pe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},as=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ot(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ls=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Hn,this.environmentIntensity=1,this.environmentRotation=new Hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Po=class extends un{constructor(e=null,t=1,n=1,r,s,o,a,c,l=vt,h=vt,d,u){super(null,o,a,c,l,h,r,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Nl=new U,bf=new U,yf=new ht,In=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Nl.subVectors(n,t).cross(bf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Nl),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||yf.getNormalMatrix(e),r=this.coplanarPoint(Nl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Bi=new Tr,vf=new ye(.5,.5),mo=new U,Rr=class{constructor(e=new In,t=new In,n=new In,r=new In,s=new In,o=new In){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],h=s[4],d=s[5],u=s[6],f=s[7],g=s[8],x=s[9],m=s[10],p=s[11],E=s[12],v=s[13],S=s[14],b=s[15];if(r[0].setComponents(l-o,f-h,p-g,b-E).normalize(),r[1].setComponents(l+o,f+h,p+g,b+E).normalize(),r[2].setComponents(l+a,f+d,p+x,b+v).normalize(),r[3].setComponents(l-a,f-d,p-x,b-v).normalize(),n)r[4].setComponents(c,u,m,S).normalize(),r[5].setComponents(l-c,f-u,p-m,b-S).normalize();else if(r[4].setComponents(l-c,f-u,p-m,b-S).normalize(),t===On)r[5].setComponents(l+c,f+u,p+m,b+S).normalize();else if(t===Jr)r[5].setComponents(c,u,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bi)}intersectsSprite(e){Bi.center.set(0,0,0);let t=vf.distanceTo(e.center);return Bi.radius=.7071067811865476+t,Bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(mo.x=r.normal.x>0?e.max.x:e.min.x,mo.y=r.normal.y>0?e.max.y:e.min.y,mo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(mo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ut=class extends un{constructor(e,t,n,r,s,o,a,c,l){super(e,t,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},cs=class extends un{constructor(e,t,n=Si,r,s,o,a=vt,c=vt,l,h=Mr,d=1){if(h!==Mr&&h!==Lr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,r,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},hs=class extends un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ht=class i extends It{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let s=[],o=[],a=[],c=[],l=new U,h=new ye;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let f=n+d/t*r;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[u]/e+1)/2,h.y=(o[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},$e=class i extends It{constructor(e=1,t=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};let l=this;r=Math.floor(r),s=Math.floor(s);let h=[],d=[],u=[],f=[],g=0,x=[],m=n/2,p=0;E(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new at(d,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(f,2));function E(){let S=new U,b=new U,y=0,T=(t-e)/n;for(let k=0;k<=s;k++){let _=[],M=k/s,D=M*(t-e)+e;for(let L=0;L<=r;L++){let N=L/r,z=N*c+a,O=Math.sin(z),G=Math.cos(z);b.x=D*O,b.y=-M*n+m,b.z=D*G,d.push(b.x,b.y,b.z),S.set(O,T,G).normalize(),u.push(S.x,S.y,S.z),f.push(N,1-M),_.push(g++)}x.push(_)}for(let k=0;k<r;k++)for(let _=0;_<s;_++){let M=x[_][k],D=x[_+1][k],L=x[_+1][k+1],N=x[_][k+1];(e>0||_!==0)&&(h.push(M,D,N),y+=3),(t>0||_!==s-1)&&(h.push(D,L,N),y+=3)}l.addGroup(p,y,0),p+=y}function v(S){let b=g,y=new ye,T=new U,k=0,_=S===!0?e:t,M=S===!0?1:-1;for(let L=1;L<=r;L++)d.push(0,m*M,0),u.push(0,M,0),f.push(.5,.5),g++;let D=g;for(let L=0;L<=r;L++){let z=L/r*c+a,O=Math.cos(z),G=Math.sin(z);T.x=_*G,T.y=m*M,T.z=_*O,d.push(T.x,T.y,T.z),u.push(0,M,0),y.x=O*.5+.5,y.y=G*.5*M+.5,f.push(y.x,y.y),g++}for(let L=0;L<r;L++){let N=b+L,z=D+L;S===!0?h.push(z,z+1,N):h.push(z+1,z,N),k+=3}l.addGroup(p,k,S===!0?1:2),p+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ds=class i extends It{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],o=[];a(r),l(n),h(),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(s.slice(),3)),this.setAttribute("uv",new at(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(E){let v=new U,S=new U,b=new U;for(let y=0;y<t.length;y+=3)f(t[y+0],v),f(t[y+1],S),f(t[y+2],b),c(v,S,b,E)}function c(E,v,S,b){let y=b+1,T=[];for(let k=0;k<=y;k++){T[k]=[];let _=E.clone().lerp(S,k/y),M=v.clone().lerp(S,k/y),D=y-k;for(let L=0;L<=D;L++)L===0&&k===y?T[k][L]=_:T[k][L]=_.clone().lerp(M,L/D)}for(let k=0;k<y;k++)for(let _=0;_<2*(y-k)-1;_++){let M=Math.floor(_/2);_%2===0?(u(T[k][M+1]),u(T[k+1][M]),u(T[k][M])):(u(T[k][M+1]),u(T[k+1][M+1]),u(T[k+1][M]))}}function l(E){let v=new U;for(let S=0;S<s.length;S+=3)v.x=s[S+0],v.y=s[S+1],v.z=s[S+2],v.normalize().multiplyScalar(E),s[S+0]=v.x,s[S+1]=v.y,s[S+2]=v.z}function h(){let E=new U;for(let v=0;v<s.length;v+=3){E.x=s[v+0],E.y=s[v+1],E.z=s[v+2];let S=m(E)/2/Math.PI+.5,b=p(E)/Math.PI+.5;o.push(S,1-b)}g(),d()}function d(){for(let E=0;E<o.length;E+=6){let v=o[E+0],S=o[E+2],b=o[E+4],y=Math.max(v,S,b),T=Math.min(v,S,b);y>.9&&T<.1&&(v<.2&&(o[E+0]+=1),S<.2&&(o[E+2]+=1),b<.2&&(o[E+4]+=1))}}function u(E){s.push(E.x,E.y,E.z)}function f(E,v){let S=E*3;v.x=e[S+0],v.y=e[S+1],v.z=e[S+2]}function g(){let E=new U,v=new U,S=new U,b=new U,y=new ye,T=new ye,k=new ye;for(let _=0,M=0;_<s.length;_+=9,M+=6){E.set(s[_+0],s[_+1],s[_+2]),v.set(s[_+3],s[_+4],s[_+5]),S.set(s[_+6],s[_+7],s[_+8]),y.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),k.set(o[M+4],o[M+5]),b.copy(E).add(v).add(S).divideScalar(3);let D=m(b);x(y,M+0,E,D),x(T,M+2,v,D),x(k,M+4,S,D)}}function x(E,v,S,b){b<0&&E.x===1&&(o[v]=E.x-1),S.x===0&&S.z===0&&(o[v]=b/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function p(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var wn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){st("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,s=n.length,o;t?o=t:o=e*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);let h=n[r],u=n[r+1]-h,f=(o-h)/u;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),c=t||(o.isVector2?new ye:new U);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new U,r=[],s=[],o=[],a=new U,c=new Mt;for(let f=0;f<=e;f++){let g=f/e;r[f]=this.getTangentAt(g,new U)}s[0]=new U,o[0]=new U;let l=Number.MAX_VALUE,h=Math.abs(r[0].x),d=Math.abs(r[0].y),u=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ft(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(ft(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Cr=class extends wn{constructor(e=0,t=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ye){let n=t,r=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);let a=this.aStartAngle+e*s,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ko=class extends Cr{constructor(e,t,n,r,s,o){super(e,t,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function yc(){let i=0,e=0,t=0,n=0;function r(s,o,a,c){i=s,e=a,t=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,d){let u=(o-s)/l-(a-s)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+d)+(c-a)/d;u*=h,f*=h,r(o,a,u,f)},calc:function(s){let o=s*s,a=o*s;return i+e*s+t*o+n*a}}}var go=new U,Ul=new yc,Fl=new yc,Bl=new yc,Ir=class extends wn{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new U){let n=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=r[(a-1)%s]:(go.subVectors(r[0],r[1]).add(r[0]),l=go);let d=r[a%s],u=r[(a+1)%s];if(this.closed||a+2<s?h=r[(a+2)%s]:(go.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=go),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Ul.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,x,m),Fl.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,x,m),Bl.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Ul.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),Fl.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Bl.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(Ul.calc(c),Fl.calc(c),Bl.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new U().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wh(i,e,t,n,r){let s=(n-e)*.5,o=(r-t)*.5,a=i*i,c=i*a;return(2*t-2*n+s+o)*c+(-3*t+3*n-2*s-o)*a+s*i+t}function _f(i,e){let t=1-i;return t*t*e}function Mf(i,e){return 2*(1-i)*i*e}function Ef(i,e){return i*i*e}function Kr(i,e,t,n){return _f(i,e)+Mf(i,t)+Ef(i,n)}function Sf(i,e){let t=1-i;return t*t*t*e}function wf(i,e){let t=1-i;return 3*t*t*i*e}function Tf(i,e){return 3*(1-i)*i*i*e}function Af(i,e){return i*i*i*e}function $r(i,e,t,n,r){return Sf(i,e)+wf(i,t)+Tf(i,n)+Af(i,r)}var us=class extends wn{constructor(e=new ye,t=new ye,n=new ye,r=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new ye){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set($r(e,r.x,s.x,o.x,a.x),$r(e,r.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Do=class extends wn{constructor(e=new U,t=new U,n=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new U){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set($r(e,r.x,s.x,o.x,a.x),$r(e,r.y,s.y,o.y,a.y),$r(e,r.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},fs=class extends wn{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Lo=class extends wn{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ps=class extends wn{constructor(e=new ye,t=new ye,n=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ye){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Kr(e,r.x,s.x,o.x),Kr(e,r.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ms=class extends wn{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Kr(e,r.x,s.x,o.x),Kr(e,r.y,s.y,o.y),Kr(e,r.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},gs=class extends wn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){let n=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],h=r[o>r.length-2?r.length-1:o+1],d=r[o>r.length-3?r.length-1:o+2];return n.set(wh(a,c.x,l.x,h.x,d.x),wh(a,c.y,l.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new ye().fromArray(r))}return this}},No=Object.freeze({__proto__:null,ArcCurve:ko,CatmullRomCurve3:Ir,CubicBezierCurve:us,CubicBezierCurve3:Do,EllipseCurve:Cr,LineCurve:fs,LineCurve3:Lo,QuadraticBezierCurve:ps,QuadraticBezierCurve3:ms,SplineCurve:gs}),Uo=class extends wn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new No[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let o=r[s]-n,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,s=this.curves;r<s.length;r++){let o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(new No[r.type]().fromJSON(r))}return this}},Vi=class extends Uo{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new fs(this.currentPoint.clone(),new ye(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let s=new ps(this.currentPoint.clone(),new ye(e,t),new ye(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,o){let a=new us(this.currentPoint.clone(),new ye(e,t),new ye(n,r),new ye(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new gs(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,r,s,o),this}absarc(e,t,n,r,s,o){return this.absellipse(e,t,n,n,r,s,o),this}ellipse(e,t,n,r,s,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,r,s,o,a,c),this}absellipse(e,t,n,r,s,o,a,c){let l=new Cr(e,t,n,r,s,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ai=class extends Vi{constructor(e){super(e),this.uuid=Nr(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(new Vi().fromJSON(r))}return this}};function Rf(i,e,t=2){let n=e&&e.length,r=n?e[0]*t:i.length,s=_d(i,0,r,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(n&&(s=Df(i,e,s,t)),i.length>80*t){a=i[0],c=i[1];let h=a,d=c;for(let u=t;u<r;u+=t){let f=i[u],g=i[u+1];f<a&&(a=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-a,d-c),l=l!==0?32767/l:0}return xs(s,o,t,a,c,l,0),o}function _d(i,e,t,n,r){let s;if(r===Wf(i,e,t,n)>0)for(let o=e;o<t;o+=n)s=Th(o/n|0,i[o],i[o+1],s);else for(let o=t-n;o>=e;o-=n)s=Th(o/n|0,i[o],i[o+1],s);return s&&Pr(s,s.next)&&(ys(s),s=s.next),s}function Wi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Pr(t,t.next)||Lt(t.prev,t,t.next)===0)){if(ys(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function xs(i,e,t,n,r,s,o){if(!i)return;!o&&s&&Bf(i,n,r,s);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(s?If(i,n,r,s):Cf(i)){e.push(c.i,i.i,l.i),ys(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Pf(Wi(i),e),xs(i,e,t,n,r,s,2)):o===2&&kf(i,e,t,n,r,s):xs(Wi(i),e,t,n,r,s,1);break}}}function Cf(i){let e=i.prev,t=i,n=i.next;if(Lt(e,t,n)>=0)return!1;let r=e.x,s=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=Math.min(r,s,o),d=Math.min(a,c,l),u=Math.max(r,s,o),f=Math.max(a,c,l),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Yr(r,a,s,c,o,l,g.x,g.y)&&Lt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function If(i,e,t,n){let r=i.prev,s=i,o=i.next;if(Lt(r,s,o)>=0)return!1;let a=r.x,c=s.x,l=o.x,h=r.y,d=s.y,u=o.y,f=Math.min(a,c,l),g=Math.min(h,d,u),x=Math.max(a,c,l),m=Math.max(h,d,u),p=ql(f,g,e,t,n),E=ql(x,m,e,t,n),v=i.prevZ,S=i.nextZ;for(;v&&v.z>=p&&S&&S.z<=E;){if(v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==r&&v!==o&&Yr(a,h,c,d,l,u,v.x,v.y)&&Lt(v.prev,v,v.next)>=0||(v=v.prevZ,S.x>=f&&S.x<=x&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&Yr(a,h,c,d,l,u,S.x,S.y)&&Lt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;v&&v.z>=p;){if(v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==r&&v!==o&&Yr(a,h,c,d,l,u,v.x,v.y)&&Lt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;S&&S.z<=E;){if(S.x>=f&&S.x<=x&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&Yr(a,h,c,d,l,u,S.x,S.y)&&Lt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Pf(i,e){let t=i;do{let n=t.prev,r=t.next.next;!Pr(n,r)&&Ed(n,t,t.next,r)&&bs(n,r)&&bs(r,n)&&(e.push(n.i,t.i,r.i),ys(t),ys(t.next),t=i=r),t=t.next}while(t!==i);return Wi(t)}function kf(i,e,t,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Hf(o,a)){let c=Sd(o,a);o=Wi(o,o.next),c=Wi(c,c.next),xs(o,e,t,n,r,s,0),xs(c,e,t,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function Df(i,e,t,n){let r=[];for(let s=0,o=e.length;s<o;s++){let a=e[s]*n,c=s<o-1?e[s+1]*n:i.length,l=_d(i,a,c,n,!1);l===l.next&&(l.steiner=!0),r.push(zf(l))}r.sort(Lf);for(let s=0;s<r.length;s++)t=Nf(r[s],t);return t}function Lf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=n-r}return t}function Nf(i,e){let t=Uf(i,e);if(!t)return e;let n=Sd(t,i);return Wi(n,n.next),Wi(t,t.next)}function Uf(i,e){let t=e,n=i.x,r=i.y,s=-1/0,o;if(Pr(i,t))return t;do{if(Pr(i,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){let d=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>s&&(s=d,o=t.x<t.next.x?t:t.next,d===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Md(r<l?n:s,r,c,l,r<l?s:n,r,t.x,t.y)){let d=Math.abs(r-t.y)/(n-t.x);bs(t,i)&&(d<h||d===h&&(t.x>o.x||t.x===o.x&&Ff(o,t)))&&(o=t,h=d)}t=t.next}while(t!==a);return o}function Ff(i,e){return Lt(i.prev,i,e.prev)<0&&Lt(e.next,i,i.next)<0}function Bf(i,e,t,n){let r=i;do r.z===0&&(r.z=ql(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Of(r)}function Of(i){let e,t=1;do{let n=i,r;i=null;let s=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(r=n,n=n.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=o}s.nextZ=null,t*=2}while(e>1);return i}function ql(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function zf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Md(i,e,t,n,r,s,o,a){return(r-o)*(e-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(n-a)}function Yr(i,e,t,n,r,s,o,a){return!(i===o&&e===a)&&Md(i,e,t,n,r,s,o,a)}function Hf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Gf(i,e)&&(bs(i,e)&&bs(e,i)&&Vf(i,e)&&(Lt(i.prev,i,e.prev)||Lt(i,e.prev,e))||Pr(i,e)&&Lt(i.prev,i,i.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Pr(i,e){return i.x===e.x&&i.y===e.y}function Ed(i,e,t,n){let r=bo(Lt(i,e,t)),s=bo(Lt(i,e,n)),o=bo(Lt(t,n,i)),a=bo(Lt(t,n,e));return!!(r!==s&&o!==a||r===0&&xo(i,t,e)||s===0&&xo(i,n,e)||o===0&&xo(t,i,n)||a===0&&xo(t,e,n))}function xo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function bo(i){return i>0?1:i<0?-1:0}function Gf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ed(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function bs(i,e){return Lt(i.prev,i,i.next)<0?Lt(i,e,i.next)>=0&&Lt(i,i.prev,e)>=0:Lt(i,e,i.prev)<0||Lt(i,i.next,e)<0}function Vf(i,e){let t=i,n=!1,r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Sd(i,e){let t=Yl(i.i,i.x,i.y),n=Yl(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Th(i,e,t,n){let r=Yl(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function ys(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Yl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Wf(i,e,t,n){let r=0;for(let s=e,o=t-n;s<t;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}var Kl=class{static triangulate(e,t,n=2){return Rf(e,t,n)}},qn=class i{static area(e){let t=e.length,n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],r=[],s=[];Ah(e),Rh(n,e);let o=e.length;t.forEach(Ah);for(let c=0;c<t.length;c++)r.push(o),o+=t[c].length,Rh(n,t[c]);let a=Kl.triangulate(n,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}};function Ah(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Rh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var vs=class i extends It{constructor(e=new ai([new ye(.5,.5),new ye(-.5,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],s=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new at(r,3)),this.setAttribute("uv",new at(s,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:Xf,v,S=!1,b,y,T,k;p&&(v=p.getSpacedPoints(h),S=!0,u=!1,b=p.computeFrenetFrames(h,!1),y=new U,T=new U,k=new U),u||(m=0,f=0,g=0,x=0);let _=a.extractPoints(l),M=_.shape,D=_.holes;if(!qn.isClockWise(M)){M=M.reverse();for(let $=0,C=D.length;$<C;$++){let te=D[$];qn.isClockWise(te)&&(D[$]=te.reverse())}}function N($){let te=10000000000000001e-36,ae=$[0];for(let he=1;he<=$.length;he++){let Z=he%$.length,me=$[Z],ue=me.x-ae.x,Te=me.y-ae.y,P=ue*ue+Te*Te,A=Math.max(Math.abs(me.x),Math.abs(me.y),Math.abs(ae.x),Math.abs(ae.y)),q=te*A*A;if(P<=q){$.splice(Z,1),he--;continue}ae=me}}N(M),D.forEach(N);let z=D.length,O=M;for(let $=0;$<z;$++){let C=D[$];M=M.concat(C)}function G($,C,te){return C||ut("ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(C,te)}let Y=M.length;function H($,C,te){let ae,he,Z,me=$.x-C.x,ue=$.y-C.y,Te=te.x-$.x,P=te.y-$.y,A=me*me+ue*ue,q=me*P-ue*Te;if(Math.abs(q)>Number.EPSILON){let ie=Math.sqrt(A),de=Math.sqrt(Te*Te+P*P),ne=C.x-ue/ie,We=C.y+me/ie,Re=te.x-P/de,Ye=te.y+Te/de,Ve=((Re-ne)*P-(Ye-We)*Te)/(me*P-ue*Te);ae=ne+me*Ve-$.x,he=We+ue*Ve-$.y;let fe=ae*ae+he*he;if(fe<=2)return new ye(ae,he);Z=Math.sqrt(fe/2)}else{let ie=!1;me>Number.EPSILON?Te>Number.EPSILON&&(ie=!0):me<-Number.EPSILON?Te<-Number.EPSILON&&(ie=!0):Math.sign(ue)===Math.sign(P)&&(ie=!0),ie?(ae=-ue,he=me,Z=Math.sqrt(A)):(ae=me,he=ue,Z=Math.sqrt(A/2))}return new ye(ae/Z,he/Z)}let V=[];for(let $=0,C=O.length,te=C-1,ae=$+1;$<C;$++,te++,ae++)te===C&&(te=0),ae===C&&(ae=0),V[$]=H(O[$],O[te],O[ae]);let ee=[],re,xe=V.concat();for(let $=0,C=z;$<C;$++){let te=D[$];re=[];for(let ae=0,he=te.length,Z=he-1,me=ae+1;ae<he;ae++,Z++,me++)Z===he&&(Z=0),me===he&&(me=0),re[ae]=H(te[ae],te[Z],te[me]);ee.push(re),xe=xe.concat(re)}let ke;if(m===0)ke=qn.triangulateShape(O,D);else{let $=[],C=[];for(let te=0;te<m;te++){let ae=te/m,he=f*Math.cos(ae*Math.PI/2),Z=g*Math.sin(ae*Math.PI/2)+x;for(let me=0,ue=O.length;me<ue;me++){let Te=G(O[me],V[me],Z);ze(Te.x,Te.y,-he),ae===0&&$.push(Te)}for(let me=0,ue=z;me<ue;me++){let Te=D[me];re=ee[me];let P=[];for(let A=0,q=Te.length;A<q;A++){let ie=G(Te[A],re[A],Z);ze(ie.x,ie.y,-he),ae===0&&P.push(ie)}ae===0&&C.push(P)}}ke=qn.triangulateShape($,C)}let Xe=ke.length,je=g+x;for(let $=0;$<Y;$++){let C=u?G(M[$],xe[$],je):M[$];S?(T.copy(b.normals[0]).multiplyScalar(C.x),y.copy(b.binormals[0]).multiplyScalar(C.y),k.copy(v[0]).add(T).add(y),ze(k.x,k.y,k.z)):ze(C.x,C.y,0)}for(let $=1;$<=h;$++)for(let C=0;C<Y;C++){let te=u?G(M[C],xe[C],je):M[C];S?(T.copy(b.normals[$]).multiplyScalar(te.x),y.copy(b.binormals[$]).multiplyScalar(te.y),k.copy(v[$]).add(T).add(y),ze(k.x,k.y,k.z)):ze(te.x,te.y,d/h*$)}for(let $=m-1;$>=0;$--){let C=$/m,te=f*Math.cos(C*Math.PI/2),ae=g*Math.sin(C*Math.PI/2)+x;for(let he=0,Z=O.length;he<Z;he++){let me=G(O[he],V[he],ae);ze(me.x,me.y,d+te)}for(let he=0,Z=D.length;he<Z;he++){let me=D[he];re=ee[he];for(let ue=0,Te=me.length;ue<Te;ue++){let P=G(me[ue],re[ue],ae);S?ze(P.x,P.y+v[h-1].y,v[h-1].x+te):ze(P.x,P.y,d+te)}}}j(),oe();function j(){let $=r.length/3;if(u){let C=0,te=Y*C;for(let ae=0;ae<Xe;ae++){let he=ke[ae];Be(he[2]+te,he[1]+te,he[0]+te)}C=h+m*2,te=Y*C;for(let ae=0;ae<Xe;ae++){let he=ke[ae];Be(he[0]+te,he[1]+te,he[2]+te)}}else{for(let C=0;C<Xe;C++){let te=ke[C];Be(te[2],te[1],te[0])}for(let C=0;C<Xe;C++){let te=ke[C];Be(te[0]+Y*h,te[1]+Y*h,te[2]+Y*h)}}n.addGroup($,r.length/3-$,0)}function oe(){let $=r.length/3,C=0;Ae(O,C),C+=O.length;for(let te=0,ae=D.length;te<ae;te++){let he=D[te];Ae(he,C),C+=he.length}n.addGroup($,r.length/3-$,1)}function Ae($,C){let te=$.length;for(;--te>=0;){let ae=te,he=te-1;he<0&&(he=$.length-1);for(let Z=0,me=h+m*2;Z<me;Z++){let ue=Y*Z,Te=Y*(Z+1),P=C+ae+ue,A=C+he+ue,q=C+he+Te,ie=C+ae+Te;lt(P,A,q,ie)}}}function ze($,C,te){c.push($),c.push(C),c.push(te)}function Be($,C,te){se($),se(C),se(te);let ae=r.length/3,he=E.generateTopUV(n,r,ae-3,ae-2,ae-1);ce(he[0]),ce(he[1]),ce(he[2])}function lt($,C,te,ae){se($),se(C),se(ae),se(C),se(te),se(ae);let he=r.length/3,Z=E.generateSideWallUV(n,r,he-6,he-3,he-2,he-1);ce(Z[0]),ce(Z[1]),ce(Z[3]),ce(Z[1]),ce(Z[2]),ce(Z[3])}function se($){r.push(c[$*3+0]),r.push(c[$*3+1]),r.push(c[$*3+2])}function ce($){s.push($.x),s.push($.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return qf(t,n,e)}static fromJSON(e,t){let n=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];n.push(a)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new No[r.type]().fromJSON(r)),new i(n,e.options)}},Xf={generateTopUV:function(i,e,t,n,r){let s=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[r*3],h=e[r*3+1];return[new ye(s,o),new ye(a,c),new ye(l,h)]},generateSideWallUV:function(i,e,t,n,r,s){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],d=e[n*3+2],u=e[r*3],f=e[r*3+1],g=e[r*3+2],x=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new ye(o,1-c),new ye(l,1-d),new ye(u,1-g),new ye(x,1-p)]:[new ye(a,1-c),new ye(h,1-d),new ye(f,1-g),new ye(m,1-p)]}};function qf(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){let s=i[n];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Yn=class i extends ds{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var _s=class i extends ds{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},At=class i extends It{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(n),c=Math.floor(r),l=a+1,h=c+1,d=e/a,u=t/c,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let E=p*u-o;for(let v=0;v<l;v++){let S=v*d-s;g.push(S,-E,0),x.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<a;E++){let v=E+l*p,S=E+l*(p+1),b=E+1+l*(p+1),y=E+1+l*p;f.push(v,S,y),f.push(S,b,y)}this.setIndex(f),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ms=class i extends It{constructor(e=new ai([new ye(0,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],r=[],s=[],o=[],a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new at(r,3)),this.setAttribute("normal",new at(s,3)),this.setAttribute("uv",new at(o,2));function l(h){let d=r.length/3,u=h.extractPoints(t),f=u.shape,g=u.holes;qn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let E=g[m];qn.isClockWise(E)===!0&&(g[m]=E.reverse())}let x=qn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let E=g[m];f=f.concat(E)}for(let m=0,p=f.length;m<p;m++){let E=f[m];r.push(E.x,E.y,0),s.push(0,0,1),o.push(E.x,E.y)}for(let m=0,p=x.length;m<p;m++){let E=x[m],v=E[0]+d,S=E[1]+d,b=E[2]+d;n.push(v,S,b),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Yf(t,e)}static fromJSON(e,t){let n=[];for(let r=0,s=e.shapes.length;r<s;r++){let o=t[e.shapes[r]];n.push(o)}return new i(n,e.curveSegments)}};function Yf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let r=i[t];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e}var qt=class i extends It{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],d=new U,u=new U,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let E=[],v=p/n,S=0;p===0&&o===0?S=.5/t:p===n&&c===Math.PI&&(S=-.5/t);for(let b=0;b<=t;b++){let y=b/t;d.x=-e*Math.cos(r+y*s)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(r+y*s)*Math.sin(o+v*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(y+S,1-v),E.push(l++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){let v=h[p][E+1],S=h[p][E],b=h[p+1][E],y=h[p+1][E+1];(p!==0||o>0)&&f.push(v,S,y),(p!==n-1||c<Math.PI)&&f.push(S,b,y)}this.setIndex(f),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var fn=class i extends It{constructor(e=1,t=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);let o=[],a=[],c=[],l=[],h=new U,d=new U,u=new U;for(let f=0;f<=n;f++)for(let g=0;g<=r;g++){let x=g/r*s,m=f/n*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(x),d.y=(e+t*Math.cos(m))*Math.sin(x),d.z=t*Math.sin(m),a.push(d.x,d.y,d.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/r),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=r;g++){let x=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,E=(r+1)*f+g;o.push(x,m,E),o.push(m,p,E)}this.setIndex(o),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Es=class i extends It{constructor(e=new ms(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),t=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:s};let o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new U,c=new U,l=new ye,h=new U,d=[],u=[],f=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new at(d,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(f,2));function x(){for(let v=0;v<t;v++)m(v);m(s===!1?t:0),E(),p()}function m(v){h=e.getPointAt(v/t,h);let S=o.normals[v],b=o.binormals[v];for(let y=0;y<=r;y++){let T=y/r*Math.PI*2,k=Math.sin(T),_=-Math.cos(T);c.x=_*S.x+k*b.x,c.y=_*S.y+k*b.y,c.z=_*S.z+k*b.z,c.normalize(),u.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,d.push(a.x,a.y,a.z)}}function p(){for(let v=1;v<=t;v++)for(let S=1;S<=r;S++){let b=(r+1)*(v-1)+(S-1),y=(r+1)*v+(S-1),T=(r+1)*v+S,k=(r+1)*(v-1)+S;g.push(b,y,k),g.push(y,T,k)}}function E(){for(let v=0;v<=t;v++)for(let S=0;S<=r;S++)l.x=v/t,l.y=S/r,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new No[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Le=class extends _i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fc,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Fo=class extends _i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Bo=class extends _i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function yo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Kf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Xi=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Oo=class extends Xi{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Hl,endingEnd:Hl}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case Gl:s=e,a=2*t-n;break;case Vl:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Gl:o=e,c=2*n-t;break;case Vl:o=1,c=n+r[1]-r[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-t)/(r-t),x=g*g,m=x*g,p=-u*m+2*u*x-u*g,E=(1+u)*m+(-1.5-2*u)*x+(-.5+u)*g+1,v=(-1-f)*m+(1.5+f)*x+.5*g,S=f*m-f*x;for(let b=0;b!==a;++b)s[b]=p*o[h+b]+E*o[l+b]+v*o[c+b]+S*o[d+b];return s}},zo=class extends Xi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(r-t),d=1-h;for(let u=0;u!==a;++u)s[u]=o[l+u]*d+o[c+u]*h;return s}},Ho=class extends Xi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Tn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yo(t,this.TimeBufferType),this.values=yo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yo(e.times,Array),values:yo(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ho(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new zo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Oo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case jr:t=this.InterpolantFactoryMethodDiscrete;break;case So:t=this.InterpolantFactoryMethodLinear;break;case vo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return st("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jr;case this.InterpolantFactoryMethodLinear:return So;case this.InterpolantFactoryMethodSmooth:return vo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ut("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(ut("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){ut("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){ut("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(r!==void 0&&Kf(r))for(let a=0,c=r.length;a!==c;++a){let l=r[a];if(isNaN(l)){ut("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===vo,s=e.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(r)c=!0;else{let d=a*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){let x=t[d+g];if(x!==t[u+g]||x!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Tn.prototype.ValueTypeName="";Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=So;var Mi=class extends Tn{constructor(e,t,n){super(e,t,n)}};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=jr;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var Go=class extends Tn{constructor(e,t,n,r){super(e,t,n,r)}};Go.prototype.ValueTypeName="color";var Vo=class extends Tn{constructor(e,t,n,r){super(e,t,n,r)}};Vo.prototype.ValueTypeName="number";var Wo=class extends Xi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(r-t),l=e*a;for(let h=l+a;l!==h;l+=4)zn.slerpFlat(s,0,o,l-a,o,l,c);return s}},Ss=class extends Tn{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}};Ss.prototype.ValueTypeName="quaternion";Ss.prototype.InterpolantFactoryMethodSmooth=void 0;var Ei=class extends Tn{constructor(e,t,n){super(e,t,n)}};Ei.prototype.ValueTypeName="string";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=jr;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var Xo=class extends Tn{constructor(e,t,n,r){super(e,t,n,r)}};Xo.prototype.ValueTypeName="vector";var qo=class{constructor(e,t,n){let r=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){let f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wd=new qo,Yo=class{constructor(e){this.manager=e!==void 0?e:wd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Yo.DEFAULT_MATERIAL_NAME="__DEFAULT";var qi=class extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ot(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Yi=class extends qi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ot(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Ol=new Mt,Ch=new U,Ih=new U,ws=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=Gn,this.map=null,this.mapPass=null,this.matrix=new Mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Rr,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ch.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ch),Ih.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ih),t.updateMatrixWorld(),Ol.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ol,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ol)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},$l=class extends ws{constructor(){super(new Xt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=es*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Ts=class extends qi{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new $l}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Ph=new Mt,qr=new U,zl=new U,jl=class extends ws{constructor(){super(new Xt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ye(4,2),this._viewportCount=6,this._viewports=[new yt(2,1,1,1),new yt(0,1,1,1),new yt(3,1,1,1),new yt(1,1,1,1),new yt(3,0,1,1),new yt(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),qr.setFromMatrixPosition(e.matrixWorld),n.position.copy(qr),zl.copy(n.position),zl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(zl),n.updateMatrixWorld(),r.makeTranslation(-qr.x,-qr.y,-qr.z),Ph.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ph,n.coordinateSystem,n.reversedDepth)}},Ki=class extends qi{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new jl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},As=class extends ss{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,o=n+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Zl=class extends ws{constructor(){super(new As(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Rs=class extends qi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new Zl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Ko=class extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Cs=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var vc="\\[\\]\\.:\\/",$f=new RegExp("["+vc+"]","g"),_c="[^"+vc+"]",jf="[^"+vc.replace("\\.","")+"]",Zf=/((?:WC+[\/:])*)/.source.replace("WC",_c),Jf=/(WCOD+)?/.source.replace("WCOD",jf),Qf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_c),ep=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_c),tp=new RegExp("^"+Zf+Jf+Qf+ep+"$"),np=["material","materials","bones","map"],Jl=class{constructor(e,t,n){let r=n||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($f,"")}static parseTrackName(e){let t=tp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);np.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){st("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ut("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ut("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ut("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ut("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){ut("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[r];if(o===void 0){let l=t.nodeName;ut("PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=Jl;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var x1=new Float32Array(1);function Mc(i,e,t,n){let r=ip(n);switch(t){case hc:return i*e;case uc:return i*e/r.components*r.byteLength;case ha:return i*e/r.components*r.byteLength;case da:return i*e*2/r.components*r.byteLength;case ua:return i*e*2/r.components*r.byteLength;case dc:return i*e*3/r.components*r.byteLength;case Ln:return i*e*4/r.components*r.byteLength;case fa:return i*e*4/r.components*r.byteLength;case ks:case Ds:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ls:case Ns:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ma:case xa:return Math.max(i,16)*Math.max(e,8)/4;case pa:case ga:return Math.max(i,8)*Math.max(e,8)/2;case ba:case ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case _a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ma:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ea:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case wa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ra:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ca:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ka:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Da:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case La:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Na:case Ua:case Fa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ba:case Oa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case za:case Ha:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ip(i){switch(i){case Gn:case oc:return{byteLength:1,components:1};case kr:case ac:case Zi:return{byteLength:2,components:1};case la:case ca:return{byteLength:2,components:4};case Si:case aa:case jn:return{byteLength:4,components:1};case lc:case cc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"181"}}));typeof window<"u"&&(window.__THREE__?st("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="181");function Kd(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function dp(i){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){let h=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],x=d[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let x=d[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,_p=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ep=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,wp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Np=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Up=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Bp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Op=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Xp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Yp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,e0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,t0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,n0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,i0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,r0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,s0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,o0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,a0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,l0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,c0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,h0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,d0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,u0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,f0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,p0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,m0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,g0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,b0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,y0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,v0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,M0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,E0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,S0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,w0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,T0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,A0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,R0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,I0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,P0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,k0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,D0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,L0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,N0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,U0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,F0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,B0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,O0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,z0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,H0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,G0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,V0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,W0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,X0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,q0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Y0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,K0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,j0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Z0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,J0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Q0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,em=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,tm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,nm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,im=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,om=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,hm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,um=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,bm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ym=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Im=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,km=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Um=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Om=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,zm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:up,alphahash_pars_fragment:fp,alphamap_fragment:pp,alphamap_pars_fragment:mp,alphatest_fragment:gp,alphatest_pars_fragment:xp,aomap_fragment:bp,aomap_pars_fragment:yp,batching_pars_vertex:vp,batching_vertex:_p,begin_vertex:Mp,beginnormal_vertex:Ep,bsdfs:Sp,iridescence_fragment:wp,bumpmap_pars_fragment:Tp,clipping_planes_fragment:Ap,clipping_planes_pars_fragment:Rp,clipping_planes_pars_vertex:Cp,clipping_planes_vertex:Ip,color_fragment:Pp,color_pars_fragment:kp,color_pars_vertex:Dp,color_vertex:Lp,common:Np,cube_uv_reflection_fragment:Up,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Bp,displacementmap_vertex:Op,emissivemap_fragment:zp,emissivemap_pars_fragment:Hp,colorspace_fragment:Gp,colorspace_pars_fragment:Vp,envmap_fragment:Wp,envmap_common_pars_fragment:Xp,envmap_pars_fragment:qp,envmap_pars_vertex:Yp,envmap_physical_pars_fragment:r0,envmap_vertex:Kp,fog_vertex:$p,fog_pars_vertex:jp,fog_fragment:Zp,fog_pars_fragment:Jp,gradientmap_pars_fragment:Qp,lightmap_pars_fragment:e0,lights_lambert_fragment:t0,lights_lambert_pars_fragment:n0,lights_pars_begin:i0,lights_toon_fragment:s0,lights_toon_pars_fragment:o0,lights_phong_fragment:a0,lights_phong_pars_fragment:l0,lights_physical_fragment:c0,lights_physical_pars_fragment:h0,lights_fragment_begin:d0,lights_fragment_maps:u0,lights_fragment_end:f0,logdepthbuf_fragment:p0,logdepthbuf_pars_fragment:m0,logdepthbuf_pars_vertex:g0,logdepthbuf_vertex:x0,map_fragment:b0,map_pars_fragment:y0,map_particle_fragment:v0,map_particle_pars_fragment:_0,metalnessmap_fragment:M0,metalnessmap_pars_fragment:E0,morphinstance_vertex:S0,morphcolor_vertex:w0,morphnormal_vertex:T0,morphtarget_pars_vertex:A0,morphtarget_vertex:R0,normal_fragment_begin:C0,normal_fragment_maps:I0,normal_pars_fragment:P0,normal_pars_vertex:k0,normal_vertex:D0,normalmap_pars_fragment:L0,clearcoat_normal_fragment_begin:N0,clearcoat_normal_fragment_maps:U0,clearcoat_pars_fragment:F0,iridescence_pars_fragment:B0,opaque_fragment:O0,packing:z0,premultiplied_alpha_fragment:H0,project_vertex:G0,dithering_fragment:V0,dithering_pars_fragment:W0,roughnessmap_fragment:X0,roughnessmap_pars_fragment:q0,shadowmap_pars_fragment:Y0,shadowmap_pars_vertex:K0,shadowmap_vertex:$0,shadowmask_pars_fragment:j0,skinbase_vertex:Z0,skinning_pars_vertex:J0,skinning_vertex:Q0,skinnormal_vertex:em,specularmap_fragment:tm,specularmap_pars_fragment:nm,tonemapping_fragment:im,tonemapping_pars_fragment:rm,transmission_fragment:sm,transmission_pars_fragment:om,uv_pars_fragment:am,uv_pars_vertex:lm,uv_vertex:cm,worldpos_vertex:hm,background_vert:dm,background_frag:um,backgroundCube_vert:fm,backgroundCube_frag:pm,cube_vert:mm,cube_frag:gm,depth_vert:xm,depth_frag:bm,distanceRGBA_vert:ym,distanceRGBA_frag:vm,equirect_vert:_m,equirect_frag:Mm,linedashed_vert:Em,linedashed_frag:Sm,meshbasic_vert:wm,meshbasic_frag:Tm,meshlambert_vert:Am,meshlambert_frag:Rm,meshmatcap_vert:Cm,meshmatcap_frag:Im,meshnormal_vert:Pm,meshnormal_frag:km,meshphong_vert:Dm,meshphong_frag:Lm,meshphysical_vert:Nm,meshphysical_frag:Um,meshtoon_vert:Fm,meshtoon_frag:Bm,points_vert:Om,points_frag:zm,shadow_vert:Hm,shadow_frag:Gm,sprite_vert:Vm,sprite_frag:Wm},Ce={common:{diffuse:{value:new ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ht}},envmap:{envMap:{value:null},envMapRotation:{value:new ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ht},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0},uvTransform:{value:new ht}},sprite:{diffuse:{value:new ot(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}}},Zn={basic:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new ot(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new ot(0)},specular:{value:new ot(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:cn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:cn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new ot(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:cn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:cn([Ce.points,Ce.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:cn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:cn([Ce.common,Ce.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:cn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:cn([Ce.sprite,Ce.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ht}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:cn([Ce.common,Ce.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:cn([Ce.lights,Ce.fog,{color:{value:new ot(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};Zn.physical={uniforms:cn([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ht},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ht},sheen:{value:0},sheenColor:{value:new ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ht},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ht},attenuationDistance:{value:0},attenuationColor:{value:new ot(0)},specularColor:{value:new ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ht},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ht}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};var Ga={r:0,b:0,g:0},Qi=new Hn,Xm=new Mt;function qm(i,e,t,n,r,s,o){let a=new ot(0),c=s===!0?0:1,l,h,d=null,u=0,f=null;function g(v){let S=v.isScene===!0?v.background:null;return S&&S.isTexture&&(S=(v.backgroundBlurriness>0?t:e).get(S)),S}function x(v){let S=!1,b=g(v);b===null?p(a,c):b&&b.isColor&&(p(b,1),S=!0);let y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,S){let b=g(S);b&&(b.isCubeTexture||b.mapping===Is)?(h===void 0&&(h=new K(new tt(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Ji(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,T,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Qi.copy(S.backgroundRotation),Qi.x*=-1,Qi.y*=-1,Qi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Qi.y*=-1,Qi.z*=-1),h.material.uniforms.envMap.value=b,h.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Xm.makeRotationFromEuler(Qi)),h.material.toneMapped=gt.getTransfer(b.colorSpace)!==Et,(d!==b||u!==b.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=b,u=b.version,f=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new K(new At(2,2),new bn({name:"BackgroundMaterial",uniforms:Ji(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=gt.getTransfer(b.colorSpace)!==Et,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||u!==b.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,d=b,u=b.version,f=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,S){v.getRGB(Ga,bc(i)),n.buffers.color.setClear(Ga.r,Ga.g,Ga.b,S,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,S=1){a.set(v),c=S,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(a,c)},render:x,addToRenderList:m,dispose:E}}function Ym(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=u(null),s=r,o=!1;function a(M,D,L,N,z){let O=!1,G=d(N,L,D);s!==G&&(s=G,l(s.object)),O=f(M,N,L,z),O&&g(M,N,L,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,S(M,D,L,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function d(M,D,L){let N=L.wireframe===!0,z=n[M.id];z===void 0&&(z={},n[M.id]=z);let O=z[D.id];O===void 0&&(O={},z[D.id]=O);let G=O[N];return G===void 0&&(G=u(c()),O[N]=G),G}function u(M){let D=[],L=[],N=[];for(let z=0;z<t;z++)D[z]=0,L[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:L,attributeDivisors:N,object:M,attributes:{},index:null}}function f(M,D,L,N){let z=s.attributes,O=D.attributes,G=0,Y=L.getAttributes();for(let H in Y)if(Y[H].location>=0){let ee=z[H],re=O[H];if(re===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(re=M.instanceColor)),ee===void 0||ee.attribute!==re||re&&ee.data!==re.data)return!0;G++}return s.attributesNum!==G||s.index!==N}function g(M,D,L,N){let z={},O=D.attributes,G=0,Y=L.getAttributes();for(let H in Y)if(Y[H].location>=0){let ee=O[H];ee===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(ee=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(ee=M.instanceColor));let re={};re.attribute=ee,ee&&ee.data&&(re.data=ee.data),z[H]=re,G++}s.attributes=z,s.attributesNum=G,s.index=N}function x(){let M=s.newAttributes;for(let D=0,L=M.length;D<L;D++)M[D]=0}function m(M){p(M,0)}function p(M,D){let L=s.newAttributes,N=s.enabledAttributes,z=s.attributeDivisors;L[M]=1,N[M]===0&&(i.enableVertexAttribArray(M),N[M]=1),z[M]!==D&&(i.vertexAttribDivisor(M,D),z[M]=D)}function E(){let M=s.newAttributes,D=s.enabledAttributes;for(let L=0,N=D.length;L<N;L++)D[L]!==M[L]&&(i.disableVertexAttribArray(L),D[L]=0)}function v(M,D,L,N,z,O,G){G===!0?i.vertexAttribIPointer(M,D,L,z,O):i.vertexAttribPointer(M,D,L,N,z,O)}function S(M,D,L,N){x();let z=N.attributes,O=L.getAttributes(),G=D.defaultAttributeValues;for(let Y in O){let H=O[Y];if(H.location>=0){let V=z[Y];if(V===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(V=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(V=M.instanceColor)),V!==void 0){let ee=V.normalized,re=V.itemSize,xe=e.get(V);if(xe===void 0)continue;let ke=xe.buffer,Xe=xe.type,je=xe.bytesPerElement,j=Xe===i.INT||Xe===i.UNSIGNED_INT||V.gpuType===aa;if(V.isInterleavedBufferAttribute){let oe=V.data,Ae=oe.stride,ze=V.offset;if(oe.isInstancedInterleavedBuffer){for(let Be=0;Be<H.locationSize;Be++)p(H.location+Be,oe.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Be=0;Be<H.locationSize;Be++)m(H.location+Be);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let Be=0;Be<H.locationSize;Be++)v(H.location+Be,re/H.locationSize,Xe,ee,Ae*je,(ze+re/H.locationSize*Be)*je,j)}else{if(V.isInstancedBufferAttribute){for(let oe=0;oe<H.locationSize;oe++)p(H.location+oe,V.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let oe=0;oe<H.locationSize;oe++)m(H.location+oe);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let oe=0;oe<H.locationSize;oe++)v(H.location+oe,re/H.locationSize,Xe,ee,re*je,re/H.locationSize*oe*je,j)}}else if(G!==void 0){let ee=G[Y];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(H.location,ee);break;case 3:i.vertexAttrib3fv(H.location,ee);break;case 4:i.vertexAttrib4fv(H.location,ee);break;default:i.vertexAttrib1fv(H.location,ee)}}}}E()}function b(){k();for(let M in n){let D=n[M];for(let L in D){let N=D[L];for(let z in N)h(N[z].object),delete N[z];delete D[L]}delete n[M]}}function y(M){if(n[M.id]===void 0)return;let D=n[M.id];for(let L in D){let N=D[L];for(let z in N)h(N[z].object),delete N[z];delete D[L]}delete n[M.id]}function T(M){for(let D in n){let L=n[D];if(L[M.id]===void 0)continue;let N=L[M.id];for(let z in N)h(N[z].object),delete N[z];delete L[M.id]}}function k(){_(),o=!0,s!==r&&(s=r,l(s.object))}function _(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:k,resetDefaultState:_,dispose:b,releaseStatesOfGeometry:y,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Km(i,e,t){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function a(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}function c(l,h,d,u){if(d===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let g=0;for(let x=0;x<d;x++)g+=h[x]*u[x];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function $m(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==Ln&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let k=T===Zi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Gn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==jn&&!k)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(st("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,y=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:v,maxFragmentUniforms:S,vertexTextures:b,maxSamples:y}}function jm(i){let e=this,t=null,n=0,r=!1,s=!1,o=new In,a=new ht,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||r;return r=u,n=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{let E=s?0:n,v=E*4,S=p.clippingState||null;c.value=S,S=h(g,u,v,f);for(let b=0;b!==v;++b)S[b]=t[b];p.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){let x=d!==null?d.length:0,m=null;if(x!==0){if(m=c.value,g!==!0||m===null){let p=f+x*4,E=u.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,S=f;v!==x;++v,S+=4)o.copy(d[v]).applyMatrix4(E,a),o.normal.toArray(m,S),m[S+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function Zm(i){let e=new WeakMap;function t(o,a){return a===ia?o.mapping=$i:a===ra&&(o.mapping=ji),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ia||a===ra)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Io(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}var wi=4,Td=[.125,.215,.35,.446,.526,.582],tr=20,Jm=256,Us=new As,Ad=new ot,Ec=null,Sc=0,wc=0,Tc=!1,Qm=new U,Wa=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){let{size:o=256,position:a=Qm}=s;Ec=this._renderer.getRenderTarget(),Sc=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Id(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ec,Sc,wc),this._renderer.xr.enabled=Tc,e.scissorTest=!1,Ur(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$i||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ec=this._renderer.getRenderTarget(),Sc=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:Zi,format:Ln,colorSpace:Gi,depthBuffer:!1},r=Rd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rd(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=eg(s)),this._blurMaterial=ng(s,e,t),this._ggxMaterial=tg(s,e,t)}return r}_compileMaterial(e){let t=new K(new It,e);this._renderer.compile(t,Us)}_sceneToCubeUV(e,t,n,r,s){let c=new Xt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Ad),d.toneMapping=li,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new K(new tt,new Dn({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,m=x.material,p=!1,E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,p=!0):(m.color.copy(Ad),p=!0);for(let v=0;v<6;v++){let S=v%3;S===0?(c.up.set(0,l[v],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[v],s.y,s.z)):S===1?(c.up.set(0,0,l[v]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[v],s.z)):(c.up.set(0,l[v],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[v]));let b=this._cubeSize;Ur(r,S*b,v>2?b:0,b,b),d.setRenderTarget(r),p&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===$i||e.mapping===ji;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Id()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cd());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let c=this._cubeSize;Ur(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Us)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let c=o.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=.05+l*.95,f=d*u,{_lodMax:g}=this,x=this._sizeLods[n],m=3*x*(n>g-wi?n-g+wi:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Ur(s,m,p,3*x,2*x),r.setRenderTarget(s),r.render(a,Us),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=g-n,Ur(e,m,p,3*x,2*x),r.setRenderTarget(e),r.render(a,Us)}_blur(e,t,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ut("blur direction must be either latitudinal or longitudinal!");let h=3,d=this._lodMeshes[r];d.material=l;let u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*tr-1),x=s/g,m=isFinite(s)?1+Math.floor(h*x):tr;m>tr&&st(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${tr}`);let p=[],E=0;for(let T=0;T<tr;++T){let k=T/x,_=Math.exp(-k*k/2);p.push(_),T===0?E+=_:T<m&&(E+=2*_)}for(let T=0;T<p.length;T++)p[T]=p[T]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-n;let S=this._sizeLods[r],b=3*S*(r>v-wi?r-v+wi:0),y=4*(this._cubeSize-S);Ur(t,b,y,3*S,2*S),c.setRenderTarget(t),c.render(d,Us)}};function eg(i){let e=[],t=[],n=[],r=i,s=i-wi+1+Td.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);e.push(a);let c=1/a;o>i-wi?c=Td[o-i+wi-1]:o===0&&(c=0),t.push(c);let l=1/(a-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,x=3,m=2,p=1,E=new Float32Array(x*g*f),v=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let y=0;y<f;y++){let T=y%3*2/3-1,k=y>2?0:-1,_=[T,k,0,T+2/3,k,0,T+2/3,k+1,0,T,k,0,T+2/3,k+1,0,T,k+1,0];E.set(_,x*g*y),v.set(u,m*g*y);let M=[y,y,y,y,y,y];S.set(M,p*g*y)}let b=new It;b.setAttribute("position",new dn(E,x)),b.setAttribute("uv",new dn(v,m)),b.setAttribute("faceIndex",new dn(S,p)),n.push(new K(b,null)),r>wi&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Rd(i,e,t){let n=new kn(i,e,t);return n.texture.mapping=Is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ur(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function tg(i,e,t){return new bn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Jm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:qa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function ng(i,e,t){let n=new Float32Array(tr),r=new U(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:tr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Cd(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Id(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function qa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ig(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ia||c===ra,h=c===$i||c===ji;if(l||h){let d=e.get(a),u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new Wa(i)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&r(f)?(t===null&&(t=new Wa(i)),d=l?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function r(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function rg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&Sr("WebGLRenderer: "+n+" extension not supported."),r}}}function sg(i,e,t,n){let r={},s=new WeakMap;function o(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete r[u.id];let f=s.get(u);f&&(e.remove(f),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,t.memory.geometries++),u}function c(d){let u=d.attributes;for(let f in u)e.update(u[f],i.ARRAY_BUFFER)}function l(d){let u=[],f=d.index,g=d.attributes.position,x=0;if(f!==null){let E=f.array;x=f.version;for(let v=0,S=E.length;v<S;v+=3){let b=E[v+0],y=E[v+1],T=E[v+2];u.push(b,y,y,T,T,b)}}else if(g!==void 0){let E=g.array;x=g.version;for(let v=0,S=E.length/3-1;v<S;v+=3){let b=v+0,y=v+1,T=v+2;u.push(b,y,y,T,T,b)}}else return;let m=new(gc(u)?rs:is)(u,1);m.version=x;let p=s.get(d);p&&e.remove(p),s.set(d,m)}function h(d){let u=s.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return s.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function og(i,e,t){let n;function r(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function c(u,f){i.drawElements(n,f,s,u*o),t.update(f,n,1)}function l(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,u*o,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function d(u,f,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/o,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,u,0,x,0,g);let p=0;for(let E=0;E<g;E++)p+=f[E]*x[E];t.update(p,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function ag(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:ut("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function lg(i,e,t){let n=new WeakMap,r=new yt;function s(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let _=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",_)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],v=0;f===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let S=a.attributes.position.count*v,b=1;S>e.maxTextureSize&&(b=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let y=new Float32Array(S*b*4*d),T=new ts(y,S,b,d);T.type=jn,T.needsUpdate=!0;let k=v*4;for(let M=0;M<d;M++){let D=m[M],L=p[M],N=E[M],z=S*b*4*M;for(let O=0;O<D.count;O++){let G=O*k;f===!0&&(r.fromBufferAttribute(D,O),y[z+G+0]=r.x,y[z+G+1]=r.y,y[z+G+2]=r.z,y[z+G+3]=0),g===!0&&(r.fromBufferAttribute(L,O),y[z+G+4]=r.x,y[z+G+5]=r.y,y[z+G+6]=r.z,y[z+G+7]=0),x===!0&&(r.fromBufferAttribute(N,O),y[z+G+8]=r.x,y[z+G+9]=r.y,y[z+G+10]=r.z,y[z+G+11]=N.itemSize===4?r.w:1)}}u={count:d,texture:T,size:new ye(S,b)},n.set(a,u),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:s}}function cg(i,e,t,n){let r=new WeakMap;function s(c){let l=n.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let u=c.skeleton;r.get(u)!==l&&(u.update(),r.set(u,l))}return d}function o(){r=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}var $d=new un,Pd=new cs(1,1),jd=new ts,Zd=new Ao,Jd=new os,kd=[],Dd=[],Ld=new Float32Array(16),Nd=new Float32Array(9),Ud=new Float32Array(4);function Br(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=kd[r];if(s===void 0&&(s=new Float32Array(r),kd[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function $t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function jt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ya(i,e){let t=Dd[e];t===void 0&&(t=new Int32Array(e),Dd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function hg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function dg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2fv(this.addr,e),jt(t,e)}}function ug(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;i.uniform3fv(this.addr,e),jt(t,e)}}function fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4fv(this.addr,e),jt(t,e)}}function pg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;Ud.set(n),i.uniformMatrix2fv(this.addr,!1,Ud),jt(t,n)}}function mg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;Nd.set(n),i.uniformMatrix3fv(this.addr,!1,Nd),jt(t,n)}}function gg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;Ld.set(n),i.uniformMatrix4fv(this.addr,!1,Ld),jt(t,n)}}function xg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function bg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2iv(this.addr,e),jt(t,e)}}function yg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3iv(this.addr,e),jt(t,e)}}function vg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4iv(this.addr,e),jt(t,e)}}function _g(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Mg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2uiv(this.addr,e),jt(t,e)}}function Eg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3uiv(this.addr,e),jt(t,e)}}function Sg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4uiv(this.addr,e),jt(t,e)}}function wg(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Pd.compareFunction=pc,s=Pd):s=$d,t.setTexture2D(e||s,r)}function Tg(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Zd,r)}function Ag(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Jd,r)}function Rg(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||jd,r)}function Cg(i){switch(i){case 5126:return hg;case 35664:return dg;case 35665:return ug;case 35666:return fg;case 35674:return pg;case 35675:return mg;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return bg;case 35668:case 35672:return yg;case 35669:case 35673:return vg;case 5125:return _g;case 36294:return Mg;case 36295:return Eg;case 36296:return Sg;case 35678:case 36198:case 36298:case 36306:case 35682:return wg;case 35679:case 36299:case 36307:return Tg;case 35680:case 36300:case 36308:case 36293:return Ag;case 36289:case 36303:case 36311:case 36292:return Rg}}function Ig(i,e){i.uniform1fv(this.addr,e)}function Pg(i,e){let t=Br(e,this.size,2);i.uniform2fv(this.addr,t)}function kg(i,e){let t=Br(e,this.size,3);i.uniform3fv(this.addr,t)}function Dg(i,e){let t=Br(e,this.size,4);i.uniform4fv(this.addr,t)}function Lg(i,e){let t=Br(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ng(i,e){let t=Br(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ug(i,e){let t=Br(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Fg(i,e){i.uniform1iv(this.addr,e)}function Bg(i,e){i.uniform2iv(this.addr,e)}function Og(i,e){i.uniform3iv(this.addr,e)}function zg(i,e){i.uniform4iv(this.addr,e)}function Hg(i,e){i.uniform1uiv(this.addr,e)}function Gg(i,e){i.uniform2uiv(this.addr,e)}function Vg(i,e){i.uniform3uiv(this.addr,e)}function Wg(i,e){i.uniform4uiv(this.addr,e)}function Xg(i,e,t){let n=this.cache,r=e.length,s=Ya(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||$d,s[o])}function qg(i,e,t){let n=this.cache,r=e.length,s=Ya(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Zd,s[o])}function Yg(i,e,t){let n=this.cache,r=e.length,s=Ya(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Jd,s[o])}function Kg(i,e,t){let n=this.cache,r=e.length,s=Ya(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||jd,s[o])}function $g(i){switch(i){case 5126:return Ig;case 35664:return Pg;case 35665:return kg;case 35666:return Dg;case 35674:return Lg;case 35675:return Ng;case 35676:return Ug;case 5124:case 35670:return Fg;case 35667:case 35671:return Bg;case 35668:case 35672:return Og;case 35669:case 35673:return zg;case 5125:return Hg;case 36294:return Gg;case 36295:return Vg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return qg;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Kg}}var Rc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Cg(t.type)}},Cc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$g(t.type)}},Ic=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],n)}}},Ac=/(\w+)(\])?(\[|\.)?/g;function Fd(i,e){i.seq.push(e),i.map[e.id]=e}function jg(i,e,t){let n=i.name,r=n.length;for(Ac.lastIndex=0;;){let s=Ac.exec(n),o=Ac.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){Fd(t,l===void 0?new Rc(a,i,e):new Cc(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Ic(a),Fd(t,d)),t=d}}}var Fr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);jg(s,o,this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&n.push(o)}return n}};function Bd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Zg=37297,Jg=0;function Qg(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Od=new ht;function ex(i){gt._getMatrix(Od,gt.workingColorSpace,i);let e=`mat3( ${Od.elements.map(t=>t.toFixed(4))} )`;switch(gt.getTransfer(i)){case Zr:return[e,"LinearTransferOETF"];case Et:return[e,"sRGBTransferOETF"];default:return st("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function zd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Qg(i.getShaderSource(e),a)}else return s}function tx(i,e){let t=ex(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function nx(i,e){let t;switch(e){case td:t="Linear";break;case nd:t="Reinhard";break;case id:t="Cineon";break;case na:t="ACESFilmic";break;case sd:t="AgX";break;case od:t="Neutral";break;case rd:t="Custom";break;default:st("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Va=new U;function ix(){gt.getLuminanceCoefficients(Va);let i=Va.x.toFixed(4),e=Va.y.toFixed(4),t=Va.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function sx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ox(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),o=s.name,a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Fs(i){return i!==""}function Hd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var ax=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pc(i){return i.replace(ax,cx)}var lx=new Map;function cx(i,e){let t=dt[e];if(t===void 0){let n=lx.get(e);if(n!==void 0)t=dt[n],st('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Pc(t)}var hx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vd(i){return i.replace(hx,dx)}function dx(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function ux(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ec?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Lh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Kn&&(e="SHADOWMAP_TYPE_VSM"),e}function fx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case $i:case ji:e="ENVMAP_TYPE_CUBE";break;case Is:e="ENVMAP_TYPE_CUBE_UV";break}return e}function px(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ji:e="ENVMAP_MODE_REFRACTION";break}return e}function mx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case rc:e="ENVMAP_BLENDING_MULTIPLY";break;case Qh:e="ENVMAP_BLENDING_MIX";break;case ed:e="ENVMAP_BLENDING_ADD";break}return e}function gx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function xx(i,e,t,n){let r=i.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,c=ux(t),l=fx(t),h=px(t),d=mx(t),u=gx(t),f=rx(t),g=sx(s),x=r.createProgram(),m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Fs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Fs).join(`
`),p.length>0&&(p+=`
`)):(m=[Wd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),p=[Wd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==li?"#define TONE_MAPPING":"",t.toneMapping!==li?dt.tonemapping_pars_fragment:"",t.toneMapping!==li?nx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,tx("linearToOutputTexel",t.outputColorSpace),ix(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Fs).join(`
`)),o=Pc(o),o=Hd(o,t),o=Gd(o,t),a=Pc(a),a=Hd(a,t),a=Gd(a,t),o=Vd(o),a=Vd(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let v=E+m+o,S=E+p+a,b=Bd(r,r.VERTEX_SHADER,v),y=Bd(r,r.FRAGMENT_SHADER,S);r.attachShader(x,b),r.attachShader(x,y),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(D){if(i.debug.checkShaderErrors){let L=r.getProgramInfoLog(x)||"",N=r.getShaderInfoLog(b)||"",z=r.getShaderInfoLog(y)||"",O=L.trim(),G=N.trim(),Y=z.trim(),H=!0,V=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,b,y);else{let ee=zd(r,b,"vertex"),re=zd(r,y,"fragment");ut("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+O+`
`+ee+`
`+re)}else O!==""?st("WebGLProgram: Program Info Log:",O):(G===""||Y==="")&&(V=!1);V&&(D.diagnostics={runnable:H,programLog:O,vertexShader:{log:G,prefix:m},fragmentShader:{log:Y,prefix:p}})}r.deleteShader(b),r.deleteShader(y),k=new Fr(r,x),_=ox(r,x)}let k;this.getUniforms=function(){return k===void 0&&T(this),k};let _;this.getAttributes=function(){return _===void 0&&T(this),_};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(x,Zg)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=y,this}var bx=0,kc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Dc(e),t.set(e,n)),n}},Dc=class{constructor(e){this.id=bx++,this.code=e,this.usedTimes=0}};function yx(i,e,t,n,r,s,o){let a=new ns,c=new kc,l=new Set,h=[],d=r.logarithmicDepthBuffer,u=r.vertexTextures,f=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,M,D,L,N){let z=L.fog,O=N.geometry,G=_.isMeshStandardMaterial?L.environment:null,Y=(_.isMeshStandardMaterial?t:e).get(_.envMap||G),H=Y&&Y.mapping===Is?Y.image.height:null,V=g[_.type];_.precision!==null&&(f=r.getMaxPrecision(_.precision),f!==_.precision&&st("WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let ee=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,re=ee!==void 0?ee.length:0,xe=0;O.morphAttributes.position!==void 0&&(xe=1),O.morphAttributes.normal!==void 0&&(xe=2),O.morphAttributes.color!==void 0&&(xe=3);let ke,Xe,je,j;if(V){let St=Zn[V];ke=St.vertexShader,Xe=St.fragmentShader}else ke=_.vertexShader,Xe=_.fragmentShader,c.update(_),je=c.getVertexShaderID(_),j=c.getFragmentShaderID(_);let oe=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),ze=N.isInstancedMesh===!0,Be=N.isBatchedMesh===!0,lt=!!_.map,se=!!_.matcap,ce=!!Y,$=!!_.aoMap,C=!!_.lightMap,te=!!_.bumpMap,ae=!!_.normalMap,he=!!_.displacementMap,Z=!!_.emissiveMap,me=!!_.metalnessMap,ue=!!_.roughnessMap,Te=_.anisotropy>0,P=_.clearcoat>0,A=_.dispersion>0,q=_.iridescence>0,ie=_.sheen>0,de=_.transmission>0,ne=Te&&!!_.anisotropyMap,We=P&&!!_.clearcoatMap,Re=P&&!!_.clearcoatNormalMap,Ye=P&&!!_.clearcoatRoughnessMap,Ve=q&&!!_.iridescenceMap,fe=q&&!!_.iridescenceThicknessMap,Me=ie&&!!_.sheenColorMap,et=ie&&!!_.sheenRoughnessMap,Je=!!_.specularMap,Ne=!!_.specularColorMap,rt=!!_.specularIntensityMap,B=de&&!!_.transmissionMap,Ie=de&&!!_.thicknessMap,Se=!!_.gradientMap,we=!!_.alphaMap,ge=_.alphaTest>0,le=!!_.alphaHash,He=!!_.extensions,ct=li;_.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(ct=i.toneMapping);let Rt={shaderID:V,shaderType:_.type,shaderName:_.name,vertexShader:ke,fragmentShader:Xe,defines:_.defines,customVertexShaderID:je,customFragmentShaderID:j,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:Be,batchingColor:Be&&N._colorsTexture!==null,instancing:ze,instancingColor:ze&&N.instanceColor!==null,instancingMorph:ze&&N.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:Gi,alphaToCoverage:!!_.alphaToCoverage,map:lt,matcap:se,envMap:ce,envMapMode:ce&&Y.mapping,envMapCubeUVHeight:H,aoMap:$,lightMap:C,bumpMap:te,normalMap:ae,displacementMap:u&&he,emissiveMap:Z,normalMapObjectSpace:ae&&_.normalMapType===cd,normalMapTangentSpace:ae&&_.normalMapType===fc,metalnessMap:me,roughnessMap:ue,anisotropy:Te,anisotropyMap:ne,clearcoat:P,clearcoatMap:We,clearcoatNormalMap:Re,clearcoatRoughnessMap:Ye,dispersion:A,iridescence:q,iridescenceMap:Ve,iridescenceThicknessMap:fe,sheen:ie,sheenColorMap:Me,sheenRoughnessMap:et,specularMap:Je,specularColorMap:Ne,specularIntensityMap:rt,transmission:de,transmissionMap:B,thicknessMap:Ie,gradientMap:Se,opaque:_.transparent===!1&&_.blending===zi&&_.alphaToCoverage===!1,alphaMap:we,alphaTest:ge,alphaHash:le,combine:_.combine,mapUv:lt&&x(_.map.channel),aoMapUv:$&&x(_.aoMap.channel),lightMapUv:C&&x(_.lightMap.channel),bumpMapUv:te&&x(_.bumpMap.channel),normalMapUv:ae&&x(_.normalMap.channel),displacementMapUv:he&&x(_.displacementMap.channel),emissiveMapUv:Z&&x(_.emissiveMap.channel),metalnessMapUv:me&&x(_.metalnessMap.channel),roughnessMapUv:ue&&x(_.roughnessMap.channel),anisotropyMapUv:ne&&x(_.anisotropyMap.channel),clearcoatMapUv:We&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:Re&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ye&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:et&&x(_.sheenRoughnessMap.channel),specularMapUv:Je&&x(_.specularMap.channel),specularColorMapUv:Ne&&x(_.specularColorMap.channel),specularIntensityMapUv:rt&&x(_.specularIntensityMap.channel),transmissionMapUv:B&&x(_.transmissionMap.channel),thicknessMapUv:Ie&&x(_.thicknessMap.channel),alphaMapUv:we&&x(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ae||Te),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(lt||we),fog:!!z,useFog:_.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ae,skinning:N.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:xe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ct,decodeVideoTexture:lt&&_.map.isVideoTexture===!0&&gt.getTransfer(_.map.colorSpace)===Et,decodeVideoTextureEmissive:Z&&_.emissiveMap.isVideoTexture===!0&&gt.getTransfer(_.emissiveMap.colorSpace)===Et,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Gt,flipSided:_.side===nn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:He&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(He&&_.extensions.multiDraw===!0||Be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Rt.vertexUv1s=l.has(1),Rt.vertexUv2s=l.has(2),Rt.vertexUv3s=l.has(3),l.clear(),Rt}function p(_){let M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(let D in _.defines)M.push(D),M.push(_.defines[D]);return _.isRawShaderMaterial===!1&&(E(M,_),v(M,_),M.push(i.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function E(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function v(_,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),_.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),_.push(a.mask)}function S(_){let M=g[_.type],D;if(M){let L=Zn[M];D=vd.clone(L.uniforms)}else D=_.uniforms;return D}function b(_,M){let D;for(let L=0,N=h.length;L<N;L++){let z=h[L];if(z.cacheKey===M){D=z,++D.usedTimes;break}}return D===void 0&&(D=new xx(i,M,_,s),h.push(D)),D}function y(_){if(--_.usedTimes===0){let M=h.indexOf(_);h[M]=h[h.length-1],h.pop(),_.destroy()}}function T(_){c.remove(_)}function k(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:b,releaseProgram:y,releaseShaderCache:T,programs:h,dispose:k}}function vx(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function _x(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Xd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function qd(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(d,u,f,g,x,m){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:x,group:m},i[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=x,p.group=m),e++,p}function a(d,u,f,g,x,m){let p=o(d,u,f,g,x,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):t.push(p)}function c(d,u,f,g,x,m){let p=o(d,u,f,g,x,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function l(d,u){t.length>1&&t.sort(d||_x),n.length>1&&n.sort(u||Xd),r.length>1&&r.sort(u||Xd)}function h(){for(let d=e,u=i.length;d<u;d++){let f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function Mx(){let i=new WeakMap;function e(n,r){let s=i.get(n),o;return s===void 0?(o=new qd,i.set(n,[o])):r>=s.length?(o=new qd,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ex(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new ot};break;case"SpotLight":t={position:new U,direction:new U,color:new ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new ot,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new ot,groundColor:new ot};break;case"RectAreaLight":t={color:new ot,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function Sx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var wx=0;function Tx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Ax(i){let e=new Ex,t=Sx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);let r=new U,s=new Mt,o=new Mt;function a(l){let h=0,d=0,u=0;for(let _=0;_<9;_++)n.probe[_].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,E=0,v=0,S=0,b=0,y=0,T=0;l.sort(Tx);for(let _=0,M=l.length;_<M;_++){let D=l[_],L=D.color,N=D.intensity,z=D.distance,O=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=L.r*N,d+=L.g*N,u+=L.b*N;else if(D.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(D.sh.coefficients[G],N);T++}else if(D.isDirectionalLight){let G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Y=D.shadow,H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=D.shadow.matrix,E++}n.directional[f]=G,f++}else if(D.isSpotLight){let G=e.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(L).multiplyScalar(N),G.distance=z,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,n.spot[x]=G;let Y=D.shadow;if(D.map&&(n.spotLightMap[b]=D.map,b++,Y.updateMatrices(D),D.castShadow&&y++),n.spotLightMatrix[x]=Y.matrix,D.castShadow){let H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,n.spotShadow[x]=H,n.spotShadowMap[x]=O,S++}x++}else if(D.isRectAreaLight){let G=e.get(D);G.color.copy(L).multiplyScalar(N),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=G,m++}else if(D.isPointLight){let G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){let Y=D.shadow,H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,H.shadowCameraNear=Y.camera.near,H.shadowCameraFar=Y.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=O,n.pointShadowMatrix[g]=D.shadow.matrix,v++}n.point[g]=G,g++}else if(D.isHemisphereLight){let G=e.get(D);G.skyColor.copy(D.color).multiplyScalar(N),G.groundColor.copy(D.groundColor).multiplyScalar(N),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let k=n.hash;(k.directionalLength!==f||k.pointLength!==g||k.spotLength!==x||k.rectAreaLength!==m||k.hemiLength!==p||k.numDirectionalShadows!==E||k.numPointShadows!==v||k.numSpotShadows!==S||k.numSpotMaps!==b||k.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=S+b-y,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=T,k.directionalLength=f,k.pointLength=g,k.spotLength=x,k.rectAreaLength=m,k.hemiLength=p,k.numDirectionalShadows=E,k.numPointShadows=v,k.numSpotShadows=S,k.numSpotMaps=b,k.numLightProbes=T,n.version=wx++)}function c(l,h){let d=0,u=0,f=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){let v=l[p];if(v.isDirectionalLight){let S=n.directional[d];S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(v.isSpotLight){let S=n.spot[f];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),f++}else if(v.isRectAreaLight){let S=n.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let S=n.point[u];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),u++}else if(v.isHemisphereLight){let S=n.hemi[x];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:n}}function Yd(i){let e=new Ax(i),t=[],n=[];function r(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function Rx(i){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Yd(i),e.set(r,[a])):s>=o.length?(a=new Yd(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Cx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ix=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Px(i,e,t){let n=new Rr,r=new ye,s=new ye,o=new yt,a=new Fo({depthPacking:ld}),c=new Bo,l={},h=t.maxTextureSize,d={[si]:nn,[nn]:si,[Gt]:Gt},u=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:Cx,fragmentShader:Ix}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new It;g.setAttribute("position",new dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new K(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ec;let p=this.type;this.render=function(y,T,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;let _=i.getRenderTarget(),M=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),L=i.state;L.setBlending($n),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let N=p!==Kn&&this.type===Kn,z=p===Kn&&this.type!==Kn;for(let O=0,G=y.length;O<G;O++){let Y=y[O],H=Y.shadow;if(H===void 0){st("WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);let V=H.getFrameExtents();if(r.multiply(V),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/V.x),r.x=s.x*V.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/V.y),r.y=s.y*V.y,H.mapSize.y=s.y)),H.map===null||N===!0||z===!0){let re=this.type!==Kn?{minFilter:vt,magFilter:vt}:{};H.map!==null&&H.map.dispose(),H.map=new kn(r.x,r.y,re),H.map.texture.name=Y.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();let ee=H.getViewportCount();for(let re=0;re<ee;re++){let xe=H.getViewport(re);o.set(s.x*xe.x,s.y*xe.y,s.x*xe.z,s.y*xe.w),L.viewport(o),H.updateMatrices(Y,re),n=H.getFrustum(),S(T,k,H.camera,Y,this.type)}H.isPointLightShadow!==!0&&this.type===Kn&&E(H,k),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(_,M,D)};function E(y,T){let k=e.update(x);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new kn(r.x,r.y)),u.uniforms.shadow_pass.value=y.map.texture,u.uniforms.resolution.value=y.mapSize,u.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(T,null,k,u,x,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(T,null,k,f,x,null)}function v(y,T,k,_){let M=null,D=k.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(D!==void 0)M=D;else if(M=k.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let L=M.uuid,N=T.uuid,z=l[L];z===void 0&&(z={},l[L]=z);let O=z[N];O===void 0&&(O=M.clone(),z[N]=O,T.addEventListener("dispose",b)),M=O}if(M.visible=T.visible,M.wireframe=T.wireframe,_===Kn?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:d[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,k.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let L=i.properties.get(M);L.light=k}return M}function S(y,T,k,_,M){if(y.visible===!1)return;if(y.layers.test(T.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&M===Kn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,y.matrixWorld);let N=e.update(y),z=y.material;if(Array.isArray(z)){let O=N.groups;for(let G=0,Y=O.length;G<Y;G++){let H=O[G],V=z[H.materialIndex];if(V&&V.visible){let ee=v(y,V,_,M);y.onBeforeShadow(i,y,T,k,N,ee,H),i.renderBufferDirect(k,null,N,ee,y,H),y.onAfterShadow(i,y,T,k,N,ee,H)}}}else if(z.visible){let O=v(y,z,_,M);y.onBeforeShadow(i,y,T,k,N,O,null),i.renderBufferDirect(k,null,N,O,y,null),y.onAfterShadow(i,y,T,k,N,O,null)}}let L=y.children;for(let N=0,z=L.length;N<z;N++)S(L[N],T,k,_,M)}function b(y){y.target.removeEventListener("dispose",b);for(let k in l){let _=l[k],M=y.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}var kx={[$o]:jo,[Zo]:ea,[Jo]:ta,[Hi]:Qo,[jo]:$o,[ea]:Zo,[ta]:Jo,[Qo]:Hi};function Dx(i,e){function t(){let B=!1,Ie=new yt,Se=null,we=new yt(0,0,0,0);return{setMask:function(ge){Se!==ge&&!B&&(i.colorMask(ge,ge,ge,ge),Se=ge)},setLocked:function(ge){B=ge},setClear:function(ge,le,He,ct,Rt){Rt===!0&&(ge*=ct,le*=ct,He*=ct),Ie.set(ge,le,He,ct),we.equals(Ie)===!1&&(i.clearColor(ge,le,He,ct),we.copy(Ie))},reset:function(){B=!1,Se=null,we.set(-1,0,0,0)}}}function n(){let B=!1,Ie=!1,Se=null,we=null,ge=null;return{setReversed:function(le){if(Ie!==le){let He=e.get("EXT_clip_control");le?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),Ie=le;let ct=ge;ge=null,this.setClear(ct)}},getReversed:function(){return Ie},setTest:function(le){le?oe(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(le){Se!==le&&!B&&(i.depthMask(le),Se=le)},setFunc:function(le){if(Ie&&(le=kx[le]),we!==le){switch(le){case $o:i.depthFunc(i.NEVER);break;case jo:i.depthFunc(i.ALWAYS);break;case Zo:i.depthFunc(i.LESS);break;case Hi:i.depthFunc(i.LEQUAL);break;case Jo:i.depthFunc(i.EQUAL);break;case Qo:i.depthFunc(i.GEQUAL);break;case ea:i.depthFunc(i.GREATER);break;case ta:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=le}},setLocked:function(le){B=le},setClear:function(le){ge!==le&&(Ie&&(le=1-le),i.clearDepth(le),ge=le)},reset:function(){B=!1,Se=null,we=null,ge=null,Ie=!1}}}function r(){let B=!1,Ie=null,Se=null,we=null,ge=null,le=null,He=null,ct=null,Rt=null;return{setTest:function(St){B||(St?oe(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(St){Ie!==St&&!B&&(i.stencilMask(St),Ie=St)},setFunc:function(St,Xn,Nn){(Se!==St||we!==Xn||ge!==Nn)&&(i.stencilFunc(St,Xn,Nn),Se=St,we=Xn,ge=Nn)},setOp:function(St,Xn,Nn){(le!==St||He!==Xn||ct!==Nn)&&(i.stencilOp(St,Xn,Nn),le=St,He=Xn,ct=Nn)},setLocked:function(St){B=St},setClear:function(St){Rt!==St&&(i.clearStencil(St),Rt=St)},reset:function(){B=!1,Ie=null,Se=null,we=null,ge=null,le=null,He=null,ct=null,Rt=null}}}let s=new t,o=new n,a=new r,c=new WeakMap,l=new WeakMap,h={},d={},u=new WeakMap,f=[],g=null,x=!1,m=null,p=null,E=null,v=null,S=null,b=null,y=null,T=new ot(0,0,0),k=0,_=!1,M=null,D=null,L=null,N=null,z=null,O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,Y=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(H)[1]),G=Y>=1):H.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),G=Y>=2);let V=null,ee={},re=i.getParameter(i.SCISSOR_BOX),xe=i.getParameter(i.VIEWPORT),ke=new yt().fromArray(re),Xe=new yt().fromArray(xe);function je(B,Ie,Se,we){let ge=new Uint8Array(4),le=i.createTexture();i.bindTexture(B,le),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let He=0;He<Se;He++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(Ie,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,ge):i.texImage2D(Ie+He,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ge);return le}let j={};j[i.TEXTURE_2D]=je(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),oe(i.DEPTH_TEST),o.setFunc(Hi),te(!1),ae(Ql),oe(i.CULL_FACE),$($n);function oe(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Ae(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function ze(B,Ie){return d[B]!==Ie?(i.bindFramebuffer(B,Ie),d[B]=Ie,B===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Ie),B===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Ie),!0):!1}function Be(B,Ie){let Se=f,we=!1;if(B){Se=u.get(Ie),Se===void 0&&(Se=[],u.set(Ie,Se));let ge=B.textures;if(Se.length!==ge.length||Se[0]!==i.COLOR_ATTACHMENT0){for(let le=0,He=ge.length;le<He;le++)Se[le]=i.COLOR_ATTACHMENT0+le;Se.length=ge.length,we=!0}}else Se[0]!==i.BACK&&(Se[0]=i.BACK,we=!0);we&&i.drawBuffers(Se)}function lt(B){return g!==B?(i.useProgram(B),g=B,!0):!1}let se={[yi]:i.FUNC_ADD,[Uh]:i.FUNC_SUBTRACT,[Fh]:i.FUNC_REVERSE_SUBTRACT};se[Bh]=i.MIN,se[Oh]=i.MAX;let ce={[zh]:i.ZERO,[Hh]:i.ONE,[Gh]:i.SRC_COLOR,[_o]:i.SRC_ALPHA,[Kh]:i.SRC_ALPHA_SATURATE,[qh]:i.DST_COLOR,[Wh]:i.DST_ALPHA,[Vh]:i.ONE_MINUS_SRC_COLOR,[Mo]:i.ONE_MINUS_SRC_ALPHA,[Yh]:i.ONE_MINUS_DST_COLOR,[Xh]:i.ONE_MINUS_DST_ALPHA,[$h]:i.CONSTANT_COLOR,[jh]:i.ONE_MINUS_CONSTANT_COLOR,[Zh]:i.CONSTANT_ALPHA,[Jh]:i.ONE_MINUS_CONSTANT_ALPHA};function $(B,Ie,Se,we,ge,le,He,ct,Rt,St){if(B===$n){x===!0&&(Ae(i.BLEND),x=!1);return}if(x===!1&&(oe(i.BLEND),x=!0),B!==Nh){if(B!==m||St!==_){if((p!==yi||S!==yi)&&(i.blendEquation(i.FUNC_ADD),p=yi,S=yi),St)switch(B){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tc:i.blendFunc(i.ONE,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ic:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ut("WebGLState: Invalid blending: ",B);break}else switch(B){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nc:ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ic:ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ut("WebGLState: Invalid blending: ",B);break}E=null,v=null,b=null,y=null,T.set(0,0,0),k=0,m=B,_=St}return}ge=ge||Ie,le=le||Se,He=He||we,(Ie!==p||ge!==S)&&(i.blendEquationSeparate(se[Ie],se[ge]),p=Ie,S=ge),(Se!==E||we!==v||le!==b||He!==y)&&(i.blendFuncSeparate(ce[Se],ce[we],ce[le],ce[He]),E=Se,v=we,b=le,y=He),(ct.equals(T)===!1||Rt!==k)&&(i.blendColor(ct.r,ct.g,ct.b,Rt),T.copy(ct),k=Rt),m=B,_=!1}function C(B,Ie){B.side===Gt?Ae(i.CULL_FACE):oe(i.CULL_FACE);let Se=B.side===nn;Ie&&(Se=!Se),te(Se),B.blending===zi&&B.transparent===!1?$($n):$(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);let we=B.stencilWrite;a.setTest(we),we&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Z(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function te(B){M!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),M=B)}function ae(B){B!==kh?(oe(i.CULL_FACE),B!==D&&(B===Ql?i.cullFace(i.BACK):B===Dh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),D=B}function he(B){B!==L&&(G&&i.lineWidth(B),L=B)}function Z(B,Ie,Se){B?(oe(i.POLYGON_OFFSET_FILL),(N!==Ie||z!==Se)&&(i.polygonOffset(Ie,Se),N=Ie,z=Se)):Ae(i.POLYGON_OFFSET_FILL)}function me(B){B?oe(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function ue(B){B===void 0&&(B=i.TEXTURE0+O-1),V!==B&&(i.activeTexture(B),V=B)}function Te(B,Ie,Se){Se===void 0&&(V===null?Se=i.TEXTURE0+O-1:Se=V);let we=ee[Se];we===void 0&&(we={type:void 0,texture:void 0},ee[Se]=we),(we.type!==B||we.texture!==Ie)&&(V!==Se&&(i.activeTexture(Se),V=Se),i.bindTexture(B,Ie||j[B]),we.type=B,we.texture=Ie)}function P(){let B=ee[V];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(B){B("WebGLState:",B)}}function q(){try{i.compressedTexImage3D(...arguments)}catch(B){B("WebGLState:",B)}}function ie(){try{i.texSubImage2D(...arguments)}catch(B){B("WebGLState:",B)}}function de(){try{i.texSubImage3D(...arguments)}catch(B){B("WebGLState:",B)}}function ne(){try{i.compressedTexSubImage2D(...arguments)}catch(B){B("WebGLState:",B)}}function We(){try{i.compressedTexSubImage3D(...arguments)}catch(B){B("WebGLState:",B)}}function Re(){try{i.texStorage2D(...arguments)}catch(B){B("WebGLState:",B)}}function Ye(){try{i.texStorage3D(...arguments)}catch(B){B("WebGLState:",B)}}function Ve(){try{i.texImage2D(...arguments)}catch(B){B("WebGLState:",B)}}function fe(){try{i.texImage3D(...arguments)}catch(B){B("WebGLState:",B)}}function Me(B){ke.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),ke.copy(B))}function et(B){Xe.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),Xe.copy(B))}function Je(B,Ie){let Se=l.get(Ie);Se===void 0&&(Se=new WeakMap,l.set(Ie,Se));let we=Se.get(B);we===void 0&&(we=i.getUniformBlockIndex(Ie,B.name),Se.set(B,we))}function Ne(B,Ie){let we=l.get(Ie).get(B);c.get(Ie)!==we&&(i.uniformBlockBinding(Ie,we,B.__bindingPointIndex),c.set(Ie,we))}function rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,ee={},d={},u=new WeakMap,f=[],g=null,x=!1,m=null,p=null,E=null,v=null,S=null,b=null,y=null,T=new ot(0,0,0),k=0,_=!1,M=null,D=null,L=null,N=null,z=null,ke.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:oe,disable:Ae,bindFramebuffer:ze,drawBuffers:Be,useProgram:lt,setBlending:$,setMaterial:C,setFlipSided:te,setCullFace:ae,setLineWidth:he,setPolygonOffset:Z,setScissorTest:me,activeTexture:ue,bindTexture:Te,unbindTexture:P,compressedTexImage2D:A,compressedTexImage3D:q,texImage2D:Ve,texImage3D:fe,updateUBOMapping:Je,uniformBlockBinding:Ne,texStorage2D:Re,texStorage3D:Ye,texSubImage2D:ie,texSubImage3D:de,compressedTexSubImage2D:ne,compressedTexSubImage3D:We,scissor:Me,viewport:et,reset:rt}}function Lx(i,e,t,n,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,h=new WeakMap,d,u=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,A){return f?new OffscreenCanvas(P,A):Qr("canvas")}function x(P,A,q){let ie=1,de=Te(P);if((de.width>q||de.height>q)&&(ie=q/Math.max(de.width,de.height)),ie<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let ne=Math.floor(ie*de.width),We=Math.floor(ie*de.height);d===void 0&&(d=g(ne,We));let Re=A?g(ne,We):d;return Re.width=ne,Re.height=We,Re.getContext("2d").drawImage(P,0,0,ne,We),st("WebGLRenderer: Texture has been resized from ("+de.width+"x"+de.height+") to ("+ne+"x"+We+")."),Re}else return"data"in P&&st("WebGLRenderer: Image in DataTexture is too big ("+de.width+"x"+de.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){i.generateMipmap(P)}function E(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(P,A,q,ie,de=!1){if(P!==null){if(i[P]!==void 0)return i[P];st("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ne=A;if(A===i.RED&&(q===i.FLOAT&&(ne=i.R32F),q===i.HALF_FLOAT&&(ne=i.R16F),q===i.UNSIGNED_BYTE&&(ne=i.R8)),A===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(ne=i.R8UI),q===i.UNSIGNED_SHORT&&(ne=i.R16UI),q===i.UNSIGNED_INT&&(ne=i.R32UI),q===i.BYTE&&(ne=i.R8I),q===i.SHORT&&(ne=i.R16I),q===i.INT&&(ne=i.R32I)),A===i.RG&&(q===i.FLOAT&&(ne=i.RG32F),q===i.HALF_FLOAT&&(ne=i.RG16F),q===i.UNSIGNED_BYTE&&(ne=i.RG8)),A===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(ne=i.RG8UI),q===i.UNSIGNED_SHORT&&(ne=i.RG16UI),q===i.UNSIGNED_INT&&(ne=i.RG32UI),q===i.BYTE&&(ne=i.RG8I),q===i.SHORT&&(ne=i.RG16I),q===i.INT&&(ne=i.RG32I)),A===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),q===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),q===i.UNSIGNED_INT&&(ne=i.RGB32UI),q===i.BYTE&&(ne=i.RGB8I),q===i.SHORT&&(ne=i.RGB16I),q===i.INT&&(ne=i.RGB32I)),A===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),q===i.UNSIGNED_INT&&(ne=i.RGBA32UI),q===i.BYTE&&(ne=i.RGBA8I),q===i.SHORT&&(ne=i.RGBA16I),q===i.INT&&(ne=i.RGBA32I)),A===i.RGB&&(q===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),q===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),A===i.RGBA){let We=de?Zr:gt.getTransfer(ie);q===i.FLOAT&&(ne=i.RGBA32F),q===i.HALF_FLOAT&&(ne=i.RGBA16F),q===i.UNSIGNED_BYTE&&(ne=We===Et?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function S(P,A){let q;return P?A===null||A===Si||A===Dr?q=i.DEPTH24_STENCIL8:A===jn?q=i.DEPTH32F_STENCIL8:A===kr&&(q=i.DEPTH24_STENCIL8,st("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Si||A===Dr?q=i.DEPTH_COMPONENT24:A===jn?q=i.DEPTH_COMPONENT32F:A===kr&&(q=i.DEPTH_COMPONENT16),q}function b(P,A){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==vt&&P.minFilter!==Kt?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function y(P){let A=P.target;A.removeEventListener("dispose",y),k(A),A.isVideoTexture&&h.delete(A)}function T(P){let A=P.target;A.removeEventListener("dispose",T),M(A)}function k(P){let A=n.get(P);if(A.__webglInit===void 0)return;let q=P.source,ie=u.get(q);if(ie){let de=ie[A.__cacheKey];de.usedTimes--,de.usedTimes===0&&_(P),Object.keys(ie).length===0&&u.delete(q)}n.remove(P)}function _(P){let A=n.get(P);i.deleteTexture(A.__webglTexture);let q=P.source,ie=u.get(q);delete ie[A.__cacheKey],o.memory.textures--}function M(P){let A=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(A.__webglFramebuffer[ie]))for(let de=0;de<A.__webglFramebuffer[ie].length;de++)i.deleteFramebuffer(A.__webglFramebuffer[ie][de]);else i.deleteFramebuffer(A.__webglFramebuffer[ie]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ie])}else{if(Array.isArray(A.__webglFramebuffer))for(let ie=0;ie<A.__webglFramebuffer.length;ie++)i.deleteFramebuffer(A.__webglFramebuffer[ie]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ie=0;ie<A.__webglColorRenderbuffer.length;ie++)A.__webglColorRenderbuffer[ie]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ie]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let q=P.textures;for(let ie=0,de=q.length;ie<de;ie++){let ne=n.get(q[ie]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),o.memory.textures--),n.remove(q[ie])}n.remove(P)}let D=0;function L(){D=0}function N(){let P=D;return P>=r.maxTextures&&st("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+r.maxTextures),D+=1,P}function z(P){let A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function O(P,A){let q=n.get(P);if(P.isVideoTexture&&me(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&q.__version!==P.version){let ie=P.image;if(ie===null)st("WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)st("WebGLRenderer: Texture marked for update but image is incomplete");else{j(q,P,A);return}}else P.isExternalTexture&&(q.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+A)}function G(P,A){let q=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){j(q,P,A);return}else P.isExternalTexture&&(q.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+A)}function Y(P,A){let q=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){j(q,P,A);return}t.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+A)}function H(P,A){let q=n.get(P);if(P.version>0&&q.__version!==P.version){oe(q,P,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+A)}let V={[xn]:i.REPEAT,[Pn]:i.CLAMP_TO_EDGE,[Eo]:i.MIRRORED_REPEAT},ee={[vt]:i.NEAREST,[sa]:i.NEAREST_MIPMAP_NEAREST,[Ps]:i.NEAREST_MIPMAP_LINEAR,[Kt]:i.LINEAR,[oa]:i.LINEAR_MIPMAP_NEAREST,[yn]:i.LINEAR_MIPMAP_LINEAR},re={[hd]:i.NEVER,[gd]:i.ALWAYS,[dd]:i.LESS,[pc]:i.LEQUAL,[ud]:i.EQUAL,[md]:i.GEQUAL,[fd]:i.GREATER,[pd]:i.NOTEQUAL};function xe(P,A){if(A.type===jn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Kt||A.magFilter===oa||A.magFilter===Ps||A.magFilter===yn||A.minFilter===Kt||A.minFilter===oa||A.minFilter===Ps||A.minFilter===yn)&&st("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,V[A.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,V[A.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,V[A.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,ee[A.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,ee[A.minFilter]),A.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,re[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===vt||A.minFilter!==Ps&&A.minFilter!==yn||A.type===jn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let q=e.get("EXT_texture_filter_anisotropic");i.texParameterf(P,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,r.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function ke(P,A){let q=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",y));let ie=A.source,de=u.get(ie);de===void 0&&(de={},u.set(ie,de));let ne=z(A);if(ne!==P.__cacheKey){de[ne]===void 0&&(de[ne]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),de[ne].usedTimes++;let We=de[P.__cacheKey];We!==void 0&&(de[P.__cacheKey].usedTimes--,We.usedTimes===0&&_(A)),P.__cacheKey=ne,P.__webglTexture=de[ne].texture}return q}function Xe(P,A,q){return Math.floor(Math.floor(P/q)/A)}function je(P,A,q,ie){let ne=P.updateRanges;if(ne.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,q,ie,A.data);else{ne.sort((fe,Me)=>fe.start-Me.start);let We=0;for(let fe=1;fe<ne.length;fe++){let Me=ne[We],et=ne[fe],Je=Me.start+Me.count,Ne=Xe(et.start,A.width,4),rt=Xe(Me.start,A.width,4);et.start<=Je+1&&Ne===rt&&Xe(et.start+et.count-1,A.width,4)===Ne?Me.count=Math.max(Me.count,et.start+et.count-Me.start):(++We,ne[We]=et)}ne.length=We+1;let Re=i.getParameter(i.UNPACK_ROW_LENGTH),Ye=i.getParameter(i.UNPACK_SKIP_PIXELS),Ve=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let fe=0,Me=ne.length;fe<Me;fe++){let et=ne[fe],Je=Math.floor(et.start/4),Ne=Math.ceil(et.count/4),rt=Je%A.width,B=Math.floor(Je/A.width),Ie=Ne,Se=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,rt),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,rt,B,Ie,Se,q,ie,A.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Re),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ye),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ve)}}function j(P,A,q){let ie=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ie=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ie=i.TEXTURE_3D);let de=ke(P,A),ne=A.source;t.bindTexture(ie,P.__webglTexture,i.TEXTURE0+q);let We=n.get(ne);if(ne.version!==We.__version||de===!0){t.activeTexture(i.TEXTURE0+q);let Re=gt.getPrimaries(gt.workingColorSpace),Ye=A.colorSpace===ci?null:gt.getPrimaries(A.colorSpace),Ve=A.colorSpace===ci||Re===Ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let fe=x(A.image,!1,r.maxTextureSize);fe=ue(A,fe);let Me=s.convert(A.format,A.colorSpace),et=s.convert(A.type),Je=v(A.internalFormat,Me,et,A.colorSpace,A.isVideoTexture);xe(ie,A);let Ne,rt=A.mipmaps,B=A.isVideoTexture!==!0,Ie=We.__version===void 0||de===!0,Se=ne.dataReady,we=b(A,fe);if(A.isDepthTexture)Je=S(A.format===Lr,A.type),Ie&&(B?t.texStorage2D(i.TEXTURE_2D,1,Je,fe.width,fe.height):t.texImage2D(i.TEXTURE_2D,0,Je,fe.width,fe.height,0,Me,et,null));else if(A.isDataTexture)if(rt.length>0){B&&Ie&&t.texStorage2D(i.TEXTURE_2D,we,Je,rt[0].width,rt[0].height);for(let ge=0,le=rt.length;ge<le;ge++)Ne=rt[ge],B?Se&&t.texSubImage2D(i.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Me,et,Ne.data):t.texImage2D(i.TEXTURE_2D,ge,Je,Ne.width,Ne.height,0,Me,et,Ne.data);A.generateMipmaps=!1}else B?(Ie&&t.texStorage2D(i.TEXTURE_2D,we,Je,fe.width,fe.height),Se&&je(A,fe,Me,et)):t.texImage2D(i.TEXTURE_2D,0,Je,fe.width,fe.height,0,Me,et,fe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){B&&Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Je,rt[0].width,rt[0].height,fe.depth);for(let ge=0,le=rt.length;ge<le;ge++)if(Ne=rt[ge],A.format!==Ln)if(Me!==null)if(B){if(Se)if(A.layerUpdates.size>0){let He=Mc(Ne.width,Ne.height,A.format,A.type);for(let ct of A.layerUpdates){let Rt=Ne.data.subarray(ct*He/Ne.data.BYTES_PER_ELEMENT,(ct+1)*He/Ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ge,0,0,ct,Ne.width,Ne.height,1,Me,Rt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ge,0,0,0,Ne.width,Ne.height,fe.depth,Me,Ne.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ge,Je,Ne.width,Ne.height,fe.depth,0,Ne.data,0,0);else st("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?Se&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ge,0,0,0,Ne.width,Ne.height,fe.depth,Me,et,Ne.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ge,Je,Ne.width,Ne.height,fe.depth,0,Me,et,Ne.data)}else{B&&Ie&&t.texStorage2D(i.TEXTURE_2D,we,Je,rt[0].width,rt[0].height);for(let ge=0,le=rt.length;ge<le;ge++)Ne=rt[ge],A.format!==Ln?Me!==null?B?Se&&t.compressedTexSubImage2D(i.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Me,Ne.data):t.compressedTexImage2D(i.TEXTURE_2D,ge,Je,Ne.width,Ne.height,0,Ne.data):st("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?Se&&t.texSubImage2D(i.TEXTURE_2D,ge,0,0,Ne.width,Ne.height,Me,et,Ne.data):t.texImage2D(i.TEXTURE_2D,ge,Je,Ne.width,Ne.height,0,Me,et,Ne.data)}else if(A.isDataArrayTexture)if(B){if(Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Je,fe.width,fe.height,fe.depth),Se)if(A.layerUpdates.size>0){let ge=Mc(fe.width,fe.height,A.format,A.type);for(let le of A.layerUpdates){let He=fe.data.subarray(le*ge/fe.data.BYTES_PER_ELEMENT,(le+1)*ge/fe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,fe.width,fe.height,1,Me,et,He)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,fe.width,fe.height,fe.depth,Me,et,fe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Je,fe.width,fe.height,fe.depth,0,Me,et,fe.data);else if(A.isData3DTexture)B?(Ie&&t.texStorage3D(i.TEXTURE_3D,we,Je,fe.width,fe.height,fe.depth),Se&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,fe.width,fe.height,fe.depth,Me,et,fe.data)):t.texImage3D(i.TEXTURE_3D,0,Je,fe.width,fe.height,fe.depth,0,Me,et,fe.data);else if(A.isFramebufferTexture){if(Ie)if(B)t.texStorage2D(i.TEXTURE_2D,we,Je,fe.width,fe.height);else{let ge=fe.width,le=fe.height;for(let He=0;He<we;He++)t.texImage2D(i.TEXTURE_2D,He,Je,ge,le,0,Me,et,null),ge>>=1,le>>=1}}else if(rt.length>0){if(B&&Ie){let ge=Te(rt[0]);t.texStorage2D(i.TEXTURE_2D,we,Je,ge.width,ge.height)}for(let ge=0,le=rt.length;ge<le;ge++)Ne=rt[ge],B?Se&&t.texSubImage2D(i.TEXTURE_2D,ge,0,0,Me,et,Ne):t.texImage2D(i.TEXTURE_2D,ge,Je,Me,et,Ne);A.generateMipmaps=!1}else if(B){if(Ie){let ge=Te(fe);t.texStorage2D(i.TEXTURE_2D,we,Je,ge.width,ge.height)}Se&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,et,fe)}else t.texImage2D(i.TEXTURE_2D,0,Je,Me,et,fe);m(A)&&p(ie),We.__version=ne.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function oe(P,A,q){if(A.image.length!==6)return;let ie=ke(P,A),de=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+q);let ne=n.get(de);if(de.version!==ne.__version||ie===!0){t.activeTexture(i.TEXTURE0+q);let We=gt.getPrimaries(gt.workingColorSpace),Re=A.colorSpace===ci?null:gt.getPrimaries(A.colorSpace),Ye=A.colorSpace===ci||We===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let Ve=A.isCompressedTexture||A.image[0].isCompressedTexture,fe=A.image[0]&&A.image[0].isDataTexture,Me=[];for(let le=0;le<6;le++)!Ve&&!fe?Me[le]=x(A.image[le],!0,r.maxCubemapSize):Me[le]=fe?A.image[le].image:A.image[le],Me[le]=ue(A,Me[le]);let et=Me[0],Je=s.convert(A.format,A.colorSpace),Ne=s.convert(A.type),rt=v(A.internalFormat,Je,Ne,A.colorSpace),B=A.isVideoTexture!==!0,Ie=ne.__version===void 0||ie===!0,Se=de.dataReady,we=b(A,et);xe(i.TEXTURE_CUBE_MAP,A);let ge;if(Ve){B&&Ie&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,rt,et.width,et.height);for(let le=0;le<6;le++){ge=Me[le].mipmaps;for(let He=0;He<ge.length;He++){let ct=ge[He];A.format!==Ln?Je!==null?B?Se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He,0,0,ct.width,ct.height,Je,ct.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He,rt,ct.width,ct.height,0,ct.data):st("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?Se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He,0,0,ct.width,ct.height,Je,Ne,ct.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He,rt,ct.width,ct.height,0,Je,Ne,ct.data)}}}else{if(ge=A.mipmaps,B&&Ie){ge.length>0&&we++;let le=Te(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,rt,le.width,le.height)}for(let le=0;le<6;le++)if(fe){B?Se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Me[le].width,Me[le].height,Je,Ne,Me[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,rt,Me[le].width,Me[le].height,0,Je,Ne,Me[le].data);for(let He=0;He<ge.length;He++){let Rt=ge[He].image[le].image;B?Se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He+1,0,0,Rt.width,Rt.height,Je,Ne,Rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He+1,rt,Rt.width,Rt.height,0,Je,Ne,Rt.data)}}else{B?Se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Je,Ne,Me[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,rt,Je,Ne,Me[le]);for(let He=0;He<ge.length;He++){let ct=ge[He];B?Se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He+1,0,0,Je,Ne,ct.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,He+1,rt,Je,Ne,ct.image[le])}}}m(A)&&p(i.TEXTURE_CUBE_MAP),ne.__version=de.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function Ae(P,A,q,ie,de,ne){let We=s.convert(q.format,q.colorSpace),Re=s.convert(q.type),Ye=v(q.internalFormat,We,Re,q.colorSpace),Ve=n.get(A),fe=n.get(q);if(fe.__renderTarget=A,!Ve.__hasExternalTextures){let Me=Math.max(1,A.width>>ne),et=Math.max(1,A.height>>ne);de===i.TEXTURE_3D||de===i.TEXTURE_2D_ARRAY?t.texImage3D(de,ne,Ye,Me,et,A.depth,0,We,Re,null):t.texImage2D(de,ne,Ye,Me,et,0,We,Re,null)}t.bindFramebuffer(i.FRAMEBUFFER,P),Z(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,de,fe.__webglTexture,0,he(A)):(de===i.TEXTURE_2D||de>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ie,de,fe.__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(P,A,q){if(i.bindRenderbuffer(i.RENDERBUFFER,P),A.depthBuffer){let ie=A.depthTexture,de=ie&&ie.isDepthTexture?ie.type:null,ne=S(A.stencilBuffer,de),We=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=he(A);Z(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,ne,A.width,A.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ne,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,ne,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,We,i.RENDERBUFFER,P)}else{let ie=A.textures;for(let de=0;de<ie.length;de++){let ne=ie[de],We=s.convert(ne.format,ne.colorSpace),Re=s.convert(ne.type),Ye=v(ne.internalFormat,We,Re,ne.colorSpace),Ve=he(A);q&&Z(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,Ye,A.width,A.height):Z(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ve,Ye,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Ye,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Be(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ie=n.get(A.depthTexture);ie.__renderTarget=A,(!ie.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),O(A.depthTexture,0);let de=ie.__webglTexture,ne=he(A);if(A.depthTexture.format===Mr)Z(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0);else if(A.depthTexture.format===Lr)Z(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0);else throw new Error("Unknown depthTexture format")}function lt(P){let A=n.get(P),q=P.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==P.depthTexture){let ie=P.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ie){let de=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ie.removeEventListener("dispose",de)};ie.addEventListener("dispose",de),A.__depthDisposeCallback=de}A.__boundDepthTexture=ie}if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");let ie=P.texture.mipmaps;ie&&ie.length>0?Be(A.__webglFramebuffer[0],P):Be(A.__webglFramebuffer,P)}else if(q){A.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[ie]),A.__webglDepthbuffer[ie]===void 0)A.__webglDepthbuffer[ie]=i.createRenderbuffer(),ze(A.__webglDepthbuffer[ie],P,!1);else{let de=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=A.__webglDepthbuffer[ie];i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,ne)}}else{let ie=P.texture.mipmaps;if(ie&&ie.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),ze(A.__webglDepthbuffer,P,!1);else{let de=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,ne)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function se(P,A,q){let ie=n.get(P);A!==void 0&&Ae(ie.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&lt(P)}function ce(P){let A=P.texture,q=n.get(P),ie=n.get(A);P.addEventListener("dispose",T);let de=P.textures,ne=P.isWebGLCubeRenderTarget===!0,We=de.length>1;if(We||(ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture()),ie.__version=A.version,o.memory.textures++),ne){q.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer[Re]=[];for(let Ye=0;Ye<A.mipmaps.length;Ye++)q.__webglFramebuffer[Re][Ye]=i.createFramebuffer()}else q.__webglFramebuffer[Re]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer=[];for(let Re=0;Re<A.mipmaps.length;Re++)q.__webglFramebuffer[Re]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(We)for(let Re=0,Ye=de.length;Re<Ye;Re++){let Ve=n.get(de[Re]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&Z(P)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let Re=0;Re<de.length;Re++){let Ye=de[Re];q.__webglColorRenderbuffer[Re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[Re]);let Ve=s.convert(Ye.format,Ye.colorSpace),fe=s.convert(Ye.type),Me=v(Ye.internalFormat,Ve,fe,Ye.colorSpace,P.isXRRenderTarget===!0),et=he(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,et,Me,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,q.__webglColorRenderbuffer[Re])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),ze(q.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ne){t.bindTexture(i.TEXTURE_CUBE_MAP,ie.__webglTexture),xe(i.TEXTURE_CUBE_MAP,A);for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0)for(let Ye=0;Ye<A.mipmaps.length;Ye++)Ae(q.__webglFramebuffer[Re][Ye],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ye);else Ae(q.__webglFramebuffer[Re],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);m(A)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(We){for(let Re=0,Ye=de.length;Re<Ye;Re++){let Ve=de[Re],fe=n.get(Ve),Me=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Me=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,fe.__webglTexture),xe(Me,Ve),Ae(q.__webglFramebuffer,P,Ve,i.COLOR_ATTACHMENT0+Re,Me,0),m(Ve)&&p(Me)}t.unbindTexture()}else{let Re=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Re=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Re,ie.__webglTexture),xe(Re,A),A.mipmaps&&A.mipmaps.length>0)for(let Ye=0;Ye<A.mipmaps.length;Ye++)Ae(q.__webglFramebuffer[Ye],P,A,i.COLOR_ATTACHMENT0,Re,Ye);else Ae(q.__webglFramebuffer,P,A,i.COLOR_ATTACHMENT0,Re,0);m(A)&&p(Re),t.unbindTexture()}P.depthBuffer&&lt(P)}function $(P){let A=P.textures;for(let q=0,ie=A.length;q<ie;q++){let de=A[q];if(m(de)){let ne=E(P),We=n.get(de).__webglTexture;t.bindTexture(ne,We),p(ne),t.unbindTexture()}}}let C=[],te=[];function ae(P){if(P.samples>0){if(Z(P)===!1){let A=P.textures,q=P.width,ie=P.height,de=i.COLOR_BUFFER_BIT,ne=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,We=n.get(P),Re=A.length>1;if(Re)for(let Ve=0;Ve<A.length;Ve++)t.bindFramebuffer(i.FRAMEBUFFER,We.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,We.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,We.__webglMultisampledFramebuffer);let Ye=P.texture.mipmaps;Ye&&Ye.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,We.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,We.__webglFramebuffer);for(let Ve=0;Ve<A.length;Ve++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(de|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(de|=i.STENCIL_BUFFER_BIT)),Re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,We.__webglColorRenderbuffer[Ve]);let fe=n.get(A[Ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,fe,0)}i.blitFramebuffer(0,0,q,ie,0,0,q,ie,de,i.NEAREST),c===!0&&(C.length=0,te.length=0,C.push(i.COLOR_ATTACHMENT0+Ve),P.depthBuffer&&P.resolveDepthBuffer===!1&&(C.push(ne),te.push(ne),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,te)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,C))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Re)for(let Ve=0;Ve<A.length;Ve++){t.bindFramebuffer(i.FRAMEBUFFER,We.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ve,i.RENDERBUFFER,We.__webglColorRenderbuffer[Ve]);let fe=n.get(A[Ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,We.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ve,i.TEXTURE_2D,fe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,We.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){let A=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function he(P){return Math.min(r.maxSamples,P.samples)}function Z(P){let A=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function me(P){let A=o.render.frame;h.get(P)!==A&&(h.set(P,A),P.update())}function ue(P,A){let q=P.colorSpace,ie=P.format,de=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||q!==Gi&&q!==ci&&(gt.getTransfer(q)===Et?(ie!==Ln||de!==Gn)&&st("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ut("WebGLTextures: Unsupported texture color space:",q)),A}function Te(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=L,this.setTexture2D=O,this.setTexture2DArray=G,this.setTexture3D=Y,this.setTextureCube=H,this.rebindTextures=se,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=$,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=lt,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=Z}function Nx(i,e){function t(n,r=ci){let s,o=gt.getTransfer(r);if(n===Gn)return i.UNSIGNED_BYTE;if(n===la)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ca)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===oc)return i.BYTE;if(n===ac)return i.SHORT;if(n===kr)return i.UNSIGNED_SHORT;if(n===aa)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===jn)return i.FLOAT;if(n===Zi)return i.HALF_FLOAT;if(n===hc)return i.ALPHA;if(n===dc)return i.RGB;if(n===Ln)return i.RGBA;if(n===Mr)return i.DEPTH_COMPONENT;if(n===Lr)return i.DEPTH_STENCIL;if(n===uc)return i.RED;if(n===ha)return i.RED_INTEGER;if(n===da)return i.RG;if(n===ua)return i.RG_INTEGER;if(n===fa)return i.RGBA_INTEGER;if(n===ks||n===Ds||n===Ls||n===Ns)if(o===Et)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ks)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ds)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ls)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ns)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ks)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ds)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ls)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ns)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===pa||n===ma||n===ga||n===xa)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===pa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ma)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ga)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xa)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ba||n===ya||n===va)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===ba||n===ya)return o===Et?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===va)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===_a||n===Ma||n===Ea||n===Sa||n===wa||n===Ta||n===Aa||n===Ra||n===Ca||n===Ia||n===Pa||n===ka||n===Da||n===La)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===_a)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ma)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ea)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sa)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wa)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ta)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Aa)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ra)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ca)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ia)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Pa)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ka)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Da)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===La)return o===Et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Na||n===Ua||n===Fa)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Na)return o===Et?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ua)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ba||n===Oa||n===za||n===Ha)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ba)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Oa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===za)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ha)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Ux=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Lc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new hs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new bn({vertexShader:Ux,fragmentShader:Fx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new K(new At(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nc=class extends oi{constructor(e,t){super();let n=this,r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null,x=typeof XRWebGLBinding<"u",m=new Lc,p={},E=t.getContextAttributes(),v=null,S=null,b=[],y=[],T=new ye,k=null,_=new Xt;_.viewport=new yt;let M=new Xt;M.viewport=new yt;let D=[_,M],L=new Ko,N=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let oe=b[j];return oe===void 0&&(oe=new Ar,b[j]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(j){let oe=b[j];return oe===void 0&&(oe=new Ar,b[j]=oe),oe.getGripSpace()},this.getHand=function(j){let oe=b[j];return oe===void 0&&(oe=new Ar,b[j]=oe),oe.getHandSpace()};function O(j){let oe=y.indexOf(j.inputSource);if(oe===-1)return;let Ae=b[oe];Ae!==void 0&&(Ae.update(j.inputSource,j.frame,l||o),Ae.dispatchEvent({type:j.type,data:j.inputSource}))}function G(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",Y);for(let j=0;j<b.length;j++){let oe=y[j];oe!==null&&(y[j]=null,b[j].disconnect(oe))}N=null,z=null,m.reset();for(let j in p)delete p[j];e.setRenderTarget(v),f=null,u=null,d=null,r=null,S=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,n.isPresenting===!0&&st("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&st("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(v=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",G),r.addEventListener("inputsourceschange",Y),E.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(T),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,ze=null,Be=null;E.depth&&(Be=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=E.stencil?Lr:Mr,ze=E.stencil?Dr:Si);let lt={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(lt),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new kn(u.textureWidth,u.textureHeight,{format:Ln,type:Gn,depthTexture:new cs(u.textureWidth,u.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let Ae={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Ae),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new kn(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:Gn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),je.setContext(r),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Y(j){for(let oe=0;oe<j.removed.length;oe++){let Ae=j.removed[oe],ze=y.indexOf(Ae);ze>=0&&(y[ze]=null,b[ze].disconnect(Ae))}for(let oe=0;oe<j.added.length;oe++){let Ae=j.added[oe],ze=y.indexOf(Ae);if(ze===-1){for(let lt=0;lt<b.length;lt++)if(lt>=y.length){y.push(Ae),ze=lt;break}else if(y[lt]===null){y[lt]=Ae,ze=lt;break}if(ze===-1)break}let Be=b[ze];Be&&Be.connect(Ae)}}let H=new U,V=new U;function ee(j,oe,Ae){H.setFromMatrixPosition(oe.matrixWorld),V.setFromMatrixPosition(Ae.matrixWorld);let ze=H.distanceTo(V),Be=oe.projectionMatrix.elements,lt=Ae.projectionMatrix.elements,se=Be[14]/(Be[10]-1),ce=Be[14]/(Be[10]+1),$=(Be[9]+1)/Be[5],C=(Be[9]-1)/Be[5],te=(Be[8]-1)/Be[0],ae=(lt[8]+1)/lt[0],he=se*te,Z=se*ae,me=ze/(-te+ae),ue=me*-te;if(oe.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ue),j.translateZ(me),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Be[10]===-1)j.projectionMatrix.copy(oe.projectionMatrix),j.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{let Te=se+me,P=ce+me,A=he-ue,q=Z+(ze-ue),ie=$*ce/P*Te,de=C*ce/P*Te;j.projectionMatrix.makePerspective(A,q,ie,de,Te,P),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function re(j,oe){oe===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(oe.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let oe=j.near,Ae=j.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(Ae=m.depthFar)),L.near=M.near=_.near=oe,L.far=M.far=_.far=Ae,(N!==L.near||z!==L.far)&&(r.updateRenderState({depthNear:L.near,depthFar:L.far}),N=L.near,z=L.far),L.layers.mask=j.layers.mask|6,_.layers.mask=L.layers.mask&3,M.layers.mask=L.layers.mask&5;let ze=j.parent,Be=L.cameras;re(L,ze);for(let lt=0;lt<Be.length;lt++)re(Be[lt],ze);Be.length===2?ee(L,_,M):L.projectionMatrix.copy(_.projectionMatrix),xe(j,L,ze)};function xe(j,oe,Ae){Ae===null?j.matrix.copy(oe.matrixWorld):(j.matrix.copy(Ae.matrixWorld),j.matrix.invert(),j.matrix.multiply(oe.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(oe.projectionMatrix),j.projectionMatrixInverse.copy(oe.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=es*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(j){c=j,u!==null&&(u.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(j){return p[j]};let ke=null;function Xe(j,oe){if(h=oe.getViewerPose(l||o),g=oe,h!==null){let Ae=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let ze=!1;Ae.length!==L.cameras.length&&(L.cameras.length=0,ze=!0);for(let ce=0;ce<Ae.length;ce++){let $=Ae[ce],C=null;if(f!==null)C=f.getViewport($);else{let ae=d.getViewSubImage(u,$);C=ae.viewport,ce===0&&(e.setRenderTargetTextures(S,ae.colorTexture,ae.depthStencilTexture),e.setRenderTarget(S))}let te=D[ce];te===void 0&&(te=new Xt,te.layers.enable(ce),te.viewport=new yt,D[ce]=te),te.matrix.fromArray($.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray($.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(C.x,C.y,C.width,C.height),ce===0&&(L.matrix.copy(te.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),ze===!0&&L.cameras.push(te)}let Be=r.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let ce=d.getDepthInformation(Ae[0]);ce&&ce.isValid&&ce.texture&&m.init(ce,r.renderState)}if(Be&&Be.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let ce=0;ce<Ae.length;ce++){let $=Ae[ce].camera;if($){let C=p[$];C||(C=new hs,p[$]=C);let te=d.getCameraImage($);C.sourceTexture=te}}}}for(let Ae=0;Ae<b.length;Ae++){let ze=y[Ae],Be=b[Ae];ze!==null&&Be!==void 0&&Be.update(ze,oe,l||o)}ke&&ke(j,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}let je=new Kd;je.setAnimationLoop(Xe),this.setAnimationLoop=function(j){ke=j},this.dispose=function(){}}},er=new Hn,Bx=new Mt;function Ox(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,bc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,E,v,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),x(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,E,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===nn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===nn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E=e.get(p),v=E.envMap,S=E.envMapRotation;v&&(m.envMap.value=v,er.copy(S),er.x*=-1,er.y*=-1,er.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),m.envMapRotation.value.setFromMatrix4(Bx.makeRotationFromEuler(er)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,E,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===nn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function zx(i,e,t,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,v){let S=v.program;n.uniformBlockBinding(E,S)}function l(E,v){let S=r[E.id];S===void 0&&(g(E),S=h(E),r[E.id]=S,E.addEventListener("dispose",m));let b=v.program;n.updateUBOMapping(E,b);let y=e.render.frame;s[E.id]!==y&&(u(E),s[E.id]=y)}function h(E){let v=d();E.__bindingPointIndex=v;let S=i.createBuffer(),b=E.__size,y=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,b,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,S),S}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){let v=r[E.id],S=E.uniforms,b=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let y=0,T=S.length;y<T;y++){let k=Array.isArray(S[y])?S[y]:[S[y]];for(let _=0,M=k.length;_<M;_++){let D=k[_];if(f(D,y,_,b)===!0){let L=D.__offset,N=Array.isArray(D.value)?D.value:[D.value],z=0;for(let O=0;O<N.length;O++){let G=N[O],Y=x(G);typeof G=="number"||typeof G=="boolean"?(D.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,L+z,D.__data)):G.isMatrix3?(D.__data[0]=G.elements[0],D.__data[1]=G.elements[1],D.__data[2]=G.elements[2],D.__data[3]=0,D.__data[4]=G.elements[3],D.__data[5]=G.elements[4],D.__data[6]=G.elements[5],D.__data[7]=0,D.__data[8]=G.elements[6],D.__data[9]=G.elements[7],D.__data[10]=G.elements[8],D.__data[11]=0):(G.toArray(D.__data,z),z+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(E,v,S,b){let y=E.value,T=v+"_"+S;if(b[T]===void 0)return typeof y=="number"||typeof y=="boolean"?b[T]=y:b[T]=y.clone(),!0;{let k=b[T];if(typeof y=="number"||typeof y=="boolean"){if(k!==y)return b[T]=y,!0}else if(k.equals(y)===!1)return k.copy(y),!0}return!1}function g(E){let v=E.uniforms,S=0,b=16;for(let T=0,k=v.length;T<k;T++){let _=Array.isArray(v[T])?v[T]:[v[T]];for(let M=0,D=_.length;M<D;M++){let L=_[M],N=Array.isArray(L.value)?L.value:[L.value];for(let z=0,O=N.length;z<O;z++){let G=N[z],Y=x(G),H=S%b,V=H%Y.boundary,ee=H+V;S+=V,ee!==0&&b-ee<Y.storage&&(S+=b-ee),L.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=S,S+=Y.storage}}}let y=S%b;return y>0&&(S+=b-y),E.__size=S,E.__cache={},this}function x(E){let v={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(v.boundary=4,v.storage=4):E.isVector2?(v.boundary=8,v.storage=8):E.isVector3||E.isColor?(v.boundary=16,v.storage=12):E.isVector4?(v.boundary=16,v.storage=16):E.isMatrix3?(v.boundary=48,v.storage=48):E.isMatrix4?(v.boundary=64,v.storage=64):E.isTexture?st("WebGLRenderer: Texture samplers can not be part of an uniforms group."):st("WebGLRenderer: Unsupported uniform value type.",E),v}function m(E){let v=E.target;v.removeEventListener("dispose",m);let S=o.indexOf(v.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function p(){for(let E in r)i.deleteBuffer(r[E]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}var Hx=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]),hi=null;function Gx(){return hi===null&&(hi=new Po(Hx,32,32,da,Zi),hi.minFilter=Kt,hi.magFilter=Kt,hi.wrapS=Pn,hi.wrapT=Pn,hi.generateMipmaps=!1,hi.needsUpdate=!0),hi}var Xa=class{constructor(e={}){let{canvas:t=xd(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Set([fa,ua,ha]),x=new Set([Gn,Si,kr,Dr,la,ca]),m=new Uint32Array(4),p=new Int32Array(4),E=null,v=null,S=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,T=!1;this._outputColorSpace=pt;let k=0,_=0,M=null,D=-1,L=null,N=new yt,z=new yt,O=null,G=new ot(0),Y=0,H=t.width,V=t.height,ee=1,re=null,xe=null,ke=new yt(0,0,H,V),Xe=new yt(0,0,H,V),je=!1,j=new Rr,oe=!1,Ae=!1,ze=new Mt,Be=new U,lt=new yt,se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ce=!1;function $(){return M===null?ee:1}let C=n;function te(I,W){return t.getContext(I,W)}try{let I={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"181"}`),t.addEventListener("webglcontextlost",ge,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",He,!1),C===null){let W="webgl2";if(C=te(W,I),C===null)throw te(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw I("WebGLRenderer: "+I.message),I}let ae,he,Z,me,ue,Te,P,A,q,ie,de,ne,We,Re,Ye,Ve,fe,Me,et,Je,Ne,rt,B,Ie;function Se(){ae=new rg(C),ae.init(),rt=new Nx(C,ae),he=new $m(C,ae,e,rt),Z=new Dx(C,ae),he.reversedDepthBuffer&&u&&Z.buffers.depth.setReversed(!0),me=new ag(C),ue=new vx,Te=new Lx(C,ae,Z,ue,he,rt,me),P=new Zm(y),A=new ig(y),q=new dp(C),B=new Ym(C,q),ie=new sg(C,q,me,B),de=new cg(C,ie,q,me),et=new lg(C,he,Te),Ve=new jm(ue),ne=new yx(y,P,A,ae,he,B,Ve),We=new Ox(y,ue),Re=new Mx,Ye=new Rx(ae),Me=new qm(y,P,A,Z,de,f,c),fe=new Px(y,de,he),Ie=new zx(C,me,he,Z),Je=new Km(C,ae,me),Ne=new og(C,ae,me),me.programs=ne.programs,y.capabilities=he,y.extensions=ae,y.properties=ue,y.renderLists=Re,y.shadowMap=fe,y.state=Z,y.info=me}Se();let we=new Nc(y,C);this.xr=we,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let I=ae.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){let I=ae.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(I){I!==void 0&&(ee=I,this.setSize(H,V,!1))},this.getSize=function(I){return I.set(H,V)},this.setSize=function(I,W,J=!0){if(we.isPresenting){st("WebGLRenderer: Can't change size while VR device is presenting.");return}H=I,V=W,t.width=Math.floor(I*ee),t.height=Math.floor(W*ee),J===!0&&(t.style.width=I+"px",t.style.height=W+"px"),this.setViewport(0,0,I,W)},this.getDrawingBufferSize=function(I){return I.set(H*ee,V*ee).floor()},this.setDrawingBufferSize=function(I,W,J){H=I,V=W,ee=J,t.width=Math.floor(I*J),t.height=Math.floor(W*J),this.setViewport(0,0,I,W)},this.getCurrentViewport=function(I){return I.copy(N)},this.getViewport=function(I){return I.copy(ke)},this.setViewport=function(I,W,J,Q){I.isVector4?ke.set(I.x,I.y,I.z,I.w):ke.set(I,W,J,Q),Z.viewport(N.copy(ke).multiplyScalar(ee).round())},this.getScissor=function(I){return I.copy(Xe)},this.setScissor=function(I,W,J,Q){I.isVector4?Xe.set(I.x,I.y,I.z,I.w):Xe.set(I,W,J,Q),Z.scissor(z.copy(Xe).multiplyScalar(ee).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(I){Z.setScissorTest(je=I)},this.setOpaqueSort=function(I){re=I},this.setTransparentSort=function(I){xe=I},this.getClearColor=function(I){return I.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(I=!0,W=!0,J=!0){let Q=0;if(I){let X=!1;if(M!==null){let _e=M.texture.format;X=g.has(_e)}if(X){let _e=M.texture.type,De=x.has(_e),Ge=Me.getClearColor(),Fe=Me.getClearAlpha(),Qe=Ge.r,it=Ge.g,Ke=Ge.b;De?(m[0]=Qe,m[1]=it,m[2]=Ke,m[3]=Fe,C.clearBufferuiv(C.COLOR,0,m)):(p[0]=Qe,p[1]=it,p[2]=Ke,p[3]=Fe,C.clearBufferiv(C.COLOR,0,p))}else Q|=C.COLOR_BUFFER_BIT}W&&(Q|=C.DEPTH_BUFFER_BIT),J&&(Q|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ge,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",He,!1),Me.dispose(),Re.dispose(),Ye.dispose(),ue.dispose(),P.dispose(),A.dispose(),de.dispose(),B.dispose(),Ie.dispose(),ne.dispose(),we.dispose(),we.removeEventListener("sessionstart",th),we.removeEventListener("sessionend",nh),Di.stop()};function ge(I){I.preventDefault(),xc("WebGLRenderer: Context Lost."),T=!0}function le(){xc("WebGLRenderer: Context Restored."),T=!1;let I=me.autoReset,W=fe.enabled,J=fe.autoUpdate,Q=fe.needsUpdate,X=fe.type;Se(),me.autoReset=I,fe.enabled=W,fe.autoUpdate=J,fe.needsUpdate=Q,fe.type=X}function He(I){ut("WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function ct(I){let W=I.target;W.removeEventListener("dispose",ct),Rt(W)}function Rt(I){St(I),ue.remove(I)}function St(I){let W=ue.get(I).programs;W!==void 0&&(W.forEach(function(J){ne.releaseProgram(J)}),I.isShaderMaterial&&ne.releaseShaderCache(I))}this.renderBufferDirect=function(I,W,J,Q,X,_e){W===null&&(W=se);let De=X.isMesh&&X.matrixWorld.determinant()<0,Ge=qu(I,W,J,Q,X);Z.setMaterial(Q,De);let Fe=J.index,Qe=1;if(Q.wireframe===!0){if(Fe=ie.getWireframeAttribute(J),Fe===void 0)return;Qe=2}let it=J.drawRange,Ke=J.attributes.position,mt=it.start*Qe,wt=(it.start+it.count)*Qe;_e!==null&&(mt=Math.max(mt,_e.start*Qe),wt=Math.min(wt,(_e.start+_e.count)*Qe)),Fe!==null?(mt=Math.max(mt,0),wt=Math.min(wt,Fe.count)):Ke!=null&&(mt=Math.max(mt,0),wt=Math.min(wt,Ke.count));let Ft=wt-mt;if(Ft<0||Ft===1/0)return;B.setup(X,Q,Ge,J,Fe);let Bt,Tt=Je;if(Fe!==null&&(Bt=q.get(Fe),Tt=Ne,Tt.setIndex(Bt)),X.isMesh)Q.wireframe===!0?(Z.setLineWidth(Q.wireframeLinewidth*$()),Tt.setMode(C.LINES)):Tt.setMode(C.TRIANGLES);else if(X.isLine){let Ze=Q.linewidth;Ze===void 0&&(Ze=1),Z.setLineWidth(Ze*$()),X.isLineSegments?Tt.setMode(C.LINES):X.isLineLoop?Tt.setMode(C.LINE_LOOP):Tt.setMode(C.LINE_STRIP)}else X.isPoints?Tt.setMode(C.POINTS):X.isSprite&&Tt.setMode(C.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Sr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Tt.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(ae.get("WEBGL_multi_draw"))Tt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Ze=X._multiDrawStarts,kt=X._multiDrawCounts,bt=X._multiDrawCount,_n=Fe?q.get(Fe).bytesPerElement:1,lr=ue.get(Q).currentProgram.getUniforms();for(let Mn=0;Mn<bt;Mn++)lr.setValue(C,"_gl_DrawID",Mn),Tt.render(Ze[Mn]/_n,kt[Mn])}else if(X.isInstancedMesh)Tt.renderInstances(mt,Ft,X.count);else if(J.isInstancedBufferGeometry){let Ze=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,kt=Math.min(J.instanceCount,Ze);Tt.renderInstances(mt,Ft,kt)}else Tt.render(mt,Ft)};function Xn(I,W,J){I.transparent===!0&&I.side===Gt&&I.forceSinglePass===!1?(I.side=nn,I.needsUpdate=!0,Zs(I,W,J),I.side=si,I.needsUpdate=!0,Zs(I,W,J),I.side=Gt):Zs(I,W,J)}this.compile=function(I,W,J=null){J===null&&(J=I),v=Ye.get(J),v.init(W),b.push(v),J.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(v.pushLight(X),X.castShadow&&v.pushShadow(X))}),I!==J&&I.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(v.pushLight(X),X.castShadow&&v.pushShadow(X))}),v.setupLights();let Q=new Set;return I.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let _e=X.material;if(_e)if(Array.isArray(_e))for(let De=0;De<_e.length;De++){let Ge=_e[De];Xn(Ge,J,X),Q.add(Ge)}else Xn(_e,J,X),Q.add(_e)}),v=b.pop(),Q},this.compileAsync=function(I,W,J=null){let Q=this.compile(I,W,J);return new Promise(X=>{function _e(){if(Q.forEach(function(De){ue.get(De).currentProgram.isReady()&&Q.delete(De)}),Q.size===0){X(I);return}setTimeout(_e,10)}ae.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Nn=null;function Xu(I){Nn&&Nn(I)}function th(){Di.stop()}function nh(){Di.start()}let Di=new Kd;Di.setAnimationLoop(Xu),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(I){Nn=I,we.setAnimationLoop(I),I===null?Di.stop():Di.start()},we.addEventListener("sessionstart",th),we.addEventListener("sessionend",nh),this.render=function(I,W){if(W!==void 0&&W.isCamera!==!0){ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(we.cameraAutoUpdate===!0&&we.updateCamera(W),W=we.getCamera()),I.isScene===!0&&I.onBeforeRender(y,I,W,M),v=Ye.get(I,b.length),v.init(W),b.push(v),ze.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),j.setFromProjectionMatrix(ze,On,W.reversedDepth),Ae=this.localClippingEnabled,oe=Ve.init(this.clippingPlanes,Ae),E=Re.get(I,S.length),E.init(),S.push(E),we.enabled===!0&&we.isPresenting===!0){let _e=y.xr.getDepthSensingMesh();_e!==null&&dl(_e,W,-1/0,y.sortObjects)}dl(I,W,0,y.sortObjects),E.finish(),y.sortObjects===!0&&E.sort(re,xe),ce=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,ce&&Me.addToRenderList(E,I),this.info.render.frame++,oe===!0&&Ve.beginShadows();let J=v.state.shadowsArray;fe.render(J,I,W),oe===!0&&Ve.endShadows(),this.info.autoReset===!0&&this.info.reset();let Q=E.opaque,X=E.transmissive;if(v.setupLights(),W.isArrayCamera){let _e=W.cameras;if(X.length>0)for(let De=0,Ge=_e.length;De<Ge;De++){let Fe=_e[De];rh(Q,X,I,Fe)}ce&&Me.render(I);for(let De=0,Ge=_e.length;De<Ge;De++){let Fe=_e[De];ih(E,I,Fe,Fe.viewport)}}else X.length>0&&rh(Q,X,I,W),ce&&Me.render(I),ih(E,I,W);M!==null&&_===0&&(Te.updateMultisampleRenderTarget(M),Te.updateRenderTargetMipmap(M)),I.isScene===!0&&I.onAfterRender(y,I,W),B.resetDefaultState(),D=-1,L=null,b.pop(),b.length>0?(v=b[b.length-1],oe===!0&&Ve.setGlobalState(y.clippingPlanes,v.state.camera)):v=null,S.pop(),S.length>0?E=S[S.length-1]:E=null};function dl(I,W,J,Q){if(I.visible===!1)return;if(I.layers.test(W.layers)){if(I.isGroup)J=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(W);else if(I.isLight)v.pushLight(I),I.castShadow&&v.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||j.intersectsSprite(I)){Q&&lt.setFromMatrixPosition(I.matrixWorld).applyMatrix4(ze);let De=de.update(I),Ge=I.material;Ge.visible&&E.push(I,De,Ge,J,lt.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||j.intersectsObject(I))){let De=de.update(I),Ge=I.material;if(Q&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),lt.copy(I.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),lt.copy(De.boundingSphere.center)),lt.applyMatrix4(I.matrixWorld).applyMatrix4(ze)),Array.isArray(Ge)){let Fe=De.groups;for(let Qe=0,it=Fe.length;Qe<it;Qe++){let Ke=Fe[Qe],mt=Ge[Ke.materialIndex];mt&&mt.visible&&E.push(I,De,mt,J,lt.z,Ke)}}else Ge.visible&&E.push(I,De,Ge,J,lt.z,null)}}let _e=I.children;for(let De=0,Ge=_e.length;De<Ge;De++)dl(_e[De],W,J,Q)}function ih(I,W,J,Q){let{opaque:X,transmissive:_e,transparent:De}=I;v.setupLightsView(J),oe===!0&&Ve.setGlobalState(y.clippingPlanes,J),Q&&Z.viewport(N.copy(Q)),X.length>0&&js(X,W,J),_e.length>0&&js(_e,W,J),De.length>0&&js(De,W,J),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function rh(I,W,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[Q.id]===void 0&&(v.state.transmissionRenderTarget[Q.id]=new kn(1,1,{generateMipmaps:!0,type:ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float")?Zi:Gn,minFilter:yn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:gt.workingColorSpace}));let _e=v.state.transmissionRenderTarget[Q.id],De=Q.viewport||N;_e.setSize(De.z*y.transmissionResolutionScale,De.w*y.transmissionResolutionScale);let Ge=y.getRenderTarget(),Fe=y.getActiveCubeFace(),Qe=y.getActiveMipmapLevel();y.setRenderTarget(_e),y.getClearColor(G),Y=y.getClearAlpha(),Y<1&&y.setClearColor(16777215,.5),y.clear(),ce&&Me.render(J);let it=y.toneMapping;y.toneMapping=li;let Ke=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),v.setupLightsView(Q),oe===!0&&Ve.setGlobalState(y.clippingPlanes,Q),js(I,J,Q),Te.updateMultisampleRenderTarget(_e),Te.updateRenderTargetMipmap(_e),ae.has("WEBGL_multisampled_render_to_texture")===!1){let mt=!1;for(let wt=0,Ft=W.length;wt<Ft;wt++){let Bt=W[wt],{object:Tt,geometry:Ze,material:kt,group:bt}=Bt;if(kt.side===Gt&&Tt.layers.test(Q.layers)){let _n=kt.side;kt.side=nn,kt.needsUpdate=!0,sh(Tt,J,Q,Ze,kt,bt),kt.side=_n,kt.needsUpdate=!0,mt=!0}}mt===!0&&(Te.updateMultisampleRenderTarget(_e),Te.updateRenderTargetMipmap(_e))}y.setRenderTarget(Ge,Fe,Qe),y.setClearColor(G,Y),Ke!==void 0&&(Q.viewport=Ke),y.toneMapping=it}function js(I,W,J){let Q=W.isScene===!0?W.overrideMaterial:null;for(let X=0,_e=I.length;X<_e;X++){let De=I[X],{object:Ge,geometry:Fe,group:Qe}=De,it=De.material;it.allowOverride===!0&&Q!==null&&(it=Q),Ge.layers.test(J.layers)&&sh(Ge,W,J,Fe,it,Qe)}}function sh(I,W,J,Q,X,_e){I.onBeforeRender(y,W,J,Q,X,_e),I.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),X.onBeforeRender(y,W,J,Q,I,_e),X.transparent===!0&&X.side===Gt&&X.forceSinglePass===!1?(X.side=nn,X.needsUpdate=!0,y.renderBufferDirect(J,W,Q,X,I,_e),X.side=si,X.needsUpdate=!0,y.renderBufferDirect(J,W,Q,X,I,_e),X.side=Gt):y.renderBufferDirect(J,W,Q,X,I,_e),I.onAfterRender(y,W,J,Q,X,_e)}function Zs(I,W,J){W.isScene!==!0&&(W=se);let Q=ue.get(I),X=v.state.lights,_e=v.state.shadowsArray,De=X.state.version,Ge=ne.getParameters(I,X.state,_e,W,J),Fe=ne.getProgramCacheKey(Ge),Qe=Q.programs;Q.environment=I.isMeshStandardMaterial?W.environment:null,Q.fog=W.fog,Q.envMap=(I.isMeshStandardMaterial?A:P).get(I.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&I.envMap===null?W.environmentRotation:I.envMapRotation,Qe===void 0&&(I.addEventListener("dispose",ct),Qe=new Map,Q.programs=Qe);let it=Qe.get(Fe);if(it!==void 0){if(Q.currentProgram===it&&Q.lightsStateVersion===De)return ah(I,Ge),it}else Ge.uniforms=ne.getUniforms(I),I.onBeforeCompile(Ge,y),it=ne.acquireProgram(Ge,Fe),Qe.set(Fe,it),Q.uniforms=Ge.uniforms;let Ke=Q.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(Ke.clippingPlanes=Ve.uniform),ah(I,Ge),Q.needsLights=Ku(I),Q.lightsStateVersion=De,Q.needsLights&&(Ke.ambientLightColor.value=X.state.ambient,Ke.lightProbe.value=X.state.probe,Ke.directionalLights.value=X.state.directional,Ke.directionalLightShadows.value=X.state.directionalShadow,Ke.spotLights.value=X.state.spot,Ke.spotLightShadows.value=X.state.spotShadow,Ke.rectAreaLights.value=X.state.rectArea,Ke.ltc_1.value=X.state.rectAreaLTC1,Ke.ltc_2.value=X.state.rectAreaLTC2,Ke.pointLights.value=X.state.point,Ke.pointLightShadows.value=X.state.pointShadow,Ke.hemisphereLights.value=X.state.hemi,Ke.directionalShadowMap.value=X.state.directionalShadowMap,Ke.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ke.spotShadowMap.value=X.state.spotShadowMap,Ke.spotLightMatrix.value=X.state.spotLightMatrix,Ke.spotLightMap.value=X.state.spotLightMap,Ke.pointShadowMap.value=X.state.pointShadowMap,Ke.pointShadowMatrix.value=X.state.pointShadowMatrix),Q.currentProgram=it,Q.uniformsList=null,it}function oh(I){if(I.uniformsList===null){let W=I.currentProgram.getUniforms();I.uniformsList=Fr.seqWithValue(W.seq,I.uniforms)}return I.uniformsList}function ah(I,W){let J=ue.get(I);J.outputColorSpace=W.outputColorSpace,J.batching=W.batching,J.batchingColor=W.batchingColor,J.instancing=W.instancing,J.instancingColor=W.instancingColor,J.instancingMorph=W.instancingMorph,J.skinning=W.skinning,J.morphTargets=W.morphTargets,J.morphNormals=W.morphNormals,J.morphColors=W.morphColors,J.morphTargetsCount=W.morphTargetsCount,J.numClippingPlanes=W.numClippingPlanes,J.numIntersection=W.numClipIntersection,J.vertexAlphas=W.vertexAlphas,J.vertexTangents=W.vertexTangents,J.toneMapping=W.toneMapping}function qu(I,W,J,Q,X){W.isScene!==!0&&(W=se),Te.resetTextureUnits();let _e=W.fog,De=Q.isMeshStandardMaterial?W.environment:null,Ge=M===null?y.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Gi,Fe=(Q.isMeshStandardMaterial?A:P).get(Q.envMap||De),Qe=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,it=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ke=!!J.morphAttributes.position,mt=!!J.morphAttributes.normal,wt=!!J.morphAttributes.color,Ft=li;Q.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Ft=y.toneMapping);let Bt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Tt=Bt!==void 0?Bt.length:0,Ze=ue.get(Q),kt=v.state.lights;if(oe===!0&&(Ae===!0||I!==L)){let hn=I===L&&Q.id===D;Ve.setState(Q,I,hn)}let bt=!1;Q.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==kt.state.version||Ze.outputColorSpace!==Ge||X.isBatchedMesh&&Ze.batching===!1||!X.isBatchedMesh&&Ze.batching===!0||X.isBatchedMesh&&Ze.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ze.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ze.instancing===!1||!X.isInstancedMesh&&Ze.instancing===!0||X.isSkinnedMesh&&Ze.skinning===!1||!X.isSkinnedMesh&&Ze.skinning===!0||X.isInstancedMesh&&Ze.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ze.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ze.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ze.instancingMorph===!1&&X.morphTexture!==null||Ze.envMap!==Fe||Q.fog===!0&&Ze.fog!==_e||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==Ve.numPlanes||Ze.numIntersection!==Ve.numIntersection)||Ze.vertexAlphas!==Qe||Ze.vertexTangents!==it||Ze.morphTargets!==Ke||Ze.morphNormals!==mt||Ze.morphColors!==wt||Ze.toneMapping!==Ft||Ze.morphTargetsCount!==Tt)&&(bt=!0):(bt=!0,Ze.__version=Q.version);let _n=Ze.currentProgram;bt===!0&&(_n=Zs(Q,W,X));let lr=!1,Mn=!1,zr=!1,Dt=_n.getUniforms(),pn=Ze.uniforms;if(Z.useProgram(_n.program)&&(lr=!0,Mn=!0,zr=!0),Q.id!==D&&(D=Q.id,Mn=!0),lr||L!==I){Z.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),Dt.setValue(C,"projectionMatrix",I.projectionMatrix),Dt.setValue(C,"viewMatrix",I.matrixWorldInverse);let mn=Dt.map.cameraPosition;mn!==void 0&&mn.setValue(C,Be.setFromMatrixPosition(I.matrixWorld)),he.logarithmicDepthBuffer&&Dt.setValue(C,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Dt.setValue(C,"isOrthographic",I.isOrthographicCamera===!0),L!==I&&(L=I,Mn=!0,zr=!0)}if(X.isSkinnedMesh){Dt.setOptional(C,X,"bindMatrix"),Dt.setOptional(C,X,"bindMatrixInverse");let hn=X.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),Dt.setValue(C,"boneTexture",hn.boneTexture,Te))}X.isBatchedMesh&&(Dt.setOptional(C,X,"batchingTexture"),Dt.setValue(C,"batchingTexture",X._matricesTexture,Te),Dt.setOptional(C,X,"batchingIdTexture"),Dt.setValue(C,"batchingIdTexture",X._indirectTexture,Te),Dt.setOptional(C,X,"batchingColorTexture"),X._colorsTexture!==null&&Dt.setValue(C,"batchingColorTexture",X._colorsTexture,Te));let Rn=J.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&et.update(X,J,_n),(Mn||Ze.receiveShadow!==X.receiveShadow)&&(Ze.receiveShadow=X.receiveShadow,Dt.setValue(C,"receiveShadow",X.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(pn.envMap.value=Fe,pn.flipEnvMap.value=Fe.isCubeTexture&&Fe.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&W.environment!==null&&(pn.envMapIntensity.value=W.environmentIntensity),pn.dfgLUT!==void 0&&(pn.dfgLUT.value=Gx()),Mn&&(Dt.setValue(C,"toneMappingExposure",y.toneMappingExposure),Ze.needsLights&&Yu(pn,zr),_e&&Q.fog===!0&&We.refreshFogUniforms(pn,_e),We.refreshMaterialUniforms(pn,Q,ee,V,v.state.transmissionRenderTarget[I.id]),Fr.upload(C,oh(Ze),pn,Te)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Fr.upload(C,oh(Ze),pn,Te),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Dt.setValue(C,"center",X.center),Dt.setValue(C,"modelViewMatrix",X.modelViewMatrix),Dt.setValue(C,"normalMatrix",X.normalMatrix),Dt.setValue(C,"modelMatrix",X.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){let hn=Q.uniformsGroups;for(let mn=0,ul=hn.length;mn<ul;mn++){let Li=hn[mn];Ie.update(Li,_n),Ie.bind(Li,_n)}}return _n}function Yu(I,W){I.ambientLightColor.needsUpdate=W,I.lightProbe.needsUpdate=W,I.directionalLights.needsUpdate=W,I.directionalLightShadows.needsUpdate=W,I.pointLights.needsUpdate=W,I.pointLightShadows.needsUpdate=W,I.spotLights.needsUpdate=W,I.spotLightShadows.needsUpdate=W,I.rectAreaLights.needsUpdate=W,I.hemisphereLights.needsUpdate=W}function Ku(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return _},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(I,W,J){let Q=ue.get(I);Q.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),ue.get(I.texture).__webglTexture=W,ue.get(I.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(I,W){let J=ue.get(I);J.__webglFramebuffer=W,J.__useDefaultFramebuffer=W===void 0};let $u=C.createFramebuffer();this.setRenderTarget=function(I,W=0,J=0){M=I,k=W,_=J;let Q=!0,X=null,_e=!1,De=!1;if(I){let Fe=ue.get(I);if(Fe.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(C.FRAMEBUFFER,null),Q=!1;else if(Fe.__webglFramebuffer===void 0)Te.setupRenderTarget(I);else if(Fe.__hasExternalTextures)Te.rebindTextures(I,ue.get(I.texture).__webglTexture,ue.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){let Ke=I.depthTexture;if(Fe.__boundDepthTexture!==Ke){if(Ke!==null&&ue.has(Ke)&&(I.width!==Ke.image.width||I.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Te.setupDepthRenderbuffer(I)}}let Qe=I.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(De=!0);let it=ue.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(it[W])?X=it[W][J]:X=it[W],_e=!0):I.samples>0&&Te.useMultisampledRTT(I)===!1?X=ue.get(I).__webglMultisampledFramebuffer:Array.isArray(it)?X=it[J]:X=it,N.copy(I.viewport),z.copy(I.scissor),O=I.scissorTest}else N.copy(ke).multiplyScalar(ee).floor(),z.copy(Xe).multiplyScalar(ee).floor(),O=je;if(J!==0&&(X=$u),Z.bindFramebuffer(C.FRAMEBUFFER,X)&&Q&&Z.drawBuffers(I,X),Z.viewport(N),Z.scissor(z),Z.setScissorTest(O),_e){let Fe=ue.get(I.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+W,Fe.__webglTexture,J)}else if(De){let Fe=W;for(let Qe=0;Qe<I.textures.length;Qe++){let it=ue.get(I.textures[Qe]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Qe,it.__webglTexture,J,Fe)}}else if(I!==null&&J!==0){let Fe=ue.get(I.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Fe.__webglTexture,J)}D=-1},this.readRenderTargetPixels=function(I,W,J,Q,X,_e,De,Ge=0){if(!(I&&I.isWebGLRenderTarget)){ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=ue.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&De!==void 0&&(Fe=Fe[De]),Fe){Z.bindFramebuffer(C.FRAMEBUFFER,Fe);try{let Qe=I.textures[Ge],it=Qe.format,Ke=Qe.type;if(!he.textureFormatReadable(it)){ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!he.textureTypeReadable(Ke)){ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=I.width-Q&&J>=0&&J<=I.height-X&&(I.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ge),C.readPixels(W,J,Q,X,rt.convert(it),rt.convert(Ke),_e))}finally{let Qe=M!==null?ue.get(M).__webglFramebuffer:null;Z.bindFramebuffer(C.FRAMEBUFFER,Qe)}}},this.readRenderTargetPixelsAsync=async function(I,W,J,Q,X,_e,De,Ge=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=ue.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&De!==void 0&&(Fe=Fe[De]),Fe)if(W>=0&&W<=I.width-Q&&J>=0&&J<=I.height-X){Z.bindFramebuffer(C.FRAMEBUFFER,Fe);let Qe=I.textures[Ge],it=Qe.format,Ke=Qe.type;if(!he.textureFormatReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!he.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let mt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,mt),C.bufferData(C.PIXEL_PACK_BUFFER,_e.byteLength,C.STREAM_READ),I.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ge),C.readPixels(W,J,Q,X,rt.convert(it),rt.convert(Ke),0);let wt=M!==null?ue.get(M).__webglFramebuffer:null;Z.bindFramebuffer(C.FRAMEBUFFER,wt);let Ft=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await bd(C,Ft,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,mt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,_e),C.deleteBuffer(mt),C.deleteSync(Ft),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(I,W=null,J=0){let Q=Math.pow(2,-J),X=Math.floor(I.image.width*Q),_e=Math.floor(I.image.height*Q),De=W!==null?W.x:0,Ge=W!==null?W.y:0;Te.setTexture2D(I,0),C.copyTexSubImage2D(C.TEXTURE_2D,J,0,0,De,Ge,X,_e),Z.unbindTexture()};let ju=C.createFramebuffer(),Zu=C.createFramebuffer();this.copyTextureToTexture=function(I,W,J=null,Q=null,X=0,_e=null){_e===null&&(X!==0?(Sr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=X,X=0):_e=0);let De,Ge,Fe,Qe,it,Ke,mt,wt,Ft,Bt=I.isCompressedTexture?I.mipmaps[_e]:I.image;if(J!==null)De=J.max.x-J.min.x,Ge=J.max.y-J.min.y,Fe=J.isBox3?J.max.z-J.min.z:1,Qe=J.min.x,it=J.min.y,Ke=J.isBox3?J.min.z:0;else{let Rn=Math.pow(2,-X);De=Math.floor(Bt.width*Rn),Ge=Math.floor(Bt.height*Rn),I.isDataArrayTexture?Fe=Bt.depth:I.isData3DTexture?Fe=Math.floor(Bt.depth*Rn):Fe=1,Qe=0,it=0,Ke=0}Q!==null?(mt=Q.x,wt=Q.y,Ft=Q.z):(mt=0,wt=0,Ft=0);let Tt=rt.convert(W.format),Ze=rt.convert(W.type),kt;W.isData3DTexture?(Te.setTexture3D(W,0),kt=C.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(Te.setTexture2DArray(W,0),kt=C.TEXTURE_2D_ARRAY):(Te.setTexture2D(W,0),kt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,W.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,W.unpackAlignment);let bt=C.getParameter(C.UNPACK_ROW_LENGTH),_n=C.getParameter(C.UNPACK_IMAGE_HEIGHT),lr=C.getParameter(C.UNPACK_SKIP_PIXELS),Mn=C.getParameter(C.UNPACK_SKIP_ROWS),zr=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,Bt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Bt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Qe),C.pixelStorei(C.UNPACK_SKIP_ROWS,it),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ke);let Dt=I.isDataArrayTexture||I.isData3DTexture,pn=W.isDataArrayTexture||W.isData3DTexture;if(I.isDepthTexture){let Rn=ue.get(I),hn=ue.get(W),mn=ue.get(Rn.__renderTarget),ul=ue.get(hn.__renderTarget);Z.bindFramebuffer(C.READ_FRAMEBUFFER,mn.__webglFramebuffer),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,ul.__webglFramebuffer);for(let Li=0;Li<Fe;Li++)Dt&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ue.get(I).__webglTexture,X,Ke+Li),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ue.get(W).__webglTexture,_e,Ft+Li)),C.blitFramebuffer(Qe,it,De,Ge,mt,wt,De,Ge,C.DEPTH_BUFFER_BIT,C.NEAREST);Z.bindFramebuffer(C.READ_FRAMEBUFFER,null),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(X!==0||I.isRenderTargetTexture||ue.has(I)){let Rn=ue.get(I),hn=ue.get(W);Z.bindFramebuffer(C.READ_FRAMEBUFFER,ju),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,Zu);for(let mn=0;mn<Fe;mn++)Dt?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Rn.__webglTexture,X,Ke+mn):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Rn.__webglTexture,X),pn?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,hn.__webglTexture,_e,Ft+mn):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,hn.__webglTexture,_e),X!==0?C.blitFramebuffer(Qe,it,De,Ge,mt,wt,De,Ge,C.COLOR_BUFFER_BIT,C.NEAREST):pn?C.copyTexSubImage3D(kt,_e,mt,wt,Ft+mn,Qe,it,De,Ge):C.copyTexSubImage2D(kt,_e,mt,wt,Qe,it,De,Ge);Z.bindFramebuffer(C.READ_FRAMEBUFFER,null),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else pn?I.isDataTexture||I.isData3DTexture?C.texSubImage3D(kt,_e,mt,wt,Ft,De,Ge,Fe,Tt,Ze,Bt.data):W.isCompressedArrayTexture?C.compressedTexSubImage3D(kt,_e,mt,wt,Ft,De,Ge,Fe,Tt,Bt.data):C.texSubImage3D(kt,_e,mt,wt,Ft,De,Ge,Fe,Tt,Ze,Bt):I.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,_e,mt,wt,De,Ge,Tt,Ze,Bt.data):I.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,_e,mt,wt,Bt.width,Bt.height,Tt,Bt.data):C.texSubImage2D(C.TEXTURE_2D,_e,mt,wt,De,Ge,Tt,Ze,Bt);C.pixelStorei(C.UNPACK_ROW_LENGTH,bt),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,_n),C.pixelStorei(C.UNPACK_SKIP_PIXELS,lr),C.pixelStorei(C.UNPACK_SKIP_ROWS,Mn),C.pixelStorei(C.UNPACK_SKIP_IMAGES,zr),_e===0&&W.generateMipmaps&&C.generateMipmap(kt),Z.unbindTexture()},this.initRenderTarget=function(I){ue.get(I).__webglFramebuffer===void 0&&Te.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?Te.setTextureCube(I,0):I.isData3DTexture?Te.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?Te.setTexture2DArray(I,0):Te.setTexture2D(I,0),Z.unbindTexture()},this.resetState=function(){k=0,_=0,M=null,Z.reset(),B.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=gt._getDrawingBufferColorSpace(e),t.unpackColorSpace=gt._getUnpackColorSpace()}};function Uc(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},o={},a=i[0].morphTargetsRelative,c=new It,l=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=i[u].attributes.position.count}c.setIndex(d)}for(let h in s){let d=Qd(s[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let x=0;x<o[h].length;++x)f.push(o[h][x][u]);let g=Qd(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Qd(i){let e,t,n,r=-1,s=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*t}let o=new e(s),a=new dn(o,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let d=c/t;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<t;g++){let x=h.getComponent(u,g);a.setComponent(u+d,g,x)}}else o.set(h.array,c);c+=h.count*t}return r!==void 0&&(a.gpuType=r),a}var xt=[{id:"D1",number:1,nameKey:"deck.1",y:0,clear:3},{id:"D2",number:2,nameKey:"deck.2",y:3.3,clear:2.6},{id:"D3",number:3,nameKey:"deck.3",y:6.6,clear:2.7},{id:"D4",number:4,nameKey:"deck.4",y:9.9,clear:3.2},{id:"D5",number:5,nameKey:"deck.5",y:13.5,clear:2.8},{id:"D6",number:6,nameKey:"deck.6",y:16.8,clear:2.9}],nt=i=>{let e=xt.find(t=>t.id===i);if(!e)throw new Error(`Unknown deck ${i}`);return e},zs=i=>{let e=xt.findIndex(r=>r.id===i),t=xt[e],n=xt[e+1];return n?n.y-t.y:t.clear+.4},be={x1:-3.4,x2:3.4,z1:4,z2:16,landingFwdZ2:7,landingAftZ1:13,flightX1:-1,decks:["D1","D2","D3","D4","D5","D6"],openDecks:["D4"]},Hs={x1:-1.2,x2:be.flightX1,z1:7,z2:13},nr={x1:3,x2:3.2,z1:7,z2:13},Ka={x1:be.flightX1,x2:be.x2,z1:be.landingFwdZ2,z2:be.landingAftZ1},Bs=-1.75,Os=1.75,rn=7.6,Gs=[{id:"d1-corridor",deck:"D1",kind:"corridor",nameKey:"room.d1-corridor",x1:Bs,x2:Os,z1:-14,z2:4,floor:"steelGrate",wall:"paintedSteel",ceil:"ceilingSteel",litness:.45},{id:"d1-pump",deck:"D1",kind:"pump",nameKey:"room.d1-pump",x1:1.95,x2:rn,z1:-13.6,z2:-4,floor:"steelGrate",wall:"paintedSteel",ceil:"ceilingSteel",hull:["stbd"],litness:.42},{id:"d1-workshop",deck:"D1",kind:"service",nameKey:"room.d1-workshop",x1:-rn,x2:-1.95,z1:-13.6,z2:-4,floor:"steelPlate",wall:"paintedSteel",ceil:"ceilingSteel",hull:["port"],litness:.4},{id:"engine-room",deck:"D1",kind:"engine",nameKey:"room.engine-room",x1:-rn,x2:rn,z1:16.2,z2:30,clear:5.9,floor:"steelGrate",wall:"paintedSteel",ceil:"ceilingSteel",hull:["port","stbd"],litness:.5},{id:"shaft-tunnel",deck:"D1",kind:"hold",nameKey:"room.shaft-tunnel",x1:-4.6,x2:4.6,z1:30.2,z2:34,clear:2.4,floor:"steelPlate",wall:"hullSteel",ceil:"ceilingSteel",hull:["aft"],litness:.22},{id:"d2-corridor",deck:"D2",kind:"corridor",nameKey:"room.d2-corridor",x1:Bs,x2:Os,z1:-14,z2:4,floor:"linoService",wall:"paintedSteel",ceil:"ceilingSteel",litness:.45},{id:"d2-control",deck:"D2",kind:"pump",nameKey:"room.d2-control",x1:1.95,x2:rn,z1:-13.6,z2:-4,floor:"linoService",wall:"paintedSteel",ceil:"ceilingSteel",hull:["stbd"],litness:.5},{id:"d2-mess",deck:"D2",kind:"service",nameKey:"room.d2-mess",x1:-rn,x2:-1.95,z1:-13.6,z2:-4,floor:"linoService",wall:"panelCorridor",ceil:"ceilingPanel",hull:["port"],litness:.48},{id:"d2-gallery",deck:"D2",kind:"engine",nameKey:"room.d2-gallery",x1:-rn,x2:rn,z1:16.2,z2:30,floor:"steelGrate",wall:"paintedSteel",ceil:"ceilingSteel",hull:["port","stbd"],floorHoles:[{x1:-5.4,x2:5.4,z1:18.2,z2:28.2}],litness:.44},{id:"d3-corridor-fwd",deck:"D3",kind:"corridor",nameKey:"room.d3-corridor",x1:Bs,x2:Os,z1:-22,z2:4,floor:"carpetCorridor",wall:"panelCorridor",ceil:"ceilingPanel",litness:.55},{id:"d3-corridor-aft",deck:"D3",kind:"corridor",nameKey:"room.d3-corridor",x1:Bs,x2:Os,z1:16,z2:24,floor:"carpetCorridor",wall:"panelCorridor",ceil:"ceilingPanel",litness:.5},{id:"cabin-301",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:-rn,x2:-1.95,z1:-5.6,z2:-1.6,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["port"],litness:.35},{id:"cabin-302",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:1.95,x2:rn,z1:-5.6,z2:-1.6,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["stbd"],litness:.35},{id:"cabin-303",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:-rn,x2:-1.95,z1:-10.2,z2:-6.2,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["port"],litness:.35},{id:"cabin-304",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:1.95,x2:rn,z1:-10.2,z2:-6.2,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["stbd"],litness:.35},{id:"cabin-305",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:-rn,x2:-1.95,z1:-14.8,z2:-10.8,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["port"],litness:.35},{id:"cabin-306",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:1.95,x2:rn,z1:-14.8,z2:-10.8,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["stbd"],litness:.35},{id:"cabin-307",deck:"D3",kind:"cabin",nameKey:"room.cabin-307",x1:-rn,x2:-1.95,z1:-21,z2:-15.4,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["port"],litness:.42},{id:"cabin-308",deck:"D3",kind:"cabin",nameKey:"room.cabin",x1:1.95,x2:rn,z1:-21,z2:-15.4,floor:"carpetCabin",wall:"panelCabin",ceil:"ceilingPanel",hull:["stbd"],litness:.35},{id:"d3-linen",deck:"D3",kind:"service",nameKey:"room.d3-linen",x1:-rn,x2:-1.95,z1:17,z2:22,floor:"linoService",wall:"panelCorridor",ceil:"ceilingPanel",hull:["port"],litness:.4},{id:"foyer",deck:"D4",kind:"foyer",nameKey:"room.foyer",x1:-6,x2:6,z1:0,z2:16.2,floor:"carpetSalon",wall:"panelWood",ceil:"ceilingWood",floorHoles:[Ka],litness:.72},{id:"salon",deck:"D4",kind:"salon",nameKey:"room.salon",x1:-6,x2:6,z1:-14,z2:-.2,floor:"carpetSalon",wall:"panelWood",ceil:"ceilingWood",litness:.8},{id:"d4-fwd-lobby",deck:"D4",kind:"foyer",nameKey:"room.d4-fwd-lobby",x1:-6,x2:6,z1:-20,z2:-14.2,floor:"carpetSalon",wall:"panelWood",ceil:"ceilingWood",litness:.62},{id:"promenade-port",deck:"D4",kind:"promenade",nameKey:"room.promenade",x1:-8.4,x2:-6.2,z1:-20,z2:24,exterior:!0,floor:"teakDeck",wall:"paintedSteel",ceil:"ceilingSteel",rail:["port"],litness:.6},{id:"promenade-stbd",deck:"D4",kind:"promenade",nameKey:"room.promenade",x1:6.2,x2:8.4,z1:-20,z2:24,exterior:!0,floor:"teakDeck",wall:"paintedSteel",ceil:"ceilingSteel",rail:["stbd"],litness:.6},{id:"playroom",deck:"D4",kind:"playroom",nameKey:"room.playroom",x1:-6,x2:-.6,z1:16.4,z2:24,floor:"playroomFloor",wall:"playroomWall",ceil:"ceilingPanel",litness:.42},{id:"d4-aft-svc",deck:"D4",kind:"service",nameKey:"room.d4-aft-svc",x1:-.4,x2:6,z1:16.4,z2:24,floor:"linoService",wall:"panelCorridor",ceil:"ceilingPanel",litness:.5},{id:"d4-aft-deck",deck:"D4",kind:"open-deck",nameKey:"room.d4-aft-deck",x1:-8.4,x2:8.4,z1:24.2,z2:28.4,exterior:!0,openSky:!0,floor:"teakDeck",wall:"paintedSteel",rail:["port","stbd","aft"],litness:.55},{id:"boat-port",deck:"D5",kind:"open-deck",nameKey:"room.boat-deck",x1:-8.4,x2:-3.6,z1:-22,z2:24,exterior:!0,openSky:!0,floor:"teakDeck",wall:"paintedSteel",rail:["port"],litness:.5},{id:"boat-stbd",deck:"D5",kind:"open-deck",nameKey:"room.boat-deck",x1:3.6,x2:8.4,z1:-22,z2:24,exterior:!0,openSky:!0,floor:"teakDeck",wall:"paintedSteel",rail:["stbd"],litness:.5},{id:"d5-house-fwd",deck:"D5",kind:"foyer",nameKey:"room.d5-house",x1:be.x1,x2:be.x2,z1:-22,z2:3.8,floor:"linoService",wall:"panelCorridor",ceil:"ceilingPanel",litness:.55},{id:"d5-house-aft",deck:"D5",kind:"foyer",nameKey:"room.d5-house",x1:be.x1,x2:be.x2,z1:16.2,z2:24,floor:"linoService",wall:"panelCorridor",ceil:"ceilingPanel",litness:.5},{id:"d5-aft-open",deck:"D5",kind:"open-deck",nameKey:"room.d5-aft-open",x1:-8.4,x2:8.4,z1:24.2,z2:28.4,exterior:!0,openSky:!0,floor:"teakDeck",wall:"paintedSteel",rail:["port","stbd","aft"],litness:.5},{id:"wheelhouse",deck:"D6",kind:"bridge",nameKey:"room.wheelhouse",x1:-6.4,x2:6.4,z1:-22,z2:-16.2,floor:"linoService",wall:"paintedSteel",ceil:"ceilingSteel",hull:["fwd","port","stbd"],litness:.5},{id:"chart-room",deck:"D6",kind:"chart",nameKey:"room.chart-room",x1:-6.4,x2:-1.95,z1:-16,z2:-11,floor:"linoService",wall:"panelWood",ceil:"ceilingPanel",hull:["port"],litness:.55},{id:"captain-office",deck:"D6",kind:"office",nameKey:"room.captain-office",x1:1.95,x2:6.4,z1:-16,z2:-11,floor:"carpetCabin",wall:"panelWood",ceil:"ceilingWood",hull:["stbd"],litness:.5},{id:"d6-passage",deck:"D6",kind:"corridor",nameKey:"room.d6-passage",x1:Bs,x2:Os,z1:-16,z2:4,floor:"linoService",wall:"paintedSteel",ceil:"ceilingSteel",litness:.5},{id:"wing-port",deck:"D6",kind:"open-deck",nameKey:"room.bridge-wing",x1:-8.2,x2:-6.6,z1:-21,z2:-17.5,exterior:!0,openSky:!0,floor:"steelPlate",wall:"paintedSteel",rail:["port","fwd","aft"],litness:.5},{id:"wing-stbd",deck:"D6",kind:"open-deck",nameKey:"room.bridge-wing",x1:6.6,x2:8.2,z1:-21,z2:-17.5,exterior:!0,openSky:!0,floor:"steelPlate",wall:"paintedSteel",rail:["stbd","fwd","aft"],litness:.5}],Ti=[{id:"bath-307",room:"cabin-307",nameKey:"room.bathroom",kind:"bathroom",x1:-4.7,x2:-1.95,z1:-21,z2:-18.2,floor:"tileBath",wall:"tileBath",partitions:["port","aft"],litness:.6}],ir=[{id:"d1-trunk",a:"d1-corridor",b:"TRUNK@D1",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d1-pump-door",a:"d1-corridor",b:"d1-pump",side:"stbd",at:-8.8,width:1.1,height:1.95,kind:"watertight",coaming:.28},{id:"d1-workshop-door",a:"d1-corridor",b:"d1-workshop",side:"port",at:-8.8,width:1.1,height:1.95,kind:"watertight",coaming:.28},{id:"d1-engine-door",a:"TRUNK@D1",b:"engine-room",side:"aft",at:0,width:1.3,height:2,kind:"watertight",coaming:.32},{id:"d1-shaft-door",a:"engine-room",b:"shaft-tunnel",side:"aft",at:0,width:1.2,height:1.9,kind:"sealed",coaming:.32},{id:"d2-trunk",a:"d2-corridor",b:"TRUNK@D2",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d2-control-door",a:"d2-corridor",b:"d2-control",side:"stbd",at:-8.8,width:1.1,height:2,kind:"watertight",coaming:.22},{id:"d2-mess-door",a:"d2-corridor",b:"d2-mess",side:"port",at:-8.8,width:1,height:2,kind:"interior"},{id:"d2-gallery-door",a:"TRUNK@D2",b:"d2-gallery",side:"aft",at:0,width:1.3,height:2,kind:"watertight",coaming:.32},{id:"d3-trunk-fwd",a:"d3-corridor-fwd",b:"TRUNK@D3",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d3-trunk-aft",a:"TRUNK@D3",b:"d3-corridor-aft",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"door-301",a:"d3-corridor-fwd",b:"cabin-301",side:"port",at:-3.6,width:.95,height:2.05,kind:"cabin",plate:"301",locked:!0},{id:"door-302",a:"d3-corridor-fwd",b:"cabin-302",side:"stbd",at:-3.6,width:.95,height:2.05,kind:"cabin",plate:"302",locked:!0},{id:"door-303",a:"d3-corridor-fwd",b:"cabin-303",side:"port",at:-8.2,width:.95,height:2.05,kind:"cabin",plate:"303",locked:!0},{id:"door-304",a:"d3-corridor-fwd",b:"cabin-304",side:"stbd",at:-8.2,width:.95,height:2.05,kind:"cabin",plate:"304",locked:!0},{id:"door-305",a:"d3-corridor-fwd",b:"cabin-305",side:"port",at:-12.8,width:.95,height:2.05,kind:"cabin",plate:"305",locked:!0},{id:"door-306",a:"d3-corridor-fwd",b:"cabin-306",side:"stbd",at:-12.8,width:.95,height:2.05,kind:"cabin",plate:"306",locked:!0},{id:"door-307",a:"d3-corridor-fwd",b:"cabin-307",side:"port",at:-16.6,width:.95,height:2.05,kind:"cabin",plate:"307"},{id:"door-308",a:"d3-corridor-fwd",b:"cabin-308",side:"stbd",at:-18.2,width:.95,height:2.05,kind:"cabin",plate:"308",locked:!0},{id:"d3-linen-door",a:"d3-corridor-aft",b:"d3-linen",side:"port",at:19.5,width:.95,height:2.05,kind:"interior",locked:!0},{id:"d4-salon-foyer",a:"salon",b:"foyer",side:"aft",at:0,width:5,height:2.7,kind:"open"},{id:"d4-salon-lobby",a:"d4-fwd-lobby",b:"salon",side:"aft",at:0,width:4,height:2.7,kind:"open"},{id:"d4-salon-prom-p",a:"promenade-port",b:"salon",side:"stbd",at:-5,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-salon-prom-s",a:"salon",b:"promenade-stbd",side:"stbd",at:-5,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-foyer-prom-p",a:"promenade-port",b:"foyer",side:"stbd",at:10,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-foyer-prom-s",a:"foyer",b:"promenade-stbd",side:"stbd",at:10,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-lobby-prom-p",a:"promenade-port",b:"d4-fwd-lobby",side:"stbd",at:-17.5,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-lobby-prom-s",a:"d4-fwd-lobby",b:"promenade-stbd",side:"stbd",at:-17.5,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-playroom-door",a:"foyer",b:"playroom",side:"aft",at:-3.3,width:1.2,height:2.1,kind:"interior"},{id:"d4-aftsvc-door",a:"foyer",b:"d4-aft-svc",side:"aft",at:2.8,width:1,height:2.1,kind:"interior"},{id:"d4-playroom-prom",a:"promenade-port",b:"playroom",side:"stbd",at:20,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-aftsvc-prom",a:"d4-aft-svc",b:"promenade-stbd",side:"stbd",at:20,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d4-prom-aft-p",a:"promenade-port",b:"d4-aft-deck",side:"aft",at:-7.3,width:2.2,height:2.4,kind:"open"},{id:"d4-prom-aft-s",a:"promenade-stbd",b:"d4-aft-deck",side:"aft",at:7.3,width:2.2,height:2.4,kind:"open"},{id:"d5-trunk-fwd",a:"d5-house-fwd",b:"TRUNK@D5",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d5-trunk-aft",a:"TRUNK@D5",b:"d5-house-aft",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d5-house-p",a:"boat-port",b:"d5-house-fwd",side:"stbd",at:-6,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d5-house-s",a:"d5-house-fwd",b:"boat-stbd",side:"stbd",at:-6,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d5-house-aft-p",a:"boat-port",b:"d5-house-aft",side:"stbd",at:20,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d5-house-aft-s",a:"d5-house-aft",b:"boat-stbd",side:"stbd",at:20,width:1.1,height:2.1,kind:"weather",coaming:.16},{id:"d5-boat-aft-p",a:"boat-port",b:"d5-aft-open",side:"aft",at:-6,width:3,height:2.6,kind:"open"},{id:"d5-boat-aft-s",a:"boat-stbd",b:"d5-aft-open",side:"aft",at:6,width:3,height:2.6,kind:"open"},{id:"d6-trunk",a:"d6-passage",b:"TRUNK@D6",side:"aft",at:0,width:2.4,height:2.2,kind:"open"},{id:"d6-chart-door",a:"d6-passage",b:"chart-room",side:"port",at:-13.5,width:1,height:2.05,kind:"interior"},{id:"d6-captain-door",a:"d6-passage",b:"captain-office",side:"stbd",at:-13.5,width:1,height:2.05,kind:"interior"},{id:"d6-wheelhouse-door",a:"wheelhouse",b:"d6-passage",side:"aft",at:0,width:2.6,height:2.3,kind:"open"},{id:"d6-wing-p",a:"wing-port",b:"wheelhouse",side:"stbd",at:-19.2,width:1,height:2,kind:"weather",coaming:.16},{id:"d6-wing-s",a:"wheelhouse",b:"wing-stbd",side:"stbd",at:-19.2,width:1,height:2,kind:"weather",coaming:.16}],$a=[{id:"door-bath-307",zone:"bath-307",side:"aft",at:-3.3,width:.8,height:2}],eu=[{id:"ladder-pump",lower:"d1-pump",upper:"d2-control",x:6.6,z:-5.4,lowerDeck:"D1",upperDeck:"D2"}],Vx=new Map(Gs.map(i=>[i.id,i])),Wn=i=>Vx.get(i);var Ai=(i,e,t,n=0)=>e>=i.x1-n&&e<=i.x2+n&&t>=i.z1-n&&t<=i.z2+n;var Vs=(i,e,t=0)=>i>=be.x1-t&&i<=be.x2+t&&e>=be.z1-t&&e<=be.z2+t;function tu(i,e,t){if(!Vs(i,e))return null;let n=[],r=i>=be.flightX1&&i<=nr.x1&&e>be.landingFwdZ2&&e<be.landingAftZ1;for(let a of be.decks){let c=nt(a).y;if(!r){n.push(c);continue}let l=be.landingAftZ1-be.landingFwdZ2,h=(be.landingAftZ1-e)/l;n.push(c+h*zs(a))}if(n.length===0)return null;let s=n[0],o=Math.abs(s-t);for(let a of n){let c=Math.abs(a-t);c<o&&(s=a,o=c)}return s}var Ue=Math.PI/2;var Wx=[{id:"helm-main",room:"wheelhouse",type:"helm",x:0,z:-19.4,rot:Math.PI,reason:"The ship is steered from here. This is the only steering wheel aboard."},{id:"bridge-console-c",room:"wheelhouse",type:"bridgeConsole",x:0,z:-20.6,rot:Math.PI,reason:"Forward console carrying the steering repeater and rudder angle indicator."},{id:"bridge-console-p",room:"wheelhouse",type:"bridgeConsole",x:-3.4,z:-20.6,rot:Math.PI,reason:"Port console: engine revolution counters and bow thruster controls."},{id:"bridge-console-s",room:"wheelhouse",type:"bridgeConsole",x:3.4,z:-20.6,rot:Math.PI,reason:"Starboard console: watch telephones and general alarm keys."},{id:"telegraph-p",room:"wheelhouse",type:"engineTelegraph",x:-1.5,z:-19.2,rot:Math.PI,reason:"Port engine order telegraph \u2014 the bridge orders speed to the engine room with it."},{id:"telegraph-s",room:"wheelhouse",type:"engineTelegraph",x:1.5,z:-19.2,rot:Math.PI,reason:"Starboard engine order telegraph, one per shaft."},{id:"compass-main",room:"wheelhouse",type:"binnacleCompass",x:0,z:-18.2,reason:"Magnetic compass in its binnacle, stationed on the centreline abaft the wheel."},{id:"radar-main",room:"wheelhouse",type:"radarSet",x:-2.4,z:-17.4,rot:Math.PI,reason:"Radar display used to keep a lookout in poor visibility \u2014 it shows the ice field."},{id:"radio-bridge",room:"wheelhouse",type:"radioSet",x:2.6,z:-17.4,rot:Math.PI,reason:"VHF set for distress traffic. Jack uses it after the impact."},{id:"navlights-panel",room:"wheelhouse",type:"navLightBox",x:5.2,z:-18.6,rot:-Ue,reason:"Navigation light indicator panel \u2014 required equipment beside the starboard door."},{id:"gauges-bridge",room:"wheelhouse",type:"gaugePanel",x:-5.2,z:-18.6,rot:Ue,reason:"Wind, list and draught gauges grouped where the officer of the watch can read them."},{id:"bridge-stool-1",room:"wheelhouse",type:"bridgeStool",x:-.9,z:-17.6,reason:"Helmsman's stool, stowed abaft the wheel."},{id:"bridge-sign",room:"wheelhouse",type:"deckSign",x:0,z:-16.4,rot:0,text:"sign.bridge",reason:"Door sign at the wheelhouse entrance identifying the navigating bridge."},{id:"bridge-lamp-p",room:"wheelhouse",type:"ceilingLamp",x:-3.2,z:-19,reason:"Dimmed red-shielded deckhead lamp \u2014 night bridge lighting that preserves night vision.",variant:1},{id:"bridge-lamp-s",room:"wheelhouse",type:"ceilingLamp",x:3.2,z:-19,reason:"Second dimmed deckhead lamp, one per side of the wheelhouse.",variant:1},{id:"chart-table",room:"chart-room",type:"chartTable",x:-4.2,z:-13.5,rot:Ue,reason:"Charts are worked here, one bulkhead away from the wheelhouse."},{id:"chart-rack",room:"chart-room",type:"chartRack",x:-2.6,z:-15.4,rot:Math.PI,reason:"Rolled chart stowage above the working table."},{id:"chart-barometer",room:"chart-room",type:"barometer",x:-6.1,z:-12.4,rot:-Ue,reason:"Aneroid barometer \u2014 the falling glass is the first warning of the night's weather."},{id:"chart-lamp",room:"chart-room",type:"ceilingLamp",x:-4.2,z:-13.5,reason:"Chart table lamp; the chart room stays lit while the bridge is dark."},{id:"chart-sign",room:"chart-room",type:"deckSign",x:-2.1,z:-13.5,rot:-Ue,text:"sign.chart",reason:"Door sign beside the chart room door off the passage."},{id:"captain-desk",room:"captain-office",type:"chartTable",x:4.4,z:-13.6,rot:-Ue,variant:1,reason:"The master's writing desk, where the official log is kept."},{id:"captain-chair",room:"captain-office",type:"cabinChair",x:3.2,z:-13.6,rot:-Ue,reason:"Desk chair belonging to the writing desk."},{id:"captain-radio",room:"captain-office",type:"radioSet",x:5.6,z:-15.4,rot:Math.PI,variant:1,reason:"Private set so the master can be raised from his office at any hour."},{id:"captain-mirror",room:"captain-office",type:"mirrorLarge",x:2.05,z:-14.6,rot:Ue,variant:1,reason:"Shaving mirror on the inboard bulkhead \u2014 one of the three mirrors that reflect the ship in real time."},{id:"captain-shelf",room:"captain-office",type:"shelfRack",x:4,z:-11.3,rot:0,variant:1,reason:"Bookshelf with sailing directions and the ship's papers."},{id:"captain-lamp",room:"captain-office",type:"ceilingLamp",x:4.2,z:-13.5,reason:"Deckhead lamp keeping the office legible without the flashlight."},{id:"captain-sign",room:"captain-office",type:"deckSign",x:2.05,z:-13.5,rot:Ue,text:"sign.captain",reason:"Door sign beside the captain's office door."},{id:"d6-sign-junction",room:"d6-passage",type:"deckSign",x:0,z:3.6,rot:0,text:"sign.d6-junction",reason:"Junction sign at the head of the main stair: bridge forward, boat deck below."},{id:"d6-lamp-1",room:"d6-passage",type:"ceilingLamp",x:0,z:-12,reason:"Passage lighting at regular 6 m spacing."},{id:"d6-lamp-2",room:"d6-passage",type:"ceilingLamp",x:0,z:-5,reason:"Passage lighting at regular 6 m spacing."},{id:"d6-lamp-3",room:"d6-passage",type:"ceilingLamp",x:0,z:1.5,reason:"Passage lighting at regular 6 m spacing."},{id:"d6-fire",room:"d6-passage",type:"fireStation",x:1.6,z:-8.5,rot:-Ue,reason:"Fire station: hose reel and extinguisher, required in every enclosed passage."},{id:"wing-p-light",room:"wing-port",type:"searchlight",x:-7.4,z:-20.2,rot:Math.PI,reason:"Wing searchlight used to sweep the water for ice."},{id:"wing-s-light",room:"wing-stbd",type:"searchlight",x:7.4,z:-20.2,rot:Math.PI,reason:"Wing searchlight used to sweep the water for ice."},{id:"wing-p-buoy",room:"wing-port",type:"lifebuoy",x:-7.4,z:-18.1,rot:Ue,reason:"Lifebuoy stowed on the bridge wing rail."},{id:"wing-s-buoy",room:"wing-stbd",type:"lifebuoy",x:7.4,z:-18.1,rot:-Ue,reason:"Lifebuoy stowed on the bridge wing rail."},{id:"funnel-base",room:"d5-house-aft",type:"funnelBase",x:0,z:20,reason:"Base of the single funnel casing, rising through the deckhouse."},{id:"d5-sign",room:"d5-house-fwd",type:"deckSign",x:0,z:3.4,rot:0,text:"sign.boat-deck",reason:"Junction sign inside the deckhouse: lifeboat stations port and starboard."},{id:"d5-lamp-1",room:"d5-house-fwd",type:"ceilingLamp",x:0,z:-16,reason:"Deckhouse lighting."},{id:"d5-lamp-2",room:"d5-house-fwd",type:"ceilingLamp",x:0,z:-8,reason:"Deckhouse lighting."},{id:"d5-lamp-3",room:"d5-house-fwd",type:"ceilingLamp",x:0,z:-1,reason:"Deckhouse lighting."},{id:"d5-lamp-4",room:"d5-house-aft",type:"ceilingLamp",x:0,z:18,reason:"Deckhouse lighting."},{id:"d5-house-bench",room:"d5-house-fwd",type:"benchSeat",x:-2.4,z:-12,rot:Ue,reason:"Muster bench inside the deckhouse where passengers wait for their boat station."},{id:"reception",room:"foyer",type:"receptionDesk",x:-4.3,z:14,rot:-Ue,reason:"Purser's desk facing the head of the grand stair \u2014 where passengers embark."},{id:"foyer-bell",room:"foyer",type:"shipBell",x:-4.3,z:12.6,reason:"The Orpheus's bell, mounted at the purser's desk. Jack rings it to raise the general alarm."},{id:"foyer-notice",room:"foyer",type:"noticeBoard",x:5.85,z:13.6,rot:-Ue,reason:"Passenger notice board: sailing times, boat drill and the deck plan."},{id:"foyer-mirror",room:"foyer",type:"mirrorLarge",x:-5.85,z:8.4,rot:Ue,reason:"Full-height foyer mirror. Real-time reflection \u2014 the ghost girls are seen here before they are seen in person."},{id:"foyer-chandelier",room:"foyer",type:"chandelier",x:0,z:14,reason:"Foyer chandelier over the stair head, the main practical light of the space."},{id:"foyer-plant-1",room:"foyer",type:"potPlant",x:5.2,z:2,reason:"Palm in a brass tub, standard first-class foyer dressing."},{id:"foyer-plant-2",room:"foyer",type:"potPlant",x:-5.2,z:2,reason:"Matching palm on the port side of the foyer."},{id:"foyer-bench-p",room:"foyer",type:"benchSeat",x:-5.2,z:5.6,rot:Ue,reason:"Waiting bench against the port bulkhead."},{id:"foyer-bench-s",room:"foyer",type:"benchSeat",x:5.2,z:5.6,rot:-Ue,reason:"Waiting bench against the starboard bulkhead."},{id:"foyer-cart",room:"foyer",type:"luggageCart",x:4.6,z:15.2,rot:.6,reason:"Luggage trolley left by the stewards on embarkation evening."},{id:"foyer-sign",room:"foyer",type:"deckSign",x:0,z:16.05,rot:0,text:"sign.foyer-aft",reason:"Junction sign at the aft doors: playroom to port, pantry to starboard."},{id:"foyer-sign-stair",room:"foyer",type:"deckSign",x:3.6,z:11.9,rot:0,text:"sign.stair",reason:"Deck index at the grand stair, listing which decks lie above and below."},{id:"foyer-lamp-p",room:"foyer",type:"wallLamp",x:-5.9,z:11,rot:Ue,reason:"Bracket lamp on the port bulkhead of the foyer."},{id:"foyer-lamp-s",room:"foyer",type:"wallLamp",x:5.9,z:11,rot:-Ue,reason:"Bracket lamp on the starboard bulkhead of the foyer."},{id:"foyer-lamp-p2",room:"foyer",type:"wallLamp",x:-5.9,z:3,rot:Ue,reason:"Bracket lamp on the port bulkhead of the foyer."},{id:"foyer-lamp-s2",room:"foyer",type:"wallLamp",x:5.9,z:3,rot:-Ue,reason:"Bracket lamp on the starboard bulkhead of the foyer."},{id:"salon-bar",room:"salon",type:"barCounter",x:3.9,z:-11.4,rot:0,reason:"The salon bar, set against the forward starboard corner away from the windows."},{id:"salon-stool-1",room:"salon",type:"barStool",x:2.6,z:-10,reason:"Bar stool at the counter."},{id:"salon-stool-2",room:"salon",type:"barStool",x:3.5,z:-10,reason:"Bar stool at the counter."},{id:"salon-stool-3",room:"salon",type:"barStool",x:4.4,z:-10,reason:"Bar stool at the counter."},{id:"salon-piano",room:"salon",type:"pianoUpright",x:-4.2,z:-12,rot:-Ue,reason:"Upright piano in the forward port corner; the salon doubles as the music room."},{id:"salon-mirror",room:"salon",type:"mirrorLarge",x:-5.85,z:-6,rot:Ue,reason:"Decorative salon mirror with a live reflection \u2014 used for the first sighting of a passenger who should not be there."},{id:"salon-chand-1",room:"salon",type:"chandelier",x:0,z:-10,reason:"Salon chandelier, forward of the seating."},{id:"salon-chand-2",room:"salon",type:"chandelier",x:0,z:-5,reason:"Salon chandelier, amidships."},{id:"salon-chand-3",room:"salon",type:"chandelier",x:0,z:-1.6,reason:"Salon chandelier, aft by the foyer opening."},{id:"salon-table-1",room:"salon",type:"salonTable",x:-3,z:-8.4,reason:"Card table with its chairs, port side."},{id:"salon-table-2",room:"salon",type:"salonTable",x:3,z:-6.4,reason:"Card table with its chairs, starboard side."},{id:"salon-table-3",room:"salon",type:"salonTable",x:-3.2,z:-3,reason:"Card table with its chairs, aft port."},{id:"salon-sofa-1",room:"salon",type:"sofa",x:0,z:-7.2,rot:0,reason:"Centre sofa facing the aft opening."},{id:"salon-arm-1",room:"salon",type:"armchair",x:-1.6,z:-5.2,rot:-.5,reason:"Armchair grouped with the centre sofa."},{id:"salon-arm-2",room:"salon",type:"armchair",x:1.6,z:-5.2,rot:.5,reason:"Armchair grouped with the centre sofa."},{id:"salon-arm-3",room:"salon",type:"armchair",x:4.4,z:-2.4,rot:-1.9,reason:"Armchair by the starboard windows."},{id:"salon-plant-1",room:"salon",type:"potPlant",x:-5.2,z:-13.2,reason:"Palm in the forward port corner."},{id:"salon-plant-2",room:"salon",type:"potPlant",x:5.2,z:-13.2,reason:"Palm in the forward starboard corner."},{id:"salon-art-1",room:"salon",type:"paintingSeascape",x:0,z:-13.9,rot:0,reason:"Seascape on the forward bulkhead, the only unbroken wall in the salon."},{id:"salon-lamp-p",room:"salon",type:"wallLamp",x:-5.9,z:-10.4,rot:Ue,reason:"Bracket lamp between the port windows."},{id:"salon-lamp-p2",room:"salon",type:"wallLamp",x:-5.9,z:-2.4,rot:Ue,reason:"Bracket lamp between the port windows."},{id:"salon-lamp-s",room:"salon",type:"wallLamp",x:5.9,z:-10.4,rot:-Ue,reason:"Bracket lamp between the starboard windows."},{id:"salon-lamp-s2",room:"salon",type:"wallLamp",x:5.9,z:-2.4,rot:-Ue,reason:"Bracket lamp between the starboard windows."},{id:"lobby-model",room:"d4-fwd-lobby",type:"shipModelCase",x:0,z:-19.4,rot:Math.PI,reason:"Builder's model of the Orpheus in a glass case \u2014 the ship shows the player its own silhouette."},{id:"lobby-notice",room:"d4-fwd-lobby",type:"noticeBoard",x:-5.85,z:-16.4,rot:Ue,variant:1,reason:"Boat-station list posted where passengers pass on the way to the promenade."},{id:"lobby-chand",room:"d4-fwd-lobby",type:"chandelier",x:0,z:-17,reason:"Lobby chandelier."},{id:"lobby-bench",room:"d4-fwd-lobby",type:"benchSeat",x:4.6,z:-17,rot:-Ue,reason:"Bench beside the starboard promenade door."},{id:"lobby-sign",room:"d4-fwd-lobby",type:"deckSign",x:0,z:-14.35,rot:0,text:"sign.salon",reason:"Junction sign at the salon opening."},{id:"prom-p-chair-1",room:"promenade-port",type:"deckChair",x:-7.6,z:-12,rot:-Ue,reason:"Steamer chair in its stowage row along the promenade."},{id:"prom-p-chair-2",room:"promenade-port",type:"deckChair",x:-7.6,z:-10.2,rot:-Ue,reason:"Steamer chair in its stowage row along the promenade."},{id:"prom-p-chair-3",room:"promenade-port",type:"deckChair",x:-7.6,z:6,rot:-Ue,reason:"Steamer chair in its stowage row along the promenade."},{id:"prom-s-chair-1",room:"promenade-stbd",type:"deckChair",x:7.6,z:-12,rot:Ue,reason:"Steamer chair in its stowage row along the promenade."},{id:"prom-s-chair-2",room:"promenade-stbd",type:"deckChair",x:7.6,z:6,rot:Ue,reason:"Steamer chair in its stowage row along the promenade."},{id:"prom-p-buoy",room:"promenade-port",type:"lifebuoy",x:-8.25,z:-3,rot:Ue,reason:"Lifebuoy on the promenade rail, at the regulation spacing."},{id:"prom-s-buoy",room:"promenade-stbd",type:"lifebuoy",x:8.25,z:-3,rot:-Ue,reason:"Lifebuoy on the promenade rail, at the regulation spacing."},{id:"prom-p-lamp-1",room:"promenade-port",type:"wallLamp",x:-6.35,z:-14,rot:-Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-p-lamp-2",room:"promenade-port",type:"wallLamp",x:-6.35,z:-1,rot:-Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-p-lamp-3",room:"promenade-port",type:"wallLamp",x:-6.35,z:13,rot:-Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-p-lamp-4",room:"promenade-port",type:"wallLamp",x:-6.35,z:21.5,rot:-Ue,variant:1,reason:"Weatherproof promenade lamp outside the playroom door."},{id:"prom-s-lamp-1",room:"promenade-stbd",type:"wallLamp",x:6.35,z:-14,rot:Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-s-lamp-2",room:"promenade-stbd",type:"wallLamp",x:6.35,z:-1,rot:Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-s-lamp-3",room:"promenade-stbd",type:"wallLamp",x:6.35,z:13,rot:Ue,variant:1,reason:"Weatherproof promenade lamp on the deckhouse side."},{id:"prom-p-vent",room:"promenade-port",type:"ventilator",x:-6.9,z:17,reason:"Cowl ventilator serving the deck below."},{id:"prom-s-vent",room:"promenade-stbd",type:"ventilator",x:6.9,z:17,reason:"Cowl ventilator serving the deck below."},{id:"prom-p-sign",room:"promenade-port",type:"deckSign",x:-6.35,z:19.4,rot:-Ue,text:"sign.playroom",reason:"Door sign for the children's playroom, on the promenade side."},{id:"playroom-horse",room:"playroom",type:"rockingHorse",x:-4.4,z:22,rot:-.4,reason:"Rocking horse \u2014 the largest fixed toy, left where the children abandoned it."},{id:"playroom-chest",room:"playroom",type:"toyChest",x:-1.6,z:22.6,rot:0,reason:"Toy chest against the aft bulkhead."},{id:"playroom-chair-1",room:"playroom",type:"childChair",x:-3,z:18.6,rot:.3,reason:"Child's chair at the play table."},{id:"playroom-chair-2",room:"playroom",type:"childChair",x:-2,z:19.4,rot:2.6,reason:"Child's chair at the play table, pushed back."},{id:"playroom-chair-3",room:"playroom",type:"childChair",x:-4.6,z:19.6,rot:1.4,reason:"Child's chair at the play table."},{id:"playroom-blackboard",room:"playroom",type:"blackboard",x:-5.85,z:22.6,rot:Ue,reason:"Nursery blackboard. What is drawn on it changes after the impact."},{id:"playroom-doll",room:"playroom",type:"dollHouse",x:-.95,z:18,rot:-Ue,reason:"Doll's house on its stand by the foyer door."},{id:"playroom-lamp-1",room:"playroom",type:"ceilingLamp",x:-3.3,z:18.4,variant:2,reason:"Nursery deckhead lamp with a coloured shade."},{id:"playroom-lamp-2",room:"playroom",type:"ceilingLamp",x:-3.3,z:22.2,variant:2,reason:"Nursery deckhead lamp with a coloured shade."},{id:"aftsvc-rack",room:"d4-aft-svc",type:"shelfRack",x:5.5,z:18.4,rot:-Ue,reason:"Pantry shelving for the salon service."},{id:"aftsvc-cart",room:"d4-aft-svc",type:"laundryCart",x:2.4,z:22.4,rot:.4,reason:"Stewards' linen trolley parked in the pantry."},{id:"aftsvc-lamp",room:"d4-aft-svc",type:"ceilingLamp",x:2.8,z:20.2,reason:"Pantry lighting."},{id:"aftdeck-bollard-p",room:"d4-aft-deck",type:"bollard",x:-7.4,z:27.4,reason:"Mooring bollard on the after mooring deck."},{id:"aftdeck-bollard-s",room:"d4-aft-deck",type:"bollard",x:7.4,z:27.4,reason:"Mooring bollard on the after mooring deck."},{id:"aftdeck-capstan",room:"d4-aft-deck",type:"capstan",x:0,z:27,reason:"Warping capstan on the centreline aft."},{id:"aftdeck-rope-1",room:"d4-aft-deck",type:"ropeCoil",x:-4.6,z:26.4,reason:"Coiled mooring line beside its bollard."},{id:"aftdeck-rope-2",room:"d4-aft-deck",type:"ropeCoil",x:4.6,z:26.4,reason:"Coiled mooring line beside its bollard."},{id:"aftdeck-flag",room:"d4-aft-deck",type:"flagstaff",x:0,z:28.1,reason:"Ensign staff at the stern."},{id:"d3-sign-cabins",room:"d3-corridor-fwd",type:"deckSign",x:0,z:3.85,rot:0,text:"sign.cabins",reason:"Junction sign at the stair landing: cabins 301-308 forward."},{id:"d3-sign-aft",room:"d3-corridor-aft",type:"deckSign",x:0,z:16.15,rot:0,text:"sign.d3-aft",reason:"Junction sign at the aft stair landing."},{id:"d3-linen-lamp",room:"d3-linen",type:"ceilingLamp",x:-4.6,z:19.5,reason:"Deckhead lamp in the linen store \u2014 every enclosed space carries a fitting."},{id:"d3-linen-rack",room:"d3-linen",type:"shelfRack",x:-7.2,z:19.5,rot:Math.PI/2,reason:"Linen shelving against the ship's side."},{id:"d3-fire",room:"d3-corridor-fwd",type:"fireStation",x:1.6,z:-5.9,rot:-Ue,reason:"Fire station midway along the cabin alleyway."},{id:"c307-bed",room:"cabin-307",type:"bed",x:-6.1,z:-17,rot:Ue,reason:"Jack's berth, head against the ship's side as in every outside cabin."},{id:"c307-lamp",room:"cabin-307",type:"bunkLamp",x:-7.45,z:-18.6,rot:-Ue,reason:"Bedside reading lamp \u2014 the practical light that keeps the cabin readable."},{id:"c307-wardrobe",room:"cabin-307",type:"wardrobe",x:-6.9,z:-15.8,rot:0,reason:"Built-in wardrobe beside the cabin door."},{id:"c307-desk",room:"cabin-307",type:"cabinDesk",x:-6.2,z:-20.1,rot:0,reason:"Writing desk in the forward corner, clear of the door and the berth."},{id:"c307-chair",room:"cabin-307",type:"cabinChair",x:-6.2,z:-19.3,rot:Math.PI,reason:"Desk chair belonging to the writing desk."},{id:"c307-rack",room:"cabin-307",type:"luggageRack",x:-5.2,z:-15.7,rot:0,reason:"Folding luggage rack \u2014 cabins have no floor space for trunks."},{id:"c307-case",room:"cabin-307",type:"suitcase",x:-5.2,z:-15.7,y:.52,rot:.2,reason:"Jack's case, still on the rack from embarkation."},{id:"c307-mirror",room:"cabin-307",type:"mirrorSmall",x:-2.05,z:-17.4,rot:-Ue,reason:"Cabin mirror with a live reflection \u2014 the third of the three real mirrors."},{id:"c307-ceillamp",room:"cabin-307",type:"ceilingLamp",x:-5.2,z:-17.4,reason:"Cabin deckhead lamp."},{id:"b307-shower",room:"bath-307",type:"shower",x:-4.1,z:-20.4,rot:0,reason:"The shower Jack is using when the ship strikes."},{id:"b307-basin",room:"bath-307",type:"washbasin",x:-2.35,z:-20.4,rot:-Ue,reason:"Wash basin against the partition, plumbing shared with the shower."},{id:"b307-toilet",room:"bath-307",type:"toilet",x:-2.5,z:-18.7,rot:Math.PI,reason:"Water closet \u2014 a compact ensuite needs all three fittings in 2.7 m."},{id:"b307-towel",room:"bath-307",type:"towelRail",x:-4.6,z:-18.45,rot:0,reason:"Towel rail beside the bathroom door."},{id:"b307-lamp",room:"bath-307",type:"ceilingLamp",x:-3.3,z:-19.6,variant:3,reason:"Bulkhead lamp over the basin."},{id:"pump-control",room:"d2-control",type:"pumpControlPanel",x:5.4,z:-12.6,rot:Math.PI,reason:"Bilge and ballast pump control \u2014 the panel Jack must restart after the impact."},{id:"d2-switchboard",room:"d2-control",type:"switchboard",x:7.45,z:-9.4,rot:-Ue,reason:"Emergency switchboard feeding the lighting ring main."},{id:"d2-gauges",room:"d2-control",type:"gaugePanel",x:2.1,z:-11,rot:Ue,reason:"Tank and bilge level gauges, read from the control desk."},{id:"d2-chair",room:"d2-control",type:"cabinChair",x:5,z:-11.2,rot:0,reason:"Watchkeeper's chair at the control desk."},{id:"d2-worklamp-1",room:"d2-control",type:"workLamp",x:4,z:-12.9,reason:"Caged work lamp over the control panel."},{id:"d2-worklamp-2",room:"d2-control",type:"workLamp",x:6,z:-6,reason:"Caged work lamp at the door end of the control room."},{id:"d2-beacon",room:"d2-control",type:"warningBeacon",x:2.2,z:-4.4,reason:"Rotating warning beacon that lights when the pumps trip."},{id:"d2-control-sign",room:"d2-control",type:"deckSign",x:2.05,z:-8.8,rot:Ue,text:"sign.pump-control",reason:"Door sign for the pump and control room."},{id:"d2-mess-table",room:"d2-mess",type:"salonTable",x:-4.6,z:-9,variant:1,reason:"Crew mess table with fixed benches."},{id:"d2-mess-rack",room:"d2-mess",type:"shelfRack",x:-7.45,z:-12,rot:Ue,reason:"Mess stores rack."},{id:"d2-mess-lamp",room:"d2-mess",type:"ceilingLamp",x:-4.6,z:-9,reason:"Mess lighting."},{id:"d2-corr-lamp-1",room:"d2-corridor",type:"workLamp",x:0,z:-11,reason:"Service corridor lighting at 5 m spacing."},{id:"d2-corr-lamp-2",room:"d2-corridor",type:"workLamp",x:0,z:-6,reason:"Service corridor lighting at 5 m spacing."},{id:"d2-corr-lamp-3",room:"d2-corridor",type:"workLamp",x:0,z:-1,reason:"Service corridor lighting at 5 m spacing."},{id:"d2-corr-strip",room:"d2-corridor",type:"emergencyStrip",x:0,z:-7,reason:"Low-level emergency lighting strip: the deck edge stays visible with all power off."},{id:"d2-corr-sign",room:"d2-corridor",type:"deckSign",x:0,z:3.85,rot:0,text:"sign.d2-junction",reason:"Junction sign at the stair landing: pump control forward to starboard."},{id:"d2-fire",room:"d2-corridor",type:"fireStation",x:-1.6,z:-4,rot:Ue,reason:"Fire station in the service corridor."},{id:"gal-rail-p",room:"d2-gallery",type:"catwalkRail",x:-5.4,z:23.2,rot:0,reason:"Guardrail around the engine room light well, port side."},{id:"gal-rail-s",room:"d2-gallery",type:"catwalkRail",x:5.4,z:23.2,rot:0,reason:"Guardrail around the engine room light well, starboard side."},{id:"gal-rail-f",room:"d2-gallery",type:"catwalkRail",x:0,z:18.2,rot:Ue,reason:"Guardrail across the forward end of the light well."},{id:"gal-rail-a",room:"d2-gallery",type:"catwalkRail",x:0,z:28.2,rot:Ue,reason:"Guardrail across the after end of the light well."},{id:"gal-pipes-p",room:"d2-gallery",type:"pipeRun",x:-6.9,z:21,rot:0,reason:"Steam and fuel lines running along the gallery to the funnel casing."},{id:"gal-pipes-s",room:"d2-gallery",type:"pipeRun",x:6.9,z:21,rot:0,reason:"Steam and fuel lines running along the gallery to the funnel casing."},{id:"gal-lamp-1",room:"d2-gallery",type:"workLamp",x:-6.6,z:19,reason:"Caged gallery lamp."},{id:"gal-lamp-2",room:"d2-gallery",type:"workLamp",x:6.6,z:19,reason:"Caged gallery lamp."},{id:"gal-lamp-3",room:"d2-gallery",type:"workLamp",x:-6.6,z:27,reason:"Caged gallery lamp."},{id:"gal-lamp-4",room:"d2-gallery",type:"workLamp",x:6.6,z:27,reason:"Caged gallery lamp."},{id:"gal-beacon",room:"d2-gallery",type:"warningBeacon",x:0,z:16.6,reason:"Warning beacon at the watertight door into the machinery casing."},{id:"engine-p",room:"engine-room",type:"mainEngine",x:-3.6,z:24,reason:"Port main engine on its seating, driving the port shaft."},{id:"engine-s",room:"engine-room",type:"mainEngine",x:3.6,z:24,reason:"Starboard main engine on its seating, driving the starboard shaft."},{id:"gen-1",room:"engine-room",type:"generatorSet",x:-6.2,z:18.4,rot:Ue,reason:"Auxiliary generator set number one \u2014 the ship's electrical supply."},{id:"gen-2",room:"engine-room",type:"generatorSet",x:-6.2,z:21.4,rot:Ue,reason:"Auxiliary generator set number two."},{id:"gen-3",room:"engine-room",type:"generatorSet",x:6.2,z:18.4,rot:-Ue,reason:"Auxiliary generator set number three."},{id:"eng-valves-1",room:"engine-room",type:"valveManifold",x:6.4,z:22.6,rot:-Ue,reason:"Sea water and bilge suction manifold on the starboard side."},{id:"eng-valves-2",room:"engine-room",type:"valveManifold",x:-6.4,z:27,rot:Ue,reason:"Fuel transfer manifold aft on the port side."},{id:"eng-pipes-1",room:"engine-room",type:"pipeRun",x:-7.1,z:23,rot:0,variant:1,reason:"Main steam range running fore and aft along the ship's side."},{id:"eng-pipes-2",room:"engine-room",type:"pipeRun",x:7.1,z:26,rot:0,variant:1,reason:"Bilge main running fore and aft along the ship's side."},{id:"eng-gauges",room:"engine-room",type:"gaugePanel",x:-4,z:16.5,rot:0,variant:1,reason:"Engine room gauge board on the forward bulkhead, clear of the doorway."},{id:"eng-bench",room:"engine-room",type:"workbench",x:-2,z:29.4,rot:Math.PI,reason:"Engineers' workbench at the after end of the space."},{id:"eng-tools",room:"engine-room",type:"toolBoard",x:-2,z:29.85,rot:Math.PI,reason:"Tool board over the workbench."},{id:"eng-beacon-1",room:"engine-room",type:"warningBeacon",x:0,z:16.6,reason:"Warning beacon at the watertight door."},{id:"eng-beacon-2",room:"engine-room",type:"warningBeacon",x:0,z:29.9,reason:"Warning beacon at the shaft tunnel door."},{id:"eng-lamp-1",room:"engine-room",type:"workLamp",x:-6.8,z:17.6,reason:"Caged machinery lamp."},{id:"eng-lamp-2",room:"engine-room",type:"workLamp",x:6.8,z:17.6,reason:"Caged machinery lamp."},{id:"eng-lamp-3",room:"engine-room",type:"workLamp",x:-6.8,z:25,reason:"Caged machinery lamp."},{id:"eng-lamp-4",room:"engine-room",type:"workLamp",x:6.8,z:25,reason:"Caged machinery lamp."},{id:"eng-lamp-5",room:"engine-room",type:"workLamp",x:0,z:21,reason:"Caged machinery lamp on the centreline."},{id:"eng-sign",room:"engine-room",type:"deckSign",x:0,z:16.35,rot:0,text:"sign.engine",reason:"Sign at the machinery space door."},{id:"shaft-p",room:"shaft-tunnel",type:"shaftLine",x:-2.2,z:32,reason:"Port propeller shaft running aft to the stern gland."},{id:"shaft-s",room:"shaft-tunnel",type:"shaftLine",x:2.2,z:32,reason:"Starboard propeller shaft running aft to the stern gland."},{id:"containment",room:"shaft-tunnel",type:"sealedHatch",x:0,z:33.8,rot:0,reason:"The welded plate over the after peak. It is what the impact tears open, and what wakes."},{id:"shaft-lamp-1",room:"shaft-tunnel",type:"workLamp",x:0,z:31,variant:1,reason:"Single caged lamp \u2014 this space is normally unmanned."},{id:"shaft-lamp-2",room:"shaft-tunnel",type:"workLamp",x:0,z:33.2,variant:1,reason:"Second caged lamp at the after bulkhead."},{id:"bilge-1",room:"d1-pump",type:"bilgePump",x:3.4,z:-11.4,rot:0,reason:"Number one bilge pump \u2014 the machine the control room panel starts."},{id:"bilge-2",room:"d1-pump",type:"bilgePump",x:5.6,z:-11.4,rot:0,reason:"Number two bilge pump, the standby unit."},{id:"pump-valves",room:"d1-pump",type:"valveManifold",x:7.45,z:-8.2,rot:-Ue,reason:"Bilge suction manifold \u2014 each valve serves one compartment."},{id:"pump-pipes",room:"d1-pump",type:"pipeRun",x:2.4,z:-8.8,rot:0,reason:"Suction lines running from the manifold aft into the machinery space."},{id:"pump-gauges",room:"d1-pump",type:"gaugePanel",x:4.4,z:-13.4,rot:Math.PI,reason:"Pump discharge pressure gauges."},{id:"pump-lamp-1",room:"d1-pump",type:"workLamp",x:4.4,z:-12,reason:"Caged work lamp over the pumps."},{id:"pump-lamp-2",room:"d1-pump",type:"workLamp",x:5.4,z:-5.6,reason:"Caged work lamp at the door end."},{id:"pump-sign",room:"d1-pump",type:"deckSign",x:2.05,z:-8.8,rot:Ue,text:"sign.pump",reason:"Sign at the pump room watertight door."},{id:"wk-bench",room:"d1-workshop",type:"workbench",x:-5.4,z:-13.2,rot:Math.PI,reason:"Engineers' workshop bench."},{id:"wk-tools",room:"d1-workshop",type:"toolBoard",x:-5.4,z:-13.5,rot:Math.PI,reason:"Tool board over the bench."},{id:"wk-crate-1",room:"d1-workshop",type:"crate",x:-7,z:-6,rot:.3,reason:"Spare-gear crate stowed clear of the walking route."},{id:"wk-crate-2",room:"d1-workshop",type:"crate",x:-6.4,z:-5,rot:-.2,reason:"Spare-gear crate stowed clear of the walking route."},{id:"wk-rack",room:"d1-workshop",type:"shelfRack",x:-2.4,z:-11,rot:-Ue,reason:"Stores rack on the inboard bulkhead."},{id:"wk-lamp-1",room:"d1-workshop",type:"workLamp",x:-5.4,z:-11.6,reason:"Caged workshop lamp."},{id:"wk-lamp-2",room:"d1-workshop",type:"workLamp",x:-4.4,z:-5.6,reason:"Caged workshop lamp."},{id:"d1-corr-lamp-1",room:"d1-corridor",type:"workLamp",x:0,z:-11,reason:"Machinery flat lighting at 5 m spacing."},{id:"d1-corr-lamp-2",room:"d1-corridor",type:"workLamp",x:0,z:-6,reason:"Machinery flat lighting at 5 m spacing."},{id:"d1-corr-lamp-3",room:"d1-corridor",type:"workLamp",x:0,z:-1,reason:"Machinery flat lighting at 5 m spacing."},{id:"d1-corr-strip",room:"d1-corridor",type:"emergencyStrip",x:0,z:-7,reason:"Low-level emergency lighting strip along the machinery flat."},{id:"d1-corr-sign",room:"d1-corridor",type:"deckSign",x:0,z:3.85,rot:0,text:"sign.d1-junction",reason:"Junction sign at the stair foot: machinery aft, pump room forward to starboard."},{id:"d1-pipes",room:"d1-corridor",type:"pipeRun",x:-1.5,z:-8,rot:0,variant:2,reason:"Pipe chase along the deckhead of the machinery flat."}];function Xx(){let i=[];return[-19.6,-15,-10.4,-5.8,-1.2,2.4].forEach((s,o)=>{i.push({id:`d3-lamp-${o}`,room:"d3-corridor-fwd",type:"ceilingLamp",x:0,z:s,reason:"Alleyway deckhead lamp, one between each pair of cabin doors."})}),[17.4,21.4].forEach((s,o)=>{i.push({id:`d3-lamp-aft-${o}`,room:"d3-corridor-aft",type:"ceilingLamp",x:0,z:s,reason:"Alleyway deckhead lamp in the after cabin passage."})}),i.push({id:"d3-strip",room:"d3-corridor-fwd",type:"emergencyStrip",x:0,z:-9,reason:"Low-level emergency strip so the alleyway floor stays visible when the lights fail."}),[-1.6,1.6].forEach((s,o)=>{i.push({id:`d3-rail-${o}`,room:"d3-corridor-fwd",type:"handrail",x:s,z:-9,rot:s<0?Math.PI/2:-Math.PI/2,reason:"Alleyway handrail \u2014 required on a ship that rolls, and a reading cue for the corridor axis."})}),[["cabin-301",-6.1,-3.6,1],["cabin-302",6.1,-3.6,-1],["cabin-303",-6.1,-8.2,1],["cabin-304",6.1,-8.2,-1],["cabin-305",-6.1,-12.8,1],["cabin-306",6.1,-12.8,-1],["cabin-308",6.1,-18.2,-1]].forEach(([s,o,a,c])=>{i.push({id:`${s}-bed`,room:s,type:"bed",x:o,z:a,rot:c>0?Math.PI/2:-Math.PI/2,reason:"Berth against the ship's side, the standard outside-cabin arrangement."}),i.push({id:`${s}-wardrobe`,room:s,type:"wardrobe",x:o+c*-1,z:a+1.6,rot:0,reason:"Built-in wardrobe beside the cabin door."}),i.push({id:`${s}-lamp`,room:s,type:"ceilingLamp",x:o+c*1.2,z:a,reason:"Cabin deckhead lamp."})}),[-16,-6,4,14].forEach((s,o)=>{["port","stbd"].forEach(a=>{let c=a==="port"?-1:1;i.push({id:`lifeboat-${a}-${o}`,room:a==="port"?"boat-port":"boat-stbd",type:"lifeboat",x:c*6.6,z:s,rot:0,reason:`Lifeboat number ${o*2+(a==="port"?1:2)} in its davits \u2014 the boats Jack is trying to reach.`}),i.push({id:`davit-${a}-${o}-f`,room:a==="port"?"boat-port":"boat-stbd",type:"davit",x:c*7.9,z:s-2.1,rot:a==="port"?Math.PI/2:-Math.PI/2,reason:"Forward davit arm carrying the boat's falls."}),i.push({id:`davit-${a}-${o}-a`,room:a==="port"?"boat-port":"boat-stbd",type:"davit",x:c*7.9,z:s+2.1,rot:a==="port"?Math.PI/2:-Math.PI/2,reason:"After davit arm carrying the boat's falls."})})}),[-20,17].forEach((s,o)=>{["port","stbd"].forEach(a=>{let c=a==="port"?-1:1;i.push({id:`d5-vent-${a}-${o}`,room:a==="port"?"boat-port":"boat-stbd",type:"ventilator",x:c*4.4,z:s,reason:"Cowl ventilator serving the accommodation below the boat deck."})})}),["port","stbd"].forEach(s=>{let o=s==="port"?-1:1;[-12,0,12,22].forEach((a,c)=>{i.push({id:`d5-lamp-${s}-${c}`,room:s==="port"?"boat-port":"boat-stbd",type:"wallLamp",x:o*3.75,z:a,rot:s==="port"?-Math.PI/2:Math.PI/2,variant:1,reason:"Weatherproof lamp on the deckhouse side, lighting the boat embarkation area."})}),i.push({id:`d5-buoy-${s}`,room:s==="port"?"boat-port":"boat-stbd",type:"lifebuoy",x:o*8.25,z:9,rot:s==="port"?Math.PI/2:-Math.PI/2,reason:"Lifebuoy on the boat deck rail."})}),[["salon","glassware",-3,-8.4,0,"Bottle and glasses left on the card table."],["salon","glassware",3,-6.4,1,"A second round abandoned on the starboard table."],["salon","bookStack",-3.2,-3,0,"Books left on the aft card table."],["salon","hangingCoat",-5.85,-12.6,1.57,"A passenger's coat on the hook by the piano."],["salon","scatteredPapers",1.2,-2,0,"Sheet music dropped between the piano and the sofa."],["salon","foodTray",4.4,-9.8,0,"A supper tray the steward never came back for."],["foyer","openSuitcase",4,3.2,.4,"A case opened on the foyer floor and never repacked."],["foyer","hangingCoat",5.85,6.6,-1.57,"Coat on the foyer hook."],["foyer","scatteredPapers",-4.3,13,0,"Embarkation lists dropped at the purser's desk."],["foyer","lifeJacketRack",5.8,15.4,-1.57,"Life jacket rack by the after doors, as the drill card requires."],["d4-fwd-lobby","openSuitcase",-4.4,-18.6,-.3,"Luggage waiting to go down to the cabins."],["d4-fwd-lobby","bookStack",4.6,-17.4,0,"Books left on the bench."],["promenade-port","bucketAndMop",-6.6,-16,0,"A steward's bucket, left where the deck was being washed down."],["promenade-stbd","lifeJacketRack",6.35,2,1.57,"Life jacket rack on the promenade bulkhead."],["playroom","scatteredPapers",-3.6,20.6,0,"Children's drawings across the playroom floor."],["playroom","crumpledBlanket",-1.4,21.6,0,"A blanket dragged off the toy chest."],["playroom","foodTray",-5.2,18.2,0,"A nursery supper tray, half eaten."],["cabin-307","crumpledBlanket",-6.1,-17,0,"Jack's bunk, left unmade."],["cabin-307","hangingCoat",-7.45,-16.2,-1.57,"Jack's coat on the cabin hook."],["cabin-307","bookStack",-6.2,-20.1,0,"Books on the writing desk."],["cabin-307","openSuitcase",-5,-19.6,.5,"Jack's case, open on the cabin sole."],["d3-corridor-fwd","laundryCart",0,-20.6,.3,"Stewards' linen trolley, left at the end of the alleyway."],["d3-corridor-aft","bucketAndMop",-1.2,22.6,0,"Bucket at the after end of the alleyway."],["d3-linen","crumpledBlanket",-5.4,20.6,0,"Bedding waiting to be taken to the cabins."],["d2-mess","foodTray",-4.6,-9,0,"A crew supper left on the mess table."],["d2-mess","glassware",-6.4,-6.2,1,"Mugs on the mess sideboard."],["d2-mess","hangingCoat",-7.45,-11,-1.57,"A jacket on the mess hook."],["d2-control","scatteredPapers",4.2,-6.4,0,"Pump logs dropped when the watch left."],["d2-control","cableRun",3.4,-9.4,0,"Cable run along the deckhead from the switchboard."],["d2-corridor","cableRun",0,-9,1,"Cable run along the service corridor deckhead."],["d2-corridor","barrel",-1.2,-12.4,0,"A drum of lubricating oil, lashed at the end of the corridor."],["d1-corridor","cableRun",0,-4,1,"Cable run along the machinery flat deckhead."],["d1-corridor","bucketAndMop",1.2,-12.6,0,"Bucket in the machinery flat."],["d1-workshop","barrel",-7,-11.6,0,"Oil drum in the workshop."],["d1-workshop","scatteredPapers",-5.4,-8.6,0,"Work orders on the workshop deck."],["d1-pump","barrel",6.8,-12.8,0,"Drum of pump packing beside the bilge pumps."],["d1-pump","hangingChain",4.4,-6.8,0,"Lifting chain over the pump room, for changing an impeller."],["engine-room","hangingChain",-3.6,20,0,"Lifting chain over the port engine."],["engine-room","hangingChain",3.6,20,0,"Lifting chain over the starboard engine."],["engine-room","barrel",-7,28.6,0,"Waste oil drum at the after end of the machinery space."],["engine-room","cableRun",0,26,1,"Cable run across the engine room deckhead."],["engine-room","bucketAndMop",6.6,29.2,0,"Bucket by the engineers' bench."],["engine-room","openSuitcase",5.6,17.4,.8,"A toolbox left open by the watertight door."],["d2-gallery","cableRun",-6.9,24,0,"Cable run along the gallery."],["d2-gallery","barrel",6.8,17.4,0,"Drum stowed on the gallery."],["shaft-tunnel","hangingChain",-2.2,30.8,0,"Lifting chain over the port shaft bearing."],["shaft-tunnel","barrel",3.6,31,0,"A drum left in the shaft tunnel, rusted to the deck."],["chart-room","scatteredPapers",-3.4,-12.2,0,"Working charts dropped beside the table."],["chart-room","bookStack",-4.2,-13.5,0,"Sailing directions stacked on the chart table."],["captain-office","bookStack",4.4,-13.6,0,"The master's books on the writing desk."],["captain-office","glassware",4.4,-12.4,1,"A glass and a decanter on the office desk."],["captain-office","hangingCoat",6.25,-14.6,-1.57,"The master's coat on the office hook."],["wheelhouse","scatteredPapers",-2,-17.9,0,"The bridge log, dropped."],["d6-passage","lifeJacketRack",-1.6,-6,1.57,"Life jacket rack in the bridge passage."],["d5-house-fwd","lifeJacketRack",-3.25,-18,1.57,"Life jacket rack at the boat muster point."],["d5-house-fwd","openSuitcase",2,-13,-.4,"A case abandoned at the muster point."],["d5-house-aft","bucketAndMop",-2.6,22.6,0,"Bucket in the after deckhouse."],["d4-aft-svc","foodTray",4,21.6,0,"A tray in the pantry, waiting to go up."],["d4-aft-svc","glassware",2,18.6,1,"Glasses stacked in the pantry."],["d4-aft-svc","bucketAndMop",5.4,22.8,0,"Pantry bucket."]].forEach(([s,o,a,c,l,h],d)=>{i.push({id:`clutter-${d}-${o}`,room:s,type:o,x:a,z:c,rot:l,reason:h})}),i}var nu=[...Wx,...Xx()];var _t=(i,e,t)=>i<e?e:i>t?t:i,qx=(i,e,t)=>i+(e-i)*t,Jt=(i,e,t,n)=>qx(i,e,1-Math.exp(-t*n));var Zt=class{constructor(e){this.state=e>>>0}next(){this.state=this.state+1831565813>>>0;let e=this.state;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+this.next()*(t-e)}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)]}},iu=[];function Yt(i,e){let t=`[${i}] ${e}`;iu.push(t),console.warn(`THE CRYSTAL SHIP \xB7 ${t}`)}function ru(){return iu}function tn(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=i;let r=n.getContext("2d");if(!r)throw new Error("2D canvas unavailable");e(r,i,new Zt(t));let s=new Ut(n);return s.colorSpace=pt,s.magFilter=vt,s.minFilter=sa,s.wrapS=xn,s.wrapT=xn,s.anisotropy=1,s.generateMipmaps=!0,s}function Ri(i,e,t,n,r,s){for(let o=0;o<e;o+=1)for(let a=0;a<e;a+=1){let c=t.next();c<n*.5?(i.fillStyle=r,i.fillRect(a,o,1,1)):c>1-n*.5&&(i.fillStyle=s,i.fillRect(a,o,1,1))}}function rr(i,e,t){i.fillStyle=t,i.fillRect(0,0,e,e)}function ja(i,e,t,n,r,s,o){rr(i,e,n);let a=e/o;i.fillStyle=r;for(let c=0;c<=o;c+=1)i.fillRect(0,Math.round(c*a),e,1),i.fillRect(Math.round(c*a),0,1,e);i.fillStyle=s;for(let c=0;c<=o;c+=1)for(let l=0;l<o;l+=1)i.fillRect(Math.round(c*a)-1,Math.round(l*a+a*.5),2,2);Ri(i,e,t,.16,"rgba(20,26,28,0.35)","rgba(220,230,228,0.16)")}function su(i,e,t,n,r,s,o){rr(i,e,n);let a=e/o;for(let c=0;c<o;c+=1){let l=t.range(-.06,.06);i.fillStyle=l>0?"rgba(255,244,220,0.10)":"rgba(30,22,14,0.14)",i.fillRect(0,c*a,e,a),i.fillStyle=s,i.fillRect(0,Math.round(c*a),e,1),i.fillStyle=r;for(let h=0;h<5;h+=1){let d=c*a+t.range(1,a-1);i.fillRect(t.range(0,e),Math.round(d),t.range(4,e*.45),1)}}Ri(i,e,t,.1,"rgba(28,20,12,0.30)","rgba(240,226,196,0.12)")}function Fc(i,e,t,n,r,s){rr(i,e,n);let o=e/4;for(let a=0;a<4;a+=1)for(let c=0;c<4;c+=1)i.fillStyle=(c+a)%2===0?r:s,i.beginPath(),i.moveTo(c*o+o/2,a*o+3),i.lineTo(c*o+o-3,a*o+o/2),i.lineTo(c*o+o/2,a*o+o-3),i.lineTo(c*o+3,a*o+o/2),i.closePath(),i.fill();Ri(i,e,t,.34,"rgba(24,14,18,0.30)","rgba(226,206,190,0.14)")}function Bc(i,e,t,n,r,s,o){rr(i,e,n);for(let a=0;a<e;a+=8)i.fillStyle=t.next()>.5?o:"rgba(0,0,0,0)",i.fillRect(a,0,1,e);i.fillStyle=s,i.fillRect(0,Math.round(e*.72),e,Math.round(e*.28)),i.fillStyle=r,i.fillRect(0,Math.round(e*.7),e,3),i.fillRect(0,Math.round(e*.06),e,2),Ri(i,e,t,.14,"rgba(22,16,12,0.34)","rgba(236,222,196,0.12)")}function Oc(i,e,t,n,r,s){rr(i,e,n);let o=e/s;i.fillStyle=r;for(let a=0;a<=s;a+=1)i.fillRect(0,Math.round(a*o),e,1),i.fillRect(Math.round(a*o),0,1,e);for(let a=0;a<s*s*.35;a+=1)i.fillStyle=t.next()>.5?"rgba(255,255,255,0.07)":"rgba(60,80,84,0.10)",i.fillRect(t.int(0,s-1)*o+1,t.int(0,s-1)*o+1,o-1,o-1);Ri(i,e,t,.08,"rgba(40,52,54,0.28)","rgba(255,255,255,0.10)")}function Yx(i,e,t){rr(i,e,"#4d5a5e"),i.fillStyle="#232d31";for(let n=0;n<e;n+=8)i.fillRect(n,0,5,e);for(let n=0;n<e;n+=16)i.fillRect(0,n,e,3);i.fillStyle="rgba(150,168,170,0.30)";for(let n=0;n<e;n+=8)i.fillRect(n+5,0,1,e);Ri(i,e,t,.2,"rgba(14,20,22,0.5)","rgba(196,210,212,0.18)")}var Kx={carpetSalon:{tile:2.4,build:()=>new Le({map:tn(128,(i,e,t)=>Fc(i,e,t,"#5c2d33","#7d4a3c","#432028"),101),roughness:.96,metalness:0})},carpetCabin:{tile:2,build:()=>new Le({map:tn(128,(i,e,t)=>Fc(i,e,t,"#4c4234","#635542","#3b3226"),102),roughness:.97})},carpetCorridor:{tile:2,build:()=>new Le({map:tn(128,(i,e,t)=>Fc(i,e,t,"#40323a","#59444b","#33272d"),103),roughness:.97})},teakDeck:{tile:2.6,build:()=>new Le({map:tn(128,(i,e,t)=>su(i,e,t,"#8a7048","#4d3c22","#241a10",10),104),roughness:.88})},steelPlate:{tile:2.4,build:()=>new Le({map:tn(128,(i,e,t)=>ja(i,e,t,"#5a666b","#33403f","#8b989a",4),105),roughness:.72,metalness:.42})},steelGrate:{tile:1.6,build:()=>new Le({map:tn(128,(i,e,t)=>Yx(i,e,t),106),roughness:.6,metalness:.55})},tileBath:{tile:1.4,build:()=>new Le({map:tn(128,(i,e,t)=>Oc(i,e,t,"#9db3ad","#5e7772",8),107),roughness:.36,metalness:.08})},linoService:{tile:2.2,build:()=>new Le({map:tn(128,(i,e,t)=>Oc(i,e,t,"#6b6f63","#4a4f46",4),108),roughness:.82})},panelWood:{tile:2.6,build:()=>new Le({map:tn(128,(i,e,t)=>Bc(i,e,t,"#8b6a45","#c19a5c","#5d4128","rgba(60,40,22,0.22)"),109),roughness:.78})},panelCabin:{tile:2.4,build:()=>new Le({map:tn(128,(i,e,t)=>Bc(i,e,t,"#9a8d74","#b09a63","#584b3a","rgba(50,42,30,0.20)"),110),roughness:.84})},panelCorridor:{tile:2.4,build:()=>new Le({map:tn(128,(i,e,t)=>Bc(i,e,t,"#8d8676","#a8934f","#4c473c","rgba(48,44,34,0.22)"),111),roughness:.86})},paintedSteel:{tile:2.8,build:()=>new Le({map:tn(128,(i,e,t)=>ja(i,e,t,"#79837f","#4b5754","#a3aeaa",3),112),roughness:.8,metalness:.24})},hullSteel:{tile:3,build:()=>new Le({map:tn(128,(i,e,t)=>ja(i,e,t,"#4f5a60","#2e3a3e","#7d8a8e",3),113),roughness:.74,metalness:.5})},ceilingPanel:{tile:2,build:()=>new Le({map:tn(64,(i,e,t)=>Oc(i,e,t,"#a49c8c","#7d7768",4),114),roughness:.94})},ceilingSteel:{tile:2.4,build:()=>new Le({map:tn(64,(i,e,t)=>ja(i,e,t,"#69736f","#414c49","#8f9a96",2),115),roughness:.86,metalness:.2})},ceilingWood:{tile:2.6,build:()=>new Le({map:tn(64,(i,e,t)=>su(i,e,t,"#9a8258","#5a462a","#33261a",6),116),roughness:.9})},playroomWall:{tile:2.2,build:()=>new Le({map:tn(128,(i,e,t)=>{rr(i,e,"#8fa3a0"),i.fillStyle="#c9b06a",i.fillRect(0,Math.round(e*.42),e,Math.round(e*.16)),i.fillStyle="#6e8a86";for(let n=0;n<6;n+=1){let r=n*(e/6)+4;i.fillRect(r,Math.round(e*.46),8,8),i.fillRect(r+3,Math.round(e*.44),3,3)}i.fillStyle="rgba(70,60,48,0.20)";for(let n=0;n<30;n+=1)i.fillRect(t.range(0,e),t.range(0,e),t.range(2,9),t.range(1,4));Ri(i,e,t,.16,"rgba(30,40,40,0.30)","rgba(230,236,230,0.14)")},117),roughness:.9})},playroomFloor:{tile:1.8,build:()=>new Le({map:tn(128,(i,e,t)=>{let n=e/4;for(let r=0;r<4;r+=1)for(let s=0;s<4;s+=1)i.fillStyle=(s+r)%2===0?"#7e6f56":"#6a7a72",i.fillRect(s*n,r*n,n,n);Ri(i,e,t,.22,"rgba(28,26,20,0.34)","rgba(226,222,206,0.12)")},118),roughness:.92})}},ou=new Map;function $x(i){return i.map?(i.emissiveMap=i.map,i.emissive=new ot(.115,.12,.125)):i.emissive=i.color.clone().multiplyScalar(.1),i.emissiveIntensity=1,i}function Jn(i){let e=ou.get(i);if(!e){let t=Kx[i];e={tile:t.tile,material:$x(t.build())},ou.set(i,e)}return e}var w={brass:new Le({color:11570250,roughness:.34,metalness:.78,flatShading:!0}),steel:new Le({color:7371904,roughness:.48,metalness:.62,flatShading:!0}),darkSteel:new Le({color:4147790,roughness:.56,metalness:.6,flatShading:!0}),paintedRed:new Le({color:10107696,roughness:.62,flatShading:!0}),paintedGreen:new Le({color:4880988,roughness:.62,flatShading:!0}),paintedWhite:new Le({color:13159362,roughness:.7,flatShading:!0}),wood:new Le({color:7031340,roughness:.74,flatShading:!0}),darkWood:new Le({color:4862496,roughness:.78,flatShading:!0}),velvet:new Le({color:7155768,roughness:.95,flatShading:!0}),linen:new Le({color:13616816,roughness:.96,flatShading:!0}),porcelain:new Le({color:14474452,roughness:.3,metalness:.04,flatShading:!0}),rubber:new Le({color:2830129,roughness:.95,flatShading:!0}),canvasCover:new Le({color:9276018,roughness:.9,flatShading:!0}),glass:new Le({color:10470604,roughness:.06,metalness:.1,transparent:!0,opacity:.24,side:Gt}),lampGlass:new Le({color:16771261,emissive:16764807,emissiveIntensity:2.1,roughness:.3}),warningLamp:new Le({color:13851194,emissive:12597790,emissiveIntensity:1.5,roughness:.4}),instrumentGlow:new Le({color:7321994,emissive:4165474,emissiveIntensity:1.4,roughness:.4})};for(let[i,e]of Object.entries(w)){if(i==="lampGlass"||i==="warningLamp"||i==="instrumentGlow"||i==="glass")continue;let t=e;t.emissive=t.color.clone().multiplyScalar(.1),t.emissiveIntensity=1}function jx(i,e){let n=document.createElement("canvas");n.width=64,n.height=64;let r=n.getContext("2d"),s=new Zt(e);r.clearRect(0,0,64,64);let o=(c,l,h,d)=>{let u=r.createRadialGradient(c,l,0,c,l,h);u.addColorStop(0,d),u.addColorStop(1,d.replace(/[\d.]+\)$/,"0)")),r.fillStyle=u,r.beginPath(),r.arc(c,l,h,0,Math.PI*2),r.fill()};switch(i){case"rust":{o(64/2,10,9,"rgba(122,66,32,0.85)");for(let c=0;c<26;c+=1){let l=32+s.range(-9,9),h=s.range(1,3),d=s.range(10,48),u=s.range(.18,.6);r.fillStyle=`rgba(${Math.round(s.range(110,150))},${Math.round(s.range(58,82))},${Math.round(s.range(24,44))},${u.toFixed(2)})`,r.fillRect(l,8,h,d)}for(let c=0;c<60;c+=1)r.fillStyle=`rgba(96,52,26,${s.range(.1,.45).toFixed(2)})`,r.fillRect(s.range(16,48),s.range(6,58),1,s.range(1,4));break}case"stain":{for(let c=3;c>=0;c-=1){let l=10+c*6;r.strokeStyle=`rgba(94,74,46,${(.1+c*.06).toFixed(2)})`,r.lineWidth=s.range(1,2.5),r.beginPath();for(let h=0;h<=Math.PI*2+.1;h+=.3){let d=l*s.range(.86,1.14),u=64/2+Math.cos(h)*d,f=64/2+Math.sin(h)*d*.85;h===0?r.moveTo(u,f):r.lineTo(u,f)}r.stroke()}o(64/2,64/2,20,"rgba(86,68,44,0.4)");break}case"mould":{for(let c=0;c<190;c+=1){let l=s.range(0,64),h=s.range(0,64),d=Math.min(l,h,64-l,64-h)/(64/2);s.next()>d*1.3||(r.fillStyle=`rgba(${Math.round(s.range(28,58))},${Math.round(s.range(38,64))},${Math.round(s.range(30,46))},${s.range(.25,.7).toFixed(2)})`,r.fillRect(l,h,s.range(1,4),s.range(1,4)))}break}case"scuff":{for(let c=0;c<22;c+=1){let l=s.range(6,58);r.fillStyle=`rgba(${Math.round(s.range(40,80))},${Math.round(s.range(40,78))},${Math.round(s.range(38,72))},${s.range(.12,.4).toFixed(2)})`,r.fillRect(s.range(0,64*.5),l,s.range(10,64*.7),s.range(1,3))}break}case"salt":{for(let c=0;c<150;c+=1)r.fillStyle=`rgba(226,230,224,${s.range(.1,.42).toFixed(2)})`,r.fillRect(s.range(0,64),s.range(0,64),s.range(1,3),s.range(1,3));o(64/2,64/2,26,"rgba(214,220,214,0.18)");break}case"soot":{o(64/2,64*.62,26,"rgba(16,14,12,0.7)");for(let c=0;c<40;c+=1)r.fillStyle=`rgba(20,18,16,${s.range(.1,.45).toFixed(2)})`,r.fillRect(s.range(8,56),s.range(4,64*.7),s.range(2,8),s.range(4,20));break}case"wear":default:{o(64/2,64/2,28,"rgba(52,44,36,0.34)");for(let c=0;c<70;c+=1)r.fillStyle=`rgba(70,60,50,${s.range(.08,.3).toFixed(2)})`,r.fillRect(s.range(6,58),s.range(6,58),s.range(2,7),s.range(2,6));break}}let a=new Ut(n);return a.colorSpace=pt,a.magFilter=vt,a.minFilter=yn,a}var au=new Map;function Za(i){let e=au.get(i);return e||(e=new Le({map:jx(i,5e3+i.length*37+i.charCodeAt(0)*11),transparent:!0,opacity:1,roughness:.95,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:Gt}),au.set(i,e)),e}var F=(i,e,t,n)=>new K(new tt(i,e,t),n),Ee=(i,e,t,n,r)=>new K(new $e(i,e,t,n),r),vn=(i,e,t,n=6,r=12)=>new K(new fn(i,e,n,r),t),sn=(i,e,t=7,n=5)=>new K(new qt(i,t,n),e);function R(i,e,t,n){return i.position.set(e,t,n),i}function Oe(...i){let e=new pe;return i.forEach(t=>e.add(t)),e}var qe=(i,e,t,n=0)=>({x1:-i/2,x2:i/2,z1:-e/2,z2:e/2,y1:n,y2:n+t});function Zx(i,e=256,t=64,n="#16262b",r="#e6dcb4",s="#b08c4a"){let o=document.createElement("canvas");o.width=e,o.height=t;let a=o.getContext("2d");a.fillStyle=n,a.fillRect(0,0,e,t),a.strokeStyle=s,a.lineWidth=Math.max(2,t*.07),a.strokeRect(a.lineWidth,a.lineWidth,e-a.lineWidth*2,t-a.lineWidth*2),a.fillStyle=r,a.textAlign="center",a.textBaseline="middle";let c=Math.floor(t/Math.max(1,i.length)*.52);a.font=`bold ${c}px monospace`,i.forEach((h,d)=>{a.fillText(h,e/2,t*((d+.5)/i.length),e*.9)});let l=new Ut(o);return l.colorSpace=pt,l.magFilter=vt,l.minFilter=yn,l}var lu=new Map;function sr(i,e,t){let n=`${i}|${(t/e).toFixed(3)}`,r=lu.get(n);if(!r){let s=Zx(i.split(`
`),256,Math.max(64,Math.round(256*t/e)));r=new Le({map:s,roughness:.7,emissive:2761752,emissiveIntensity:.35}),lu.set(n,r)}return new K(new At(e,t),r)}var cu=new Map;function Ci(i,e=12,t="#cfd8c6"){let n=`${e}|${t}`,r=cu.get(n);if(r)return new K(new Ht(i,12),r);let s=document.createElement("canvas");s.width=64,s.height=64;let o=s.getContext("2d");o.fillStyle="#20282a",o.fillRect(0,0,64,64),o.fillStyle=t,o.beginPath(),o.arc(32,32,29,0,Math.PI*2),o.fill(),o.strokeStyle="#1b2224",o.lineWidth=2;for(let l=0;l<e;l+=1){let h=l/e*Math.PI*2;o.beginPath(),o.moveTo(32+Math.cos(h)*24,32+Math.sin(h)*24),o.lineTo(32+Math.cos(h)*28,32+Math.sin(h)*28),o.stroke()}o.strokeStyle="#9a2f22",o.lineWidth=3,o.beginPath(),o.moveTo(32,32),o.lineTo(32+Math.cos(-1.1)*20,32+Math.sin(-1.1)*20),o.stroke();let a=new Ut(s);a.colorSpace=pt,a.magFilter=vt;let c=new Le({map:a,roughness:.4,emissive:1845792,emissiveIntensity:.5});return cu.set(n,c),new K(new Ht(i,12),c)}var Jx=()=>{let i=R(Ee(.16,.26,.92,8,w.darkSteel),0,.46,0),e=R(Ee(.12,.12,.16,8,w.brass),0,1.02,0);e.rotation.x=Math.PI/2;let t=R(vn(.44,.045,w.wood,6,20),0,1.02,0),n=Oe(i,e,t);for(let r=0;r<8;r+=1){let s=R(F(.045,.86,.045,w.wood),0,1.02,0);s.rotation.z=r/8*Math.PI,n.add(s);let o=r/8*Math.PI*2;n.add(R(Ee(.03,.04,.14,6,w.wood),Math.cos(o)*.5,1.02+Math.sin(o)*.5,0))}return n.userData.spin="helm",{object:n,colliders:[qe(.6,.5,1.1)],animate:"helm"}},Qx=()=>{let i=Oe(R(Ee(.14,.22,.98,8,w.brass),0,.49,0),R(Ee(.24,.24,.2,10,w.brass),0,1.08,0)),e=R(Ci(.2,8),0,1.08,.11);i.add(e);let t=R(F(.05,.46,.05,w.darkSteel),0,1.24,.14);return t.rotation.z=-.4,i.add(t),{object:i,colliders:[qe(.44,.4,1.2)]}},eb=()=>{let i=Oe(R(Ee(.2,.28,.96,8,w.wood),0,.48,0),R(sn(.24,w.brass,10,6),0,1.08,0)),e=R(Ci(.17,16,"#e2e6d2"),0,1.2,0);return e.rotation.x=-Math.PI/2,i.add(e),i.add(R(sn(.11,w.paintedRed,8,6),-.34,1.02,0)),i.add(R(sn(.11,w.paintedRed,8,6),.34,1.02,0)),{object:i,colliders:[qe(.6,.5,1.3)]}},tb=()=>{let i=R(F(.72,.62,.5,w.darkSteel),0,1.24,0),e=R(F(.66,.14,.24,w.darkSteel),0,1.5,.2),t=R(new K(new Ht(.21,14),w.instrumentGlow),0,1.24,.26),n=R(F(.5,.94,.42,w.steel),0,.47,0),r=Oe(n,i,e,t);return r.userData.sweep=t,{object:r,colliders:[qe(.8,.6,1.6)],animate:"radar",lights:[]}},nb=({variant:i})=>{let e=i===1?.75:1,t=R(F(.62*e,.44*e,.34*e,w.darkSteel),0,1.06,0),n=R(i===1?F(.5,.84,.4,w.darkWood):F(.56,.84,.4,w.steel),0,.42,0),r=Oe(n,t);for(let o=0;o<3;o+=1)r.add(R(Ee(.05*e,.05*e,.04,8,w.brass),(-.18+o*.18)*e,1,.18*e));r.add(R(F(.3*e,.1*e,.02,w.instrumentGlow),0,1.18*e,.18*e));let s=R(F(.08,.2,.08,w.rubber),.24*e,1.28,0);return r.add(s),{object:r,colliders:[qe(.7*e,.5,1.3)]}},ib=()=>{let i=R(F(2.1,.82,.7,w.darkSteel),0,.41,0),e=R(F(2.2,.1,.78,w.steel),0,.87,-.04);e.rotation.x=.16;let t=Oe(i,e);for(let n=0;n<4;n+=1)t.add(R(Ci(.09,8),-.72+n*.48,.94,-.3));for(let n=0;n<5;n+=1)t.add(R(F(.06,.05,.12,n%2?w.paintedRed:w.paintedGreen),-.5+n*.25,.9,.08));return{object:t,colliders:[qe(2.2,.8,.95)]}},rb=({variant:i})=>{let e=i===1?1.6:1,t=R(F(e,.9,.12,w.darkSteel),0,1.5,0),n=Oe(t),r=i===1?5:3;for(let s=0;s<r;s+=1)for(let o=0;o<2;o+=1)n.add(R(Ci(.11,10),-e/2+e/r*(s+.5),1.28+o*.42,.07));return{object:n,colliders:[{x1:-e/2,x2:e/2,z1:-.09,z2:.09,y1:.9,y2:2}]}},sb=()=>{let i=Oe(R(F(.5,.66,.14,w.darkSteel),0,1.5,0));return[w.paintedRed,w.paintedGreen,w.paintedWhite,w.paintedWhite].forEach((t,n)=>{let r=R(sn(.05,t,6,4),-.14+n%2*.28,1.68-Math.floor(n/2)*.3,.09);i.add(r)}),{object:i,colliders:[{x1:-.25,x2:.25,z1:-.09,z2:.09,y1:1.15,y2:1.85}]}},ob=({variant:i})=>{let e=R(F(1.9,.09,1.05,i===1?w.darkWood:w.wood),0,.92,0),t=Oe(e);if([-.85,.85].forEach(n=>[-.42,.42].forEach(r=>t.add(R(F(.1,.9,.1,w.darkWood),n,.45,r)))),i===1)t.add(R(F(1.7,.42,.5,w.darkWood),0,.66,-.2)),t.add(R(F(.22,.05,.3,w.linen),.5,.98,.1));else{let n=R(new K(new At(1.5,.85),w.linen),0,.97,0);n.rotation.x=-Math.PI/2,t.add(n),t.add(R(F(.02,.02,.18,w.paintedRed),.2,.99,.1))}return{object:t,colliders:[qe(2,1.1,1)]}},ab=()=>{let i=Oe(R(F(1.5,.6,.34,w.darkWood),0,1.6,0));for(let e=0;e<7;e+=1){let t=R(Ee(.05,.05,.5,6,w.linen),-.6+e*.2,1.6,.14);t.rotation.x=Math.PI/2,i.add(t)}return{object:i,colliders:[{x1:-.75,x2:.75,z1:-.2,z2:.2,y1:1.28,y2:1.92}]}},lb=()=>{let i=Oe(R(Ee(.16,.16,.08,12,w.brass),0,1.55,0));return i.children[0].rotation.x=Math.PI/2,i.add(R(Ci(.13,12),0,1.55,.05)),i.add(R(F(.06,.3,.06,w.darkWood),0,1.28,0)),{object:i,colliders:[]}},cb=()=>{let i=Oe(R(Ee(.19,.19,.07,10,w.darkWood),0,.62,0),R(Ee(.05,.07,.6,8,w.steel),0,.3,0));return i.add(R(vn(.16,.02,w.steel,4,10),0,.18,0)),{object:i,colliders:[qe(.42,.42,.66)]}},hb=()=>{let i=R(F(2.2,.5,5.4,w.darkSteel),0,.25,0),e=R(F(1.7,1.9,5,w.steel),0,1.45,0),t=Oe(i,e);for(let s=0;s<6;s+=1){let o=-2+s*.8;t.add(R(F(1.2,.5,.62,w.darkSteel),0,2.6,o)),t.add(R(Ee(.16,.16,.9,8,w.paintedRed),.86,2.9,o)),t.add(R(sn(.1,w.brass,6,4),-.5,2.9,o))}let n=R(Ee(.3,.3,2.6,8,w.paintedRed),.86,4.2,0);t.add(n),t.add(R(F(1.9,.1,5.2,w.steel),0,2.9,0));let r=R(Ee(.7,.7,.24,12,w.darkSteel),0,1.1,2.8);return r.rotation.x=Math.PI/2,t.add(r),t.userData.flywheel=r,{object:t,colliders:[qe(2.4,5.6,3.2)],animate:"engine"}},db=()=>{let i=R(F(2.6,.34,1.1,w.darkSteel),0,.17,0),e=R(F(1.5,.9,.9,w.steel),-.5,.79,0),t=R(Ee(.46,.46,1,10,w.paintedGreen),.85,.8,0);t.rotation.z=Math.PI/2;let n=Oe(i,e,t);return n.add(R(Ee(.12,.12,.7,8,w.paintedRed),-.5,1.6,-.3)),n.add(R(F(.4,.5,.16,w.darkSteel),.2,1.3,.5)),n.add(R(Ci(.07,8),.2,1.35,.59)),{object:n,colliders:[qe(2.8,1.3,1.8)]}},ub=({variant:i})=>{let e=new pe,t=i===1?9:i===2?7:4.4,n=i===2?4:3;for(let r=0;r<n;r+=1){let s=r%2===0?w.steel:w.brass,o=i===2?2.45-r*.16:1.6+r*.28,a=R(Ee(.07,.07,t,7,s),r%2*.1,o,0);a.rotation.x=Math.PI/2,e.add(a);for(let c=-t/2+1.1;c<=t/2;c+=2.2)e.add(R(F(.05,.24,.05,w.darkSteel),r%2*.1,o+.16,c))}return{object:e,colliders:[]}},fb=()=>{let i=R(F(1.5,1.2,.22,w.darkSteel),0,1.2,0),e=Oe(i);for(let t=0;t<3;t+=1)for(let n=0;n<2;n+=1){let r=-.48+t*.48,s=.95+n*.5;e.add(R(Ee(.09,.09,.2,8,w.brass),r,s,.16));let o=R(vn(.15,.028,w.paintedRed,5,12),r,s,.28);e.add(o);for(let a=0;a<4;a+=1){let c=R(F(.022,.28,.022,w.paintedRed),r,s,.28);c.rotation.z=a/4*Math.PI,e.add(c)}}return{object:e,colliders:[{x1:-.75,x2:.75,z1:-.2,z2:.34,y1:.5,y2:1.85}]}},pb=()=>{let i=R(F(1,.28,.9,w.darkSteel),0,.14,0),e=R(Ee(.42,.42,.8,10,w.paintedGreen),0,.7,0);e.rotation.x=Math.PI/2;let t=R(Ee(.3,.3,.8,10,w.steel),0,1.3,0);t.rotation.z=Math.PI/2;let n=Oe(i,e,t);return n.add(R(Ee(.11,.11,1,8,w.brass),-.5,1.6,0)),n.add(R(F(.28,.34,.12,w.darkSteel),.44,1,.3)),n.add(R(sn(.05,w.warningLamp,6,4),.44,1.14,.38)),n.userData.runIndicator=n.children[n.children.length-1],{object:n,colliders:[qe(1.1,1,1.9)],animate:"pump"}},mb=()=>{let i=R(F(2,2.1,.5,w.darkSteel),0,1.05,0),e=Oe(i);for(let t=0;t<4;t+=1){e.add(R(F(.42,1.9,.04,w.steel),-.72+t*.48,1.05,.26)),e.add(R(Ci(.09,8),-.72+t*.48,1.72,.3));for(let n=0;n<4;n+=1)e.add(R(F(.06,.14,.06,n===0?w.paintedRed:w.rubber),-.72+t*.48,1.34-n*.22,.3))}return{object:e,colliders:[qe(2.1,.6,2.15)]}},gb=()=>{let i=R(F(1.5,1.5,.42,w.paintedGreen),0,.95,0),e=R(F(1.3,.24,.34,w.darkSteel),0,.12,0),t=Oe(e,i),n=R(F(1.36,1.24,.04,w.darkSteel),0,1,.22);t.add(n);for(let r=0;r<3;r+=1){let s=-.44+r*.44;t.add(R(Ci(.13,10),s,1.36,.26));let o=R(sn(.055,w.warningLamp,7,5),s,1,.26);o.name=`pump-lamp-${r}`,t.add(o);let a=R(F(.05,.26,.05,w.paintedRed),s,.72,.28);a.rotation.x=.7,a.name=`pump-lever-${r}`,t.add(a)}return t.add(R(sr("BILGE / SENTINA",1.2,.18),0,1.66,.24)),{object:t,colliders:[qe(1.6,.6,1.75)],animate:"pumpPanel"}},xb=()=>{let i=R(F(2.2,.1,.72,w.wood),0,.92,0),e=Oe(i);return[-.98,.98].forEach(t=>e.add(R(F(.1,.9,.64,w.darkSteel),t,.46,0))),e.add(R(F(.24,.2,.24,w.steel),.7,1.07,0)),e.add(R(F(.5,.28,.36,w.darkSteel),-.6,1.11,0)),{object:e,colliders:[qe(2.3,.8,1)]}},bb=()=>{let i=Oe(R(F(1.8,1,.06,w.darkWood),0,1.75,0));return[.3,.5,.24,.42,.36,.28,.46].forEach((t,n)=>{i.add(R(F(.05,t,.04,n%2?w.steel:w.brass),-.72+n*.24,1.85-t/2,.05))}),{object:i,colliders:[]}},yb=()=>{let i=Oe(R(Ee(.1,.13,.14,8,w.darkSteel),0,2.3,0)),e=R(sn(.11,w.warningLamp,8,6),0,2.42,0);e.name="beacon-dome",i.add(e);let t=R(vn(.13,.014,w.darkSteel,4,10),0,2.42,0);return t.rotation.x=Math.PI/2,i.add(t),{object:i,animate:"beacon",lights:[{x:0,y:2.42,z:0,colour:13781290,intensity:0,distance:7,kind:"emergency"}]}},vb=()=>{let i=R(Ee(.24,.24,3.6,10,w.steel),0,.62,0);i.rotation.x=Math.PI/2;let e=Oe(i);return[-1.3,.2,1.5].forEach(t=>{e.add(R(F(.8,.66,.4,w.darkSteel),0,.33,t));let n=R(Ee(.32,.32,.16,10,w.brass),0,.62,t);n.rotation.x=Math.PI/2,e.add(n)}),e.userData.shaft=i,{object:e,colliders:[qe(.9,3.6,.95)],animate:"shaft"}},_b=()=>{let i=R(F(2.4,2,.3,w.darkSteel),0,1,0),e=R(F(2,1.6,.16,w.steel),0,1,-.12);e.name="containment-plate";let t=Oe(i,e);for(let n=0;n<8;n+=1){let r=n/8*Math.PI*2;t.add(R(F(.14,.14,.1,w.brass),Math.cos(r)*.85,1+Math.sin(r)*.7,-.2))}return t.add(R(sr("!",.5,.5),0,1,-.22)),{object:t,colliders:[{x1:-1.2,x2:1.2,z1:-.2,z2:.2,y1:0,y2:2}],animate:"containment"}},Mb=()=>{let i=new pe,e=10.4;i.add(R(Ee(.03,.03,e,6,w.steel),0,1.05,0)),i.add(R(Ee(.025,.025,e,6,w.steel),0,.6,0)),i.children.forEach(t=>t.rotation.x=Math.PI/2);for(let t=-e/2;t<=e/2+.01;t+=1.3)i.add(R(F(.06,1.05,.06,w.steel),0,.52,t));return i.add(R(F(.14,.12,e,w.paintedRed),0,.06,0)),{object:i,colliders:[{x1:-.12,x2:.12,z1:-e/2,z2:e/2,y1:0,y2:1.1}]}},Eb=()=>{let i=new pe,e=R(Ee(.03,.03,.5,6,w.brass),0,2.9,0);i.add(e);let t=R(vn(.46,.03,w.brass,5,14),0,2.62,0);t.rotation.x=Math.PI/2,i.add(t);for(let n=0;n<6;n+=1){let r=n/6*Math.PI*2,s=R(F(.03,.03,.44,w.brass),Math.cos(r)*.23,2.68,Math.sin(r)*.23);s.rotation.y=-r,i.add(s),i.add(R(Ee(.07,.05,.14,7,w.lampGlass),Math.cos(r)*.46,2.68,Math.sin(r)*.46))}return i.add(R(sn(.1,w.lampGlass,8,6),0,2.5,0)),{object:i,lights:[{x:0,y:2.5,z:0,colour:16767392,intensity:1.5,distance:13,kind:"practical"}]}},Sb=()=>{let i=R(F(3.2,1.12,.62,w.darkWood),0,.56,0),e=R(F(3.5,.1,.8,w.wood),0,1.16,0),t=R(F(3.3,.06,.06,w.brass),0,.2,.34),n=R(F(3,2,.34,w.darkWood),0,1,-1),r=Oe(i,e,t,n);for(let s=0;s<3;s+=1){r.add(R(F(2.8,.05,.26,w.wood),0,.9+s*.38,-.88));for(let o=0;o<7;o+=1)r.add(R(Ee(.045,.05,.26,6,o%2?w.brass:w.glass),-1.2+o*.4,1.05+s*.38,-.88))}return r.add(R(new K(new At(2.6,1.1),w.glass),0,1.75,-1.16)),{object:r,colliders:[qe(3.5,.9,1.2),{x1:-1.5,x2:1.5,z1:-1.2,z2:-.8,y1:0,y2:2.1}]}},wb=()=>{let i=Oe(R(Ee(.2,.2,.1,10,w.velvet),0,.72,0),R(Ee(.05,.08,.68,8,w.brass),0,.34,0));return i.add(R(vn(.17,.02,w.brass,4,10),0,.2,0)),{object:i,colliders:[qe(.44,.44,.78)]}},Tb=({variant:i})=>{let e=new pe;if(i===1)return e.add(R(F(1.9,.08,.8,w.wood),0,.76,0)),[-.8,.8].forEach(n=>e.add(R(F(.09,.74,.7,w.darkWood),n,.37,0))),[-.62,.62].forEach(n=>e.add(R(F(1.8,.1,.34,w.wood),0,.44,n))),{object:e,colliders:[qe(2,1.6,.8)]};e.add(R(Ee(.56,.56,.09,12,w.wood),0,.74,0)),e.add(R(Ee(.08,.14,.7,8,w.darkWood),0,.35,0)),e.add(R(Ee(.32,.34,.05,10,w.brass),0,.03,0));let t=[qe(1.16,1.16,.8)];for(let n=0;n<3;n+=1){let r=n/3*Math.PI*2+.4,s=Math.cos(r)*.95,o=Math.sin(r)*.95,a=new pe;a.add(R(F(.42,.1,.42,w.velvet),0,.44,0)),a.add(R(F(.42,.56,.09,w.velvet),0,.72,-.18)),[-.16,.16].forEach(c=>[-.16,.16].forEach(l=>a.add(R(F(.05,.44,.05,w.darkWood),c,.22,l)))),a.position.set(s,0,o),a.rotation.y=-r+Math.PI/2,e.add(a),t.push({x1:s-.26,x2:s+.26,z1:o-.26,z2:o+.26,y1:0,y2:.9})}return{object:e,colliders:t}},Ab=()=>{let i=Oe(R(F(.78,.24,.74,w.velvet),0,.42,0),R(F(.78,.7,.16,w.velvet),0,.78,-.3));return[-.36,.36].forEach(e=>i.add(R(F(.14,.28,.7,w.velvet),e,.66,0))),[-.3,.3].forEach(e=>[-.3,.3].forEach(t=>i.add(R(F(.07,.3,.07,w.darkWood),e,.15,t)))),{object:i,colliders:[qe(.9,.85,1)]}},Rb=()=>{let i=Oe(R(F(2,.26,.8,w.velvet),0,.44,0),R(F(2,.74,.18,w.velvet),0,.82,-.32));[-.98,.98].forEach(e=>i.add(R(F(.16,.3,.78,w.velvet),e,.68,0)));for(let e=0;e<3;e+=1)i.add(R(F(.54,.14,.6,w.linen),-.62+e*.62,.62,.02));return[-.85,.85].forEach(e=>[-.3,.3].forEach(t=>i.add(R(F(.08,.3,.08,w.darkWood),e,.15,t)))),{object:i,colliders:[qe(2.1,.95,1.05)]}},Cb=()=>{let i=R(F(1.5,1.24,.62,w.darkWood),0,.62,0),e=R(F(1.55,.08,.68,w.darkWood),0,1.28,0),t=R(F(1.4,.12,.34,w.wood),0,.78,.4),n=R(F(1.28,.04,.26,w.linen),0,.85,.42),r=Oe(i,e,t,n);for(let o=0;o<14;o+=1)r.add(R(F(.035,.05,.16,w.rubber),-.6+o*.092,.88,.37));r.add(R(F(.5,.06,.3,w.darkWood),0,.12,.36));let s=R(F(.6,.1,.34,w.velvet),0,.52,.95);return r.add(s),[-.24,.24].forEach(o=>[-.12,.12].forEach(a=>r.add(R(F(.06,.48,.06,w.darkWood),o,.24,.95+a)))),r.add(R(new K(new At(.4,.3),w.linen),0,1.36,.1)),{object:r,colliders:[qe(1.6,.75,1.35),{x1:-.35,x2:.35,z1:.75,z2:1.15,y1:0,y2:.6}]}},Ib=({variant:i})=>{let e=i===1?.7:1.2,t=i===1?.9:2,n=i===1?1.5:1.25,r=R(F(e+.16,t+.16,.1,w.brass),0,n,0);return{object:Oe(r),colliders:[],mirror:{width:e,height:t,y:n,z:.06}}},Pb=()=>{let i=R(F(.72,.92,.08,w.brass),0,1.5,0);return{object:Oe(i),colliders:[],mirror:{width:.6,height:.8,y:1.5,z:.05}}},kb=()=>{let i=document.createElement("canvas");i.width=96,i.height=64;let e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,40);t.addColorStop(0,"#3c4a58"),t.addColorStop(1,"#8a8574"),e.fillStyle=t,e.fillRect(0,0,96,40),e.fillStyle="#1d3440",e.fillRect(0,38,96,26),e.fillStyle="#2b4a56";for(let o=0;o<40;o+=1)e.fillRect(o*13%96,40+o*7%22,6,1);e.fillStyle="#141a1c",e.fillRect(28,30,42,8),e.fillRect(34,25,30,5),[40,48,56].forEach(o=>e.fillRect(o,17,4,9));let n=new Ut(i);n.colorSpace=pt,n.magFilter=vt;let r=R(new K(new At(1.2,.8),new Le({map:n,roughness:.8})),0,1.65,.05),s=R(F(1.34,.94,.08,w.brass),0,1.65,0);return{object:Oe(s,r),colliders:[]}},Db=()=>{let i=Oe(R(Ee(.28,.22,.44,10,w.brass),0,.22,0));i.add(R(Ee(.06,.08,.5,6,w.darkWood),0,.66,0));for(let e=0;e<7;e+=1){let t=e/7*Math.PI*2,n=R(F(.06,.03,.74,w.paintedGreen),Math.cos(t)*.24,.94+e%3*.08,Math.sin(t)*.24);n.rotation.set(-.5,-t,0),i.add(n)}return{object:i,colliders:[qe(.6,.6,1)]}},Lb=()=>{let i=R(F(2.6,1.1,.7,w.darkWood),0,.55,0),e=R(F(2.8,.1,.9,w.wood),0,1.14,0),t=Oe(i,e);t.add(R(F(2.4,.5,.06,w.brass),0,.78,.36)),t.add(R(F(.24,.1,.18,w.brass),-.9,1.24,0)),t.add(R(sn(.06,w.brass,8,6),.9,1.22,0)),t.add(R(F(1.9,1.4,.24,w.darkWood),0,1.3,-.9));for(let n=0;n<4;n+=1)for(let r=0;r<3;r+=1)t.add(R(F(.4,.32,.02,w.wood),-.66+n*.44,.96+r*.38,-.78));return{object:t,colliders:[qe(2.8,1,1.2),{x1:-1,x2:1,z1:-1.1,z2:-.7,y1:0,y2:2}]}},Nb=()=>{let i=R(F(.1,.5,.36,w.brass),0,1.72,-.14),e=R(Ee(.14,.24,.34,10,w.brass),0,1.48,0);e.name="bell-body";let t=R(sn(.05,w.darkSteel,6,4),0,1.32,0),n=Oe(i,e,t);return n.add(R(Ee(.03,.03,.28,6,w.brass),0,1.2,0)),n.add(R(sr("ORPHEUS",.3,.09),0,1.46,.13)),{object:n,colliders:[],animate:"bell"}},Ub=({variant:i})=>{let e=R(F(1.3,1,.09,w.darkWood),0,1.55,0),t=R(F(1.18,.88,.02,w.paintedGreen),0,1.55,.05),n=Oe(e,t),r=i===1?4:3;for(let s=0;s<r;s+=1){let o=R(F(.24,.32,.008,w.linen),-.4+s*.28,1.55+s%2*.08,.07);o.rotation.z=(s%3-1)*.05,n.add(o)}return{object:n,colliders:[]}},Fb=()=>{let i=Oe(R(F(1.6,.12,.5,w.wood),0,.45,0),R(F(1.6,.5,.1,w.wood),0,.74,-.2));return[-.68,.68].forEach(e=>i.add(R(F(.1,.44,.44,w.darkWood),e,.22,0))),{object:i,colliders:[qe(1.7,.6,.9)]}},Bb=()=>{let i=Oe(R(F(1.3,.1,.72,w.brass),0,.28,0));return[-.55,.55].forEach(e=>[-.3,.3].forEach(t=>{let n=R(Ee(.11,.11,.05,10,w.rubber),e,.11,t);n.rotation.z=Math.PI/2,i.add(n)})),[-.6,.6].forEach(e=>{i.add(R(F(.05,1.1,.05,w.brass),e,.85,-.32)),i.add(R(F(.05,1.1,.05,w.brass),e,.85,.32))}),i.add(R(F(1.3,.05,.05,w.brass),0,1.4,-.32)),i.add(R(F(1.3,.05,.05,w.brass),0,1.4,.32)),i.add(R(F(.62,.42,.4,w.darkWood),-.2,.54,0)),i.add(R(F(.5,.3,.34,w.velvet),.32,.48,.02)),{object:i,colliders:[qe(1.4,.85,1.5)]}},Ob=()=>{let i=R(F(2,.9,.7,w.darkWood),0,.45,0),e=R(F(1.9,.8,.62,w.glass),0,1.3,0),t=Oe(i,e),n=R(F(1.5,.16,.2,w.paintedWhite),0,1.1,0),r=R(F(1.42,.14,.18,w.paintedRed),0,.98,0);return t.add(n,r),t.add(R(F(.8,.14,.16,w.paintedWhite),-.1,1.24,0)),[-.2,.05,.3].forEach(s=>t.add(R(Ee(.045,.05,.24,8,w.paintedRed),s,1.42,0))),t.add(R(sr("ORPHEUS",.7,.12),0,.72,.36)),{object:t,colliders:[qe(2.1,.8,1.75)]}},zb=()=>{let i=R(F(2,.34,1,w.darkWood),0,.2,0),e=R(F(1.94,.2,.96,w.linen),0,.47,0),t=R(F(1.3,.08,1,w.velvet),.3,.59,0),n=R(F(.34,.14,.62,w.linen),-.76,.62,0),r=R(F(.1,.8,1.04,w.darkWood),-1.02,.62,0);return{object:Oe(i,r,e,t,n),colliders:[qe(2.1,1.1,.7)]}},Hb=()=>{let i=R(F(1,2,.6,w.darkWood),0,1,0),e=Oe(i);e.add(R(F(.03,1.86,.02,w.brass),0,1,.31)),[-.12,.12].forEach(n=>e.add(R(sn(.04,w.brass,6,5),n,1.05,.32))),e.add(R(F(1.04,.1,.64,w.wood),0,2.02,0));let t=new pe;return t.name="wardrobe-door",e.userData.hideSpot=!0,{object:e,colliders:[qe(1.05,.65,2.05)]}},Gb=()=>{let i=R(F(1.1,.08,.55,w.wood),0,.76,0),e=Oe(i,R(F(1,.5,.5,w.darkWood),0,.5,-.02));return e.add(R(F(.86,.03,.02,w.brass),0,.56,.24)),[-.5,.5].forEach(t=>e.add(R(F(.06,.72,.5,w.darkWood),t,.36,0))),{object:e,colliders:[qe(1.2,.65,.8)]}},Vb=()=>{let i=Oe(R(F(.44,.08,.44,w.velvet),0,.45,0),R(F(.44,.56,.08,w.wood),0,.75,-.18));return[-.17,.17].forEach(e=>[-.17,.17].forEach(t=>i.add(R(F(.05,.44,.05,w.darkWood),e,.22,t)))),{object:i,colliders:[qe(.5,.5,.9)]}},Wb=()=>{let i=new pe;[-.3,.3].forEach(e=>{i.add(R(F(.04,.5,.04,w.darkWood),e,.25,-.18)),i.add(R(F(.04,.5,.04,w.darkWood),e,.25,.18))});for(let e=0;e<4;e+=1)i.add(R(F(.68,.03,.05,w.canvasCover),0,.5,-.18+e*.12));return{object:i,colliders:[qe(.75,.5,.55)]}},Xb=()=>{let i=Oe(R(F(.66,.24,.44,w.darkWood),0,.12,0));return i.add(R(F(.68,.05,.46,w.brass),0,.13,0)),i.add(R(F(.14,.06,.04,w.brass),0,.26,.22)),{object:i,colliders:[]}},qb=()=>{let i=Oe(R(F(.1,.16,.1,w.brass),0,1.15,0));return i.add(R(Ee(.11,.08,.16,8,w.lampGlass),.12,1.15,0)),{object:i,lights:[{x:.2,y:1.15,z:0,colour:16764821,intensity:.85,distance:5.5,kind:"practical"}]}},Yb=()=>{let i=R(F(1,.12,1,w.porcelain),0,.06,0),e=R(F(1,2.1,.06,w.porcelain),0,1.05,-.47),t=R(F(.06,2.1,1,w.porcelain),-.47,1.05,0),n=Oe(i,e,t),r=R(F(.04,1.9,.96,w.glass),.47,1.05,0);n.add(r);let s=R(Ee(.025,.025,1.3,6,w.brass),-.3,1.3,-.4);n.add(s);let o=R(Ee(.11,.07,.07,10,w.brass),-.3,1.94,-.28);o.rotation.x=.5,n.add(o);let a=R(vn(.07,.018,w.brass,4,10),-.3,1,-.42);return a.name="shower-tap",n.add(a),n.userData.showerHead=o,{object:n,colliders:[{x1:-.55,x2:.55,z1:-.55,z2:-.35,y1:0,y2:2.1}],animate:"shower"}},Kb=()=>{let i=Oe(R(F(.6,.16,.44,w.porcelain),0,.86,0),R(F(.4,.5,.3,w.porcelain),0,.6,-.05));return i.add(R(Ee(.02,.02,.16,6,w.brass),0,1,-.16)),i.add(R(F(.5,.6,.05,w.glass),0,1.45,-.2)),{object:i,colliders:[qe(.65,.5,1)]}},$b=()=>{let i=Oe(R(F(.38,.4,.56,w.porcelain),0,.2,0),R(F(.42,.14,.5,w.porcelain),0,.44,.02));return i.add(R(F(.4,.5,.2,w.porcelain),0,.62,-.3)),{object:i,colliders:[qe(.46,.7,.8)]}},jb=()=>{let i=new pe,e=R(Ee(.02,.02,.62,6,w.brass),0,1.25,0);return e.rotation.z=Math.PI/2,i.add(e),i.add(R(F(.28,.5,.05,w.linen),-.14,1.02,.03)),i.add(R(F(.22,.42,.05,w.linen),.16,1.06,.03)),{object:i,colliders:[]}},Zb=()=>{let i=new pe,e=R(F(.9,.34,.28,w.wood),0,.72,0);i.add(e);let t=R(F(.22,.44,.24,w.wood),.34,.98,0);t.rotation.z=-.35,i.add(t);let n=R(F(.34,.22,.22,w.wood),.56,1.18,0);return i.add(n),i.add(R(F(.12,.14,.06,w.darkWood),.66,1.3,-.08)),i.add(R(F(.12,.14,.06,w.darkWood),.66,1.3,.08)),[-.3,.3].forEach(r=>[-.14,.14].forEach(s=>{let o=R(F(.09,.5,.09,w.wood),r,.4,s);i.add(o)})),[-.16,.16].forEach(r=>{let s=R(F(1.4,.07,.06,w.darkWood),0,.12,r);i.add(s)}),i.userData.rock=!0,{object:i,colliders:[qe(1.5,.6,1.3)],animate:"rockingHorse"}},Jb=()=>{let i=Oe(R(F(1,.56,.5,w.wood),0,.28,0),R(F(1.04,.09,.54,w.darkWood),0,.6,0));return i.add(R(F(.14,.06,.05,w.brass),0,.5,.26)),i.add(R(sn(.09,w.paintedRed,7,5),.6,.09,.3)),i.add(R(F(.14,.14,.14,w.paintedGreen),-.62,.07,.24)),{object:i,colliders:[qe(1.05,.55,.65)]}},Qb=()=>{let i=Oe(R(F(.3,.06,.3,w.paintedRed),0,.3,0),R(F(.3,.34,.05,w.paintedRed),0,.5,-.12));return[-.11,.11].forEach(e=>[-.11,.11].forEach(t=>i.add(R(F(.04,.3,.04,w.wood),e,.15,t)))),{object:i,colliders:[qe(.36,.36,.6)]}},ey=()=>{let i=document.createElement("canvas");i.width=128,i.height=80;let e=i.getContext("2d");e.fillStyle="#26312c",e.fillRect(0,0,128,80),e.strokeStyle="#cdd6c4",e.lineWidth=2,e.strokeRect(20,30,70,16),e.beginPath(),e.moveTo(20,46),e.lineTo(90,46),e.stroke(),[36,50,64].forEach(o=>e.strokeRect(o,20,6,10)),e.beginPath(),e.moveTo(6,56),e.lineTo(122,56),e.stroke(),e.beginPath(),e.arc(60,70,9,Math.PI,0),e.stroke(),e.beginPath(),e.moveTo(52,70),e.lineTo(46,78),e.moveTo(68,70),e.lineTo(74,78),e.stroke();let t=new Ut(i);t.colorSpace=pt,t.magFilter=vt;let n=R(new K(new At(1.5,.94),new Le({map:t,roughness:.92})),0,1.35,.06);n.name="blackboard-face";let r=R(F(1.66,1.1,.09,w.wood),0,1.35,0),s=R(F(1.62,.07,.16,w.wood),0,.79,.08);return{object:Oe(r,n,s),colliders:[],animate:"blackboard"}},ty=()=>{let i=R(F(.7,.6,.5,w.wood),0,.3,0),e=R(F(.64,.56,.44,w.paintedWhite),0,.88,0),t=Oe(i,e),n=R(F(.7,.3,.5,w.paintedRed),0,1.28,0);n.rotation.z=0,t.add(n);for(let r=0;r<3;r+=1)t.add(R(F(.12,.14,.02,w.lampGlass),-.2+r*.2,.94,.23));return{object:t,colliders:[qe(.75,.55,1.45)]}},ny=()=>{let i=new pe,e=new ai;e.moveTo(-3.1,0),e.lineTo(-2.5,.62),e.lineTo(2.5,.62),e.lineTo(3.1,0),e.lineTo(2.4,-.42),e.lineTo(-2.4,-.42),e.closePath();let t=new K(new vs(e,{depth:1.5,bevelEnabled:!1}),w.paintedWhite);t.rotation.y=Math.PI/2,t.position.set(.75,1.5,0),i.add(t),i.add(R(F(1.5,.1,6.2,w.paintedRed),0,1.62,0));for(let r=0;r<4;r+=1)i.add(R(F(1.3,.06,.18,w.wood),0,1.7,-2.1+r*1.4));let n=R(F(1.44,.24,5.8,w.canvasCover),0,1.94,0);return i.add(n),i.add(R(sr("ORPHEUS",.9,.14),.76,1.62,0)),i.children[i.children.length-1].rotation.y=Math.PI/2,[-1.8,1.8].forEach(r=>i.add(R(F(1.5,.9,.3,w.darkSteel),0,.45,r))),{object:i,colliders:[qe(1.7,6.4,2.3)]}},iy=()=>{let i=new pe;i.add(R(F(.3,.4,.5,w.darkSteel),0,.2,0));let e=R(Ee(.09,.11,2.6,8,w.steel),0,1.5,0);i.add(e);let t=R(Ee(.08,.08,1.5,8,w.steel),-.55,2.7,0);return t.rotation.z=1.05,i.add(t),i.add(R(Ee(.05,.05,.5,6,w.brass),-1.1,2.28,0)),i.add(R(F(.06,1,.06,w.rubber),-1.12,1.7,0)),{object:i,colliders:[qe(.4,.5,2.8)]}},ry=()=>{let i=new pe,e=R(F(.56,.05,.95,w.canvasCover),0,.42,0);e.rotation.x=.12,i.add(e);let t=R(F(.56,.9,.05,w.canvasCover),0,.75,-.48);return t.rotation.x=.42,i.add(t),[-.28,.28].forEach(n=>{i.add(R(F(.05,.44,.05,w.wood),n,.22,-.4)),i.add(R(F(.05,.44,.05,w.wood),n,.22,.4));let r=R(F(.05,.05,1.05,w.wood),n,.44,0);r.rotation.x=.12,i.add(r)}),{object:i,colliders:[qe(.65,1.1,.95)]}},sy=()=>{let i=R(vn(.34,.09,w.paintedWhite,6,14),0,1.25,0),e=Oe(i);for(let t=0;t<4;t+=1){let n=t/4*Math.PI*2+Math.PI/4;e.add(R(F(.16,.2,.1,w.paintedRed),Math.cos(n)*.34,1.25+Math.sin(n)*.34,0))}return e.add(R(F(.1,.5,.08,w.darkSteel),0,.9,-.06)),{object:e,colliders:[]}},oy=()=>{let i=Oe(R(Ee(.32,.38,1.5,10,w.paintedWhite),0,.75,0)),e=R(Ee(.36,.3,.5,10,w.paintedRed),0,1.66,-.16);return e.rotation.x=-.9,i.add(e),i.add(R(vn(.36,.03,w.brass,4,12),0,1.44,0)),i.children[i.children.length-1].rotation.x=Math.PI/2,{object:i,colliders:[qe(.8,.8,1.9)]}},ay=()=>{let i=Oe(R(F(.7,.12,.5,w.darkSteel),0,.06,0));return[-.16,.16].forEach(e=>{i.add(R(Ee(.11,.13,.62,8,w.darkSteel),e,.4,0)),i.add(R(Ee(.15,.15,.08,8,w.darkSteel),e,.74,0))}),{object:i,colliders:[qe(.8,.6,.8)]}},ly=()=>{let i=Oe(R(Ee(.44,.5,.24,12,w.darkSteel),0,.12,0),R(Ee(.3,.36,.62,12,w.steel),0,.54,0));i.add(R(Ee(.4,.36,.12,12,w.darkSteel),0,.9,0));for(let e=0;e<5;e+=1){let t=e/5*Math.PI*2;i.add(R(F(.08,.5,.08,w.steel),Math.cos(t)*.3,.54,Math.sin(t)*.3))}return{object:i,colliders:[qe(1,1,1)]}},cy=()=>{let i=new pe;for(let e=0;e<4;e+=1){let t=R(vn(.42-e*.07,.055,w.canvasCover,5,14),0,.06+e*.1,0);t.rotation.x=Math.PI/2,i.add(t)}return{object:i,colliders:[qe(.9,.9,.45)]}},hy=()=>{let i=Oe(R(Ee(.09,.13,1.15,8,w.darkSteel),0,.57,0)),e=R(Ee(.28,.28,.42,12,w.paintedWhite),0,1.32,0);e.rotation.x=Math.PI/2,i.add(e);let t=R(new K(new Ht(.25,12),w.lampGlass),0,1.32,.22);return i.add(t),{object:i,colliders:[qe(.5,.5,1.6)]}},dy=()=>{let i=Oe(R(F(3,2.8,4.2,w.paintedRed),0,1.4,0));i.add(R(F(3.2,.2,4.4,w.darkSteel),0,2.5,0));for(let e=0;e<3;e+=1)i.add(R(F(3.1,.1,.14,w.brass),0,.5+e*.7,2.12));return{object:i,colliders:[qe(3.2,4.4,2.9)]}},uy=()=>{let i=Oe(R(Ee(.05,.08,3.2,8,w.wood),0,1.6,0),R(Ee(.22,.26,.2,8,w.darkSteel),0,.1,0));return i.add(R(sn(.07,w.brass,7,5),0,3.24,0)),{object:i,colliders:[qe(.5,.5,3.3)]}},fy=({variant:i})=>{let e=new pe;if(i===1){e.add(R(F(.16,.2,.08,w.darkSteel),0,2.1,0));let n=R(sn(.11,w.lampGlass,8,6),0,2.1,.13);e.add(n);for(let r=0;r<3;r+=1){let s=R(F(.02,.24,.02,w.darkSteel),0,2.1,.13);s.rotation.z=r/3*Math.PI,e.add(s)}return{object:e,lights:[{x:0,y:2.1,z:.3,colour:16769200,intensity:.75,distance:8,kind:"practical"}]}}e.add(R(F(.1,.28,.1,w.brass),0,1.95,0));let t=R(Ee(.16,.1,.22,8,w.lampGlass),0,2.14,.13);return e.add(t),e.add(R(F(.06,.06,.24,w.brass),0,2.06,.08)),{object:e,lights:[{x:0,y:2.1,z:.28,colour:16767138,intensity:.9,distance:9,kind:"practical"}]}},py=({variant:i})=>{let e=new pe,t=2.42;if(i===1)return e.add(R(Ee(.16,.13,.1,8,w.darkSteel),0,t+.14,0)),e.add(R(Ee(.12,.12,.04,8,w.warningLamp),0,t+.06,0)),{object:e,lights:[{x:0,y:t,z:0,colour:13915450,intensity:.5,distance:7,kind:"practical"}]};if(i===2)return e.add(R(Ee(.24,.3,.24,8,w.paintedGreen),0,t+.1,0)),e.add(R(sn(.13,w.lampGlass,8,6),0,t-.02,0)),{object:e,lights:[{x:0,y:t-.05,z:0,colour:16768168,intensity:1,distance:8.5,kind:"practical"}]};if(i===3)return e.add(R(F(.34,.1,.16,w.porcelain),0,t+.06,0)),e.add(R(F(.3,.06,.12,w.lampGlass),0,t,0)),{object:e,lights:[{x:0,y:t-.05,z:0,colour:15921372,intensity:.9,distance:6,kind:"practical"}]};e.add(R(Ee(.03,.03,.18,6,w.brass),0,t+.2,0));let n=R(Ee(.26,.13,.18,10,w.lampGlass),0,t,0);return e.add(n),e.add(R(vn(.27,.02,w.brass,4,12),0,t+.09,0)),e.children[e.children.length-1].rotation.x=Math.PI/2,{object:e,lights:[{x:0,y:t-.1,z:0,colour:16767396,intensity:1.1,distance:10,kind:"practical"}]}},my=({variant:i})=>{let e=new pe,t=i===1?2.15:2.6;e.add(R(Ee(.02,.02,.3,5,w.darkSteel),0,t+.3,0)),e.add(R(Ee(.16,.1,.16,8,w.darkSteel),0,t+.08,0));let n=R(sn(.09,w.lampGlass,7,5),0,t-.02,0);e.add(n);for(let r=0;r<4;r+=1){let s=R(F(.015,.22,.015,w.darkSteel),0,t,0);s.rotation.z=r/4*Math.PI,e.add(s)}return{object:e,lights:[{x:0,y:t-.05,z:0,colour:16769966,intensity:1.5,distance:14,kind:"work"}]}},gy=()=>{let i=new pe,e=14;return[-1,1].forEach(t=>{let n=R(F(.05,.06,e,w.warningLamp.clone()),t*1.6,.14,0);n.name="emergency-strip",n.material.emissiveIntensity=.55,i.add(n)}),{object:i,lights:[{x:-1.5,y:.3,z:-3,colour:8380592,intensity:0,distance:6,kind:"emergency"},{x:1.5,y:.3,z:3,colour:8380592,intensity:0,distance:6,kind:"emergency"}],animate:"emergencyStrip"}},xy=({text:i})=>{let e=sr(i??"",1.7,.42);e.position.y=2.15;let t=R(F(1.76,.48,.05,w.darkSteel),0,2.15,-.03);return{object:Oe(t,e),colliders:[]}},by=()=>{let i=R(F(.5,.9,.24,w.paintedRed),0,1.15,0),e=Oe(i);e.add(R(new K(new At(.4,.7),w.glass),0,1.15,.13));let t=R(Ee(.24,.24,.14,10,w.paintedRed),0,1.15,.06);return t.rotation.x=Math.PI/2,e.add(t),e.add(R(Ee(.09,.11,.5,8,w.paintedRed),.3,.4,.06)),{object:e,colliders:[{x1:-.3,x2:.45,z1:-.14,z2:.2,y1:0,y2:1.65}]}},yy=()=>{let i=new pe,e=12,t=R(Ee(.035,.035,e,6,w.brass),0,.95,0);t.rotation.x=Math.PI/2,i.add(t);for(let n=-e/2;n<=e/2+.01;n+=2)i.add(R(F(.05,.16,.05,w.brass),0,.95,n));return{object:i,colliders:[]}},vy=({variant:i})=>{let e=new pe,t=i===1?1.2:1.7,n=i===1?1.5:2,r=i===1?4:5;[-t/2,t/2].forEach(s=>e.add(R(F(.07,n,.44,i===1?w.darkWood:w.darkSteel),s,n/2,0)));for(let s=0;s<r;s+=1){e.add(R(F(t,.05,.44,i===1?w.wood:w.steel),0,.24+s*(n/r),0));for(let o=0;o<4;o+=1)(s+o)%3!==0&&e.add(R(F(t/5,.24,.3,o%2?w.linen:w.darkWood),-t/2+t/4*(o+.5),.38+s*(n/r),0))}return{object:e,colliders:[qe(t+.1,.5,n)]}},_y=()=>{let i=Oe(R(F(.9,.7,.8,w.wood),0,.35,0));return[-.34,.34].forEach(e=>i.add(R(F(.94,.06,.84,w.darkWood),0,.35+e,0))),i.add(R(sr("ORPHEUS",.5,.1),0,.42,.41)),{object:i,colliders:[qe(.95,.85,.72)]}},My=()=>{let i=Oe(R(F(1,.7,.62,w.canvasCover),0,.62,0));return[-.42,.42].forEach(e=>[-.24,.24].forEach(t=>{let n=R(Ee(.08,.08,.04,8,w.rubber),e,.08,t);n.rotation.z=Math.PI/2,i.add(n)})),[-.46,.46].forEach(e=>[-.28,.28].forEach(t=>i.add(R(F(.05,.3,.05,w.steel),e,.18,t)))),i.add(R(F(.8,.2,.5,w.linen),0,.98,0)),{object:i,colliders:[qe(1.05,.7,1.1)]}},Ey=()=>{let i=new pe,e=R(F(.68,.16,.46,w.darkWood),0,.08,0);i.add(e);let t=R(F(.68,.14,.46,w.darkWood),0,.24,-.24);t.rotation.x=-1.15,i.add(t),i.add(R(F(.7,.04,.48,w.brass),0,.17,0));let n=[w.linen,w.velvet,w.canvasCover,w.linen];for(let s=0;s<4;s+=1){let o=R(F(.5-s*.05,.05,.34-s*.03,n[s]),s%2*.05-.02,.18+s*.035,s%2*.05);o.rotation.y=(s-1.5)*.15,i.add(o)}let r=R(F(.12,.04,.3,w.linen),.3,.2,.18);return r.rotation.set(.2,.5,0),i.add(r),{object:i,colliders:[qe(.75,.7,.4)]}},Sy=()=>{let i=new pe,e=R(F(.05,.06,.06,w.brass),0,1.72,0);i.add(e);let t=R(F(.34,.08,.1,w.darkWood),0,1.62,.06);i.add(t);let n=R(F(.38,.78,.13,w.canvasCover),0,1.22,.07);return i.add(n),[-.2,.2].forEach(r=>{let s=R(F(.11,.6,.11,w.canvasCover),r,1.28,.07);s.rotation.z=r<0?.06:-.06,i.add(s)}),{object:i,colliders:[]}},wy=({variant:i})=>{let e=new pe,t=i===1?.76:.9,n=R(Ee(.035,.05,.26,8,w.glass),0,t+.13,0);e.add(n),e.add(R(Ee(.018,.018,.09,6,w.glass),0,t+.3,0));for(let s=0;s<2+Math.floor(Math.random()*2);s+=1){let o=R(Ee(.032,.024,.08,8,w.glass),-.14+s*.13,t+.04,.08-s*.05);e.add(o)}let r=R(Ee(.07,.06,.02,10,w.porcelain),.16,t+.01,-.08);return e.add(r),{object:e,colliders:[]}},Ty=()=>{let i=new pe;for(let e=0;e<7;e+=1){let t=R(new K(new At(.21,.29),w.linen),e%3*.16-.2,.012+e*.001,Math.floor(e/3)*.2-.15);t.rotation.x=-Math.PI/2,t.rotation.z=e*.7,i.add(t)}return{object:i,colliders:[]}},Ay=()=>{let i=new pe,e=R(Ee(.14,.11,.26,10,w.steel),0,.13,0);i.add(e),i.add(R(vn(.13,.012,w.steel,4,10),0,.28,0));let t=R(new K(new Ht(.12,10),w.glass),0,.2,0);t.rotation.x=-Math.PI/2,i.add(t);let n=R(Ee(.018,.018,1.3,6,w.wood),.12,.68,.04);n.rotation.z=-.22,i.add(n);let r=R(F(.16,.1,.12,w.canvasCover),.26,.06,.04);return i.add(r),{object:i,colliders:[qe(.34,.34,.35)]}},Ry=({variant:i})=>{let e=new pe,t=i===1?6:3.6,n=3+(i===1?2:0);for(let r=0;r<n;r+=1){let s=.06+r*.02,o=[];for(let l=0;l<=8;l+=1){let h=l/8;o.push(new U(r%2*.05,-Math.sin(h*Math.PI)*s,-t/2+h*t))}let a=new Ir(o),c=new K(new Es(a,10,.012+r%2*.004,5,!1),r%2?w.rubber:w.darkSteel);c.position.y=2.42-r*.05,e.add(c)}for(let r=-t/2;r<=t/2+.01;r+=1.8)e.add(R(F(.1,.04,.05,w.darkSteel),.02,2.44,r));return{object:e,colliders:[]}},Cy=()=>{let i=new pe;i.add(R(F(.9,.06,.26,w.wood),0,1.62,0));for(let e=0;e<4;e+=1){let t=R(F(.19,.3,.12,w.paintedRed),-.32+e*.21,1.42,.02);t.rotation.z=(e-1.5)*.05,i.add(t),i.add(R(F(.2,.03,.13,w.canvasCover),-.32+e*.21,1.36,.02))}return{object:i,colliders:[]}},Iy=()=>{let i=new pe,e=R(F(.42,.03,.32,w.steel),0,.9,0);i.add(e);let t=R(Ee(.11,.1,.02,12,w.porcelain),-.06,.93,0);return i.add(t),i.add(R(Ee(.07,.06,.05,10,w.porcelain),.13,.94,.08)),i.add(R(F(.02,.01,.14,w.steel),.1,.92,-.06)),i.add(R(F(.09,.02,.07,w.wood),-.06,.945,.01)),{object:i,colliders:[]}},Py=()=>{let i=new pe,e=[w.velvet,w.darkWood,w.wood,w.canvasCover];for(let t=0;t<4;t+=1){let n=R(F(.16-t*.008,.035,.22-t*.01,e[t]),0,.02+t*.037,0);n.rotation.y=(t-1.5)*.12,i.add(n)}return{object:i,colliders:[]}},ky=()=>{let i=new pe;for(let e=0;e<5;e+=1){let t=R(F(.5-e*.05,.09,.4-e*.04,e%2?w.velvet:w.linen),e%3*.07-.07,.05+e*.045,e%2*.08-.04);t.rotation.set(e%2*.12,e*.3,e%3*.08),i.add(t)}return{object:i,colliders:[]}},Dy=()=>{let i=new pe,e=R(Ee(.24,.27,.72,12,w.darkSteel),0,.36,0);return i.add(e),[.16,.56].forEach(t=>{let n=R(vn(.27,.02,w.brass,4,12),0,t,0);n.rotation.x=Math.PI/2,i.add(n)}),i.add(R(Ee(.24,.24,.03,12,w.steel),0,.73,0)),{object:i,colliders:[qe(.56,.56,.75)]}},Ly=()=>{let i=new pe;for(let t=0;t<9;t+=1){let n=R(vn(.032,.009,w.darkSteel,4,8),0,2.5-t*.055,0);n.rotation.x=Math.PI/2,n.rotation.y=t%2*Math.PI/2,i.add(n)}let e=new K(new fn(.05,.012,4,10,Math.PI*1.4),w.darkSteel);return e.position.set(0,1.95,0),i.add(e),{object:i,colliders:[],animate:"sway"}},hu={helm:Jx,engineTelegraph:Qx,binnacleCompass:eb,radarSet:tb,radioSet:nb,bridgeConsole:ib,gaugePanel:rb,navLightBox:sb,chartTable:ob,chartRack:ab,barometer:lb,bridgeStool:cb,mainEngine:hb,generatorSet:db,pipeRun:ub,valveManifold:fb,bilgePump:pb,switchboard:mb,pumpControlPanel:gb,workbench:xb,toolBoard:bb,warningBeacon:yb,shaftLine:vb,sealedHatch:_b,catwalkRail:Mb,chandelier:Eb,barCounter:Sb,barStool:wb,salonTable:Tb,armchair:Ab,sofa:Rb,pianoUpright:Cb,mirrorLarge:Ib,paintingSeascape:kb,potPlant:Db,receptionDesk:Lb,shipBell:Nb,noticeBoard:Ub,benchSeat:Fb,luggageCart:Bb,shipModelCase:Ob,bed:zb,wardrobe:Hb,cabinDesk:Gb,cabinChair:Vb,luggageRack:Wb,suitcase:Xb,mirrorSmall:Pb,bunkLamp:qb,shower:Yb,washbasin:Kb,toilet:$b,towelRail:jb,rockingHorse:Zb,toyChest:Jb,childChair:Qb,blackboard:ey,dollHouse:ty,lifeboat:ny,davit:iy,deckChair:ry,lifebuoy:sy,ventilator:oy,bollard:ay,capstan:ly,ropeCoil:cy,searchlight:hy,funnelBase:dy,flagstaff:uy,wallLamp:fy,ceilingLamp:py,workLamp:my,emergencyStrip:gy,deckSign:xy,fireStation:by,handrail:yy,shelfRack:vy,crate:_y,laundryCart:My,openSuitcase:Ey,hangingCoat:Sy,glassware:wy,scatteredPapers:Ty,bucketAndMop:Ay,cableRun:Ry,lifeJacketRack:Cy,foodTray:Iy,bookStack:Py,crumpledBlanket:ky,barrel:Dy,hangingChain:Ly};var Ny=`
  uniform mat4 textureMatrix;
  varying vec4 vUvProjected;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vUvProjected = textureMatrix * worldPosition;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`,Uy=`
  uniform sampler2D reflectionMap;
  uniform vec3 tint;
  uniform float grime;
  varying vec4 vUvProjected;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUvProjected.xy / max(vUvProjected.w, 0.0001);
    vec3 reflected = texture2D(reflectionMap, uv).rgb;
    // Old silvered glass: slightly cold, slightly dirty towards the edges.
    float edge = smoothstep(0.0, 0.35, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    vec3 colour = mix(reflected * 0.55, reflected, edge);
    colour *= tint;
    colour = mix(colour, vec3(dot(colour, vec3(0.32, 0.4, 0.28))), grime);
    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`,Ja=class{constructor(e){this.camera=new Xt(50,1,.1,45);this.accumulator=Number.POSITIVE_INFINITY;this.normal=new U;this.position=new U;this.reflection=new Mt;this.textureMatrix=new Mt;this.lookTarget=new U;this.up=new U(0,1,0);this.mirroredUp=new U;this.toViewer=new U;this.clipPlane=new In;this.clipVector=new yt;this.q=new yt;this.interval=e.interval,this.target=new kn(e.resolution,e.resolution,{minFilter:Kt,magFilter:Kt,depthBuffer:!0}),this.target.texture.colorSpace=pt,this.material=new bn({uniforms:{reflectionMap:{value:this.target.texture},textureMatrix:{value:this.textureMatrix},tint:{value:new ot(.86,.92,.94)},grime:{value:.22}},vertexShader:Ny,fragmentShader:Uy}),this.mesh=new K(new At(e.width,e.height),this.material),this.mesh.name="mirror-surface"}setQuality(e,t){this.interval=t,this.target.width!==e&&this.target.setSize(e,e)}distanceTo(e){return this.mesh.getWorldPosition(this.position),this.position.distanceTo(e)}update(e,t,n,r,s=!1){if(this.accumulator+=r,!s&&this.interval>0&&this.accumulator<this.interval||(this.accumulator=0,this.mesh.getWorldPosition(this.position),this.normal.set(0,0,1).transformDirection(this.mesh.matrixWorld).normalize(),this.toViewer.copy(n.position).sub(this.position),this.toViewer.dot(this.normal)<=.05))return;let a=this.normal,c=-a.dot(this.position);this.reflection.set(1-2*a.x*a.x,-2*a.x*a.y,-2*a.x*a.z,-2*a.x*c,-2*a.y*a.x,1-2*a.y*a.y,-2*a.y*a.z,-2*a.y*c,-2*a.z*a.x,-2*a.z*a.y,1-2*a.z*a.z,-2*a.z*c,0,0,0,1),this.camera.position.copy(n.position).applyMatrix4(this.reflection),this.lookTarget.set(0,0,-1).applyQuaternion(n.quaternion).multiplyScalar(10).add(n.position).applyMatrix4(this.reflection),this.mirroredUp.copy(this.up).transformDirection(this.reflection),this.camera.up.copy(this.mirroredUp),this.camera.lookAt(this.lookTarget),this.camera.fov=n.fov,this.camera.aspect=1,this.camera.near=.1,this.camera.far=45,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(),this.clipPlane.setFromNormalAndCoplanarPoint(this.normal,this.position),this.clipPlane.applyMatrix4(this.camera.matrixWorldInverse),this.clipVector.set(this.clipPlane.normal.x,this.clipPlane.normal.y,this.clipPlane.normal.z,this.clipPlane.constant);let l=this.camera.projectionMatrix;this.q.x=(Math.sign(this.clipVector.x)+l.elements[8])/l.elements[0],this.q.y=(Math.sign(this.clipVector.y)+l.elements[9])/l.elements[5],this.q.z=-1,this.q.w=(1+l.elements[10])/l.elements[14],this.clipVector.multiplyScalar(2/this.clipVector.dot(this.q)),l.elements[2]=this.clipVector.x,l.elements[6]=this.clipVector.y,l.elements[10]=this.clipVector.z+1-.003,l.elements[14]=this.clipVector.w,this.textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.textureMatrix.multiply(this.camera.projectionMatrix),this.textureMatrix.multiply(this.camera.matrixWorldInverse);let h=e.getRenderTarget(),d=this.mesh.visible;this.mesh.visible=!1,e.setRenderTarget(this.target),e.clear(),e.render(t,this.camera),e.setRenderTarget(h),this.mesh.visible=d}dispose(){this.target.dispose(),this.mesh.geometry.dispose(),this.material.dispose()}};function Fy(){let i=document.createElement("canvas");i.width=64,i.height=256;let e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#0b1622"),t.addColorStop(.42,"#16283a"),t.addColorStop(.62,"#31465a"),t.addColorStop(.78,"#4a5c66"),t.addColorStop(1,"#101c24"),e.fillStyle=t,e.fillRect(0,0,64,256);let n=new Zt(7717);for(let s=0;s<260;s+=1){let o=n.range(0,150),a=.35+n.next()*.55*(1-o/190);e.fillStyle=`rgba(226,236,244,${a.toFixed(3)})`,e.fillRect(n.range(0,64),o,1,1)}let r=new Ut(i);return r.colorSpace=pt,r.magFilter=Kt,r.wrapS=xn,r}function By(){let i=document.createElement("canvas");i.width=128,i.height=128;let e=i.getContext("2d");e.fillStyle="#14313f",e.fillRect(0,0,128,128);let t=new Zt(4242);for(let r=0;r<700;r+=1){let s=t.range(0,128),o=t.range(0,128),a=t.range(2,12);e.fillStyle=t.next()>.72?"rgba(150,186,196,0.20)":"rgba(8,22,30,0.28)",e.fillRect(s,o,a,1)}for(let r=0;r<70;r+=1)e.fillStyle="rgba(206,224,228,0.34)",e.fillRect(t.range(0,128),t.range(0,128),t.range(2,5),1);let n=new Ut(i);return n.colorSpace=pt,n.wrapS=xn,n.wrapT=xn,n.repeat.set(46,46),n.magFilter=Kt,n}function du(i){if(i<-21){let n=(i- -34)/13;return 8.6*Math.pow(Math.max(n,0),.62)}if(i>27){let n=(36-i)/9;return 8.6*(.52+.48*Math.pow(Math.max(n,0),.5))}return 8.6}function uu(){let i=new pe,e=xt[3].y+1.1,t=-6.4,n=[];for(let x=-34;x<=36+.001;x+=2)n.push(x);let r=[],s=[],o=[],a=(x,m,p,E,v,S)=>{let b=(y,T,k)=>{let _=T[0]-y[0],M=T[1]-y[1],D=T[2]-y[2],L=k[0]-y[0],N=k[1]-y[1],z=k[2]-y[2],O=M*z-D*N,G=D*L-_*z,Y=_*N-M*L,H=Math.hypot(O,G,Y)||1;[y,T,k].forEach(V=>{r.push(V[0],V[1],V[2]),s.push(O/H,G/H,Y/H)})};b(x,m,p),b(x,p,E),o.push(v,0,S,0,S,1,v,0,S,1,v,1)},c=[t,t+3.6,-1.4,xt[2].y,e];for(let x=0;x<n.length-1;x+=1){let m=n[x],p=n[x+1],E=du(m),v=du(p);for(let S=0;S<c.length-1;S+=1){let b=c[S],y=c[S+1],T=b<-1.4?.86:1,k=y<-1.4?.86:1;[-1,1].forEach(_=>{let M=[_*E*T,b,m],D=[_*v*T,b,p],L=[_*v*k,y,p],N=[_*E*k,y,m];_<0?a(M,D,L,N,x*.5,(x+1)*.5):a(N,L,D,M,x*.5,(x+1)*.5)})}}let l=new It;l.setAttribute("position",new at(r,3)),l.setAttribute("normal",new at(s,3)),l.setAttribute("uv",new at(o,2));let h=document.createElement("canvas");h.width=64,h.height=64;let d=h.getContext("2d");d.fillStyle="#2b3339",d.fillRect(0,0,64,64),d.fillStyle="#1b2126";for(let x=0;x<=64;x+=16)d.fillRect(0,x,64,1),d.fillRect(x,0,1,64);d.fillStyle="rgba(150,164,168,0.28)";for(let x=0;x<64;x+=16)for(let m=8;m<64;m+=16)d.fillRect(x+1,m,2,2);let u=new Ut(h);u.colorSpace=pt,u.magFilter=vt,u.wrapS=u.wrapT=xn,u.repeat.set(4,4);let f=new K(l,new Le({map:u,roughness:.78,metalness:.42,side:Gt}));f.name="hull-shell",i.add(f);let g=new K(new $e(8.6+.06,8.6+.06,.9,24,1,!0),new Le({color:8137252,roughness:.8,side:Gt}));return g.scale.z=70/(8.6*2),g.position.set(0,-1.4+.45,2/2),g.visible=!1,i.add(g),i}function fu(){let i=new pe,e=new Le({color:12172462,roughness:.82,flatShading:!0}),t=new Le({color:4936271,roughness:.7,metalness:.3,flatShading:!0}),n=new K(new $e(1.7,2,7.4,12),new Le({color:9321004,roughness:.76}));n.position.set(0,xt[5].y+4.4,20),n.rotation.x=-.06,i.add(n);let r=new K(new $e(1.75,1.75,1.1,12),t);r.position.set(0,xt[5].y+8.4,20),i.add(r),[[-24,12],[26,8]].forEach(([a,c])=>{let l=new K(new $e(.16,.24,c,8),e);l.position.set(0,xt[4].y+c/2,a),i.add(l);let h=new K(new tt(5,.16,.16),e);h.position.set(0,xt[4].y+c*.72,a),i.add(h);let d=new K(new qt(.18,8,6),new Le({color:16771520,emissive:16764810,emissiveIntensity:2}));d.position.set(0,xt[4].y+c,a),i.add(d)});let s=new K(new tt(13.6,xt[5].y-xt[3].y,24),e);s.position.set(0,(xt[5].y+xt[3].y)/2,-9),i.add(s);let o=new K(new tt(13.2,xt[5].clear+.4,8),e);return o.position.set(0,xt[5].y+xt[5].clear/2,-18.6),i.add(o),i}function pu(){let i=new pe;i.name="exterior";let e=new K(new qt(320,24,16),new Dn({map:Fy(),side:nn,fog:!1,depthWrite:!1}));e.name="sky",i.add(e);let t=new Le({map:By(),color:8231588,roughness:.24,metalness:.34,emissive:662566,emissiveIntensity:.7}),n=new K(new At(620,620,24,24),t);n.rotation.x=-Math.PI/2,n.position.y=-1.4,n.name="ocean",i.add(n);let r=n.geometry.getAttribute("position").clone(),s=new Rs(12900068,.9);s.position.set(-60,70,-110),i.add(s),i.add(s.target);let o=new K(new Ht(7,20),new Dn({color:15266036,fog:!1,depthWrite:!1}));o.position.set(-140,150,-250),o.lookAt(0,0,0),i.add(o);let a=new Yi(7311008,1911344,.55);i.add(a);let c=0,l=0;return{root:i,ocean:n,moon:s,skyAmbient:a,update(h){let d=t.map;if(d&&(d.offset.x=h*.006%1,d.offset.y=h*.017%1),l+=1,l%6!==0)return;let u=n.geometry.getAttribute("position"),f=.34+c*.9;for(let g=0;g<u.count;g+=1){let x=r.getX(g),m=r.getY(g);u.setZ(g,Math.sin(x*.07+h*.55)*f+Math.cos(m*.05-h*.38)*f*.7)}u.needsUpdate=!0,n.geometry.computeVertexNormals()},setStormy(h){c=h,t.color.setHSL(.55,.14,.36-h*.1)}}}var Ot=.2,Oy=new Le({color:7039584,emissive:1315855,emissiveIntensity:1,roughness:.6}),zy=.06,zc=class{constructor(){this.buckets=new Map}add(e,t,n){let r=e.clone().applyMatrix4(n),s=r.index?r.toNonIndexed():r;s!==r&&r.dispose();for(let a of Object.keys(s.attributes))a!=="position"&&a!=="normal"&&a!=="uv"&&s.deleteAttribute(a);if(!s.getAttribute("uv")){let a=s.getAttribute("position").count;s.setAttribute("uv",new at(new Float32Array(a*2),2))}let o=this.buckets.get(t);o?o.push(s):this.buckets.set(t,[s])}flush(e,t){let n=0;this.buckets.forEach((r,s)=>{let o=r.length===1?r[0]:Uc(r,!1);if(!o){Yt("builder",`merge failed for ${t} bucket ${n}`);return}r.length>1&&r.forEach(c=>c.dispose()),o.computeBoundingSphere();let a=new K(o,s);a.name=`${t}-${n}`,a.matrixAutoUpdate=!1,e.add(a),n+=1}),this.buckets.clear()}};function Xs(i,e){e.updateMatrixWorld(!0),e.traverse(t=>{let n=t;if(!n.isMesh)return;let r=Array.isArray(n.material)?n.material[0]:n.material;i.add(n.geometry,r,n.matrixWorld)}),e.traverse(t=>{let n=t;n.isMesh&&n.geometry.dispose()})}function Hy(i){i.updateMatrixWorld(!0);let e=new Mt().copy(i.matrixWorld).invert(),t=new Map,n=[];i.traverse(r=>{let s=r;if(!s.isMesh)return;n.push(s);let o=Array.isArray(s.material)?s.material[0]:s.material,a=new Mt().multiplyMatrices(e,s.matrixWorld),c=s.geometry.clone().applyMatrix4(a),l=c.index?c.toNonIndexed():c;l!==c&&c.dispose();for(let d of Object.keys(l.attributes))d!=="position"&&d!=="normal"&&d!=="uv"&&l.deleteAttribute(d);if(!l.getAttribute("uv")){let d=l.getAttribute("position").count;l.setAttribute("uv",new at(new Float32Array(d*2),2))}let h=t.get(o);h?h.push(l):t.set(o,[l])}),n.forEach(r=>{r.geometry.dispose(),r.removeFromParent()}),t.forEach((r,s)=>{let o=r.length===1?r[0]:Uc(r,!1);o&&(r.length>1&&r.forEach(a=>a.dispose()),i.add(new K(o,s)))})}var Gy=new Mt,mu=new zn,Vy=new U(1,1,1),gu=new U;function Wy(i,e,t,n=0){return gu.set(i,e,t),mu.setFromAxisAngle(new U(0,1,0),n),Gy.compose(gu,mu,Vy).clone()}function Pt(i,e,t,n,r,s,o,a,c){let l=n-t,h=s-r,d=a-o;if(l<=1e-4||h<=1e-4||d<=1e-4)return;let u=new tt(l,h,d),f=u.getAttribute("uv"),g=[[d,h],[d,h],[l,d],[l,d],[l,h],[l,h]];for(let x=0;x<6;x+=1){let[m,p]=g[x];for(let E=0;E<4;E+=1){let v=x*4+E;f.setXY(v,f.getX(v)*(m/c),f.getY(v)*(p/c))}}f.needsUpdate=!0,i.add(u,e,Wy((t+n)/2,(r+s)/2,(o+a)/2)),u.dispose()}function di(i,e,t){let n=[...t].sort((o,a)=>o.at-a.at),r=[],s=i;for(let o of n){let a=o.at-o.width/2,c=o.at+o.width/2;c<=i||a>=e||(a>s&&r.push([s,Math.min(a,e)]),s=Math.max(s,Math.min(c,e)))}return s<e&&r.push([s,e]),r}var Xy={engine:{walls:[["rust",16],["soot",8],["scuff",5]],floor:[["soot",6],["wear",4]],ceiling:[["soot",5],["rust",4]]},pump:{walls:[["rust",12],["salt",5],["scuff",4]],floor:[["wear",4],["soot",2]],ceiling:[["rust",3],["stain",2]]},hold:{walls:[["rust",14],["mould",6],["salt",4]],floor:[["wear",3]],ceiling:[["rust",5],["stain",3]]},service:{walls:[["rust",7],["scuff",7],["stain",3]],floor:[["wear",5]],ceiling:[["stain",3]]},corridor:{walls:[["scuff",10],["stain",4],["wear",3]],floor:[["wear",7]],ceiling:[["stain",4]]},cabin:{walls:[["stain",3],["scuff",3]],floor:[["wear",3]],ceiling:[["stain",2]]},bathroom:{walls:[["mould",7],["salt",4]],floor:[["mould",3],["wear",2]],ceiling:[["mould",3],["stain",2]]},salon:{walls:[["scuff",5],["stain",3]],floor:[["wear",6]],ceiling:[["stain",3]]},foyer:{walls:[["scuff",6],["stain",3]],floor:[["wear",6]],ceiling:[["stain",3]]},playroom:{walls:[["scuff",6],["stain",4],["mould",3]],floor:[["wear",5]],ceiling:[["stain",3]]},promenade:{walls:[["salt",8],["rust",6],["scuff",4]],floor:[["wear",6],["salt",4]],ceiling:[["salt",3],["rust",3]]},"open-deck":{walls:[["salt",7],["rust",7]],floor:[["wear",5],["salt",5]],ceiling:[]},bridge:{walls:[["salt",4],["scuff",3]],floor:[["wear",3]],ceiling:[["stain",2]]},chart:{walls:[["stain",3],["scuff",2]],floor:[["wear",2]],ceiling:[["stain",2]]},office:{walls:[["stain",3],["scuff",2]],floor:[["wear",2]],ceiling:[["stain",2]]},stairwell:{walls:[["scuff",6],["rust",3]],floor:[["wear",4]],ceiling:[["stain",2]]}};function qy(i,e,t,n,r,s){let o=Xy[e.kind];if(!o)return;let a=new Zt(e.id.split("").reduce((d,u)=>d+u.charCodeAt(0),17)*131),c=.012,l=(d,u,f)=>d.some(g=>Math.abs(g.at-u)<g.width/2+f),h=["port","stbd","fwd","aft"];o.walls.forEach(([d,u])=>{let f=Za(d);for(let g=0;g<u;g+=1){let x=h[Math.floor(a.next()*4)];if(e.rail?.includes(x)||e.noWall?.includes(x))continue;let m=x==="port"||x==="stbd"?"x":"z",p=x==="port"?e.x1:x==="stbd"?e.x2:x==="fwd"?e.z1:e.z2,E=x==="port"||x==="fwd"?1:-1,v=m==="x"?e.z1:e.x1,S=m==="x"?e.z2:e.x2;if(S-v<1.2)continue;let b=a.range(v+.5,S-.5),y=a.range(.5,1.5);if(l(r.get(s(e.deck,m,p))??[],b,y*.5))continue;let T=d==="rust"||d==="stain"?a.range(t+1.5,n-.4):a.range(t+.3,t+1.5),k=new K(new At(y,y*a.range(.8,1.6)),f);m==="x"?(k.rotation.y=E>0?Math.PI/2:-Math.PI/2,k.position.set(p+E*c,T,b)):(k.rotation.y=E>0?0:Math.PI,k.position.set(b,T,p+E*c)),k.updateMatrixWorld(!0),i.add(k.geometry,f,k.matrixWorld),k.geometry.dispose()}}),o.floor.forEach(([d,u])=>{let f=Za(d);for(let g=0;g<u;g+=1){let x=a.range(.9,2.4),m=new K(new At(x,x*a.range(.7,1.4)),f);m.rotation.x=-Math.PI/2,m.rotation.z=a.range(0,Math.PI),m.position.set(a.range(e.x1+.6,e.x2-.6),t+c,a.range(e.z1+.6,e.z2-.6)),!e.floorHoles?.some(p=>Yy(p,m.position.x,m.position.z))&&(m.updateMatrixWorld(!0),i.add(m.geometry,f,m.matrixWorld),m.geometry.dispose())}}),e.openSky||o.ceiling.forEach(([d,u])=>{let f=Za(d);for(let g=0;g<u;g+=1){let x=a.range(.8,2.2),m=new K(new At(x,x*a.range(.7,1.4)),f);m.rotation.x=Math.PI/2,m.rotation.z=a.range(0,Math.PI),m.position.set(a.range(e.x1+.6,e.x2-.6),n-c,a.range(e.z1+.6,e.z2-.6)),m.updateMatrixWorld(!0),i.add(m.geometry,f,m.matrixWorld),m.geometry.dispose()}})}var Yy=(i,e,t)=>e>=i.x1&&e<=i.x2&&t>=i.z1&&t<=i.z2,or=1.12;function xu(){let i=new pe;i.name="orpheus";let e=new Map,t=new Map;xt.forEach(b=>{let y=new pe;y.name=`deck-${b.id}`,i.add(y),e.set(b.id,y),t.set(b.id,new zc)});let n=[],r=new Map,s=[],o=[],a=new Map,c=[],l=b=>t.get(b),h=b=>e.get(b),d=pu();i.add(uu()),i.add(fu());let u=new Yi(9413547,5590080,.66);i.add(u);let f={"cabin-301":{port:[-3.6]},"cabin-302":{stbd:[-3.6]},"cabin-303":{port:[-8.2]},"cabin-304":{stbd:[-8.2]},"cabin-305":{port:[-12.8]},"cabin-306":{stbd:[-12.8]},"cabin-307":{port:[-17.2,-19.6]},"cabin-308":{stbd:[-18.2]},"d3-linen":{port:[19.5]},"d2-mess":{port:[-11.5,-7.5]},"d2-control":{stbd:[-11.5,-7.5]},"d2-gallery":{port:[20,24,27],stbd:[20,24,27]},"chart-room":{port:[-13.5]},"captain-office":{stbd:[-13.5]}},g={salon:{port:[-11,-7.4,-3.8,-1.2].map(b=>({at:b,width:2.2,height:1.5,sill:1})),stbd:[-11,-7.4,-3.8,-1.2].map(b=>({at:b,width:2.2,height:1.5,sill:1}))},foyer:{port:[3,6.4].map(b=>({at:b,width:1.8,height:1.5,sill:1})),stbd:[3,6.4].map(b=>({at:b,width:1.8,height:1.5,sill:1}))},"d4-fwd-lobby":{port:[-18.6].map(b=>({at:b,width:2,height:1.5,sill:1})),stbd:[-18.6].map(b=>({at:b,width:2,height:1.5,sill:1}))},wheelhouse:{fwd:[-4.4,-2.2,0,2.2,4.4].map(b=>({at:b,width:2,height:1.35,sill:1.05})),port:[-20].map(b=>({at:b,width:1.6,height:1.2,sill:1.05})),stbd:[-20].map(b=>({at:b,width:1.6,height:1.2,sill:1.05}))},"d2-mess":{}},x=new Map,m=(b,y,T)=>`${b}|${y}|${T.toFixed(2)}`,p=(b,y)=>y==="port"?b.x1:y==="stbd"?b.x2:y==="fwd"?b.z1:b.z2,E=b=>b==="port"?"stbd":b==="stbd"?"port":b==="fwd"?"aft":"fwd",v=b=>{if(b.startsWith("TRUNK@"))return{deck:b.slice(6),rect:{x1:be.x1,x2:be.x2,z1:be.z1,z2:be.z2},trunk:!0};let y=Wn(b);return y?{deck:y.deck,rect:y,trunk:!1}:null};ir.forEach(b=>{let y=v(b.a),T=v(b.b);if(!y||!T){Yt("builder",`door ${b.id} references an unknown space (${b.a} / ${b.b})`);return}let k=b.side==="port"||b.side==="stbd"?"x":"z",_=b.side==="port"?y.rect.x1:b.side==="stbd"?y.rect.x2:b.side==="fwd"?y.rect.z1:y.rect.z2,M=E(b.side),D=M==="port"?T.rect.x1:M==="stbd"?T.rect.x2:M==="fwd"?T.rect.z1:T.rect.z2,L={at:b.at,width:b.width,height:b.height,sill:b.coaming??0,door:b};[{deck:y.deck,plane:_},{deck:T.deck,plane:D}].forEach(({deck:ee,plane:re})=>{let xe=m(ee,k,re),ke=x.get(xe);ke?ke.push(L):x.set(xe,[L])});let N=y.deck,z=nt(N).y,O=Math.min(_,D),G=Math.max(_,D),Y=new U,H=k==="x"?{x1:O-Ot,x2:G+Ot,z1:b.at-b.width/2,z2:b.at+b.width/2,y1:z,y2:z+b.height}:{x1:b.at-b.width/2,x2:b.at+b.width/2,z1:O-Ot,z2:G+Ot,y1:z,y2:z+b.height};k==="x"?Y.set((O+G)/2,z+b.height/2,b.at):Y.set(b.at,z+b.height/2,(O+G)/2);let V={def:b,pivot:null,open:b.kind==="open"?1:0,target:b.kind==="open"?1:0,locked:!!b.locked||b.kind==="sealed",swing:b.side==="port"||b.side==="fwd"?1:-1,collider:H,centre:Y,deck:N,baseYaw:0};if(b.kind!=="open"){let ee=b.kind==="watertight"||b.kind==="weather"||b.kind==="sealed"?w.darkSteel:w.darkWood,re=new pe,xe=new K(new tt(b.width-.04,b.height-.04,.08),ee);xe.position.set((b.width-.04)/2,(b.height-.04)/2,0),re.add(xe);let ke=new K(new qt(.05,8,6),w.brass);if(ke.position.set(b.width-.18,b.height*.47,.07),re.add(ke),b.kind==="watertight"||b.kind==="sealed"){let je=new K(new fn(.19,.028,5,12),w.brass);je.position.set(b.width/2,b.height*.5,.08),re.add(je);for(let j=0;j<4;j+=1){let oe=new K(new tt(.022,.36,.022),w.brass);oe.position.copy(je.position),oe.rotation.z=j/4*Math.PI,re.add(oe)}}if(b.plate){let je=document.createElement("canvas");je.width=96,je.height=48;let j=je.getContext("2d");j.fillStyle="#b8964f",j.fillRect(0,0,96,48),j.strokeStyle="#3d2f1c",j.lineWidth=4,j.strokeRect(3,3,90,42),j.fillStyle="#241a12",j.font="bold 30px serif",j.textAlign="center",j.textBaseline="middle",j.fillText(b.plate,48,26);let oe=new Ut(je);oe.colorSpace=pt,oe.magFilter=vt;let Ae=new K(new At(.3,.15),new Le({map:oe,roughness:.42,metalness:.4,emissive:2760980,emissiveIntensity:.4}));Ae.position.set((b.width-.04)/2,b.height-.28,.05),re.add(Ae);let ze=Ae.clone();ze.position.z=-.05,ze.rotation.y=Math.PI,re.add(ze)}let Xe=b.width/2;k==="x"?(re.position.set((O+G)/2,z+(b.coaming??0),b.at-Xe*V.swing),re.rotation.y=V.swing>0?Math.PI/2:-Math.PI/2):(re.position.set(b.at-Xe*V.swing,z+(b.coaming??0),(O+G)/2),re.rotation.y=V.swing>0?0:Math.PI),re.name=`door-${b.id}`,Hy(re),h(N).add(re),V.pivot=re,V.baseYaw=re.rotation.y}r.set(b.id,V),b.kind!=="open"&&(V.collider.door=b.id)}),Gs.forEach(b=>{let y=nt(b.deck),T=y.y,k=b.clear??y.clear,_=T+k,M=l(b.deck),D=Jn(b.floor),L=Jn(b.wall),N=b.ceil?Jn(b.ceil):null,z=b.floorHoles??[],O=[{x1:b.x1,x2:b.x2,z1:b.z1,z2:b.z2}];z.forEach(Y=>{let H=[];O.forEach(V=>{let ee=Math.max(V.x1,Y.x1),re=Math.min(V.x2,Y.x2),xe=Math.max(V.z1,Y.z1),ke=Math.min(V.z2,Y.z2);if(ee>=re||xe>=ke){H.push(V);return}V.z1<xe&&H.push({x1:V.x1,x2:V.x2,z1:V.z1,z2:xe}),ke<V.z2&&H.push({x1:V.x1,x2:V.x2,z1:ke,z2:V.z2}),V.x1<ee&&H.push({x1:V.x1,x2:ee,z1:xe,z2:ke}),re<V.x2&&H.push({x1:re,x2:V.x2,z1:xe,z2:ke})}),O.length=0,O.push(...H)}),O.forEach(Y=>{Pt(M,D.material,Y.x1,Y.x2,T-.16,T,Y.z1,Y.z2,D.tile)}),!b.openSky&&N&&Pt(M,N.material,b.x1,b.x2,_,_+.14,b.z1,b.z2,N.tile),["port","stbd","fwd","aft"].forEach(Y=>{if(b.noWall?.includes(Y))return;let H=Y==="port"||Y==="stbd"?"x":"z",V=p(b,Y),ee=Y==="port"||Y==="fwd"?-1:1,re=H==="x"?b.z1:b.x1,xe=H==="x"?b.z2:b.x2,ke=b.rail?.includes(Y)??!1,Xe=b.hull?.includes(Y)??!1,j=(x.get(m(b.deck,H,V))??[]).filter(Z=>Z.at-Z.width/2>=re-.6&&Z.at+Z.width/2<=xe+.6);if(ke){let Z=new pe;Ky(Z,H,V,ee,re,xe,T,j),Xs(M,Z),n.push(H==="x"?{x1:Math.min(V,V+ee*Ot),x2:Math.max(V,V+ee*Ot),z1:re,z2:xe,y1:T,y2:T+or}:{x1:re,x2:xe,z1:Math.min(V,V+ee*Ot),z2:Math.max(V,V+ee*Ot),y1:T,y2:T+or});return}let oe=(g[b.id]?.[Y]??[]).slice(),Ae=Xe?f[b.id]?.[Y]??[]:[];!Xe&&(f[b.id]?.[Y]?.length??0)>0&&Yt("builder",`portholes requested on non-hull side ${Y} of ${b.id} \u2014 ignored`);let ze=Ae.map(Z=>({at:Z,width:.9,height:.9,sill:1.25})),Be=[...oe,...ze],lt=V,se=V+ee*zy,ce=Math.min(lt,se),$=Math.max(lt,se),C=[...j,...Be];Qa(T,_,C).forEach(({yLow:Z,yHigh:me,blockers:ue})=>{di(re,xe,ue).forEach(([Te,P])=>{H==="x"?Pt(M,L.material,ce,$,Z,me,Te,P,L.tile):Pt(M,L.material,Te,P,Z,me,ce,$,L.tile)})});let ae=Math.min(V,V+ee*Ot),he=Math.max(V,V+ee*Ot);di(re,xe,j).forEach(([Z,me])=>{me-Z<.02||n.push(H==="x"?{x1:ae,x2:he,z1:Z,z2:me,y1:T,y2:_}:{x1:Z,x2:me,z1:ae,z2:he,y1:T,y2:_})}),oe.forEach(Z=>{let me=new pe;$y(me,H,V,ee,Z,T,b),Xs(M,me)}),Ae.forEach(Z=>{let me=new pe;jy(me,H,V,ee,Z,T),Xs(M,me)}),j.forEach(Z=>{Z.door&&Zy(M,H,V,ee,Z,T)})}),qy(M,b,T,_,x,m)}),Ti.forEach(b=>{let y=Wn(b.room);if(!y)return;let T=nt(y.deck),k=T.y,_=k+(y.clear??T.clear),M=l(y.deck),D=Jn(b.floor),L=Jn(b.wall);Pt(M,D.material,b.x1,b.x2,k-.02,k+.02,b.z1,b.z2,D.tile),b.partitions.forEach(N=>{let z=N==="port"||N==="stbd"?"x":"z",O=N==="port"?b.x1:N==="stbd"?b.x2:N==="fwd"?b.z1:b.z2,G=N==="port"||N==="fwd"?-1:1,Y=z==="x"?b.z1:b.x1,H=z==="x"?b.z2:b.x2,V=$a.find(re=>re.zone===b.id&&re.side===N),ee=V?[{at:V.at,width:V.width,height:V.height,sill:0}]:[];Qa(k,_,ee).forEach(({yLow:re,yHigh:xe,blockers:ke})=>{di(Y,H,ke).forEach(([Xe,je])=>{z==="x"?Pt(M,L.material,O,O+G*.1,re,xe,Xe,je,L.tile):Pt(M,L.material,Xe,je,re,xe,O,O+G*.1,L.tile)})}),di(Y,H,ee).forEach(([re,xe])=>{if(xe-re<.02)return;let ke=Math.min(O,O+G*.1),Xe=Math.max(O,O+G*.1);n.push(z==="x"?{x1:ke,x2:Xe,z1:re,z2:xe,y1:k,y2:_}:{x1:re,x2:xe,z1:ke,z2:Xe,y1:k,y2:_})})})}),Jy(t,n,x,m);let S=new Map;return nu.forEach(b=>{e1(b,{deadLamps:S,pools:t,groups:e,colliders:n,lights:s,mirrors:o,props:a,animated:c})}),eu.forEach(b=>{let y=nt(b.lowerDeck).y,T=nt(b.upperDeck).y,k=new pe,_=T-y+.6;[-.22,.22].forEach(D=>{let L=new K(new $e(.035,.035,_,6),w.steel);L.position.set(D,_/2,0),k.add(L)});for(let D=.3;D<_-.2;D+=.32){let L=new K(new $e(.025,.025,.5,6),w.steel);L.rotation.z=Math.PI/2,L.position.set(0,D,0),k.add(L)}k.position.set(b.x,y,b.z),Xs(l(b.lowerDeck),k);let M=new Nt;M.position.set(b.x,y,b.z),h(b.lowerDeck).add(M),a.set(b.id,M)}),xt.forEach(b=>{t.get(b.id).flush(h(b.id),`static-${b.id}`)}),{root:i,deckGroups:e,colliders:n,doors:r,lights:s,mirrors:o,props:a,animated:c,exterior:d,interiorAmbient:u}}function Qa(i,e,t){if(t.length===0)return[{yLow:i,yHigh:e,blockers:[]}];let n=new Set([i,e]);t.forEach(o=>{n.add(Math.max(i,i+o.sill)),n.add(Math.min(e,i+o.sill+o.height))});let r=[...n].sort((o,a)=>o-a),s=[];for(let o=0;o<r.length-1;o+=1){let a=r[o],c=r[o+1];if(c-a<.01)continue;let l=(a+c)/2,h=t.filter(d=>l>i+d.sill&&l<i+d.sill+d.height);s.push({yLow:a,yHigh:c,blockers:h})}return s}function Ky(i,e,t,n,r,s,o,a){let c=t+n*.09;di(r,s,a).forEach(([l,h])=>{if(h-l<.2)return;let d=new K(e==="x"?new tt(.1,.42,h-l):new tt(h-l,.42,.1),w.paintedWhite);d.position.set(e==="x"?c:(l+h)/2,o+.21,e==="x"?(l+h)/2:c),i.add(d),[.72,or].forEach(u=>{let f=new K(new $e(.035,.035,h-l,6),w.brass);f.rotation.x=Math.PI/2,e==="x"?f.position.set(c,o+u,(l+h)/2):(f.rotation.z=Math.PI/2,f.rotation.x=0,f.position.set((l+h)/2,o+u,c)),i.add(f)});for(let u=l;u<=h+.001;u+=1.5){let f=new K(new tt(.06,or,.06),w.steel);e==="x"?f.position.set(c,o+or/2,u):f.position.set(u,o+or/2,c),i.add(f)}})}function $y(i,e,t,n,r,s,o){let a=s+r.sill+r.height/2,c=new K(new At(r.width,r.height),w.glass),l=o.kind==="bridge"?w.darkSteel:w.brass;e==="x"?(c.rotation.y=n>0?-Math.PI/2:Math.PI/2,c.position.set(t+n*.05,a,r.at)):(c.rotation.y=n>0?Math.PI:0,c.position.set(r.at,a,t+n*.05)),i.add(c);let h=.07;[[r.at-r.width/2,a,h,r.height+h*2],[r.at+r.width/2,a,h,r.height+h*2],[r.at,a-r.height/2,r.width+h*2,h],[r.at,a+r.height/2,r.width+h*2,h],[r.at,a,h*.7,r.height]].forEach(([u,f,g,x])=>{let m=new K(new tt(e==="x"?.12:g,x,e==="x"?g:.12),l);e==="x"?m.position.set(t+n*.06,f,u):m.position.set(u,f,t+n*.06),i.add(m)})}function jy(i,e,t,n,r,s){let o=s+1.7,a=new pe,c=new ai;c.moveTo(-.45,-.45),c.lineTo(.45,-.45),c.lineTo(.45,.45),c.lineTo(-.45,.45),c.closePath();let l=new Vi;l.absarc(0,0,.3,0,Math.PI*2,!0),c.holes.push(l);let h=new K(new Ms(c,16),w.darkSteel);a.add(h);let d=new K(new Ht(.3,14),w.glass);d.position.z=-.04,a.add(d);let u=new K(new fn(.32,.05,5,14),w.brass);a.add(u);let f=new K(new $e(.3,.3,.4,14,1,!0),w.darkSteel);f.rotation.x=Math.PI/2,f.position.z=-.2,a.add(f);for(let g=0;g<6;g+=1){let x=g/6*Math.PI*2,m=new K(new tt(.07,.11,.05),w.brass);m.position.set(Math.cos(x)*.38,Math.sin(x)*.38,.03),a.add(m)}e==="x"?(a.rotation.y=n>0?Math.PI/2:-Math.PI/2,a.position.set(t+n*.03,o,r)):(a.rotation.y=n>0?0:Math.PI,a.position.set(r,o,t+n*.03)),i.add(a)}function Zy(i,e,t,n,r,s){let o=r.door,a=Math.min(t,t+n*Ot),c=Math.max(t,t+n*Ot),l=o.kind==="watertight"||o.kind==="sealed"||o.kind==="weather"?w.darkSteel:w.wood,h=r.at-r.width/2,d=r.at+r.width/2;[h,d].forEach(u=>{e==="x"?Pt(i,l,a,c,s,s+r.height,u-.06,u+.06,2):Pt(i,l,u-.06,u+.06,s,s+r.height,a,c,2)}),e==="x"?Pt(i,l,a,c,s+r.height,s+r.height+.09,h,d,2):Pt(i,l,h,d,s+r.height,s+r.height+.09,a,c,2),r.sill>.01?e==="x"?Pt(i,w.darkSteel,a,c,s,s+r.sill,h,d,2):Pt(i,w.darkSteel,h,d,s,s+r.sill,a,c,2):(o.kind==="cabin"||o.kind==="interior")&&(e==="x"?Pt(i,w.brass,a,c,s,s+.03,h,d,2):Pt(i,w.brass,h,d,s,s+.03,a,c,2))}function Jy(i,e,t,n){let r=Jn("steelPlate"),s=Jn("carpetCorridor"),o=Jn("panelCorridor");be.decks.forEach((a,c)=>{let l=nt(a),h=i.get(a),d=l.y,u=c===be.decks.length-1,f=be.openDecks.includes(a),g=new pe,x=a==="D3"||a==="D4",m=x?s:r,p=x?o:Jn("paintedSteel"),E=d+zs(a);if(Pt(h,m.material,be.x1,be.x2,d-.16,d,be.landingAftZ1,be.z2,m.tile),Pt(h,m.material,be.x1,be.x2,d-.16,d,be.z1,be.landingFwdZ2,m.tile),Pt(h,m.material,be.x1,Hs.x2,d-.16,d,be.landingFwdZ2,be.landingAftZ1,m.tile),!u){let _=be.landingAftZ1-be.landingFwdZ2,M=zs(a),D=16;for(let N=0;N<D;N+=1){let z=N/D,O=(N+1)/D,G=be.landingAftZ1-z*_,Y=be.landingAftZ1-O*_,H=d+O*M;Pt(h,m.material,be.flightX1,nr.x1,H-.06,H,Math.min(G,Y),Math.max(G,Y),m.tile),Pt(h,p.material,be.flightX1,nr.x1,H-M/D,H-.06,Math.min(G,Y)-.02,Math.min(G,Y)+.04,p.tile)}let L=Math.hypot(_,M);[Hs,nr].forEach((N,z)=>{Pt(h,p.material,N.x1,N.x2,d,d+.34,N.z1,N.z2,p.tile),e.push({x1:N.x1,x2:N.x2,z1:N.z1,z2:N.z2,y1:d,y2:d+1.05});let O=z===0?N.x1+.06:N.x2-.06,G=new K(new $e(.038,.038,L,8),w.brass);G.rotation.x=Math.PI/2+Math.atan2(M,_),G.position.set(O,d+M/2+.95,(be.landingFwdZ2+be.landingAftZ1)/2),g.add(G);for(let Y=be.landingFwdZ2+.4;Y<be.landingAftZ1;Y+=1.5){let H=(be.landingAftZ1-Y)/_,V=new K(new tt(.06,1,.06),w.brass);V.position.set(O,d+H*M+.5,Y),g.add(V)}})}let v=(_,M)=>t.get(n(a,_,M))??[],S=d+zs(a),b=v("z",be.z1);f||(Qa(d,S,b).forEach(({yLow:_,yHigh:M,blockers:D})=>{di(be.x1,be.x2,D).forEach(([L,N])=>{Pt(h,p.material,L,N,_,M,be.z1-Ot,be.z1,p.tile)})}),di(be.x1,be.x2,b).forEach(([_,M])=>{M-_<.02||e.push({x1:_,x2:M,z1:be.z1-Ot,z2:be.z1,y1:d,y2:S})}));let y=v("z",be.z2);f||(Qa(d,S,y).forEach(({yLow:_,yHigh:M,blockers:D})=>{di(be.x1,be.x2,D).forEach(([L,N])=>{Pt(h,p.material,L,N,_,M,be.z2,be.z2+Ot,p.tile)})}),di(be.x1,be.x2,y).forEach(([_,M])=>{M-_<.02||e.push({x1:_,x2:M,z1:be.z2,z2:be.z2+Ot,y1:d,y2:S})})),[be.x1,be.x2].forEach(_=>{let M=_===be.x1?-1:1;(f?[[be.landingFwdZ2,be.landingAftZ1]]:[[be.z1,be.z2]]).forEach(([L,N])=>{if(f){for(let O=L;O<=N+.001;O+=1.4){let G=new K(new tt(.07,1.02,.07),w.brass);G.position.set(_+M*.06,d+.51,O),g.add(G)}let z=new K(new $e(.045,.045,N-L,8),w.brass);z.rotation.x=Math.PI/2,z.position.set(_+M*.06,d+1.02,(L+N)/2),g.add(z),Pt(h,p.material,Math.min(_,_+M*.06),Math.max(_,_+M*.06),d,d+.34,L,N,p.tile),e.push({x1:Math.min(_,_+M*Ot),x2:Math.max(_,_+M*Ot),z1:L,z2:N,y1:d,y2:d+or})}else Pt(h,p.material,Math.min(_,_+M*Ot),Math.max(_,_+M*Ot),d,S,L,N,p.tile),e.push({x1:Math.min(_,_+M*Ot),x2:Math.max(_,_+M*Ot),z1:L,z2:N,y1:d,y2:S})})});let T=new K(new At(.9,.9),new Le({map:Qy(l.number),roughness:.7,emissive:2367514,emissiveIntensity:.4,transparent:!0}));T.position.set(be.x2-.14,d+1.75,be.z2-1.2),T.rotation.y=-Math.PI/2,g.add(T);let k=new K(new qt(.14,8,6),w.lampGlass);k.position.set(0,E-.35,be.landingAftZ1+1.4),g.add(k),Xs(h,g)})}function Qy(i){let e=document.createElement("canvas");e.width=64,e.height=64;let t=e.getContext("2d");t.clearRect(0,0,64,64),t.fillStyle="rgba(24,34,38,0.85)",t.fillRect(4,4,56,56),t.strokeStyle="#b08c4a",t.lineWidth=3,t.strokeRect(6,6,52,52),t.fillStyle="#e8dcb2",t.font="bold 34px monospace",t.textAlign="center",t.textBaseline="middle",t.fillText(String(i),32,34);let n=new Ut(e);return n.colorSpace=pt,n.magFilter=vt,n}function e1(i,e){let t=Ti.find(p=>p.id===i.room),n=t?Wn(t.room):Wn(i.room);if(!n){Yt("props",`prop ${i.id} names an unknown room ${i.room}`);return}let r=hu[i.type];if(!r){Yt("props",`prop ${i.id} has no builder for type ${i.type}`);return}let s=r({variant:i.variant??0,text:i.text}),a=nt(n.deck).y+(i.y??0),c=i.rot??0;s.object.position.set(i.x,a,i.z),s.object.rotation.y=c,s.object.name=i.id;let h=i.id.split("").reduce((p,E)=>p*31+E.charCodeAt(0)>>>0,7)%1e3/1e3,d=(s.lights?.length??0)>0,u=n.kind==="corridor"||n.kind==="stairwell",f=e.deadLamps.get(n.id)??0,g=d&&h<.16&&!u&&f<1;g&&e.deadLamps.set(n.id,f+1);let x=d&&h>.86?(h-.86)/.14:0;if(g&&s.object.traverse(p=>{let E=p;if(!E.isMesh)return;let v=E.material;v?.emissiveIntensity!==void 0&&v.emissiveIntensity>1.5&&(E.material=Oy)}),!!s.animate||!!s.mirror||x>0)e.groups.get(n.deck).add(s.object),e.props.set(i.id,s.object),s.animate&&e.animated.push({id:i.id,kind:s.animate,object:s.object});else{s.object.updateMatrixWorld(!0);let p=e.pools.get(n.deck);s.object.traverse(v=>{let S=v;if(!S.isMesh)return;let b=Array.isArray(S.material)?S.material[0]:S.material;p.add(S.geometry,b,S.matrixWorld)}),s.object.traverse(v=>{let S=v;S.isMesh&&S.geometry.dispose()});let E=new Nt;E.position.set(i.x,a,i.z),E.rotation.y=c,E.name=i.id,e.groups.get(n.deck).add(E),e.props.set(i.id,E)}if(s.colliders?.forEach(p=>{let E=[[p.x1,p.z1],[p.x2,p.z1],[p.x2,p.z2],[p.x1,p.z2]],v=Math.cos(c),S=Math.sin(c),b=1/0,y=-1/0,T=1/0,k=-1/0;E.forEach(([_,M])=>{let D=i.x+_*v+M*S,L=i.z-_*S+M*v;b=Math.min(b,D),y=Math.max(y,D),T=Math.min(T,L),k=Math.max(k,L)}),e.colliders.push({x1:b,x2:y,z1:T,z2:k,y1:a+p.y1,y2:a+p.y2})}),s.lights?.forEach((p,E)=>{if(g)return;let v=new Ki(p.colour,p.intensity,p.distance,1.7),S=Math.cos(c),b=Math.sin(c);v.position.set(i.x+p.x*S+p.z*b,a+p.y,i.z-p.x*b+p.z*S),v.name=`${i.id}-light-${E}`,e.groups.get(n.deck).add(v);let y=[];s.object.traverse(T=>{let k=T;if(!k.isMesh)return;let _=k.material;_&&_.emissiveIntensity!==void 0&&_.emissiveIntensity>1.5&&y.push(k)}),e.lights.push({light:v,kind:p.kind,base:p.intensity*1.55,deck:n.deck,y:v.position.y,dead:!1,flicker:x,glass:y})}),s.mirror){let p=new Ja({width:s.mirror.width,height:s.mirror.height,resolution:256,interval:0}),E=Math.cos(c),v=Math.sin(c);p.mesh.position.set(i.x+s.mirror.z*v,a+s.mirror.y,i.z+s.mirror.z*E),p.mesh.rotation.y=c,e.groups.get(n.deck).add(p.mesh),e.mirrors.push(p)}}var zt=.7,bu=.36,qs=-10,Ys=-36,t1=Math.ceil(20/zt),n1=Math.ceil(74/zt),Gc=class{constructor(){this.nodes=[];this.links=[];this.index=new Map}key(e,t,n){return`${e}:${t}:${n}`}nodeAtExact(e,t,n){return this.index.get(this.key(e,t,n))}nodeAt(e,t,n){let r=Math.round((t-qs)/zt),s=Math.round((n-Ys)/zt),o=this.index.get(this.key(e,r,s));if(o!==void 0)return o;for(let a=1;a<=3;a+=1)for(let c=-a;c<=a;c+=1)for(let l=-a;l<=a;l+=1){let h=this.index.get(this.key(e,r+c,s+l));if(h!==void 0)return h}}nearest(e,t,n){let r,s=1/0;for(let o=0;o<this.nodes.length;o+=1){let a=this.nodes[o],c=nt(a.deck).y,l=(a.x-e)**2+(a.z-n)**2+((c-t)*3)**2;l<s&&(s=l,r=o)}return r}addNode(e,t=!0){let n=this.nodes.length;return this.nodes.push(e),this.links.push([]),t&&this.index.set(this.key(e.deck,e.gx,e.gz),n),n}link(e,t,n,r){this.links[e].push({to:t,cost:n,door:r}),this.links[t].push({to:e,cost:n,door:r})}path(e,t,n,r){if(e===t)return[];let s=[e],o=new Map([[e,0]]),a=new Map,c=this.nodes[t],l=f=>{let g=this.nodes[f],x=Math.abs(nt(g.deck).y-nt(c.deck).y);return Math.hypot(g.x-c.x,g.z-c.z)+x*2.2},h=new Map([[e,l(e)]]),d=new Set,u=0;for(;s.length>0&&u<4e4;){u+=1;let f=0;for(let x=1;x<s.length;x+=1)(h.get(s[x])??1/0)<(h.get(s[f])??1/0)&&(f=x);let g=s.splice(f,1)[0];if(g===t){let x=[g],m=g;for(;a.has(m);)m=a.get(m),x.push(m);return x.reverse(),x.shift(),x}d.add(g);for(let x of this.links[g]){if(d.has(x.to)||x.door&&!n(x.door))continue;if(r){let p=this.nodes[x.to].tags,E=!1;if(r.forEach(v=>{p.has(v)&&(E=!0)}),E)continue}let m=(o.get(g)??1/0)+x.cost;m<(o.get(x.to)??1/0)&&(a.set(x.to,g),o.set(x.to,m),h.set(x.to,m+l(x.to)),s.includes(x.to)||s.push(x.to))}}return[]}nodesInRooms(e){let t=new Set(e),n=[];return this.nodes.forEach((r,s)=>{t.has(r.room)&&n.push(s)}),n}},i1=new Set([]),r1=["playroom","promenade-port","promenade-stbd","foyer","d4-aft-deck","d3-corridor-fwd","d3-corridor-aft"];function yu(i){let e=new Gc,t=i.filter(c=>c.y2-c.y1>.5&&!c.door),n=(c,l,h)=>{let d=h+.9;for(let u of t)if(!(d<u.y1||d>u.y2)&&c>u.x1-.24&&c<u.x2+.24&&l>u.z1-.24&&l<u.z2+.24)return!0;return!1};xt.forEach(c=>{let l=Gs.filter(h=>h.deck===c.id);for(let h=0;h<=t1;h+=1)for(let d=0;d<=n1;d+=1){let u=qs+h*zt,f=Ys+d*zt,g=null;for(let E of l)if(Ai(E,u,f,-.25)){g=E.id;break}let x=Vs(u,f,-.25);if(x&&Ai(Ka,u,f,-.2)||(x&&(g=`trunk-${c.id}`),!g))continue;let m=Ti.find(E=>Ai(E,u,f,-.3));m&&m.room===g&&(g=m.id),!(x&&Ai(Hs,u,f,.15)||x&&Ai(nr,u,f,.15)||Ai(Ka,u,f,-.2)||Wn(g)?.floorHoles?.some(E=>Ai(E,u,f,-.2)))&&(n(u,f,c.y)||e.addNode({deck:c.id,gx:h,gz:d,x:u,z:f,room:g,tags:new Set}))}}),e.nodes.forEach((c,l)=>{[[1,0,zt],[0,1,zt],[1,1,zt*1.414],[1,-1,zt*1.414]].forEach(([d,u,f])=>{let g=e.nodeAtExact(c.deck,c.gx+d,c.gz+u);if(g===void 0)return;let x=e.nodes[g],m=Hc(c,x);if(m!==null){if(d!==0&&u!==0){let p=e.nodeAtExact(c.deck,c.gx+d,c.gz),E=e.nodeAtExact(c.deck,c.gx,c.gz+u);if(p===void 0||E===void 0||Hc(c,e.nodes[p])===null||Hc(c,e.nodes[E])===null)return}e.link(l,g,f,m||void 0)}})});let r=c=>{if(c.startsWith("TRUNK@"))return{deck:c.slice(6),rect:{x1:be.x1,x2:be.x2,z1:be.z1,z2:be.z2}};let l=Wn(c);return l?{deck:l.deck,rect:l}:null},s=(c,l,h,d)=>{let u,f=1/0,g=Math.round((l-qs)/zt),x=Math.round((h-Ys)/zt);for(let m=-3;m<=3;m+=1)for(let p=-3;p<=3;p+=1){let E=e.nodeAtExact(c,g+m,x+p);if(E===void 0)continue;let v=e.nodes[E];if(!d.has(v.room))continue;let S=Math.hypot(v.x-l,v.z-h);S<f&&(f=S,u=E)}return f<=2.6?u:void 0},o=(c,l,h,d,u,f,g)=>{let x=r(l),m=r(h);if(!x||!m){Yt("navgraph",`door ${c} references an unknown space`);return}let p=d==="port"||d==="stbd"?"x":"z",E=d==="port"?x.rect.x1:d==="stbd"?x.rect.x2:d==="fwd"?x.rect.z1:x.rect.z2,v=d==="port"?"stbd":d==="stbd"?"port":d==="fwd"?"aft":"fwd",S=v==="port"?m.rect.x1:v==="stbd"?m.rect.x2:v==="fwd"?m.rect.z1:m.rect.z2,b=(E+S)/2,y=Math.max(0,f/2-bu),T=Math.max(1,Math.floor(y*2/zt)+1),k=new Set([l.startsWith("TRUNK@")?`trunk-${x.deck}`:l]),_=new Set([h.startsWith("TRUNK@")?`trunk-${m.deck}`:h]),M;for(let D=0;D<T;D+=1){let L=T===1?0:-y+D*(y*2)/(T-1),N=p==="x"?b:u+L,z=p==="x"?u+L:b,O=e.addNode({deck:x.deck,gx:Math.round((N-qs)/zt),gz:Math.round((z-Ys)/zt),x:N,z,room:`door:${c}`,tags:new Set(["doorway"])},!1),G=.9,Y=p==="x"?N-Math.sign(b-(E<S?S:E)||-1)*0:N,H=p==="x"?{x:E<S?N-G:N+G,z}:{x:N,z:E<S?z-G:z+G},V=p==="x"?{x:E<S?N+G:N-G,z}:{x:N,z:E<S?z+G:z-G},ee=s(x.deck,H.x,H.z,k),re=s(m.deck,V.x,V.z,_);if(ee===void 0||re===void 0){D===0&&Yt("navgraph",`door ${c} has no walkable cell on one side (a=${ee}, b=${re})`);continue}let xe=g?c:void 0;e.link(O,ee,zt,xe),e.link(O,re,zt,xe),M!==void 0&&e.link(O,M,zt,xe),M=O}};ir.forEach(c=>{o(c.id,c.a,c.b,c.side,c.at,c.width,c.kind!=="open")}),$a.forEach(c=>{let l=Ti.find(v=>v.id===c.zone),h=l?Wn(l.room):void 0;if(!l||!h)return;let d=c.side==="port"||c.side==="stbd"?"x":"z",u=c.side==="port"?l.x1:c.side==="stbd"?l.x2:c.side==="fwd"?l.z1:l.z2,f=Math.max(0,c.width/2-bu),g=d==="x"?u:c.at,x=d==="x"?c.at:u,m=e.addNode({deck:h.deck,gx:Math.round((g-qs)/zt),gz:Math.round((x-Ys)/zt),x:g,z:x,room:`door:${c.id}`,tags:new Set(["doorway"])},!1),p=s(h.deck,d==="x"?g-.9:g,d==="x"?x:x-.9,new Set([l.id])),E=s(h.deck,d==="x"?g+.9:g,d==="x"?x:x+.9,new Set([l.room]));p!==void 0&&e.link(m,p,zt),E!==void 0&&e.link(m,E,zt),(p===void 0||E===void 0)&&Yt("navgraph",`zone door ${c.id} could not reach both sides`)});for(let c=0;c<xt.length-1;c+=1){let l=xt[c],h=xt[c+1];if(!be.decks.includes(l.id)||!be.decks.includes(h.id))continue;let d=e.nodeAt(l.id,1.6,be.landingAftZ1+1.2),u=e.nodeAt(h.id,1.6,be.landingFwdZ2-1.2);d!==void 0&&u!==void 0?e.link(d,u,9):Yt("navgraph",`no stair link between ${l.id} and ${h.id}`)}let a=new Set(e.nodesInRooms(r1));return e.nodes.forEach((c,l)=>{a.has(l)&&c.tags.add("child-route"),i1.has(c.room)&&c.tags.add("no-creature")}),e}function Hc(i,e){if(i.room===e.room)return"";let t=i.room.startsWith("trunk-"),n=e.room.startsWith("trunk-"),r=Ti.find(l=>l.id===i.room),s=Ti.find(l=>l.id===e.room);if(r&&r.room===e.room||s&&s.room===i.room)return"door-bath-307";if(t&&be.openDecks.includes(i.deck)||n&&be.openDecks.includes(e.deck))return"";let o=t?`TRUNK@${i.deck}`:i.room,a=n?`TRUNK@${e.deck}`:e.room,c=ir.find(l=>l.a===o&&l.b===a||l.a===a&&l.b===o);return c?c.kind==="open"?"":c.id:null}var el=class{constructor(e){this.buckets=new Map;this.dynamic=new Map;e.forEach(t=>this.insert(t))}key(e,t){return`${e}:${t}`}insert(e){let t=Math.floor(e.x1/3),n=Math.floor(e.x2/3),r=Math.floor(e.z1/3),s=Math.floor(e.z2/3);for(let o=t;o<=n;o+=1)for(let a=r;a<=s;a+=1){let c=this.key(o,a),l=this.buckets.get(c);l?l.push(e):this.buckets.set(c,[e])}}setDynamic(e,t){t?this.dynamic.set(e,t):this.dynamic.delete(e)}near(e,t,n){let r=[],s=Math.floor((e-n)/3),o=Math.floor((e+n)/3),a=Math.floor((t-n)/3),c=Math.floor((t+n)/3);for(let l=s;l<=o;l+=1)for(let h=a;h<=c;h+=1){let d=this.buckets.get(this.key(l,h));d&&r.push(...d)}return this.dynamic.forEach(l=>r.push(l)),r}free(e,t,n,r,s){let o=n+.42,a=n+r,c=s-.02;for(let l of this.near(e,t,s))if(!(l.y2<=o||l.y1>=a)&&e>l.x1-c&&e<l.x2+c&&t>l.z1-c&&t<l.z2+c)return!1;return!0}floorAt(e,t,n,r){let s=n;for(let o of this.near(e,t,r*.6))o.y2<=n+.01||o.y2>n+.42||o.y1>n+.05||e>o.x1-r*.6&&e<o.x2+r*.6&&t>o.z1-r*.6&&t<o.z2+r*.6&&(s=Math.max(s,o.y2));return s}depenetrate(e,t,n,r,s){let o=n+.42,a=n+r,c=s-.02*2,l=null;for(let h of this.near(e,t,s)){if(h.y2<=o||h.y1>=a)continue;let d=e-(h.x1-c),u=h.x2+c-e,f=t-(h.z1-c),g=h.z2+c-t;if(d<=0||u<=0||f<=0||g<=0)continue;let x=Math.min(d,u,f,g);l&&x>=l.overlap||(x===d?l={x:h.x1-c-.002,z:t,overlap:x}:x===u?l={x:h.x2+c+.002,z:t,overlap:x}:x===f?l={x:e,z:h.z1-c-.002,overlap:x}:l={x:e,z:h.z2+c+.002,overlap:x})}return l?{x:l.x,z:l.z}:null}clearLine(e,t,n,r,s,o){let a=Math.hypot(r-e,o-n),c=Math.max(2,Math.ceil(a/.45));for(let l=1;l<c;l+=1){let h=l/c,d=e+(r-e)*h,u=t+(s-t)*h,f=n+(o-n)*h;for(let g of this.near(d,f,.05))if(!(u<g.y1||u>g.y2)&&d>g.x1&&d<g.x2&&f>g.z1&&f<g.z2)return!1}return!0}};var ar={eyeV:.42,noseV:.62,mouthV:.745},Or=(i,e={})=>new Le({color:i,roughness:.92,flatShading:!0,...e});function vu(i){let t=new Zt(i.seed*977+13),n=document.createElement("canvas");n.width=128,n.height=128;let r=n.getContext("2d"),s=i.gaunt??.5,o=i.age??.4,a=i.asymmetry,c=new ot(i.skin),l=y=>Math.round(y*128),h=(y,T)=>{let k=c.clone();return k.offsetHSL(.005,-.04*y,-.2*y),`rgba(${Math.round(k.r*255)},${Math.round(k.g*255)},${Math.round(k.b*255)},${T})`};r.fillStyle=`#${c.getHexString()}`,r.fillRect(0,0,128,128);for(let y=0;y<150;y+=1){let T=c.clone();T.offsetHSL(t.range(-.03,.04),t.range(-.12,.07),t.range(-.12,.06)),r.fillStyle=`rgba(${Math.round(T.r*255)},${Math.round(T.g*255)},${Math.round(T.b*255)},0.45)`,r.fillRect(t.range(0,128),t.range(0,128),t.range(3,14),t.range(3,10))}let d=(y,T,k,_,M)=>{let D=r.createRadialGradient(l(y),l(T),1,l(y),l(T),l(Math.max(k,_)));D.addColorStop(0,h(M,.55)),D.addColorStop(1,h(M,0)),r.save(),r.translate(l(y),l(T)),r.scale(1,_/k),r.translate(-l(y),-l(T)),r.fillStyle=D,r.beginPath(),r.arc(l(y),l(T),l(k),0,Math.PI*2),r.fill(),r.restore()};d(.17,.38,.12,.15,.7*s),d(.83,.38,.12,.15,.7*s*(1+a*.4)),d(.26,.6,.13,.17,.85*s),d(.74,.6,.13,.17,.85*s),d(.5,.9,.16,.1,.5*s);let u=ar.eyeV,f=i.eyeSpacing*.5;[-1,1].forEach(y=>{let T=.5+y*f,k=y>0?a*.02:0;d(T,u+k,.115,.095,1),r.fillStyle=h(1.2,.4),r.beginPath(),r.ellipse(l(T),l(u+.045+k),l(.085),l(.035),0,0,Math.PI*2),r.fill()});let g=new ot(i.hair??3812130).multiplyScalar(.8);r.strokeStyle=`#${g.getHexString()}`,r.lineCap="round",[-1,1].forEach(y=>{let T=.5+y*f,k=y>0?a*.035:0;r.lineWidth=l(.022)*(1-o*.3),r.beginPath(),r.moveTo(l(T-y*.075),l(u-.075-k+.012)),r.quadraticCurveTo(l(T),l(u-.1-k),l(T+y*.07),l(u-.068-k)),r.stroke()});let x=a*.02;r.fillStyle=h(.8,.34),r.beginPath(),r.moveTo(l(.5-.028+x),l(u)),r.lineTo(l(.5-.05+x),l(ar.noseV-.02)),r.lineTo(l(.5-.012),l(ar.noseV-.005)),r.closePath(),r.fill(),r.fillStyle=h(1.1,.4),r.beginPath(),r.ellipse(l(.5+x),l(.625),l(.055),l(.022),0,0,Math.PI*2),r.fill(),r.fillStyle=h(1.6,.55),[-1,1].forEach(y=>{r.beginPath(),r.ellipse(l(.5+y*.032+x),l(.622),l(.016),l(.011),0,0,Math.PI*2),r.fill()});let m=ar.mouthV,p=i.mouth*.055,E=new ot(i.lips??(i.child?10313564:8211270)),v=.11+Math.max(0,i.mouth)*.06;if(r.fillStyle=`#${E.getHexString()}`,r.beginPath(),r.moveTo(l(.5-v),l(m+a*.012)),r.quadraticCurveTo(l(.5),l(m-p-.03),l(.5+v),l(m-a*.012)),r.quadraticCurveTo(l(.5),l(m-p+.045),l(.5-v),l(m+a*.012)),r.fill(),r.strokeStyle=h(1.8,.6),r.lineWidth=Math.max(1,l(.008)),r.beginPath(),r.moveTo(l(.5-v),l(m+a*.012)),r.quadraticCurveTo(l(.5),l(m-p+.004),l(.5+v),l(m-a*.012)),r.stroke(),i.mouth>.55){r.fillStyle="#cfc8ae";let y=v*.82;r.beginPath(),r.moveTo(l(.5-y),l(m-p*.2)),r.quadraticCurveTo(l(.5),l(m-p-.012),l(.5+y),l(m-p*.2)),r.lineTo(l(.5+y),l(m-p*.2+.022)),r.quadraticCurveTo(l(.5),l(m-p+.014),l(.5-y),l(m-p*.2+.022)),r.fill(),r.strokeStyle=h(1.4,.35),r.lineWidth=1;for(let T=1;T<5;T+=1){let k=l(.5-y+T*y*2/5);r.beginPath(),r.moveTo(k,l(m-p*.2)),r.lineTo(k,l(m-p*.2+.022)),r.stroke()}}if(o>.25){r.strokeStyle=h(1,.3*o),r.lineWidth=Math.max(1,l(.008*o)),[-1,1].forEach(y=>{r.beginPath(),r.moveTo(l(.5+y*.05),l(.63)),r.quadraticCurveTo(l(.5+y*.135),l(.7),l(.5+y*.115),l(.8)),r.stroke();for(let T=0;T<3;T+=1)r.beginPath(),r.moveTo(l(.5+y*(f+.075)),l(u-.02+T*.022)),r.lineTo(l(.5+y*(f+.125)),l(u-.04+T*.028)),r.stroke()});for(let y=0;y<3;y+=1)r.beginPath(),r.moveTo(l(.28),l(.2+y*.038)),r.quadraticCurveTo(l(.5),l(.17+y*.038),l(.72),l(.2+y*.038)),r.stroke()}if(!i.child&&(i.lips===void 0||o>.5)){r.fillStyle=h(.9,.16);for(let y=0;y<260;y+=1){let T=t.range(.24,.76),k=t.range(.7,.95);Math.abs(T-.5)>.12+(k-.7)*.5||r.fillRect(l(T),l(k),1,1)}}let S=r.createRadialGradient(l(.5),l(.55),l(.3),l(.5),l(.55),l(.62));S.addColorStop(0,"rgba(0,0,0,0)"),S.addColorStop(1,`#${c.getHexString()}`),r.fillStyle=S,r.fillRect(0,0,128,128);let b=new Ut(n);return b.colorSpace=pt,b.magFilter=vt,b.minFilter=yn,b.wrapS=b.wrapT=Pn,b}function _u(i,e){let n=new Yn(.115,2).toNonIndexed(),r=n.getAttribute("position"),s=new Zt(i.seed*31+7),o=i.gaunt??.5,a=i.asymmetry;for(let E=0;E<r.count;E+=1){let v=r.getX(E),S=r.getY(E),b=r.getZ(E),y=S/.115,T=b>0?b/.115:0;if(v*=.84,S*=i.child?1.06:1.2,b<0&&(b*=.8),y>.05&&y<.42&&T>.35){let _=1-Math.abs(y-.24)/.19;b+=.115*.09*_*T,S-=.115*.02*_}if(y>-.16&&y<.16&&T>.3){let _=Math.abs(Math.abs(v)-i.eyeSpacing*.115*.52),M=Math.max(0,1-_/(.115*.5))*Math.max(0,1-Math.abs(y)/.16);b-=.115*(.11+.06*o)*M*T}if(y>-.42&&y<-.02&&T>.15){let _=1-Math.abs(y+.16)/.26;v*=1+.11*_*o,b+=.115*.045*_}if(y>-.66&&y<-.24){let _=1-Math.abs(y+.45)/.21;v*=1-.16*_*o,b*=1-.09*_*o}if(y>.12&&y<.5&&Math.abs(v)>.115*.45){let _=1-Math.abs(y-.31)/.19;v*=1-.12*_*o}if(T>.5&&Math.abs(v)<.115*.22&&y<.2&&y>-.42){let _=Math.max(0,1-Math.abs(v)/.0253),M=Math.max(0,1-Math.abs(y+.12)/.32);b+=.115*.22*_*M,v+=.115*a*.05*_*M}if(y<-.2){let _=Math.min(1,(-y-.2)/.8);v*=1-.34*_,b*=1-.12*_,S-=_*.115*(i.child?.1:.26),v>0&&(S-=_*a*.115*.2)}if(y>.5){let _=(y-.5)/.5;v*=1+(i.child?.16:.02)*_,b*=1+(i.child?.12:.01)*_}let k=v>=0?1.3:.75;v+=(s.next()-.5)*.115*.02*(1+a*1.2)*k,S+=(s.next()-.5)*.115*.016,b+=(s.next()-.5)*.115*.018,r.setXYZ(E,v,S,b)}r.needsUpdate=!0;let c=1/0,l=-1/0,h=1/0,d=-1/0;for(let E=0;E<r.count;E+=1)c=Math.min(c,r.getX(E)),l=Math.max(l,r.getX(E)),h=Math.min(h,r.getY(E)),d=Math.max(d,r.getY(E));let u=Math.max(.001,l-c),f=Math.max(.001,d-h),g=h+(1-ar.eyeV)*f,x=0;for(let E=0;E<r.count;E+=1)Math.abs(r.getY(E)-g)>f*.08||Math.abs(r.getX(E))>u*.3||(x=Math.max(x,r.getZ(E)));let m=n.getAttribute("uv");for(let E=0;E<r.count;E+=1){let v=(r.getX(E)-c)/u,S=(r.getY(E)-h)/f;m.setXY(E,v,S)}m.needsUpdate=!0,n.computeVertexNormals();let p=new K(n,e);return p.name="skull",{mesh:p,bounds:{minX:c,maxX:l,minY:h,maxY:d,faceZ:x}}}function Mu(i,e,t){let r=i.geometry.getAttribute("position"),s=new Zt(e.seed*5+91),o=e.hairStyle==="thin",a=e.hairStyle==="bob",c=(u,f,g)=>{let x=f/.115;return!(g>.115*.2&&x<.45||x<-.5||o&&Math.abs(u)>.115*.62&&x>.2&&x<.55&&g>0)},l=[];for(let u=0;u<r.count;u+=3){let f=!0,g=0,x=0,m=0;for(let S=0;S<3;S+=1){let b=r.getX(u+S),y=r.getY(u+S),T=r.getZ(u+S);g+=b/3,x+=y/3,m+=T/3,c(b,y,T)||(f=!1)}if(!f||o&&x/.115>.62&&s.next()<.22)continue;let p=o?.005:.015,E=a&&x<0?1.45:1,v=1+p/.115;for(let S=0;S<3;S+=1)l.push(r.getX(u+S)*v+(s.next()-.5)*.005,r.getY(u+S)*(x<0?E:1)*v+(s.next()-.5)*.005,r.getZ(u+S)*v+(s.next()-.5)*.005)}if(l.length===0)return null;let h=new It;h.setAttribute("position",new at(l,3)),h.computeVertexNormals();let d=new K(h,t);return d.name="hair",d}function Vc(i,e){let t=new pe,n=i.eyeStyle??"milky",r=n==="clear"?15262934:n==="sunken"?9341822:14474447,s=n==="milky"?4869960:n==="clouded"?3356207:1316111,o=new K(new qt(.0215,10,8),Or(r,{roughness:.34,emissive:s,emissiveIntensity:1,flatShading:!1}));if(t.add(o),n!=="milky"){let l=new K(new Ht(.0092,10),Or(n==="sunken"?1909020:3817528,{roughness:.3,flatShading:!1}));l.position.z=.0195,t.add(l);let h=new K(new Ht(.0038,8),Or(329482));h.position.z=.0206,t.add(h)}else{let l=new K(new Ht(.0075,10),Or(12172464,{roughness:.4,flatShading:!1}));l.position.z=.0195,t.add(l)}let a=i.age??.4,c=new K(new qt(.0235,8,6,0,Math.PI*2,0,Math.PI*.5),Or(i.skin));return c.position.y=.002-(e>0?i.asymmetry*.006:0)-a*.004,c.rotation.x=-.4-a*.35,t.add(c),t}function Wc(i,e,t){let n=new pe,r=(i.ears??1)*(i.child?.82:1),s=new K(new qt(.036*r,7,6),t);s.scale.set(.42,1.25,.85),n.add(s);let o=new K(new qt(.02*r,6,5),Or(7163203));return o.scale.set(.3,1,.6),o.position.set(e*.008,0,.004),n.add(o),n.position.set(e*.104,.012,-.012),n.rotation.z=e*-.16,n.rotation.y=e*.3,n}var Vt=(i,e={})=>new Le({color:i,roughness:.92,flatShading:!0,...e});function s1(i){let e=new pe,t=Vt(i.skin,{map:vu(i)}),{mesh:n,bounds:r}=_u(i,t);e.add(n);let s=r.maxX-r.minX,o=r.maxY-r.minY,a=r.minY+(1-ar.eyeV)*o,c=i.eyeSpacing*.5*s*.5,l=r.faceZ-.014,h=[Vc(i,-1),Vc(i,1)];h[0].position.set(-c,a,l),h[1].position.set(c,a-i.asymmetry*.01,l-.003),h.forEach(u=>e.add(u)),e.add(Wc(i,-1,t)),e.add(Wc(i,1,t));let d=new pe;if(e.add(d),i.hair!==null&&i.hairStyle!=="bald"){let u=Vt(i.hair);if(i.hairStyle==="cap"){let f=new K(new qt(.132,9,6,0,Math.PI*2,0,Math.PI*.5),u);f.position.y=.03,f.scale.set(.96,.82,.96),e.add(f);let g=new K(new tt(.18,.014,.075),u);g.position.set(0,.058,.105),e.add(g)}else{let f=Mu(n,i,u);if(f&&e.add(f),i.hairStyle==="bun"){let g=new K(new Yn(.052,1),u);g.position.set(.01,.085,-.115),e.add(g)}i.hairStyle==="plaits"&&[-1,1].forEach(g=>{let x=new pe;for(let m=0;m<5;m+=1){let p=new K(new Yn(.027-m*.002,0),u);p.position.set(0,-m*.044,m*.007),x.add(p)}x.position.set(g*.098,0,-.03),x.rotation.z=g*.22,e.add(x)})}}return e.name="head",{group:e,eyes:h,jaw:d}}function o1(i){let e=new pe,t=Vt(i.coat),n=Vt(i.trousers),r=Vt(i.shoes,{roughness:.6}),s=Vt(12950916),o=i.height*(i.child?.46:.5),a=i.height*(i.child?.78:.82),c=i.height*(i.child?.85:.87),l=new pe,h=new K(new $e(i.shoulders*.5,i.shoulders*.42,a-o,7),t);h.position.y=(a+o)/2,l.add(h);let d=new K(new tt(i.shoulders*1.12,.1,i.shoulders*.5),t);d.position.y=a,l.add(d),[-1,1].forEach(S=>{let b=new K(new tt(i.shoulders*.22,(a-o)*.55,.03),new Le({color:new ot(i.coat).multiplyScalar(.72).getHex(),roughness:.9,flatShading:!0}));b.position.set(S*i.shoulders*.16,a-(a-o)*.3,i.shoulders*.24),b.rotation.z=S*.12,l.add(b)});let u=new K(new $e(i.shoulders*.42,i.shoulders*.38,.16,7),n);u.position.y=o,l.add(u);let f=new K(new $e(.05,.062,Math.max(.06,c-a),6),s);f.position.y=(c+a)/2,l.add(f),l.rotation.x=i.stoop,e.add(l);let g=S=>{let b=new pe,y=new K(new $e(.052,.045,i.height*.19,6),t);y.position.y=-i.height*.095,b.add(y);let T=new pe;T.position.y=-i.height*.19;let k=new K(new $e(.045,.038,i.height*.17,6),t);k.position.y=-i.height*.085,T.add(k);let _=new K(new tt(.058,.1,.038),s);_.position.y=-i.height*.185,T.add(_);for(let M=0;M<3;M+=1){let D=new K(new tt(.014,.044,.018),s);D.position.set(-.018+M*.018,-i.height*.185-.066,.006),T.add(D)}return b.add(T),b.position.set(S*i.shoulders/2+S*.055,a-.04,.02),b.rotation.z=S*.1,b.rotation.x=-.12,l.add(b),b},x=S=>{let b=new pe,y=new K(new $e(.068,.056,o*.52,6),n);y.position.y=-o*.26,b.add(y);let T=new pe;T.position.y=-o*.52;let k=new K(new $e(.052,.042,o*.44,6),n);k.position.y=-o*.22,T.add(k);let _=new K(new tt(.09,.06,.19),r);return _.position.set(0,-o*.44-.03,.03),T.add(_),b.add(T),b.position.set(S*i.shoulders*.2,o,0),e.add(b),b},m=g(-1),p=g(1),E=x(-1),v=x(1);return{group:e,torso:l,leftArm:m,rightArm:p,leftLeg:E,rightLeg:v,neckY:c}}function tl(i,e){let t=o1(e),n=s1(i);return n.group.scale.setScalar(i.scale*1.06),n.group.position.y=t.neckY+.1*i.scale,n.group.position.z=.012,t.torso.add(n.group),{root:t.group,head:n.group,eyes:n.eyes,torso:t.torso,leftArm:t.leftArm,rightArm:t.rightArm,leftLeg:t.leftLeg,rightLeg:t.rightLeg,jaw:n.jaw,height:e.height}}function Eu(){let i=new pe,e=new Zt(90210),t=document.createElement("canvas");t.width=64,t.height=64;let n=t.getContext("2d");n.fillStyle="#7e8079",n.fillRect(0,0,64,64);for(let L=0;L<260;L+=1){let N=e.range(.66,1.18);n.fillStyle=`rgba(${Math.round(126*N)},${Math.round(128*N)},${Math.round(121*N)},0.75)`,n.fillRect(e.range(0,64),e.range(0,64),e.range(1,8),e.range(1,6))}n.fillStyle="rgba(52,50,44,0.45)";for(let L=0;L<30;L+=1)n.fillRect(e.range(0,64),e.range(0,64),e.range(3,16),1);let r=new Ut(t);r.colorSpace=pt,r.magFilter=vt,r.wrapS=r.wrapT=xn;let s=Vt(8553849,{map:r,roughness:1}),o=Vt(6514270,{roughness:.42,metalness:.18}),a=Vt(461066,{roughness:1,emissive:0}),c=Vt(11570250,{roughness:.3,metalness:.85,flatShading:!1}),l=[];[-1,1].forEach(L=>{let N=new pe,z=new K(new $e(.062,.045,.78,6),s);z.position.y=-.39,z.rotation.x=-.45,N.add(z);let O=new pe;O.position.set(0,-.71,.33);let G=new K(new $e(.04,.028,.86,6),s);G.position.y=-.43,G.rotation.x=.52,O.add(G);let Y=new pe;Y.position.set(0,-.82,-.42);for(let V=0;V<3;V+=1){let ee=new K(new $e(.022,.012,.34,5),o);ee.position.set(-.05+V*.05,-.01,.16),ee.rotation.x=Math.PI/2-.12,Y.add(ee)}let H=new K(new $e(.035,.02,.2,5),o);H.position.set(0,-.01,-.09),H.rotation.x=Math.PI/2,Y.add(H),O.add(Y),N.add(O),N.position.set(L*.19,1.62,0),i.add(N),l.push(N)});let h=new pe;h.position.y=1.62,i.add(h);let d=new K(new $e(.13,.17,.22,7),s);h.add(d);let u=new K(new $e(.115,.15,.82,7),s);u.position.y=.5,h.add(u);for(let L=0;L<8;L+=1){let N=new K(new Yn(.026+e.range(0,.012),0),o);N.position.set(e.range(-.01,.01),.16+L*.095,-.11-L*.004),h.add(N)}for(let L=0;L<5;L+=1){let N=new K(new fn(.125-L*.006,.011,4,8,Math.PI*.85),o);N.position.set(0,.32+L*.1,.02),N.rotation.set(Math.PI/2,0,1.2+L*.05),h.add(N)}let f=new K(new $e(.06,.09,.56,6),s);f.rotation.z=Math.PI/2,f.position.y=.95,h.add(f),[-1,1].forEach(L=>{let N=new K(new tt(.2,.3,.06),o);N.position.set(L*.22,.98,-.1),N.rotation.z=L*-.55,h.add(N)});let g=new K(new $e(.05,.075,.36,6),o);g.position.set(0,.9,.2),g.rotation.x=.62,h.add(g);let x=new pe;x.position.set(0,.62,.4),h.add(x);let p=new Yn(.44,2).toNonIndexed().getAttribute("position"),E=[];for(let L=0;L<p.count;L+=3){let N=[],z=0,O=0,G=0;for(let H=0;H<3;H+=1){let V=p.getX(L+H),ee=p.getY(L+H),re=p.getZ(L+H),xe=ee/.44;if(V*=.78+Math.max(0,xe)*.42,re*=.86+Math.max(0,xe)*.3,ee*=1.5,xe<0){let ke=-xe;V*=1-.72*ke,re*=1-.5*ke,ee-=ke*.2,re+=ke*.16}xe>.55&&(ee+=(Math.abs(V)<.06?.05:0)*(xe-.55)*2),V+=(e.next()-.5)*.014,ee+=(e.next()-.5)*.014,re+=(e.next()-.5)*.014,N.push([V,ee,re]),z+=V/3,O+=ee/3,G+=re/3}let Y=.07+Math.max(0,(.35-O)*.42);G>.08&&Math.abs(z)<Y&&O<.5||N.forEach(([H,V,ee])=>E.push(H,V,ee))}let v=new It;v.setAttribute("position",new at(E,3)),v.computeVertexNormals();let S=new K(v,s);S.material=new Le({color:8553849,map:r,roughness:1,flatShading:!0,side:Gt}),x.add(S);let b=new K(new $e(.14,.03,.72,8,1,!0),a);b.rotation.x=Math.PI/2-.2,b.position.set(0,.06,.04),x.add(b);let y=new K(new Ht(.15,10),a);y.position.set(0,.1,-.2),x.add(y);let T=[],k=(L,N,z,O,G)=>{let Y=new pe,H=new K(new fn(L,L*.19,8,18),c);Y.add(H);let V=new K(new $e(L,L,L*.5,16,1,!0),c);V.rotation.x=Math.PI/2,V.position.z=-L*.24,Y.add(V);let ee=document.createElement("canvas");ee.width=32,ee.height=32;let re=ee.getContext("2d"),xe=re.createLinearGradient(0,0,0,32);xe.addColorStop(0,"#0a1622"),xe.addColorStop(.55,"#20384a"),xe.addColorStop(.58,"#4a6272"),xe.addColorStop(1,"#050a0e"),re.fillStyle=xe,re.fillRect(0,0,32,32),re.fillStyle="rgba(200,220,230,0.5)",re.fillRect(4,19,24,1),re.fillRect(9,22,12,1);let ke=new Ut(ee);ke.colorSpace=pt,ke.magFilter=vt;let Xe=new K(new Ht(L*.86,16),new Le({map:ke,roughness:.1,metalness:.2,emissive:2373186,emissiveIntensity:.9}));Xe.position.z=.004,Xe.name="porthole-glass",Y.add(Xe);for(let je=0;je<6;je+=1){let j=je/6*Math.PI*2,oe=new K(new tt(L*.16,L*.26,L*.12),c);oe.position.set(Math.cos(j)*L*1.2,Math.sin(j)*L*1.2,.01),oe.rotation.z=j,Y.add(oe)}return Y.position.set(N,z,O),Y.rotation.y=G,T.push(Y),Y};x.add(k(.135,-.235,.2,.245,.5)),x.add(k(.104,.245,.03,.225,-.62));let _=new pe,M=new pe;x.add(_,M);let D=[];return[-1,1].forEach(L=>{let N=new pe,z=new K(new $e(.042,.032,.92,6),s);z.position.y=-.46,N.add(z);let O=new pe;O.position.y=-.92;let G=new K(new $e(.03,.022,.88,6),s);G.position.y=-.44,O.add(G);let Y=new pe;Y.position.y=-.88;let H=new K(new tt(.13,.16,.03),o);Y.add(H);for(let V=0;V<5;V+=1){let ee=new pe,re=(V-2)*.26,xe=.17+(2-Math.abs(V-2))*.035,ke=-.08;for(let Xe=0;Xe<3;Xe+=1){let je=new K(new $e(.011-Xe*.002,.009-Xe*.002,xe,5),o);je.position.y=ke-xe/2,ee.add(je);let j=new K(new qt(.013-Xe*.002,6,5),o);j.position.y=ke-xe,ee.add(j),ke-=xe,xe*=.78}ee.position.set(-.05+V*.025,-.04,.004),ee.rotation.z=re,ee.rotation.x=.18+Math.abs(V-2)*.08,Y.add(ee)}O.add(Y),N.add(O),N.position.set(L*.27,.93,.03),N.rotation.z=L*.16,N.rotation.x=-.25,h.add(N),D.push(N)}),i.name="creature",{root:i,head:x,seamLeft:_,seamRight:M,arms:D,legs:l,spine:h,portholes:T,height:2.7}}function Su(i){let e=new pe,n=Vt(i===0?9321012:3103331,{roughness:.66,metalness:.28}),r=Vt(2763819,{roughness:.95}),s=Vt(11570250,{roughness:.36,metalness:.7}),o=[],a=(c,l,h)=>{let d=new pe,u=new K(new fn(c,l,5,12),r);d.add(u);let f=new K(new $e(l*.9,l*.9,l*1.6,8),s);f.rotation.x=Math.PI/2,d.add(f);for(let g=0;g<h;g+=1){let x=new K(new tt(.008,c*2*.92,.008),s);x.rotation.z=g/h*Math.PI,d.add(x)}return d.rotation.y=Math.PI/2,o.push(d),d};if(i===0){let c=a(.21,.035,8);c.position.set(0,.21,.34),e.add(c),[-.16,.16].forEach(g=>{let x=a(.12,.03,6);x.position.set(g,.12,-.24),e.add(x)});let l=new K(new $e(.02,.024,.62,6),n);l.rotation.x=Math.PI/2-.26,l.position.set(0,.29,.05),e.add(l);let h=new K(new $e(.018,.018,.36,6),n);h.rotation.z=Math.PI/2,h.position.set(0,.12,-.24),e.add(h);let d=new K(new tt(.13,.05,.22),Vt(5913130));d.position.set(0,.36,-.18),e.add(d);let u=new K(new $e(.016,.016,.4,6),n);u.rotation.x=-.2,u.position.set(0,.44,.3),e.add(u);let f=new K(new $e(.015,.015,.36,6),s);f.rotation.z=Math.PI/2,f.position.set(0,.62,.26),e.add(f),[-.16,.16].forEach(g=>{let x=new K(new $e(.021,.021,.07,6),r);x.rotation.z=Math.PI/2,x.position.set(g,.62,.26),e.add(x)}),[-1,1].forEach(g=>{let x=new K(new tt(.05,.02,.09),r);x.position.set(g*.11,.21,.34+g*.06),e.add(x),o.push(x)})}else{let c=a(.16,.045,6);c.position.set(0,.16,.3),e.add(c),[-.2,.2].forEach(m=>{let p=a(.13,.04,6);p.position.set(m,.13,-.22),e.add(p)});let l=new K(new tt(.26,.1,.6),n);l.position.set(0,.26,.02),e.add(l);let h=new K(new tt(.18,.12,.16),n);h.position.set(0,.3,.28),e.add(h);let d=new K(new tt(.2,.05,.2),Vt(4148042));d.position.set(0,.33,-.14),e.add(d);let u=new K(new tt(.3,.16,.18),Vt(8221528));u.position.set(0,.3,-.3),e.add(u);let f=new K(new $e(.016,.016,.34,6),s);f.rotation.x=-.24,f.position.set(0,.44,.28),e.add(f);let g=new K(new $e(.014,.014,.42,6),s);g.rotation.z=Math.PI/2,g.position.set(0,.58,.24),e.add(g);let x=new K(new qt(.035,8,5,0,Math.PI*2,0,Math.PI/2),s);x.position.set(.12,.6,.24),e.add(x),[-1,1].forEach(m=>{let p=new K(new tt(.055,.02,.1),r);p.position.set(m*.1,.16,.3+m*.05),e.add(p),o.push(p)})}return{root:e,wheels:o}}function wu(){let i=new pe,e=Vt(12488816,{roughness:.88}),t=Vt(2898492,{roughness:.88}),n=h=>{let d=new pe,u=new K(new $e(.036,.05,.26,7),t);u.position.y=-.13,d.add(u);let f=new K(new $e(.039,.039,.028,8),Vt(14208950));d.add(f);let g=new K(new tt(.062,.082,.038),e);g.position.y=.05,d.add(g);for(let m=0;m<4;m+=1){let p=new pe,E=new K(new tt(.014,.04,.015),e);E.position.y=.02,p.add(E);let v=new K(new tt(.012,.03,.013),e);v.position.y=.053,v.rotation.x=-.5,p.add(v),p.position.set(-.022+m*.015,.088,.003),p.rotation.x=-.35-m*.05,d.add(p)}let x=new K(new tt(.018,.046,.017),e);return x.position.set(-h*.037,.072,.012),x.rotation.z=h*.65,d.add(x),d.position.set(h*.3,-.42,-.56),d.rotation.set(-.5,h*.22,h*.34),i.add(d),d},r=n(-1),s=n(1),o=new pe,a=new K(new $e(.02,.023,.15,8),Vt(4016716,{metalness:.4,roughness:.5}));a.rotation.x=Math.PI/2,o.add(a);let c=new K(new $e(.033,.023,.045,10),Vt(10133664,{metalness:.6,roughness:.4}));c.rotation.x=Math.PI/2,c.position.z=.09,o.add(c);let l=new K(new Ht(.031,10),new Le({color:16773839,emissive:16769184,emissiveIntensity:2.4}));return l.position.z=.113,l.name="torch-lens",o.add(l),o.position.set(0,.1,.015),o.rotation.x=.62,r.add(o),{root:i,left:r,right:s,torch:o}}var Xc=1.62,a1=1.74,l1=1.06,c1=.95,nl=.3,il=class{constructor(e){this.x=0;this.z=0;this.feetY=0;this.yaw=0;this.pitch=0;this.deck="D4";this.stamina=100;this.running=!1;this.crouching=!1;this.hidden=!1;this.hideSpot=null;this.torchOn=!1;this.waterDepth=0;this.moving=!1;this.speedScale=1;this.eyeY=Xc;this.bob=0;this.stepAccumulator=0;this.flashlightTarget=new Nt;this.handSway=new ye;this.rollTarget=0;this.roll=0;this.collision=e,this.camera=new Xt(74,1,.05,340),this.camera.rotation.order="YXZ",this.hands=wu(),this.camera.add(this.hands.root),this.flashlight=new Ts(16772301,0,26,Math.PI/5.4,.55,1.4),this.flashlight.position.set(-.18,-.16,-.1),this.flashlightTarget.position.set(-.05,-.05,-1),this.camera.add(this.flashlight,this.flashlightTarget),this.flashlight.target=this.flashlightTarget,this.eyeFill=new Ki(12174528,.5,6.5,1.9),this.eyeFill.position.set(0,.1,.2),this.camera.add(this.eyeFill)}spawn(e){this.x=e.x,this.z=e.z,this.deck=e.deck,this.feetY=nt(e.deck).y,this.yaw=e.yaw,this.pitch=0,this.stamina=100,this.hidden=!1,this.hideSpot=null,this.crouching=!1,this.torchOn=!1,this.waterDepth=0,this.eyeY=Xc,this.roll=0,this.syncCamera()}baseHeight(e,t){if(Vs(e,t)){let n=tu(e,t,this.feetY);if(n!==null)return n}return nt(this.deck).y}resolveDeck(){let e=xt[0].id;for(let t of xt)this.feetY>=t.y-.35&&(e=t.id);this.deck=e}setTorch(e){this.torchOn=e}update(e,t,n,r){if(this.yaw+=n.yaw,this.pitch=_t(this.pitch+n.pitch,-1.32,1.32),this.hidden){this.moving=!1,this.eyeY=Jt(this.eyeY,1.02,9,e),this.stamina=Math.min(100,this.stamina+e*16),this.syncCamera();return}this.crouching=t.crouch;let s=t.run&&t.forward>.15&&this.stamina>1&&!this.crouching;this.running=s,this.running?this.stamina=Math.max(0,this.stamina-e*19):this.stamina=Math.min(100,this.stamina+e*(this.crouching?16:11.5));let o=this.waterDepth>.12?_t(1-this.waterDepth*.7,.42,1):1,a=(this.crouching?1.7:this.running?4.9:2.95)*o*this.speedScale,c=Math.sin(this.yaw),l=Math.cos(this.yaw),h=(-c*t.forward+l*t.strafe)*a*e,d=(-l*t.forward-c*t.strafe)*a*e,u=Math.hypot(t.forward,t.strafe);u>1&&(h/=u,d/=u);let f=this.crouching?l1:a1,g=(b,y)=>{let T=this.baseHeight(b,y),k=this.collision.floorAt(b,y,T,nl);return k-this.feetY>.45||!this.collision.free(b,y,Math.max(k,this.feetY),f,nl)?!1:(this.x=b,this.z=y,this.feetY=k,!0)},x=Math.abs(h)>1e-6?g(this.x+h,this.z):!1,m=Math.abs(d)>1e-6?g(this.x,this.z+d):!1;if(this.moving=x||m,!this.moving&&u>.01){let b=Math.hypot(h,d);for(let y of[.5,-.5,.95,-.95]){let T=Math.sin(y),k=Math.cos(y),_=h*k-d*T,M=h*T+d*k;if(g(this.x+_/b*b,this.z+M/b*b)){this.moving=!0;break}}}let p=this.collision.depenetrate(this.x,this.z,this.feetY,f,nl);p&&(this.x=p.x,this.z=p.z,this.moving=!0);let E=this.baseHeight(this.x,this.z),v=this.collision.floorAt(this.x,this.z,E,nl);this.feetY=Jt(this.feetY,v,16,e),this.resolveDeck();let S=this.crouching?c1:Xc;if(this.eyeY=Jt(this.eyeY,S,9,e),this.moving){let b=this.running?2.05:this.crouching?.85:1.35;this.stepAccumulator+=e*b,this.bob=Jt(this.bob,1,8,e),this.stepAccumulator>=1&&(this.stepAccumulator-=1,r(this.waterDepth>.06?"water":this.deck==="D3"||this.deck==="D4"?"soft":"hard"))}else this.bob=Jt(this.bob,0,6,e),this.stepAccumulator=.75;this.syncCamera()}setRoll(e){this.rollTarget=e}syncCamera(){let e=performance.now()*.001*(this.running?11:7),t=Math.sin(e*2)*.035*this.bob,n=Math.cos(e)*.028*this.bob;this.roll+=(this.rollTarget-this.roll)*.12,this.camera.position.set(this.x+n*.4,this.feetY+this.eyeY+t,this.z),this.camera.rotation.set(this.pitch,this.yaw,this.roll,"YXZ"),this.handSway.x+=(n*6-this.handSway.x)*.18,this.handSway.y+=(t*6-this.handSway.y)*.18,this.hands.root.position.set(this.handSway.x*.03,-.02+this.handSway.y*.03,0);let r=Math.sin(e)*.16*this.bob;this.hands.left.rotation.x=-.85+r,this.hands.right.rotation.x=-.85-r,this.hands.root.visible=!this.hidden,this.flashlight.intensity=this.torchOn?12:0;let s=this.hands.torch.getObjectByName("torch-lens");if(s){let o=s.material;o.emissiveIntensity=this.torchOn?2.6:.05}}get eyePosition(){return this.camera.position}get deckY(){return nt(this.deck).y}};var h1=[{id:"guest-elena",nameKey:"guest.elena.name",lines:["guest.elena.line1","guest.elena.line2"],x:2.6,z:-9.2,deck:"D4",yaw:2.5},{id:"guest-thomas",nameKey:"guest.thomas.name",lines:["guest.thomas.line1","guest.thomas.line2"],x:4.4,z:-4.2,deck:"D4",yaw:3.7},{id:"guest-miriam",nameKey:"guest.miriam.name",lines:["guest.miriam.line1","guest.miriam.line2"],x:-4.6,z:-6.6,deck:"D4",yaw:1.4}];function d1(){let i=[[{seed:1201,skin:11901574,asymmetry:.5,mouth:.2,eyeSpacing:.46,eyeDrift:.5,hair:2366231,hairStyle:"bob",scale:1,child:!1,gaunt:.55,age:.35,ears:.9,eyeStyle:"clouded",lips:9321018},{height:1.68,shoulders:.36,coat:7154483,trousers:3090988,shoes:1972760,stoop:.05,child:!1}],[{seed:4477,skin:11312261,asymmetry:.3,mouth:.92,eyeSpacing:.52,eyeDrift:.2,hair:11051414,hairStyle:"thin",scale:1.05,child:!1,gaunt:.85,age:.9,ears:1.75,eyeStyle:"clear"},{height:1.79,shoulders:.46,coat:3096905,trousers:3486251,shoes:2301209,stoop:.18,child:!1}],[{seed:8813,skin:12828082,asymmetry:.78,mouth:-.15,eyeSpacing:.4,eyeDrift:.9,hair:12169892,hairStyle:"bun",scale:.98,child:!1,gaunt:.7,age:.6,ears:1,eyeStyle:"milky"},{height:1.6,shoulders:.33,coat:5130804,trousers:3881520,shoes:2104342,stoop:.14,child:!1}]];return h1.map((e,t)=>{let[n,r]=i[t],s=tl(n,r);return s.root.position.set(e.x,nt(e.deck).y,e.z),s.root.rotation.y=e.yaw,s.root.name=e.id,{def:e,figure:s,spoken:!1,x:e.x,z:e.z,relocated:!1}})}var u1=[{id:"resident-301",cabin:"cabin-301",door:"door-301",x:-4.6,z:-3.4,yaw:Math.PI/2,pose:"standing",line:"resident.301",ajar:.32},{id:"resident-303",cabin:"cabin-303",door:"door-303",x:-5.9,z:-8.4,yaw:.2,pose:"sitting",line:"resident.303",ajar:.5},{id:"resident-305",cabin:"cabin-305",door:"door-305",x:-6.8,z:-12.6,yaw:Math.PI/2,pose:"atPorthole",line:"resident.305",ajar:.24},{id:"resident-306",cabin:"cabin-306",door:"door-306",x:5.4,z:-13.4,yaw:-1.9,pose:"standing",line:"resident.306",ajar:.4}];function f1(){return u1.map((i,e)=>{let t=51e3+e*977,n=tl({seed:t,skin:[12099724,12626837,11048580,12890266][e],asymmetry:[.42,.66,.3,.75][e],mouth:[-.3,.1,-.55,.75][e],eyeSpacing:[.44,.5,.42,.48][e],eyeDrift:.6,hair:[2827808,7036750,1512722,9340280][e],hairStyle:["swept","bun","thin","bob"][e],scale:[1,.97,1.04,.99][e],child:!1,gaunt:[.6,.5,.8,.65][e],age:[.45,.35,.8,.55][e],ears:[1,.9,1.3,1][e],eyeStyle:["clouded","milky","sunken","milky"][e]},{height:[1.74,1.62,1.7,1.66][e],shoulders:[.42,.34,.4,.36][e],coat:[3948614,6044228,3094576,4867126][e],trousers:[2828840,3354671,2501414,3486251][e],shoes:[1907223,2169880,1710101,2301465][e],stoop:[.1,.06,.24,.12][e],child:!1});return n.root.position.set(i.x,nt("D3").y,i.z),n.root.rotation.y=i.yaw,n.root.name=i.id,i.pose==="sitting"?(n.root.position.y+=.42,n.leftLeg.rotation.x=-1.35,n.rightLeg.rotation.x=-1.3,n.torso.rotation.x=.1,n.leftArm.rotation.x=-.5,n.rightArm.rotation.x=-.45):i.pose==="atPorthole"?(n.torso.rotation.x=.16,n.head.rotation.x=-.12,n.leftArm.rotation.x=-.9,n.rightArm.rotation.x=-.85):(n.leftArm.rotation.x=.04,n.rightArm.rotation.x=-.04),{def:i,figure:n,spoken:!1}})}function Tu(i){let e=i===0?{seed:30011,skin:13616310,asymmetry:.4,mouth:.95,eyeSpacing:.46,eyeDrift:.9,hair:4863526,hairStyle:"plaits",scale:.92,child:!0,gaunt:.3,age:0,ears:.85,eyeStyle:"milky",lips:10113872}:{seed:30022,skin:13024688,asymmetry:.66,mouth:.15,eyeSpacing:.38,eyeDrift:.4,hair:2038294,hairStyle:"bob",scale:.95,child:!0,gaunt:.45,age:0,ears:.9,eyeStyle:"sunken",lips:9062984},t=i===0?{height:1.24,shoulders:.26,coat:7176070,trousers:5464426,shoes:2761760,stoop:.02,child:!0}:{height:1.06,shoulders:.23,coat:9076578,trousers:7169360,shoes:2761760,stoop:.08,child:!0},n=tl(e,t),r=Su(i),s=new pe;s.add(r.root),s.add(n.root),n.root.position.set(0,i===0?.34:.3,i===0?-.16:-.12),n.leftLeg.rotation.x=-1.1,n.rightLeg.rotation.x=-1.1,n.leftArm.rotation.x=-1.25,n.rightArm.rotation.x=-1.25;let o=new K(i===0?new tt(.28,.02,.2):new tt(.2,.24,.02),new Le({color:i===0?14344932:14735808,roughness:.9,flatShading:!0}));return o.position.set(0,i===0?t.height*.78:t.height*.66,i===0?-.02:.1),n.torso.add(o),s.visible=!1,s.name=`ghost-${i}`,{figure:n,trike:r,root:s,wheelSpin:0,headLag:0,index:i}}var qc=class{constructor(e,t){this.root=new pe;this.state="away";this.path=[];this.cursor=0;this.timer=0;this.cooldown=22;this.rng=new Zt(556677);this.soloIndex=null;this.nav=e,this.audio=t,this.children=[Tu(0),Tu(1)],this.children.forEach(n=>this.root.add(n.root)),this.root.name="ghost-children"}reset(){this.state="away",this.cooldown=24,this.path=[],this.children.forEach(e=>{e.root.visible=!1})}appear(e,t,n){let r=this.nav.nodes.map((c,l)=>({node:c,id:l})).filter(({node:c})=>c.tags.has("child-route")&&c.deck===t);if(r.length<2)return!1;let s=r[Math.floor(this.rng.next()*r.length)],o=r[Math.floor(this.rng.next()*r.length)];for(let c=0;c<8;c+=1){let l=r[Math.floor(this.rng.next()*r.length)];if(Math.hypot(l.node.x-s.node.x,l.node.z-s.node.z)>9){o=l;break}}if(this.path=[s.id,...this.nav.path(s.id,o.id,()=>!0)],this.path.length<2)return!1;this.cursor=0,this.state=e,this.timer=e==="watching"?6:12,this.soloIndex=this.rng.next()<.35?this.rng.next()<.5?0:1:null,this.children.forEach((c,l)=>{c.root.visible=this.soloIndex===null||this.soloIndex===l;let h=this.nav.nodes[this.path[0]];c.root.position.set(h.x+(l===0?.4:-.4),nt(h.deck).y,h.z+l*.9)});let a=n.distanceTo(this.children[0].root.position);return this.audio.play("childLaugh",a),!0}hide(){this.state="away",this.children.forEach(e=>{e.root.visible=!1})}update(e,t,n){if(this.state==="away"){this.cooldown-=e;return}if(this.timer-=e,this.timer<=0){this.hide(),this.cooldown=26+this.rng.range(0,20);return}let r=this.state==="crossing"?3.4:this.state==="riding"?1.9:0;if(this.children.forEach((s,o)=>{if(!s.root.visible)return;if(r>0&&this.cursor<this.path.length){let l=this.nav.nodes[this.path[Math.min(this.cursor+o,this.path.length-1)]],d=new U(l.x,nt(l.deck).y,l.z).clone().sub(s.root.position);d.y=0;let u=d.length();if(u>.05){d.normalize(),s.root.position.addScaledVector(d,Math.min(r*e,u));let f=Math.atan2(d.x,d.z);s.root.rotation.y=Jt(s.root.rotation.y,f,6,e)}s.wheelSpin+=e*r*5.4,s.trike.wheels.forEach((f,g)=>{f.rotation.x=s.wheelSpin*(g<3?1:.6)})}let a=new U().subVectors(n,s.root.position),c=Math.atan2(a.x,a.z)-s.root.rotation.y;s.headLag=Jt(s.headLag,c,this.state==="watching"?1.1:2.4,e),s.figure.head.rotation.y=_t(s.headLag,-2.1,2.1),s.figure.head.rotation.z=Math.sin(t*.7+o)*.06,s.figure.eyes[0].rotation.y=.08,s.figure.eyes[1].rotation.y=-.16+Math.sin(t*.31)*.05}),r>0){let s=this.nav.nodes[this.path[Math.min(this.cursor,this.path.length-1)]],o=new U(s.x,nt(s.deck).y,s.z);this.children[0].root.position.distanceTo(o)<.55&&(this.cursor=Math.min(this.cursor+1,this.path.length-1)),this.cursor>=this.path.length-1&&(this.hide(),this.cooldown=26+this.rng.range(0,20))}if(Math.random()<e*.24){let s=n.distanceTo(this.children[0].root.position),o=_t((this.children[0].root.position.x-n.x)/8,-1,1);this.audio.play(Math.random()<.6?"childLaugh":"childWhisper",s,o)}}get readyToAppear(){return this.state==="away"&&this.cooldown<=0}},Yc=class{constructor(e,t,n){this.state="sealed";this.distance=999;this.awake=!1;this.path=[];this.cursor=0;this.repathTimer=0;this.memory=0;this.gait=0;this.seam=0;this.callTimer=6;this.stepTimer=0;this.rng=new Zt(13579);this.lastKnown=new U;this.nav=e,this.collision=t,this.audio=n,this.parts=Eu(),this.root=this.parts.root,this.root.visible=!1}reset(e){this.state="sealed",this.awake=!1,this.root.visible=!1,this.root.position.set(e.x,nt(e.deck).y,e.z),this.path=[],this.memory=0,this.spawnNode=this.nav.nodeAt(e.deck,e.x,e.z),this.spawnNode===void 0&&(Yt("creature","no navigation node at the containment spawn; falling back to nearest"),this.spawnNode=this.nav.nearest(e.x,nt(e.deck).y,e.z))}wake(){this.awake||(this.awake=!0,this.state="waking",this.root.visible=!0,this.audio.play("creatureCall",26))}seek(e,t){if(e===void 0)return;let n=this.nav.nearest(this.root.position.x,this.root.position.y,this.root.position.z);n!==void 0&&(this.path=this.nav.path(n,e,t),this.cursor=0)}update(e,t,n,r,s){if(!this.awake)return{caught:!1};let o=this.root.position;if(this.distance=Math.hypot(n.x-o.x,n.z-o.z)+Math.abs(n.y-o.y)*1.6,this.state==="waking")return this.seam=Jt(this.seam,1,1.2,e),this.callTimer-=e,this.callTimer<=0&&(this.state="prowl",this.callTimer=12),this.animate(e,t,0),{caught:!1};let a=o.y+1.9,c=!n.hidden&&this.distance<(n.torchOn?22:15)&&this.collision.clearLine(o.x,a,o.z,n.x,n.y,n.z),l=!n.hidden&&n.running&&this.distance<18,h=!n.hidden&&this.distance<3.6;if(c||l||h?(this.state!=="chase"&&c&&this.audio.play("creatureCall",this.distance),this.state="chase",this.memory=7.5,this.lastKnown.set(n.x,n.y,n.z)):this.memory>0&&(this.memory-=e*(n.hidden?2.2:1),this.memory<=0&&(this.state="investigate")),this.repathTimer-=e,this.repathTimer<=0){if(this.repathTimer=this.state==="chase"?.5:1.6,this.state==="chase")this.seek(this.nav.nodeAt(n.deck,n.x,n.z),r);else if(this.state==="investigate"){let g=this.nav.nearest(this.lastKnown.x,this.lastKnown.y,this.lastKnown.z);this.seek(g,r),this.path.length===0&&(this.state="prowl")}else if(this.path.length===0||this.cursor>=this.path.length){let g=s?this.nav.nodes.map((m,p)=>p).filter(m=>this.nav.nodes[m].deck===n.deck):this.nav.nodes.map((m,p)=>p),x=g[Math.floor(this.rng.next()*g.length)];this.seek(x,r)}}let d=this.state==="chase"?s?3.5:3:this.state==="investigate"?2:1.15,u=0;if(this.cursor<this.path.length){let g=this.nav.nodes[this.path[this.cursor]],x=nt(g.deck).y,m=g.x-o.x,p=g.z-o.z,E=Math.hypot(m,p);if(E<.4&&Math.abs(x-o.y)<.6)this.cursor+=1;else{let v=Math.min(d*e,E);E>.001&&(o.x+=m/E*v,o.z+=p/E*v),o.y=Jt(o.y,x,5,e);let S=Math.atan2(m,p);this.root.rotation.y=Jt(this.root.rotation.y,S,5,e),u=d}}if(this.stepTimer-=e,u>0&&this.stepTimer<=0){this.stepTimer=this.state==="chase"?.34:.62;let g=_t((o.x-n.x)/10,-1,1);this.audio.play("creatureStep",this.distance,g)}return this.callTimer-=e,this.callTimer<=0&&this.state!=="chase"&&(this.callTimer=16+this.rng.range(0,14),this.audio.play("creatureCall",this.distance+6)),this.animate(e,t,u),{caught:!n.hidden&&this.distance<1.35&&this.collision.clearLine(o.x,o.y+1.2,o.z,n.x,n.y,n.z)}}animate(e,t,n){this.gait+=e*(2.6+n*1.5);let r=Math.sin(this.gait*2);this.parts.legs[0].rotation.x=r*.5*(n>0?1:.12),this.parts.legs[1].rotation.x=-r*.5*(n>0?1:.12),this.parts.arms[0].rotation.x=-r*.3,this.parts.arms[1].rotation.x=r*.3,this.parts.spine.rotation.x=.14+Math.sin(this.gait)*.05,this.root.position.y+=Math.sin(this.gait*2)*.006;let s=this.state==="chase"?1:this.state==="waking"?this.seam:.12;this.seam=Jt(this.seam,s,3.5,e),this.parts.seamLeft.rotation.y=this.seam*.72,this.parts.seamRight.rotation.y=-this.seam*.72,this.parts.head.rotation.z=Math.sin(t*.9)*.07,this.parts.head.rotation.x=.2+Math.sin(t*1.7)*.04}};function Au(i,e,t,n){let r=new pe;r.name="cast";let s=d1(),o=i.nodeAt(n.deck,n.x,n.z);s.forEach(h=>{let d=i.nodeAt(h.def.deck,h.x,h.z),u=d!==void 0;if(u&&o!==void 0&&d!==void 0&&d!==o&&(u=i.path(o,d,()=>!0).length>0),!u){let f=i.nodesInRooms(["salon"]),g,x=1/0;if(f.forEach(m=>{let p=i.nodes[m];if(o!==void 0&&i.path(o,m,()=>!0).length===0)return;let E=Math.hypot(p.x-h.x,p.z-h.z);E<x&&(x=E,g=m)}),g!==void 0){let m=i.nodes[g];h.x=m.x,h.z=m.z,h.figure.root.position.set(m.x,nt(m.deck).y,m.z),h.relocated=!0,Yt("cast",`${h.def.id} could not be reached at its station; moved to (${m.x.toFixed(1)}, ${m.z.toFixed(1)})`)}else Yt("cast",`${h.def.id} has no reachable station in the salon \u2014 the salon graph is broken`)}r.add(h.figure.root)});let a=f1();a.forEach(h=>r.add(h.figure.root));let c=new qc(i,t);r.add(c.root);let l=new Yc(i,e,t);return r.add(l.root),{passengers:s,residents:a,ghosts:c,creature:l,root:r}}function Ru(i,e){i.forEach((t,n)=>{let r=t.figure;if(!r.root.visible)return;let s=e*.55+n*3.1;r.torso.position.y=Math.sin(s*1.4)*.006,r.torso.rotation.z=Math.sin(s*.6)*.008;let o=Math.sin(e*.13+n*2.2);r.head.rotation.y=o>.97?(o-.97)*8:0})}function Cu(i,e,t,n){i.forEach((r,s)=>{let o=r.figure;if(!o.root.visible)return;let a=e*.9+s*2.1;o.torso.rotation.z=Math.sin(a)*.012,o.torso.position.y=Math.sin(a*1.6)*.008,o.leftArm.rotation.x=Math.sin(a*.7)*.06-.05,o.rightArm.rotation.x=-Math.sin(a*.7+.6)*.06-.05;let c=new U().subVectors(t,o.root.position),l=Math.atan2(c.x,c.z)-o.root.rotation.y;o.head.rotation.y=Jt(o.head.rotation.y,_t(l,-1.2,1.2),3,n),o.head.rotation.x=Math.sin(a*.4)*.05,o.eyes[0].rotation.y=Jt(o.eyes[0].rotation.y,_t(l*.3,-.4,.4),6,n),o.eyes[1].rotation.y=Jt(o.eyes[1].rotation.y,_t(l*.3,-.4,.4)-.12,1.4,n);let h=Math.sin(a*.23+s)>.985?.1:1;o.eyes.forEach(d=>d.scale.setY(h))})}var Iu={"game.title":"THE CRYSTAL SHIP","game.titleA":"THE CRYSTAL","game.titleB":"SHIP","game.chapter":"Capitolo I \xB7 Marea nera","game.subtitle":"A bordo del transatlantico Orpheus","menu.story":"Jack si imbarca sull'Orpheus per attraversare il Nord Atlantico. La prima sera conosce tre passeggeri nel salone, d\xE0 loro la buonanotte e torna nella cabina 307. Mentre \xE8 sotto la doccia la nave colpisce un iceberg \u2014 e sotto la sala macchine qualcosa che era stato saldato dentro apre gli occhi.","menu.start":"Sali a bordo","menu.preparing":"Preparazione\u2026","menu.resume":"Continua","menu.restart":"Ricomincia il capitolo","menu.settings":"Impostazioni","menu.back":"Indietro","menu.language":"Lingua","menu.paused":"Pausa","menu.pausedNote":"La creatura continuer\xE0 a cercare Jack quando tornerai.","menu.controlsTitle":"Comandi","menu.noWebgl":"Grafica 3D non disponibile","menu.noWebglHelp":"Apri il gioco in Chrome, Edge, Firefox o Safari con l'accelerazione grafica attiva.","menu.credits":"Musica: Black Tide Deck \xB7 Cuffie consigliate","settings.brightness":"Luminosit\xE0","settings.gamma":"Gamma","settings.volume":"Volume","settings.music":"Musica","settings.mute":"Muto","settings.unmute":"Riattiva audio","settings.quality":"Qualit\xE0 grafica","settings.quality.auto":"Automatica","settings.quality.low":"Bassa","settings.quality.medium":"Media","settings.quality.high":"Alta","settings.sensitivity":"Sensibilit\xE0 sguardo","settings.subtitles":"Sottotitoli","settings.hints":"Suggerimenti","settings.on":"S\xEC","settings.off":"No","settings.reset":"Ripristina","controls.move":"muoviti","controls.look":"guarda","controls.run":"corri","controls.interact":"usa / apri","controls.flashlight":"torcia","controls.pause":"pausa","controls.mute":"audio","controls.hint":"suggerimento","controls.map":"ponte e rotta","controls.crouch":"abbassati","controls.keys.move":"WASD / FRECCE","controls.keys.look":"MOUSE","controls.touch.move":"leva sinistra","controls.touch.look":"trascina a destra","controls.touch.action":"tasto AZIONE","hud.objective":"Obiettivo","hud.breath":"FIATO","hud.deck":"Ponte","hud.player":"JACK \xB7 PASSEGGERO \xB7 CABINA 307","hud.goUp":"sali al","hud.goDown":"scendi al","hud.hidden":"Nascosto","verb.talk":"PARLA","verb.open":"APRI","verb.close":"CHIUDI","verb.use":"USA","verb.hide":"NASCONDITI","verb.leave":"ESCI","verb.turn":"GIRA","verb.climb":"SALI","verb.take":"PRENDI","verb.read":"LEGGI","prompt.pc":"Premi {key} per {verb} {target}","prompt.touch":"TOCCA {verb}","prompt.locked":"La porta \xE8 chiusa a chiave.","prompt.nothing":"Qui non c'\xE8 niente da usare.","deck.1":"Ponte 1 \xB7 Macchine","deck.2":"Ponte 2 \xB7 Servizi","deck.3":"Ponte 3 \xB7 Cabine","deck.4":"Ponte 4 \xB7 Saloni","deck.5":"Ponte 5 \xB7 Scialuppe","deck.6":"Ponte 6 \xB7 Plancia","room.d1-corridor":"Corridoio macchine","room.d1-pump":"Locale pompe","room.d1-workshop":"Officina","room.engine-room":"Sala macchine","room.shaft-tunnel":"Tunnel dell'asse","room.d2-corridor":"Corridoio di servizio","room.d2-control":"Controllo pompe","room.d2-mess":"Mensa equipaggio","room.d2-gallery":"Ballatoio macchine","room.d3-corridor":"Corridoio cabine","room.cabin":"Cabina passeggeri","room.cabin-307":"Cabina 307","room.bathroom":"Bagno della cabina","room.d3-linen":"Deposito biancheria","room.foyer":"Atrio d'imbarco","room.salon":"Salone principale","room.d4-fwd-lobby":"Vestibolo di prua","room.promenade":"Passeggiata coperta","room.playroom":"Sala giochi dei bambini","room.d4-aft-svc":"Office di poppa","room.d4-aft-deck":"Ponte di poppa","room.boat-deck":"Ponte delle scialuppe","room.d5-house":"Tuga","room.d5-aft-open":"Ponte scoperto di poppa","room.wheelhouse":"Plancia di comando","room.chart-room":"Sala carteggio","room.captain-office":"Studio del comandante","room.d6-passage":"Passaggio plancia","room.bridge-wing":"Aletta di plancia","sign.bridge":"PLANCIA DI COMANDO","sign.chart":"SALA CARTEGGIO","sign.captain":"COMANDANTE","sign.d6-junction":"PLANCIA \u2192  |  \u2193 PONTE 5","sign.boat-deck":"SCIALUPPE 1-8  \u2190\u2192","sign.foyer-aft":"SALA GIOCHI \u2190  |  \u2192 OFFICE","sign.stair":"PONTI 1-6  \u2191\u2193","sign.cabins":"CABINE 301-308  \u2192","sign.d3-aft":"PONTE 3 \xB7 POPPA","sign.salon":"SALONE PRINCIPALE  \u2192","sign.playroom":"SALA GIOCHI","sign.d2-junction":"CONTROLLO POMPE \u2192","sign.pump-control":"CONTROLLO POMPE","sign.d1-junction":"SALA MACCHINE \u2193  |  POMPE \u2192","sign.pump":"LOCALE POMPE","sign.engine":"SALA MACCHINE","obj.meetGuests":"Presentati ai tre passeggeri nel salone ({n}/3)","obj.goodnight":"Dai la buonanotte e scendi alla cabina 307 sul ponte 3","obj.enterCabin":"Apri la porta della cabina 307","obj.shower":"Entra in bagno e apri la doccia","obj.afterImpact":"Esci dalla cabina e scopri cos'\xE8 successo","obj.bridge":"Sali in plancia sul ponte 6 e controlla la nave","obj.pumpRoom":"Scendi al controllo pompe sul ponte 2","obj.restartPumps":"Riavvia le pompe di sentina","obj.alarm":"Suona la campana nell'atrio e dai l'allarme generale","obj.lifeboats":"Raggiungi il ponte delle scialuppe","obj.escape":"Sali sulla scialuppa","target.guest":"{name}","target.resident":"il passeggero","target.door307":"la cabina 307","target.door":"la porta","target.watertight":"la porta stagna","target.shower":"la doccia","target.helm":"il timone","target.radio":"la radio","target.pumpPanel":"il quadro delle pompe","target.bell":"la campana","target.wardrobe":"l'armadio","target.ladder":"la scaletta","target.lifeboat":"la scialuppa","target.blackboard":"la lavagna","intro.arrival":"21:40 \xB7 Atrio d'imbarco. Tu sei Jack, cabina 307. Il salone \xE8 a proravia: presentati agli altri tre passeggeri.","guest.elena.name":"ELENA VARGA","guest.elena.line1":"ELENA: \xABPrima traversata, vero? Si vede. Non si guarda mai il mare cos\xEC a lungo, dopo la prima volta.\xBB","guest.elena.line2":"ELENA: \xABIo ci lavoro, sulle navi. E questa\u2026 questa \xE8 troppo silenziosa sotto i piedi. Buonanotte, Jack.\xBB","guest.thomas.name":"THOMAS REDE","guest.thomas.line1":"THOMAS: \xABSono secondo macchinista in pensione. Trent'anni sotto la linea di galleggiamento.\xBB","guest.thomas.line2":"THOMAS: \xABSull'Orpheus hanno saldato un compartimento a poppa e non l'hanno mai riaperto. Nessuno ti dir\xE0 perch\xE9.\xBB","guest.miriam.name":"MIRIAM ADESSI","guest.miriam.line1":"MIRIAM: \xABPiacere. Viaggio con le mie nipoti\u2026 viaggiavo. Adesso viaggio da sola, ma prenoto sempre tre posti.\xBB","guest.miriam.line2":"MIRIAM: \xABSe stanotte senti ridere in corridoio, Jack, non aprire la porta. Buon riposo.\xBB","resident.301":"\xABNon apra. Per favore. Non stanotte.\xBB","resident.303":"La donna seduta sulla cuccetta non alza la testa. \xAB\xC8 gi\xE0 passato di qui.\xBB","resident.305":"L'uomo alla finestra non si volta. \xABGuardi il mare. Adesso \xE8 fermo.\xBB","resident.306":"\xABCi siamo gi\xE0 presentati, signor Jack. Due volte.\xBB","resident.silent":"Dietro la porta qualcuno respira, e non risponde.","resident.after":"La cabina \xE8 vuota. Le lenzuola sono ancora calde.","jack.goodnight":"JACK: \xABBuonanotte a tutti. Scendo in cabina, 307, ponte tre. Una doccia e poi dormo.\xBB","jack.cabinFound":"JACK: \xABEccola. 307.\xBB","jack.cabinEntered":"Jack chiude la porta. Il corridoio, dietro, \xE8 vuoto.","jack.shower":"JACK: \xABFinalmente acqua calda.\xBB","impact.hit":"IMPATTO. L'ORPHEUS HA COLPITO UN ICEBERG. LO SCAFO SI APRE A PRORAVIA. LE LUCI CADONO.","impact.after":"JACK: \xABChe cos'\xE8 stato\u2026 l'acqua. Sta entrando acqua.\xBB","impact.creature":"Dal fondo della nave sale un suono che non \xE8 metallo.","bridge.found":"PLANCIA VUOTA. IL TIMONE \xC8 BLOCCATO A DRITTA. IL RADAR MOSTRA GHIACCIO SU TUTTO IL SETTORE DI PRORA.","bridge.radio":"RADIO: \xAB...Orpheus, Orpheus, qui non risponde nessuno... la posizione \xE8\u2026 \xBB Poi solo statica.","bridge.order":"JACK: \xABLe pompe di sentina sono ferme. Devo scendere al ponte 2, al controllo pompe.\xBB","pumps.restarted":"LE POMPE RIPARTONO. L'ACQUA SMETTE DI SALIRE. QUALCOSA, IN BASSO, HA SMESSO DI MUOVERSI PER ASCOLTARE.","pumps.needPower":"Il quadro \xE8 morto. Manca corrente dal quadro d'emergenza.","alarm.rung":"ALLARME GENERALE. LA CAMPANA SUONA SU TUTTI I PONTI. ADESSO SA DOVE SEI. CORRI ALLE SCIALUPPE.","ghost.first":"Una risata di bambina, due ponti pi\xF9 su.","ghost.mirror":"Nello specchio ci sono due bambine. Nel corridoio non c'\xE8 nessuno.","ghost.pass":"Due triccicli attraversano il corridoio davanti a te e spariscono.","ghost.warn":"\xABNon di l\xE0\xBB, dice la pi\xF9 piccola. \xABDi l\xE0 c'\xE8 lui.\xBB","monster.near":"Qualcosa respira dietro la paratia.","monster.chase":"TI HA VISTO.","hide.enter":"Trattieni il respiro. Il legno scricchiola.","hide.exit":"Esci dall'armadio.","flood.rising":"L'acqua ti arriva alle caviglie.","flood.deep":"L'acqua ti arriva alla vita. Qui sotto non si resta.","death.title":"Il mare ha preso Jack.","death.text":"Lo trascina verso il basso, verso il compartimento che qualcuno aveva saldato e che l'iceberg ha riaperto.","death.retry":"Torna a bordo","win.eyebrow":"03:17 \xB7 Ponte delle scialuppe","win.title":"Hai lasciato l'Orpheus.","win.text":"La scialuppa scende lungo la fiancata. L'Orpheus si inclina sul mare nero. Dietro gli obl\xF2 illuminati qualcosa cammina ancora sui ponti \u2014 e sul ponte delle scialuppe, dove non c'\xE8 pi\xF9 nessuno, due tricicli continuano a girare.","win.next":"Fine del Capitolo I \xB7 Continua nel Capitolo II","win.again":"Gioca ancora","a11y.canvas":"Vista in prima persona di Jack a bordo dell'Orpheus","a11y.touchControls":"Comandi touch","a11y.joystick":"Leva di movimento","a11y.lookArea":"Area per ruotare la visuale","a11y.action":"Azione contestuale","a11y.run":"Corri","a11y.torch":"Torcia","a11y.pause":"Pausa"};var Pu={"game.title":"THE CRYSTAL SHIP","game.titleA":"THE CRYSTAL","game.titleB":"SHIP","game.chapter":"Chapter I \xB7 Black Tide","game.subtitle":"Aboard the ocean liner Orpheus","menu.story":"Jack boards the Orpheus to cross the North Atlantic. On the first evening he meets three passengers in the salon, says goodnight, and goes down to cabin 307. While he is in the shower the ship strikes an iceberg \u2014 and below the engine room something that was welded in opens its eyes.","menu.start":"Come aboard","menu.preparing":"Preparing\u2026","menu.resume":"Resume","menu.restart":"Restart the chapter","menu.settings":"Settings","menu.back":"Back","menu.language":"Language","menu.paused":"Paused","menu.pausedNote":"The creature will keep looking for Jack when you return.","menu.controlsTitle":"Controls","menu.noWebgl":"3D graphics unavailable","menu.noWebglHelp":"Open the game in Chrome, Edge, Firefox or Safari with hardware acceleration enabled.","menu.credits":"Music: Black Tide Deck \xB7 Headphones recommended","settings.brightness":"Brightness","settings.gamma":"Gamma","settings.volume":"Volume","settings.music":"Music","settings.mute":"Mute","settings.unmute":"Unmute","settings.quality":"Graphics quality","settings.quality.auto":"Automatic","settings.quality.low":"Low","settings.quality.medium":"Medium","settings.quality.high":"High","settings.sensitivity":"Look sensitivity","settings.subtitles":"Subtitles","settings.hints":"Hints","settings.on":"On","settings.off":"Off","settings.reset":"Reset","controls.move":"move","controls.look":"look","controls.run":"run","controls.interact":"use / open","controls.flashlight":"flashlight","controls.pause":"pause","controls.mute":"audio","controls.hint":"hint","controls.map":"deck and heading","controls.crouch":"crouch","controls.keys.move":"WASD / ARROWS","controls.keys.look":"MOUSE","controls.touch.move":"left stick","controls.touch.look":"drag on the right","controls.touch.action":"ACTION button","hud.objective":"Objective","hud.breath":"BREATH","hud.deck":"Deck","hud.player":"JACK \xB7 PASSENGER \xB7 CABIN 307","hud.goUp":"go up to","hud.goDown":"go down to","hud.hidden":"Hidden","verb.talk":"TALK","verb.open":"OPEN","verb.close":"CLOSE","verb.use":"USE","verb.hide":"HIDE","verb.leave":"LEAVE","verb.turn":"TURN","verb.climb":"CLIMB","verb.take":"TAKE","verb.read":"READ","prompt.pc":"Press {key} to {verb} {target}","prompt.touch":"TAP {verb}","prompt.locked":"The door is locked.","prompt.nothing":"There is nothing to use here.","deck.1":"Deck 1 \xB7 Machinery","deck.2":"Deck 2 \xB7 Service","deck.3":"Deck 3 \xB7 Cabins","deck.4":"Deck 4 \xB7 Public rooms","deck.5":"Deck 5 \xB7 Boat deck","deck.6":"Deck 6 \xB7 Bridge","room.d1-corridor":"Machinery flat","room.d1-pump":"Pump room","room.d1-workshop":"Workshop","room.engine-room":"Engine room","room.shaft-tunnel":"Shaft tunnel","room.d2-corridor":"Service corridor","room.d2-control":"Pump control room","room.d2-mess":"Crew mess","room.d2-gallery":"Engine gallery","room.d3-corridor":"Cabin alleyway","room.cabin":"Passenger cabin","room.cabin-307":"Cabin 307","room.bathroom":"Cabin bathroom","room.d3-linen":"Linen store","room.foyer":"Embarkation foyer","room.salon":"Main salon","room.d4-fwd-lobby":"Forward lobby","room.promenade":"Covered promenade","room.playroom":"Children's playroom","room.d4-aft-svc":"After pantry","room.d4-aft-deck":"After deck","room.boat-deck":"Boat deck","room.d5-house":"Deckhouse","room.d5-aft-open":"After open deck","room.wheelhouse":"Wheelhouse","room.chart-room":"Chart room","room.captain-office":"Captain's office","room.d6-passage":"Bridge passage","room.bridge-wing":"Bridge wing","sign.bridge":"NAVIGATING BRIDGE","sign.chart":"CHART ROOM","sign.captain":"MASTER","sign.d6-junction":"BRIDGE \u2192  |  \u2193 DECK 5","sign.boat-deck":"BOATS 1-8  \u2190\u2192","sign.foyer-aft":"PLAYROOM \u2190  |  \u2192 PANTRY","sign.stair":"DECKS 1-6  \u2191\u2193","sign.cabins":"CABINS 301-308  \u2192","sign.d3-aft":"DECK 3 \xB7 AFT","sign.salon":"MAIN SALON  \u2192","sign.playroom":"PLAYROOM","sign.d2-junction":"PUMP CONTROL \u2192","sign.pump-control":"PUMP CONTROL","sign.d1-junction":"ENGINE ROOM \u2193  |  PUMPS \u2192","sign.pump":"PUMP ROOM","sign.engine":"ENGINE ROOM","obj.meetGuests":"Introduce yourself to the three passengers in the salon ({n}/3)","obj.goodnight":"Say goodnight and go down to cabin 307 on deck 3","obj.enterCabin":"Open the door of cabin 307","obj.shower":"Go into the bathroom and turn on the shower","obj.afterImpact":"Leave the cabin and find out what happened","obj.bridge":"Go up to the bridge on deck 6 and check the ship","obj.pumpRoom":"Go down to the pump control room on deck 2","obj.restartPumps":"Restart the bilge pumps","obj.alarm":"Ring the bell in the foyer and raise the general alarm","obj.lifeboats":"Reach the boat deck","obj.escape":"Board the lifeboat","target.guest":"{name}","target.resident":"the passenger","target.door307":"cabin 307","target.door":"the door","target.watertight":"the watertight door","target.shower":"the shower","target.helm":"the helm","target.radio":"the radio","target.pumpPanel":"the pump panel","target.bell":"the bell","target.wardrobe":"the wardrobe","target.ladder":"the ladder","target.lifeboat":"the lifeboat","target.blackboard":"the blackboard","intro.arrival":"21:40 \xB7 Embarkation foyer. You are Jack, cabin 307. The salon is forward: introduce yourself to the other three passengers.","guest.elena.name":"ELENA VARGA","guest.elena.line1":"ELENA: \xABFirst crossing, isn't it? It shows. Nobody looks at the sea that long after the first time.\xBB","guest.elena.line2":"ELENA: \xABI work on ships. And this one\u2026 this one is too quiet under your feet. Goodnight, Jack.\xBB","guest.thomas.name":"THOMAS REDE","guest.thomas.line1":"THOMAS: \xABRetired second engineer. Thirty years below the waterline.\xBB","guest.thomas.line2":"THOMAS: \xABOn the Orpheus they welded a compartment shut aft and never opened it again. Nobody will tell you why.\xBB","guest.miriam.name":"MIRIAM ADESSI","guest.miriam.line1":"MIRIAM: \xABHow do you do. I travel with my nieces\u2026 I travelled. I go alone now, but I always book three berths.\xBB","guest.miriam.line2":"MIRIAM: \xABIf you hear laughing in the alleyway tonight, Jack, don't open the door. Sleep well.\xBB","resident.301":"\xABDon't open it. Please. Not tonight.\xBB","resident.303":"The woman sitting on the bunk does not raise her head. \xABIt has already been past.\xBB","resident.305":"The man at the window does not turn round. \xABLook at the sea. It has stopped.\xBB","resident.306":"\xABWe have already been introduced, Mr Jack. Twice.\xBB","resident.silent":"Behind the door somebody is breathing, and does not answer.","resident.after":"The cabin is empty. The sheets are still warm.","jack.goodnight":"JACK: \xABGoodnight, all. I'm going down to my cabin \u2014 307, deck three. A shower, then sleep.\xBB","jack.cabinFound":"JACK: \xABThere it is. 307.\xBB","jack.cabinEntered":"Jack shuts the door. Behind him the alleyway is empty.","jack.shower":"JACK: \xABHot water at last.\xBB","impact.hit":"IMPACT. THE ORPHEUS HAS STRUCK AN ICEBERG. THE HULL IS OPEN FORWARD. THE LIGHTS FAIL.","impact.after":"JACK: \xABWhat was\u2014 water. Water is coming in.\xBB","impact.creature":"From the bottom of the ship comes a sound that is not metal.","bridge.found":"THE BRIDGE IS EMPTY. THE WHEEL IS JAMMED HARD TO STARBOARD. THE RADAR SHOWS ICE ACROSS THE WHOLE FORWARD SECTOR.","bridge.radio":"RADIO: \xAB...Orpheus, Orpheus, nobody is answering here... position is\u2026 \xBB Then static.","bridge.order":"JACK: \xABThe bilge pumps are stopped. I have to get down to deck 2, to pump control.\xBB","pumps.restarted":"THE PUMPS PICK UP. THE WATER STOPS RISING. SOMETHING BELOW HAS STOPPED MOVING, TO LISTEN.","pumps.needPower":"The panel is dead. There is no feed from the emergency switchboard.","alarm.rung":"GENERAL ALARM. THE BELL CARRIES THROUGH EVERY DECK. NOW IT KNOWS WHERE YOU ARE. GET TO THE BOATS.","ghost.first":"A child laughing, two decks above.","ghost.mirror":"There are two girls in the mirror. There is nobody in the alleyway.","ghost.pass":"Two tricycles cross the passage ahead of you and are gone.","ghost.warn":"\xABNot that way\xBB, says the smaller one. \xABHe's that way.\xBB","monster.near":"Something is breathing behind the bulkhead.","monster.chase":"IT HAS SEEN YOU.","hide.enter":"Hold your breath. The wood creaks.","hide.exit":"You climb out of the wardrobe.","flood.rising":"The water is around your ankles.","flood.deep":"The water is at your waist. Nobody stays down here.","death.title":"The sea has taken Jack.","death.text":"It drags him down, towards the compartment somebody welded shut and the iceberg opened again.","death.retry":"Come back aboard","win.eyebrow":"03:17 \xB7 Boat deck","win.title":"You have left the Orpheus.","win.text":"The boat runs down the ship's side. The Orpheus leans into the black water. Behind the lit portholes something is still walking the decks \u2014 and on the boat deck, where there is no longer anyone, two tricycles keep turning.","win.next":"End of Chapter I \xB7 Continues in Chapter II","win.again":"Play again","a11y.canvas":"First-person view of Jack aboard the Orpheus","a11y.touchControls":"Touch controls","a11y.joystick":"Movement stick","a11y.lookArea":"Area for turning the view","a11y.action":"Contextual action","a11y.run":"Run","a11y.torch":"Flashlight","a11y.pause":"Pause"};var ku={it:Iu,en:Pu},$c={it:"Italiano",en:"English"},Du="crystal-ship.language",Ks="it",Kc=new Set;function Lu(){try{let e=window.localStorage.getItem(Du);if(e==="it"||e==="en")return e}catch{}return(navigator.language||"en").slice(0,2).toLowerCase()==="it"?"it":"en"}function rl(){return Ks}function sl(i){if(Ks!==i){Ks=i;try{window.localStorage.setItem(Du,i)}catch{}document.documentElement.lang=i,Kc.forEach(e=>e())}}function Nu(i){return Kc.add(i),()=>Kc.delete(i)}function ve(i,e){let n=ku[Ks][i];if(n===void 0&&(Yt("i18n",`missing ${Ks} string for "${i}"`),n=ku.en[i]??String(i)),e)for(let[r,s]of Object.entries(e))n=n.split(`{${r}}`).join(String(s));return n}var ol=class{constructor(e){this.step="meetGuests";this.guestsMet=0;this.floodY=-1.4;this.impact=!1;this.pumpsRunning=!1;this.powerOn=!0;this.alarmRinging=!1;this.list=0;this.shakeTimer=0;this.elapsed=0;this.interactables=[];this.stepIndex=0;this.impactCountdown=-1;this.ghostBeats=[];this.ghostCursor=0;this.mirrorBeatDone=!1;this.lastFloodMessage=0;this.steps=[{id:"meetGuests",objective:()=>ve("obj.meetGuests",{n:this.guestsMet}),marker:()=>{let e=this.cast.passengers.find(t=>!t.spoken);return e?{x:e.x,z:e.z,deck:e.def.deck}:null}},{id:"goodnight",objective:()=>ve("obj.goodnight"),marker:()=>({x:-3.6,z:-16.6,deck:"D3"})},{id:"enterCabin",objective:()=>ve("obj.enterCabin"),marker:()=>({x:-1.9,z:-16.6,deck:"D3"})},{id:"shower",objective:()=>ve("obj.shower"),marker:()=>({x:-4.1,z:-20.4,deck:"D3"})},{id:"afterImpact",objective:()=>ve("obj.afterImpact"),marker:()=>({x:0,z:-8,deck:"D3"})},{id:"bridge",objective:()=>ve("obj.bridge"),marker:()=>({x:0,z:-19.4,deck:"D6"})},{id:"pumpRoom",objective:()=>ve("obj.pumpRoom"),marker:()=>({x:5.4,z:-12.6,deck:"D2"})},{id:"restartPumps",objective:()=>ve("obj.restartPumps"),marker:()=>({x:5.4,z:-12.6,deck:"D2"})},{id:"alarm",objective:()=>ve("obj.alarm"),marker:()=>({x:-4.3,z:12.6,deck:"D4"})},{id:"lifeboats",objective:()=>ve("obj.lifeboats"),marker:()=>({x:-5,z:4,deck:"D5"})},{id:"escape",objective:()=>ve("obj.escape"),marker:()=>({x:-5,z:4,deck:"D5"})}];this.world=e.world,this.nav=e.nav,this.player=e.player,this.cast=e.cast,this.audio=e.audio,this.collision=e.collision,this.hooks=e.hooks,this.buildInteractables()}get currentStep(){return this.steps[this.stepIndex]}reset(){this.stepIndex=0,this.step="meetGuests",this.guestsMet=0,this.floodY=-1.4,this.impact=!1,this.pumpsRunning=!1,this.powerOn=!0,this.alarmRinging=!1,this.list=0,this.shakeTimer=0,this.elapsed=0,this.impactCountdown=-1,this.ghostCursor=0,this.mirrorBeatDone=!1,this.cast.passengers.forEach(e=>{e.spoken=!1,e.figure.root.visible=!0}),this.cast.residents.forEach(e=>{e.spoken=!1,e.figure.root.visible=!0;let t=this.world.doors.get(e.def.door);t&&(t.locked=!1,t.open=e.def.ajar,t.target=e.def.ajar,this.applyDoorCollider(t))}),this.cast.ghosts.reset(),this.cast.creature.reset({x:0,z:32,deck:"D1"}),this.world.doors.forEach(e=>{let t=e.def.kind!=="open";e.open=t?0:1,e.target=e.open,e.locked=!!e.def.locked||e.def.kind==="sealed",this.applyDoorCollider(e)}),this.ghostBeats=[{at:14,deck:"D3",kind:"crossing"},{at:52,deck:"D4",kind:"riding"},{at:96,deck:"D4",kind:"watching"},{at:150,deck:"D5",kind:"crossing"}],this.refreshObjective()}refreshObjective(){this.step=this.currentStep.id,this.hooks.setObjective(this.currentStep.objective())}advance(){let e=0;for(;e<this.steps.length;){e+=1,this.stepIndex=Math.min(this.stepIndex+1,this.steps.length-1);let t=this.currentStep.marker?.();if(!t)break;let n=this.nav.nodeAt(this.player.deck,this.player.x,this.player.z),r=this.nav.nodeAt(t.deck,t.x,t.z);if(r===void 0){Yt("director",`step ${this.currentStep.id} has no navigation node at its marker; skipping`);continue}if(n!==void 0&&n!==r&&this.nav.path(n,r,()=>!0).length===0){Yt("director",`step ${this.currentStep.id} target is unreachable from the player's position; skipping to keep the chapter completable`);continue}break}this.refreshObjective()}objectiveMarker(){return this.currentStep.marker?.()??null}applyDoorCollider(e){this.collision.setDynamic(`door-${e.def.id}`,e.open>.6?null:e.collider)}buildInteractables(){let e=this.interactables;this.cast.passengers.forEach(l=>{e.push({id:l.def.id,position:new U(l.x,nt(l.def.deck).y+1.5,l.z),deck:l.def.deck,radius:2.2,verb:()=>"talk",target:()=>ve("target.guest",{name:ve(l.def.nameKey)}),enabled:()=>this.step==="meetGuests"&&!l.spoken||this.step==="goodnight",run:()=>{if(this.step==="goodnight"){this.hooks.say(l.def.lines[1],void 0,4200);return}l.spoken||(l.spoken=!0,this.guestsMet+=1,this.audio.play("chime",0),this.hooks.say(l.def.lines[0],void 0,4600),this.refreshObjective(),this.guestsMet>=this.cast.passengers.length&&(window.setTimeout(()=>{this.hooks.say("jack.goodnight",void 0,4200)},1400),this.advance()))}})}),this.cast.residents.forEach(l=>{e.push({id:l.def.id,position:new U(l.def.x,nt("D3").y+1.5,l.def.z),deck:"D3",radius:3,verb:()=>"talk",target:()=>ve("target.resident"),enabled:()=>!this.impact&&l.figure.root.visible,run:()=>{this.hooks.say(l.spoken?"resident.silent":l.def.line,void 0,4200),l.spoken=!0}})}),ir.forEach(l=>{if(l.kind==="open")return;let h=this.world.doors.get(l.id);h&&e.push({id:`door:${l.id}`,position:h.centre,deck:h.deck,radius:l.kind==="cabin"?3.2:2.2,verb:()=>h.open>.5?"close":"open",target:()=>l.plate==="307"?ve("target.door307"):l.kind==="watertight"||l.kind==="sealed"?ve("target.watertight"):ve("target.door"),enabled:()=>l.kind!=="sealed"||this.impact,run:()=>{if(h.locked){this.audio.play("doorLocked",0),this.hooks.say("prompt.locked",void 0,1800);return}h.target=h.open>.5?0:1,this.audio.play(l.kind==="cabin"||l.kind==="interior"?"doorWood":"doorSteel",0),l.id==="door-307"&&h.target===1&&this.step==="enterCabin"&&(this.hooks.say("jack.cabinEntered",void 0,3400),this.advance())}})});let t=this.world.props.get("b307-shower");t&&e.push({id:"shower",position:t.position.clone().setY(t.position.y+1.1),deck:"D3",radius:1.9,verb:()=>"turn",target:()=>ve("target.shower"),enabled:()=>this.step==="shower",run:()=>{this.audio.play("valve",0),this.audio.play("shower",0),this.hooks.say("jack.shower",void 0,2600),this.impactCountdown=4.2,this.advance()}});let n=this.world.props.get("helm-main");n&&e.push({id:"helm",position:n.position.clone().setY(n.position.y+1.1),deck:"D6",radius:2.2,verb:()=>"use",target:()=>ve("target.helm"),enabled:()=>this.step==="bridge",run:()=>{this.audio.play("switch",0),this.hooks.say("bridge.found",void 0,6e3),window.setTimeout(()=>this.hooks.say("bridge.order",void 0,4600),6200),this.advance()}});let r=this.world.props.get("radio-bridge");r&&e.push({id:"radio",position:r.position.clone().setY(r.position.y+1.2),deck:"D6",radius:1.9,verb:()=>"use",target:()=>ve("target.radio"),enabled:()=>this.impact,run:()=>{this.audio.play("switch",0),this.hooks.say("bridge.radio",void 0,5200)}});let s=this.world.props.get("pump-control");s&&e.push({id:"pumpPanel",position:s.position.clone().setY(s.position.y+1.1),deck:"D2",radius:2,verb:()=>"use",target:()=>ve("target.pumpPanel"),enabled:()=>this.step==="pumpRoom"||this.step==="restartPumps",run:()=>{this.step==="pumpRoom"&&this.advance(),this.pumpsRunning=!0,this.powerOn=!0,this.audio.play("pumpStart",0),this.hooks.say("pumps.restarted",void 0,5200),s.getObjectByName("pump-lamp-0")?.traverse(l=>{let h=l;if(h.isMesh){let d=h.material.clone();d.emissive.setHex(4165474),d.color.setHex(7321994),h.material=d}}),this.advance()}});let o=this.world.props.get("foyer-bell");o&&e.push({id:"bell",position:o.position.clone().setY(o.position.y+1.5),deck:"D4",radius:2,verb:()=>"use",target:()=>ve("target.bell"),enabled:()=>this.step==="alarm",run:()=>{this.audio.play("bell",0),this.audio.startAlarmBed(),this.alarmRinging=!0,this.hooks.say("alarm.rung",void 0,5400),this.advance()}}),["lifeboat-port-1","lifeboat-port-2","lifeboat-stbd-1","lifeboat-stbd-2"].forEach(l=>{let h=this.world.props.get(l);h&&e.push({id:`boat:${l}`,position:h.position.clone().setY(h.position.y+1.6),deck:"D5",radius:2.6,verb:()=>"climb",target:()=>ve("target.lifeboat"),enabled:()=>this.step==="lifeboats"||this.step==="escape",run:()=>{this.step==="lifeboats"&&this.advance(),this.audio.play("waterSplash",0),this.hooks.onWin()}})}),this.world.props.forEach((l,h)=>{if(!h.endsWith("-wardrobe")&&h!=="c307-wardrobe")return;let d=Wn(h.startsWith("c307")?"cabin-307":h.replace("-wardrobe",""));d&&e.push({id:`hide:${h}`,position:l.position.clone().setY(l.position.y+1),deck:d.deck,radius:1.8,verb:()=>this.player.hidden?"leave":"hide",target:()=>ve("target.wardrobe"),enabled:()=>this.impact,run:()=>{this.player.hidden=!this.player.hidden,this.player.hideSpot=this.player.hidden?h:null,this.audio.play("doorWood",0),this.hooks.say(this.player.hidden?"hide.enter":"hide.exit",void 0,2200)}})});let a=this.world.props.get("ladder-pump");a&&e.push({id:"ladder",position:a.position.clone().setY(a.position.y+1.2),deck:"D1",radius:1.6,verb:()=>"climb",target:()=>ve("target.ladder"),enabled:()=>!0,run:()=>{let l=this.player.feetY<nt("D2").y-.5;this.player.feetY=nt(l?"D2":"D1").y,this.player.x=a.position.x-.9,this.player.z=a.position.z,this.audio.play("footstepHard",0)}});let c=this.world.props.get("playroom-blackboard");c&&e.push({id:"blackboard",position:c.position.clone().setY(c.position.y+1.4),deck:"D4",radius:1.8,verb:()=>"read",target:()=>ve("target.blackboard"),enabled:()=>!0,run:()=>{this.hooks.say(this.impact?"ghost.warn":"ghost.first",void 0,3800),this.audio.play("childWhisper",3)}})}pick(){let e=this.player.eyePosition,t=new U(0,0,-1).applyEuler(this.player.camera.rotation),n=null,r=1/0;for(let s of this.interactables){if(!s.enabled())continue;let o=new U().subVectors(s.position,e),a=o.length();if(a>s.radius)continue;o.normalize();let c=o.dot(t);if(c<.25)continue;let l=a*(1.6-c);l<r&&(r=l,n=s)}return n}interact(){let e=this.pick();return e?(e.run(),!0):!1}triggerImpact(){this.impact=!0,this.shakeTimer=5,this.powerOn=!1,this.audio.play("impact",0),this.audio.startFloodBed(),this.hooks.say("impact.hit",void 0,6400),this.hooks.onImpact(),window.setTimeout(()=>this.hooks.say("impact.after",void 0,4e3),6600),window.setTimeout(()=>{this.hooks.say("impact.creature",void 0,4200),this.cast.creature.wake()},10500);let e=this.world.doors.get("d1-shaft-door");e&&(e.locked=!1,e.target=1),this.cast.passengers.forEach(t=>{t.figure.root.visible=!1}),this.cast.residents.forEach(t=>{t.figure.root.visible=!1;let n=this.world.doors.get(t.def.door);n&&(n.target=1,n.locked=!1)}),this.step==="shower"&&this.advance()}update(e){if(this.elapsed+=e,this.impactCountdown>0&&(this.impactCountdown-=e,this.impactCountdown<=0&&(this.impactCountdown=-1,this.triggerImpact())),this.world.doors.forEach(s=>{if(s.open===s.target)return;let o=s.def.kind==="watertight"||s.def.kind==="sealed"?1.1:2.6;if(s.open=s.open<s.target?Math.min(s.target,s.open+e*o):Math.max(s.target,s.open-e*o),s.pivot){let a=(s.def.kind==="sealed"?1.35:1.5)*s.open*s.swing;s.pivot.rotation.y=s.baseYaw+a}this.applyDoorCollider(s)}),this.impact){let s=this.pumpsRunning?.0015:.022,o=this.pumpsRunning?nt("D2").y+.3:nt("D4").y-.4;this.floodY=Math.min(o,this.floodY+s*e),this.list=_t((this.floodY+1.4)*.022,0,.18)*(this.alarmRinging?1.6:1),this.audio.setBedLevel("flood",_t((this.floodY-this.player.feetY+2)*.05,0,.28))}this.player.waterDepth=Math.max(0,this.floodY-this.player.feetY),this.player.waterDepth>.1&&this.elapsed-this.lastFloodMessage>24&&(this.lastFloodMessage=this.elapsed,this.hooks.say(this.player.waterDepth>.7?"flood.deep":"flood.rising",void 0,3e3));let t=Math.sin(this.elapsed*.42)*.012+this.list;if(this.shakeTimer>0){this.shakeTimer=Math.max(0,this.shakeTimer-e);let s=this.shakeTimer/5;t+=Math.sin(this.elapsed*38)*.09*s}if(this.player.setRoll(t*.35),this.impact&&this.ghostCursor<this.ghostBeats.length){let s=this.ghostBeats[this.ghostCursor];this.elapsed>s.at+30&&this.cast.ghosts.readyToAppear&&this.player.deck===s.deck&&this.cast.ghosts.appear(s.kind,s.deck,this.player.eyePosition)&&(this.ghostCursor+=1,this.hooks.say(s.kind==="crossing"?"ghost.pass":"ghost.first",void 0,3200))}if(this.impact&&!this.mirrorBeatDone&&this.player.deck==="D4"&&this.elapsed>60){let s=this.world.mirrors[0];s&&s.distanceTo(this.player.eyePosition)<6&&(this.mirrorBeatDone=!0,this.cast.ghosts.appear("watching","D4",this.player.eyePosition),this.hooks.say("ghost.mirror",void 0,4e3))}this.cast.ghosts.update(e,this.elapsed,this.player.eyePosition);let n=this.step==="lifeboats"||this.step==="escape";this.cast.creature.update(e,this.elapsed,{x:this.player.x,z:this.player.z,y:this.player.eyePosition.y,deck:this.player.deck,running:this.player.running,hidden:this.player.hidden,torchOn:this.player.torchOn},s=>{let o=this.world.doors.get(s);return!o||o.open>.55},n).caught&&this.hooks.onDeath(),this.checkArrival()}checkArrival(){let e={x:this.player.x,z:this.player.z,deck:this.player.deck};switch(this.step){case"goodnight":e.deck==="D3"&&e.z<-14&&e.x>-3&&(this.hooks.say("jack.cabinFound",void 0,2600),this.advance());break;case"afterImpact":e.deck==="D3"&&e.z>-14.5&&e.x>-1.9&&e.x<1.9&&this.advance();break;case"bridge":break;case"pumpRoom":e.deck==="D2"&&e.x>1.9&&e.z<-4&&this.advance();break;case"alarm":break;case"lifeboats":e.deck==="D5"&&(e.x<-3.6||e.x>3.6)&&this.advance();break;default:break}}};var al=class{constructor(e){this.ctx=null;this.master=null;this.sfxBus=null;this.musicGain=null;this.music=null;this.musicSource=null;this.beds=new Map;this.noiseBuffer=null;this.started=!1;this.listenerReady=!1;this.settings=e}get musicElement(){return this.music}get isRunning(){return this.started&&this.ctx?.state==="running"}async start(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.connect(this.ctx.destination),this.sfxBus=this.ctx.createGain(),this.sfxBus.connect(this.master),this.musicGain=this.ctx.createGain(),this.musicGain.connect(this.master);let t=Math.floor(this.ctx.sampleRate*2);this.noiseBuffer=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noiseBuffer.getChannelData(0),r=0;for(let o=0;o<t;o+=1){let a=Math.random()*2-1;r=(r+.02*a)/1.02,n[o]=r*3.2}if(this.music=new Audio("./audio/black-tide-deck.mp3"),this.music.loop=!0,this.music.preload="auto",window.location.protocol==="file:")this.musicSource=null;else{this.music.crossOrigin="anonymous";try{this.musicSource=this.ctx.createMediaElementSource(this.music),this.musicSource.connect(this.musicGain)}catch{this.musicSource=null}}}if(this.ctx.state==="suspended"&&await this.ctx.resume(),this.started=!0,this.listenerReady=!0,this.applySettings(this.settings),this.music&&this.music.paused)try{await this.music.play()}catch{}this.startHullBed()}applySettings(e){if(this.settings=e,!this.ctx||!this.master||!this.musicGain||!this.sfxBus)return;let t=this.ctx.currentTime;this.master.gain.setTargetAtTime(e.muted?0:_t(e.volume,0,1),t,.05),this.musicGain.gain.setTargetAtTime(_t(e.musicVolume,0,1)*.9,t,.08),this.sfxBus.gain.setTargetAtTime(.9,t,.05),this.music&&!this.musicSource&&(this.music.volume=_t(e.musicVolume,0,1)*.8),this.music&&(this.music.muted=e.muted)}suspend(){this.ctx?.suspend(),this.music?.pause()}async resume(){if(this.ctx&&(this.ctx.state==="suspended"&&await this.ctx.resume(),this.music&&this.music.paused&&!this.settings.muted))try{await this.music.play()}catch{}}startHullBed(){if(!this.ctx||!this.sfxBus||!this.noiseBuffer||this.beds.has("hull"))return;let e=this.ctx,t=e.createGain();t.gain.value=.16,t.connect(this.sfxBus);let n=e.createBufferSource();n.buffer=this.noiseBuffer,n.loop=!0;let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=340,r.Q.value=.4;let s=e.createOscillator(),o=e.createGain();s.frequency.value=.07,o.gain.value=120,s.connect(o).connect(r.frequency),n.connect(r).connect(t),n.start(),s.start();let a=e.createOscillator(),c=e.createGain();a.type="triangle",a.frequency.value=33,c.gain.value=.05;let l=e.createOscillator(),h=e.createGain();l.frequency.value=2.1,h.gain.value=.028,l.connect(h).connect(c.gain),a.connect(c).connect(t),a.start(),l.start(),this.beds.set("hull",{gain:t,nodes:[n,r,s,o,a,c,l,h]})}setBedLevel(e,t){let n=this.beds.get(e);n&&this.ctx&&n.gain.gain.setTargetAtTime(t,this.ctx.currentTime,.4)}startFloodBed(){if(!this.ctx||!this.sfxBus||!this.noiseBuffer||this.beds.has("flood"))return;let e=this.ctx,t=e.createGain();t.gain.value=0,t.connect(this.sfxBus);let n=e.createBufferSource();n.buffer=this.noiseBuffer,n.loop=!0;let r=e.createBiquadFilter();r.type="bandpass",r.frequency.value=900,r.Q.value=.7,n.connect(r).connect(t),n.start(),this.beds.set("flood",{gain:t,nodes:[n,r]}),t.gain.setTargetAtTime(.2,e.currentTime,2)}startAlarmBed(){if(!this.ctx||!this.sfxBus||this.beds.has("alarm"))return;let e=this.ctx,t=e.createGain();t.gain.value=0,t.connect(this.sfxBus);let n=e.createOscillator();n.type="square",n.frequency.value=520;let r=e.createGain();r.gain.value=0;let s=e.createOscillator(),o=e.createGain();s.type="square",s.frequency.value=1.15,o.gain.value=.035,s.connect(o).connect(r.gain);let a=e.createBiquadFilter();a.type="bandpass",a.frequency.value=900,n.connect(r).connect(a).connect(t),n.start(),s.start(),this.beds.set("alarm",{gain:t,nodes:[n,r,s,o,a]}),t.gain.setTargetAtTime(.5,e.currentTime,1.2)}play(e,t=0,n=0){if(!this.ctx||!this.sfxBus||!this.listenerReady||this.settings.muted)return;let r=this.ctx,s=r.currentTime,o=1/(1+Math.max(0,t)*.16);if(o<.02)return;let a=r.createGain();a.gain.value=o;let c=r.createStereoPanner?r.createStereoPanner():null;c?(c.pan.value=_t(n,-1,1),a.connect(c).connect(this.sfxBus)):a.connect(this.sfxBus);let l=(d,u,f,g,x)=>{if(!this.noiseBuffer)return;let m=r.createBufferSource();m.buffer=this.noiseBuffer;let p=r.createBiquadFilter();p.type=u,p.frequency.value=f,p.Q.value=g;let E=r.createGain();E.gain.setValueAtTime(x,s),E.gain.exponentialRampToValueAtTime(1e-4,s+d),m.connect(p).connect(E).connect(a),m.start(s),m.stop(s+d+.05)},h=(d,u,f,g="sine",x)=>{let m=r.createOscillator(),p=r.createGain();m.type=g,m.frequency.setValueAtTime(d,s),x!==void 0&&m.frequency.exponentialRampToValueAtTime(Math.max(20,x),s+u),p.gain.setValueAtTime(1e-4,s),p.gain.exponentialRampToValueAtTime(f,s+Math.min(.02,u*.2)),p.gain.exponentialRampToValueAtTime(1e-4,s+u),m.connect(p).connect(a),m.start(s),m.stop(s+u+.05)};switch(e){case"footstepSoft":l(.11,"lowpass",420,.8,.11);break;case"footstepHard":l(.09,"bandpass",1500,1.4,.13),h(120,.07,.05,"triangle",70);break;case"footstepWater":l(.22,"bandpass",2400,.9,.17);break;case"doorWood":l(.5,"lowpass",900,1.1,.1),h(160,.5,.05,"sawtooth",92);break;case"doorSteel":h(88,.7,.1,"square",54),l(.6,"bandpass",1800,2.2,.1);break;case"doorLocked":h(220,.09,.11,"square",180),window.setTimeout(()=>this.play("switch",t,n),110);break;case"switch":l(.06,"highpass",2600,1,.14);break;case"bell":[1,2.76,5.4,8.9].forEach((d,u)=>{h(174*d,3.6-u*.5,.16/(u+1),"sine")});break;case"alarm":h(680,.34,.12,"square",520);break;case"impact":h(38,3,.34,"sawtooth",21),h(64,1.6,.16,"square",30),l(2.4,"lowpass",260,.6,.3),window.setTimeout(()=>{this.play("creak",0,.3),this.play("creak",0,-.4)},420);break;case"creak":h(92+Math.random()*60,1.7,.07,"sawtooth",44),l(1.5,"bandpass",520,6,.06);break;case"waterSplash":l(.6,"bandpass",1700,.7,.16);break;case"shower":l(1.4,"highpass",3200,.5,.16);break;case"valve":h(300,.5,.05,"sawtooth",120),l(.5,"bandpass",800,4,.08);break;case"pumpStart":h(46,2.4,.14,"sawtooth",88),l(2.2,"lowpass",500,.7,.12);break;case"childLaugh":{let d=5+Math.floor(Math.random()*3);for(let u=0;u<d;u+=1)window.setTimeout(()=>{this.ctx&&h(700+Math.random()*380,.13,.055*o,"triangle",460)},u*128);break}case"childWhisper":l(1.1,"bandpass",1900,3.2,.09);break;case"creatureCall":h(58,2.2,.16,"sawtooth",132),h(410,1.5,.04,"triangle",190),l(2,"bandpass",700,1.6,.1);break;case"creatureStep":h(52,.22,.12,"square",34),l(.24,"lowpass",700,.9,.09);break;case"heartbeat":h(56,.16,.16,"sine",34),window.setTimeout(()=>{if(this.ctx&&!this.settings.muted){let d=this.ctx.createOscillator(),u=this.ctx.createGain(),f=this.ctx.currentTime;d.type="sine",d.frequency.setValueAtTime(50,f),u.gain.setValueAtTime(.11*o,f),u.gain.exponentialRampToValueAtTime(1e-4,f+.2),d.connect(u).connect(this.sfxBus),d.start(f),d.stop(f+.25)}},240);break;case"chime":h(880,.5,.05,"sine"),h(1320,.4,.03,"sine");break;default:break}}dispose(){this.beds.forEach(e=>{e.nodes.forEach(t=>{let n=t;if(typeof n.stop=="function")try{n.stop()}catch{}})}),this.beds.clear(),this.music?.pause(),this.ctx?.close(),this.ctx=null,this.started=!1}};var ll=class{constructor(e){this.state={forward:0,strafe:0,run:!1,crouch:!1,yawDelta:0,pitchDelta:0};this.touchActive=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches;this.keys=new Set;this.cleanups=[];this.stickId=null;this.stickOrigin={x:0,y:0};this.stickVector={x:0,y:0};this.lookId=null;this.lookLast={x:0,y:0};this.touchRun=!1;this.stickKnob=null;this.options=e,this.bindKeyboard(),this.bindMouse(),this.bindTouch()}on(e,t,n,r){e.addEventListener(t,n,r),this.cleanups.push(()=>e.removeEventListener(t,n,r))}bindKeyboard(){let e=new Set(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","ShiftRight","KeyC","Space"]);this.on(document,"keydown",t=>{if(e.has(t.code)&&(t.preventDefault(),this.keys.add(t.code)),!t.repeat)switch(t.code){case"KeyE":case"Enter":this.options.onAction("interact");break;case"KeyF":this.options.onAction("torch");break;case"Escape":this.options.onAction("pause");break;case"KeyM":this.options.onAction("mute");break;case"KeyH":this.options.onAction("hint");break;case"KeyTab":case"KeyN":this.options.onAction("map");break;default:break}}),this.on(document,"keyup",t=>{this.keys.delete(t.code)}),this.on(window,"blur",()=>this.keys.clear())}bindMouse(){this.on(document,"mousemove",e=>{if(document.pointerLockElement!==this.options.canvas||!this.options.isPlaying())return;let t=this.options.getSensitivity();this.state.yawDelta-=e.movementX*.0022*t,this.state.pitchDelta-=e.movementY*.002*t})}bindTouch(){let e=this.options.touchRoot,t=e.querySelector("[data-touch='stick']"),n=e.querySelector("[data-touch='look']");this.stickKnob=e.querySelector("[data-touch='knob']");let r=()=>{document.body.classList.contains("touch-input")||(this.touchActive=!0,document.body.classList.add("touch-input"))};if(this.touchActive&&document.body.classList.add("touch-input"),t){this.on(t,"pointerdown",o=>{if(o.pointerType==="mouse")return;r(),o.preventDefault(),this.stickId=o.pointerId;let a=t.getBoundingClientRect();this.stickOrigin={x:a.left+a.width/2,y:a.top+a.height/2},t.setPointerCapture(o.pointerId)},{passive:!1}),this.on(t,"pointermove",o=>{if(o.pointerId!==this.stickId)return;o.preventDefault();let a=56,c=_t((o.clientX-this.stickOrigin.x)/a,-1,1),l=_t((o.clientY-this.stickOrigin.y)/a,-1,1);this.stickVector={x:c,y:l},this.stickKnob&&(this.stickKnob.style.transform=`translate(${c*34}px, ${l*34}px)`)},{passive:!1});let s=o=>{o.pointerId===this.stickId&&(this.stickId=null,this.stickVector={x:0,y:0},this.stickKnob&&(this.stickKnob.style.transform="translate(0px, 0px)"))};this.on(t,"pointerup",s),this.on(t,"pointercancel",s)}if(n){this.on(n,"pointerdown",o=>{o.pointerType!=="mouse"&&(r(),o.preventDefault(),this.lookId=o.pointerId,this.lookLast={x:o.clientX,y:o.clientY},n.setPointerCapture(o.pointerId))},{passive:!1}),this.on(n,"pointermove",o=>{if(o.pointerId!==this.lookId)return;o.preventDefault();let a=this.options.getSensitivity();this.state.yawDelta-=(o.clientX-this.lookLast.x)*.0042*a,this.state.pitchDelta-=(o.clientY-this.lookLast.y)*.0036*a,this.lookLast={x:o.clientX,y:o.clientY}},{passive:!1});let s=o=>{o.pointerId===this.lookId&&(this.lookId=null)};this.on(n,"pointerup",s),this.on(n,"pointercancel",s)}e.querySelectorAll("[data-action]").forEach(s=>{let o=s.dataset.action;this.on(s,"pointerdown",c=>{if(r(),c.preventDefault(),s.classList.add("pressed"),o==="run"){this.touchRun=!this.touchRun,s.classList.toggle("latched",this.touchRun);return}this.options.onAction(o)},{passive:!1});let a=c=>{c.preventDefault(),s.classList.remove("pressed")};this.on(s,"pointerup",a,{passive:!1}),this.on(s,"pointercancel",a,{passive:!1})}),this.on(document,"touchmove",s=>{this.options.isPlaying()&&s.preventDefault()},{passive:!1}),this.on(document,"gesturestart",s=>s.preventDefault(),{passive:!1}),this.on(document,"contextmenu",s=>{this.options.isPlaying()&&s.preventDefault()}),this.on(window,"pointerdown",s=>{s.pointerType==="touch"&&r()})}consumeLook(){let e={yaw:this.state.yawDelta,pitch:this.state.pitchDelta};return this.state.yawDelta=0,this.state.pitchDelta=0,e}sample(){let e=(this.keys.has("KeyW")||this.keys.has("ArrowUp")?1:0)-(this.keys.has("KeyS")||this.keys.has("ArrowDown")?1:0),t=(this.keys.has("KeyD")||this.keys.has("ArrowRight")?1:0)-(this.keys.has("KeyA")||this.keys.has("ArrowLeft")?1:0);return this.state.forward=_t(e-this.stickVector.y,-1,1),this.state.strafe=_t(t+this.stickVector.x,-1,1),this.state.run=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")||this.touchRun,this.state.crouch=this.keys.has("KeyC"),this.state}clearMovement(){this.keys.clear(),this.stickVector={x:0,y:0},this.stickId=null,this.lookId=null,this.touchRun=!1,this.stickKnob&&(this.stickKnob.style.transform="translate(0px, 0px)"),this.options.touchRoot.querySelectorAll(".latched").forEach(e=>e.classList.remove("latched"))}dispose(){this.cleanups.forEach(e=>e()),this.cleanups=[]}};var cl={brightness:1,gamma:1,volume:.8,musicVolume:.55,muted:!1,quality:"auto",sensitivity:1,subtitles:!0,hints:!0},Uu="crystal-ship.settings",Qt={...cl},jc=new Set;function Fu(){try{let i=window.localStorage.getItem(Uu);if(i){let e=JSON.parse(i);Qt={...cl,...e}}}catch{Qt={...cl}}return Qt.brightness=_t(Qt.brightness,.6,1.8),Qt.gamma=_t(Qt.gamma,.7,1.4),Qt.volume=_t(Qt.volume,0,1),Qt.musicVolume=_t(Qt.musicVolume,0,1),Qt.sensitivity=_t(Qt.sensitivity,.3,2.5),Qt}function on(){return Qt}function An(i){Qt={...Qt,...i};try{window.localStorage.setItem(Uu,JSON.stringify(Qt))}catch{}return jc.forEach(e=>e(Qt)),Qt}function Bu(){return An({...cl})}function Ou(i){return jc.add(i),()=>jc.delete(i)}function Pe(i,e,t={}){let n=document.createElement(i);e&&(n.className=e);for(let[r,s]of Object.entries(t))n.setAttribute(r,s);return n}function zu(i){i.innerHTML="";let e=Pe("div","shell");i.appendChild(e);let t=Pe("div","canvas-host");e.appendChild(t);let n=Pe("div","film-grade",{"aria-hidden":"true"});e.appendChild(n);let r=Pe("div","vignette",{"aria-hidden":"true"});e.appendChild(r);let s=Pe("div","damage-wash",{"aria-hidden":"true"});e.appendChild(s);let o=Pe("div","hud");e.appendChild(o);let a=Pe("div","hud-objective",{role:"status","aria-live":"polite"}),c=Pe("span","hud-eyebrow");c.dataset.i18n="hud.objective";let l=Pe("div","hud-objective-text");a.append(c,l),o.appendChild(a);let h=Pe("div","hud-deck"),d=Pe("div","hud-deck-name"),u=Pe("div","hud-compass");u.innerHTML='<span class="hud-needle"></span>',h.append(d,u),o.appendChild(h);let f=Pe("div","hud-breath"),g=Pe("span","hud-eyebrow");g.dataset.i18n="hud.breath";let x=Pe("div","hud-breath-track"),m=Pe("div","hud-breath-fill");x.appendChild(m),f.append(g,x),o.appendChild(f);let p=Pe("div","reticle",{"aria-hidden":"true"});o.appendChild(p);let E=Pe("div","prompt",{role:"status","aria-live":"polite"});o.appendChild(E);let v=Pe("div","subtitle",{role:"status","aria-live":"polite"});o.appendChild(v);let S=Pe("div","touch");S.setAttribute("aria-label",ve("a11y.touchControls")),e.appendChild(S);let b=Pe("div","touch-stick");b.dataset.touch="stick",b.setAttribute("aria-label",ve("a11y.joystick"));let y=Pe("div","touch-knob");y.dataset.touch="knob",b.appendChild(y),S.appendChild(b);let T=Pe("div","touch-look");T.dataset.touch="look",T.setAttribute("aria-label",ve("a11y.lookArea")),S.appendChild(T);let k=Pe("div","touch-buttons"),_=(N,z,O,G="")=>{let Y=Pe("button",`touch-button ${G}`,{type:"button"});return Y.dataset.action=N,Y.setAttribute("aria-label",ve(z)),Y.innerHTML=`<span>${O}</span>`,Y},M=_("interact","a11y.action","","primary");M.dataset.i18nText="verb.use",k.append(_("torch","a11y.torch","\u2600"),_("run","a11y.run","\xBB"),M),S.appendChild(k);let D=_("pause","a11y.pause","II","corner");S.appendChild(D);let L=Pe("div","overlay");return e.appendChild(L),{root:e,canvasHost:t,touchRoot:S,hud:o,objectiveText:l,deckLabel:d,compass:u,breathFill:m,prompt:E,subtitle:v,overlay:L,vignette:r,damage:s}}function Jc(i){i.querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=ve(e.dataset.i18n)}),i.querySelectorAll("[data-i18n-text]").forEach(e=>{let t=e.querySelector("span");t&&(t.textContent=ve(e.dataset.i18nText))}),i.querySelectorAll("[data-i18n-label]").forEach(e=>{e.setAttribute("aria-label",ve(e.dataset.i18nLabel))})}function p1(i){let e=Pe("div","language-switch",{role:"group"}),t=Pe("span","field-label");t.textContent=ve("menu.language"),e.appendChild(t);let n=Pe("div","segmented");return Object.keys($c).forEach(r=>{let s=Pe("button","segment",{type:"button",lang:r});s.textContent=$c[r],s.classList.toggle("active",rl()===r),s.addEventListener("click",()=>{sl(r),i()}),n.appendChild(s)}),e.appendChild(n),e}function $s(i,e,t,n,r,s){let o=Pe("label","field"),a=Pe("span","field-label");a.textContent=ve(i);let c=Pe("input","field-range",{type:"range",min:String(t),max:String(n),step:String(r),value:String(e)}),l=Pe("span","field-value");return l.textContent=Math.round(e/n*100)+"%",c.addEventListener("input",()=>{let h=Number(c.value);l.textContent=Math.round(h/n*100)+"%",s(h)}),o.append(a,c,l),o}function Zc(i,e,t){let n=Pe("div","field"),r=Pe("span","field-label");r.textContent=ve(i);let s=Pe("button","field-toggle",{type:"button"}),o=c=>{s.textContent=ve(c?"settings.on":"settings.off"),s.classList.toggle("on",c)};o(e);let a=e;return s.addEventListener("click",()=>{a=!a,o(a),t(a)}),n.append(r,s),n}function Hu(i,e){let t=on(),n=Pe("div","settings");n.appendChild(p1(e)),n.appendChild($s("settings.brightness",t.brightness,.6,1.8,.02,c=>{An({brightness:c}),i.onSettingsChanged()})),n.appendChild($s("settings.gamma",t.gamma,.7,1.4,.02,c=>{An({gamma:c}),i.onSettingsChanged()})),n.appendChild($s("settings.volume",t.volume,0,1,.02,c=>{An({volume:c}),i.onSettingsChanged()})),n.appendChild($s("settings.music",t.musicVolume,0,1,.02,c=>{An({musicVolume:c}),i.onSettingsChanged()})),n.appendChild($s("settings.sensitivity",t.sensitivity,.3,2.5,.05,c=>{An({sensitivity:c}),i.onSettingsChanged()}));let r=Pe("div","field"),s=Pe("span","field-label");s.textContent=ve("settings.quality");let o=Pe("div","segmented");["auto","low","medium","high"].forEach(c=>{let l=Pe("button","segment",{type:"button"});l.textContent=ve(`settings.quality.${c}`),l.classList.toggle("active",t.quality===c),l.addEventListener("click",()=>{An({quality:c}),i.onSettingsChanged(),e()}),o.appendChild(l)}),r.append(s,o),n.appendChild(r),n.appendChild(Zc("settings.subtitles",t.subtitles,c=>{An({subtitles:c}),i.onSettingsChanged()})),n.appendChild(Zc("settings.hints",t.hints,c=>{An({hints:c}),i.onSettingsChanged()})),n.appendChild(Zc("settings.mute",on().muted,c=>{An({muted:c}),i.onSettingsChanged()}));let a=Pe("button","ghost-button",{type:"button"});return a.textContent=ve("settings.reset"),a.addEventListener("click",()=>{Bu(),i.onSettingsChanged(),e()}),n.appendChild(a),n}function hl(i,e,t){let n=()=>hl(i,e,t);i.className="overlay title",i.innerHTML="";let r=Pe("div","title-art",{"aria-hidden":"true"});i.appendChild(r);let s=Pe("section","title-panel"),o=Pe("div","eyebrow");o.textContent=ve("game.chapter");let a=Pe("h1","title-heading");a.innerHTML=`<span>${ve("game.titleA")}</span><em>${ve("game.titleB")}</em>`;let c=Pe("p","title-subtitle");c.textContent=ve("game.subtitle");let l=Pe("p","title-story");l.textContent=ve("menu.story"),s.append(o,a,c,l);let h=Pe("div","controls-grid"),d=t.touch?[["controls.touch.move","controls.move"],["controls.touch.look","controls.look"],["controls.touch.action","controls.interact"]]:[["controls.keys.move","controls.move"],["controls.keys.look","controls.look"],["","controls.run"],["","controls.interact"],["","controls.flashlight"],["","controls.pause"]],u=["","","SHIFT","E","F","ESC"];d.forEach(([p,E],v)=>{let S=Pe("div","controls-row"),b=Pe("b");b.textContent=p?ve(p):u[v]||"";let y=Pe("span");y.textContent=ve(E),S.append(b,y),h.appendChild(S)}),s.appendChild(h);let f=Pe("button","primary-button",{type:"button"});if(f.textContent=t.webglFailed?ve("menu.noWebgl"):t.ready?ve("menu.start"):ve("menu.preparing"),f.disabled=!t.ready||t.webglFailed,f.addEventListener("click",e.start),s.appendChild(f),t.webglFailed){let p=Pe("p","note");p.textContent=ve("menu.noWebglHelp"),s.appendChild(p)}let g=Pe("details","settings-details"),x=Pe("summary");x.textContent=ve("menu.settings"),g.appendChild(x),g.appendChild(Hu(e,n)),s.appendChild(g);let m=Pe("p","note");m.textContent=ve("menu.credits"),s.appendChild(m),i.appendChild(s),i.hidden=!1}function Qc(i,e){let t=()=>Qc(i,e);i.className="overlay modal",i.innerHTML="";let n=Pe("section","modal-panel"),r=Pe("h2");r.textContent=ve("menu.paused");let s=Pe("p");s.textContent=ve("menu.pausedNote"),n.append(r,s);let o=Pe("div","button-row"),a=Pe("button","primary-button",{type:"button"});a.textContent=ve("menu.resume"),a.addEventListener("click",e.resume);let c=Pe("button","ghost-button",{type:"button"});c.textContent=ve("menu.restart"),c.addEventListener("click",e.restart),o.append(a,c),n.appendChild(o),n.appendChild(Hu(e,t)),i.appendChild(n),i.hidden=!1}function Gu(i,e){i.className="overlay modal death",i.innerHTML="";let t=Pe("section","modal-panel"),n=Pe("h2");n.textContent=ve("death.title");let r=Pe("p");r.textContent=ve("death.text");let s=Pe("button","primary-button",{type:"button"});s.textContent=ve("death.retry"),s.addEventListener("click",e.restart),t.append(n,r,s),i.appendChild(t),i.hidden=!1}function Vu(i,e){i.className="overlay modal ending",i.innerHTML="";let t=Pe("section","modal-panel"),n=Pe("div","eyebrow");n.textContent=ve("win.eyebrow");let r=Pe("h2");r.textContent=ve("win.title");let s=Pe("p");s.textContent=ve("win.text");let o=Pe("p","note");o.textContent=ve("win.next");let a=Pe("button","primary-button",{type:"button"});a.textContent=ve("win.again"),a.addEventListener("click",e.restart),t.append(n,r,s,o,a),i.appendChild(t),i.hidden=!1}function Wu(i){i.hidden=!0,i.innerHTML="",i.className="overlay"}var eh={x:0,z:14.4,deck:"D4",yaw:0};function m1(){let i=document.getElementById("root");if(!i)throw new Error("#root is missing");Fu(),sl(Lu()),document.documentElement.lang=rl();let e=zu(i);Jc(e.root);let t;try{t=new Xa({antialias:!1,powerPreference:"high-performance",stencil:!1})}catch{hl(e.overlay,g1(),{ready:!1,webglFailed:!0,touch:!1});return}t.outputColorSpace=pt,t.toneMapping=na,t.setSize(window.innerWidth,window.innerHeight),e.canvasHost.appendChild(t.domElement),t.domElement.setAttribute("aria-label",ve("a11y.canvas"));let n=new ls;n.fog=new as(1317920,.014);let r=xu(),s=r.root;n.add(s),n.add(r.exterior.root);let o=new el(r.colliders);r.doors.forEach((se,ce)=>{se.def.kind!=="open"&&o.setDynamic(`door-${ce}`,se.collider)});let a=yu(r.colliders),c=on(),l=new al(c),h=new il(o);s.add(h.camera);let d=Au(a,o,l,eh);s.add(d.root);let u=new Le({color:2906726,emissive:928822,emissiveIntensity:.55,roughness:.14,metalness:.3,transparent:!0,opacity:.78,side:Gt,depthWrite:!1}),f=new K(new At(8.6*2-1.6,66,8,24),u);f.rotation.x=-Math.PI/2,f.position.set(0,-3,2/2+1),f.visible=!1,f.renderOrder=2,s.add(f);let g=new pe;g.name="objective-beacon";{let se=new Dn({color:14268792,transparent:!0,opacity:.5,depthTest:!1,fog:!1}),ce=new K(new _s(.22,0),se);ce.position.y=1.7,g.add(ce);let $=new K(new $e(.05,.05,2.6,6,1,!0),new Dn({color:14268792,transparent:!0,opacity:.16,depthTest:!1,fog:!1,side:Gt}));$.position.y=1.3,g.add($);let C=new K(new fn(.5,.03,4,20),new Dn({color:14268792,transparent:!0,opacity:.3,depthTest:!1,fog:!1}));C.rotation.x=Math.PI/2,C.position.y=.06,g.add(C),g.renderOrder=999,g.visible=!1}s.add(g);let x="title",m=!1,p=0,E="",v=[];function S(se,ce,$=3200){on().subtitles&&(e.subtitle.textContent=ve(se,ce),e.subtitle.classList.add("visible"),p=$/1e3)}let b=2,y=4,T=new ol({world:r,nav:a,player:h,cast:d,audio:l,collision:o,hooks:{say:S,setObjective:se=>{e.objectiveText.textContent=se},onImpact:()=>{r.exterior.setStormy(.7),f.visible=!0},onDeath:()=>L("dead"),onWin:()=>L("won")}}),k=new ll({canvas:t.domElement,touchRoot:e.touchRoot,getSensitivity:()=>on().sensitivity,isPlaying:()=>x==="playing",onAction:se=>_(se)});function _(se){switch(se){case"interact":if(x!=="playing")return;T.interact()||(e.subtitle.textContent=ve("prompt.nothing"),e.subtitle.classList.add("visible"),p=1.2);break;case"torch":if(x!=="playing")return;h.setTorch(!h.torchOn),l.play("switch",0);break;case"mute":An({muted:!on().muted});break;case"pause":x==="playing"?L("paused"):x==="paused"&&L("playing");break;case"hint":if(x!=="playing"||!on().hints)return;e.subtitle.textContent=T.currentStep.objective(),e.subtitle.classList.add("visible"),p=3.4;break;default:break}}let M={start:()=>{l.start(),N(),L("playing")},resume:()=>L("playing"),restart:()=>{N(),L("playing")},onSettingsChanged:()=>{l.applySettings(on()),z()}};function D(){switch(x){case"title":hl(e.overlay,M,{ready:m,webglFailed:!1,touch:k.touchActive});break;case"paused":Qc(e.overlay,M);break;case"dead":Gu(e.overlay,M);break;case"won":Vu(e.overlay,M);break;default:Wu(e.overlay);break}e.root.classList.toggle("in-game",x==="playing")}function L(se){x!==se&&(x=se,se==="playing"?(k.clearMovement(),l.resume(),!k.touchActive&&t.domElement.requestPointerLock&&t.domElement.requestPointerLock()):(document.pointerLockElement===t.domElement&&document.exitPointerLock(),se!=="paused"&&l.setBedLevel("alarm",0)),D())}function N(){h.spawn(eh),T.reset(),r.exterior.setStormy(0),f.visible=!1,u.opacity=.78,S("intro.arrival",void 0,6e3)}document.addEventListener("pointerlockchange",()=>{x==="playing"&&!k.touchActive&&document.pointerLockElement!==t.domElement&&L("paused")}),t.domElement.addEventListener("click",()=>{x==="playing"&&!k.touchActive&&document.pointerLockElement!==t.domElement&&t.domElement.requestPointerLock()}),Nu(()=>{Jc(e.root),e.objectiveText.textContent=T.currentStep.objective(),D()}),Ou(()=>{l.applySettings(on())});function z(){let se=on();t.toneMappingExposure=1.15*se.brightness;let ce=se.gamma-1;r.interiorAmbient.intensity=.62+Math.max(0,ce)*.55,r.exterior.skyAmbient.intensity=.55+Math.max(0,ce)*.4,e.canvasHost.style.filter=Math.abs(ce)<.01?"none":`brightness(${(1+ce*.28).toFixed(3)}) contrast(${(1-ce*.22).toFixed(3)})`}function O(se){b=se;let ce=window.devicePixelRatio||1,$=se===0?.7:se===1?1:1.35;t.setPixelRatio(Math.min(ce,$)),t.setSize(window.innerWidth,window.innerHeight),r.mirrors.forEach((C,te)=>{let ae=se===0?128:se===1?192:320,he=se===0?.34:se===1?.12:0;C.setQuality(ae,he+te*.01)})}function G(){h.camera.aspect=window.innerWidth/Math.max(1,window.innerHeight),h.camera.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight)}window.addEventListener("resize",G),window.addEventListener("orientationchange",()=>window.setTimeout(G,250));let Y=()=>b===0?5:b===1?8:11,H=0;r.lights.forEach(se=>{se.light.visible=!1});function V(se){if(H-=se,H>0)return;H=.22;let ce=h.eyePosition,$=Y();r.lights.map(te=>({handle:te,d:te.light.position.distanceToSquared(ce)})).sort((te,ae)=>te.d-ae.d).forEach((te,ae)=>{let he=T.powerOn||te.handle.kind==="emergency"||te.handle.kind==="work",Z=te.handle,me=ae<$&&he&&te.d<900;if(Z.light.visible=me,me){let ue=Z.flicker+(T.impact&&Z.kind==="work"?.5:0),Te=1;if(ue>.01){let P=Math.sin(T.elapsed*(7+ue*14)+ae*2.1)*Math.sin(T.elapsed*3.3+ae);P>.82-ue*.5?Te=.12:P>.5&&(Te=.62)}Z.light.intensity=Z.base*Te*(T.impact?.85:1),Z.glass.forEach(P=>{let A=P.material;A.emissiveIntensity=2.1*Te})}})}let ee=null;function re(){if(ee===h.deck)return;ee=h.deck;let se=xt.findIndex(ce=>ce.id===h.deck);xt.forEach((ce,$)=>{let C=r.deckGroups.get(ce.id);C&&(C.visible=Math.abs($-se)<=1)})}function xe(){r.props.forEach((se,ce)=>{!ce.includes("strip")&&!ce.includes("beacon")||se.traverse($=>{let C=$;if(!C.isMesh||C.name!=="emergency-strip"&&C.name!=="beacon-dome")return;let te=C.material;te.emissiveIntensity=T.impact?C.name==="beacon-dome"?1.4+Math.sin(T.elapsed*6)*.9:1.9:C.name==="beacon-dome"?.15:.55})})}function ke(se){r.animated.forEach(ce=>{switch(ce.kind){case"helm":ce.object.rotation.z+=se*(T.impact?.55:.04);break;case"engine":{let $=ce.object.userData.flywheel;$&&($.rotation.z+=se*(T.impact?.3:3.4));break}case"shaft":{let $=ce.object.userData.shaft;$&&($.rotation.y+=se*(T.impact?.2:2.6));break}case"pump":T.pumpsRunning&&(ce.object.rotation.y+=se*.02);break;case"radar":ce.object.rotation.y=Math.sin(T.elapsed*.4)*.02;break;case"rockingHorse":ce.object.rotation.z=T.impact?Math.sin(T.elapsed*1.9)*.09:0;break;case"containment":if(T.impact){let $=ce.object.getObjectByName("containment-plate");$&&($.rotation.x=Jt($.rotation.x,-1.1,.6,se),$.position.z=Jt($.position.z,-.6,.6,se))}break;default:break}})}let Xe=e.compass.querySelector(".hud-needle");function je(){e.deckLabel.textContent=ve(nt(h.deck).nameKey),e.breathFill.style.transform=`scaleX(${(h.stamina/100).toFixed(3)})`;let se=T.objectiveMarker();if(se&&on().hints){let ae=nt(se.deck).y;g.position.set(se.x,ae,se.z);let he=se.deck===h.deck,Z=Math.hypot(se.x-h.x,se.z-h.z);g.visible=he||Z<26,g.rotation.y=T.elapsed*.7,g.children.forEach(me=>{let ue=me.material,Te=_t((Z-2.2)/6,0,1);ue.opacity=(he?.5:.18)*Te*(me===g.children[1]?.4:1)})}else g.visible=!1;let ce=T.objectiveMarker();if(ce&&Xe){let ae=ce.x-h.x,he=ce.z-h.z,Z=Math.atan2(ae,-he)+h.yaw;Xe.style.transform=`rotate(${Z}rad)`;let me=nt(ce.deck).y-h.deckY;e.compass.dataset.level=me>.5?"up":me<-.5?"down":"level",e.compass.hidden=!1;let ue=Math.round(Math.hypot(ae,he));e.deckLabel.textContent=me>.5?`${ve(nt(h.deck).nameKey)} \xB7 ${ve("hud.goUp")} ${ve(nt(ce.deck).nameKey)}`:me<-.5?`${ve(nt(h.deck).nameKey)} \xB7 ${ve("hud.goDown")} ${ve(nt(ce.deck).nameKey)}`:`${ve(nt(h.deck).nameKey)} \xB7 ${ue} m`}else Xe&&(e.compass.hidden=!0);let $=T.pick(),C=$?k.touchActive?ve("prompt.touch",{verb:ve(`verb.${$.verb()}`)}):ve("prompt.pc",{key:"E",verb:ve(`verb.${$.verb()}`).toLowerCase(),target:$.target()}):"";if(C!==E){E=C,e.prompt.textContent=C,e.prompt.classList.toggle("visible",C.length>0);let ae=e.touchRoot.querySelector("[data-action='interact'] span");ae&&(ae.textContent=$?ve(`verb.${$.verb()}`):ve("verb.use"))}let te=d.creature.awake?_t(1-d.creature.distance/16,0,1):0;e.damage.style.opacity=(te*te*.55).toFixed(3)}function j(se){let ce=h.eyePosition,$=0,C=b===0?1:2;r.mirrors.forEach(te=>{let ae=te.distanceTo(ce);te.mesh.visible=ae<16,!(!te.mesh.visible||$>=C)&&($+=1,te.update(t,n,h.camera,se))})}let oe=new Cs,Ae=0;function ze(){Ae=requestAnimationFrame(ze);let se=Math.min(.05,oe.getDelta());if(x==="playing"){let ce=k.sample(),$=k.consumeLook();h.update(se,ce,$,C=>{l.play(C==="water"?"footstepWater":C==="soft"?"footstepSoft":"footstepHard",0)}),T.update(se),Cu(d.passengers,T.elapsed,h.eyePosition,se),Ru(d.residents,T.elapsed),ke(se),xe(),re(),V(se),je(),s.rotation.z=T.list*.45+Math.sin(T.elapsed*.38)*.006,s.rotation.x=Math.sin(T.elapsed*.27)*.004,T.impact&&(f.position.y=T.floodY,f.visible=T.floodY>-1.2)}if(r.exterior.update(T.elapsed,h.eyePosition.y),p>0&&(p-=se,p<=0&&e.subtitle.classList.remove("visible")),x!=="title"&&j(se),t.render(n,h.camera),on().quality==="auto"&&(v.push(se),v.length>90&&v.shift(),y-=se,y<=0&&v.length>=60)){y=5;let $=1/(v.reduce((C,te)=>C+te,0)/v.length);$<28&&b>0?O(b-1):$>55&&b<2&&O(b+1),v=[]}}let Be=window.matchMedia("(pointer: coarse)").matches;O(Be?1:2),z(),on().quality!=="auto"&&O(on().quality==="low"?0:on().quality==="medium"?1:2),G(),h.spawn(eh),T.reset(),re(),m=!0,D(),ze(),window.__crystalShip={renderer:t,scene:n,world:r,nav:a,player:h,director:T,cast:d,getPhase:()=>x,setPhase:L,teleport:(se,ce,$,C=0,te=0)=>{h.x=se,h.z=ce,h.deck=$,h.feetY=nt($).y,h.yaw=C,h.pitch=te},setTorch:se=>h.setTorch(se),audioState:()=>{let se=l.musicElement;return se?{src:se.src.split("/").pop(),error:se.error?se.error.code:null,readyState:se.readyState,paused:se.paused}:null},setYaw:se=>{h.yaw=se},where:()=>({x:h.x,z:h.z,y:h.feetY,deck:h.deck}),collidersAt:(se,ce,$)=>r.colliders.filter(C=>se>C.x1-.3&&se<C.x2+.3&&ce>C.z1-.3&&ce<C.z2+.3&&$>C.y1&&$<C.y2).map(C=>({...C})),routeTo:(se,ce,$)=>{let C=a.nodeAt(h.deck,h.x,h.z),te=a.nodeAt($,se,ce);if(C===void 0||te===void 0)return null;let ae=a.path(C,te,me=>{let ue=r.doors.get(me);return!ue||!ue.locked}),he=[],Z=null;return ae.forEach(me=>{let ue=a.nodes[me];Z&&ue.deck!==Z&&((nt(ue.deck).y>nt(Z).y?"up":"down")==="up"?(he.push({x:-2.3,z:14.6,deck:Z}),he.push({x:1.6,z:14.6,deck:Z}),he.push({x:1.6,z:12,deck:Z}),he.push({x:1.6,z:9.5,deck:Z}),he.push({x:1.6,z:5.6,deck:ue.deck})):(he.push({x:1.6,z:5.6,deck:Z}),he.push({x:1.6,z:8,deck:Z}),he.push({x:1.6,z:11,deck:ue.deck}),he.push({x:1.6,z:14.6,deck:ue.deck}))),he.push({x:ue.x,z:ue.z,deck:ue.deck}),Z=ue.deck}),he},forceImpact:()=>{T.triggerImpact()},poseCast:se=>{if(se.creature){let[ce,$,C]=se.creature;d.creature.wake(),d.creature.root.position.set(ce,nt(C).y,$),d.creature.root.rotation.y=se.creatureYaw??0,d.creature.root.visible=!0}if(se.ghosts){let[ce,$,C]=se.ghosts;d.ghosts.children.forEach((te,ae)=>{te.root.visible=!0,te.root.position.set(ce+(ae===0?.75:-.75),nt(C).y,$+ae*.5),te.root.rotation.y=Math.PI})}},setStep:se=>{let $=T.steps.findIndex(C=>C.id===se);return $>=0&&(T.stepIndex=$,T.refreshObjective()),$},stats:()=>({calls:t.info.render.calls,triangles:t.info.render.triangles,geometries:t.info.memory.geometries,textures:t.info.memory.textures,lights:r.lights.filter(se=>se.light.visible).length,navNodes:a.nodes.length,colliders:r.colliders.length,quality:b})};let lt=ru();lt.length>0&&console.warn(`THE CRYSTAL SHIP \xB7 ${lt.length} build warning(s) \u2014 see above.`),window.addEventListener("beforeunload",()=>{cancelAnimationFrame(Ae),k.dispose(),l.dispose()})}function g1(){return{start:()=>{},resume:()=>{},restart:()=>{},onSettingsChanged:()=>{}}}m1();})();
