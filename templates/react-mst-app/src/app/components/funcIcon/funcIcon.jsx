import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styled from 'styled-components';

const Containter = styled.div`
  .funcIcon {
    & > .ico {
      text-align: center;

      & > img {
        max-width: 60%;
      }
    }
    & > .ttl {
      font-size: 0.86em;
      text-align: center;
    }

    &:active {
      transform: scale(1.1);
      transition: all 0.2s;
    }
  }

  .funcIconDisabled {
    opacity: 0.2;
  }
`;

@registerTmpl('funcIcon')
@inject('store')
@observer
export default class FuncIcon extends Component {
  @autobind
  onClick() {
    const { info } = this.props;
    if (info && info.path && !info.disabled) {
      this.props.history.push(info.path);
    }
  }

  render() {
    const { info } = this.props;

    return (
      <Containter>
        <if condition={info.disabled}>
          <div className="funcIcon funcIconDisabled" onClick={this.onClick}>
            <div className="ico">
              <img src={info.icon} />
            </div>
            <div className="ttl">{info.title}</div>
          </div>
          <else>
            <div className="funcIcon" onClick={this.onClick}>
              <div className="ico">
                <img src={info.icon} />
              </div>
              <div className="ttl">{info.title}</div>
            </div>
          </else>
        </if>
      </Containter>
    );
  }
}
