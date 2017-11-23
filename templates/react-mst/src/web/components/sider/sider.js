import * as React from 'react'
import { Component, PropTypes } from 'react';
import { toJS, transaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import './sider.scss';
import tmpls from './sider.t.html';
import { slide as Menu } from 'react-burger-menu';
import 'flarej/lib/components/antd/icon';

@inject('store')
@observer
export default class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.store.sider.setMenu(true);
  }

  @autobind
  selectMenu(index) {
    return e => {
      this.props.store.sider.setCurrent(index);
    }
  }

  @autobind
  toggleMenu(item) {
    return e => {
      this.props.store.sider.setMenuDataByIndex(!item.expanded, item.index)
    };
  }

  @autobind
  isMenuOpen(state) {
    this.props.store.sider.setMenu(state.isOpen)
  }

  render() {
    const generateMenu = items => {
      return items.map(item => {
        return tmpls.menuCnt(this.props, this, { item, generateMenu });
      });
    }

    const menuCnt = generateMenu(this.props.store.sider.currentMenuData)
    return tmpls.menu({
      menuCnt,
      components: {
        'burger-Menu': Menu
      }
    }, this.props, this);
  }
}