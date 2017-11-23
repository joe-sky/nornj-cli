import { Component, PropTypes } from 'react';
import { toJS, transaction } from 'mobx';
import { observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import 'flarej/lib/components/antd/icon';
import 'flarej/lib/components/antd/menu';
import styles from './sider.m.less';
import template from './sider.t.html';

@observer
@registerTmpl('vicb-Sider')
export default class Sider extends Component {
  componentDidMount() {
    // const { store, onInitializeComplete } = this.props;

    // store.getBrandList().then(() => {
    //   onInitializeComplete && onInitializeComplete(store.brandSelected);
    // });
  }

  render() {
    return template({ styles });
  }
}