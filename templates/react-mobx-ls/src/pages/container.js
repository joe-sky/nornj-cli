import React, { Component } from 'react';
import { observer } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import '../common/containerConfig';
import 'vic-common/lib/components/antd/button';
import { autobind } from 'core-decorators';

//页面容器组件
@observer
@registerTmpl('Container')
class Container extends Component {
  componentDidMount() {
    //删除加载loading层
    $('#vic_loading_main').remove();
    $('#vic_loading-mask_main').fadeOut(200, function(){
      $(this).remove();
    });
  }

  @autobind
  goPage1() {
    location.href = '/page1';
  }

  @autobind
  goPage2() {
    location.href = '/page2';
  }

  render() {
    return nj`
      <div style="width: 100px;">
        <style>
          button.ant-btn {@lb}
            margin: 10px 0 0 10px;
          {@rb}
        </style>
        #${this.props.tmpls[0]}
      </div>
    `(this);
  }
}

if (module.hot) {
  module.hot.accept();
  njr.renderTmplTag({ target: '#container' });
}