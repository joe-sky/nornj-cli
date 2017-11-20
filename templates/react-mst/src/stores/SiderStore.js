import { types, getParent } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../utils/notification';

const MenuItem = types.model("MenuItem", {
  get topMenuData() {
    return getParent(getParent(getParent(getParent(this))));
  },
  get topMenuIndex() {
    return getParent(this.topMenuData).indexOf(this.topMenuData);
  },
  type: types.string,
  link: types.optional(types.string, ''),
  index: types.string,
  name: types.string,
  expanded: types.optional(types.boolean, false),
  children: types.optional(types.union(types.array(types.late(() => MenuItem)), types.literal(null)), []),
  level: types.maybe(types.number)
}, {
  afterCreate() {
    if (this.level === 3) {
      const siderStore = getParent(getParent(this.topMenuData));
      if (!siderStore.mapLevel3) {
        siderStore.mapLevel3 = {}; //创建三级菜单map以便于查找
      }
      siderStore.mapLevel3[this.link.toLowerCase()] = this;
    }
  },
  setExpanded(isExpanded) {
    this.expanded = isExpanded
  }
})

const SiderStore = types.model("SiderStore", {
  get root() {
    return getParent(this);
  },
  get currentMenuData() {
    return this.menuData.length ? this.menuData[this.root.header.current].children : [];
  },
  isOpen: types.boolean,
  current: types.string,
  menuData: types.optional(types.array(MenuItem), [])
}, {
  setMenu(isOpen) {
    this.isOpen = isOpen
  },
  setCurrent(index) {
    this.current = index
  },
  setMenuData(menuData) {
    this.menuData = menuData
  },
  setMenuDataByIndex(isExpanded, index) {
    this.currentMenuData.forEach(function(item) {
      item.setExpanded(false);
    })
    this.currentMenuData.find((item) => item.index == index).setExpanded(isExpanded);
  },

  setCurrentMenu() {
    let href = window.location.href;
    href = href.substring(href.lastIndexOf("\/") + 1, href.length);

    //初始化一级菜单
    let menu0 = this.menuData[0];
    if (href.trim() !== '') {
      this.root.header.setCurrent(this.mapLevel3['/' + href.toLowerCase()].topMenuIndex);
    } else if (menu0) {
      this.root.header.setCurrent(0);
    }
    
    const menu = this.currentMenuData;
    const children = menu.map(function(item) {
      return item.children
    })
    const nameArray = children.map(function(item) {
      return item.map(function(item) {
        return item.index
      })
    })
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
        this.setCurrent(menu0.children[0].children[0].index);
        window.location.hash = '/' + this.current;
        this.setMenuDataByIndex(true, menu0.children[0].index);
      }
    } else {
      this.setCurrent(href);
      this.setMenuDataByIndex(true, menu[index].index);
    }
  }
})

export default SiderStore;