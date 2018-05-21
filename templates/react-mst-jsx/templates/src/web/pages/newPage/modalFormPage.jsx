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
export default class ModalFormPage extends Component {
  @observable autoExpandParent = false;

  //获取树节点的展开形式
  getExpandedKeys(arr) {
    return arr.filter(n => n.level == 1 || n.level == 2).map(m => { return m.id.toString(); });
  }

  getDefaultCheckedKeys() {
    let keys = [];
    this.props.store.#{pageName}#.menuData.filter(n => n.level == 3)
      .forEach(item => {
        if (item.selected) {
          keys.push(item.id.toString());
        }
      });
    return keys;
  }

  //获取选中的 checkbox 包含父级未选中状态
  getAllCheckedKeys(key) {
    const _map = toJS(this.props.store.#{pageName}#.authTreeDataMap);
    if (key.length > 1) {
      let pids = key.map(item => { return _map[item].pids; })
      return Array.from(new Set([].concat(...pids)));
    } else {
      return _map[key].pids;
    }
  }

  @autobind
  onExpand(expandedKeys) {
    const { store: { #{pageName}# } } = this.props;
    #{pageName}#.setExpandedKeys(expandedKeys);
    this.autoExpandParent = true;
  }

  @autobind
  onCheck(checkedKeys) {
    const { store: { #{pageName}# } } = this.props;
    #{pageName}#.setSaveBtnDisabled(false);
    #{pageName}#.setCheckedKeys(checkedKeys);

    if (checkedKeys.length == 0) {
      #{pageName}#.setMenuIds([]);
    } else {
      let allChecked = Array.from(new Set(this.getAllCheckedKeys(checkedKeys).concat(checkedKeys)));
      #{pageName}#.setMenuIds(allChecked);
    }
  }

  @autobind
  onAddModalCancel() {
    if (this.props.tabName == '增加角色') {
      this.props.store.#{pageName}#.setAddModalVisible(false);
    }
    else {
      this.props.store.#{pageName}#.setEditModalVisible(false);
    }
    this.props.store.#{pageName}#.setSaveBtnDisabled(false);
  }

  @autobind
  onTabChange(key) {
    this.props.store.#{pageName}#.setActiveKey(key);
  }

  @autobind
  onAddInputRoleChange(e) {
    this.props.store.#{pageName}#.setAddInputRole(e.target.value);
  }

  @autobind
  onAddInputDesChange(e) {
    this.props.store.#{pageName}#.setAddInputDes(e.target.value);
  }

  @autobind
  onAddSaveRole() {
    const { store: { #{pageName}# } } = this.props;

    if (#{pageName}#.addInputRole.trim() == '') {
      Notification.error({ description: '请输入角色名称！', duration: 1 });
    } else {
      const closeLoading = Message.loading('正在获取数据...', 0);
      let params = {
        roleName: #{pageName}#.addInputRole,
        roleDescribe: #{pageName}#.addInputDes
      };
      if (this.props.tabName == '编辑角色' && #{pageName}#.roleId != null) {
        params.roleId = #{pageName}#.roleId;
      }

      Promise.all([
        #{pageName}#.saveRole(params)
      ]).then(() => {
        #{pageName}#.getRoleManagementData();
      }).then(() => {
        #{pageName}#.setActiveKey('tab2');
        closeLoading();
      });
    }
  }

  @autobind
  onAddCancel() {
    const { store: { #{pageName}# } } = this.props;
    if (this.props.tabName == '增加角色') {
      #{pageName}#.setAddModalVisible(false);
    } else {
      #{pageName}#.setEditModalVisible(false);
    }
  }

  @autobind
  onSavePermission() {
    const { store: { #{pageName}# } } = this.props;

    if (this.props.tabName == '增加角色') {
      console.log(#{pageName}#.menuIds);
      #{pageName}#.saveRolePermission({
        roleId: #{pageName}#.addRoleId,
        menuIds: #{pageName}#.menuIds
      }).then(() => #{pageName}#.setAddModalVisible(false));
    } else {
      #{pageName}#.saveRolePermission({
        roleId: #{pageName}#.roleId,
        menuIds: #{pageName}#.menuIds
      }).then(() => #{pageName}#.setEditModalVisible(false));
    }
  }

  disabledTreeNodes = ['权限管理', '角色管理'];

  render() {
    const { store: { #{pageName}# } } = this.props;
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
      <Modal width={500} visible={this.props.tabName == '增加角色' ? #{pageName}#.addModalVisible : #{pageName}#.editModalVisible} footer={null} onCancel={this.onAddModalCancel}>
        <Tabs activeKey={#{pageName}#.activeKey} onChange={this.onTabChange}>
          <Tabs.TabPane tab="增加角色" key="tab1">
            <ul className="frombox">
              <li>角色名称 <span className="red"></span></li>
              <li><Input onChange={this.onAddInputRoleChange} value={#{pageName}#.addInputRole} /></li>
              <li>角色描述</li>
              <li><Input.TextArea rows={4} onChange={this.onAddInputDesChange} className="textarea" value={#{pageName}#.addInputDes} /></li>
              <li className={styles.btnArea}>
                <Button className="btn" onClick={this.onAddSaveRole}>保存</Button>
                <Button className="btn" onClick={this.onAddCancel}>取消</Button>
              </li>
            </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="配置权限" key="tab2" disabled={this.props.tabName == '增加角色' ? #{pageName}#.isDisable : null}>
            <div className={styles.treeWrap}>
              <Tree checkable
                onExpand={this.onExpand}
                expandedKeys={toJS(#{pageName}#.expandedKeys)}
                autoExpandParent={this.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={toJS(#{pageName}#.checkedKeys)}>
                {loop(toJS(#{pageName}#.authTreeData) || [])}
              </Tree>
            </div>
            <div className={styles.btnArea}>
              <Button className="btn" onClick={this.onSavePermission} disabled={this.props.tabName == '编辑角色' ? #{pageName}#.saveBtnDisabled : null}>保存</Button>
              <Button className="btn" onClick={this.onAddCancel}>取消</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}