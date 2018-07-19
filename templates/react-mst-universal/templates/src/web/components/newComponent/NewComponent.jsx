import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './#{componentName | pascal}#.m.scss';
import { Input } from 'antd';

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

    setTimeout(() => {
      this.refs.input.refs.input.select();
    }, 50);
  }

  @autobind
  onBlur() {
    this.textValue = this.inputValue;
    this.editing = false;
  }

  render() {
    return (
      <div class={styles.#{componentName}#} onClick={this.onClick}>
        <if condition={this.editing}>
          <Input value={this.inputValue} onChange={this.onChange} onBlur={this.onBlur} ref="input" />
          <else>{this.textValue}</else>
        </if>
      </div>
    );
  }
}
