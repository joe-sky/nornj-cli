import React, { Component } from 'react';
import { observer } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import '../../common/containerConfig';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/breadcrumb';
import 'vic-common/lib/components/dataGrid';
import { Message } from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import '../../components/header';
import '../../components/sider';
import styles from './page2.m.less';
import tmpls from './page2.t.html';
import Page2Store from '../../stores/Page2Store';
const page2Store = new Page2Store();

//页面容器组件
@observer
@registerTmpl('Container')
class Container extends Component {
  componentDidMount() {
    //删除加载loading层
    $('#vic_loading_main').remove();
    $('#vic_loading-mask_main').fadeOut(200, function() {
      $(this).remove();
    });
  }

  render() {
    return this.props.tmpls[0](this, {
      styles,
      page2Store
    });
  }
}

@observer
@registerTmpl('vicb-DataTable')
class DataTable extends Component {
  state = {
    columns: [{
      title: '供应商简码',
      dataIndex: 'vendorCode',
      key: 'vendorCode',
    }, {
      title: '供应商名称',
      dataIndex: 'vendorName',
      key: 'vendorName',
    }, {
      title: '交付能力',
      dataIndex: 'jiaofu',
      key: 'jiaofu',
      children: [{
        title: '订单满足率',
        dataIndex: 'orderReachRate',
        key: 'orderReachRate',
      }, {
        title: '接受的确认率',
        dataIndex: 'orderConfirmRate',
        key: 'orderConfirmRate',
      }, {
        title: '订单履约率',
        dataIndex: 'orderFailureRate',
        key: 'orderFailureRate',
      }]
    }, {
      title: '供货及时性',
      dataIndex: 'gonghuo',
      key: 'gonghuo',
      children: [{
        title: '总体交货周期（天）',
        dataIndex: 'deliveryGoodsCycle',
        key: 'deliveryGoodsCycle',
      }, {
        title: '总交货周期标准方差',
        dataIndex: 'deliveryGoodsCycleDisparity',
        key: 'deliveryGoodsCycleDisparity',
      }, {
        title: '提交到确认时间（天）',
        dataIndex: 'timeDifference1',
        key: 'timeDifference1',
      }, {
        title: '供应商准备时间（天）',
        dataIndex: 'timeDifference2',
        key: 'timeDifference2',
      }, {
        title: '收货时间（天）',
        dataIndex: 'timeDifference3',
        key: 'timeDifference3',
      }]
    }, {
      title: '商品与服务指标',
      dataIndex: 'shangpin',
      key: 'shangpin',
      children: [{
        title: '返修率',
        dataIndex: 'serviceTarget1',
        key: 'serviceTarget1',
      }, {
        title: '差评率',
        dataIndex: 'serviceTarget2',
        key: 'serviceTarget2',
      }, {
        title: '客服在线时长（小时）',
        dataIndex: 'serviceTarget3',
        key: 'serviceTarget3',
      }, {
        title: '客服满意度',
        dataIndex: 'serviceTarget4',
        key: 'serviceTarget4',
      }, {
        title: '已完成采购金额（元）',
        dataIndex: 'serviceTarget5',
        key: 'serviceTarget5',
      }]
    }]
  };

  @autobind
  onPageChange(pageIndex, pageSize, isInit) {
    // if (isInit) {
    //   return;
    // }
    
    const closeLoading = Message.loading('正在加载数据...', 0);
    this.props.store.getTableData(pageIndex, pageSize).then(() => closeLoading());
  }

  render() {
    return tmpls.dataTable(this.state, this.props, this, { styles });
  }
}

if (module.hot) {
  module.hot.accept();
  njr.renderTmplTag({ target: '#container' });
}