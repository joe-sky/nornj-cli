import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import nj from 'nornj';

export default function(name, ComposedComponent, store) {
  @observer
  @registerTmpl(name)
  class Container extends Component {
    componentDidMount() {
      //删除加载loading层
      $('#fjb_loading_main').remove();
      $('#fjb_loading-mask_main').fadeOut(200, function() {
        $(this).remove();
      });
    }

    render() {
      return nj `
        <mobx-Provider store=${store}>
          <${ComposedComponent} ref=${c => this.component = c} ...${this.props} />
        </mobx-Provider>
      ` ();
    }
  }

  return Container;
}