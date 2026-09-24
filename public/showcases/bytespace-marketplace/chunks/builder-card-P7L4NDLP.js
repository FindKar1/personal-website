import{a as le}from"./chunk-ZJYWQTRQ.js";import{a as xe,b as de,c as re,d as ae,e as ne,f as ie}from"./chunk-XI7XFNDF.js";import{b as fe,c as he,j as oe,o as b}from"./chunk-WHHVSCBF.js";import{c as x,d as te,e as G}from"./chunk-O73NWCIL.js";var Fe=x(te(),1);var D=x(he()),ce=x(fe()),X=x(te());var n=x(te()),u=x(xe());var i=x(G());var we={Bezier:"default",Straight:"straight",Step:"step",SmoothStep:"smoothstep"},ye={BlockBasic:re,BlockConditions:ae,BlockTrigger:ne,default:re,ConditionsNode:ae,TriggerNode:ne};var ve=({triggerNode:a,uiScale:w,spacing:P,onContainerSize:z,nodes:j})=>{let{fitView:R,setViewport:m}=(0,u.useReactFlow)(),[d,f]=(0,n.useState)({width:1200,height:600}),W=n.default.useRef(!1);(0,n.useEffect)(()=>{let y=document.querySelector(".react-flow");if(y){let s=y.getBoundingClientRect(),v={width:s.width,height:s.height};f(v),z(v)}let g=setTimeout(()=>R({padding:.15,duration:0}),200),r=()=>{let s=document.querySelector(".react-flow");if(s){let v=s.getBoundingClientRect(),p={width:v.width,height:v.height};f(p),z(p)}};return window.addEventListener("resize",r),()=>{window.removeEventListener("resize",r),clearTimeout(g)}},[z,m]);let E=(0,n.useCallback)(y=>{if(!a)return{x:0,y:0};let c=80,g=d.height*.4,r=c-a.position.x*y,s=g-a.position.y*y;return{x:r,y:s}},[a,d]);return(0,i.jsx)(u.Controls,{showInteractive:!1,onFitView:()=>R({padding:.15,duration:0}),style:{transform:`scale(${w})`,transformOrigin:"bottom left",position:"absolute",bottom:P,left:P,background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(10px)",borderRadius:"12px",border:"1px solid rgba(255, 255, 255, 0.2)",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.1)"}})},ke=({nodes:a,edges:w,defaultViewport:P,onNodesChange:z,onEdgesChange:j,onConnect:R,interactionsEnabled:m,uiScale:d,spacing:f,onContainerSizeChange:W,focusedNodeId:E,showControls:I=!0,showMinimap:y=!0,disableInteraction:c=!1})=>{let{setViewport:g}=(0,u.useReactFlow)();return(0,n.useEffect)(()=>{if(E){let r=a.find(s=>s.id===E);if(r){let s=document.querySelector(".react-flow");if(s){let v=s.getBoundingClientRect(),p=.8,q=400,U=227,M=v.width/2,C=v.height/2,$=M-(r.position.x+q/2)*p,Z=C-(r.position.y+U/2)*p;g({x:$,y:Z,zoom:p},{duration:500})}}}},[E,a,g]),(0,i.jsxs)(u.default,{nodes:a,edges:w,onNodesChange:z,onEdgesChange:j,onConnect:R,nodeTypes:ye,nodesDraggable:!1,nodesConnectable:!1,elementsSelectable:!1,panOnScroll:!1,fitView:!0,fitViewOptions:{padding:.15},minZoom:.05,maxZoom:2,panOnDrag:!c&&m,zoomOnScroll:!1,zoomOnDoubleClick:!c&&m,zoomOnPinch:!c&&m,preventScrolling:!1,connectionRadius:20,connectionLineType:we.Bezier,children:[null,I&&(0,i.jsx)(ve,{triggerNode:a.find(r=>r.data.label==="trigger"),uiScale:d,spacing:f,onContainerSize:W,nodes:a}),y&&(0,i.jsx)(u.MiniMap,{nodeColor:r=>r.data?.hasCritical?"#ef4444":r.data?.hasGraceful?"#eab308":r.data?.disableBlock?"#6b7280":"#3b82f6",nodeStrokeWidth:3,zoomable:!0,pannable:!0,style:{transform:`scale(${d})`,transformOrigin:"bottom right",position:"absolute",bottom:f,right:f,background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(10px)",borderRadius:"12px",border:"1px solid rgba(255, 255, 255, 0.2)",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.1)"}}),(0,i.jsx)(u.Background,{variant:"dots"})]})},Ce=({workflowData:a,nodeErrorStates:w,focusedNodeId:P,showControls:z=!0,showMinimap:j=!0,customZoom:R,customOffsetX:m,customOffsetY:d,disableInteraction:f=!1})=>{let[W,E]=(0,n.useState)({width:1200,height:600}),[I,y]=(0,n.useState)(0),[c,g]=(0,n.useState)(!1),{nodes:r,edges:s,defaultViewport:v}=(0,n.useMemo)(()=>{let t=a.nodes||[],T=a.edges||[],A=t.find(o=>o.label==="trigger"),F=0,V=0;if(A){let S=A.position.x+450+150,Y=t.filter(h=>h.label!=="trigger"&&h.position.x<S);if(Y.length>0){let h=Y.reduce((_,J)=>J.position.x<_.position.x?J:_);F=S-h.position.x}let K=t.filter(h=>h.label!=="trigger").sort((h,_)=>h.position.x-_.position.x);if(K.length>0){let h=K[0],_=227,J=A.position.y+400/2,me=h.position.y+_/2;V=J-me}}let Q=t.map(o=>{let l=o.type||"BlockBasic";o.label==="trigger"&&(l="TriggerNode");let N={...o.position};o.label!=="trigger"&&(F>0&&(N.x=o.position.x+F),V!==0&&(N.y=o.position.y+V),F>0);let k=w?.[o.id],S=k?{...k.hasCritical?{borderColor:"#ef4444",borderWidth:2,borderStyle:"solid",boxShadow:"0 0 20px rgba(239, 68, 68, 0.6)",animation:"pulse-red 2s infinite",borderRadius:"16px"}:k.hasGraceful?{borderColor:"#eab308",borderWidth:2,borderStyle:"solid",boxShadow:"0 0 15px rgba(234, 179, 8, 0.5)",animation:"pulse-yellow 2s infinite",borderRadius:"16px"}:{}}:{};return{id:o.id,type:l,position:N,data:{label:o.label,...o.data,hasGraceful:k?.hasGraceful,hasCritical:k?.hasCritical,...l==="TriggerNode"&&{profileImage:a.agentImageUrl||null}},style:S,draggable:!1,selectable:!1}}),be=T.map(o=>{let l=t.find(S=>S.id===o.source),N=t.find(S=>S.id===o.target),k="default";if(l&&N){let S=Math.abs(N.position.x-l.position.x),Y=Math.abs(N.position.y-l.position.y),K=Y/Math.max(S,1),h=Y>100;(K>.3||h)&&(k="smoothstep")}return{id:o.id,source:o.source,target:o.target,sourceHandle:o.sourceHandle,targetHandle:o.targetHandle,type:k,style:{stroke:"#C106C4",strokeWidth:10,strokeDasharray:"8,6"}}}),L={x:0,y:0,zoom:.5},B=.5,H=W.width,ue=W.height;R!==void 0?B=R:H<480?B=.25:H<768?B=.3:H<1024?B=.4:H<1440?B=.5:B=.55,L.zoom=B;let ee=t.find(o=>o.label==="trigger");if(ee){let o=.04,l=500;H<480?(o=.05,l=50):H<768?(o=.04,l=100):H<1024?(o=.035,l=150):H<1440?(o=.04,l=450):(o=.04,l=500);let N=H*o,k=(ue-l)/2;L.x=N-ee.position.x*B,L.y=k-ee.position.y*B,m!==void 0&&(L.x+=m),d!==void 0&&(L.y+=d)}return{nodes:Q,edges:be,defaultViewport:L}},[a,W,I,R,m,d]),p=(0,n.useCallback)(t=>{E(t),y(T=>T+1)},[]),q=(0,n.useCallback)(()=>{},[]),U=(0,n.useCallback)(()=>{},[]),M=(0,n.useCallback)(()=>{},[]),$=(0,n.useCallback)(()=>{let t=typeof window<"u"?window.innerWidth:1200;return t<400?.2:t<480?.23:t<768?.5:t<1024?.6:t<1440?.7:.8},[])(),O=(0,n.useCallback)(()=>{let t=typeof window<"u"?window.innerWidth:1200;return t<400?"-8px":t<480?"-5px":t<768?"1px":"3px"},[])();return(0,n.useEffect)(()=>{let t=T=>{let A=document.querySelector(".workflow-preview-container");A&&!A.contains(T.target)&&c&&g(!1)};if(c)return document.addEventListener("mousedown",t),()=>{document.removeEventListener("mousedown",t)}},[c]),!a.nodes||a.nodes.length===0?(0,i.jsx)("div",{className:"w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900",children:(0,i.jsxs)("div",{className:"text-center",children:[(0,i.jsx)("div",{className:"text-gray-500 dark:text-gray-400 mb-2",children:"No workflow data available"}),(0,i.jsx)("div",{className:"text-sm text-gray-400 dark:text-gray-500",children:a.name?`Workflow: ${a.name}`:"Please provide workflow data"})]})}):(0,i.jsxs)("div",{className:"w-full h-full relative workflow-preview-container",children:[!f&&!c&&(0,i.jsx)("div",{className:"absolute inset-0 z-20 cursor-pointer",role:"button",tabIndex:0,"aria-label":"Activate workflow preview",onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),g(!0))},onClick:t=>{t.stopPropagation(),g(!0)}}),(0,i.jsx)("style",{dangerouslySetInnerHTML:{__html:`
          .react-flow__attribution {
            display: none !important;
          }
          .react-flow__node {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          .react-flow__node-default {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          .react-flow__controls {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) !important;
            backdrop-filter: blur(15px) !important;
            border-radius: 16px !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            box-shadow: 
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 2px 8px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1) !important;
            padding: 8px !important;
          }
          .react-flow__controls button {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1)) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 10px !important;
            color: rgba(0, 0, 0, 0.8) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            margin: 4px !important;
            box-shadow: 
              0 4px 12px rgba(0, 0, 0, 0.1),
              0 1px 3px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05) !important;
          }
          .react-flow__controls button:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2)) !important;
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 
              0 8px 25px rgba(0, 0, 0, 0.15),
              0 3px 10px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(0, 0, 0, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
          }
          .react-flow__controls button:active {
            transform: translateY(-1px) scale(0.98) !important;
            box-shadow: 
              0 2px 8px rgba(0, 0, 0, 0.2),
              inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }
          .react-flow__minimap {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) !important;
            backdrop-filter: blur(15px) !important;
            border-radius: 16px !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            box-shadow: 
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 2px 8px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1) !important;
            overflow: hidden !important;
          }
          .react-flow__minimap-mask {
            fill: rgba(255, 255, 255, 0.25) !important;
            stroke: rgba(255, 255, 255, 0.5) !important;
            stroke-width: 2px !important;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) !important;
          }
          @keyframes dashflow {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -14;
            }
          }
          .react-flow__edge path {
            animation: dashflow .7s linear infinite !important;
          }
          @keyframes pulse-red {
            0% {
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
            }
            50% {
              box-shadow: 0 0 30px rgba(239, 68, 68, 0.8), 0 0 50px rgba(239, 68, 68, 0.4);
            }
            100% {
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
            }
          }
          @keyframes pulse-yellow {
            0% {
              box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
            }
            50% {
              box-shadow: 0 0 25px rgba(234, 179, 8, 0.7), 0 0 40px rgba(234, 179, 8, 0.3);
            }
            100% {
              box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
            }
          }
        `}}),(0,i.jsxs)(u.ReactFlowProvider,{children:[f&&(0,i.jsx)(de,{}),(0,i.jsx)(ke,{nodes:r,edges:s,defaultViewport:v,onNodesChange:q,onEdgesChange:U,onConnect:M,interactionsEnabled:c,uiScale:$,spacing:O,onContainerSizeChange:p,focusedNodeId:P,showControls:z,showMinimap:j,disableInteraction:f})]})]})},se=Ce;var e=x(G()),ge=({className:a,compact:w=!1,showVideoOnHover:P=!1,grayedOut:z=!1,onMarketplaceHoverChange:j,onBuilderHoverChange:R,hideMarketplace:m=!1,hideBuilder:d=!1,autoplayVideos:f=!1,layout:W="default",mode:E="default",activeCard:I="marketplace",onCardSelect:y,toggleMarketplaceLabel:c="Hire",toggleBuilderLabel:g="Build",fromMarketplace:r=!1})=>{let[s,v]=(0,X.useState)(!1),[p,q]=(0,X.useState)(!1),U=(0,X.useRef)(null),M=(0,X.useRef)(null),C=E==="toggle",$=!C||I==="marketplace",Z=!C||I==="builder",O=!1,{started:t}=le(M,{resetOnLeave:!0}),T=P||f,A=()=>{if(C){y?.("marketplace");return}typeof window<"u"&&(window.location.href="/marketplace")},F=()=>window.parent.postMessage({type:"bytespace-marketplace:film",id:"builder"},location.origin),V=W==="landing",Q=!w&&!m&&!d&&V?{gridTemplateColumns:"minmax(380px, 32%) minmax(0, 1fr)"}:void 0;return(0,e.jsxs)(ce.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.5},className:b("mb-8 grid w-full gap-6",V||r?"max-w-none":"max-w-[1200px]",r&&"p-2",m||d?"grid-cols-1":w?"h-[80px] grid-cols-[32%_calc(68%-1.5rem)]":V?"grid-cols-2":"grid-cols-[32%_calc(68%-1.5rem)]",a),style:Q,children:[null,!d&&(0,e.jsx)("button",{type:"button",onClick:F,"aria-label":"Open Agent Builder animation",title:"Open Agent Builder animation",className:b("group relative overflow-hidden rounded-lg transition-all duration-300",V&&"w-full h-full",w?`border border-white/5 dark:border-white/5 border-gray-200 bg-[#1a1a1c] dark:bg-[#1a1a1c] bg-white border-[3px] hover:border-[1px] hover:border-white/20 dark:hover:border-white/20 hover:border-gray-300 hover:shadow-lg ${r?"":"opacity-[0.5]"} hover:opacity-[1.0]`:"border border-white/10 dark:border-white/10 border-gray-200 bg-[#202022] dark:bg-[#202022] bg-gray-50 hover:scale-[1.02] hover:border-white/20 dark:hover:border-white/20 hover:border-gray-300 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100 hover:shadow-lg dark:shadow-none shadow-md",z&&!w&&"dark:opacity-60 opacity-40 hover:opacity-100 dark:hover:opacity-100 grayscale hover:grayscale-0",C&&"cursor-pointer hover:scale-100 transition-none",C&&(Z?"ring-2 ring-[#BDA1F9] ring-offset-2 ring-offset-transparent":"opacity-60 grayscale hover:opacity-100 hover:grayscale-0")),children:w?(0,e.jsxs)("div",{className:"flex items-center h-full overflow-hidden",children:[(0,e.jsxs)("div",{className:"relative h-[80px] flex-shrink-0",style:{aspectRatio:"16/9"},children:[T&&(0,e.jsx)("video",{ref:M,src:"/showcases/bytespace-marketplace/assets/landing/marketplace/builderVideo.webm",loop:!0,muted:!0,playsInline:!0,autoPlay:t,className:b("absolute inset-0 w-full h-full object-left object-cover transition-all duration-200",t||O&&p?"opacity-100 grayscale-0":"opacity-0")}),(0,e.jsx)(oe,{src:"/showcases/bytespace-marketplace/assets/landing/marketplace/buildYourOwn.png",alt:"Agent Builder",fill:!0,className:b("object-left object-cover transition-all duration-200",!r&&"grayscale group-hover:grayscale-0",t||O&&p?"opacity-0":"opacity-100")}),(0,e.jsx)("div",{className:"absolute right-0 w-[50px] h-full pointer-events-none",style:{maskImage:"linear-gradient(to left, black, transparent)",WebkitMaskImage:"linear-gradient(to left, black, transparent)"},children:(0,e.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-[#1a1a1c] to-[#1a1a1c] dark:from-[#1a1a1c] dark:to-[#1a1a1c] from-white to-white"})})]}),(0,e.jsx)("div",{className:"flex flex-col justify-center px-4 w-[200px] flex-shrink-0",children:C?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("span",{className:b("text-2xl font-semibold transition-all","text-zinc-600 group-hover:text-white"),children:g}),(0,e.jsx)("p",{className:"sr-only",children:"Create custom agents tailored to your needs"})]}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,e.jsx)(D.Sparkles,{className:b("h-4 w-4 transition-all",r?"text-zinc-300 dark:text-zinc-300 text-gray-700 group-hover:text-white dark:group-hover:text-white group-hover:text-gray-800":"text-zinc-600 dark:text-zinc-600 text-gray-700 group-hover:text-white dark:group-hover:text-white group-hover:text-gray-800")}),(0,e.jsx)("span",{className:b("text-sm font-semibold transition-all",r?"text-zinc-300 dark:text-zinc-300 text-gray-700 group-hover:text-white dark:group-hover:text-white group-hover:text-gray-800":"text-zinc-600 dark:text-zinc-600 text-gray-700 group-hover:text-white dark:group-hover:text-white group-hover:text-gray-800"),children:"Agent Builder"}),(0,e.jsx)(D.ExternalLink,{className:b("h-3 w-3 transition-all",r?"text-zinc-400 dark:text-zinc-400 text-gray-600 group-hover:text-white/50 dark:group-hover:text-white/50 group-hover:text-gray-700/50":"text-zinc-700 dark:text-zinc-700 text-gray-600 group-hover:text-white/50 dark:group-hover:text-white/50 group-hover:text-gray-700/50")})]}),(0,e.jsx)("p",{className:b("text-xs transition-all",r?"text-zinc-400 dark:text-zinc-400 text-gray-600 group-hover:text-zinc-300 dark:group-hover:text-zinc-300 group-hover:text-gray-700 text-left":"text-zinc-600 dark:text-zinc-600 text-gray-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-400 group-hover:text-gray-700 text-left"),children:"Create custom agents tailored to your needs"})]})}),(0,e.jsx)("div",{className:b("relative flex-1 h-full bg-[#1a1a1c] dark:bg-[#1a1a1c] bg-gray-50 transition-all duration-200",!r&&"grayscale group-hover:grayscale-0"),children:(0,e.jsx)(se,{workflowData:ie,showControls:!1,showMinimap:!1,customZoom:.15,customOffsetX:-30,customOffsetY:-62,disableInteraction:!0})})]}):(0,e.jsxs)("div",{className:"flex h-full",children:[(0,e.jsxs)("div",{className:"relative flex-shrink-0",style:{width:"40%",aspectRatio:"16/9"},children:[T&&(0,e.jsx)("video",{ref:M,src:"/showcases/bytespace-marketplace/assets/landing/marketplace/builderVideo.webm",loop:!0,muted:!0,playsInline:!0,autoPlay:t,className:b("absolute inset-0 w-full h-full object-left object-cover transition-opacity duration-300",t||O&&p?"opacity-100":"opacity-0")}),(0,e.jsx)(oe,{src:"/showcases/bytespace-marketplace/assets/landing/marketplace/buildYourOwn.png",alt:"Agent Builder",fill:!0,className:b("object-left object-cover transition-opacity duration-300",t||O&&p?"opacity-0":"opacity-100")}),(0,e.jsx)("div",{className:"absolute right-0  dark:md:w-[50px]  dark:sm:w-[50px]  dark:w-[50px] md:w-[230px] sm:w-[100px] w-[50px] h-full pointer-events-none",style:{maskImage:"linear-gradient(to left, black, transparent)",WebkitMaskImage:"linear-gradient(to left, black, transparent)"},children:(0,e.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-[#202022] to-[#1a1a1c] dark:from-[#202022] dark:to-[#1a1a1c] from-gray-100 to-gray-50"})})]}),(0,e.jsxs)("div",{className:"flex flex-1 flex-col",children:[(0,e.jsxs)("div",{className:"relative flex-1 bg-[#1a1a1c] dark:bg-[#1a1a1c] bg-gray-50",inert:!0,"aria-hidden":"true",children:[(0,e.jsx)(se,{workflowData:ie,showControls:!1,showMinimap:!1,customZoom:.3,customOffsetX:0,customOffsetY:-27,disableInteraction:!0}),(0,e.jsx)("div",{className:"absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none",style:{maskImage:"linear-gradient(to top, black, transparent)",WebkitMaskImage:"linear-gradient(to top, black, transparent)"},children:(0,e.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-[#202022] to-[#1a1a1c] dark:from-[#202022] dark:to-[#1a1a1c] from-gray-100 to-gray-50"})})]}),(0,e.jsx)("div",{className:"relative bg-[#202022] dark:bg-[#202022] bg-gray-100 px-4 pb-4 pt-3",children:C?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("span",{className:"text-3xl font-semibold text-white dark:text-white text-gray-800",children:g}),(0,e.jsx)("p",{className:"sr-only",children:"Create custom agents tailored to your workflow needs"})]}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,e.jsx)(D.Sparkles,{className:"h-4 w-4 dark:text-white text-gray-800 transition-transform group-hover:scale-110"}),(0,e.jsx)("span",{className:"text-sm font-semibold dark:text-white text-gray-800",children:"Agent Builder"}),(0,e.jsx)(D.ExternalLink,{className:"h-3 w-3 dark:text-white/50 text-gray-600/50 transition-opacity group-hover:opacity-100"})]}),(0,e.jsx)("p",{className:"text-xs dark:text-white/60 text-gray-600 w-full text-left",children:"Create custom agents tailored to your workflow needs"})]})})]})]})})]})};var pe=x(G(),1);function Ne(){return(0,pe.jsx)(ge,{hideMarketplace:!0,fromMarketplace:!0,layout:"landing",showVideoOnHover:!0})}export{Ne as default};
