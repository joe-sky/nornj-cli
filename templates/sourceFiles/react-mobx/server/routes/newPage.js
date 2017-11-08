'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../common/utils');

router.post('/getTableData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  const datas = _.times(100, function(i) {
    let num = i + 1;

    return {
      vendorCode: num + 100000,
      vendorName: '测试' + num,
      orderReachRate: _.random(10, 90) + '%',
      orderConfirmRate: _.random(10, 90) + '%',
      orderFailureRate: _.random(10, 90) + '%',
      deliveryGoodsCycle: _.random(1, 10),
      deliveryGoodsCycleDisparity: _.random(1, 10),
      timeDifference1: _.random(1, 10),
      timeDifference2: _.random(1, 10),
      timeDifference3: _.random(1, 10),
      serviceTarget1: _.random(10, 90) + '%',
      serviceTarget2: _.random(10, 90) + '%',
      serviceTarget3: _.random(1, 24),
      serviceTarget4: _.random(10, 90) + '%',
      serviceTarget5: _.random(1, 100000)
    };
  });

  const pageIndex = params.currentPage,
    pageSize = params.pageSize,
    start = (pageIndex - 1) * pageSize,
    end = pageIndex * pageSize,
    data = datas.filter((obj, i) => {
      if (i >= start && i < end) {
        return true;
      }
    });

  Object.assign(ret, resultData, {
    data,
    totalCount: 100
  });

  res.send(ret);
});

module.exports = router;