import * as React from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './#{componentName | pascal}#.m.scss';
import tmpls from './#{componentName | pascal}#.t.html';
import 'flarej/lib/components/antd/input';

@registerTmpl('#{componentName | pascal}#')
@inject('store')
@observer
export default class #{componentName | pascal}# extends Component {
  constructor(props) {
    super(props);
  }

  @observable inputValue = '';
  @observable textValue = '';
  @observable editing = false;

  @autobind
  onChange(e) {
    this.inputValue = e.target.value;
  }

  @autobind
  onClick() {
    if (this.editing) {
      return;
    }

    this.editing = true;
    this.inputValue = this.textValue;
  }

  @autobind
  onBlur() {
    this.textValue = this.inputValue;
    this.editing = false;
  }

  render() {
    return tmpls.#{componentName}#(this.props, this, { styles });
  }
}
