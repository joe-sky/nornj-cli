import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Containter = styled.div`
  padding: 100px 40px 40px;
  background-color: #fff;

  h2 {
    margin-bottom: 25px;
    font-size: 16px;
  }
`;

@inject('store')
@observer
export default class EmptyExample extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { store: { emptyExample } } = this.props;

    return (
      <Containter>
        <h2>示例页面 emptyExample</h2>
        {/*hello code!*/}
      </Containter>
    );
  }
}
