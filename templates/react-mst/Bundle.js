import { Component } from 'react'

class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // short for "module" but that's a keyword in js, so "mod"
      mod: null
    }
  }

  componentWillMount() {
    const { store, isPc, loadBundles } = this.props;
    if (store && !store.common.userInfo) { //获取用户登录信息
      const fetchs = [store.common.getCurrentUserInfo()];
      if (isPc) {
        store.sider.setCurrentMenu();
      }
      Promise.all(fetchs).then(() => {
        if (isPc) {
          this.load({ load: loadBundles[`load${store.sider.current}`] });
        } else {
          this.load(this.props);
        }
      });
    } else {
      if (isPc) {
        store.sider.setCurrentMenu();
      }
      this.load(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null
    })
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

export default Bundle;