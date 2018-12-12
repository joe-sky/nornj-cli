import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './#{componentName | pascal}#.m.scss';
import tmpls from './#{componentName | pascal}#.t.html';
import { Input } from 'flarej/antd';

@registerTmpl('#{componentName | pascal}#')
@inject('store')
@observer
export default class #{componentName | pascal}# extends Component {
  constructor(props) {
    super(props);
  }

  @observable inputValue = '';
  @observable textValue = '#{componentName | pascal}#';
  @observable editing = false;

  @autobind
  onClick() {
    if (this.editing) {
      return;
    }

    this.editing = true;
    this.inputValue = this.textValue;

    setTimeout(() => {
      this.refs.input.input.select();
    }, 50);
  }

  @autobind
  onBlur() {
    this.textValue = this.inputValue;
    this.editing = false;
  }

  render() {
    return tmpls.#{componentName}#({ styles }, this.props, this);
  }
}
