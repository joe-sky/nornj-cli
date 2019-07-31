import { types } from 'mobx-state-tree';
import { observable, computed, action, toJS } from 'mobx';
import CommonStore from './common.mst';
import HeaderStore from './header.mst';
import SiderStore from './sider.mst';
import DefaultExampleStore from './pages/defaultExample.mst';
import ChartExampleStore from './pages/chartExample.mst';
import FormExampleStore from './pages/formExample.store';
import EmptyExampleStore from './pages/emptyExample.mst';
//{importStore}//

// prettier-ignore
class RootStore {
  @observable common = CommonStore.create({});

  @observable header = HeaderStore.create({
    current: 0
  });

  @observable sider = SiderStore.create({
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
                link: '/Test10000',
                index: 'Test10000',
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
  }, { root: this });

  @observable defaultExample = DefaultExampleStore.create();
  @observable chartExample = ChartExampleStore.create();
  @observable emptyExample = EmptyExampleStore.create();
  //{pageStore}//
  @observable formExample = new FormExampleStore();
  //{pageStoreMobx}//
}

export default RootStore;
