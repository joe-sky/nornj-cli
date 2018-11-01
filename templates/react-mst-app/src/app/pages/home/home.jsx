import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import { registerTmpl } from 'nornj-react';
import { WhiteSpace, Card, Flex } from 'antd-mobile';
import FuncIcon from '../../components/funcIcon';
import { FUNCS } from '../../../../routes-app';

@registerTmpl('Home')
@inject('store')
@observer
export default class Home extends Component {
  @observable
  menu = [];

  @observable
  isApp = false;

  constructor(props) {
    super(props);

    props.store.header.setPageTitle(props.moduleName);
    this.menu = FUNCS;
  }

  componentDidMount() {}

  @autobind
  logOut() {}

  @autobind
  backToStartPage() {
    // console.log('backToStartPage')
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os';
    var bIsAndroid = sUserAgent.match(/android/i) == 'android';
    if (bIsIphoneOs) {
      // console.log('bIsIphoneOs')
      window.location.href = 'objc://' + escape('backToStartPage' + ':/');
    } else if (bIsAndroid) {
      window.location.href = 'andr://' + escape('backToStartPage' + ':/');
    }
  }

  render() {
    return (
      <div className="homeWrap">
        <style jsx>{`
          @import '../../css/config';

          .homeWrap {
            position: absolute;
            width: 100%;
            z-index: $headerZIndex + 1;
            margin-top: -$headerHeight;
          }

          .homeImg {
            & > img {
              display: block;
            }

            background-color: rgb(36, 190, 218);
          }

          .logos {
            padding: 0.1rem;
            line-height: 0.38rem;
            vertical-align: middle;
            background: #fff;

            & > img {
              vertical-align: middle;
            }
          }

          .quit {
            font-size: 14px;
            position: absolute;
            right: 10px;
            top: 10px;
            z-index: 9999;
            color: #fff;
            width: 50px;
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
        `}</style>
        <style jsx global>{`
          .homeWrap {
            .iconWrap {
              padding: 0.2rem 0;
            }
          }
        `}</style>
        <div className="homeImg">
          <if condition={this.isApp}>
            <a onClick={this.backToStartPage} className="quit">
              退出
            </a>
            <else>
              <a onClick={this.logOut} className="quit">
                注销
              </a>
            </else>
          </if>
          <img src={require('../../images/bg-map.png')} width="100%" />
        </div>
        <each of={this.menu} item="menu">
          <WhiteSpace size="sm" />
          <if condition={menu.modules.length > 0}>
            <Card full>
              <Card.Header title={menu.title} />
              <Card.Body>
                <each of={menu.modules} item="row">
                  <if condition={index != 0}>
                    <WhiteSpace size="md" />
                  </if>
                  <Flex key={`icon_row_${index}`}>
                    <each of={row}>
                      <Flex.Item key={item.key} className="iconWrap">
                        <FuncIcon info={item} history={this.props.history} />
                      </Flex.Item>
                    </each>
                  </Flex>
                </each>
              </Card.Body>
            </Card>
          </if>
        </each>
      </div>
    );
  }
}
