import { types } from "mobx-state-tree";
import { observable, toJS } from 'mobx';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../../utils/notification';

const Page1_1Store = types.model("Page1_1Store", {
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
  .views(self => {
    return {
      get tableData() {
        return self._o.tableData;
      },
      get tableDataO() {
        return self._o.tableDataO;
      },
      get searchData() {
        return self._o.searchData;
      },
      get addRoleData() {
        return self._o.addRoleData;
      },
      get treeData() {
        return self._o.treeData;
      },
      get addRoleId() {
        return self._o.addRoleId;
      },
      get menuIds() {
        return self._o.menuIds;
      },
      get authTreeData() {
        return self._o.authTreeData;
      },
      get menuData() {
        return self._o.menuData;
      },
      get detailData() {
        return self._o.detailData;
      },

      //获取树节点的展开形式
      getExpandedKeys(arr) {
        return arr.filter(n => n.level == 1 || n.level == 2).map(m => { return m.id.toString() });
      },

      getDefaultCheckedKeys() {
        let keys = [];
        self.menuData.filter(n => n.level == 3)
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
    };
  })
  .actions(self => {
    return {
      afterCreate() {
        self._o = observable({
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
        });

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
        self._o.detailData = v;
      },

      setMenuIds(checkeds) {
        self._o.menuIds = checkeds.join();
      },

      setTableData(value) {
        self._o.tableData = value;
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
        return fetchData(`${__HOST}/page1_1/getRoleMenuTree`,
          self.setRoleMenuTree,
          params, { method: 'get' }).catch((ex) => {
          Notification.error({
            description: '获取角色权限数据异常:' + ex,
            duration: null
          });
        });
      },

      setRoleMenuTree(result) {
        if (result.success) {
          self._o.menuData = result.data;
          self.authTreeDataMap = self.getAuthTreeDataMap(result.data);
          self._o.authTreeData = self.getAuthTreeData(result.data, self.authTreeDataMap);
        } else {
          Notification.error({
            description: '获取角色权限数据错误:' + result.message,
            duration: null
          });
        }
      },

      getRoleManagementData(params) {
        return fetchData(`${__HOST}/page1_1/getRoleManagementData`,
          self.setRoleManagementData,
          params, { method: 'get' }).catch((ex) => {
          Notification.error({
            description: '获取角色管理数据异常:' + ex,
            duration: null
          });
        });
      },

      setRoleManagementData(result) {
        if (result.success) {
          const data = result.data;
          self._o.tableDataO = self._o.tableData = data.length > 0 ? data : [];
        } else {
          Notification.error({
            description: '获取角色管理度数据异常:' + result.message,
            duration: null
          });
        }
      },

      searchRole(params) {
        return fetchData(`${__HOST}/page1_1/searchRole`,
          self.setSearchRole,
          params, { method: 'get' }).catch((ex) => {
          Notification.error({
            description: '获取角色数据异常:' + ex,
            duration: null
          });
        });
      },

      setSearchRole(result) {
        if (result.success) {
          const data = result.data;
          self._o.searchData = data;
        } else {
          Notification.error({
            description: '获取角色数据异常:' + result.message,
            duration: null
          });
        }
      },

      saveRole(params) {
        return fetchData(`${__HOST}/page1_1/saveRole`,
          self.setSaveRole,
          params, { method: 'post' }).catch((ex) => {
          Notification.error({
            description: '添加角色数据异常:' + ex,
            duration: null
          });
        });
      },

      setSaveRole(result) {
        if (result.success) {
          const data = result.data;
          self._o.addRoleId = data.roleId;
          Notification.success({ description: '添加角色成功！', duration: 2 });
          self.setDisable(false);

        } else {
          Notification.error({
            description: '添加角色数据异常:' + result.message,
            duration: null
          });
        }
      },

      saveRolePermission(params) {
        return fetchData(`${__HOST}/page1_1/saveRolePermission`,
          self.setSaveRolePermission,
          params, { method: 'post' }).catch((ex) => {
          Notification.error({
            description: '添加角色权限数据异常:' + ex,
            duration: null
          });
        });
      },

      setSaveRolePermission(result) {
        if (result.success) {
          Notification.success({ description: '添加角色权限成功！', duration: 2 });
        } else {
          Notification.error({
            description: '添加角色权限数据异常:' + result.message,
            duration: null
          });
        }
      },

      deleteRole(params) {
        return fetchData(`${__HOST}/page1_1/deleteRole`,
          self.setDeleteRole,
          params, { method: 'post' }).catch((ex) => {
          Notification.error({
            description: '删除角色数据异常:' + ex,
            duration: null
          });
        });
      },

      setDeleteRole(result) {
        if (result.success) {
          Notification.success({ description: '删除角色成功！', duration: null });
        } else {
          Notification.error({ description: '删除角色数据异常:' + result.message, duration: null });
        }
      }
    };
  });

export default Page1_1Store;