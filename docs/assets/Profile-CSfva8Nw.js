import{d as R,r as c,a as z,g as v,b as d,c as f,f as a,C as S,u as e,e as n,w as m,x as N,A as T,q as h,G as w,F as $,i as E,j as F,k as P,h as j,y as L,z as V,I as G,E as A,_ as q}from"./index-5tqXACbB.js";import{_ as K}from"./Navigation-Return-CUJ0SQdH.js";import{T as _}from"./TagLarger-CoPM2Qv3.js";import{M as O}from"./MessageList-CuQzBYaT.js";const W={class:"container"},H={style:{"text-align":"left","z-index":"10",position:"relative"}},J={style:{color:"white","font-size":"2em","text-align":"left"}},Q={style:{"margin-top":"auto",color:"white",height:"40px","background-color":"rgba(128, 128, 128, 0.4)","border-radius":"10px",padding:"8px"}},X={style:{margin:"0","font-size":"medium"}},Y={style:{"text-align":"center"},class:"context"},Z={style:{display:"flex","flex-direction":"column",gap:"5px"},class:"message-list"},ee={class:"message-list"},te={class:"sendComment"},ae=R({__name:"Profile",setup(oe){let i=c(""),g=c(!1),y=c(1),C="";const x=c("Intro"),u=T();let k=c(""),t=c({User:{ID:"",Nickname:"Loading...",Signature:"",Verification:"loading...",Avatar:322,AvatarRegion:0,Decoration:0,Gold:17900,Diamond:2683,Fragment:116,Level:25,Experience:62225,Prestige:18,Subscription:1,SubscriptionUntil:"",IsBinded:!0,Regions:[1]},Statistic:{Cover:{ID:"",Category:"",Subject:"",Image:1},CommentCount:0,ExperimentCount:0,FollowerCount:0,FollowingCount:0}}),b=c({});z(async()=>{const s=await v("/Contents/GetProfile",{ID:u.params.id});b.value=s.Data.Experiments;const o=await v("/Users/GetUser",{ID:u.params.id});t.value=o.Data;const l=t.value.Statistic.Cover.ID;k.value=`/static/experiments/images/${l.slice(0,4)}/${l.slice(4,6)}/${l.slice(6,8)}/${l.slice(8,24)}/${t.value.Statistic.Cover.Image}.jpg!full`});function I(s){C=s.userID,i.value=`回复@${s.msg_title}: `}const U=async()=>{g.value=!0;const s=await v("/Messages/PostComment",{TargetID:u.params.id,TargetType:"User",Content:i.value||"",ReplyID:C||"",Language:"from web",Special:null});if(s.Status==200)i.value="",y.value=Math.random();else if(s.Status==403&&s.Message.startsWith("Stopword.Blocked")){const o=Number("Stopword.Blocked.Details|0".slice("Stopword.Blocked.Details|0".indexOf("|")+1)),l=i.value.slice(o,10);A.emit("error",`您输入的内容“...${l}...”中包含不适合词句`,1)}g.value=!1},B=()=>{window.history.back()};return(s,o)=>{var D;const l=h("router-link"),M=h("n-input");return d(),f("div",W,[a("div",{class:"cover",style:N({backgroundImage:`url(${e(k)})`,backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center"})},[a("div",H,[a("img",{src:K,style:{width:"2.7em"},onClick:B}),a("div",J,S(e(t).User.Nickname),1),n(_,{tag:((D=e(t).User)==null?void 0:D.Verification)||"user",style:{color:"aquamarine","font-weight":"bold"}},null,8,["tag"]),n(_,{tag:"粉丝 "+e(t).Statistic.FollowerCount},null,8,["tag"]),n(_,{tag:"关注 "+e(t).Statistic.FollowingCount},null,8,["tag"])]),a("div",Q,[n(l,{to:"/experimentSummary/"+e(t).Statistic.Cover.Category+"/"+e(t).Statistic.Cover.ID,style:{color:"white","text-align":"left","text-decoration":"none","z-index":"30",position:"relative"}},{default:m(()=>[o[2]||(o[2]=a("p",{style:{margin:"0","font-size":"smaller"}},"点击进入封面作品",-1)),a("p",X,S(e(t).Statistic.Cover.Subject),1)]),_:1},8,["to"])])],4),a("div",Y,[n(e(G),{value:x.value,"onUpdate:value":o[1]||(o[1]=r=>x.value=r),"justify-content":"space-evenly",type:"line"},{default:m(()=>[n(e(w),{name:"Intro",tab:"作品"},{default:m(()=>[a("div",Z,[(d(!0),f($,null,E(Object.entries(e(b)),([r,p])=>(d(),f("div",{key:r},[p.length>0?(d(),F(P,{key:0,title:r,data:p,"block-type":p[0].Category},null,8,["title","data","block-type"])):j("",!0)]))),128))])]),_:1}),n(e(w),{name:"Comment",tab:`留言板(${e(t).Statistic.CommentCount})`},{default:m(()=>[a("div",ee,[n(O,{ID:e(u).params.id,Category:"User",upDate:e(y),onMsgClick:I},null,8,["ID","upDate"]),a("div",te,[n(M,{value:e(i),"onUpdate:value":o[0]||(o[0]=r=>L(i)?i.value=r:i=r),style:{"text-align":"left"},type:"text",placeholder:"发布一条友善的言论","show-count":"",maxlength:200,onKeyup:V(U,["enter"]),loading:e(g)},null,8,["value","loading"])])])]),_:1},8,["tab"])]),_:1},8,["value"])])])}}}),re=q(ae,[["__scopeId","data-v-9c1752fd"]]);export{re as default};
