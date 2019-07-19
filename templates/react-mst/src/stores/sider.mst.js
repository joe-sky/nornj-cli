import { types, getParent, getEnv } from 'mobx-state-tree';
import { notification } from 'antd';

const MenuItem = types
  .model('MenuItem', {
    type: types.string,
    link: types.optional(types.string, ''),
    index: types.string,
    name: types.string,
    expanded: types.optional(types.boolean, false),
    children: types.optional(types.union(types.array(types.late(() => MenuItem)), types.literal(null)), []),
    level: types.maybe(types.number)
  })
  .views(self => ({
    get topMenuData() {
      return getParent(getParent(getParent(getParent(self))));
    },
    get topMenuIndex() {
      return getParent(self.topMenuData).indexOf(self.topMenuData);
    }
  }))
  .actions(self => ({
    setExpanded(isExpanded) {
      self.expanded = isExpanded;
    }
  }));

const SiderStore = types
  .model('SiderStore', {
    isOpen: types.boolean,
    current: types.string,
    menuData: types.optional(types.array(MenuItem), [])
  })
  .views(self => ({
    get root() {
      return getEnv(self).root || getParent(self);
    },

    get currentMenuData() {
      return self.menuData.length ? self.menuData[self.root.header.current].children : [];
    }
  }))
  .volatile(self => ({
    history: null
  }))
  .actions(self => ({
    setMenu(isOpen) {
      self.isOpen = isOpen;
    },

    setCurrent(index) {
      self.current = index;
    },

    setMenuData(menuData) {
      self.menuData = menuData;
    },

    setHistory(v) {
      self.history = v;
    },

    setMenuDataByIndex(isExpanded, index) {
      self.currentMenuData.forEach(function(item) {
        item.setExpanded(false);
      });
      self.currentMenuData.find(item => item.index == index).setExpanded(isExpanded);
    },

    getCurrentMenuItem(pageName) {
      let ret;
      self.menuData &&
        self.menuData.forEach(menuItem => {
          menuItem.children &&
            menuItem.children.forEach(menuItem => {
              menuItem.children &&
                menuItem.children.forEach(menuItem => {
                  if (menuItem.index.toLowerCase() === pageName) {
                    ret = menuItem;
                  }
                });
            });
        });

      return ret;
    },

    setCurrentMenu() {
      let href = self.history.location.pathname.substr(1);
      href = href.indexOf('/') >= 0 ? href.split('/')[0] : href;

      //初始化一级菜单
      let menu0 = self.menuData[0];
      if (href.trim() !== '') {
        const currentMenuItem = self.getCurrentMenuItem(href.toLowerCase());
        self.root.header.setCurrent(currentMenuItem ? currentMenuItem.topMenuIndex : 0);
      } else if (menu0) {
        self.root.header.setCurrent(0);
      }

      const menu = self.currentMenuData;
      const children = menu.map(function(item) {
        return item.children;
      });
      const nameArray = children.map(function(item) {
        return item.map(function(item) {
          return item.index;
        });
      });
      let index = 0;
      for (let i = 0; i < nameArray.length; i++) {
        for (let j = 0; j < nameArray[i].length; j++) {
          if (nameArray[i][j].toLowerCase() == href.toLowerCase()) {
            index = i;
            break;
          }
        }
        if (index !== 0) {
          break;
        }
      }

      if (href.trim() === '') {
        if (menu0) {
          self.setCurrent(menu0.children[0].children[0].index);
          window.location.hash = '/' + self.current;
          self.setMenuDataByIndex(true, menu0.children[0].index);
        }
      } else {
        self.setCurrent(href);
        self.setMenuDataByIndex(true, menu[index].index);
      }
    }
  }));

export default SiderStore;
