!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).ClassConfigBase=e()}}(function(){return function e(t,n,r){function o(c,u){if(!n[c]){if(!t[c]){var f="function"==typeof require&&require;if(!u&&f)return f(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var s=n[c]={exports:{}};t[c][0].call(s.exports,function(e){var n=t[c][1][e];return o(n||e)},s,s.exports,e,t,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(e,t,n){"use strict";function r(e,t){return s(e.value,t.value)}function o(e,t){return{enumerable:!0,get(){return e[t]},set(n){e[t]=s(n,e[t])}}}function i(e,t){a(e.$private,e,(e,n)=>{const r=t[n.keyChain]||o;const i=r(e.parent,e.key);i.set===y&&f(i,n.parent,n.key);Object.defineProperty(n.parent,n.key,i)})}function c(e){Object.defineProperties(e,{[Symbol.toStringTag]:{get(){return e.constructor.name},set(){}}})}function u(e,t,n){const r=Object.keys(t).reduce((r,o)=>{const i=t[o];const c=i(n,o);c.set===y&&f(c,e,o);r[o]=c;return r},{});Object.defineProperties(e,r)}function f(e,t,n){e.set=(r=>{Object.defineProperty(t,n,{enumerable:e.enumerable,configurable:!0,writable:!0,value:r})})}const a=e("copy-props"),s=e("default-val"),p=e("instance-stringer");class l{constructor(e,t){Object.defineProperty(this,"$private",{value:{}}),a(t,this.$private),a(e,this.$private,r),i(this,this.defineAccessors()||this.getAccessorDescriptors())}toString(){return p(this)}configure(e){c(e);const t=this.defineInterfaces();t&&u(e,t,this),Object.defineProperties(e,this.getInterfaceDescriptors())}defineAccessors(){}defineInterfaces(){}getAccessorDescriptors(){return{}}getInterfaceDescriptors(){return{}}static readonly({get:e,enumerable:t=!0}){return{enumerable:t,set(){},get:e}}static writable({get:e,set:t,enumerable:n=!0,configurable:r=!1}){return{enumerable:n,configurable:r,set:t,get:e}}static replaceable({get:e,enumerable:t=!0}){return{enumerable:t,configurable:!0,get:e,set:y}}}const y=()=>{};t.exports=l},{"copy-props":2,"default-val":3,"instance-stringer":5}],2:[function(e,t,n){"use strict";function r(e,t,n){if(!d(e)){var r=n.fromto[t];if(r){delete n.fromto[t],Array.isArray(r)||(r=[r]);for(var o={keyChain:t,value:e,key:n.name,depth:n.depth,parent:n.parent},i=0,c=r.length;i<c;i++)s(n.dest,r[i],function(e,t,c){var u={keyChain:r[i],value:e[t],key:t,depth:c,parent:e};return n.convert(o,u)})}}}function o(e,t,n){if(d(e)){for(var r in e)return;s(n.dest,t,i)}else{var o={keyChain:t,value:e,key:n.name,depth:n.depth,parent:n.parent};s(n.dest,t,function(e,r,i){var c={keyChain:t,value:e[r],key:r,depth:i,parent:e};return n.convert(o,c)})}}function i(){return{}}function c(e){return e.value}function u(e){var t={};for(var n in e){var r=e[n];"string"==typeof r&&(t[n]=r)}return t}function f(e){for(var t={},n=0,r=e.length;n<r;n++){var o=e[n];"string"==typeof o&&(t[o]=o)}return t}function a(e){var t={};for(var n in e){var r=e[n];t[r]||(t[r]=[]),t[r].push(n)}return t}function s(e,t,n){p(e,t.split("."),1,n)}function p(e,t,n,r){var o=t.shift();if(t.length)d(e[o])||(e[o]={}),p(e[o],t,n+1,r);else{var i=r(e,o,n);void 0!==i&&(e[o]=i)}}function l(e,t){for(var n in t){var r=t[n];Array.isArray(r)||(r=[r]);for(var o=0,i=r.length;o<i;o++)s(e,r[o],y)}}function y(){}function b(e){return"[object Object]"===Object.prototype.toString.call(e)}var v=e("each-props"),d=e("is-plain-object");t.exports=function(e,t,n,i,s){if(b(e)||(e={}),b(t)||(t={}),d(n)?n=u(n):Array.isArray(n)?n=f(n):"boolean"==typeof n?(s=n,i=c,n=null):"function"==typeof n?(s=i,i=n,n=null):n=null,"function"!=typeof i&&("boolean"==typeof i?(s=i,i=c):i=c),"boolean"!=typeof s&&(s=!1),s){var p=e;e=t,t=p,n&&(n=a(n))}var y={dest:t,fromto:n,convert:i};return n?(v(e,r,y),l(t,n)):v(e,o,y),t}},{"each-props":4,"is-plain-object":6}],3:[function(e,t,n){"use strict";function r(e,t,n){return null==e?t:"number"==typeof e&&isNaN(e)?t:("string"!=typeof n&&(n=o(t)),o(e)===n||typeof e===n?e:t)}function o(e){return Object.prototype.toString.call(e)}t.exports=r},{}],4:[function(e,t,n){"use strict";function r(e,t,n,o,u){var f=Object.keys(e);if("function"==typeof u.sort){var a=u.sort(f);Array.isArray(a)&&(f=a)}o+=1;for(var s=0,p=f.length;s<p;s++){var l=f[s],y=t+"."+l,b=e[l],v=c({},u);v.name=l,v.index=s,v.count=p,v.depth=o,v.parent=e,!n(b,y.slice(1),v)&&i(b)&&r(b,y,n,o,u)}}function o(e){return"[object Object]"===Object.prototype.toString.call(e)}var i=e("is-plain-object"),c=e("object-assign");t.exports=function(e,t,n){o(e)&&"function"==typeof t&&(i(n)||(n={}),r(e,"",t,0,n))}},{"is-plain-object":6,"object-assign":8}],5:[function(e,t,n){"use strict";function r(e){const t=i(e);return u(e)?t:`${e.constructor.name} ${t}`}function o(e){return`[${e.map(e=>{if(Array.isArray(e))return o(e);if(e instanceof Object)return r(e);if("string"==typeof e)return`'${e}'`;return e}).join(", ")}]`}function i(e){let t="",n=0;return c(e,(e,i,c)=>{0===c.index?(t+="{ ",n=c.depth):(n>c.depth&&(t+=" }".repeat(n-c.depth),n=c.depth),t+=", ");Array.isArray(e)?t+=`${c.name}: ${o(e)}`:u(e)?(t+=`${c.name}: `,Object.keys(e).length||(t+="{}")):e instanceof Object?t+=`${c.name}: ${r(e)}`:t+="string"==typeof e?`${c.name}: '${e}'`:`${c.name}: ${e}`}),(t+=" }".repeat(n)).length||(t="{}"),t}const c=e("each-props"),u=e("is-plain-object");r.propsStringer=i,r.arrayStringer=o,t.exports=r},{"each-props":4,"is-plain-object":6}],6:[function(e,t,n){"use strict";function r(e){return!0===o(e)&&"[object Object]"===Object.prototype.toString.call(e)}var o=e("isobject");t.exports=function(e){var t,n;return!1!==r(e)&&("function"==typeof(t=e.constructor)&&(n=t.prototype,!1!==r(n)&&!1!==n.hasOwnProperty("isPrototypeOf")))}},{isobject:7}],7:[function(e,t,n){"use strict";t.exports=function(e){return null!=e&&"object"==typeof e&&!1===Array.isArray(e)}},{}],8:[function(e,t,n){"use strict";function r(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,f=r(e),a=1;a<arguments.length;a++){n=Object(arguments[a]);for(var s in n)i.call(n,s)&&(f[s]=n[s]);if(o){u=o(n);for(var p=0;p<u.length;p++)c.call(n,u[p])&&(f[u[p]]=n[u[p]])}}return f}},{}]},{},[1])(1)});