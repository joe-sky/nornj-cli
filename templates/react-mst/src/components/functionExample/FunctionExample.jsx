import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { useLocalStore } from 'mobx-react-lite';
import { Input } from 'nornj-react/antd';
import styled from 'styled-components';

const Containter = styled.div`
  height: 30px;
  line-height: 30px;
  color: #fc1e1e;
`;

const FunctionExample = props => {
  const view = useLocalStore(() => ({
    inputValue: '',
    textValue: 'FunctionExample',
    editing: false
  }));

  const inputRef = useRef();

  const onClick = () => {
    if (view.editing) {
      return;
    }

    view.editing = true;
    view.inputValue = view.textValue;

    setTimeout(() => {
      inputRef.current.input.select();
    }, 50);
  };

  const onBlur = () => {
    view.textValue = view.inputValue;
    view.editing = false;
  };

  return (
    <Containter onClick={onClick}>
      <If condition={view.editing}>
        <Input n-mobxBind={view.inputValue} onBlur={onBlur} ref={inputRef} />
        <Else>{view.textValue}</Else>
      </If>
    </Containter>
  );
};

export default inject('store')(observer(FunctionExample));
