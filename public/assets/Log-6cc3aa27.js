import{_ as h,j as B,i as o,J as x,k as I,r as P,o as i,c as b,e as f,b as m,t as y,T as C,s as E,F as j}from"./index-55e28da3.js";const A={__name:"Log",setup(D){const _=B("PokaAPI"),t=o(""),L=o(0),g=o(!1),a=o([]);async function p(){let e=await _.getUserList();a.value=e}async function v(e=0){var s;(!a.value||!a.value.length)&&await p();let n=await _.getLog(e);for(let{level:k,type:w,event:$,user:l,description:c,time:u}of n)l=((s=a.value.find(r=>r._id==l))==null?void 0:s.username)||l,u=new Date(u).toLocaleString(),a.value.map(r=>{c=c.replace(new RegExp(`{${r._id}}`,"g"),r.username)}),t.value+=`[${k}] ${w} / ${$}
`,t.value+=`  📄 ${c}
`,t.value+=`  👤 ${l}
`,t.value+=`  🕒 ${u}
`,t.value+=`
`;n.length||(g.value=!0)}const d=o(null);return x(d,async([{isIntersecting:e}],n)=>{e&&await v(L.value++)},{threshold:.5,rootMargin:"0px"}),I(async()=>{await p(),await v()}),(e,n)=>{const s=P("Loader");return i(),b(j,null,[(i(),f(C,{to:"#header-center"},[m("p",null,y(e.$t("settings.log.title")),1)])),m("pre",{class:"log",ref:"logContainer"},y(t.value),513),g.value?E("",!0):(i(),f(s,{key:0,ref_key:"logBottom",ref:d},null,512))],64)}}},M=h(A,[["__scopeId","data-v-640354d8"]]);export{M as default};
