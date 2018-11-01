'use strict';

const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method == 'OPTIONS') res.send(200);
  else next();
});

const chartExample = require('./routes/chartExample');
app.use('/chartExample', chartExample);

const listExample = require('./routes/listExample');
app.use('/listExample', listExample);

//{pages}//

const { resultData } = require('./common/utils');

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  res.type('html');
  res.render('index');
});

app.get('/checkUser', function(req, res) {
  res.type('html');
  res.sendFile('views/checkUser.html', { root: __dirname });
});

app.get('/common/getLoginInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: 'test_user'
  });

  res.send(ret);
});

app.post('/common/getCurrentUserInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: {
      pin: 'testUser',
      name: 'testUser'
    }
  });

  res.send(ret);
});

app.get('/common/getCategoryData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        value: 123 + '',
        label: 'Zhejiang',
        children: [
          {
            value: 100 + '',
            label: 'Hangzhou',
            children: [
              {
                value: 101 + '',
                label: 'West Lake'
              }
            ]
          }
        ]
      },
      {
        value: 412 + '',
        label: 'Jiangsu',
        children: [
          {
            value: 432 + '',
            label: 'Nanjing',
            children: [
              {
                value: 1243 + '',
                label: 'Zhong Hua Men'
              }
            ]
          }
        ]
      }
    ]
  });

  res.send(ret);
});

app.get('/common/getCategoryHasLevel4Data', function(req, res) {
  res.type('json');
  let ret = {};

  //   const d = [{
  //       "children": [{
  //           "children": [{
  //             "label": "卫生巾",
  //             "value": "1408"
  //           }],
  //           "label": "女性护理",
  //           "value": "1385"
  //         },
  //         {
  //           "children": [{
  //               "label": "面膜",
  //               "value": "1392"
  //             },
  //             {
  //               "label": "剃须",
  //               "value": "1416"
  //             }
  //           ],
  //           "label": "面部护肤",
  //           "value": "1381"
  //         },
  //         {
  //           "children": [{
  //             "label": "牙膏/牙粉",
  //             "value": "1405"
  //           }],
  //           "label": "口腔护理",
  //           "value": "1384"
  //         },
  //         {
  //           "children": [{
  //             "label": "沐浴",
  //             "value": "1401"
  //           }],
  //           "label": "身体护理",
  //           "value": "1383"
  //         },
  //         {
  //           "children": [{
  //               "label": "套装",
  //               "value": "6739"
  //             },
  //             {
  //               "label": "护发",
  //               "value": "11923"
  //             }
  //           ],
  //           "label": "洗发护发",
  //           "value": "1386"
  //         },
  //         {
  //           "children": [{
  //               "label": "家庭清洁",
  //               "value": "1663"
  //             },
  //             {
  //               "label": "衣物清洁",
  //               "value": "1662"
  //             }
  //           ],
  //           "label": "清洁用品",
  //           "value": "1625"
  //         }
  //       ],
  //       "label": "美妆个护",
  //       "value": "1316"
  //     },
  //     {
  //       "children": [{
  //         "children": [{
  //           "label": "婴儿尿裤",
  //           "value": "7057"
  //         }],
  //         "label": "尿裤湿巾",
  //         "value": "1525"
  //       }],
  //       "label": "母婴",
  //       "value": "1317"
  //     },
  //     {
  //       "children": [{
  //         "children": [{
  //             "label": "XP定制高端品类3-1",
  //             "value": "888"
  //           },
  //           {
  //             "label": "XP定制高端品类3-2",
  //             "value": "999"
  //           }
  //         ],
  //         "label": "XP定制高端品类2",
  //         "value": "777"
  //       }],
  //       "label": "XP定制高端品类1",
  //       "value": "666"
  //     }
  //   ];

  let d;
  if (_.random(1, 100) > 50) {
    d = [
      {
        children: [
          {
            children: [
              {
                label: '方便食品',
                value: '15055'
              },
              {
                children: [
                  {
                    label: '大米',
                    value: '1320_5019_5024_大米'
                  },
                  {
                    label: '烘焙原料',
                    value: '1320_5019_5024_烘焙原料'
                  },
                  {
                    label: '意大利面',
                    value: '1320_5019_5024_意大利面'
                  },
                  {
                    label: '调味品',
                    value: '1320_5019_5024_调味品'
                  },
                  {
                    label: '杂粮',
                    value: '1320_5019_5024_杂粮'
                  }
                ],
                label: '米面调味',
                value: '5024'
              }
            ],
            label: '进口食品',
            value: '5019'
          }
        ],
        label: '食品饮料',
        value: '1320'
      }
    ];
  } else {
    d = [
      {
        children: [
          {
            children: [
              {
                label: '方便食品',
                value: '15055'
              },
              {
                children: [
                  {
                    label: '大米',
                    value: '1320_5019_5024_大米'
                  },
                  {
                    label: '烘焙原料',
                    value: '1320_5019_5024_烘焙原料'
                  },
                  {
                    label: '意大利面',
                    value: '1320_5019_5024_意大利面'
                  },
                  {
                    label: '调味品',
                    value: '1320_5019_5024_调味品'
                  },
                  {
                    label: '杂粮',
                    value: '1320_5019_5024_杂粮'
                  }
                ],
                label: '米面调味',
                value: '5024'
              }
            ],
            label: '进口食品',
            value: '5019'
          }
        ],
        label: '食品饮料',
        value: '1320'
      }
    ];
  }

  Object.assign(ret, resultData, {
    data: d
  });

  res.send(ret);
});

app.get('/common/getPropData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        value: '123_456',
        label: '属性1——口味'
      },
      {
        value: '1234_4568',
        label: '口味——原味'
      }
    ]
  });

  res.send(ret);
});

app.get('/common/getCategoryLevel4Data', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        value: 123 + '',
        label: 'Zhejiang'
      },
      {
        value: 412 + '',
        label: 'Jiangsu'
      }
    ]
  });

  res.send(ret);
});

app.get('/common/getBrandData', function(req, res) {
  res.type('json');
  let ret = {};
  let param = req.query;
  if (param.categoryId1 == '123') {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123 + '',
          label: 'Zhejiang11'
        },
        {
          value: 412 + '',
          label: 'Jiangsu'
        }
      ]
    });
  } else {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123412 + '',
          label: '测试123412'
        },
        {
          value: 412412 + '',
          label: '测试412412'
        }
      ]
    });
  }

  res.send(ret);
});

app.get('/common/getDeptData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        value: 123 + '',
        label: 'Zhejiang'
      },
      {
        value: 412 + '',
        label: '消费品'
      }
    ]
  });

  res.send(ret);
});

app.get('/common/getCategory2Data', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        value: i + 1 + '',
        label: `品类${i + 1}`
      };
    })
  });

  res.send(ret);
});

app.get('/common/getVendorData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        value: i + 1 + '',
        label: `供应商${i + 1}`
      };
    })
  });

  res.send(ret);
});

/**
 * 库存管理
 */
app.get('/common/getStockDeptData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        value: 123 + '',
        label: 'Zhejiang1'
      },
      {
        value: 33 + '',
        label: '消费品事业部'
      }
    ]
  });

  res.send(ret);
});

app.get('/common/getStockCategoryData', function(req, res) {
  res.type('json');
  let ret = {};
  let param = req.query;
  if (param.deptId == '123') {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123 + '',
          label: 'Zhejiang1133',
          children: [
            {
              value: 100 + '',
              label: 'Hangzhou33',
              children: [
                {
                  value: 101 + '',
                  label: 'West Lake33'
                }
              ]
            }
          ]
        },
        {
          value: 412123 + '',
          label: '测试123',
          children: [
            {
              value: 43233 + '',
              label: 'Nanjing测试123',
              children: [
                {
                  value: 1243123 + '',
                  label: 'Zhong Hua Men测试123'
                },
                {
                  value: 12431232 + '',
                  label: '呵呵测试123'
                }
              ]
            }
          ]
        },
        {
          value: 43233 + '',
          label: '苏门答腊测试1232',
          children: [
            {
              value: 1243123 + '',
              label: '苏门答腊测试测试123'
            },
            {
              value: 12431232 + '',
              label: '苏门答腊测试123'
            }
          ]
        }
      ]
    });
  } else {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123 + '',
          label: 'Zhejiang11',
          children: [
            {
              value: 100 + '',
              label: 'Hangzhou',
              children: [
                {
                  value: 101 + '',
                  label: 'West Lake'
                }
              ]
            }
          ]
        },
        {
          value: 412 + '',
          label: 'Jiangsu',
          children: [
            {
              value: 432 + '',
              label: 'Nanjing',
              children: [
                {
                  value: 1243 + '',
                  label: 'Zhong Hua Men'
                }
              ]
            }
          ]
        }
      ]
    });
  }

  res.send(ret);
});

app.get('/common/getStockBrandData', function(req, res) {
  res.type('json');
  let ret = {};
  let param = req.query;
  if (param.categoryId1 == '123') {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123123 + '',
          label: 'Zhejiang123测试123'
        },
        {
          value: 412123 + '',
          label: 'Jiangsu123测试123'
        }
      ]
    });
  } else {
    Object.assign(ret, resultData, {
      data: [
        {
          value: 123 + '',
          label: 'Zhejiang'
        },
        {
          value: 412 + '',
          label: 'Jiangsu'
        }
      ]
    });
  }

  res.send(ret);
});

app.get('/common/logout', function(req, res) {
  res.redirect('http://localhost:8080/dist/web/home.html');
});

let server = app.listen(8089, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});