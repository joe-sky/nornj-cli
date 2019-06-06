import { types } from 'mobx-state-tree';
import { CommonStore } from './commonStore';
import HeaderStore from './headerStore';
import SiderStore from './siderStore';
import DefaultExampleStore from './pages/defaultExampleStore';
import ChartExampleStore from './pages/chartExampleStore';
import FormExampleStore from './pages/formExampleStore';
import EmptyExampleStore from './pages/emptyExampleStore';
//{importStore}//

// prettier-ignore
const RootStore = types.model('RootStore', {
  common: types.optional(CommonStore, {}),

  header: types.optional(HeaderStore, {
    current: 0
  }),

  sider: types.optional(SiderStore, {
    isOpen: false,
    current: 'page1',
    menuData: [
      {
        type: 'group',
        index: 'Menu1',
        name: '菜单1',
        expanded: false,
        children: [
          {
            type: 'group',
            index: 'Menu1_1',
            name: '菜单1-1',
            expanded: false,
            children: [
              {
                type: 'item',
                level: 3,
                link: '/defaultExample',
                index: 'defaultExample',
                name: '默认示例'
              },
              {
                type: 'item',
                level: 3,
                link: '/chartExample',
                index: 'chartExample',
                name: '图表示例'
              }
            ]
          },
          {
            type: 'group',
            index: 'Menu1_2',
            name: '菜单1-2',
            expanded: false,
            children: [
              {
                type: 'item',
                level: 3,
                link: '/formExample',
                index: 'formExample',
                name: '表单示例'
              },
              {
                type: 'item',
                level: 3,
                link: '/emptyExample',
                index: 'emptyExample',
                name: '空白示例'
              }
            ]
          }
        ]
      },
      {
        type: 'group',
        index: 'Menu2',
        name: '菜单2',
        expanded: false,
        children: [
          {
            type: 'group',
            index: 'Menu2_1',
            name: '菜单2-1',
            expanded: false,
            children: [
              {
                type: 'item',
                level: 3,
                link: '/Test5000',
                index: 'Test5000',
                name: '页面5'
              },
              {
                type: 'item',
                level: 3,
                link: '/Test7000',
                index: 'Test7000',
                name: '页面6'
              }
            ]
          },
          {
            type: 'group',
            index: 'Menu2_2',
            name: '菜单2-2',
            expanded: false,
            children: [
              {
                type: 'item',
                level: 3,
                link: '/Page7',
                index: 'Page7',
                name: '页面7'
              },
              {
                type: 'item',
                level: 3,
                link: '/Page8',
                index: 'Page8',
                name: '页面8'
              }
            ]
          }
        ]
      }
    ]
  }),

  defaultExample: types.optional(DefaultExampleStore, {}),
  chartExample: types.optional(ChartExampleStore, {}),
  emptyExample: types.optional(EmptyExampleStore, {}),
  //{pageStore}//
}).volatile(self => ({
  formExample: new FormExampleStore(),
  //{pageStoreMobx}//
}));

export default RootStore;