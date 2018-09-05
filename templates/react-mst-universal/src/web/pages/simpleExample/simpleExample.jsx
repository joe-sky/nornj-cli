import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj, {
  expression as n
} from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';

// 页面容器组件
@registerTmpl('SimpleExample')
@inject('store')
@observer
export default class SimpleExample extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { store: { simpleExample } } = this.props;

    return (
      <div className="simpleExample">
        <style jsx>{`
          .simpleExample {
            padding: 100px 40px 40px;
            background-color: #fff;
          }

          h2 {
            margin-bottom: 25px;
            font-size: 16px;
          }
        `}</style>
        <h2>示例页面 simpleExample</h2>
        {/*hello code!*/}
      </div>
    );
  }
}
