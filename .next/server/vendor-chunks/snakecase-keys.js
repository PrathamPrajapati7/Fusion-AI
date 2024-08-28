"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/snakecase-keys";
exports.ids = ["vendor-chunks/snakecase-keys"];
exports.modules = {

/***/ "(rsc)/./node_modules/snakecase-keys/index.js":
/*!**********************************************!*\
  !*** ./node_modules/snakecase-keys/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\r\n\r\nconst map = __webpack_require__(/*! map-obj */ \"(rsc)/./node_modules/map-obj/index.js\")\r\nconst { snakeCase } = __webpack_require__(/*! snake-case */ \"(rsc)/./node_modules/snake-case/dist.es2015/index.js\")\r\n\r\nmodule.exports = function (obj, options) {\r\n  options = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options)\r\n\r\n  return map(obj, function (key, val) {\r\n    return [\r\n      matches(options.exclude, key) ? key : snakeCase(key, options.parsingOptions),\r\n      val\r\n    ]\r\n  }, options)\r\n}\r\n\r\nfunction matches (patterns, value) {\r\n  return patterns.some(function (pattern) {\r\n    return typeof pattern === 'string'\r\n      ? pattern === value\r\n      : pattern.test(value)\r\n  })\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc25ha2VjYXNlLWtleXMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7QUFDWjtBQUNBLFlBQVksbUJBQU8sQ0FBQyxzREFBUztBQUM3QixRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLHdFQUFZO0FBQzFDO0FBQ0E7QUFDQSw0QkFBNEIsNkNBQTZDO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL2Z1c2lvbi1haS8uL25vZGVfbW9kdWxlcy9zbmFrZWNhc2Uta2V5cy9pbmRleC5qcz9iODdkIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgbWFwID0gcmVxdWlyZSgnbWFwLW9iaicpXHJcbmNvbnN0IHsgc25ha2VDYXNlIH0gPSByZXF1aXJlKCdzbmFrZS1jYXNlJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaiwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZGVlcDogdHJ1ZSwgZXhjbHVkZTogW10sIHBhcnNpbmdPcHRpb25zOiB7fSB9LCBvcHRpb25zKVxyXG5cclxuICByZXR1cm4gbWFwKG9iaiwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBtYXRjaGVzKG9wdGlvbnMuZXhjbHVkZSwga2V5KSA/IGtleSA6IHNuYWtlQ2FzZShrZXksIG9wdGlvbnMucGFyc2luZ09wdGlvbnMpLFxyXG4gICAgICB2YWxcclxuICAgIF1cclxuICB9LCBvcHRpb25zKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaGVzIChwYXR0ZXJucywgdmFsdWUpIHtcclxuICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocGF0dGVybikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJ1xyXG4gICAgICA/IHBhdHRlcm4gPT09IHZhbHVlXHJcbiAgICAgIDogcGF0dGVybi50ZXN0KHZhbHVlKVxyXG4gIH0pXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/snakecase-keys/index.js\n");

/***/ })

};
;