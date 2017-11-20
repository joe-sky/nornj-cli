import { types } from "mobx-state-tree";
import { CommonStore } from "./commonStore";
import HeaderStore from "./headerStore";
import SiderStore from "./SiderStore";
import Page1_1Store from "./menu2_1/page1_1Store";
import Page1_2Store from "./menu2_1/page1_2Store";

const RootStore = types.model("RootStore", {
  common: types.optional(CommonStore, {}),

  header: types.optional(HeaderStore, {
    current: 0
  }),

  sider: types.optional(SiderStore, {
    isOpen: false,
    current: 'page1',
    menuData: [{
      type: 'group',
      index: 'Menu1_1',
      name: '一级菜单1',
      expanded: false,
      children: [{
        type: 'group',
        index: 'Menu2_1',
        name: '二级菜单1',
        expanded: false,
        children: [
          { type: 'item', level: 3, link: '/Page1_1', index: 'Page1_1', name: '页面1-1' },
          { type: 'item', level: 3, link: '/Page1_2', index: 'Page1_2', name: '页面1-2' },
        ]
      }, {
        type: 'group',
        index: 'Menu2_2',
        name: '二级菜单2',
        expanded: false,
        children: [
          { type: 'item', level: 3, link: '/Page2_1', index: 'Page2_1', name: '页面2-1' },
          { type: 'item', level: 3, link: '/Page2_2', index: 'Page2_2', name: '页面2-2' },
        ]
      }]
    }, {
      type: 'group',
      index: 'Menu1_2',
      name: '一级菜单2',
      expanded: false,
      children: [{
        type: 'group',
        index: 'Menu2_3',
        name: '二级菜单3',
        expanded: false,
        children: [
          { type: 'item', level: 3, link: '/Page3_1', index: 'Page3_1', name: '页面3-1' },
          { type: 'item', level: 3, link: '/Page3_2', index: 'Page3_2', name: '页面3-2' },
        ]
      }, {
        type: 'group',
        index: 'Menu2_4',
        name: '二级菜单4',
        expanded: false,
        children: [
          { type: 'item', level: 3, link: '/Page4_1', index: 'Page4_1', name: '页面4-1' },
          { type: 'item', level: 3, link: '/Page4_2', index: 'Page4_2', name: '页面4-2' },
        ]
      }]
    }]
  }),

  page1_1: types.optional(Page1_1Store, {}),
  page1_2: types.optional(Page1_2Store, {}),

});

export default RootStore;