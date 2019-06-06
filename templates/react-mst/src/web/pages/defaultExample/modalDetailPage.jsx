import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
  Table,
  Input,
  Button,
  Pagination,
  Tabs,
  Checkbox,
  Modal,
  Tree,
  message
} from 'nornj-react/antd';
import Notification from '../../../utils/notification';
import styles from './defaultExample.m.scss';

@inject('store')
@observer
export default class ModalDetailPage extends Component {
  onDetailModalCancel = () => {
    const { store: { defaultExample } } = this.props;
    defaultExample.setDetailModalVisible(false);
  };

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
    const { store: { defaultExample } } = this.props;

    return (
      <Modal width={800} visible={defaultExample.detailModalVisible} footer={null} onCancel={this.onDetailModalCancel} title={<div className={styles.modalTitle}>用户明细</div>}>
        <Table pagination={true} columns={toJS(this.detailColumns)} dataSource={toJS(defaultExample.detailData)} rowKey={(record, index) => `${record.key}-${index}`} bordered />
      </Modal>
    );
  }
}