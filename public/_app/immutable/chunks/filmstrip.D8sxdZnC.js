import{a as u,t as w}from"./disclose-version.Bo9HnLYn.js";import{k as x,w as d,o as _,G as I,n as k,l as y}from"./runtime.CQ81CuDx.js";import{d as D}from"./render.DQGzWiBa.js";import{b as P}from"./this.CgtAJvLj.js";import{s as F,a as G}from"./store.kYhZgm38.js";import{c as m,g as L}from"./canvas.CVWb7qMF.js";import{c as O}from"./store.svelte.DBc1b8wm.js";var R=w('<div class="filmstrip svelte-bxoirv"><canvas class="canvas svelte-bxoirv" width="200" height="3000"></canvas> <button class="download svelte-bxoirv" type="button">Save ▿</button></div>');function z(v,e){x(e,!0);const f=F(),i=()=>G(O,"$colorPalette",f);let t;async function g(s,a){try{const b=await(await fetch(s)).blob(),o=new Image;o.src=URL.createObjectURL(b),o.onload=()=>{const l=a.getContext("2d");if(!l){console.error("Could not create 2d canvas context while loading image.");return}a.width=o.width,a.height=o.height,l.drawImage(o,0,0),m(a,i())}}catch(n){console.error("Error loading or drawing image:",n)}}d(()=>{g(e.src,t)}),d(()=>{m(t,i())});function h(){L(t,e.fileName)}var r=R(),c=_(r);P(c,s=>t=s,()=>t);var p=I(c,2);p.__click=h,k(r),u(v,r),y()}D(["click"]);export{z as default};
