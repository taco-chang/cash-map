(window["webpackJsonpcash-map"]=window["webpackJsonpcash-map"]||[]).push([[6],{57:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(3);a.a=function(e){var a=e.children,t=e.value,n=void 0===t?"income":t,r=e.onChange,s=void 0===r?function(){}:r,o=Object(l.c)();return c.a.createElement("select",{className:"form-control",value:n,onChange:function(e){var a=e.target;return s(a.value)}},a,c.a.createElement("option",{value:"income"},o.messages.INCOME),c.a.createElement("option",{value:"expenses"},o.messages.EXPENSES),c.a.createElement("option",{value:"deposit"},o.messages.DEPOSIT))}},61:function(e,a,t){"use strict";t.r(a);var n=t(6),c=t(0),l=t.n(c),r=t(3),s=t(15),o=t(1),i=t(57),m=t(33);a.default=function(){var e=Object(r.c)(),a=Object(c.useState)("all"),t=Object(n.a)(a,2),u=t[0],E=t[1],d=Object(s.c)(),p=d.store.target.list,g=function(e){var a=e.dispatch,t=e.setFilter;return Object(c.useEffect)(function(){return a({action:"LIST"})},[a]),{onFilterChange:Object(c.useCallback)(function(e){t(e),a({action:"LIST",params:{type:"all"===e?"":e}})},[a,t])}}({setFilter:E,dispatch:d.dispatch}).onFilterChange;return l.a.createElement("div",null,l.a.createElement("h4",{className:"page-title"},l.a.createElement("i",{className:"mr-2 fa fa-list"}),l.a.createElement(r.a,{tagName:"strong",id:"RECORD_LIST"})),l.a.createElement(o.b,null,l.a.createElement(o.c,{border:{b:!0}},l.a.createElement(o.a,{className:"form-group"},l.a.createElement(r.a,{tagName:"label",id:"RECORD_TYPE"}),l.a.createElement(i.a,{value:u,onChange:g},l.a.createElement("option",{value:"all"},e.messages.ALL_OPTION)))),l.a.createElement(o.c,null,p.map(function(e){return l.a.createElement(o.a,{key:"record-".concat(e.uid),width:{def:12,md:6,lg:4}},l.a.createElement(m.a,{record:e}))}),p.length>0?null:l.a.createElement(o.a,{className:"text-center mt-3 text-secondary"},l.a.createElement(r.a,{tagName:"h4",id:"DATA_NOT_FOUND"})))))}}}]);
//# sourceMappingURL=6.92673481.chunk.js.map