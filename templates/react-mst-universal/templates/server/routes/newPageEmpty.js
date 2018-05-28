'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {resultData} = require('../common/utils');

router.get('/getModData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      gmv: _.random(0, 1000),
      gmvYOY: _.random(0, 1, true)
    }
  });

  res.send(ret);
});

module.exports = router;
