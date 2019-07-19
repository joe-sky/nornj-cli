import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import intl from 'react-intl-universal';
import { Table, Input, Button, Pagination, Tabs, Checkbox, Modal, Tree, message, notification } from 'antd';
import styles from './DefaultExample.m.less';
import ModalFormPage from './ModalFormPage';
import ModalDetailPage from './ModalDetailPage';

@inject('store')
@observer
export default class DefaultExample extends Component {
  @observable detailModalVisible = false;
  @observable inputRole = '';
  @observable detailData = [];
  @observable selectedRowKeys = [];
  @observable selectedRows = [];

  async componentDidMount() {
    const {
      store: { defaultExample }
    } = this.props;

    const closeLoading = message.loading('正在获取数据...', 0);
    await Promise.all([
      defaultExample.getRoleManagementData(),
      defaultExample.getRoleMenuTree().then(() => defaultExample.initTree())
    ]);
    closeLoading();
  }

  onSearch = async () => {
    if (this.inputRole == '') {
      const closeLoading = message.loading('正在获取数据...', 0);
      await this.props.store.defaultExample.getRoleManagementData();
      closeLoading();
    } else {
      const {
        store: { defaultExample }
      } = this.props;
      const searchRole = defaultExample.tableDataO.filter(n => n.name.indexOf(this.inputRole.trim()) > -1);
      defaultExample.setTableData(searchRole);
    }
  };

  onAddRole = () => {
    const {
      store: { defaultExample }
    } = this.props;
    defaultExample.setAddModalVisible(true);
    defaultExample.setDisable(true);
    defaultExample.setActiveKey('tab1');
    defaultExample.setAddInputRole('');
    defaultExample.setAddInputDes('');
  };

  onDeleteRole = () => {
    const {
      store: { defaultExample }
    } = this.props;
    if (this.selectedRowKeys.length == 0) {
      notification.error({ message: '请勾选要删除的角色！', duration: 3 });
    } else {
      Modal.confirm({
        title: '你确认要删除角色吗？',
        onOk: async () => {
          const closeLoading = message.loading('正在获取数据...', 0);
          const roleId = this.selectedRows.map(item => item.roleId);

          await defaultExample.deleteRole({ roleId: roleId });
          defaultExample.getRoleManagementData();
          this.selectedRowKeys = [];
          closeLoading();
        }
      });
    }
  };

  @computed get tableColumns() {
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

  onEdit = async (record, index) => {
    const {
      store: { defaultExample }
    } = this.props;
    defaultExample.setEditModalVisible(true);
    defaultExample.setSaveBtnDisabled(true);
    defaultExample.setActiveKey('tab1');
    defaultExample.setAddInputRole(record.name);
    defaultExample.setAddInputDes(record.describe);
    defaultExample.setRoleId(record.roleId);
    defaultExample.setDisable(false);

    const closeLoading = message.loading('正在获取数据...', 0);
    await defaultExample.getRoleMenuTree({ roleId: record.roleId }).then(() => defaultExample.initTree());
    closeLoading();
  };

  onDetail = (record, index) => {
    const {
      store: { defaultExample }
    } = this.props;
    defaultExample.setDetailModalVisible(true);
    defaultExample.setDetailData(record.users);
  };

  getRowSelection = () => {
    return {
      selectedRowKeys: this.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      }
    };
  };

  render() {
    const {
      store: { defaultExample }
    } = this.props;

    return (
      <div className={styles.defaultExample}>
        <h2>{intl.get('roleManage')} defaultExample</h2>
        <div className={styles.handlerBox}>
          <span className={styles.label}>{intl.get('roleName')}</span>
          <Input className={styles.input} n-mobxBind={this.inputRole} />
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
          dataSource={toJS(defaultExample.tableData)}
          bordered
        />

        <ModalFormPage tabName="增加角色" />
        <ModalFormPage tabName="编辑角色" />
        <ModalDetailPage />
      </div>
    );
  }
}
