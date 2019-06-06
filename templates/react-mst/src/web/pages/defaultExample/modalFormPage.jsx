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
export default class ModalFormPage extends Component {
  @observable autoExpandParent = false;

  //获取树节点的展开形式
  getExpandedKeys(arr) {
    return arr.filter(n => n.level == 1 || n.level == 2).map(m => { return m.id.toString(); });
  }

  getDefaultCheckedKeys() {
    let keys = [];
    this.props.store.defaultExample.menuData.filter(n => n.level == 3)
      .forEach(item => {
        if (item.selected) {
          keys.push(item.id.toString());
        }
      });
    return keys;
  }

  //获取选中的 checkbox 包含父级未选中状态
  getAllCheckedKeys(key) {
    const _map = toJS(this.props.store.defaultExample.authTreeDataMap);
    if (key.length > 1) {
      let pids = key.map(item => { return _map[item].pids; })
      return Array.from(new Set([].concat(...pids)));
    } else {
      return _map[key].pids;
    }
  }

  onExpand = expandedKeys => {
    const { store: { defaultExample } } = this.props;
    defaultExample.setExpandedKeys(expandedKeys);
    this.autoExpandParent = true;
  };

  onCheck = checkedKeys => {
    const { store: { defaultExample } } = this.props;
    defaultExample.setSaveBtnDisabled(false);
    defaultExample.setCheckedKeys(checkedKeys);

    if (checkedKeys.length == 0) {
      defaultExample.setMenuIds([]);
    } else {
      let allChecked = Array.from(new Set(this.getAllCheckedKeys(checkedKeys).concat(checkedKeys)));
      defaultExample.setMenuIds(allChecked);
    }
  };

  onAddModalCancel = () => {
    if (this.props.tabName == '增加角色') {
      this.props.store.defaultExample.setAddModalVisible(false);
    }
    else {
      this.props.store.defaultExample.setEditModalVisible(false);
    }
    this.props.store.defaultExample.setSaveBtnDisabled(false);
  };

  onTabChange = key => {
    this.props.store.defaultExample.setActiveKey(key);
  };

  onAddInputRoleChange = e => {
    this.props.store.defaultExample.setAddInputRole(e.target.value);
  };

  onAddInputDesChange = e => {
    this.props.store.defaultExample.setAddInputDes(e.target.value);
  };

  onAddSaveRole = async () => {
    const { store: { defaultExample } } = this.props;

    if (defaultExample.addInputRole.trim() == '') {
      Notification.error({ description: '请输入角色名称！', duration: 1 });
    } else {
      const closeLoading = message.loading('正在获取数据...', 0);
      let params = {
        roleName: defaultExample.addInputRole,
        roleDescribe: defaultExample.addInputDes
      };
      if (this.props.tabName == '编辑角色' && defaultExample.roleId != null) {
        params.roleId = defaultExample.roleId;
      }

      await defaultExample.saveRole(params);
      defaultExample.getRoleManagementData();
      defaultExample.setActiveKey('tab2');
      closeLoading();
    }
  };

  onAddCancel = () => {
    const { store: { defaultExample } } = this.props;
    if (this.props.tabName == '增加角色') {
      defaultExample.setAddModalVisible(false);
    } else {
      defaultExample.setEditModalVisible(false);
    }
  };

  onSavePermission = async () => {
    const { store: { defaultExample } } = this.props;

    if (this.props.tabName == '增加角色') {
      await defaultExample.saveRolePermission({
        roleId: defaultExample.addRoleId,
        menuIds: defaultExample.menuIds
      });
      defaultExample.setAddModalVisible(false);
    } else {
      await defaultExample.saveRolePermission({
        roleId: defaultExample.roleId,
        menuIds: defaultExample.menuIds
      });
      defaultExample.setEditModalVisible(false);
    }
  };

  disabledTreeNodes = ['权限管理', '角色管理'];

  render() {
    const { store: { defaultExample } } = this.props;
    const TreeNode = Tree.TreeNode;
    let level = 1;
    const loop = data => data.map((item) => {
      const disableCheckbox = this.disabledTreeNodes.indexOf(item.title) > -1 ? true : false;

      if (item.children) {
        const disabled = level == 1 ? true : item.children.filter(n => this.disabledTreeNodes.indexOf(n.title) > -1).length > 0;
        level++;

        return (
          <TreeNode key={item.key} title={item.title} disableCheckbox={disableCheckbox} disabled={disabled}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} disableCheckbox={disableCheckbox} />;
    });

    return (
      <Modal width={500} visible={this.props.tabName == '增加角色' ? defaultExample.addModalVisible : defaultExample.editModalVisible} footer={null} onCancel={this.onAddModalCancel}>
        <Tabs activeKey={defaultExample.activeKey} onChange={this.onTabChange}>
          <Tabs.TabPane tab="增加角色" key="tab1">
            <ul className="frombox">
              <li>角色名称 <span className="red"></span></li>
              <li><Input onChange={this.onAddInputRoleChange} value={defaultExample.addInputRole} /></li>
              <li>角色描述</li>
              <li><Input.TextArea rows={4} onChange={this.onAddInputDesChange} className="textarea" value={defaultExample.addInputDes} /></li>
              <li className={styles.btnArea}>
                <Button className="btn" onClick={this.onAddSaveRole}>保存</Button>
                <Button className="btn" onClick={this.onAddCancel}>取消</Button>
              </li>
            </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="配置权限" key="tab2" disabled={this.props.tabName == '增加角色' ? defaultExample.isDisable : null}>
            <div className={styles.treeWrap}>
              <Tree checkable
                onExpand={this.onExpand}
                expandedKeys={toJS(defaultExample.expandedKeys)}
                autoExpandParent={this.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={toJS(defaultExample.checkedKeys)}>
                {loop(toJS(defaultExample.authTreeData) || [])}
              </Tree>
            </div>
            <div className={styles.btnArea}>
              <Button className="btn" onClick={this.onSavePermission} disabled={this.props.tabName == '编辑角色' ? defaultExample.saveBtnDisabled : null}>保存</Button>
              <Button className="btn" onClick={this.onAddCancel}>取消</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}