'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../common/utils');

router.post('/saveRolePermission', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('roldId', params.roldId);
  console.log('menuIds', params.menuIds);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.get('/searchRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [{
      key: 1,
      userId: 12,
      name: '管理员000',
      describe: '我是描述',
      cTime: '2017-6-15',
      mTime: '2017-8-15'
    }]
  });
  res.send(ret);
});

router.post('/deleteRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/saveRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userName', params.userName);
  console.log('userDescribe', params.userDescribe);

  Object.assign(ret, resultData, {
    data: {
      roleId: '9999'
    }
  });

  res.send(ret);
});

router.get('/getRoleManagementData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(25, i => {
      return {
        key: i,
        roleId: 145 + i,
        name: '管理员' + i,
        describe: '我是描述',
        cTime: '2017-6-15',
        mTime: '2017-8-15',
        users: [{
          key: 1,
          userId: 123,
          loginName: '小花',
          name: '糊涂图',
          email: 'tesste111@test.com',
          department: '技术部',
          duty: '工程师',
          role: '开发区',
          oTime: '2017-6-15',
          mTime: '2017-8-15'
        }, {
          key: 2,
          userId: 566,
          loginName: '大花',
          name: '糊涂图',
          email: 'tesste222@test.com',
          department: '技术部',
          duty: '工程师',
          role: '开发区',
          oTime: '2017-6-15',
          mTime: '2017-8-15'
        }]
      };
    })
  });

  res.send(ret);
});

router.get('/getRoleMenuTree', function(req, res) {
  res.type('json');
  let params = req.query,
    ret = {};

  ret = {
    "data": [{
      "level": 1,
      "pid": 0,
      "name": "测试菜单",
      "id": 44,
      "selected": true
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 45,
      "selected": false
    }, {
      "level": 3,
      "pid": 45,
      "name": "测试菜单",
      "id": 46,
      "selected": true
    }, {
      "level": 3,
      "pid": 45,
      "name": "测试菜单",
      "id": 47,
      "selected": true
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 48,
      "selected": false
    }, {
      "level": 3,
      "pid": 48,
      "name": "测试菜单",
      "id": 56,
      "selected": true
    }, {
      "level": 3,
      "pid": 48,
      "name": "测试菜单",
      "id": 57,
      "selected": true
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 49,
      "selected": false
    }, {
      "level": 3,
      "pid": 49,
      "name": "测试菜单",
      "id": 58,
      "selected": false
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 50,
      "selected": false
    }, {
      "level": 3,
      "pid": 50,
      "name": "测试菜单",
      "id": 59,
      "selected": false
    }, {
      "level": 3,
      "pid": 50,
      "name": "测试菜单",
      "id": 60,
      "selected": false
    }, {
      "level": 3,
      "pid": 50,
      "name": "测试菜单",
      "id": 61,
      "selected": false
    }, {
      "level": 3,
      "pid": 50,
      "name": "测试菜单",
      "id": 62,
      "selected": false
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 51,
      "selected": false
    }, {
      "level": 3,
      "pid": 51,
      "name": "测试菜单",
      "id": 63,
      "selected": false
    }, {
      "level": 3,
      "pid": 51,
      "name": "测试菜单",
      "id": 64,
      "selected": false
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 52,
      "selected": false
    }, {
      "level": 3,
      "pid": 52,
      "name": "测试菜单",
      "id": 65,
      "selected": false
    }, {
      "level": 3,
      "pid": 52,
      "name": "测试菜单",
      "id": 66,
      "selected": false
    }, {
      "level": 3,
      "pid": 52,
      "name": "测试菜单",
      "id": 67,
      "selected": false
    }, {
      "level": 3,
      "pid": 52,
      "name": "测试菜单",
      "id": 68,
      "selected": false
    }, {
      "level": 2,
      "pid": 44,
      "name": "测试菜单",
      "id": 53,
      "selected": false
    }, {
      "level": 3,
      "pid": 53,
      "name": "测试菜单",
      "id": 69,
      "selected": false
    }, {
      "level": 3,
      "pid": 53,
      "name": "测试菜单",
      "id": 70,
      "selected": false
    }, {
      "level": 3,
      "pid": 53,
      "name": "测试菜单",
      "id": 71,
      "selected": false
    }],
    "success": true
  };

  res.send(ret);
});

module.exports = router;