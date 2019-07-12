import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import {
  WhiteSpace,
  SearchBar,
  Card,
  List,
  Picker,
  Button,
  WingBlank,
  ListView,
  ActivityIndicator,
  Icon,
  Toast
} from 'antd-mobile';
import Notification from '../../../utils/notification';
import styles from './listExample.m.less';
import { autobind } from 'core-decorators';

const data = [
  {
    applyId: 10000,
    status: 0,
    invoiceContent: '服务费',
    createTime: '2016-08-06'
  },
  {
    applyId: 11000,
    status: 2,
    invoiceContent: '促销费',
    createTime: '2017-09-11'
  },
  {
    applyId: 12000,
    status: 1,
    invoiceContent: '',
    createTime: '2018-10-22'
  },
  {
    applyId: 13000,
    status: 0,
    invoiceContent: '办公用品',
    createTime: '2017-12-12'
  },
  {
    applyId: 14000,
    status: 1,
    invoiceContent: '赞助费',
    createTime: '2018-01-26'
  }
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = pIndex * NUM_SECTIONS + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

@registerTmpl('ListExample')
@inject('store')
@observer
export default class ListExample extends Component {
  componentDidMount() {
    this.props.store.header.setPageTitle(this.props.moduleName);
  }

  componentWillUnmount() {
    sectionIDs = [];
    rowIDs = [];
  }

  render() {
    return (
      <div>
        <ListExampleSearchForm />
        <ListExampleGrid />
        <Button type="primary">
          新建
        </Button>
      </div>
    );
  }
}

@registerTmpl('ListExampleSearchForm')
@inject('store')
@observer
class ListExampleSearchForm extends Component {
  statusDataJson = [
    {
      value: '0',
      label: '已开票'
    },
    {
      value: '1',
      label: '开票中'
    },
    {
      value: '2',
      label: '已作废'
    }
  ];

  @observable
  searchData = {
    selectStatus: null,
    status: null,
    applyId: null
  };

  constructor(props) {
    super(props);
  }

  @autobind
  onStatusChange(val) {
    this.searchData.selectStatus = val;
    console.log('select:' + val);
  }

  @autobind
  onSearchSubmit(val) {
    console.log('input:' + val);
  }

  render() {
    return (
      <Card full>
        <Card.Body>
          <List>
            <SearchBar placeholder="输入开票申请单号" maxLength={20} onSubmit={this.onSearchSubmit} />
            <Picker
              extra="请选择"
              cols={1}
              value={this.searchData.selectStatus}
              data={this.statusDataJson}
              onChange={this.onStatusChange}>
              <List.Item arrow="horizontal">开票状态</List.Item>
            </Picker>
          </List>
        </Card.Body>
      </Card>
    );
  }
}

@registerTmpl('ListExampleGrid')
@inject('store')
@observer
class ListExampleGrid extends Component {
  listViewStyle = {
    height: (document.documentElement.clientHeight * 3) / 4,
    overflow: 'auto'
  };

  listView = {
    dataSource: null,
    isLoading: true
  };

  constructor(props) {
    super(props);

    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4
    };
  }

  componentDidMount() {
    // debugger
    const offsetTop = ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    const offsetBottom = 50;
    const hei = document.documentElement.clientHeight - offsetTop - offsetBottom;
    // simulate initial Ajax
    setTimeout(() => {
      genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei
      });
    }, 600);

    // Toast.loading('loading...');
    // setTimeout(function () {
    //     Toast.hide()
    // },5000);
  }

  onEndReached = event => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false
      });
    }, 1000);
  };

  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} style={{ backgroundColor: '#F5F5F9', height: 5 }} />
    );
    let mapStatus = { '0': '已开票', '1': '开票中', '2': '已作废' };

    const row = (rowData, sectionID, rowID) => {
      const page = parseInt(rowData.split(',')[0].replace(/\D/g, '')) + 1;
      const rowIndex = parseInt(rowData.split(',')[1].replace(/\D/g, ''));
      const obj = data[rowIndex];
      console.dir(obj + '===');
      const newApplyId = parseInt(obj.applyId) + ((page + 1) * 5 + rowIndex);
      const statusLabel = mapStatus[obj.status];
      return (
        <div key={rowID} style={{ padding: '5px', fontSize: '14px', paddingLeft: '15px' }}>
          <div style={{ lineHeight: '35px', borderBottom: '1px solid #e9e9e9' }}>
            <div style={{ fontWeight: 800 }}>
              申请单号：
              {newApplyId}
            </div>
            <div style={{ float: 'right', color: '#ff7f27', paddingRight: '20px' }}>{statusLabel}</div>
          </div>
          <div style={{ lineHeight: '35px', borderBottom: '1px solid #e9e9e9' }}>
            <label>开票内容：</label>
            {obj.invoiceContent}
          </div>
          <div style={{ lineHeight: '35px' }}>
            <label>申请时间：</label>
            {obj.createTime}
          </div>
        </div>
      );
    };

    return (
      <Card full>
        <Card.Body>
          <ListView
            ref={el => (this.lv = el)}
            dataSource={this.state.dataSource}
            //renderHeader={() => <span>header</span>}
            renderFooter={() => (
              <div style={{ padding: 30, textAlign: 'center' }}>{this.state.isLoading ? '加载中...' : ''}</div>
            )}
            // renderSectionHeader={sectionData => (
            //     <div>{`Task ${sectionData.split(' ')[1]}`}</div>
            // )}
            //renderBodyComponent={() => <MyBody />}
            renderRow={row}
            renderSeparator={separator}
            style={{
              height: this.state.height,
              overflow: 'auto'
            }}
            pageSize={5}
            onScroll={() => {
              console.log('scroll');
            }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </Card.Body>
      </Card>
    );
  }
}
