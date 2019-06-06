import { Component } from 'react';

class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // short for "module" but that's a keyword in js, so "mod"
      mod: null
    };
  }

  async componentWillMount() {
    const { store, loadBundles } = this.props;
    store.sider.setCurrentMenu();

    if (store && !store.common.userInfo) {
      await store.common.getCurrentUserInfo(); //获取用户登录信息
      const current = n`${store}.sider.current | capitalize`;
      this.load({
        load: loadBundles[`load${current.indexOf('/') >= 0 ? current.split('/')[0] : current}`]
      });
    } else {
      this.load(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      mod: null
    });
    props.load(mod => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      });
    });
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}

export default Bundle;
