(window["webpackJsonpcash-map"]=window["webpackJsonpcash-map"]||[]).push([[0],{77:function(e,t,a){},79:function(e,t,a){"use strict";a.r(t);var n=a(6),c=a(0),r=a.n(c),o=a(3),l=a(20),i=a(18),s=a(9),u=a(4),m=a(40),d=a(41),b=a(26),E=(a(77),function(e){var t=e.data,a=e.isAppended,E=Object(o.c)(),f=new s.a(t),p=Object(c.useState)(!1),g=Object(c.useState)(window.innerWidth<576),w=Object(n.a)(g,2),O=w[0],C=w[1],N=Object(i.b)().isLoading,h=function(e){var t=e.isXs,a=e.asXs,r=e.record,o=t===window.innerWidth<576,u=Object(c.useState)(JSON.stringify(r.getJSON(!1))),m=Object(n.a)(u,1)[0],d=Object(i.b)(),b=d.isLoading,E=d.Loading,f=Object(s.d)().dispatch,p=Object(l.c)().Message,g=Object(c.useCallback)(function(){r.reset(),window.history.back()},[r]);return Object(c.useEffect)(function(){return $(window).on("resize",function(){return a(window.innerWidth<576)}),function(){$(window).off("resize")}},[o,a]),{onEditGroup:Object(c.useCallback)(function(e){return r.group=e},[r]),doStopSubmit:Object(c.useCallback)(function(e){e.preventDefault(),e.stopPropagation()},[]),doCancel:Object(c.useCallback)(function(){return m===JSON.stringify(r.getJSON(!1))?g():p({type:"CONFIRM",content:"MSG_MODIFIED_CHECK",handler:function(e){return l.a.CONFIRM===e?g():null}})},[p,m,r,g]),doCreate:Object(c.useCallback)(function(){return b?null:E({show:!0,callbackFn:function(){return f({action:"CREATE",params:r.getJSON(),fail:function(e){return E({show:!1,callbackFn:function(){return p({type:"DANGER",content:e.message})}})},success:function(){return E({show:!1,callbackFn:function(){window.history.back(),p({type:"INFO",content:"MSG_SAVE_SUCCESS"})}})}})}})},[p,E,b,r,f]),doUpdate:Object(c.useCallback)(function(){return b?null:E({show:!0,callbackFn:function(){return f({action:"UPDATE",params:r.getJSON(),fail:function(e){return E({show:!1,callbackFn:function(){return p({type:"DANGER",content:e.message})}})},success:function(){return E({show:!1,callbackFn:function(){window.history.back(),p({type:"INFO",content:"MSG_SAVE_SUCCESS"})}})}})}})},[p,E,b,r,f])}}({isXs:O,asXs:C,record:f}),S=h.onEditGroup,y=h.doStopSubmit,k=h.doCancel,j=h.doCreate,D=h.doUpdate;return r.a.createElement("div",null,r.a.createElement(b.b,{show:p,group:f.group,onChange:S}),r.a.createElement("form",{onSubmit:y},r.a.createElement("h4",{className:"page-title"},r.a.createElement("i",{className:"mr-2 fa fa-".concat(a?"plus":"pencil")}),r.a.createElement(o.a,{tagName:"strong",id:a?"APPEND_RECORD":"UPDATE_RECORD"})),r.a.createElement(u.b,null,r.a.createElement(u.c,{align:"center"},r.a.createElement(u.a,{className:"form-group",width:{md:8}},r.a.createElement("label",null,E.messages.RECORD_DESC,r.a.createElement(b.a,{show:p,className:"btn btn-link text-warning"})),r.a.createElement("input",{type:"text",className:"form-control",value:f.desc,onChange:function(e){var t=e.target;return f.desc=t.value}}))),r.a.createElement(u.c,{align:"center"},r.a.createElement(u.a,{className:"form-group",width:{def:6,md:4}},r.a.createElement(o.a,{tagName:"label",id:"AMOUNT_CYCLE"}),r.a.createElement(m.a,{value:f.cycle,disableOnce:"deposit"===f.type,onChange:function(e){return f.cycle=e}})),r.a.createElement(u.a,{className:"form-group",width:{def:6,md:4}},r.a.createElement(o.a,{tagName:"label",id:"RECORD_TYPE"}),r.a.createElement(d.a,{value:f.type,disableDeposit:"once"===f.cycle,onChange:function(e){return f.type=e}}))),r.a.createElement(u.c,{align:"center"},r.a.createElement(u.a,{className:"form-group",width:{md:8}},r.a.createElement(o.a,{tagName:"label",id:"AMOUNT"}),r.a.createElement("input",{type:"number",className:"form-control text-right",value:f.amount,onChange:function(e){var t=e.target;return f.amountStr=t.value}}))),r.a.createElement(u.c,{margin:{t:5}},r.a.createElement(u.a,{className:"text-right"},r.a.createElement("button",{type:"button",className:"btn btn-secondary mr-2",onClick:k},r.a.createElement("i",{className:"fa fa-ban mr-2"}),r.a.createElement(o.a,{id:"CANCEL"})),r.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:N,onClick:a?j:D},r.a.createElement("i",{className:"fa fa-".concat(a?"plus":"download"," mr-2")}),r.a.createElement(o.a,{id:a?"ADD":"SAVE"})))))))});t.default=function(e){var t=e.match.params.uid,a=void 0===t?"":t,n=Object(s.d)(),o=n.data,l=n.dispatch;return Object(c.useEffect)(function(){a&&l({action:"FIND",params:{uid:a}})},[a,l]),!o&&a?null:r.a.createElement(E,{isAppended:!a,data:o||{}})}}}]);
//# sourceMappingURL=0.9bdc4c85.chunk.js.map