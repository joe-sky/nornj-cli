import React, { Component } from 'react';
import { observer } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import '../../common/containerConfig';
import 'flarej/lib/components/antd/button';
import 'flarej/lib/components/antd/breadcrumb';
import 'vic-common/lib/components/dataGrid';
import { Message } from 'flarej/lib/components/antd/message';
import { autobind } from 'core-decorators';
import '../../components/header';
import '../../components/sider';
import styles from './page1.m.less';
import tmpls from './page1.t.html';
import Page1Store from '../../stores/Page1Store';
const page1Store = new Page1Store();

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
      page1Store
    });
  }
}

@observer
@registerTmpl('vicb-DataTable')
class DataTable extends Component {
  state = {
    columns: [{
      title: '测试1',
      dataIndex: 'test1',
      key: 'test1',
    }, {
      title: '测试2',
      dataIndex: 'test2',
      key: 'test2',
    }, {
      title: '测试3',
      dataIndex: 'test3',
      key: 'test3',
      children: [{
        title: '测试4',
        dataIndex: 'test4',
        key: 'test4',
      }, {
        title: '测试5',
        dataIndex: 'test5',
        key: 'test5',
      }, {
        title: '测试6',
        dataIndex: 'test6',
        key: 'test6',
      }]
    }, {
      title: '测试7',
      dataIndex: 'test7',
      key: 'test7',
      children: [{
        title: '测试8',
        dataIndex: 'test8',
        key: 'test8',
      }, {
        title: '测试9',
        dataIndex: 'test9',
        key: 'test9',
      }, {
        title: '测试10',
        dataIndex: 'test10',
        key: 'test10',
      }, {
        title: '测试11',
        dataIndex: 'test11',
        key: 'test11',
      }, {
        title: '测试12',
        dataIndex: 'test12',
        key: 'test12',
      }]
    }, {
      title: '测试13',
      dataIndex: 'test13',
      key: 'test13',
      children: [{
        title: '测试14',
        dataIndex: 'test14',
        key: 'test14',
      }, {
        title: '测试15',
        dataIndex: 'test15',
        key: 'test15',
      }, {
        title: '测试16',
        dataIndex: 'test16',
        key: 'test16',
      }, {
        title: '测试17',
        dataIndex: 'test17',
        key: 'test17',
      }, {
        title: '测试18',
        dataIndex: 'test18',
        key: 'test18',
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