import{h as c}from"./chunk-LNJ3S2LQ.js";var te=t=>{let e=new Map;e.set("web",{name:"web"});let r=t.CapacitorPlatforms||{currentPlatform:{name:"web"},platforms:e},i=(s,a)=>{r.platforms.set(s,a)},n=s=>{r.platforms.has(s)&&(r.currentPlatform=r.platforms.get(s))};return r.addPlatform=i,r.setPlatform=n,r},re=t=>t.CapacitorPlatforms=te(t),B=re(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),de=B.addPlatform,ue=B.setPlatform;var O=function(t){return t.Unimplemented="UNIMPLEMENTED",t.Unavailable="UNAVAILABLE",t}(O||{}),_=class extends Error{constructor(e,r,i){super(e),this.message=e,this.code=r,this.data=i}},ne=t=>{var e,r;return t!=null&&t.androidBridge?"android":!((r=(e=t==null?void 0:t.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||r===void 0)&&r.bridge?"ios":"web"},se=t=>{var e,r,i,n,s;let a=t.CapacitorCustomPlatform||null,o=t.Capacitor||{},g=o.Plugins=o.Plugins||{},l=t.CapacitorPlatforms,A=()=>a!==null?a.name:ne(t),y=((e=l==null?void 0:l.currentPlatform)===null||e===void 0?void 0:e.getPlatform)||A,U=()=>y()!=="web",q=((r=l==null?void 0:l.currentPlatform)===null||r===void 0?void 0:r.isNativePlatform)||U,X=d=>{let u=T.get(d);return!!(u!=null&&u.platforms.has(y())||I(d))},G=((i=l==null?void 0:l.currentPlatform)===null||i===void 0?void 0:i.isPluginAvailable)||X,K=d=>{var u;return(u=o.PluginHeaders)===null||u===void 0?void 0:u.find(C=>C.name===d)},I=((n=l==null?void 0:l.currentPlatform)===null||n===void 0?void 0:n.getPluginHeader)||K,V=d=>t.console.error(d),z=(d,u,C)=>Promise.reject(`${C} does not have an implementation of "${u}".`),T=new Map,J=(d,u={})=>{let C=T.get(d);if(C)return console.warn(`Capacitor plugin "${d}" already registered. Cannot register plugins twice.`),C.proxy;let p=y(),E=I(d),w,Z=()=>c(void 0,null,function*(){return!w&&p in u?w=typeof u[p]=="function"?w=yield u[p]():w=u[p]:a!==null&&!w&&"web"in u&&(w=typeof u.web=="function"?w=yield u.web():w=u.web),w}),Y=(f,m)=>{var h,v;if(E){let b=E==null?void 0:E.methods.find(P=>m===P.name);if(b)return b.rtype==="promise"?P=>o.nativePromise(d,m.toString(),P):(P,L)=>o.nativeCallback(d,m.toString(),P,L);if(f)return(h=f[m])===null||h===void 0?void 0:h.bind(f)}else{if(f)return(v=f[m])===null||v===void 0?void 0:v.bind(f);throw new _(`"${d}" plugin is not implemented on ${p}`,O.Unimplemented)}},S=f=>{let m,h=(...v)=>{let b=Z().then(P=>{let L=Y(P,f);if(L){let D=L(...v);return m=D==null?void 0:D.remove,D}else throw new _(`"${d}.${f}()" is not implemented on ${p}`,O.Unimplemented)});return f==="addListener"&&(b.remove=()=>c(void 0,null,function*(){return m()})),b};return h.toString=()=>`${f.toString()}() { [capacitor code] }`,Object.defineProperty(h,"name",{value:f,writable:!1,configurable:!1}),h},M=S("addListener"),F=S("removeListener"),ee=(f,m)=>{let h=M({eventName:f},m),v=()=>c(void 0,null,function*(){let P=yield h;F({eventName:f,callbackId:P},m)}),b=new Promise(P=>h.then(()=>P({remove:v})));return b.remove=()=>c(void 0,null,function*(){console.warn("Using addListener() without 'await' is deprecated."),yield v()}),b},j=new Proxy({},{get(f,m){switch(m){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return E?ee:M;case"removeListener":return F;default:return S(m)}}});return g[d]=j,T.set(d,{name:d,proxy:j,platforms:new Set([...Object.keys(u),...E?[p]:[]])}),j},Q=((s=l==null?void 0:l.currentPlatform)===null||s===void 0?void 0:s.registerPlugin)||J;return o.convertFileSrc||(o.convertFileSrc=d=>d),o.getPlatform=y,o.handleError=V,o.isNativePlatform=q,o.isPluginAvailable=G,o.pluginMethodNoop=z,o.registerPlugin=Q,o.Exception=_,o.DEBUG=!!o.DEBUG,o.isLoggingEnabled=!!o.isLoggingEnabled,o.platform=o.getPlatform(),o.isNative=o.isNativePlatform(),o},oe=t=>t.Capacitor=se(t),k=oe(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),N=k.registerPlugin,fe=k.Plugins;var $=class{constructor(e){this.listeners={},this.windowListeners={},e&&(console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`),this.config=e)}addListener(e,r){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(r);let n=this.windowListeners[e];n&&!n.registered&&this.addWindowListener(n);let s=()=>c(this,null,function*(){return this.removeListener(e,r)}),a=Promise.resolve({remove:s});return Object.defineProperty(a,"remove",{value:()=>c(this,null,function*(){console.warn("Using addListener() without 'await' is deprecated."),yield s()})}),a}removeAllListeners(){return c(this,null,function*(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}})}notifyListeners(e,r){let i=this.listeners[e];i&&i.forEach(n=>n(r))}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,r){this.windowListeners[r]={registered:!1,windowEventName:e,pluginEventName:r,handler:i=>{this.notifyListeners(r,i)}}}unimplemented(e="not implemented"){return new k.Exception(e,O.Unimplemented)}unavailable(e="not available"){return new k.Exception(e,O.Unavailable)}removeListener(e,r){return c(this,null,function*(){let i=this.listeners[e];if(!i)return;let n=i.indexOf(r);this.listeners[e].splice(n,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])})}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}};var H=t=>encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),W=t=>t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),x=class extends ${getCookies(){return c(this,null,function*(){let e=document.cookie,r={};return e.split(";").forEach(i=>{if(i.length<=0)return;let[n,s]=i.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");n=W(n).trim(),s=W(s).trim(),r[n]=s}),r})}setCookie(e){return c(this,null,function*(){try{let r=H(e.key),i=H(e.value),n=`; expires=${(e.expires||"").replace("expires=","")}`,s=(e.path||"/").replace("path=",""),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${r}=${i||""}${n}; path=${s}; ${a};`}catch(r){return Promise.reject(r)}})}deleteCookie(e){return c(this,null,function*(){try{document.cookie=`${e.key}=; Max-Age=0`}catch(r){return Promise.reject(r)}})}clearCookies(){return c(this,null,function*(){try{let e=document.cookie.split(";")||[];for(let r of e)document.cookie=r.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}})}clearAllCookies(){return c(this,null,function*(){try{yield this.clearCookies()}catch(e){return Promise.reject(e)}})}},ge=N("CapacitorCookies",{web:()=>new x}),ie=t=>c(void 0,null,function*(){return new Promise((e,r)=>{let i=new FileReader;i.onload=()=>{let n=i.result;e(n.indexOf(",")>=0?n.split(",")[1]:n)},i.onerror=n=>r(n),i.readAsDataURL(t)})}),ae=(t={})=>{let e=Object.keys(t);return Object.keys(t).map(n=>n.toLocaleLowerCase()).reduce((n,s,a)=>(n[s]=t[e[a]],n),{})},le=(t,e=!0)=>t?Object.entries(t).reduce((i,n)=>{let[s,a]=n,o,g;return Array.isArray(a)?(g="",a.forEach(l=>{o=e?encodeURIComponent(l):l,g+=`${s}=${o}&`}),g.slice(0,-1)):(o=e?encodeURIComponent(a):a,g=`${s}=${o}`),`${i}&${g}`},"").substr(1):null,ce=(t,e={})=>{let r=Object.assign({method:t.method||"GET",headers:t.headers},e),n=ae(t.headers)["content-type"]||"";if(typeof t.data=="string")r.body=t.data;else if(n.includes("application/x-www-form-urlencoded")){let s=new URLSearchParams;for(let[a,o]of Object.entries(t.data||{}))s.set(a,o);r.body=s.toString()}else if(n.includes("multipart/form-data")||t.data instanceof FormData){let s=new FormData;if(t.data instanceof FormData)t.data.forEach((o,g)=>{s.append(g,o)});else for(let o of Object.keys(t.data))s.append(o,t.data[o]);r.body=s;let a=new Headers(r.headers);a.delete("content-type"),r.headers=a}else(n.includes("application/json")||typeof t.data=="object")&&(r.body=JSON.stringify(t.data));return r},R=class extends ${request(e){return c(this,null,function*(){let r=ce(e,e.webFetchExtra),i=le(e.params,e.shouldEncodeUrlParams),n=i?`${e.url}?${i}`:e.url,s=yield fetch(n,r),a=s.headers.get("content-type")||"",{responseType:o="text"}=s.ok?e:{};a.includes("application/json")&&(o="json");let g,l;switch(o){case"arraybuffer":case"blob":l=yield s.blob(),g=yield ie(l);break;case"json":g=yield s.json();break;case"document":case"text":default:g=yield s.text()}let A={};return s.headers.forEach((y,U)=>{A[U]=y}),{data:g,headers:A,status:s.status,url:s.url}})}get(e){return c(this,null,function*(){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))})}post(e){return c(this,null,function*(){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))})}put(e){return c(this,null,function*(){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))})}patch(e){return c(this,null,function*(){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))})}delete(e){return c(this,null,function*(){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))})}},me=N("CapacitorHttp",{web:()=>new R});var we={FRONT:"front",BACK:"back"};export{N as a,$ as b,we as c};
