import React, { Component, PropTypes } from 'react';
import { observable, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export default class Header extends Component {
  logoutUrl = `${__HOST}/common/logout`;

  navChanged = index => {
    return e => {
      this.props.store.header.setCurrent(index);
      this.props.history.push('/' + n`${this}.props.store.sider.menuData[${index}].children[0].children[0].index`);
    };
  };

  render() {
    const { store, logoutUrl } = this.props;

    return (
      <header className={`site-header${store.sider.isOpen ? ' isMenuOpen' : ''}`}>
        <style jsx>{`
          .site-header {
            font-size: 16px;
            background: #fff;
            height: 79px;
            border-bottom: 1px solid #ebebeb;
            position: fixed;
            width: 100%;
            z-index: 100;
            transition: all 0.5s ease-out;
            box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);

            ul {
              padding-left: 80px;
              transition: all 0.5s ease-out;
            }

            &.isMenuOpen > ul {
              padding-left: 0;
            }

            li {
              float: left;
              text-align: center;
              line-height: 80px;
              margin-left: 60px;
              position: relative;
              height: 79px;
              overflow: hidden;
              cursor: pointer;

              a {
                color: #b7becc;
                display: inline-block;
                height: 79px;
              }

              &:after {
                content: '';
                width: 100%;
                height: 2px;
                background: #3bbabb;
                position: absolute;
                bottom: -2px;
                left: 0;
                transition: all 0.5s;
              }

              .site-nav {
                float: left;
              }
            }

            li.cur {
              color: #333;

              &:after {
                bottom: 0;
              }
            }

            .login-wrap {
              float: right;
              padding: 0 18px 0 0;

              a.link {
                font-size: 14px;
                color: #777792;
                margin: 0 30px;
                &.cur {
                  color: #35a5a6;
                }
              }

              span {
                color: #ebebeb;
                font-size: 12px;
              }

              .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-position: center center;
                background-repeat: no-repeat;
                display: inline-block;

                img {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                }
              }
            }
          }
        `}</style>
        <ul className="site-nav">
          <Each of={store.sider.menuData}>
            <li key={index} className={store.header.current == index ? 'cur' : ''} onClick={this.navChanged(index)}>
              {item.name}
            </li>
          </Each>
        </ul>
        <div className="login-wrap middle">
          <a className="link">{n`${store}.common.userInfo.pin`}</a>
          <a className="avatar">
            <img src={require('../../assets/images/pic-header.png')} alt={''} />
          </a>
          <a className="link" href={logoutUrl}>
            注销
          </a>
        </div>
      </header>
    );
  }
}
