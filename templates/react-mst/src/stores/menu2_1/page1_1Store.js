import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const Page1_1Store = types.model("Page1_1Store", {
  isDisable: types.optional(types.boolean, true),
  activeKey: types.optional(types.string, 'key1'),
}, {
  tableData: null,
  tableDataO: null,
  searchData: null,
  addRoleData: null,
  treeData: null,
  addRoleId: null,
  menuIds: null,
  authTreeData: null,
  menuData: null,
}, {
  afterCreate() {
    this.authTreeDataMap = null;
  },
  getAuthTreeDataMap(authList) {
    const authTreeDataMap = {};
    authList.forEach(node => {
      authTreeDataMap[node.id] = node;
    });

    return authTreeDataMap;
  },
  getAuthTreeData(authList, authMap, level = 1, node, pids = []) {
    if(level == 4) {
      return null;
    }

    return authList
      .filter(n => n.level == level && (!node ? true : n.pid == node.id.toString()))
      .map(n => {
        authMap[n.id].pids = pids;

        return {
          key: n.id.toString(),
          title: n.name,
          children: this.getAuthTreeData(authList, authMap, level + 1, n, [...pids, n.id.toString()])
        };
      });
  },

  getRoleMenuTree(params) {
    return fetchData(`${__HOST}/page1_1/getRoleMenuTree`,
      this.setRoleMenuTree,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色权限数据异常:' + ex,
        duration: null
      });
    });
  },
  setRoleMenuTree(result) {
    if (result.success) {
      this.menuData = result.data;
      this.authTreeDataMap = this.getAuthTreeDataMap(result.data);
      this.authTreeData = this.getAuthTreeData(result.data, this.authTreeDataMap);
    } else {
      Notification.error({
        description: '获取角色权限数据错误:' + result.message,
        duration: null
      });
    }
  },

  setMenuIds(checkeds) {
    this.menuIds = checkeds.join();
  },
  setTableData(value) {
    this.tableData = value;
  },
  setDisable(value) {
    this.isDisable = value;
  },
  setActiveKey(value) {
    this.activeKey = value;
  },
  getRoleManagementData(params) {
    return fetchData(`${__HOST}/page1_1/getRoleManagementData`,
      this.setRoleManagementData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色管理数据异常:' + ex,
        duration: null
      });
    });
  },
  setRoleManagementData(result) {
    if (result.success) {
      const data = result.data;
      this.tableDataO = this.tableData = data.length > 0 ? data : [];
    } else {
      Notification.error({
        description: '获取角色管理度数据异常:' + result.message,
        duration: null
      });
    }
  },

  searchRole(params) {
    return fetchData(`${__HOST}/page1_1/searchRole`,
      this.setSearchRole,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色数据异常:' + ex,
        duration: null
      });
    });
  },
  setSearchRole(result) {
    if (result.success) {
      const data = result.data;
      this.searchData = data;
    } else {
      Notification.error({
        description: '获取角色数据异常:' + result.message,
        duration: null
      });
    }
  },

  saveRole(params) {
    return fetchData(`${__HOST}/page1_1/saveRole`,
      this.setSaveRole,
      params,
      {method: 'post'}).catch((ex) => {
      Notification.error({
        description: '添加角色数据异常:' + ex,
        duration: null
      });
    });
  },
  setSaveRole(result) {
    if (result.success) {
      const data = result.data;
      this.addRoleId = data.roleId;
      Notification.success({ description: '添加角色成功！', duration: 2 });
      this.setDisable(false);

    } else {
      Notification.error({
        description: '添加角色数据异常:' + result.message,
        duration: null
      });
    }
  },

  saveRolePermission(params) {
    return fetchData(`${__HOST}/page1_1/saveRolePermission`,
      this.setSaveRolePermission,
      params,
      {method: 'post'}).catch((ex) => {
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
      Notification.error({description: '添加角色权限数据异常:' + result.message, duration: null
      });
    }
  },

  deleteRole(params) {
    return fetchData(`${__HOST}/page1_1/deleteRole`,
      this.setDeleteRole,
      params,
      {method: 'post'}).catch((ex) => {
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
      Notification.error({description: '删除角色数据异常:' + result.message, duration: null });
    }
  },

});

export default Page1_1Store;
