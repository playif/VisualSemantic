﻿"use strict";
_kangoLoader.add("kango/invoke", function(require, exports, module) {
var func=require("kango/utils").func,backgroundscript_engine=require("kango/backgroundscript_engine");function invokeModuleMember(b,c){var a=b.split("/"),d=a[a.length-1],a=a.slice(1,a.length-1).join("/"),a=require(a);return func.invoke(a,d,c)}function invoke(b,c){return 0==b.indexOf("modules/")?invokeModuleMember(b,c):func.invoke(backgroundscript_engine.getDOMWindow(),b,c)}module.exports=invoke;

});