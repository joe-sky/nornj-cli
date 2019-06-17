import { types } from 'mobx-state-tree';
import { observable, toJS } from 'mobx';
import BaseStore from '../base.mst';
import * as api from '../../services/pages/defaultExample';
import Notification from '../../utils/notification';

const DefaultExampleStore = BaseStore.named('DefaultExampleStore')
  .props({
    isDisable: types.optional(types.boolean, true),
    activeKey: types.optional(types.string, 'tab1'),
    addModalVisible: false,
    editModalVisible: false,
    saveBtnDisabled: false,
    addInputRole: '',
    addInputDes: '',
    roleId: 0,
    expandedKeys: types.optional(types.array(types.string), []),
    checkedKeys: types.optional(types.array(types.string), []),
    detailModalVisible: false
  })
  .volatile(self => ({
    tableData: null,
    tableDataO: null,
    searchData: null,
    addRoleData: null,
    treeData: null,
    addRoleId: null,
    menuIds: null,
    authTreeData: null,
    menuData: null,
    detailData: []
  }))
  .views(self => ({
    getExpandedKeys(arr) {
      return arr
        .filter(n => n.level == 1 || n.level == 2)
        .map(m => {
          return m.id.toString();
        });
    },

    getDefaultCheckedKeys() {
      let keys = [];
      self.menuData
        .filter(n => n.level == 3)
        .forEach(item => {
          if (item.selected) {
            keys.push(item.id.toString());
          }
        });
      return keys;
    },

    getAuthTreeDataMap(authList) {
      const authTreeDataMap = {};
      authList.forEach(node => {
        authTreeDataMap[node.id] = node;
      });

      return authTreeDataMap;
    },

    getAuthTreeData(authList, authMap, level = 1, node, pids = []) {
      if (level == 4) {
        return null;
      }

      return authList
        .filter(n => n.level == level && (!node ? true : n.pid == node.id.toString()))
        .map(n => {
          authMap[n.id].pids = pids;

          return {
            key: n.id.toString(),
            title: n.name,
            children: self.getAuthTreeData(authList, authMap, level + 1, n, [...pids, n.id.toString()])
          };
        });
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.authTreeDataMap = null;
    },

    setAddModalVisible(v) {
      self.addModalVisible = v;
    },

    setEditModalVisible(v) {
      self.editModalVisible = v;
    },

    setSaveBtnDisabled(v) {
      self.saveBtnDisabled = v;
    },

    setAddInputRole(v) {
      self.addInputRole = v;
    },

    setAddInputDes(v) {
      self.addInputDes = v;
    },

    setRoleId(v) {
      self.roleId = v;
    },

    setExpandedKeys(v) {
      self.expandedKeys = v;
    },

    setCheckedKeys(v) {
      self.checkedKeys = v;
    },

    setDetailModalVisible(v) {
      self.detailModalVisible = v;
    },

    setDetailData(v) {
      self.detailData = v;
    },

    setMenuIds(checkeds) {
      self.menuIds = checkeds.join();
    },

    setTableData(value) {
      self.tableData = value;
    },

    setDisable(value) {
      self.isDisable = value;
    },

    setActiveKey(value) {
      self.activeKey = value;
    },

    initTree() {
      self.expandedKeys = self.getExpandedKeys(toJS(self.menuData));
      self.checkedKeys = self.getDefaultCheckedKeys();
    },

    getRoleMenuTree(params) {
      return api.getRoleMenuTree(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            self.menuData = res.data.data;
            self.authTreeDataMap = self.getAuthTreeDataMap(res.data.data);
            self.authTreeData = self.getAuthTreeData(res.data.data, self.authTreeDataMap);
          }
          return res;
        })
      );
    },

    getRoleManagementData(params) {
      return api.getRoleManagementData(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.tableDataO = self.tableData = data.length > 0 ? data : [];
          }
          return res;
        })
      );
    },

    searchRole(params) {
      return api.searchRole(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.searchData = data;
          }
          return res;
        })
      );
    },

    saveRole(params) {
      return api.saveRole(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.addRoleId = data.roleId;
            Notification.success({ message: '添加角色成功！' });
            self.setDisable(false);
          }
          return res;
        })
      );
    },

    saveRolePermission(params) {
      return api.saveRolePermission(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            Notification.success({ message: '添加角色权限成功！' });
          }
          return res;
        })
      );
    },

    deleteRole(params) {
      return api.deleteRole().then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            Notification.success({ message: '删除角色成功！' });
          }
          return res;
        })
      );
    }
  }));

export default DefaultExampleStore;
