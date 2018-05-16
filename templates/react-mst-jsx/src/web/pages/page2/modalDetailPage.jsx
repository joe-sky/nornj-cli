import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import Table from 'flarej/lib/components/antd/table';
import Input from 'flarej/lib/components/antd/input';
import Button from 'flarej/lib/components/antd/button';
import Pagination from 'flarej/lib/components/antd/pagination';
import Tabs from 'flarej/lib/components/antd/tabs';
import Checkbox from 'flarej/lib/components/antd/checkbox';
import Modal from 'flarej/lib/components/antd/modal';
import Tree from 'flarej/lib/components/antd/tree';
import Message from 'flarej/lib/components/antd/message';
import Notification from '../../../utils/notification';
import styles from './page2.m.scss';

@inject('store')
@observer
export default class ModalDetailPage extends Component {
  @autobind
  onDetailModalCancel() {
    const { store: { page2 } } = this.props;
    page2.setDetailModalVisible(false);
  }

  @computed get detailColumns() {
    return [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '登录名',
      dataIndex: 'loginName',
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '邮箱',
      dataIndex: 'email',
    }, {
      title: '部门',
      dataIndex: 'department',
    }, {
      title: '职务',
      dataIndex: 'duty',
    }, {
      title: '开通时间',
      dataIndex: 'oTime',
    }];
  }

  render() {
    const { store: { page2 } } = this.props;

    return (
      <Modal width={800} visible={page2.detailModalVisible} footer={null} onCancel={this.onDetailModalCancel} title={<div className={styles.modalTitle}>用户明细</div>}>
        <Table pagination={true} columns={toJS(this.detailColumns)} dataSource={toJS(page2.detailData)} rowKey={(record, index) => `${record.key}-${index}`} bordered />
      </Modal>
    );
  }
}