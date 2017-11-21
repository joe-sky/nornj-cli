import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/pagination';
import 'vic-common/lib/components/antd/tabs';
import 'vic-common/lib/components/antd/tree';
import 'vic-common/lib/components/antd/checkbox';
import Modal from 'vic-common/lib/components/antd/modal';
import Tree from 'vic-common/lib/components/antd/tree';
import Input from 'vic-common/lib/components/antd/input';
import Message from 'vic-common/lib/components/antd/message';
import Notification from '../../../utils/notification';
import styles from './page1_2.m.scss';
import tmpls from './page1_2.t.html';

// 页面容器组件
@inject('store')
@observer
@registerTmpl('Page1_2')
export default class Page1_2 extends Component {
  @observable addModalVisible = false;
  @observable detailModalVisible = false;
  @observable tabName = "增加角色";
  @observable inputRole = '';
  @observable addInputRole = '';
  @observable addInputDes = '';
  @observable detailData = [];
  @observable roleId = '';
  @observable selectedRowKeys = [];
  @observable selectedRows = [];

  constructor(props) {
    super(props);
  }

  state = {
    expandedKeys: [],
    autoExpandParent: false,
    checkedKeys: [],
  }

  @autobind
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  }

  @autobind
  onCheck(checkedKeys) {
    this.saveBtnDisabled = false;
    this.setState({
      checkedKeys,
    });

    if (checkedKeys.length == 0) {
      this.props.store.page1_2.setMenuIds([]);
    } else {
      let allChecked = Array.from(new Set(this.getAllCheckedKeys(checkedKeys).concat(checkedKeys)));
      this.props.store.page1_2.setMenuIds(allChecked);
      console.log('allChecked', allChecked);
    }
  }

  getDefaultCheckedKeys() {
    let keys = [];
    this.props.store.page1_2.menuData.filter(n => n.level == 3)
      .forEach(item => {
        if (item.selected) {
          keys.push(item.id.toString());
        }
      })
    return keys;
  }

  // 获取树节点的展开形式
  getExpandedKeys(arr) {
    return arr.filter(n => n.level == 1 || n.level == 2).map(m => { return m.id.toString() });
  }

  // 获取选中的 checkbox 包含父级未选中状态
  getAllCheckedKeys(key) {
    const _map = toJS(this.props.store.page1_2.authTreeDataMap);
    if (key.length > 1) {
      let pids = key.map(item => { return _map[item].pids })
      return Array.from(new Set([].concat(...pids)));
    } else {
      return _map[key].pids;
    }
  }

  initTree() {
    this.setState({
      expandedKeys: this.getExpandedKeys(toJS(this.props.store.page1_2.menuData)),
      checkedKeys: this.getDefaultCheckedKeys()
    })
  }

  @autobind
  onSaveAddPermission() {
    this.props.store.page1_2.saveRolePermission({
      roleId: this.props.store.page1_2.addRoleId,
      menuIds: this.props.store.page1_2.menuIds
    }).then(() => this.addModalVisible = false);
  }

  @autobind
  onSaveEidtPermission() {
    this.props.store.page1_2.saveRolePermission({
      roleId: this.roleId,
      menuIds: this.props.store.page1_2.menuIds
    }).then(() => this.addModalVisible = false);
  }

  @autobind
  onChangeCheckbox() {
    console.log('onChangeCheckbox');
  }

  componentDidMount() {
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      this.props.store.page1_2.getRoleManagementData(),
      this.props.store.page1_2.getRoleMenuTree().then(() => this.initTree()),
    ]).then(() => {
      closeLoading()
    });
  }

  @autobind
  onAddModalCancel() {
    this.addModalVisible = false;
    this.saveBtnDisabled = false;
  }

  @autobind
  onInputRole(e) {
    this.inputRole = e.target.value;
  }

  @autobind
  onSearch() {
    if (this.inputRole == '') {
      const closeLoading = Message.loading('正在获取数据...', 0);
      Promise.all([
        this.props.store.page1_2.getRoleManagementData(),
      ]).then(() => {
        closeLoading()
      });
    } else {
      const { store: { page1_2 } } = this.props;
      const searchRole = page1_2.tableDataO.filter(n => n.name.indexOf(this.inputRole.trim()) > -1)
      page1_2.setTableData(searchRole);
    }
  }

  @autobind
  onAddInputRoleChange(e) {
    this.addInputRole = e.target.value;
  }

  @autobind
  onAddInputDesChange(e) {
    this.addInputDes = e.target.value;
  }

  @autobind
  onAddCancel() {
    this.addModalVisible = false;
  }

  @autobind
  onAddSaveRole() {
    if (this.addInputRole == '') {
      Notification.error({ description: '请输入角色名称！', duration: 1 });
    } else {
      const { store: { page1_2 } } = this.props;
      const closeLoading = Message.loading('正在获取数据...', 0);
      let params = {
        roleName: this.addInputRole,
        roleDescribe: this.addInputDes
      }
      if (this.tabName == '编辑角色' && this.roleId != null) {
        params.roleId = this.roleId;
      }
      Promise.all([
        page1_2.saveRole(params)
      ]).then(() => {
        page1_2.getRoleManagementData();
      }).then(() => {
        if (this.tabName == '增加角色') {
          this.activeKeyAdd = 'key2';
        }
        if (this.tabName == '编辑角色') {
          this.activeKeyEdit = 'tab2';
        }
        closeLoading()
      });
    }
  }

  @autobind
  onAddRole() {
    this.addModalVisible = true;
    this.activeKeyAdd = 'key1';
    this.tabName = "增加角色";
    this.addInputRole = '';
    this.addInputDes = '';
    this.setState({ checkedKeys: [] });
    this.props.store.page1_2.setDisable(true);
  }

  @autobind
  onDeleteRole() {
    const { store: { page1_2 } } = this.props;
    if (this.selectedRowKeys.length == 0) {
      Notification.error({ description: '请勾选要删除的角色！', duration: 3 });
    } else {
      Modal.confirm({
        title: '你确认要删除角色吗？',
        onOk: () => {
          const closeLoading = Message.loading('正在获取数据...', 0);
          const roleId = this.selectedRows.map((item) => item.roleId);
          // console.log('roleId',roleId);
          Promise.all([
            page1_2.deleteRole({ roleId: roleId })
          ]).then(() => {
            page1_2.getRoleManagementData();
          }).then(() => {
            this.selectedRowKeys = [];
            closeLoading();
          });
        }
      });
    }
  }

  @autobind
  onExport() {
    console.log('onExport')
  }

  @computed get tableColumns() {
    return [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '角色描述',
      dataIndex: 'describe',
    }, {
      title: '创建时间',
      dataIndex: 'cTime',
    }, {
      title: '修改时间',
      dataIndex: 'mTime',
    }, {
      title: '操作',
      dataIndex: 'handler',
      render: (text, record, index) => nj `
        <span>
          <a href="javascript:;" onClick=${()=>this.onEdit(record, index)} className="btn-link">编辑</a>
          <a href="javascript:;" onClick=${()=>this.onDetail(record, index)} className="btn-link">用户明细</a>
        </span>
      ` (),
    }];
  }

  @observable saveBtnDisabled = false;

  @autobind
  onEdit(record, index) {
    this.tabName = "编辑角色"
    this.addModalVisible = true;
    this.activeKeyEdit = 'tab1';
    this.saveBtnDisabled = true;
    this.addInputRole = record.name;
    this.addInputDes = record.describe;
    this.roleId = record.roleId;
    this.props.store.page1_2.setDisable(false);

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      this.props.store.page1_2.getRoleMenuTree({ roleId: record.roleId }).then(() => this.initTree()),
    ]).then(() => {
      closeLoading()
    });
  }

  @autobind
  onDetail(record, index) {
    this.detailModalVisible = true;
    this.detailData = [];
    this.detailData = record.users;
  }

  @autobind
  onDetailModalCancel() {
    this.detailModalVisible = false;
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

  getRowSelection() {
    return {
      selectedRowKeys: this.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      }
    }
  }

  @observable activeKeyAdd = 'key1';
  @autobind
  onTabChangeAdd(key) {
    this.activeKeyAdd = key;
  }

  @observable activeKeyEdit = 'tab1';
  @autobind
  onTabChangeEdit(key) {
    this.activeKeyEdit = key;
  }

  disabledTreeNodes = ['权限管理', '角色管理'];

  render() {
    const TreeNode = Tree.TreeNode;
    let level = 1;
    const loop = data => data.map((item) => {
      const disableCheckbox = this.disabledTreeNodes.indexOf(item.title) > -1 ? true : false;

      if (item.children) {
        const disabled = level == 1 ? true : item.children.filter(n => this.disabledTreeNodes.indexOf(n.title) > -1).length > 0
        level++;

        return nj `
          <${TreeNode} key=${item.key} title=${item.title} disableCheckbox=${disableCheckbox} disabled=${disabled}>
            ${loop(item.children)}
          </${TreeNode}>
        ` ();
      }
      return nj `<${TreeNode} key=${item.key} title=${item.title} disableCheckbox=${disableCheckbox} />` ();
    });

    const { store: { page1_2 } } = this.props;
    return tmpls.page1_2({ components: { 'ant-TextArea': Input.TextArea } }, this.state, this.props, this, {
      styles,
      page1_2,
      loop,
      treeData: toJS(page1_2.authTreeData) || [],
      getDetailRowKey: (record, index) => `${record.key}-${index}`,
      tableData: toJS(page1_2.tableData),
      detailData: this.detailData,
      rowSelection: this.getRowSelection(),
    });
  }
}