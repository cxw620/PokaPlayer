import{B as T,i as b,l as k,r as g,o as d,c as r,e as S,b as e,t as n,T as U,F as m,d as V,q as u,s as $,f as c,w as p,C as _,D as y,E,G as B,H as j}from"./index-e1e3d4ec.js";const P={style:{"margin-bottom":"var(--padding)"}},A={class:"theme-preview-items"},D=["onClick"],N={class:"layer-1"},O={class:"bx bx-check"},q=e("div",{class:"layer-2"}," Aa ",-1),F={class:"layer-1"},z={key:0,class:"bx bx-check"},G={class:"layer-2"},H={class:"setting-item"},L={class:"content"},M={class:"title"},R={class:"control"},W=e("optgroup",{label:"🌑"},null,-1),I=e("option",{value:"0,0,0"},"0 ",-1),J=e("option",{value:"25,25,25"},"25 ",-1),K={value:"51,51,51"},Q=e("option",{value:"200,200,200"},"200",-1),X=e("option",{value:"230,230,230"},"230 ",-1),Y=e("option",{value:"255,255,255"},"255 ",-1),Z=e("optgroup",{label:"☀️"},null,-1),ee={class:"setting-item"},te={class:"content"},oe={class:"title"},se={class:"control"},le={style:{"margin-bottom":"var(--padding)"}},ne={style:{"margin-bottom":"var(--padding)"}},ae={class:"setting-item"},ie={class:"content"},de={class:"title"},re={class:"control"},ce=e("option",{value:"72px"},"72px ",-1),ue=e("option",{value:"96px"},"96px ",-1),pe={value:"128px"},me=e("option",{value:"160px"},"160px ",-1),_e=e("option",{value:"192px"},"192px ",-1),ve={class:"setting-item"},he={class:"content"},ge={class:"title"},ye={class:"control"},fe=e("option",{value:"4px"},"4px ",-1),xe=e("option",{value:"8px"},"8px ",-1),be={value:"12px"},ke=e("option",{value:"16px"},"16px ",-1),Ve=e("option",{value:"24px"},"24px ",-1),$e={class:"setting-item"},we={class:"content"},Ce={class:"title"},Te={class:"control"},Se=e("option",{value:"4px"},"4px ",-1),Ue={value:"8px"},Ee=e("option",{value:"10px"},"10px ",-1),Be=e("option",{value:"12px"},"12px ",-1),je=e("option",{value:"16px"},"16px ",-1),De={__name:"Theme",setup(Pe){const a=T("poka.theme",{theme:"light",cssText:""}),f=b({light:{"--background-layer-1":"#ffffff","--background-layer-2":"#f2f2f2","--text-color-value":"51,51,51"},dark:{"--background-layer-1":"#1e1e1e","--background-layer-2":"#2e2e2e","--text-color-value":"255,255,255"},black:{"--background-layer-1":"#0b0b0b","--background-layer-2":"#000000","--text-color-value":"255,255,255"},ocean:{"--background-layer-1":"#393644","--background-layer-2":"#302e38","--text-color-value":"230,230,255"}}),s=b({"--border-radius":"12px","--padding":"8px","--min-card-width":"128px","--primary-color":"#007bff","--background-layer-1":"#ffffff","--background-layer-2":"#f8f9fa","--text-color-value":"51,51,51"});for(let t in s.value)s.value[t]=document.documentElement.style.getPropertyValue(t)||s.value[t];return k(a,(t,o)=>{let i=f.value[t.theme];if(i)for(let[v,h]of Object.entries(i))s.value[v]=h}),k(s,t=>{for(let o in t)document.documentElement.style.setProperty(o,t[o]);j(()=>{a.value.cssText=document.documentElement.style.cssText;let o=document.querySelector('meta[name="theme-color"]');o&&o.setAttribute("content",getComputedStyle(document.documentElement).getPropertyValue("--background-layer-1"))})},{deep:!0}),(t,o)=>{const i=g("p-select"),v=g("p-card"),h=g("p-cards");return d(),r(m,null,[(d(),S(U,{to:"#header-center"},[e("p",null,n(t.$t("settings.theme.title")),1)])),e("h4",P,n(t.$t("settings.theme.themeAndColor")),1),e("div",A,[(d(!0),r(m,null,V(Object.entries(f.value),([l,w])=>(d(),r("div",{class:"theme-preview-item",onClick:x=>u(a).theme=l,style:E(Object.entries(w).map(([x,C])=>`${x}:${C}`).join(";")),tabindex:"0"},[e("div",N,[_(e("i",O,null,512),[[B,u(a).theme==l]])]),q],12,D))),256)),e("div",{class:"theme-preview-item",onClick:o[0]||(o[0]=l=>u(a).theme="custom"),tabindex:"0"},[e("div",F,[u(a).theme=="custom"?(d(),r("i",z)):$("",!0)]),e("div",G,n(t.$t("settings.theme.custom")),1)])]),u(a).theme=="custom"?(d(),r(m,{key:0},[e("div",H,[e("div",L,[e("div",M,n(t.$t("settings.theme.textColor")),1)]),e("div",R,[c(i,{modelValue:s.value["--text-color-value"],"onUpdate:modelValue":o[1]||(o[1]=l=>s.value["--text-color-value"]=l)},{default:p(()=>[W,I,J,e("option",K,"51 ("+n(t.$t("settings.theme.default"))+") ",1),Q,X,Y,Z]),_:1},8,["modelValue"])])]),e("div",ee,[e("div",te,[e("div",oe,n(t.$t("settings.theme.color")),1)]),e("div",se,[_(e("input",{type:"color","onUpdate:modelValue":o[2]||(o[2]=l=>s.value["--primary-color"]=l)},null,512),[[y,s.value["--primary-color"]]]),_(e("input",{type:"color","onUpdate:modelValue":o[3]||(o[3]=l=>s.value["--background-layer-1"]=l)},null,512),[[y,s.value["--background-layer-1"]]]),_(e("input",{type:"color","onUpdate:modelValue":o[4]||(o[4]=l=>s.value["--background-layer-2"]=l)},null,512),[[y,s.value["--background-layer-2"]]])])])],64)):$("",!0),e("h4",le,n(t.$t("settings.theme.preview")),1),c(h,{style:{margin:"calc(var(--padding) * 2) 0"}},{default:p(()=>[(d(),r(m,null,V(4,l=>c(v,{imgSrc:"/img/pwa-512x512.png",title:t.$t("settings.theme.preview"),source:t.$t("settings.theme.preview")},null,8,["title","source"])),64))]),_:1}),e("h4",ne,n(t.$t("settings.theme.style")),1),e("div",ae,[e("div",ie,[e("div",de,n(t.$t("settings.theme.cardWidth")),1)]),e("div",re,[c(i,{modelValue:s.value["--min-card-width"],"onUpdate:modelValue":o[5]||(o[5]=l=>s.value["--min-card-width"]=l)},{default:p(()=>[ce,ue,e("option",pe,"128px ("+n(t.$t("settings.theme.default"))+") ",1),me,_e]),_:1},8,["modelValue"])])]),e("div",ve,[e("div",he,[e("div",ge,n(t.$t("settings.theme.borderRadius")),1)]),e("div",ye,[c(i,{modelValue:s.value["--border-radius"],"onUpdate:modelValue":o[6]||(o[6]=l=>s.value["--border-radius"]=l)},{default:p(()=>[fe,xe,e("option",be,"12px ("+n(t.$t("settings.theme.default"))+")",1),ke,Ve]),_:1},8,["modelValue"])])]),e("div",$e,[e("div",we,[e("div",Ce,n(t.$t("settings.theme.padding")),1)]),e("div",Te,[c(i,{modelValue:s.value["--padding"],"onUpdate:modelValue":o[7]||(o[7]=l=>s.value["--padding"]=l)},{default:p(()=>[Se,e("option",Ue,"8px ("+n(t.$t("settings.theme.default"))+")",1),Ee,Be,je]),_:1},8,["modelValue"])])])],64)}}};export{De as default};
