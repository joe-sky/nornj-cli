import 'whatwg-fetch';
import 'es6-weak-map/implement';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'jquery-placeholder';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
!window.requestAnimationFrame && (window.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
});