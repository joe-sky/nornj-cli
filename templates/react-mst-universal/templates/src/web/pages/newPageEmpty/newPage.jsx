import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';

// 页面容器组件
@registerTmpl('#{pageName | capitalize}#')
@inject('store')
@observer
export default class #{pageName | capitalize}# extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { store: { #{pageName}# } } = this.props;

    return (
      <div className="#{pageName}#">
        <style jsx>{`
          .#{pageName}# {
            padding: 100px 40px 40px;
            background-color: #fff;
          }

          h2 {
            margin-bottom: 25px;
            font-size: 16px;
          }
        `}</style>
        <h2>示例页面 #{pageName}#</h2>
        {/*hello code!*/}
      </div>
    );
  }
}
