import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import { Table, Input, Button, Pagination, Tabs, Checkbox, Modal, Tree, Message } from 'antd';
import Notification from '../../../utils/notification';
import styles from './page1.m.scss';
import ModalFormPage from './modalFormPage.jsx';
import ModalDetailPage from './modalDetailPage.jsx';

//页面容器组件
@registerTmpl('Page1')
@inject('store')
@observer
export default class Page1 extends Component {
  @observable detailModalVisible = false;
  @observable inputRole = '';
  @observable detailData = [];
  @observable selectedRowKeys = [];
  @observable selectedRows = [];

  componentDidMount() {
    const {
      store: { page1 }
    } = this.props;

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([page1.getRoleManagementData(), page1.getRoleMenuTree().then(() => page1.initTree())]).then(() => {
      closeLoading();
    });
  }

  @autobind
  onSearch() {
    if (this.inputRole == '') {
      const closeLoading = Message.loading('正在获取数据...', 0);
      Promise.all([this.props.store.page1.getRoleManagementData()]).then(() => {
        closeLoading();
      });
    } else {
      const {
        store: { page1 }
      } = this.props;
      const searchRole = page1.tableDataO.filter(n => n.name.indexOf(this.inputRole.trim()) > -1);
      page1.setTableData(searchRole);
    }
  }

  @autobind
  onAddRole() {
    const {
      store: { page1 }
    } = this.props;
    page1.setAddModalVisible(true);
    page1.setDisable(true);
    page1.setActiveKey('tab1');
    page1.setAddInputRole('');
    page1.setAddInputDes('');
  }

  @autobind
  onDeleteRole() {
    const {
      store: { page1 }
    } = this.props;
    if (this.selectedRowKeys.length == 0) {
      Notification.error({ description: '请勾选要删除的角色！', duration: 3 });
    } else {
      Modal.confirm({
        title: '你确认要删除角色吗？',
        onOk: () => {
          const closeLoading = Message.loading('正在获取数据...', 0);
          const roleId = this.selectedRows.map(item => item.roleId);

          Promise.all([page1.deleteRole({ roleId: roleId })])
            .then(() => {
              page1.getRoleManagementData();
            })
            .then(() => {
              this.selectedRowKeys = [];
              closeLoading();
            });
        }
      });
    }
  }

  @computed
  get tableColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'key'
      },
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '角色描述',
        dataIndex: 'describe'
      },
      {
        title: '创建时间',
        dataIndex: 'cTime'
      },
      {
        title: '修改时间',
        dataIndex: 'mTime'
      },
      {
        title: '操作',
        dataIndex: 'handler',
        render: (text, record, index) => (
          <span>
            <a href="javascript:;" onClick={() => this.onEdit(record, index)} className="btn-link">
              编辑
            </a>
            <a href="javascript:;" onClick={() => this.onDetail(record, index)} className="btn-link">
              用户明细
            </a>
          </span>
        )
      }
    ];
  }

  @autobind
  onEdit(record, index) {
    const {
      store: { page1 }
    } = this.props;
    page1.setEditModalVisible(true);
    page1.setSaveBtnDisabled(true);
    page1.setActiveKey('tab1');
    page1.setAddInputRole(record.name);
    page1.setAddInputDes(record.describe);
    page1.setRoleId(record.roleId);
    page1.setDisable(false);

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([page1.getRoleMenuTree({ roleId: record.roleId }).then(() => page1.initTree())]).then(() => {
      closeLoading();
    });
  }

  @autobind
  onDetail(record, index) {
    const {
      store: { page1 }
    } = this.props;
    page1.setDetailModalVisible(true);
    page1.setDetailData(record.users);
  }

  getRowSelection() {
    return {
      selectedRowKeys: this.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      }
    };
  }

  render() {
    const {
      store: { page1 }
    } = this.props;

    return (
      <div className={styles.page1}>
        <h2>角色管理 page1</h2>
        <div className={styles.handlerBox}>
          <span className={styles.lable}>角色名称</span>
          <Input className={styles.input} n-mobx-model="inputRole" />
          <Button className="btn" onClick={this.onSearch}>
            查询
          </Button>
          <Button className="btn" onClick={this.onAddRole}>
            新增
          </Button>
          <Button className="btn" onClick={this.onDeleteRole}>
            删除
          </Button>
        </div>

        <Table
          rowSelection={this.getRowSelection()}
          columns={toJS(this.tableColumns)}
          dataSource={toJS(page1.tableData)}
          bordered
        />

        <ModalFormPage tabName="增加角色" />
        <ModalFormPage tabName="编辑角色" />
        <ModalDetailPage />
      </div>
    );
  }
}
