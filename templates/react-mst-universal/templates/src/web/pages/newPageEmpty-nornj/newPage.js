import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import {
  Radio,
  Button,
  Cascader,
  DatePicker,
  Checkbox,
  Message,
  Notification
} from 'flarej/antd';
import styles from './#{pageName}#.m.scss';
import tmpls from './#{pageName}#.t.html';

// 页面容器组件
@registerTmpl('#{pageName | pascal}#')
@inject('store')
@observer
export default class #{pageName | pascal}# extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { store: { #{pageName}# } } = this.props;
    return tmpls.container({
      styles,
      #{pageName}#
    }, this.state, this.props, this);
  }
}
