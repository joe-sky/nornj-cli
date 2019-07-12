import 'console-polyfill';
import 'es6-symbol/implement';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/string';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
import 'es6-weak-map/implement';
import 'core-js/es/array';
import 'whatwg-fetch';
!window.requestAnimationFrame &&
  (window.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
  });
