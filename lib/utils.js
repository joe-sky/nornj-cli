'use strict';

const globalModules = require('global-modules');
const config = require('../config.json');

function getTemplatePath() {
  return config.global ? (globalModules + '/nornj-cli/templates/') : './templates/';
}

module.exports = {
  getTemplatePath
};