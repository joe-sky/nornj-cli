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
export default class ModalFormPage extends Component {
  @observable autoExpandParent = false;

  //获取树节点的展开形式
  getExpandedKeys(arr) {
    return arr.filter(n => n.level == 1 || n.level == 2).map(m => { return m.id.toString() });
  }

  getDefaultCheckedKeys() {
    let keys = [];
    this.props.store.page2.menuData.filter(n => n.level == 3)
      .forEach(item => {
        if (item.selected) {
          keys.push(item.id.toString());
        }
      });
    return keys;
  }

  //获取选中的 checkbox 包含父级未选中状态
  getAllCheckedKeys(key) {
    const _map = toJS(this.props.store.page2.authTreeDataMap);
    if (key.length > 1) {
      let pids = key.map(item => { return _map[item].pids })
      return Array.from(new Set([].concat(...pids)));
    } else {
      return _map[key].pids;
    }
  }

  @autobind
  onExpand(expandedKeys) {
    const { store: { page2 } } = this.props;
    page2.setExpandedKeys(expandedKeys);
    this.autoExpandParent = true;
  }

  @autobind
  onCheck(checkedKeys) {
    const { store: { page2 } } = this.props;
    page2.setSaveBtnDisabled(false);
    page2.setCheckedKeys(checkedKeys);

    if (checkedKeys.length == 0) {
      page2.setMenuIds([]);
    } else {
      let allChecked = Array.from(new Set(this.getAllCheckedKeys(checkedKeys).concat(checkedKeys)));
      page2.setMenuIds(allChecked);
    }
  }

  @autobind
  onAddModalCancel() {
    if (this.props.tabName == '增加角色') {
      this.props.store.page2.setAddModalVisible(false);
    }
    else {
      this.props.store.page2.setEditModalVisible(false);
    }
    this.props.store.page2.setSaveBtnDisabled(false);
  }

  @autobind
  onTabChange(key) {
    this.props.store.page2.setActiveKey(key);
  }

  @autobind
  onAddInputRoleChange(e) {
    this.props.store.page2.setAddInputRole(e.target.value);
  }

  @autobind
  onAddInputDesChange(e) {
    this.props.store.page2.setAddInputDes(e.target.value);
  }

  @autobind
  onAddSaveRole() {
    const { store: { page2 } } = this.props;

    if (page2.addInputRole.trim() == '') {
      Notification.error({ description: '请输入角色名称！', duration: 1 });
    } else {
      const closeLoading = Message.loading('正在获取数据...', 0);
      let params = {
        roleName: page2.addInputRole,
        roleDescribe: page2.addInputDes
      }
      if (this.props.tabName == '编辑角色' && page2.roleId != null) {
        params.roleId = page2.roleId;
      }

      Promise.all([
        page2.saveRole(params)
      ]).then(() => {
        page2.getRoleManagementData();
      }).then(() => {
        page2.setActiveKey('tab2');
        closeLoading();
      });
    }
  }

  @autobind
  onAddCancel() {
    const { store: { page2 } } = this.props;
    if (this.props.tabName == '增加角色') {
      page2.setAddModalVisible(false);
    } else {
      page2.setEditModalVisible(false);
    }
  }

  @autobind
  onSavePermission() {
    const { store: { page2 } } = this.props;

    if (this.props.tabName == '增加角色') {
      console.log(page2.menuIds);
      page2.saveRolePermission({
        roleId: page2.addRoleId,
        menuIds: page2.menuIds
      }).then(() => page2.setAddModalVisible(false));
    } else {
      page2.saveRolePermission({
        roleId: page2.roleId,
        menuIds: page2.menuIds
      }).then(() => page2.setEditModalVisible(false));
    }
  }

  disabledTreeNodes = ['权限管理', '角色管理'];

  render() {
    const { store: { page2 } } = this.props;
    const TreeNode = Tree.TreeNode;
    let level = 1;
    const loop = data => data.map((item) => {
      const disableCheckbox = this.disabledTreeNodes.indexOf(item.title) > -1 ? true : false;

      if (item.children) {
        const disabled = level == 1 ? true : item.children.filter(n => this.disabledTreeNodes.indexOf(n.title) > -1).length > 0
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
      <Modal width={500} visible={this.props.tabName == '增加角色' ? page2.addModalVisible : page2.editModalVisible} footer={null} onCancel={this.onAddModalCancel}>
        <Tabs activeKey={page2.activeKey} onChange={this.onTabChange}>
          <Tabs.TabPane tab="增加角色" key="tab1">
            <ul className="frombox">
              <li>角色名称 <span className="red"></span></li>
              <li><Input onChange={this.onAddInputRoleChange} value={page2.addInputRole} /></li>
              <li>角色描述</li>
              <li><Input.TextArea rows={4} onChange={this.onAddInputDesChange} className="textarea" value={page2.addInputDes} /></li>
              <li className={styles.btnArea}>
                <Button className="btn" onClick={this.onAddSaveRole}>保存</Button>
                <Button className="btn" onClick={this.onAddCancel}>取消</Button>
              </li>
            </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="配置权限" key="tab2" disabled={this.props.tabName == '增加角色' ? page2.isDisable : null}>
            <div className={styles.treeWrap}>
              <Tree checkable
                onExpand={this.onExpand}
                expandedKeys={toJS(page2.expandedKeys)}
                autoExpandParent={this.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={toJS(page2.checkedKeys)}>
                {loop(toJS(page2.authTreeData) || [])}
              </Tree>
            </div>
            <div className={styles.btnArea}>
              <Button className="btn" onClick={this.onSavePermission} disabled={this.props.tabName == '编辑角色' ? page2.saveBtnDisabled : null}>保存</Button>
              <Button className="btn" onClick={this.onAddCancel}>取消</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}