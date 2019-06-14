import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Input } from 'nornj-react/antd';
import styled from 'styled-components';

const Containter = styled.div`
  height: 30px;
  line-height: 30px;
  color: #fc1e1e;
`;

@inject('store')
@observer
export default class ClassExample extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  @observable inputValue = '';
  @observable textValue = 'ClassExample';
  @observable editing = false;

  onClick = () => {
    if (this.editing) {
      return;
    }

    this.editing = true;
    this.inputValue = this.textValue;

    setTimeout(() => {
      this.inputRef.current.input.select();
    }, 50);
  };

  onBlur = () => {
    this.textValue = this.inputValue;
    this.editing = false;
  };

  render() {
    return (
      <Containter onClick={this.onClick}>
        <If condition={this.editing}>
          <Input n-mobxBind={this.inputValue} onBlur={this.onBlur} ref={this.inputRef} />
          <Else>{this.textValue}</Else>
        </If>
      </Containter>
    );
  }
}
