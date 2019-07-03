import 'console-polyfill';
import 'es6-symbol/implement';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/string';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
import 'es6-weak-map/implement';
import 'core-js/es6/array';
import 'whatwg-fetch';
!window.requestAnimationFrame &&
  (window.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
  });
