import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import { Link } from 'react-router-dom';
import { NavBar, Icon } from 'antd-mobile';

@inject('store')
@registerTmpl('Header')
@observer
export default class Header extends Component {
  static defaultProps = {
    current: 1
  };

  @autobind
  navChanged(event) {
    this.props.store.header.setCurrent(parseInt(event.currentTarget.getAttribute('data-index'), 10));
    this.props.history.push(`/page${this.props.store.header.current}`);
  }

  @autobind
  onBack() {
    this.props.history.goBack();
  }

  render() {
    const { store } = this.props;

    return (
      <div className="ccAppNavigationBar">
        <style jsx>{`
          @import '../../css/config';

          .ccAppNavigationBar {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            z-index: $headerZIndex;
          }
        `}</style>
        <NavBar icon={<Icon type="left" />} onLeftClick={this.onBack}>
          {store.header.title}
        </NavBar>
      </div>
    );
  }
}
