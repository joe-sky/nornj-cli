import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import {
  Row,
  Col,
  Radio,
  Button,
  Cascader,
  DatePicker,
  Checkbox,
  Pagination,
  Message
} from 'antd';
import ReactEcharts from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/calendar';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import graphic from 'echarts/lib/util/graphic.js';
import Notification from '../../../utils/notification';
import { autobind } from 'core-decorators';
import styles from './#{pageName}#.m.scss';

//页面容器组件
@inject('store')
@observer
@registerTmpl('#{pageName | capitalize}#')
export default class #{pageName | capitalize}# extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.onSearch();
  }

  @autobind
  onSearch() {
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      this.props.store.#{pageName}#.getSummaryData(),
      this.props.store.#{pageName}#.getGrowthData(),
      this.props.store.#{pageName}#.getSubCategoryData(),
      this.props.store.#{pageName}#.getBarSubCategoryData(),
      this.props.store.#{pageName}#.getTableSubCategoryData(),
      this.props.store.#{pageName}#.getBrandCompareList(),
      this.props.store.#{pageName}#.getBrandCompareItemForCategory()
    ]).then(() => {
      this.props.store.#{pageName}#.clearCompareDockData();
      closeLoading();
    });
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <div className={styles.#{pageName}#}>
        <div className={styles.bePageCnt}>
          <h2 className={styles.pageTitle}>Summary</h2>
          <EvalSummary />

          <h3 className={styles.pageSubTitle}>Total Compare</h3>
          <TotalCompare />

          <CategoryCompare />

          <h3 className={styles.pageSubTitle}>Compare Dock</h3>
          <BrandCompare />

          <CompareDock />
        </div>
      </div>
    );
  }
}

@inject('store')
@observer
class EvalSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() { }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <Row className={styles.summary}>
        <Col span={6}>
          <div className={styles.summaryItem}>
            <div className={styles.field}>指标1</div>
            <div className={styles.num}>{(#{pageName}#.summaryData.gmv / 10000).toFixed(2)}万元</div>
            <div className={`${styles.rates} clearfix`}>
              <div className={`${#{pageName}#.summaryData.gmvYOY > 0 ? styles.red : styles.green} fl`}>
                <div>同比</div>
                <div>{#{pageName}#.summaryData.gmvYOY > 0 ? '+' : ''}{#{pageName}#.summaryData.gmvYOY}%</div>
              </div>
              <div className={`${#{pageName}#.summaryData.gmvMOM > 0 ? styles.red : styles.green} fr`}>
                <div>环比</div>
                <div>{#{pageName}#.summaryData.gmvMOM > 0 ? '+' : ''}{#{pageName}#.summaryData.gmvMOM}%</div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryItem}>
            <div className={styles.field}>指标2</div>
            <div className={styles.num}>{#{pageName}#.summaryData.uv}</div>
            <div className={`${styles.rates} clearfix`}>
              <div className={`${#{pageName}#.summaryData.uvYOY > 0 ? styles.red : styles.green} fl`}>
                <div>同比</div>
                <div>{#{pageName}#.summaryData.uvYOY > 0 ? '+' : ''}{#{pageName}#.summaryData.uvYOY}%</div>
              </div>
              <div className={`${#{pageName}#.summaryData.uvMOM > 0 ? styles.red : styles.green} fr`}>
                <div>环比</div>
                <div>{#{pageName}#.summaryData.uvMOM > 0 ? '+' : ''}{#{pageName}#.summaryData.uvMOM}%</div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryItem}>
            <div className={styles.field}>指标3</div>
            <div className={styles.num}>{#{pageName}#.summaryData.uvRates}%</div>
            <div className={`${styles.rates} clearfix`}>
              <div className={`${#{pageName}#.summaryData.uvRatesYOY > 0 ? styles.red : styles.green} fl`}>
                <div>同比</div>
                <div>{#{pageName}#.summaryData.uvRatesYOY > 0 ? '+' : ''}{#{pageName}#.summaryData.uvRatesYOY}%</div>
              </div>
              <div className={`${#{pageName}#.summaryData.uvRatesMOM > 0 ? styles.red : styles.green} fr`}>
                <div>环比</div>
                <div>{#{pageName}#.summaryData.uvRatesMOM > 0 ? '+' : ''}{#{pageName}#.summaryData.uvRatesMOM}%</div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryItem}>
            <div className={styles.field}>指标4</div>
            <div className={styles.num}>{#{pageName}#.summaryData.userCount}</div>
            <div className={`${styles.rates} clearfix`}>
              <div className={`${#{pageName}#.summaryData.userCountYOY > 0 ? styles.red : styles.green} fl`}>
                <div>同比</div>
                <div>{#{pageName}#.summaryData.userCountYOY > 0 ? '+' : ''}{#{pageName}#.summaryData.userCountYOY}%</div>
              </div>
              <div className={`${styles.red} fr`}>
                <div>环比</div>
                <div>{#{pageName}#.summaryData.userCountMOM > 0 ? '+' : ''}{#{pageName}#.summaryData.userCountMOM}%</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

@inject('store')
@observer
class TotalCompare extends Component {

  @observable switchIndex = 'a';

  @observable showMode = '';

  componentDidMount() {
    this.showMode = true;
  }

  @computed get salesOptions() {
    return {
      grid: {
        left: '0',
        right: '4%',
        top: '15%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: this.showMode === null ? ['属性1'] : ['属性1', '属性2']
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: (params) => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function (item) {
            result += `<div>
                           <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                           <span>${item.seriesName}:</span>
                           <span>${item.data || '--'}</span>
                       </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: toJS(this.props.store.#{pageName}#.salesData && this.props.store.#{pageName}#.salesData[2])
      },
      yAxis: {
        show: false,
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        }
      },
      series: this.salesData
    };
  }

  @computed get salesData() {
    const lineData = toJS(this.props.store.#{pageName}#.salesData && this.props.store.#{pageName}#.salesData[1].map(item => (item / 10000).toFixed(2)));
    return [{
      name: '属性1',
      type: 'bar',
      barWidth: '30px',
      data: toJS(this.props.store.#{pageName}#.salesData && this.props.store.#{pageName}#.salesData[0].map(item => (item / 10000).toFixed(2)))
    },
    {
      name: '属性2',
      type: 'line',
      data: this.showMode === null ? [] : lineData
    }
    ];
  };

  @computed get salesRatesOptions() {
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: this.showMode === null ? ['属性1'] : ['属性1', '属性2']
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: (params) => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function (item) {
            result += `<div>
                           <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                           <span>${item.seriesName}:</span>
                           <span>${item.data || '--'}%</span>
                       </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: toJS(this.props.store.#{pageName}#.salesRatesData && this.props.store.#{pageName}#.salesRatesData[2])
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: '{value}%'
        }
      },
      series: this.salesRatesData
    };
  };

  @computed get salesRatesData() {
    const lineData = toJS(this.props.store.#{pageName}#.salesRatesData && this.props.store.#{pageName}#.salesRatesData[1].map(item => (item * 100).toFixed(2)));
    return [{
      name: '属性1',
      type: 'line',
      data: toJS(this.props.store.#{pageName}#.salesRatesData && this.props.store.#{pageName}#.salesRatesData[0].map(item => (item * 100).toFixed(2)))
    },
    {
      name: '属性2',
      type: 'line',
      data: this.showMode === null ? [] : lineData
    }
    ];
  };

  @computed get growthOptions() {
    let dataX = [],
      unit = '';

    switch (this.switchIndex) {
      case 'a':
        dataX = toJS(this.props.store.#{pageName}#.growthDataUV && this.props.store.#{pageName}#.growthDataUV[2]);
        unit = '%';
        break;
      case 'b':
        dataX = toJS(this.props.store.#{pageName}#.growthDataUVConvert && this.props.store.#{pageName}#.growthDataUVConvert[2]);
        unit = '%';
        break;
      case 'c':
        dataX = toJS(this.props.store.#{pageName}#.growthDataUser && this.props.store.#{pageName}#.growthDataUser[2]);
        unit = '%';
        break;
      case 'd':
        dataX = toJS(this.props.store.#{pageName}#.growthDataPrice && this.props.store.#{pageName}#.growthDataPrice[2]);
        unit = '';
        break;
    }

    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: this.showMode === null ? ['属性1'] : ['属性1', '属性2']
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: (params) => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function (item) {
            result += `<div>
                            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                            <span>${item.seriesName}:</span>
                            <span>${item.data || '--'}${unit}</span>
                        </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: dataX
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: `{value}${unit}`
        }
      },
      series: this.growthData
    };
  };

  @computed get growthData() {
    let data1 = [],
      data2 = [];
    switch (this.switchIndex) {
      case 'a':
        data1 = toJS(this.props.store.#{pageName}#.growthDataUV && this.props.store.#{pageName}#.growthDataUV[0].map(item => (item * 100).toFixed(2)));
        data2 = toJS(this.props.store.#{pageName}#.growthDataUV && this.props.store.#{pageName}#.growthDataUV[1].map(item => (item * 100).toFixed(2)));
        break;
      case 'b':
        data1 = toJS(this.props.store.#{pageName}#.growthDataUVConvert && this.props.store.#{pageName}#.growthDataUVConvert[0].map(item => (item * 100).toFixed(2)));
        data2 = toJS(this.props.store.#{pageName}#.growthDataUVConvert && this.props.store.#{pageName}#.growthDataUVConvert[1].map(item => (item * 100).toFixed(2)));
        break;
      case 'c':
        data1 = toJS(this.props.store.#{pageName}#.growthDataUser && this.props.store.#{pageName}#.growthDataUser[0].map(item => (item * 100).toFixed(2)));
        data2 = toJS(this.props.store.#{pageName}#.growthDataUser && this.props.store.#{pageName}#.growthDataUser[1].map(item => (item * 100).toFixed(2)));
        break;
      case 'd':
        data1 = toJS(this.props.store.#{pageName}#.growthDataPrice && this.props.store.#{pageName}#.growthDataPrice[0].map(item => (item).toFixed(2)));
        data2 = toJS(this.props.store.#{pageName}#.growthDataPrice && this.props.store.#{pageName}#.growthDataPrice[1].map(item => (item).toFixed(2)));
        break;
    }
    return [{
      name: '属性1',
      type: 'line',
      data: data1
    },
    {
      name: '属性2',
      type: 'line',
      data: this.showMode === null ? [] : data2
    }
    ];
  };

  constructor(props) {
    super(props);
  }

  @autobind
  onGrowthTypeChange(e) {
    this.switchIndex = e.target.value;
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <Row className={styles.totalCompare}>
        <Col span={12}>
          <div className={styles.leftBlock}>
            <div className={styles.chartTit}>指标1趋势</div>
            <ReactEcharts echarts={echarts}
                          option={toJS(this.salesOptions)}
                          notMerge={true}
                          ref="ecSales" />
            <div className={styles.chartTit}>指标1同比增长率趋势</div>
            <ReactEcharts echarts={echarts}
                          option={toJS(this.salesRatesOptions)}
                          notMerge={true}
                          ref="ecSalesRates" />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.rightBlock}>
            <div className={styles.chartTit}>指标2趋势</div>
            <table>
              <thead>
                <tr>
                  <th>指标1</th>
                  <th>指标2</th>
                  <th>指标3</th>
                  <th>指标4</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.row1}>
                  <td>{n`${#{pageName}#}.growthDataTable[0][0] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[0][0] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[0][1] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[0][1] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[0][3] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[0][3] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[0][2].toFixed(2) || '--'`}元</td>
                </tr>
                <tr className={styles.row2}>
                  <td>{n`${#{pageName}#}.growthDataTable[1][0] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[1][0] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[1][1] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[1][1] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[1][3] > 0` ? '+' : ''}{n`${#{pageName}#}.growthDataTable[1][3] | percent(2) || '--'`}</td>
                  <td>{n`${#{pageName}#}.growthDataTable[1][2].toFixed(2) || '--'`}元</td>
                </tr>
              </tbody>
            </table>
            <Radio.Group defaultValue="a" size="default" onChange={this.onGrowthTypeChange}>
              <Radio.Button value="a">指标1</Radio.Button>
              <Radio.Button value="b">指标2</Radio.Button>
              <Radio.Button value="c">指标3</Radio.Button>
              <Radio.Button value="d">指标4</Radio.Button>
            </Radio.Group>
            <ReactEcharts echarts={echarts}
                          option={toJS(this.growthOptions)}
                          notMerge={true}
                          ref="ecGrowth" />
          </div>
        </Col>
      </Row>
    );
  }
}

@inject('store')
@observer
class CategoryCompare extends Component {

  @observable currentView = 1; // 1:'chart' | 2:'table'

  @computed get pieCategoryOptions() {
    return {
      grid: {
        left: '3%',
        right: '3%',
        top: 0,
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        // formatter: "{a} <br/>{b} : {c} ({d}%)",
        formatter: function (params) {
          var result = `<div>${params.name}</div>`;
          result += `<div>
                              <span>${params.seriesName}:</span>
                              <span>${params.seriesName == '属性2' ? '' : '(' + params.data.value + ')'} ${params.percent}%</span>
                          </div>`;
          return result;
        }
      },
      toolbox: { show: false },
      legend: {
        left: 'center',
        data: toJS(this.props.store.#{pageName}#.pieSubCategoryData && this.props.store.#{pageName}#.pieSubCategoryData[2])
      },
      series: this.pieCategoryData
    };
  };

  @computed get pieCategoryData() {
    let _data1 = [],
      _data2 = [];
    if (this.props.store.#{pageName}#.pieSubCategoryData) {
      this.props.store.#{pageName}#.pieSubCategoryData[0].forEach((item, i) => {
        _data1.push({
          value: (item / 10000).toFixed(2),
          name: this.props.store.#{pageName}#.pieSubCategoryData[2][i]
        });
      });
      this.props.store.#{pageName}#.pieSubCategoryData[1].forEach((item, i) => {
        _data2.push({
          value: (item / 10000).toFixed(2),
          name: this.props.store.#{pageName}#.pieSubCategoryData[2][i]
        });
      });
    }

    return [{
      name: '属性2',
      type: 'pie',
      radius: '40%',
      center: ['25%', '50%'],
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      lableLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data: _data1,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    },
    {
      name: '属性1',
      type: 'pie',
      radius: '40%',
      center: ['75%', '50%'],
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      lableLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data: _data2,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
    ];
  };

  @computed get barCategoryOptions() {
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: ['属性1', '属性2']
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          rotate: 30,
          interval: 0
        },
        data: toJS(this.props.store.#{pageName}#.barSubCategoryData && this.props.store.#{pageName}#.barSubCategoryData[2])
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: '{value}%'
        }
      },
      series: this.barCategoryData
    };
  };

  @computed get barCategoryData() {
    return [{
      name: '属性1',
      type: 'bar',
      data: toJS(this.props.store.#{pageName}#.barSubCategoryData && this.props.store.#{pageName}#.barSubCategoryData[0].map(item => (item * 100).toFixed(2)))
    },
    {
      name: '属性2',
      type: 'bar',
      data: toJS(this.props.store.#{pageName}#.barSubCategoryData && this.props.store.#{pageName}#.barSubCategoryData[1].map(item => (item * 100).toFixed(2)))
    }
    ];
  };

  @autobind
  switchView(index) {
    return (e) => {
      this.currentView = index;
    };
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <div className={styles.categoryCompareWrap}>
        <h3 className={styles.pageSubTitle}>
          <div className={`${styles.toolsBar} fr`}>
          </div>
          <span>Category Compare</span>
        </h3>
        <if condition={#{pageName}#.showSubCategoryBlock}>
          <div className={styles.subCategoryBlock}>
            <Row className={`${styles.categoryCompare} ${this.currentView == 1 ? styles.showCategoryCompare : ''}`} gutter={30}>
              <Col span={12}>
                <div className={styles.tit}>指标1占比分布对比</div>
                <ReactEcharts echarts={echarts}
                              option={toJS(this.pieCategoryOptions)}
                              notMerge={true}
                              ref="ecPieCategory" />
                <Row className="tc">
                  <Col span={12}>属性1</Col>
                  <Col span={12}>属性2</Col>
                </Row>
              </Col>
              <Col span={12}>
                <div className={styles.tit}>指标1增长率对比</div>
                <ReactEcharts echarts={echarts}
                              option={toJS(this.barCategoryOptions)}
                              notMerge={true}
                              ref="ecBarCategory" />
              </Col>
            </Row>
            <div className={`${styles.tableWrap} ${this.currentView != 1 ? styles.showTableWrap : ''}`}>
              <table>
                <thead>
                  <tr>
                    <th rowSpan="2">属性1</th>
                    <th rowSpan="2">属性2</th>
                    <th colSpan="7">属性3</th>
                    <th colSpan="6">属性4</th>
                  </tr>
                  <tr>
                    <th>指标1</th>
                    <th>指标2</th>
                    <th>指标3</th>
                    <th>指标4</th>
                    <th>指标5</th>
                    <th>指标6</th>
                    <th>指标7</th>
                    <th>指标8</th>
                    <th>指标9</th>
                    <th>指标10</th>
                    <th>指标11</th>
                    <th>指标12</th>
                    <th>指标13</th>
                  </tr>
                </thead>
                <tbody>
                  <each of={#{pageName}#.tableSubCategoryData}>
                    <tr key={index}>
                      <td><span>{item.rank}</span></td>
                      <td>{item.name}</td>
                      <td>{(item.salesAmount / 10000).toFixed(2)}</td>
                      <td>{(item.salesRates * 100).toFixed(2)}%</td>
                      <td>{(item.salesGrowthRates * 100).toFixed(2)}%</td>
                      <td>{(item.uvGrowth * 100).toFixed(2)}%</td>
                      <td>{(item.uvConvert * 100).toFixed(2)}%</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{(item.userGrowth * 100).toFixed(2)}%</td>
                      <td>{(item.salesRates1 * 100).toFixed(2)}%</td>
                      <td>{(item.salesGrowthRates1 * 100).toFixed(2)}%</td>
                      <td>{(item.uvGrowth1 * 100).toFixed(2)}%</td>
                      <td>{(item.uvConvert1 * 100).toFixed(2)}%</td>
                      <td>{item.price1.toFixed(2)}</td>
                      <td>{(item.userGrowth1 * 100).toFixed(2)}%</td>
                    </tr>
                  </each>
                </tbody>
              </table>
            </div>
          </div>
        </if>
      </div>
    );
  }
}

@inject('store')
@observer
class BrandCompare extends Component {

  @observable trendsChartVisible = false;
  @observable trendsChartDataX = [];
  @computed get trendsChartOptions() {
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: [this.showMode != null ? '属性2增长率' : null, '属性1增长率', '指标1']
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: (params) => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach((item) => {
            result += `<div>
                           <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                           <span>${item.seriesName}:</span>
                           <span>${item.data || '--'}${item.seriesName == '指标1' ? '' : '%'}</span>
                       </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: toJS(this.trendsChartDataX)
      },
      yAxis: [{
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        }
      },
      {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        }
      }
      ],
      series: this.trendsChartData
    };
  };

  @computed get trendsChartData() {
    return [{
      name: '属性2增长率',
      type: 'line',
      data: [],
      yAxisIndex: 1
    },
    {
      name: '属性1增长率',
      type: 'line',
      data: [],
      yAxisIndex: 1
    },
    {
      name: '指标1',
      type: 'bar',
      barWidth: '50px',
      data: []
    }
    ];
  }

  @observable trendsChartTop = 1;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.showMode = true;
  }

  @autobind
  onBrandChecked(item) {
    return (e) => {
      if (e.target.checked) {
        this.props.store.#{pageName}#.setCompareDockVisible(true);
        if (this.props.store.#{pageName}#.compareDockData) {
          if (this.props.store.#{pageName}#.compareDockData.length + 1 < 5) {
            this.props.store.#{pageName}#.setChecked(item, true);
            this.props.store.#{pageName}#.setCompareDockData(item);
          } else {
            e.target.checked = false;
            Notification.error({ description: '最多可以对比三个品牌', duration: 2 });
          }
        } else {
          this.props.store.#{pageName}#.setChecked(item, true);
          this.props.store.#{pageName}#.setCompareDockData(item);
        }
      } else {
        this.props.store.#{pageName}#.setChecked(item, false);
        this.props.store.#{pageName}#.removeCompareDockData(item);
      }
    };
  }

  @autobind
  viewTrends(item, index) {
    return (e) => {
      this.trendsChartTop = index * 135 + index + 1 + (15 * index);
      setTimeout(() => {
        this.trendsChartVisible = true;
        this.trendsChartData[0].data = this.showMode === null ? [] : toJS(item.trendsData[0].map(item => parseFloat((item * 100).toFixed(2))));
        this.trendsChartData[1].data = toJS(item.trendsData[1].map(item => parseFloat((item * 100).toFixed(2))));
        this.trendsChartData[2].data = toJS(item.trendsData[2].map(item => parseFloat((item / 10000).toFixed(2))));
        this.trendsChartDataX = toJS(item.trendsData[3]);
      }, 300);
    };
  }

  @autobind
  closeTrendsChart() {
    this.trendsChartVisible = false;
  }

  @autobind
  closeCompareTable() {
    this.props.store.#{pageName}#.setShowCompareTable(false);
    this.props.store.#{pageName}#.clearCompareDockData();
  }

  @autobind
  onPaging(page, pageSize) {
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      this.props.store.#{pageName}#.getBrandCompareList()
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <div className={styles.brandCompareList}>
        <div className={`${styles.trendsChart} ${this.trendsChartVisible ? styles.trendsChartShow : ''}`} style={{ top: `${this.trendsChartTop}px` }}>
          <span className={styles.trendsChartClose} onClick={this.closeTrendsChart}>X</span>
          <ReactEcharts echarts={echarts}
                        option={toJS(this.trendsChartOptions)}
                        notMerge={true}
                        ref="ecTrendsChart" />
        </div>
        <if condition={#{pageName}#.showCompareTable}>
          <div className={styles.compareTable}>
            <div className={styles.compareTableTitle}>
              <span className={styles.compareTableClose} onClick={this.closeCompareTable}>X</span>
              Brand Compare
            </div>
            <table>
              <thead>
                <tr>
                  <th>指标1</th>
                  <each of={#{pageName}#.compareDockData}>
                    <th key={index}>{item.brandName}</th>
                  </each>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>指标2</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.salesAmountGrowth | percent(2)`}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标3</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.userGrowth | percent(2)`}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标4</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.uvGrowth | percent(2)`}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标5</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{item.price || '--'}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标6</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{item.salesAmount || '--'}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标7</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.salesAmountRates | percent(2)`}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标8</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{item.userCount || '--'}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标9</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.userCountRates | percent(2)`}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标10</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{item.uv || '--'}</td>
                  </each>
                </tr>
                <tr>
                  <td>指标11</td>
                  <each of={#{pageName}#.compareDockData}>
                    <td key={index}>{n`${item}.uvRates | percent(2)`}</td>
                  </each>
                </tr>
              </tbody>
            </table>
          </div>
          <else>
            <div className={styles.brandCompareItemWrap}>
              <each of={#{pageName}#.brandCompareList}>
                <Row className={styles.brandCompareItem} key={index}>
                  <span className={styles.rank}>{item.rank}<em></em></span>
                  <Col span={2}>
                  </Col>
                  <Col span={4}>
                    <div><Checkbox onChange={this.onBrandChecked(item)} checked={item.isChecked}>加入对比</Checkbox></div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.brandText}>{item.brandName}</div>
                    <div>指标1：{item.salesAmount.toFixed(2)}万元</div>
                    <Row>
                      <Col span={12}>
                        <div>指标1同比增长：{n`${item}.uvGrowth | percent(2)`}</div>
                        <div>指标2转化率：{n`${item}.uvConversion | percent(2)`}</div>
                      </Col>
                      <Col span={12}>
                        <div>指标3同比增长：{n`${item}.userGrowth | percent(2)`}</div>
                        <div>指标4：{item.price.toFixed(2)}元</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <div className={styles.salesGrowthText}>指标1同比增长：{n`${item}.salesAmountGrowth | percent(2)`}</div>
                    <div>指标2同比增长率：{n`${item}.categoryGrowth | percent(2)`}</div>
                    <div>
                      <Button onClick={this.viewTrends(item, index)}>查看趋势</Button>
                    </div>
                  </Col>
                </Row>
              </each>
              <div className={styles.paginationWrap}>
                <Pagination defaultCurrent={1} total={#{pageName}#.brandCompareListTotalCount} onChange={this.onPaging} />
              </div>
            </div>
          </else>
        </if>
      </div>
    );
  }
}

@inject('store')
@observer
class CompareDock extends Component {
  @autobind
  deleteCompareItem(item) {
    return (e) => {
      this.props.store.#{pageName}#.removeCompareDockData(item);
      this.props.store.#{pageName}#.setChecked(item, false);
    };
  }

  @autobind
  closeCompareDock() {
    this.props.store.#{pageName}#.setCompareDockVisible(false);
  }

  @autobind
  compareIt() {
    this.props.store.#{pageName}#.setShowCompareTable(true);
    this.props.store.#{pageName}#.setCompareDockVisible(false);
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <div className={`${styles.compareDock} ${#{pageName}#.compareDockVisible ? styles.compareDockShow : ''}`}>
        <div className={styles.compareDockTit}>
          <span className={styles.compareDockClose} onClick={this.closeCompareDock}>X</span>
          <span>Compare Dock</span>
        </div>
        <Row>
          <each of={#{pageName}#.compareDockData}>
            <if condition={item.id != 0}>
              <Col span={6} key={index}>
                <span className={styles.iconDeleteCompareItem} onClick={this.deleteCompareItem(item)}>X</span>
                <Row>
                  <Col span={12}>
                  </Col>
                  <Col span={12}>
                    <div>排名：{item.rank}</div>
                    <div>指标1增长率：{n`${item}.salesAmountGrowth | percent(2)`}</div>
                    <div className={styles.name}>{item.brandName}</div>
                  </Col>
                </Row>
              </Col>
            </if>
          </each>
          <Col span={6} className="tc">
            <Button onClick={this.compareIt}>开始对比</Button>
          </Col>
        </Row>
      </div>
    );
  }
}