!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.ClassConfigBase=t()}}(function(){return function t(e,n,r){function o(c,u){if(!n[c]){if(!e[c]){var f="function"==typeof require&&require;if(!u&&f)return f(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var s=n[c]={exports:{}};e[c][0].call(s.exports,function(t){var n=e[c][1][t];return o(n||t)},s,s.exports,t,e,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(t,e,n){"use strict";function r(t,e){e=u(e,{}),c(t.$private,t,(t,n)=>{let r=e[n.keyChain]||o;r=r(t.parent,t.key,t);Object.defineProperty(n.parent,n.key,r)})}function o(t,e){return{enumerable:!0,get(){return t[e]},set(n){t[e]=u(n,t[e])}}}function i(t){Object.defineProperties(t,{[Symbol.toStringTag]:{get(){return t.constructor.name},set(){}}})}const c=t("copy-props"),u=t("default-val"),f=t("instance-stringer");class a{constructor(t,e){Object.defineProperty(this,"$private",{value:c(e,{})}),c(t,this.$private,(t,e)=>u(t.value,e.value)),r(this,this.getAccessorDescriptors())}getAccessorDescriptors(){return{}}getInterfaceDescriptors(){return{}}configure(t){i(t),Object.defineProperties(t,this.getInterfaceDescriptors())}toString(){return f(this)}}e.exports=a},{"copy-props":2,"default-val":3,"instance-stringer":5}],2:[function(t,e,n){"use strict";function r(t,e,n){if(!d(t)){var r=n.fromto[e];if(r){delete n.fromto[e],Array.isArray(r)||(r=[r]);for(var o={keyChain:e,value:t,key:n.name,depth:n.depth,parent:n.parent},i=0,c=r.length;i<c;i++)s(n.dest,r[i],function(t,e,c){var u={keyChain:r[i],value:t[e],key:e,depth:c,parent:t};return n.convert(o,u)})}}}function o(t,e,n){if(d(t)){for(var r in t)return;return void s(n.dest,e,i)}var o={keyChain:e,value:t,key:n.name,depth:n.depth,parent:n.parent};s(n.dest,e,function(t,r,i){var c={keyChain:e,value:t[r],key:r,depth:i,parent:t};return n.convert(o,c)})}function i(){return{}}function c(t){return t.value}function u(t){var e={};for(var n in t){var r=t[n];"string"==typeof r&&(e[n]=r)}return e}function f(t){for(var e={},n=0,r=t.length;n<r;n++){var o=t[n];"string"==typeof o&&(e[o]=o)}return e}function a(t){var e={};for(var n in t){var r=t[n];e[r]||(e[r]=[]),e[r].push(n)}return e}function s(t,e,n){p(t,e.split("."),1,n)}function p(t,e,n,r){var o=e.shift();if(!e.length){var i=r(t,o,n);return void(void 0!==i&&(t[o]=i))}d(t[o])||(t[o]={}),p(t[o],e,n+1,r)}function l(t,e){for(var n in e){var r=e[n];Array.isArray(r)||(r=[r]);for(var o=0,i=r.length;o<i;o++)s(t,r[o],y)}}function y(){}function v(t){return"[object Object]"===Object.prototype.toString.call(t)}var b=t("each-props"),d=t("is-plain-object");e.exports=function(t,e,n,i,s){if(v(t)||(t={}),v(e)||(e={}),d(n)?n=u(n):Array.isArray(n)?n=f(n):"boolean"==typeof n?(s=n,i=c,n=null):"function"==typeof n?(s=i,i=n,n=null):n=null,"function"!=typeof i&&("boolean"==typeof i?(s=i,i=c):i=c),"boolean"!=typeof s&&(s=!1),s){var p=t;t=e,e=p,n&&(n=a(n))}var y={dest:e,fromto:n,convert:i};return n?(b(t,r,y),l(e,n)):b(t,o,y),e}},{"each-props":4,"is-plain-object":6}],3:[function(t,e,n){"use strict";function r(t,e,n){return null==t?e:"number"==typeof t&&isNaN(t)?e:("string"!=typeof n&&(n=o(e)),o(t)===n||typeof t===n?t:e)}function o(t){return Object.prototype.toString.call(t)}e.exports=r},{}],4:[function(t,e,n){"use strict";function r(t,e,n,o,u){var f=Object.keys(t);if("function"==typeof u.sort){var a=u.sort(f);Array.isArray(a)&&(f=a)}o+=1;for(var s=0,p=f.length;s<p;s++){var l=f[s],y=e+"."+l,v=t[l],b=c({},u);b.name=l,b.index=s,b.count=p,b.depth=o,b.parent=t;!n(v,y.slice(1),b)&&i(v)&&r(v,y,n,o,u)}}function o(t){return"[object Object]"===Object.prototype.toString.call(t)}var i=t("is-plain-object"),c=t("object-assign");e.exports=function(t,e,n){o(t)&&"function"==typeof e&&(i(n)||(n={}),r(t,"",e,0,n))}},{"is-plain-object":6,"object-assign":8}],5:[function(t,e,n){"use strict";function r(t){const e=i(t);return u(t)?e:`${t.constructor.name} ${e}`}function o(t){return`[${t.map(t=>{if(Array.isArray(t))return o(t);if(t instanceof Object)return r(t);if("string"==typeof t)return`'${t}'`;return t}).join(", ")}]`}function i(t){let e="",n=0;return c(t,(t,i,c)=>{0===c.index?(e+="{ ",n=c.depth):(n>c.depth&&(e+=" }".repeat(n-c.depth),n=c.depth),e+=", ");Array.isArray(t)?e+=`${c.name}: ${o(t)}`:u(t)?(e+=`${c.name}: `,Object.keys(t).length||(e+="{}")):t instanceof Object?e+=`${c.name}: ${r(t)}`:e+="string"==typeof t?`${c.name}: '${t}'`:`${c.name}: ${t}`}),e+=" }".repeat(n),e.length||(e="{}"),e}const c=t("each-props"),u=t("is-plain-object");r.propsStringer=i,r.arrayStringer=o,e.exports=r},{"each-props":4,"is-plain-object":6}],6:[function(t,e,n){"use strict";function r(t){return!0===o(t)&&"[object Object]"===Object.prototype.toString.call(t)}var o=t("isobject");e.exports=function(t){var e,n;return!1!==r(t)&&("function"==typeof(e=t.constructor)&&(n=e.prototype,!1!==r(n)&&!1!==n.hasOwnProperty("isPrototypeOf")))}},{isobject:7}],7:[function(t,e,n){"use strict";e.exports=function(t){return null!=t&&"object"==typeof t&&!Array.isArray(t)}},{}],8:[function(t,e,n){"use strict";function r(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(t){r[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var n,u,f=r(t),a=1;a<arguments.length;a++){n=Object(arguments[a]);for(var s in n)i.call(n,s)&&(f[s]=n[s]);if(o){u=o(n);for(var p=0;p<u.length;p++)c.call(n,u[p])&&(f[u[p]]=n[u[p]])}}return f}},{}]},{},[1])(1)});