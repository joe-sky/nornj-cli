import 'console-polyfill';
import 'es6-symbol/implement';
if (!Object.assign && babelHelpers) {
  Object.assign = babelHelpers.extends;
}
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/string';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
import 'es6-weak-map/implement';
import 'core-js/es6/array';