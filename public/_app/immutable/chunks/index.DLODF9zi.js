import{E as b,y as w,a3 as m}from"./runtime.CQ81CuDx.js";function q(e,t,r){if(e==null)return t(void 0),r&&r(void 0),b;const n=e.subscribe(t,r);return n.unsubscribe?()=>n.unsubscribe():n}const f=[];function x(e,t){return{subscribe:z(e,t).subscribe}}function z(e,t=b){let r=null;const n=new Set;function i(u){if(m(e,u)&&(e=u,r)){const o=!f.length;for(const s of n)s[1](),f.push(s,e);if(o){for(let s=0;s<f.length;s+=2)f[s][0](f[s+1]);f.length=0}}}function l(u){i(u(e))}function a(u,o=b){const s=[u,o];return n.add(s),n.size===1&&(r=t(i,l)||b),u(e),()=>{n.delete(s),n.size===0&&r&&(r(),r=null)}}return{set:i,update:l,subscribe:a}}function E(e,t,r){const n=!Array.isArray(e),i=n?[e]:e;if(!i.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const l=t.length<2;return x(r,(a,u)=>{let o=!1;const s=[];let d=0,p=b;const g=()=>{if(d)return;p();const c=t(n?s[0]:s,a,u);l?a(c):p=typeof c=="function"?c:b},_=i.map((c,y)=>q(c,h=>{s[y]=h,d&=~(1<<y),o&&g()},()=>{d|=1<<y}));return o=!0,g(),function(){w(_),p(),o=!1}})}export{E as d,x as r,q as s,z as w};
