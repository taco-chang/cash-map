(window["webpackJsonpcash-map"]=window["webpackJsonpcash-map"]||[]).push([[3],{1:function(e,t,n){"use strict";var a,c=n(4),r=n(0);function o(e,t){var n=e instanceof Object?e:{def:e};Object.keys(n).forEach(function(e){return!1===n[e]?null:t("def"===e?"":e,n[e])})}function i(e,t){var n=[];return Object.keys(t).forEach(function(a){var c="def"===a?"":a,r=t[a];!1!==r&&("number"===typeof r?n.push(u(c,{start:e,end:r})):Object.keys(r).forEach(function(t){var a=r[t]||"";a&&n.push(u(c,{start:"".concat(e).concat(t),end:a}))}))}),n}function u(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.start,a=void 0===n?"":n,c=t.end;return[a,e,void 0===c?"":c].filter(function(e){return!!e}).join("-")}function s(e){return e.filter(function(e,t,n){return!!e&&n.indexOf(e)===t}).join(" ")}function l(e){var t=e.width,n=void 0===t?"auto":t,r=e.offset,i=void 0!==r&&r,s=e.order;return[n,i,void 0!==s&&s].reduce(function(e,t,n){switch(n){case a.WIDTH:o(t,function(t,n){return e.push(u(t,{start:"col",end:"auto"===n?"":n}))});break;case a.OFFSET:o(t,function(t,n){return e.push(u(t,{start:"offset",end:n}))});break;case a.ORDER:o(t,function(t,n){return e.push(u(t,{start:"order",end:n}))})}return Object(c.a)(e)},[])}function m(e,t){var n=t.className,a=void 0===n?"":n,r=t.margin,o=void 0!==r&&r,s=t.padding,l=void 0!==s&&s,m=t.border,d=void 0!==m&&m,f=t.rounded,b=void 0!==f&&f,p=t.colors,h=void 0!==p&&p,v=t.hidden,O=void 0!==v&&v,E=Object.keys(o).filter(function(e){return["def","sm","md","lg","xl"].indexOf(e)>=0}).length>0,g=Object.keys(l).filter(function(e){return["def","sm","md","lg","xl"].indexOf(e)>=0}).length>0;return[a].concat(Object(c.a)(i("m",E?o:{def:o})),Object(c.a)(i("p",g?l:{def:l})),Object(c.a)(function(e){var t=[];return!1!==e&&(!0===e?t.push("border"):Object.keys(e).forEach(function(e){switch(e){case"t":t.push("border-top");break;case"b":t.push("border-bottom");break;case"l":t.push("border-left");break;case"r":t.push("border-right")}})),t}(d)),Object(c.a)(function(e){var t=[];return!1!==e&&(!0===e?t.push("rounded"):Object.keys(e).forEach(function(n){var a=e[n];a&&t.push("rounded-".concat(a))})),t}(b)),Object(c.a)(function(e){var t=[];return!1!==e&&Object.keys(e).forEach(function(n){var a=e[n];a&&t.push("border"===n?"border-".concat(a):"".concat(n,"-").concat(a))}),t}(h)),Object(c.a)(function(e,t){var n=["d-".concat(e)];if(!1!==t){var a=Array.isArray(t)?t:[t];["def","sm","md","lg","xl"].filter(function(e){return a.indexOf(e)>=0}).forEach(function(t){var a="def"===t?"":t;n.splice(n.indexOf(u(a,{start:"d",end:e})),1),n.push(u(a,{start:"d",end:"none"}))})}return n}(e,O)))}!function(e){e[e.WIDTH=0]="WIDTH",e[e.OFFSET=1]="OFFSET",e[e.ORDER=2]="ORDER"}(a||(a={})),n.d(t,"b",function(){return d}),n.d(t,"c",function(){return f}),n.d(t,"a",function(){return b});var d=function(e){var t=e.tagName,n=void 0===t?"div":t,a=e.children;return Object(r.createElement)(n,{className:s(["container"].concat(Object(c.a)(m("block",e))))},a)},f=function(e){var t=e.tagName,n=void 0===t?"div":t,a=e.children,o=e.gutters,i=void 0===o||o,l=e.alignable,d=void 0===l?"":l,f=e.align,b=void 0!==f&&f;return Object(r.createElement)(n,{className:s(["row",i?"":"no-gutters",!1===b?"":"justify-content-".concat(u(d,{end:b}))].concat(Object(c.a)(m("flex",e))))},a)},b=function(e){var t=e.tagName,n=void 0===t?"div":t,a=e.children;return Object(r.createElement)(n,{className:s(["col"].concat(Object(c.a)(l(e)),Object(c.a)(m("block",e))))},a)}},17:function(e,t,n){"use strict";var a=n(6),c=n(2),r=n(10),o=n(11),i=n(0),u=n.n(i),s=n(13),l=n.n(s),m=n(15),d=n.n(m),f=n(4);function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(n,!0).forEach(function(t){Object(c.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=function(){return JSON.parse(localStorage.getItem("CM_RECORDS")||"[]")},v=function(e){return localStorage.setItem("CM_RECORDS",JSON.stringify(e))},O=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.status,n=e.type;return new Promise(function(e){return e({status:200,content:h().filter(function(e){return(!t||e.status===t)&&(!n||e.type===n)})})})};function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?E(n,!0).forEach(function(t){Object(c.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}n.d(t,"a",function(){return C}),n.d(t,"c",function(){return k});var y="YYYY/MM",j=Symbol("DISPATCH"),N=Symbol("STATE"),w={allData:{},target:{list:[]},sumcycle:"month",summary:{income:0,expenses:0,deposit:0,applicable:0}},C=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.uid,a=void 0===n?d()():n,c=t.desc,o=void 0===c?"":c,u=t.type,s=void 0===u?"income":u,m=t.status,f=void 0===m?"actual":m,b=t.cycle,p=void 0===b?"month":b,h=t.validFm,v=void 0===h?l()(new Date).format(y):h,O=t.validTo,E=void 0===O?"":O,g=t.amount,j=void 0===g?0:g,N=t.mapTurnOn,w=void 0===N||N;Object(r.a)(this,e),this.$uid=void 0,this.$desc=void 0,this.$type=void 0,this.$status=void 0,this.$cycle=void 0,this.$validFm=void 0,this.$validTo=void 0,this.$amount=void 0,this.$mapTurnOn=void 0,this.$uid=a,this.$desc=Object(i.useState)(o),this.$type=Object(i.useState)(s),this.$status=Object(i.useState)(f),this.$cycle=Object(i.useState)(p),this.$validFm=Object(i.useState)(v),this.$validTo=Object(i.useState)(E),this.$amount=Object(i.useState)(j),this.$mapTurnOn=Object(i.useState)(w)}return Object(o.a)(e,[{key:"getJSON",value:function(){return{uid:this.uid,desc:this.desc,type:this.type,status:this.status,cycle:this.cycle,validFm:this.validFm,amount:this.amount,validTo:this.validTo,mapTurnOn:this.mapTurnOn}}},{key:"reset",value:function(){this.$uid=d()(),this.type="income",this.status="actual",this.cycle="month",this.validFm=l()(new Date).format(y),this.amount=0,this.validTo="",this.mapTurnOn=!0,this.desc=""}},{key:"uid",get:function(){return this.$uid}},{key:"desc",get:function(){return this.$desc[0]},set:function(e){this.$desc[1](e)}},{key:"type",get:function(){return this.$type[0]},set:function(e){this.$type[1](e)}},{key:"status",get:function(){return this.$status[0]},set:function(e){this.$status[1](e)}},{key:"cycle",get:function(){return this.$cycle[0]},set:function(e){this.$cycle[1](e)}},{key:"validFm",get:function(){return this.$validFm[0]},set:function(e){this.$validFm[1](e)}},{key:"validTo",get:function(){return this.$validTo[0]},set:function(e){this.$validTo[1](e)}},{key:"amount",get:function(){return this.$amount[0]},set:function(e){this.$amount[1](e)}},{key:"mapTurnOn",get:function(){return this.$mapTurnOn[0]},set:function(e){this.$mapTurnOn[1](e)}},{key:"vdateFm",get:function(){return this.validFm?l()(this.validFm+"/01","YYYY/MM/DD").toDate():null},set:function(e){this.validFm=e?l()(e).format(y):""}},{key:"vdateTo",get:function(){return this.validTo?l()(this.validTo+"/01","YYYY/MM/DD").toDate():null},set:function(e){this.validTo=e?l()(e).format(y):""}},{key:"amountStr",get:function(){return this.amount?this.amount.toString():""},set:function(e){var t=parseFloat(e);this.amount=isNaN(t)?0:t}}]),e}(),k=function(){return Object(i.useContext)(P)},S=function(e,t){var n=t.cycle,a=void 0===n?"month":n,c=t.amount,r=void 0===c?0:c,o=l()(new Date).daysInMonth(),i=l()("".concat((new Date).getFullYear(),"/12/31"),"YYYY/MM/DD").dayOfYear();switch(e){case"day":switch(a){case"month":return Math.floor(r/o);case"year":return Math.floor(r/i)}break;case"month":switch(a){case"day":return r*o;case"year":return Math.floor(r/12)}break;case"year":switch(a){case"day":return r*i;case"month":return 12*r}}return r},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:w,t=arguments.length>1?arguments[1]:void 0,n=t.override,a=void 0!==n&&n,r=t[N],o=r.sumcycle,i=void 0===o?e.sumcycle:o,u=r.allData,s=void 0===u?e.allData:u,l=r.target,m=(l=void 0===l?e.target:l).list,d=void 0===m?e.target.list:m,f=l.data,b=a?d.reduce(function(e,t){return g({},e,Object(c.a)({},t.uid||"",t))},s):s;return g({},e,{sumcycle:i,allData:b,target:{data:f,list:d.filter(function(e){var t=e.uid;return(void 0===t?"":t)in b}).map(function(e){return b[e.uid||""]?b[e.uid||""]:e})},summary:Object.keys(b).map(function(e){return b[e]}).filter(function(e){return"actual"===e.status||!0===e.mapTurnOn}).reduce(function(e,t){var n=S(i,t);if("once"===t.cycle)e.deposit+=n*("expenses"===t.type?-1:1);else switch(t.type){case"income":e.income+=n;break;case"expenses":e.expenses+=n;break;case"deposit":e.deposit+=n,e.income-=n}return g({},e,{applicable:e.income-e.expenses})},{income:0,expenses:0,deposit:0,applicable:0})})},x=function(e,t){var n,a,r=t.action,o=t.params,i=void 0===o?{}:o,u=t.success,s=void 0===u?function(){}:u,l=t.fail,m=void 0===l?function(){}:l,d=function(){return O().then(function(t){var n=t.content;return e(Object(c.a)({},N,{target:{},allData:n.reduce(function(e,t){return g({},e,Object(c.a)({},t.uid||"",t))},{})}))})};switch(r){case"CREATE":(a=i,new Promise(function(e,t){a.uid||t(new Error("Must have to specify a uid when create."));var n=h();v([].concat(Object(f.a)(n),[p({},a)])),e({status:200,content:!0})})).then(d).then(function(){return s(i)}).catch(function(e){return m(e,i)});break;case"UPDATE":(function(e,t){return new Promise(function(n,a){t||a(new Error("If wanna update the specify record, must input index."));var c=h();c.splice(c.findIndex(function(e){return e.uid===t}),1,e),v(c),n({status:200,content:!0})})})(i,i.uid).then(d).then(function(){return s(i)}).catch(function(e){return m(e,i)});break;case"REMOVE":(n=i.uid,new Promise(function(e,t){n||t(new Error("If wanna remove the specify record, must input index."));var a=h();a.splice(a.findIndex(function(e){return e.uid===n}),1),v(a),e({status:200,content:!0})})).then(d).then(function(){return s(i)}).catch(function(e){return m(e,i)});break;case"CLEAR":new Promise(function(e){v([]),e({status:200,content:!0})}).then(function(){return O().then(function(){return e(Object(c.a)({},N,{allData:{},target:{list:[]}}))}).then(function(){return s(i)}).catch(function(e){return m(e)})}).catch(function(e){return m(e)});break;case"SUMMARY":if(!i.cycle||["day","month","year"].indexOf(i.cycle)<0)throw new Error("If wanna re-calculate the summary, must specify cycle.");e(Object(c.a)({},N,{sumcycle:i.cycle}));break;case"FIND":(function(e){return new Promise(function(t,n){e||n(new Error("If wanna get the specify record, must input index.")),t({status:200,content:h().filter(function(t){return t.uid===e})[0]})})})(i.uid).then(function(t){var n=t.content;return e(Object(c.a)({},N,{target:{data:n}}))}).then(function(){return s(i)}).catch(function(e){return m(e)});break;case"LIST":O({status:i.status,type:i.type}).then(function(t){var n=t.content;return e(Object(c.a)({override:!0},N,{target:{list:n}}))}).then(function(){return s(i)}).catch(function(e){return m(e)});break;case"ALL":O().then(function(t){var n=t.content;return e(Object(c.a)({},N,{allData:n.reduce(function(e,t){return g({},e,Object(c.a)({},t.uid||"",t))},{})}))}).then(function(){return s(i)}).catch(function(e){return m(e)})}return e},P=Object(i.createContext)(Object(c.a)({store:w,dispatch:function(){}},j,function(){}));t.b=function(e){var t=e.children,n=Object(i.useReducer)(T,w),r=Object(a.a)(n,2),o=r[0],s=r[1],l=Object(i.useReducer)(x,s);return u.a.createElement(P.Provider,{value:Object(c.a)({store:o,dispatch:l[1]},j,s)},t)}},18:function(e,t,n){"use strict";n.d(t,"b",function(){return o});var a=n(6),c=n(0),r=n.n(c),o=function(){return Object(c.useContext)(i)},i=Object(c.createContext)({isLoading:!1,Loading:function(){}});t.a=function(e){var t=e.children,n=Object(c.useState)({show:!1}),o=Object(a.a)(n,2),u=o[0],s=u.show,l=u.callbackFn,m=o[1];return Object(c.useEffect)(function(){l instanceof Function&&l()},[l]),r.a.createElement(i.Provider,{value:{isLoading:s,Loading:m}},s?r.a.createElement("div",{className:"loading-mask"}):null,t)}},21:function(e,t,n){"use strict";n.d(t,"a",function(){return d}),n.d(t,"c",function(){return b});var a=n(6),c=n(2),r=n(0),o=n.n(r),i=n(3),u=n(15),s=n.n(u);function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(n,!0).forEach(function(t){Object(c.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var d,f=Symbol("DISPATCH");!function(e){e[e.CONFIRM=0]="CONFIRM",e[e.CANCEL=1]="CANCEL"}(d||(d={}));var b=function(){return Object(r.useContext)(v)},p=function(e,t){switch(typeof t){case"object":return{options:m({},t,{btns:"CONFIRM"!==t.type?[{text:"CHECK_IT",code:d.CONFIRM,icon:"fa fa-check"}]:[{text:"CANCEL",code:d.CANCEL,icon:"fa fa-ban"},{text:"CONFIRM",code:d.CONFIRM,icon:"fa fa-check"}]})};case"number":return e.options&&(clearTimeout(e.options.timeout),e.options.handler instanceof Function&&e.options.handler(t)),{}}return e},h=function(e,t){switch(typeof t){case"number":e(t);break;case"object":var n=t.type,a=t.timeout,c=void 0===a?null:a;e(m({},t,{uid:s()(),timeout:"CONFIRM"===n?void 0:window.setTimeout(function(){return e(d.CANCEL)},c||2e3)}))}return e},v=Object(r.createContext)(Object(c.a)({Message:function(){}},f,function(){}));t.b=function(e){var t=e.children,n=Object(r.useReducer)(p,{}),u=Object(a.a)(n,2),s=u[0].options,l=u[1],m=Object(r.useReducer)(h,l),b=function(e){return Object(r.useEffect)(function(){e?$("#".concat(e.uid)).modal("show"):$("div.modal-backdrop").remove()},[e]),{onClickMask:Object(r.useCallback)(function(e){$(e.target).parents("div.alert").length>0&&(e.preventDefault(),e.stopPropagation())},[])}}(s).onClickMask;return o.a.createElement(v.Provider,{value:Object(c.a)({options:s,Message:m[1]},f,l)},t,s?o.a.createElement("div",{className:"modal message-modal",id:s.uid,onClick:b},o.a.createElement("div",{className:"modal-dialog"},o.a.createElement("div",{className:"modal-content"},o.a.createElement("div",{className:"alert alert-".concat("CONFIRM"===s.type?"primary":s.type.toLowerCase())},o.a.createElement("div",{className:"media"},s.icon?o.a.createElement("i",{className:"mr-3 ".concat(s.icon)}):null,o.a.createElement("div",{className:"media-body"},s.title?o.a.createElement("h5",{className:"mt-0"},o.a.createElement(i.a,{tagName:"strong",id:s.title})):null,o.a.createElement(i.a,{tagName:"p",id:s.content}),o.a.createElement("div",{className:"d-flex justify-content-end"},s.btns.map(function(e){return o.a.createElement("button",{key:"btn-".concat(e.code),type:"button",className:"ml-1 btn btn-".concat(d.CANCEL===e.code?"secondary":"CONFIRM"===s.type?"primary":s.type.toLowerCase()),onClick:function(){return m[1](e.code)}},e.icon?o.a.createElement("i",{className:"mr-2 ".concat(e.icon)}):null,o.a.createElement(i.a,{id:e.text}))})))))))):null)}},22:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var a=n(0),c=n.n(a),r=function(e){var t=e.label,n=void 0===t?"":t,a=e.labelWidth,r=void 0===a?"auto":a,o=e.className,i=void 0===o?"":o,u=e.children;return c.a.createElement("div",{className:["input-group",i].join(" ")},n?c.a.createElement("div",{className:"input-group-prepend"},c.a.createElement("div",{className:"input-group-text justify-content-end",style:{width:r}},n)):null,u)}},34:function(e,t,n){"use strict";var a=n(0),c=n.n(a),r=n(3);t.a=function(e){var t=e.value,n=e.onChange,a=e.className,o=void 0===a?"":a,i=e.disableOnce,u=void 0!==i&&i,s=Object(r.c)();return c.a.createElement("select",{className:"form-control ".concat(o),value:t,onChange:function(e){var t=e.target;return n(t.value)}},u?null:c.a.createElement("option",{value:"once"},s.messages.CYCLE_ONCE),c.a.createElement("option",{value:"day"},s.messages.CYCLE_DAY),c.a.createElement("option",{value:"month"},s.messages.CYCLE_MONTH),c.a.createElement("option",{value:"year"},s.messages.CYCLE_YEAR))}},35:function(e,t,n){"use strict";var a=n(2),c=n(6),r=n(0),o=n.n(r),i=n(3),u=n(16),s=n(12),l=n.n(s),m=n(17),d=n(18),f=n(21),b=n(1);function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(n,!0).forEach(function(t){Object(a.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}t.a=function(e){var t=e.record,n=e.isMap,a=void 0!==n&&n,s=Object(i.c)(),p=function(e){var t=e.record,n=Object(r.useState)(!1),a=Object(c.a)(n,2),o=a[0],i=a[1],u=Object(r.useState)(0),s=Object(c.a)(u,2),l=s[0],b=s[1],p=Object(d.b)().Loading,v=Object(m.c)().dispatch,O=Object(f.c)().Message,E=Object(r.useCallback)(function(e){!t.mapTurnOn&&e<l?v({action:"UPDATE",params:h({},t,{mapTurnOn:!0})}):t.mapTurnOn&&e>l&&v({action:"UPDATE",params:h({},t,{mapTurnOn:!1})}),i(!1)},[t,l,v,i]);return Object(r.useEffect)(function(){return!0===o&&$(document.body).on("mouseup",function(e){var t=e.clientX;return E(t)}).on("touchend",function(e){var t=e.changedTouches[0].clientX;return E(t)}),function(){$(document.body).off("mouseup").off("touchend")}},[o,E]),{onSlideByMouse:Object(r.useCallback)(function(e){var t=e.clientX;b(t),i(!0)},[b,i]),onSlideByTouch:Object(r.useCallback)(function(e){var t=e.changedTouches[0].clientX;b(t),i(!0)},[b,i]),doRemove:Object(r.useCallback)(function(){return O({type:"CONFIRM",title:"MSG_CONFIRM_TITLE",icon:"fa fa-question",content:"MSG_REMOVE_QUESTION",handler:function(e){return f.a.CONFIRM!==e?null:p({show:!0,callbackFn:function(){return v({action:"REMOVE",params:t,fail:function(e){return p({show:!1,callbackFn:function(){return O({type:"DANGER",content:e.message})}})},success:function(){return p({show:!1,callbackFn:function(){return O({type:"INFO",content:"MSG_REMOVE_SUCCESS"})}})}})}})}})},[O,p,v,t])}}({record:t}),v=p.onSlideByMouse,O=p.onSlideByTouch,E=p.doRemove;return o.a.createElement("div",{className:"card amount-card ".concat(a?"calculate-".concat(t.mapTurnOn?"on":"off"):""),onMouseDown:v,onTouchStart:O},o.a.createElement("div",{className:"card-header bg-".concat("income"===t.type?"primary":"expenses"===t.type?"danger":"info")},o.a.createElement(u.b,{className:"mr-2",to:"/update/".concat(t.uid)},o.a.createElement("i",{className:"fa fa-pencil"})),t.desc," ",a||"expected"!==t.status?null:"(".concat(s.messages.EXPECTED,")"),o.a.createElement("button",{type:"button",className:"ml-auto btn btn-link p-0",onClick:E},o.a.createElement("i",{className:"fa fa-times"}))),o.a.createElement("div",{className:"card-body text-dark"},o.a.createElement(b.b,{tagName:"form"},o.a.createElement(b.c,{className:"text-center"},o.a.createElement(b.a,{className:"form-group border-right"},o.a.createElement(i.a,{tagName:"label",id:"AMOUNT_CYCLE"}),o.a.createElement("span",{className:"d-block"},s.messages["CYCLE_".concat((t.cycle||"").toUpperCase())])),o.a.createElement(b.a,{className:"form-group"},o.a.createElement(i.a,{tagName:"label",id:"AMOUNT"}),o.a.createElement("span",{className:"d-block"},"$ ",l()(t.amount).format("0,0")))))))}},38:function(e,t,n){e.exports=n.p+"static/media/404.bd332713.svg"},39:function(e,t,n){e.exports=n.p+"static/media/cash-logo.cb5cc733.svg"},41:function(e,t,n){e.exports=n(56)},50:function(e,t,n){var a={"./en.json":[57,1],"./zh.json":[58,2]};function c(e){if(!n.o(a,e))return Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t});var t=a[e],c=t[0];return n.e(t[1]).then(function(){return n.t(c,3)})}c.keys=function(){return Object.keys(a)},c.id=50,e.exports=c},55:function(e,t,n){},56:function(e,t,n){"use strict";n.r(t);var a,c=n(0),r=n.n(c),o=n(36),i=n.n(o),u=n(15),s=n.n(u),l=n(16),m=n(14),d=n(30),f=n.n(d),b=(n(48),n(40),n(6)),p=n(3);!function(e){e[e.DEFAULT=0]="DEFAULT",e[e.EN=1]="EN",e[e.ZH=2]="ZH"}(a||(a={}));var h=n.e(1).then(n.t.bind(null,57,3)).then(function(e){return{locale:"en",messages:e.default}}),v=function(e,t){switch(t){case a.EN:return h.then(function(e){return localStorage.setItem("CASH_MAP_LANG","en"),e});case a.ZH:return n.e(2).then(n.t.bind(null,58,3)).then(function(e){var t=e.default;return localStorage.setItem("CASH_MAP_LANG","zh"),{locale:"zh",messages:t}});default:return c=(c=localStorage.getItem("CASH_MAP_LANG")||navigator.language.toLowerCase()).substring(0,c.indexOf("-")>0?c.indexOf("-"):void 0),n(50)("./".concat(c,".json")).then(function(e){var t=e.default;return localStorage.setItem("CASH_MAP_LANG",c),{locale:c,messages:t}}).catch(function(){return h})}var c},O=Object(c.createContext)({locale:"en",setLang:function(){}}),E=function(e){var t=e.children,n=Object(c.useState)({locale:"en",messages:{}}),o=Object(b.a)(n,2),i=o[0],u=i.locale,s=i.messages,l=o[1],m=Object(c.useReducer)(v,h),d=Object(b.a)(m,2),f=d[0],E=d[1],g=Object.keys(s).length>0;return f.then(function(e){return JSON.stringify(e)===JSON.stringify(s)?null:l(e)}),Object(c.useMemo)(function(){return g?null:E(a.DEFAULT)},[g]),g?r.a.createElement(p.b,{locale:u,messages:s},r.a.createElement(O.Provider,{value:{locale:u,setLang:E}},t)):null},g=n(18),y=n(21),j=n(17),N=n(23),w=n.n(N),C=n(1),k=n(12),S=n.n(k),T=n(22),x=n(34),P=n(35),D=function(e){var t=e.summary,n=e.cycle,a=e.onCycleChange,o=Object(p.c)(),i="zh"===o.locale?60:110,u=Object(c.useState)(!1),s=Object(b.a)(u,2),l=s[0],m=s[1],d=Object(c.useCallback)(function(){return m(!l)},[l,m]);return r.a.createElement("fieldset",{className:"summary-dashboard shadow ".concat(l?"sd-expand":"sd-collapse")},r.a.createElement("legend",null,r.a.createElement("button",{type:"button",className:"btn btn-link",onClick:d},o.messages.SUMMARY," (",o.messages["CYCLE_".concat(n.toUpperCase())],")",r.a.createElement("i",{className:"ml-2 fa fa-".concat(l?"minus":"plus","-square-o")}))),l?r.a.createElement(C.b,{tagName:"form"},r.a.createElement(C.c,null,r.a.createElement(C.a,{className:"form-group",width:{sm:6}},r.a.createElement(p.a,{tagName:"label",id:"VIEW_CYCLE"}),r.a.createElement(x.a,{value:n,disableOnce:!0,onChange:function(e){return a(e)}}))),r.a.createElement(C.c,null,r.a.createElement(C.a,{width:{def:12,sm:6}},r.a.createElement(T.a,{label:o.messages.INCOME,labelWidth:i},r.a.createElement("span",{className:"form-control text-right"},"$ ",S()(t.income).format("0,0")))),r.a.createElement(C.a,{width:{def:12,sm:6}},r.a.createElement(T.a,{label:o.messages.EXPENSES,labelWidth:i},r.a.createElement("span",{className:"form-control text-right"},"$ ",S()(t.expenses).format("0,0")))),r.a.createElement(C.a,{width:{def:12,sm:6}},r.a.createElement(T.a,{label:o.messages.DEPOSIT,labelWidth:i},r.a.createElement("span",{className:"form-control text-right"},"$ ",S()(t.deposit).format("0,0")))),r.a.createElement(C.a,{width:{def:12,sm:6}},r.a.createElement(T.a,{label:o.messages.APPLICABLE,labelWidth:i},r.a.createElement("span",{className:"form-control text-right"},"$ ",S()(t.applicable).format("0,0")))))):r.a.createElement(C.b,{tagName:"form"},r.a.createElement(C.c,{className:"text-right"},r.a.createElement(C.a,{className:"form-group"},r.a.createElement(p.a,{tagName:"label",id:"APPLICABLE"}),r.a.createElement("span",{className:"d-block"},"$ ",S()(t.applicable).format("0,0"))),r.a.createElement(C.a,{className:"form-group"},r.a.createElement(p.a,{tagName:"label",id:"DEPOSIT"}),r.a.createElement("span",{className:"d-block"},"$ ",S()(t.deposit).format("0,0"))))))},M=function(){var e=Object(j.c)(),t=e.store,n=t.summary,a=t.sumcycle,o=t.target.list,i=e.dispatch,u=Object(c.useCallback)(function(e){return i({action:"SUMMARY",params:{cycle:e}})},[i]);return Object(c.useEffect)(function(){return i({action:"ALL",success:function(){return i({action:"LIST",params:{status:"expected"}})}})},[i]),r.a.createElement("div",null,r.a.createElement("h4",{className:"page-title"},r.a.createElement(p.a,{tagName:"strong",id:"CASH_MAP"})),r.a.createElement(D,{summary:n,cycle:a,onCycleChange:u}),r.a.createElement(C.b,{margin:{b:3}},o.map(function(e){return r.a.createElement(C.c,{key:"record-".concat(e.uid),align:"center"},r.a.createElement(C.a,{width:{def:12,sm:10,lg:8}},r.a.createElement(P.a,{record:e,isMap:!0})))})))},A=n(38),L=n.n(A),R=function(){var e=Object(g.b)().Loading;return Object(c.useEffect)(function(){return e({show:!0}),function(){return e({show:!1})}},[e]),null},F=[{path:"/",exact:!0,component:M},{path:"/append",text:"APPEND_RECORD",icon:"fa fa-plus",component:w()({loader:function(){return n.e(0).then(n.bind(null,62))},loading:R})},{path:"/list",text:"RECORD_LIST",icon:"fa fa-list",component:w()({loader:function(){return n.e(6).then(n.bind(null,63))},loading:R})},{path:"/update/:uid",text:"UPDATE_RECORD",component:w()({loader:function(){return n.e(0).then(n.bind(null,62))},loading:R})},{component:function(){var e=Object(c.useCallback)(function(){return window.history.back()},[]);return r.a.createElement(C.b,{className:"not-found-404"},r.a.createElement(C.c,{align:"center"},r.a.createElement(C.a,{width:{def:12,sm:6,md:4}},r.a.createElement("img",{className:"img-fluid",src:L.a,alt:"404"}))),r.a.createElement(C.c,{align:"center"},r.a.createElement(C.a,{className:"text-center"},r.a.createElement("button",{type:"button",className:"btn btn-lg btn-link",onClick:e},r.a.createElement(p.a,{id:"BACK_TO_PREV_PAGE"})))))}}],I=n(39),_=n.n(I),Y=function(){return r.a.createElement(l.b,{className:"navbar-brand text-white",to:"/"},r.a.createElement("img",{className:"rounded-circle",src:_.a,alt:"Logo"}))},U=function(e){var t=e.onExpanded,n=Object(c.useRef)(null),o=Object(c.useContext)(O).setLang,i=Object(c.useCallback)(function(){return o(a.EN)},[o]),u=Object(c.useCallback)(function(){return o(a.ZH)},[o]);return Object(c.useEffect)(function(){var e=n.current;return $(e).on("show.bs.dropdown",function(){return t()}),function(){$(e).off("shown.bs.dropdown")}}),r.a.createElement("ul",{className:"lang-dropdown navbar-nav ml-auto"},r.a.createElement("li",{ref:n,className:"nav-item dropdown"},r.a.createElement("button",{type:"button",className:"btn btn-link nav-link dropdown-toggle","data-toggle":"dropdown"},r.a.createElement("i",{className:"fa fa-language mr-2"})),r.a.createElement("div",{className:"dropdown-menu dropdown-menu-right"},r.a.createElement("button",{type:"button",className:"dropdown-item",onClick:i},"English"),r.a.createElement("button",{type:"button",className:"dropdown-item",onClick:u},"\u7e41\u9ad4\u4e2d\u6587"))))},H=function(e){var t=e.show,n=void 0!==t&&t,a=e.setShow,o=window.location.pathname,i=Object(c.useCallback)(function(){return a(!1)},[a]);return Object(c.useEffect)(function(){return $(document.body).on("click",function(e){var t=e.target;return $(t).parents(".menu-bars").length>0?null:i()}),function(){$(document.body).off("click")}}),r.a.createElement("nav",{className:["left-side-menu nav flex-column rounded-right",n?"show":""].join(" ")},F.filter(function(e){var t=e.path;return!0!==e.exact&&t&&t.indexOf(":")<0}).map(function(e){var t=e.path,n=void 0===t?"/":t,a=e.text,c=void 0===a?"":a,u=e.icon,s=void 0===u?"":u;return r.a.createElement(l.b,{key:n,to:n,onClick:i,className:["nav-link",n===o?"active":""].join(" ")},r.a.createElement("i",{className:"mr-2 ".concat(s)}),r.a.createElement(p.a,{id:c}))}))},W=function(){var e=Object(c.useState)(!1),t=Object(b.a)(e,2),n=t[0],a=t[1],o=Object(c.useCallback)(function(){return a(!n)},[n]);return r.a.createElement("nav",{className:"cash-map-header navbar navbar-expand navbar-dark bg-dark text-secondary border-bottom border-white"},r.a.createElement("div",{className:"collapse navbar-collapse"},r.a.createElement("ul",{className:"navbar-nav mr-auto menu-bars"},r.a.createElement("li",{className:"nav-item"},r.a.createElement("button",{type:"button",className:"btn btn-link nav-link",onClick:o},r.a.createElement("i",{className:"fa fa-bars"})),r.a.createElement(H,{show:n,setShow:a})))),r.a.createElement(Y,null),r.a.createElement("div",{className:"collapse navbar-collapse"},r.a.createElement(U,{onExpanded:function(){return a(!1)}})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(55);window.$=f.a,n.e(7).then(n.t.bind(null,61,7)).then(function(){i.a.render(r.a.createElement(E,null,r.a.createElement(g.a,null,r.a.createElement(y.b,null,r.a.createElement(l.a,{basename:"/cash-map"},r.a.createElement(W,null),r.a.createElement("div",{className:"cash-map-app"},r.a.createElement(j.b,null,r.a.createElement(m.c,null,F.map(function(e){return r.a.createElement(m.a,Object.assign({key:s()()},e))})))))))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})})}},[[41,4,5]]]);
//# sourceMappingURL=main.d310ce83.chunk.js.map