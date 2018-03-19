import 'whatwg-fetch';
import 'es6-weak-map/implement';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'jquery-placeholder';
import 'console-polyfill';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
!window.requestAnimationFrame && (window.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
});
import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
React.createClass = createClass;
React.PropTypes = PropTypes;