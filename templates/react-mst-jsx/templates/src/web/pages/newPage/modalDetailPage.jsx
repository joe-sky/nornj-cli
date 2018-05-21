import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import {
  Table,
  Input,
  Button,
  Pagination,
  Tabs,
  Checkbox,
  Modal,
  Tree,
  Message
} from 'antd';
import Notification from '../../../utils/notification';
import styles from './#{pageName}#.m.scss';

@inject('store')
@observer
export default class ModalDetailPage extends Component {
  @autobind
  onDetailModalCancel() {
    const { store: { #{pageName}# } } = this.props;
    #{pageName}#.setDetailModalVisible(false);
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
    const { store: { #{pageName}# } } = this.props;

    return (
      <Modal width={800} visible={#{pageName}#.detailModalVisible} footer={null} onCancel={this.onDetailModalCancel} title={<div className={styles.modalTitle}>用户明细</div>}>
        <Table pagination={true} columns={toJS(this.detailColumns)} dataSource={toJS(#{pageName}#.detailData)} rowKey={(record, index) => `${record.key}-${index}`} bordered />
      </Modal>
    );
  }
}